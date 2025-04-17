"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "zh" | "en" | "ja"

interface LanguageContextType {
  currentLang: Language
  setCurrentLang: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLang, setCurrentLang] = useState<Language>("ja")

  // 初始化時從 localStorage 讀取語言設置
  useEffect(() => {
    const savedLang = localStorage.getItem("preferredLanguage") as Language
    if (savedLang) {
      setCurrentLang(savedLang)
    }
  }, [])

  // 當語言改變時保存到 localStorage
  const handleSetCurrentLang = (lang: Language) => {
    setCurrentLang(lang)
    localStorage.setItem("preferredLanguage", lang)
  }

  return (
    <LanguageContext.Provider value={{ currentLang, setCurrentLang: handleSetCurrentLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
} 