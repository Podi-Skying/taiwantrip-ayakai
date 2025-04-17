"use client"

import React from "react"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language-context"
import FloatingBubbles from "./floating-bubbles"
import WaveOverlay from "./wave-overlay"

// 多語言翻譯
const translations = {
  zh: {
    title: "北台灣の旅",
    description: "與あや探索台灣的 美麗風景、豐富文化 與 很多很多美食!",
    contact: {
      title: "花葵の聯絡資訊",
      address: "新北市蘆洲區313巷22號7樓",
      phone: "+886 973310554",
      email: "danielllling000@gmail.com",
    },
    links: {
      title: "實用連結",
      tourism: "交通部觀光署",
      tripadvisor: "TripAdvisor Taiwan",
      mrt: "台北捷運",
      railway: "台灣鐵路",
    },
    footer: {
      copyright: "© {year} 北台灣の旅 | Taiwan Journey. All rights reserved.",
      privacy: "隱私政策",
      terms: "使用條款",
      cookies: "Cookie 政策",
    },
  },
  en: {
    title: "Northern Taiwan Journey",
    description: "Explore Taiwan's beautiful landscapes, rich culture, and delicious cuisine with Aya!",
    contact: {
      title: "Contact Information",
      address: "7F, No. 22, Lane 313, Luzhou District, New Taipei City",
      phone: "+886 973310554",
      email: "danielllling000@gmail.com",
    },
    links: {
      title: "Useful Links",
      tourism: "Tourism Bureau",
      tripadvisor: "TripAdvisor Taiwan",
      mrt: "Taipei Metro",
      railway: "Taiwan Railways",
    },
    footer: {
      copyright: "© {year} Northern Taiwan Journey. All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Use",
      cookies: "Cookie Policy",
    },
  },
  ja: {
    title: "北台湾の旅",
    description: "あやと一緒に台湾の美しい景色、豊かな文化、そしてたくさんの美味しい料理を探検しましょう！",
    contact: {
      title: "花葵の連絡先情報",
      address: "新北市蘆洲区313巷22号7階",
      phone: "+886 973310554",
      email: "danielllling000@gmail.com",
    },
    links: {
      title: "便利なリンク",
      tourism: "交通部観光局",
      tripadvisor: "トリップアドバイザー台湾",
      mrt: "台北メトロ",
      railway: "台湾鉄道",
    },
    footer: {
      copyright: "© {year} 北台湾の旅 | Taiwan Journey. All rights reserved.",
      privacy: "プライバシーポリシー",
      terms: "利用規約",
      cookies: "Cookie ポリシー",
    },
  },
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { currentLang } = useLanguage()
  const t = translations[currentLang]

  return (
    <footer className="relative bg-gradient-to-b from-[#7db188]/95 via-[#5c9677] to-[#3c6b5a] text-white">
      {/* 添加泡泡效果 - 降低 z-index */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <FloatingBubbles />
      </div>
      
      {/* 添加頂部波浪效果 */}
      <WaveOverlay 
        position="top"
        height="h-[8rem]"
        colors={{
          first: "rgba(255, 248, 240, 0.98)",
          second: "rgba(182, 220, 172, 0.8)",
          third: "rgba(125, 177, 136, 0.9)",
        }}
      />
      
      <div className="container mx-auto px-4 py-16 pt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4 text-[#d4ffda]">{t.title}</h3>
              <p className="text-sm text-white/95 mb-4">
                {t.description}
              </p>
              <div className="flex space-x-3">
                <FooterSocialLink href="#" icon={<Facebook className="h-4 w-4" />} />
                <FooterSocialLink href="#" icon={<Twitter className="h-4 w-4" />} />
                <FooterSocialLink href="#" icon={<Instagram className="h-4 w-4" />} />
                <FooterSocialLink href="#" icon={<Youtube className="h-4 w-4" />} />
              </div>
            </motion.div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4 text-[#d4ffda]">{t.contact.title}</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-[#a5e9b7] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-white/95">{t.contact.address}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-[#a5e9b7] flex-shrink-0" />
                  <span className="text-sm text-white/95">{t.contact.phone}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-[#a5e9b7] flex-shrink-0" />
                  <span className="text-sm text-white/95">{t.contact.email}</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4 text-[#d4ffda]">{t.links.title}</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="https://www.taiwan.net.tw/"
                    className="text-sm text-white/95 hover:text-[#a5e9b7] flex items-center transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-2" />
                    {t.links.tourism}
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.tripadvisor.com/Tourism-g293910-Taiwan-Vacations.html"
                    className="text-sm text-white/95 hover:text-[#a5e9b7] flex items-center transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-2" />
                    {t.links.tripadvisor}
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.metro.taipei/"
                    className="text-sm text-white/95 hover:text-[#a5e9b7] flex items-center transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-2" />
                    {t.links.mrt}
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.railway.gov.tw/"
                    className="text-sm text-white/95 hover:text-[#a5e9b7] flex items-center transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-2" />
                    {t.links.railway}
                  </Link>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#a5e9b7]/30 my-8"></div>

        {/* Bottom area */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-white/80">{t.footer.copyright.replace("{year}", currentYear.toString())}</p>
          <div className="flex space-x-4">
            <Link href="#" className="text-xs text-white/80 hover:text-[#a5e9b7] transition-colors">
              {t.footer.privacy}
            </Link>
            <Link href="#" className="text-xs text-white/80 hover:text-[#a5e9b7] transition-colors">
              {t.footer.terms}
            </Link>
            <Link href="#" className="text-xs text-white/80 hover:text-[#a5e9b7] transition-colors">
              {t.footer.cookies}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterSocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="bg-white/15 hover:bg-[#a5e9b7] hover:text-[#3c6b5a] p-2 rounded-full transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </Link>
  )
}
