"use client"

import { motion } from "framer-motion"
import { AlertTriangle, X } from "lucide-react"
import { useState } from "react"

interface ExitTrapModalProps {
  isOpen: boolean
  onConfirmExit: () => void
  onStay: () => void
}

export function ExitTrapModal({ isOpen, onConfirmExit, onStay }: ExitTrapModalProps) {
  const [input, setInput] = useState("")

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onStay} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative glass-strong rounded-2xl p-8 max-w-md w-full text-center"
      >
        <button
          onClick={onStay}
          className="absolute top-4 right-4 text-chalk-white/40 hover:text-chalk-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-chalk-white font-[family-name:var(--font-chalk)] mb-2">
          {'Leaving = Lying To Yourself.'}
        </h2>
        <p className="text-chalk-white/60 text-sm mb-6">
          {"Type DONE if you really want to quit."}
        </p>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Type "DONE" to exit...'
          className="w-full bg-chalk-white/5 rounded-xl px-4 py-3 text-center text-chalk-white placeholder:text-chalk-white/30 focus:outline-none focus:ring-2 focus:ring-destructive/40 mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={onStay}
            className="flex-1 py-3 rounded-xl bg-neon-green/20 text-neon-green font-semibold text-sm hover:bg-neon-green/30 transition-colors"
          >
            Keep Grinding
          </button>
          <button
            onClick={() => input === "DONE" && onConfirmExit()}
            disabled={input !== "DONE"}
            className="flex-1 py-3 rounded-xl bg-destructive/20 text-destructive font-semibold text-sm hover:bg-destructive/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Quit Session
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
