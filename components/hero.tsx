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
          priority
          className="absolute inset-0 object-cover w-full h-full"
          src="/brand.png"
          alt="Taiwan Travel"
          width={1920}
          height={1080}
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