"use client"

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  glow?: "blue" | "pink" | "green" | "yellow" | "none"
  hover?: boolean
}

export function GlassCard({ children, className, glow = "none", hover = true }: GlassCardProps) {
  const glowClasses = {
    blue: "neon-glow-blue",
    pink: "neon-glow-pink",
    green: "neon-glow-green",
    yellow: "neon-glow-yellow",
    none: "",
  }

  return (
    <div
      className={cn(
        "glass rounded-2xl p-6",
        glowClasses[glow],
        hover && "transition-all duration-300 hover:scale-[1.02] hover:border-chalk-white/20",
        className
      )}
    >
      {children}
    </div>
  )
}
