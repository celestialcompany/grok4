"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import LanguageSwitcher from "@/components/language-switcher"
import { Zap, Sparkles, Brain, Clock, Lightbulb, MessageSquare, ArrowRight, Code, ShieldCheck } from "lucide-react"

export default function MainPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 w-full px-4 py-4 border-b border-[#2A2A2A] shadow-lg bg-[#1A1A1A]/90 z-20 animate-fade-in-down animation-delay-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Zap className="h-7 w-7 text-blue-300" />
              <Sparkles className="h-4 w-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse-subtle" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
              StackWay
            </h1>
          </div>
          <nav className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/chat" passHref>
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
              >
                {t("signIn")}
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-40 text-center overflow-hidden bg-gradient-to-br from-[#0A0A0A] via-[#101010] to-[#0A0A0A] flex-1 flex items-center justify-center">
        <div
          className="absolute inset-0 opacity-5 z-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, rgba(59, 130, 246, 0.02) 0%, transparent 70%), radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.02) 0%, transparent 70%)",
          }}
        ></div>
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <Badge className="mb-6 bg-gradient-to-r from-blue-700 to-purple-700 text-white text-sm px-3 py-1 rounded-full shadow-md animate-fade-in-down [animation-delay:0.4s]">
            {t("grok")} 4-0709 • {t("latestModel")}
          </Badge>
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300 animate-slide-in-up [animation-delay:0.6s]">
            {t("heroTitle")}
          </h2>
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto animate-fade-in [animation-delay:0.8s]">
            {t("heroDescription")}
          </p>
          <Link href="/chat" passHref>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white text-lg px-8 py-5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 animate-scale-in [animation-delay:1s]"
            >
              {t("startChatting")} <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 md:py-24 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300 animate-slide-in-up [animation-delay:0.2s]">
            {t("featuresTitle")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-staggered-fade-in [animation-delay:0.4s]">
            <Card className="bg-[#1A1A1A] border border-[#2A2A2A] text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center gap-5 pb-5">
                <Clock className="h-8 w-8 text-green-300" />
                <CardTitle className="text-xl font-semibold">{t("feature1Title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-base leading-relaxed">
                  {t("feature1Description")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border border-[#2A2A2A] text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center gap-5 pb-5">
                <Brain className="h-8 w-8 text-purple-300" />
                <CardTitle className="text-xl font-semibold">{t("feature2Title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-base leading-relaxed">
                  {t("feature2Description")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border border-[#2A2A2A] text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center gap-5 pb-5">
                <Lightbulb className="h-8 w-8 text-yellow-300" />
                <CardTitle className="text-xl font-semibold">{t("feature3Title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-base leading-relaxed">
                  {t("feature3Description")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border border-[#2A2A2A] text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center gap-5 pb-5">
                <MessageSquare className="h-8 w-8 text-blue-300" />
                <CardTitle className="text-xl font-semibold">{t("feature4Title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-base leading-relaxed">
                  {t("feature4Description")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border border-[#2A2A2A] text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center gap-5 pb-5">
                <Code className="h-8 w-8 text-orange-300" />
                <CardTitle className="text-xl font-semibold">{t("feature5Title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-base leading-relaxed">
                  {t("feature5Description")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border border-[#2A2A2A] text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center gap-5 pb-5">
                <ShieldCheck className="h-8 w-8 text-red-300" />
                <CardTitle className="text-xl font-semibold">{t("feature6Title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-base leading-relaxed">
                  {t("feature6Description")}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Performance Benchmarks Section */}
      <section className="w-full py-16 md:py-24 bg-[#1A1A1A]">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300 animate-slide-in-up [animation-delay:0.2s]">
            {t("benchmarksTitle")}
          </h3>
          <div className="space-y-16">
            {/* Vending-Bench Image */}
            <div className="flex flex-col items-center animate-fade-in [animation-delay:0.4s]">
              <h4 className="text-2xl font-bold text-white mb-4 text-center">{t("vendingBenchTitle")}</h4>
              <p className="text-base text-gray-400 mb-6 text-center max-w-3xl">{t("vendingBenchDescription")}</p>
              <div className="w-full max-w-4xl rounded-lg overflow-hidden shadow-xl border border-[#2A2A2A] animate-scale-in [animation-delay:0.6s]">
                <Image
                  src="/images/vending-bench.png"
                  alt={t("vendingBenchAlt")}
                  width={1200}
                  height={675}
                  layout="responsive"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>

            {/* Humanity's Last Exam Image */}
            <div className="flex flex-col items-center animate-fade-in [animation-delay:0.8s]">
              <h4 className="text-2xl font-bold text-white mb-4 text-center">{t("humanityExamTitle")}</h4>
              <p className="text-base text-gray-400 mb-6 text-center max-w-3xl">{t("humanityExamDescription")}</p>
              <div className="w-full max-w-4xl rounded-lg overflow-hidden shadow-xl border border-[#2A2A2A] animate-scale-in [animation-delay:1s]">
                <Image
                  src="/images/humanity-exam.png"
                  alt={t("humanityExamAlt")}
                  width={1200}
                  height={675}
                  layout="responsive"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] text-center animate-fade-in [animation-delay:0.2s]">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-slide-in-up [animation-delay:0.4s]">
            {t("ctaTitle")}
          </h3>
          <p className="text-lg text-gray-400 mb-8 animate-fade-in [animation-delay:0.6s]">{t("ctaDescription")}</p>
          <Link href="/chat" passHref>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white text-lg px-8 py-5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 animate-scale-in [animation-delay:0.8s]"
            >
              {t("startChatting")} <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-[#1A1A1A] border-t border-[#2A2A2A] text-center text-gray-400 text-xs animate-fade-in [animation-delay:0.2s]">
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
