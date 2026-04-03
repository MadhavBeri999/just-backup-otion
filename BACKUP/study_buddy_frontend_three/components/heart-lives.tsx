"use client"

import { motion } from "framer-motion"

interface HeartLivesProps {
  maxLives?: number
  currentLives: number
}

export function HeartLives({ maxLives = 5, currentLives }: HeartLivesProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: maxLives }).map((_, i) => {
        const isAlive = i < currentLives
        return (
          <motion.div
            key={i}
            initial={false}
            animate={
              isAlive
                ? { scale: [1, 1.1, 1], opacity: 1 }
                : { scale: [1, 1.3, 0.8, 1], opacity: 0.25 }
            }
            transition={{ duration: 0.5 }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill={isAlive ? "#ef4444" : "#374151"}
              className={isAlive ? "drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : ""}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        )
      })}
      <span className="ml-2 text-sm font-medium text-chalk-white/70">
        {currentLives}/{maxLives}
      </span>
    </div>
  )
}
