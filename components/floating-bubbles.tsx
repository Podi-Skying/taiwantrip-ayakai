import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Bubble {
  id: number
  size: number
  duration: number
  delay: number
  x: number
  color: string
  xMovement: number
}

const BUBBLE_COLORS = [
  "rgba(255, 255, 255, 0.1)",
  "rgba(255, 244, 214, 0.15)",
  "rgba(255, 218, 121, 0.1)",
  "rgba(255, 236, 179, 0.12)",
  "rgba(253, 226, 147, 0.08)"
]

export default function FloatingBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([])

  useEffect(() => {
    // Generate random bubbles
    const newBubbles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 40 + 20, // 20-60px
      duration: Math.random() * 8 + 12, // 12-20s
      delay: Math.random() * 5,
      x: Math.random() * 100, // 0-100%
      color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
      xMovement: (Math.random() - 0.5) * 200, // Random movement between -100px and 100px
    }))
    setBubbles(newBubbles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full backdrop-blur-sm"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.x}%`,
            bottom: "-20%",
            backgroundColor: bubble.color,
          }}
          initial={{ y: 0, x: 0, opacity: 1 }}
          animate={{
            y: [0, -1000],
            x: [0, bubble.xMovement, -bubble.xMovement, bubble.xMovement * 0.5],
            opacity: [1, 0.8, 0.6, 0.3, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        />
      ))}
    </div>
  )
} 