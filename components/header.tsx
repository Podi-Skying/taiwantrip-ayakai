"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, Map, Train, Camera, Menu, X, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/language-context"

// 多語言翻譯
const translations = {
  zh: {
    title: "台灣之旅",
    date: "2025/04/25 - 2025/05/03",
    menu: {
      itinerary: "行程規劃",
      map: "景點地圖",
      transportation: "交通資訊",
      gallery: "景點相冊",
    },
    language: {
      zh: "繁體中文",
      en: "English",
      ja: "日本語",
    },
  },
  en: {
    title: "Taiwan Travel",
    date: "Apr 25 - May 03, 2025",
    menu: {
      itinerary: "Itinerary",
      map: "Attractions",
      transportation: "Transportation",
      gallery: "Gallery",
    },
    language: {
      zh: "Traditional Chinese",
      en: "English",
      ja: "Japanese",
    },
  },
  ja: {
    title: "台湾旅行",
    date: "2025年04月25日 - 05月03日",
    menu: {
      itinerary: "旅程プラン",
      map: "観光スポット",
      transportation: "交通案内",
      gallery: "ギャラリー",
    },
    language: {
      zh: "繁体中国語",
      en: "英語",
      ja: "日本語",
    },
  },
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { currentLang, setLanguage } = useLanguage()

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const t = translations[currentLang]

  const navItems = [
    { href: "#itinerary", icon: <Calendar className="h-4 w-4" />, text: t.menu.itinerary },
    { href: "#map", icon: <Map className="h-4 w-4" />, text: t.menu.map },
    { href: "#transportation", icon: <Train className="h-4 w-4" />, text: t.menu.transportation },
    { href: "#gallery", icon: <Camera className="h-4 w-4" />, text: t.menu.gallery },
  ]

  const handleLanguageChange = (lang: "zh" | "en" | "ja") => {
    setLanguage(lang)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 bg-background/95 backdrop-blur-md shadow-sm"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="flex items-center gap-2 font-playfair">
            <Image
              src="/logo/taiwan-logo.svg"
              alt="Taiwan Travel Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-bold text-xl text-brand-primary">{t.title}</span>
            <span className="text-muted-foreground hidden md:inline-block">{t.date}</span>
          </div>
        </motion.div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <NavLink href={item.href} icon={item.icon} text={item.text} />
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-brand-text"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-brand-text hover:text-foreground transition-colors relative group">
                <Globe className="h-5 w-5" />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-background/90 backdrop-blur-md">
              <DropdownMenuItem 
                onClick={() => handleLanguageChange("zh")}
                className="flex items-center gap-2 p-2 hover:bg-brand-primary/10 rounded-md transition-colors text-brand-text cursor-pointer"
              >
                <span className="font-medium text-sm">{t.language.zh}</span>
                {currentLang === "zh" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto h-2 w-2 rounded-full bg-brand-primary"
                  />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleLanguageChange("en")}
                className="flex items-center gap-2 p-2 hover:bg-brand-primary/10 rounded-md transition-colors text-brand-text cursor-pointer"
              >
                <span className="font-medium text-sm">{t.language.en}</span>
                {currentLang === "en" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto h-2 w-2 rounded-full bg-brand-primary"
                  />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleLanguageChange("ja")}
                className="flex items-center gap-2 p-2 hover:bg-brand-primary/10 rounded-md transition-colors text-brand-text cursor-pointer"
              >
                <span className="font-medium text-sm">{t.language.ja}</span>
                {currentLang === "ja" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto h-2 w-2 rounded-full bg-brand-primary"
                  />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        className={cn(
          "md:hidden absolute w-full bg-background/95 backdrop-blur-md border-b border-border transition-all duration-300 ease-in-out",
          isMenuOpen ? "max-h-60 py-4" : "max-h-0 py-0 overflow-hidden",
        )}
      >
        <nav className="container mx-auto px-4 flex flex-col gap-4">
          {navItems.map((item, index) => (
            <MobileNavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              text={item.text}
              onClick={toggleMenu}
              delay={index * 0.1}
              isOpen={isMenuOpen}
            />
          ))}
        </nav>
      </div>
    </header>
  )
}

function NavLink({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 text-brand-text hover:text-foreground transition-colors relative group"
    >
      {icon}
      <span>{text}</span>
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full" />
    </Link>
  )
}

function MobileNavLink({
  href,
  icon,
  text,
  onClick,
  delay,
  isOpen,
}: {
  href: string
  icon: React.ReactNode
  text: string
  onClick: () => void
  delay: number
  isOpen: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
      transition={{ duration: 0.3, delay: isOpen ? delay : 0 }}
    >
      <Link
        href={href}
        className="flex items-center gap-2 p-2 hover:bg-brand-primary/10 rounded-md transition-colors text-brand-text"
        onClick={onClick}
      >
        {icon}
        <span>{text}</span>
      </Link>
    </motion.div>
  )
}
