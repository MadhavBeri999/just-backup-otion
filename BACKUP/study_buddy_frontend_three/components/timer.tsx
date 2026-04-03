"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"

interface TimerProps {
  durationMinutes: number
  taskName: string
  onComplete?: () => void
  isPaused?: boolean
}

export function Timer({ durationMinutes, taskName, onComplete, isPaused = false }: TimerProps) {
  const totalSeconds = durationMinutes * 60
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)

  useEffect(() => {
    if (isPaused || secondsLeft <= 0) {
      if (secondsLeft === 0) {
        onComplete?.()
      }
      return
    }
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isPaused, secondsLeft, onComplete])

  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const circumference = 2 * Math.PI * 90
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-52 h-52">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "linear" }}
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-chalk-white font-mono tabular-nums">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
          <span className="text-xs text-chalk-white/50 mt-1 uppercase tracking-widest">remaining</span>
        </div>
      </div>
      <p className="text-sm text-chalk-white/70 text-center font-medium">{taskName}</p>
    </div>
  )
}
