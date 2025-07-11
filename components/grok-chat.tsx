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

import { useChat } from "ai/react"
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
  RotateCcw,
  Share,
  Mic,
  LogOut,
  Settings,
  Key,
  Zap,
  Sparkles,
  ChevronDown,
  MoreHorizontal,
  X,
} from "lucide-react"
import { useRef, useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { auth } from "@/lib/firebase"
import { signOut, type User } from "firebase/auth"
import { useLanguage } from "@/contexts/language-context"
import LanguageSwitcher from "@/components/language-switcher"

interface GrokChatProps {
  user: User
}

export default function GrokChat({ user }: GrokChatProps) {
  const { t } = useLanguage()
  const { language } = useLanguage()
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionType>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, setInput } = useChat({
    body: {
      language: language,
    },
    onFinish: () => {
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop()
        setIsListening(false)
      }
    },
    onError: () => {
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop()
        setIsListening(false)
      }
    },
  })

  const scrollAreaRef = useRef<HTMLDivElement>(null)

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
  }, [language, input, setInput, isLoading, t])

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleSubmit(e)
    }
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
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
            <Share className="h-4 w-4 mr-2" />
            {t("share")}
          </Button>
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
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
            <MoreHorizontal className="h-4 w-4" />
          </Button>

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
        {" "}
        {/* Adjusted padding */}
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
              {" "}
              {/* Added back vertical padding for messages */}
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
                      <div className="text-gray-100 leading-relaxed">
                        {message.role === "assistant" ? (
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
                                  <code
                                    className="bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono text-orange-300"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                )
                              },
                              h1: ({ children }) => (
                                <h1 className="text-2xl font-bold mt-6 mb-4 text-white">{children}</h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-xl font-bold mt-5 mb-3 text-white">{children}</h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-lg font-bold mt-4 mb-2 text-white">{children}</h3>
                              ),
                              p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
                              ul: ({ children }) => (
                                <ul className="list-disc list-inside mb-3 space-y-1 ml-4">{children}</ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="list-decimal list-inside mb-3 space-y-1 ml-4">{children}</ol>
                              ),
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
                            {message.content}
                          </ReactMarkdown>
                        ) : (
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 ml-12 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                        onClick={() => copyToClipboard(message.content)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <RotateCcw className="h-4 w-4" />
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
                          onClick={stop}
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
          <form onSubmit={handleFormSubmit} className="relative">
            <div className="relative flex items-center bg-[#2f2f2f] rounded-xl border border-gray-600 focus-within:border-gray-500">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder={isListening ? t("listening") : t("askSomething")}
                disabled={isLoading || isListening}
                className="flex-1 bg-transparent border-0 pl-4 pr-20 py-4 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              />

              <div className="absolute right-3 flex items-center gap-2">
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
                    onClick={stop}
                    size="sm"
                    className="h-8 w-8 p-0 bg-red-600 text-white hover:bg-red-700"
                    title={t("stopGeneration")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!input.trim()}
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
            <p className="text-xs text-gray-400">{t("disclaimer")} • Powered by Grok 4</p>
          </div>
        </div>
      </div>
    </div>
  )
}
