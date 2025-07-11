import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { LanguageProvider } from "@/contexts/language-context"

export const metadata: Metadata = {
  title: "StackWay - Your AI Companion",
  description: "StackWay: Chat with Grok 4 AI by xAI, explore advanced features, and manage API keys.",
  generator: "v0.dev",
  icons: { icon: "/favicon.png" },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  )
}
