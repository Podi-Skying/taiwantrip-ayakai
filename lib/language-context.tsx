"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type Language = "zh" | "en" | "ja"

interface LanguageContextType {
  currentLang: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ 
  children, 
  defaultLanguage = "ja" 
}: { 
  children: React.ReactNode
  defaultLanguage?: Language 
}) {
  const [currentLang, setCurrentLang] = useState<Language>(defaultLanguage)

  const setLanguage = (lang: Language) => {
    setCurrentLang(lang)
    // 觸發自定義事件，通知其他組件語言已更改
    const event = new CustomEvent("languageChange", { detail: { lang } })
    window.dispatchEvent(event)
    // 保存到 localStorage
    localStorage.setItem("preferredLanguage", lang)
  }

  useEffect(() => {
    // 從 localStorage 讀取預設語言
    const savedLang = localStorage.getItem("preferredLanguage") as Language
    if (savedLang) {
      setCurrentLang(savedLang)
    }
  }, [])

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage }}>
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