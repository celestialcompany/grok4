import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { LanguageProvider } from "@/contexts/language-context"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"

export const metadata: Metadata = {
  metadataBase: new URL('https://your-domain.com'), // Замените на ваш домен
  title: {
    default: "StackWay - Your Witty AI Companion Powered by Grok 4",
    template: "%s | StackWay",
  },
  description: "StackWay: Chat with Grok 4 AI by xAI, explore advanced features like real-time knowledge and transparent thinking mode, and manage API keys. Experience the future of AI.",
  generator: "v0.dev",
  applicationName: "StackWay",
  keywords: ["Grok 4", "xAI", "AI chat", "AI assistant", "real-time AI", "thinking mode", "API management", "Next.js", "React", "chatbot", "artificial intelligence"],
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
    description: "StackWay: Chat with Grok 4 AI by xAI, explore advanced features like real-time knowledge and transparent thinking mode, and manage API keys. Experience the future of AI.",
    url: "https://your-domain.com", // Замените на ваш домен
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
    description: "StackWay: Chat with Grok 4 AI by xAI, explore advanced features like real-time knowledge and transparent thinking mode, and manage API keys. Experience the future of AI.",
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
  // Добавьте другие метаданные по мере необходимости
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
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
