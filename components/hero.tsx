"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import WaveOverlay from "./wave-overlay"
import FloatingBubbles from "./floating-bubbles"

export default function Hero() {
  return (
    <section className="relative h-[60vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={process.env.NODE_ENV === 'production' ? '/taiwan-travel-ayakai/brand.png' : '/brand.png'}
          alt="Taiwan Travel Hero"
          fill
          priority
          quality={90}
          className="object-cover object-center"
        />
      </div>
      
      {/* Gradient Overlay for smooth transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent z-10"></div>

      {/* Floating Bubbles */}
      <FloatingBubbles />

      {/* Wave Overlay */}
      <WaveOverlay />
    </section>
  )
} 