"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  translations,
  type Language,
  type TranslationKey,
  getBrowserLanguage,
  getLanguageByLocation,
  interpolate,
} from "@/lib/i18n"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey, values?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [isInitialized, setIsInitialized] = useState(false)

  // Инициализация языка
  useEffect(() => {
    const initializeLanguage = async () => {
      // Проверяем сохраненный язык
      const savedLanguage = localStorage.getItem("language") as Language

      if (savedLanguage && (savedLanguage === "ru" || savedLanguage === "en")) {
        setLanguageState(savedLanguage)
      } else {
        // Определяем язык автоматически
        try {
          const detectedLanguage = await getLanguageByLocation()
          setLanguageState(detectedLanguage)
          localStorage.setItem("language", detectedLanguage)
        } catch (error) {
          // Fallback на язык браузера
          const browserLanguage = getBrowserLanguage()
          setLanguageState(browserLanguage)
          localStorage.setItem("language", browserLanguage)
        }
      }

      setIsInitialized(true)
    }

    initializeLanguage()
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: TranslationKey, values?: Record<string, string | number>): string => {
    const translation = translations[language][key] || translations.en[key] || key

    if (values) {
      return interpolate(translation, values)
    }

    return translation
  }

  // Не рендерим детей до инициализации языка
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#212121] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white text-sm">{language === "ru" ? "Инициализация..." : "Initializing..."}</p>
      </div>
    )
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
