"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function NewsPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <header className="w-full px-4 py-4 border-b border-gray-800 shadow-lg bg-[#1a1a1a] z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" passHref>
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("backToHome")}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
              StackWay
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 md:py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-10 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          {t("newsPageTitle")}
        </h2>

        <Card className="bg-[#1A1A1A] border border-[#2A2A2A] text-white p-6 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold mb-2 text-white bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-teal-300">
              {t("newsArticleTitle")}
            </CardTitle>
            <CardDescription className="text-gray-400 text-sm">{t("newsArticleDate")}</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert text-gray-300 space-y-4">
            <p>{t("newsArticleContent1")}</p>
            <p>{t("newsArticleContent2")}</p>
            <p>{t("newsArticleContent3")}</p>
            <p>{t("newsArticleContent4")}</p>
          </CardContent>
        </Card>
      </main>

      <footer className="w-full py-8 bg-gray-900 border-t border-gray-800 text-center text-gray-400 text-sm">
        <p>
          &copy; {new Date().getFullYear()} StackWay. {t("allRightsReserved")} • {t("poweredByStackWayAI")}{" "}
          <a
            href="https://ai.stackway.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            ai.stackway.tech
          </a>
        </p>
        <div className="flex justify-center gap-4 mt-2">
          <Link href="/terms" passHref>
            <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
              {t("termsOfService")}
            </Button>
          </Link>
          <Link href="/privacy" passHref>
            <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
              {t("privacyPolicy")}
            </Button>
          </Link>
        </div>
        <p className="mt-2">{t("disclaimer")}</p>
      </footer>
    </div>
  )
}
