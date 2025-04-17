"use client"

import { Calendar, Plane, Hotel } from "lucide-react"
import { motion } from "framer-motion"
import WaveOverlay from "./wave-overlay"
import CountdownTimer from "./countdown-timer"
import { useLanguage } from "@/lib/language-context"

// 多語言翻譯
const translations = {
  zh: {
    title: "旅遊概覽",
    subtitle: "與あや來一趟九天的台灣之旅，體驗台灣豐富的文化、自然風景 與 狠多狠多美食 !",
    duration: {
      days: "天",
      nights: "夜",
      hours: "時",
      minutes: "分",
      seconds: "秒",
      total: "共9天8夜",
    },
    countdown: "距離旅程開始還有：",
    sections: {
      dates: {
        title: "旅遊日期",
      },
      accommodation: {
        title: "住宿資訊",
        locations: {
          jiAn: "新北市吉安公園(外婆家)",
          grandHotel: "台北圓山大飯店",
        },
      },
      flight: {
        title: "航班資訊",
        arrival: {
          label: "抵達",
          location: "台灣桃園國際機場第一航廈",
        },
        departure: {
          label: "離開",
          location: "台灣桃園國際機場第一航廈",
        },
      },
    },
  },
  en: {
    title: "Trip Overview",
    subtitle: "Experience Taiwan's rich culture, natural scenery, and traditional food with Aya in a 9-day journey",
    duration: {
      days: "days",
      nights: "nights",
      hours: "hrs",
      minutes: "min",
      seconds: "sec",
      total: "9 days 8 nights",
    },
    countdown: "Time until the journey begins:",
    sections: {
      dates: {
        title: "Travel Dates",
      },
      accommodation: {
        title: "Accommodation",
        locations: {
          jiAn: "Ji'an Park, Xindian District, New Taipei City",
          grandHotel: "Grand Hotel Taipei",
        },
      },
      flight: {
        title: "Flight Information",
        arrival: {
          label: "Arrival",
          location: "Taiwan Taoyuan International Airport T1",
        },
        departure: {
          label: "Departure",
          location: "Taiwan Taoyuan International Airport T1",
        },
      },
    },
  },
  ja: {
    title: "旅行概要",
    subtitle: "あやといっしょに、わくわくの9日間台湾旅行へ出発！ \n文化も自然もグルメも、ぜんぶ楽しもう〜！",
    duration: {
      days: "日",
      nights: "泊",
      hours: "時",
      minutes: "分",
      seconds: "秒",
      total: "9日間8泊",
    },
    countdown: "旅行開始まで：",
    sections: {
      dates: {
        title: "旅行日程",
      },
      accommodation: {
        title: "宿泊情報",
        locations: {
          jiAn: "新北市吉安公園（おばあちゃんの家）",
          grandHotel: "台北圓山大飯店",
        },
      },
      flight: {
        title: "フライト情報",
        arrival: {
          label: "到着",
          location: "台湾桃園国際空港第1ターミナル",
        },
        departure: {
          label: "出発",
          location: "台湾桃園国際空港第1ターミナル",
        },
      },
    },
  },
}

function calculateDuration(startDate: string, endDate: string, lang: "zh" | "en" | "ja"): string {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const nights = days - 1
  const t = translations[lang]
  return `(${days}${t.duration.days}${nights}${t.duration.nights})`
}

