import { motion, Variants } from "framer-motion"

interface WaveOverlayProps {
  position?: "top" | "bottom"
  colors?: {
    first: string
    second: string
    third: string
    fourth?: string
  }
  height?: string
  offset?: string
}

export default function WaveOverlay({
  position = "bottom",
  colors = {
    first: "rgba(255, 244, 214, 0.7)",
    second: "rgba(255, 244, 214, 0.5)",
    third: "#fff4d6",
    fourth: "rgba(255, 244, 214, 0.9)",
  },
  height = "h-[8rem]",
  offset = "0",
}: WaveOverlayProps) {
  const firstWaveVariants: Variants = {
    initial: {
      d: "M-160 44c30 0 58-14 88-14s 58 14 88 14 58-14 88-14 58 14 88 14 v50h-352z",
    },
    animate: {
      d: [
        "M-160 44c30 0 58-14 88-14s 58 14 88 14 58-14 88-14 58 14 88 14 v50h-352z",
        "M-160 38c30 0 58-10 88-10s 58 10 88 10 58-10 88-10 58 10 88 10 v50h-352z",
      ],
      transition: {
        repeat: Infinity,
        repeatType: "mirror",
        duration: 8,
        ease: "easeInOut",
      },
    },
  }

  const secondWaveVariants: Variants = {
    initial: {
      d: "M-160 44c40 0 68-12 98-12s 68 12 98 12 68-12 98-12 58 12 58 12 v50h-352z",
    },
    animate: {
      d: [
        "M-160 44c40 0 68-12 98-12s 68 12 98 12 68-12 98-12 58 12 58 12 v50h-352z",
        "M-160 40c40 0 68-8 98-8s 68 8 98 8 68-8 98-8 58 8 58 8 v50h-352z",
      ],
      transition: {
        repeat: Infinity,
        repeatType: "mirror",
        duration: 7,
        ease: "easeInOut",
        delay: 0.2,
      },
    },
  }

  const thirdWaveVariants: Variants = {
    initial: {
      d: "M-160 44c20 0 48-10 78-10s 48 10 78 10 48-10 78-10 78 10 78 10 v50h-352z",
    },
    animate: {
      d: [
        "M-160 44c20 0 48-10 78-10s 48 10 78 10 48-10 78-10 78 10 78 10 v50h-352z",
        "M-160 42c20 0 48-6 78-6s 48 6 78 6 48-6 78-6 78 6 78 6 v50h-352z",
      ],
      transition: {
        repeat: Infinity,
        repeatType: "mirror",
        duration: 6,
        ease: "easeInOut",
        delay: 0.4,
      },
    },
  }

  return (
    <div
      className={`absolute ${position}-${offset} left-0 w-full overflow-hidden leading-none ${
        position === "top" ? "-scale-y-100" : ""
      }`}
      style={{ zIndex: 10 }}
    >
      <svg
        className={`relative w-full ${height} min-w-[1000px]`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 20 150 40"
        preserveAspectRatio="none"
      >
        <defs>
          <motion.path
            id="wave-path-1"
            variants={firstWaveVariants}
            initial="initial"
            animate="animate"
          />
          <motion.path
            id="wave-path-2"
            variants={secondWaveVariants}
            initial="initial"
            animate="animate"
          />
          <motion.path
            id="wave-path-3"
            variants={thirdWaveVariants}
            initial="initial"
            animate="animate"
          />
        </defs>
        <g>
          <use xlinkHref="#wave-path-1" x="0" y="0" fill={colors.first} className="opacity-30" />
          <use xlinkHref="#wave-path-2" x="50" y="3" fill={colors.second} className="opacity-40" />
          <use xlinkHref="#wave-path-3" x="25" y="5" fill={colors.fourth || colors.third} className="opacity-25" />
          <use xlinkHref="#wave-path-2" x="100" y="8" fill={colors.third} className="opacity-75" />
        </g>
      </svg>
    </div>
  )
} 