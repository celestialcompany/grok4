"use client"

import type React from "react"
// Helper for browser-native SpeechRecognition
// (Chrome ships it as webkitSpeechRecognition)
const SpeechRecognition =
  typeof window !== "undefined"
    ? window.SpeechRecognition ||
      // eslint-disable-next-line @typescript-eslint/ban-types
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
  Mic,
  LogOut,
  Settings,
  Key,
  Zap,
  Sparkles,
  ChevronDown,
  X,
  ImageIcon,
  Download,
  RefreshCw,
  Palette,
} from "lucide-react"
import { useRef, useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { auth } from "@/lib/firebase"
import { signOut, type User } from "firebase/auth"
import { useLanguage } from "@/contexts/language-context"
import LanguageSwitcher from "@/components/language-switcher"
import type { Message, ImagePart, TextPart } from "ai" // Import types from ai

interface GrokChatProps {
  user: User
}

// Функция для определения запросов на генерацию изображений
function isImageGenerationRequest(message: string): boolean {
  const imageKeywords = [
    "создай изображение",
    "нарисуй",
    "покажи как выглядит",
    "сгенерируй картинку",
    "создай картинку",
    "нарисуй мне",
    "покажи картинку",
    "визуализируй",
    "create image",
    "draw",
    "generate picture",
    "show me what",
    "visualize",
    "make an image",
    "create a picture",
    "draw me",
    "show picture",
  ]

  const lowerMessage = message.toLowerCase()
  return imageKeywords.some((keyword) => lowerMessage.includes(keyword))
}

export default function GrokChat({ user }: GrokChatProps) {
  const { t } = useLanguage()
  const { language } = useLanguage()
  const [isListening, setIsListening] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionType>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null)
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null)

  const [initialChatMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedMessages = localStorage.getItem("chat_history")
        return savedMessages ? JSON.parse(savedMessages) : []
      } catch (error) {
        console.error("Failed to parse chat history from localStorage:", error)
        return []
      }
    }
    return []
  })

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, setInput, append } = useChat({
    initialMessages: initialChatMessages,
    body: {
      language: language,
    },
    onFinish: () => {
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop()
        setIsListening(false)
      }
      setIsGeneratingImage(false)
    },
    onError: () => {
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop()
        setIsListening(false)
      }
      setIsGeneratingImage(false)
    },
    onMessagesChange: (currentMessages) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("chat_history", JSON.stringify(currentMessages))
      }
    },
    onResponse: async (response) => {
      const contentType = response.headers.get("Content-Type")
      if (contentType?.includes("application/json")) {
        const data = await response.json()
        if (data.role && data.content) {
          append({
            id: Date.now().toString(),
            role: data.role,
            content: data.content,
          })
          setIsGeneratingImage(false) // Остановить индикатор загрузки изображения
          return true // Сигнализировать, что этот ответ обработан
        }
      }
      // Для не-JSON ответов (например, текстовых потоков), пусть useChat обрабатывает их
      return false
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !selectedImageBase64) {
      return
    }

    // Проверяем, является ли это запросом на генерацию изображения
    if (typeof input === "string" && isImageGenerationRequest(input)) {
      setIsGeneratingImage(true)
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: [],
    } as Message

    if (input.trim()) {
      ;(userMessage.content as TextPart[]).push({ type: "text", text: input.trim() })
    }
    if (selectedImageBase64) {
      ;(userMessage.content as ImagePart[]).push({ type: "image", image: selectedImageBase64 })
    }

    if (
      Array.isArray(userMessage.content) &&
      userMessage.content.length === 1 &&
      userMessage.content[0].type === "text"
    ) {
      userMessage.content = userMessage.content[0].text
    }

    append(userMessage as Message)
    setInput("")
    clearSelectedImage()
  }

  // Функция для скачивания изображения
  const downloadImage = async (imageUrl: string, filename = "grok-generated-image.png") => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success(language === "ru" ? "Изображение скачано!" : "Image downloaded!")
    } catch (error) {
      toast.error(language === "ru" ? "Ошибка скачивания" : "Download failed")
    }
  }

  // Функция для регенерации изображения
  const regenerateImage = (originalPrompt: string) => {
    const regenerateText = language === "ru" ? `Создай изображение ${originalPrompt}` : `Create image ${originalPrompt}`
    setInput(regenerateText)
  }

  const renderMessageContent = (content: string | (TextPart | ImagePart)[]) => {
    if (typeof content === "string") {
      return (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ src, alt }) => {
              // Проверяем, является ли это сгенерированным изображением
              const isGeneratedImage = alt?.includes("Сгенерированное изображение") || alt?.includes("Generated image")

              return (
                <div className="my-4">
                  <div className="relative group rounded-lg overflow-hidden border border-gray-600">
                    <img
                      src={src || "/placeholder.svg"}
                      alt={alt || "Generated image"}
                      className="w-full h-auto max-w-full"
                      style={{ maxHeight: "512px", objectFit: "contain" }}
                    />

                    {isGeneratedImage && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <Button
                          onClick={() => downloadImage(src || "", "grok-generated-image.png")}
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-black/70 text-white hover:bg-black/90"
                          title={language === "ru" ? "Скачать изображение" : "Download image"}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => {
                            // Извлекаем оригинальный промпт из контекста сообщения
                            const messageText = content as string
                            const promptMatch = messageText.match(
                              /\*\*(?:Использованный промпт|Used prompt):\*\* (.+)/i,
                            )
                            if (promptMatch) {
                              regenerateImage(promptMatch[1])
                            }
                          }}
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-black/70 text-white hover:bg-black/90"
                          title={language === "ru" ? "Создать заново" : "Regenerate"}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )
            },
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
                    img: ({ src, alt }) => {
                      const isGeneratedImage =
                        alt?.includes("Сгенерированное изображение") || alt?.includes("Generated image")

                      return (
                        <div className="my-4">
                          <div className="relative group rounded-lg overflow-hidden border border-gray-600">
                            <img
                              src={src || "/placeholder.svg"}
                              alt={alt || "Generated image"}
                              className="w-full h-auto max-w-full"
                              style={{ maxHeight: "512px", objectFit: "contain" }}
                            />

                            {isGeneratedImage && (
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <Button
                                  onClick={() => downloadImage(src || "", "grok-generated-image.png")}
                                  size="sm"
                                  variant="secondary"
                                  className="h-8 w-8 p-0 bg-black/70 text-white hover:bg-black/90"
                                  title={language === "ru" ? "Скачать изображение" : "Download image"}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => {
                                    const messageText = part.text
                                    const promptMatch = messageText.match(
                                      /\*\*(?:Использованный промпт|Used prompt):\*\* (.+)/i,
                                    )
                                    if (promptMatch) {
                                      regenerateImage(promptMatch[1])
                                    }
                                  }}
                                  size="sm"
                                  variant="secondary"
                                  className="h-8 w-8 p-0 bg-black/70 text-white hover:bg-black/90"
                                  title={language === "ru" ? "Создать заново" : "Regenerate"}
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    },
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
                  {part.text}
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

                {/* Добавляем подсказки о генерации изображений */}
                <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="h-5 w-5 text-purple-400" />
                    <span className="text-sm font-medium text-gray-300">
                      {language === "ru" ? "Генерация изображений" : "Image Generation"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {language === "ru"
                      ? 'Попробуйте: "Создай изображение кота", "Нарисуй закат", "Покажи как выглядит робот"'
                      : 'Try: "Create image of a cat", "Draw a sunset", "Show me what a robot looks like"'}
                  </p>
                </div>
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
              {(isLoading || isGeneratingImage) && (
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
                        <span className="text-xs">
                          {isGeneratingImage
                            ? language === "ru"
                              ? "Grok создает изображение..."
                              : "Grok is creating image..."
                            : t("generating")}
                        </span>
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
                onChange={handleInputChange}
                placeholder={
                  isListening
                    ? t("listening")
                    : isGeneratingImage
                      ? language === "ru"
                        ? "Создаю изображение..."
                        : "Creating image..."
                      : t("askSomething")
                }
                disabled={isLoading || isListening || isGeneratingImage}
                className="flex-1 bg-transparent border-0 pl-4 pr-20 py-4 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              />

              <div className="absolute right-3 flex items-center gap-2">
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || !SpeechRecognition || isGeneratingImage}
                  size="sm"
                  className="h-8 w-8 p-0 bg-transparent text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Upload Image"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  onClick={toggleVoiceInput}
                  disabled={isLoading || !SpeechRecognition || isGeneratingImage}
                  size="sm"
                  className={`h-8 w-8 p-0 ${isListening ? "bg-red-600 animate-pulse" : "bg-transparent"} text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Mic className="h-4 w-4" />
                </Button>

                {isLoading || isGeneratingImage ? (
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
            <p className="text-xs text-gray-400">{t("disclaimer")} • Powered by Grok 4</p>
          </div>
        </div>
      </div>
    </div>
  )
}
