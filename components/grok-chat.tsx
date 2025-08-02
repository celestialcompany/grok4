"use client"

import type React from "react"
// Helper for browser-native SpeechRecognition
// (Chrome ships it as webkitSpeechRecognition)
const SpeechRecognition =
  typeof window !== "undefined"
    ? window.SpeechRecognition ||
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore – webkit prefix for older Chrome versions
      window.webkitSpeechRecognition
    : undefined
type SpeechRecognitionType = InstanceType<typeof SpeechRecognition> | null

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import remarkGfm from "remark-gfm"
import {
  Send,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Mic,
  LogOut,
  Settings,
  Key,
  Zap,
  Sparkles,
  ChevronDown,
  X,
  ImageIcon,
} from "lucide-react"
import { toast } from "sonner"
import { auth } from "@/lib/firebase"
import { signOut, type User } from "firebase/auth"
import { useLanguage } from "@/contexts/language-context"
import LanguageSwitcher from "@/components/language-switcher"

interface GrokChatProps {
  user: User
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string | MessagePart[]
}

interface MessagePart {
  type: "text" | "image"
  text?: string
  image?: string
}

export default function GrokChat({ user }: GrokChatProps) {
  const { t } = useLanguage()
  const { language } = useLanguage()
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const recognitionRef = useRef<SpeechRecognitionType>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null)
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null)

  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Load messages from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedMessages = localStorage.getItem("chat_history")
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages))
        }
      } catch (error) {
        console.error("Failed to parse chat history from localStorage:", error)
      }
    }
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      localStorage.setItem("chat_history", JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true

      recognition.onstart = () => {
        setIsListening(true)
        toast.info(t("listening"))
      }

      recognition.onresult = (event) => {
        let interimTranscript = ""
        let finalTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }
        setInput(input + finalTranscript + interimTranscript)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
        toast.error(`${t("voiceInputError")}: ${event.error}`)
      }

      recognitionRef.current = recognition
    }
  }, [language, input, t])

  const toggleVoiceInput = useCallback(() => {
    if (!SpeechRecognition) {
      toast.error(t("browserNotSupported"))
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.lang = language === "ru" ? "ru-RU" : "en-US"
        recognitionRef.current.start()
      }
    }
  }, [isListening, language, t])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(t("copied"))
    } catch (err) {
      toast.error(t("failedToCopy"))
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast.success(t("signedOut"))
    } catch (error) {
      toast.error(t("signOutError"))
    }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const displayName = user.displayName || user.email?.split("@")[0] || "Пользователь"

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImagePreview(reader.result as string)
        setSelectedImageBase64(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearSelectedImage = () => {
    setSelectedImagePreview(null)
    setSelectedImageBase64(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsLoading(false)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !selectedImageBase64) {
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: [],
    }

    if (input.trim()) {
      ;(userMessage.content as MessagePart[]).push({ type: "text", text: input.trim() })
    }
    if (selectedImageBase64) {
      ;(userMessage.content as MessagePart[]).push({ type: "image", image: selectedImageBase64 })
    }

    // If content is an array with only one text part, simplify it to a string
    if (
      Array.isArray(userMessage.content) &&
      userMessage.content.length === 1 &&
      userMessage.content[0].type === "text"
    ) {
      userMessage.content = userMessage.content[0].text!
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    clearSelectedImage()
    setIsLoading(true)

    // Create abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          language: language,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("No response body")
      }

      let assistantMessage = ""
      const assistantMessageObj: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      }

      setMessages((prev) => [...prev, assistantMessageObj])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") {
              break
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.choices?.[0]?.delta?.content) {
                assistantMessage += parsed.choices[0].delta.content
                setMessages((prev) =>
                  prev.map((msg) => (msg.id === assistantMessageObj.id ? { ...msg, content: assistantMessage } : msg)),
                )
              }
            } catch (e) {
              // Ignore parsing errors for individual chunks
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Request was aborted")
        // Remove the incomplete assistant message
        setMessages((prev) => prev.filter((msg) => msg.role !== "assistant" || msg.content !== ""))
      } else {
        console.error("Error:", error)
        toast.error("Failed to get response")
        // Remove the user message if there was an error
        setMessages((prev) => prev.slice(0, -1))
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const renderMessageContent = (content: string | MessagePart[]) => {
    if (typeof content === "string") {
      return (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "")

              if (match && match[1] === "thinking") {
                return (
                  <details className="my-4 border border-blue-500/30 rounded-lg bg-gradient-to-r from-blue-900/10 to-purple-900/10">
                    <summary className="px-4 py-2 cursor-pointer text-blue-400 font-medium border-b border-blue-500/30 hover:bg-blue-900/20 transition-colors flex items-center gap-2">
                      🧠 Grok 4 Thinking
                      <span className="text-xs text-gray-400">(click to view reasoning)</span>
                    </summary>
                    <div className="px-4 py-3 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                      {String(children).replace(/\n$/, "")}
                    </div>
                  </details>
                )
              }

              return !inline && match ? (
                <div className="relative group/code">
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-lg my-3 text-sm"
                    customStyle={{
                      background: "#1a1a1a",
                      border: "1px solid #374151",
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                    showLineNumbers={false}
                    wrapLines={false}
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                  <Button
                    onClick={() => copyToClipboard(String(children))}
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <code className="bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono text-orange-300" {...props}>
                  {children}
                </code>
              )
            },
            h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-white">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-3 text-white">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-bold mt-4 mb-2 text-white">{children}</h3>,
            p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 ml-4">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-4">{children}</ol>,
            li: ({ children }) => <li className="text-gray-100">{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 pl-4 my-3 italic text-gray-300 bg-gray-800/30 py-2 rounded-r">
                {children}
              </blockquote>
            ),
            a: ({ children, href }) => (
              <a
                href={href}
                className="text-blue-400 hover:text-blue-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
            em: ({ children }) => <em className="italic text-gray-200">{children}</em>,
          }}
        >
          {content}
        </ReactMarkdown>
      )
    } else if (Array.isArray(content)) {
      return (
        <div className="flex flex-col gap-2">
          {content.map((part, index) => {
            if (part.type === "text") {
              return (
                <ReactMarkdown
                  key={index}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "")

                      if (match && match[1] === "thinking") {
                        return (
                          <details className="my-4 border border-blue-500/30 rounded-lg bg-gradient-to-r from-blue-900/10 to-purple-900/10">
                            <summary className="px-4 py-2 cursor-pointer text-blue-400 font-medium border-b border-blue-500/30 hover:bg-blue-900/20 transition-colors flex items-center gap-2">
                              🧠 Grok 4 Thinking
                              <span className="text-xs text-gray-400">(click to view reasoning)</span>
                            </summary>
                            <div className="px-4 py-3 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                              {String(children).replace(/\n$/, "")}
                            </div>
                          </details>
                        )
                      }

                      return !inline && match ? (
                        <div className="relative group/code">
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg my-3 text-sm"
                            customStyle={{
                              background: "#1a1a1a",
                              border: "1px solid #374151",
                              fontSize: "14px",
                              lineHeight: "1.5",
                            }}
                            showLineNumbers={false}
                            wrapLines={false}
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                          <Button
                            onClick={() => copyToClipboard(String(children))}
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <code
                          className="bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono text-orange-300"
                          {...props}
                        >
                          {children}
                        </code>
                      )
                    },
                    h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-white">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-3 text-white">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-bold mt-4 mb-2 text-white">{children}</h3>,
                    p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 ml-4">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-4">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-100">{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 my-3 italic text-gray-300 bg-gray-800/30 py-2 rounded-r">
                        {children}
                      </blockquote>
                    ),
                    a: ({ children, href }) => (
                      <a
                        href={href}
                        className="text-blue-400 hover:text-blue-300 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                    em: ({ children }) => <em className="italic text-gray-200">{children}</em>,
                  }}
                >
                  {part.text || ""}
                </ReactMarkdown>
              )
            } else if (part.type === "image") {
              return (
                <div key={index} className="my-2">
                  <img
                    src={part.image || "/placeholder.svg"}
                    alt="User uploaded image"
                    className="max-w-full h-auto rounded-lg border border-gray-700"
                  />
                </div>
              )
            }
            return null
          })}
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-[#212121] text-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-[#212121]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Zap className="h-5 w-5 text-blue-400" />
              <Sparkles className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-lg font-medium">{t("grok")} 4</h1>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={() => window.open("/dashboard", "_blank")}
          >
            <Key className="h-4 w-4 mr-2" />
            API
          </Button>
          <LanguageSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8 bg-purple-600">
                  <AvatarFallback className="bg-purple-600 text-white text-sm">
                    {getUserInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
              <div className="px-2 py-1.5 text-sm text-gray-300">
                <div className="font-medium text-white">{displayName}</div>
                <div className="text-xs text-gray-400">{user.email}</div>
              </div>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 hover:text-white">
                <Settings className="mr-2 h-4 w-4" />
                {t("settings")}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 hover:text-white" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                {t("signOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full pt-[60px] pb-[120px]">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="relative">
                    <Zap className="h-16 w-16 text-blue-400" />
                    <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-white">Grok 4</h2>
                  </div>
                </div>
                <h3 className="text-xl font-medium text-gray-300">
                  {t("helloUser", { name: displayName.split(" ")[0] })}
                </h3>
                <p className="text-gray-400">{t("howCanIHelp")}</p>
              </div>
            </div>
          ) : (
            <div className="py-8 space-y-8">
              {messages.map((message) => (
                <div key={message.id} className="group">
                  <div className="flex gap-4 mb-4">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className={message.role === "user" ? "bg-purple-600" : "bg-blue-600"}>
                        {message.role === "user" ? (
                          <span className="text-white text-sm">{getUserInitials(displayName)}</span>
                        ) : (
                          <div className="relative">
                            <Zap className="h-4 w-4 text-white" />
                            <Sparkles className="h-2 w-2 text-yellow-300 absolute -top-0.5 -right-0.5" />
                          </div>
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="font-medium text-sm text-gray-300">
                        {message.role === "user" ? t("you") : `${t("grok")} 4`}
                      </div>
                      <div className="text-gray-100 leading-relaxed">{renderMessageContent(message.content)}</div>
                    </div>
                  </div>

                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 ml-12 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                        onClick={() =>
                          copyToClipboard(
                            typeof message.content === "string"
                              ? message.content
                              : message.content.map((part) => (part.type === "text" ? part.text : "")).join(" "),
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                        onClick={() => toast.success(t("feedbackLiked"))}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                        onClick={() => toast.info(t("feedbackDisliked"))}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="group">
                  <div className="flex gap-4 mb-4">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-blue-600">
                        <div className="relative">
                          <Zap className="h-4 w-4 text-white animate-pulse" />
                          <Sparkles className="h-2 w-2 text-yellow-300 absolute -top-0.5 -right-0.5 animate-ping" />
                        </div>
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm text-gray-300">{t("grok")} 4</div>
                        <Button
                          onClick={stopGeneration}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-400 hover:bg-gray-700"
                          title={t("stopGeneration")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-xs">{t("generating")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t border-gray-700 bg-[#212121]">
        <div className="max-w-4xl mx-auto">
          {selectedImagePreview && (
            <div className="relative mb-4 w-32 h-32 rounded-lg overflow-hidden border border-gray-600">
              <img
                src={selectedImagePreview || "/placeholder.svg"}
                alt="Selected preview"
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0 bg-black/50 text-white hover:bg-black/70"
                onClick={clearSelectedImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <form onSubmit={handleFormSubmit} className="relative">
            <div className="relative flex items-center bg-[#2f2f2f] rounded-xl border border-gray-600 focus-within:border-gray-500">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? t("listening") : t("askSomething")}
                disabled={isLoading || isListening}
                className="flex-1 bg-transparent border-0 pl-4 pr-20 py-4 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              />

              <div className="absolute right-3 flex items-center gap-2">
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isListening}
                  size="sm"
                  className="h-8 w-8 p-0 bg-transparent text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Upload Image"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  onClick={toggleVoiceInput}
                  disabled={isLoading || !SpeechRecognition}
                  size="sm"
                  className={`h-8 w-8 p-0 ${isListening ? "bg-red-600 animate-pulse" : "bg-transparent"} text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Mic className="h-4 w-4" />
                </Button>

                {isLoading ? (
                  <Button
                    type="button"
                    onClick={stopGeneration}
                    size="sm"
                    className="h-8 w-8 p-0 bg-red-600 text-white hover:bg-red-700"
                    title={t("stopGeneration")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!input.trim() && !selectedImageBase64}
                    size="sm"
                    className="h-8 w-8 p-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:bg-gray-600 disabled:text-gray-400"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </form>

          <div className="flex items-center justify-end mt-3">
            <p className="text-xs text-gray-400">
              {t("disclaimer")} • {t("poweredByStackWayAI")}{" "}
              <a
                href="https://ai.stackway.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                ai.stackway.tech
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
