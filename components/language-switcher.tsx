"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { Language } from "@/lib/i18n"

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
          <Languages className="h-4 w-4 mr-2" />
          {language === "ru" ? "RU" : "EN"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
        <DropdownMenuItem
          className={`text-gray-300 hover:bg-gray-700 hover:text-white ${language === "ru" ? "bg-gray-700" : ""}`}
          onClick={() => handleLanguageChange("ru")}
        >
          🇷🇺 {t("russian")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`text-gray-300 hover:bg-gray-700 hover:text-white ${language === "en" ? "bg-gray-700" : ""}`}
          onClick={() => handleLanguageChange("en")}
        >
          🇺🇸 {t("english")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