export default function TripInfo() {
  const { currentLang } = useLanguage()
  const t = translations[currentLang]

  // 根據語言設定不同的文字樣式
  const textStyles = {
    zh: {
      title: "font-bold tracking-wide leading-relaxed",
      subtitle: "tracking-wide leading-relaxed",
      body: "tracking-wide leading-relaxed",
      small: "tracking-wide leading-relaxed",
    },
    en: {
      title: "font-bold tracking-normal leading-snug",
      subtitle: "tracking-normal leading-snug",
      body: "tracking-normal leading-relaxed",
      small: "tracking-normal leading-relaxed",
    },
    ja: {
      title: "font-bold tracking-wide leading-loose",
      subtitle: "tracking-wide leading-loose",
      body: "tracking-wide leading-relaxed",
      small: "tracking-wide leading-relaxed",
    },
  }[currentLang]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const stays = [
    {
      location: t.sections.accommodation.locations.jiAn,
      dates: [
        { start: "2025/04/25", end: "2025/04/29" },
        { start: "2025/05/01", end: "2025/05/03" },
      ],
    },
    {
      location: t.sections.accommodation.locations.grandHotel,
      dates: [{ start: "2025/04/29", end: "2025/05/01" }],
    },
  ]

  return (
    <section id="trip-info" className="relative py-24 bg-gradient-to-b from-theme-yellow via-theme-yellow/30 to-brand-secondary/50 -translate-y-1">
      {/* Top Wave */}
      <WaveOverlay
        position="top"
        height="h-[6rem]"
        colors={{
          first: "rgba(255, 244, 214, 0.9)",
          second: "rgba(255, 244, 214, 0.7)",
          third: "rgba(255, 244, 214, 0.95)",
        }}
      />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl mb-4 text-[#1A1A1A] dark:text-white font-playfair ${textStyles.title}`}>
            {t.title}
          </h2>
          <div className="w-20 h-1 bg-brand-primary mx-auto mb-6 rounded-full"></div>
          <p className={`text-lg md:text-xl text-[#4A4A4A] dark:text-[#E0E0E0] max-w-2xl mx-auto whitespace-pre-line ${textStyles.subtitle}`}>
            {t.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
        >
          <motion.div variants={item} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex-1 card-hover border border-brand-brown/10">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-brand-primary/10 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-brand-primary" />
                </div>
                <h3 className={`text-xl font-medium text-[#1A1A1A] dark:text-white ${textStyles.title}`}>
                  {t.sections.dates.title}
                </h3>
              </div>
              <p className={`text-lg font-medium text-[#1A1A1A] dark:text-white mb-3 ${textStyles.body}`}>
                2025/04/25 (Fri) - 2025/05/03 (Sat)
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                <span className={`text-sm text-[#4A4A4A] dark:text-[#E0E0E0] ${textStyles.small}`}>
                  {t.duration.total}
                </span>
              </div>
              <CountdownTimer targetDate="2025/04/25" translations={{
                countdown: t.countdown,
                duration: t.duration
              }} />
            </div>
          </motion.div>

          <motion.div variants={item} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex-1 card-hover border border-brand-brown/10">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-brand-primary/10 p-3 rounded-full">
                  <Hotel className="h-6 w-6 text-brand-primary" />
                </div>
                <h3 className={`text-xl font-medium text-[#1A1A1A] dark:text-white ${textStyles.title}`}>
                  {t.sections.accommodation.title}
                </h3>
              </div>
              <div className="space-y-4">
                {stays.map((stay, index) => (
                  <div key={index}>
                    <p className={`font-medium text-[#1A1A1A] dark:text-white ${textStyles.body}`}>{stay.location}</p>
                    {stay.dates.map((date, dateIndex) => (
                      <p key={dateIndex} className={`text-sm text-[#4A4A4A] dark:text-[#E0E0E0] mt-1 ${textStyles.small}`}>
                        {date.start.slice(5)} - {date.end.slice(5)} {calculateDuration(date.start, date.end, currentLang)}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex-1 card-hover border border-brand-brown/10">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-brand-primary/10 p-3 rounded-full">
                  <Plane className="h-6 w-6 text-brand-primary" />
                </div>
                <h3 className={`text-xl font-medium text-[#1A1A1A] dark:text-white ${textStyles.title}`}>
                  {t.sections.flight.title}
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className={`text-[#1A1A1A] dark:text-white ${textStyles.body}`}>
                    <span className={`font-medium ${textStyles.body}`}>{t.sections.flight.arrival.label}:</span> 08:35, April 25, 2025
                  </p>
                  <p className={`text-sm text-[#4A4A4A] dark:text-[#E0E0E0] mt-1 ${textStyles.small}`}>{t.sections.flight.arrival.location}</p>
                </div>
                <div>
                  <p className={`text-[#1A1A1A] dark:text-white ${textStyles.body}`}>
                    <span className={`font-medium ${textStyles.body}`}>{t.sections.flight.departure.label}:</span> 02:40, May 4, 2025
                  </p>
                  <p className={`text-sm text-[#4A4A4A] dark:text-[#E0E0E0] mt-1 ${textStyles.small}`}>{t.sections.flight.departure.location}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
