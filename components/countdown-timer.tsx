import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"

interface CountdownTimerProps {
  targetDate: string
  translations: {
    countdown: string
    duration: {
      days: string
      hours?: string
      minutes?: string
      seconds?: string
    }
  }
}

export default function CountdownTimer({ targetDate, translations }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    // Initial calculation
    calculateTimeLeft()

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000)

    // Cleanup
    return () => clearInterval(timer)
  }, [targetDate])

  const timeBlocks = [
    { label: translations.duration.days || "天", value: timeLeft.days },
    { label: translations.duration.hours || "時", value: timeLeft.hours },
    { label: translations.duration.minutes || "分", value: timeLeft.minutes },
    { label: translations.duration.seconds || "秒", value: timeLeft.seconds },
  ]

  return (
    <div className="mt-6 bg-brand-primary/5 rounded-lg p-4">
      <p className="text-sm text-brand-textLight mb-3">{translations.countdown}</p>
      <div className="flex items-center justify-center">
        {timeBlocks.map((block, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center w-[52px]">
              <div className="bg-brand-primary text-white text-lg font-medium rounded-md w-12 h-12 flex items-center justify-center">
                {String(block.value).padStart(2, "0")}
              </div>
              <span className="text-xs text-brand-textLight mt-1">{block.label}</span>
            </div>
            {index < timeBlocks.length - 1 && (
              <span className="text-brand-primary text-2xl font-light mx-1 mb-5">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 