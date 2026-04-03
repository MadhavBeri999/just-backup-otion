"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

export function ChalkboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen chalkboard-bg">
      {/* Dark overlay for readability */}
      <div className="fixed inset-0 bg-[#0a0a18]/60 z-0" />
      {/* Floating formula elements */}
      <FloatingFormulas />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

function FloatingFormulas() {
  const formulas = [
    { text: "E = mc²", x: "5%", y: "15%", delay: 0, size: "text-lg" },
    { text: "a² + b² = c²", x: "85%", y: "25%", delay: 1.5, size: "text-base" },
    { text: "F = ma", x: "10%", y: "70%", delay: 3, size: "text-sm" },
    { text: "∫ f(x)dx", x: "90%", y: "60%", delay: 0.8, size: "text-base" },
    { text: "Σ n²", x: "75%", y: "85%", delay: 2.2, size: "text-lg" },
    { text: "∇ × B", x: "20%", y: "45%", delay: 4, size: "text-sm" },
    { text: "λ = h/p", x: "60%", y: "10%", delay: 1, size: "text-sm" },
    { text: "PV = nRT", x: "40%", y: "80%", delay: 2.8, size: "text-base" },
  ]

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {formulas.map((f, i) => (
        <motion.div
          key={i}
          className={`absolute ${f.size} text-chalk-white/[0.06] font-[family-name:var(--font-chalk)] select-none`}
          style={{ left: f.x, top: f.y }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 2, -2, 0],
            opacity: [0.06, 0.1, 0.06],
          }}
          transition={{
            duration: 8 + i * 0.5,
            repeat: Infinity,
            delay: f.delay,
            ease: "easeInOut",
          }}
        >
          {f.text}
        </motion.div>
      ))}
    </div>
  )
}
