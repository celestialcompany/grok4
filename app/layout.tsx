import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { LanguageProvider } from "@/contexts/language-context"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"
import { headers } from "next/headers" // Импортируем headers для доступа к заголовкам запроса

export const metadata: Metadata = {
  metadataBase: new URL("https://your-domain.com"), // Замените на ваш основной домен
  title: {
    default: "StackWay - Your Witty AI Companion Powered by Grok 4",
    template: "%s | StackWay",
  },
  description:
    "StackWay: Chat with Grok 4 AI by xAI, explore advanced features like real-time knowledge and transparent thinking mode, and manage API keys. Experience the future of AI.",
  generator: "v0.dev",
  applicationName: "StackWay",
  keywords: [
    "Grok 4",
    "xAI",
    "AI chat",
    "AI assistant",
    "real-time AI",
    "thinking mode",
    "API management",
    "Next.js",
    "React",
    "chatbot",
    "artificial intelligence",
  ],
  authors: [{ name: "StackWay Team" }],
  creator: "StackWay Team",
  publisher: "StackWay",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "StackWay - Your Witty AI Companion Powered by Grok 4",
    description:
      "StackWay: Chat with Grok 4 AI by xAI, explore advanced features like real-time knowledge and transparent thinking mode, and manage API keys. Experience the future of AI.",
    url: "https://your-domain.com", // Замените на ваш основной домен
    siteName: "StackWay",
    images: [
      {
        url: "https://your-domain.com/og-image.jpg", // Замените на URL вашего OG-изображения
        width: 1200,
        height: 630,
        alt: "StackWay - Grok 4 AI Chat",
      },
    ],
    locale: "en_US", // Или ru_RU
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StackWay - Your Witty AI Companion Powered by Grok 4",
    description:
      "StackWay: Chat with Grok 4 AI by xAI, explore advanced features like real-time knowledge and transparent thinking mode, and manage API keys. Experience the future of AI.",
    creator: "@yourtwitterhandle", // Замените на ваш Twitter-хендл
    images: ["https://your-domain.com/twitter-image.jpg"], // Замените на URL вашего Twitter-изображения
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png", // Добавьте, если есть
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headerList = headers()
  const host = headerList.get("host")
  const protocol = headerList.get("x-forwarded-proto") || "https"
  const pathname = headerList.get("x-pathname") || "/"

  const canonicalUrl = `${protocol}://${host}${pathname}`

  // Определяем альтернативные языковые версии
  const alternateLanguages = [
    { lang: "en", href: `https://${host}${pathname.replace(/^\/(ru|en)/, "/en")}` }, // Пример для английского
    { lang: "ru", href: `https://${host}${pathname.replace(/^\/(ru|en)/, "/ru")}` }, // Пример для русского
    { lang: "x-default", href: `https://${host}${pathname.replace(/^\/(ru|en)/, "/en")}` }, // Язык по умолчанию
  ]

  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={canonicalUrl} />
        {alternateLanguages.map((lang) => (
          <link key={lang.lang} rel="alternate" hrefLang={lang.lang} href={lang.href} />
        ))}
      </head>
      <body className="antialiased">
        <Suspense fallback={null}>
          <LanguageProvider>
            {children}
            <Analytics />
            <SpeedInsights />
            <Toaster />
          </LanguageProvider>
        </Suspense>
      </body>
    </html>
  )
}
