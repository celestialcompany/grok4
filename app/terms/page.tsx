"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { ArrowLeft } from "lucide-react"

export default function TermsOfServicePage() {
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
          {t("termsOfService")}
        </h2>
        <div className="prose prose-invert text-gray-300 space-y-6">
          <p>{t("termsIntro")}</p>
          <h3>{t("termsSection1Title")}</h3>
          <p>{t("termsSection1Content")}</p>
          <h3>{t("termsSection2Title")}</h3>
          <p>{t("termsSection2Content")}</p>
          <h3>{t("termsSection3Title")}</h3>
          <p>{t("termsSection3Content")}</p>
          <h3>{t("termsSection4Title")}</h3>
          <p>{t("termsSection4Content")}</p>
          <h3>{t("termsSection5Title")}</h3>
          <p>{t("termsSection5Content")}</p>
          <h3>{t("termsSection6Title")}</h3>
          <p>{t("termsSection6Content")}</p>
          <h3>{t("termsSection7Title")}</h3>
          <p>{t("termsSection7Content")}</p>
          <h3>{t("termsSection8Title")}</h3>
          <p>{t("termsSection8Content")}</p>
          <p>{t("termsConclusion")}</p>
        </div>
      </main>

      <footer className="w-full py-8 bg-gray-900 border-t border-gray-800 text-center text-gray-400 text-sm">
        <p>
          &copy; {new Date().getFullYear()} StackWay. {t("allRightsReserved")} • Powered by xAI
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
