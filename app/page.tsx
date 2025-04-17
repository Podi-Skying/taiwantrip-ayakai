"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "@/components/header"
import Hero from "@/components/hero"
import TripInfo from "@/components/trip-info"
import Itinerary from "@/components/itinerary"
import MapSection from "@/components/map-section"
import Transportation from "@/components/transportation"
import Gallery from "@/components/gallery"
import Footer from "@/components/footer"
import { ArrowUp } from "lucide-react"
import { ClientLayout } from "@/app/components/client-layout"

export default function Home() {
  // Smooth scroll for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]')

      if (anchor) {
        e.preventDefault()
        const targetId = anchor.getAttribute("href")
        if (!targetId) return

        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 80, // Offset for header
            behavior: "smooth",
          })
        }
      }
    }

    document.addEventListener("click", handleAnchorClick)
    return () => document.removeEventListener("click", handleAnchorClick)
  }, [])

  return (
    <ClientLayout>
      <AnimatePresence>
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-brand-secondary"
        >
          <Header />
          <Hero />
          <TripInfo />
          <div className="container mx-auto px-4 py-8">
            <Itinerary />
            <MapSection />
            <Transportation />
            <Gallery />
          </div>
          <Footer />

          {/* Back to top button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-8 right-8 bg-brand-primary text-white p-3 rounded-full shadow-lg hover:bg-brand-primary/90 transition-colors z-50"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUp className="h-6 w-6" />
          </motion.button>
        </motion.main>
      </AnimatePresence>
    </ClientLayout>
  )
}
