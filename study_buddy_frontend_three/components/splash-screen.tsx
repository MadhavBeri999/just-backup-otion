"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen } from "lucide-react"

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    // Faster, elegant fairy-tale timing with fewer pages
    const t1 = setTimeout(() => setPhase(1), 1000)   // Cover opens
    const t2 = setTimeout(() => setPhase(2), 2200)   // Page 1
    const t3 = setTimeout(() => setPhase(3), 3200)   // Page 2 turns (Final page)
    const t4 = setTimeout(() => setPhase(4), 4800)   // Magic Text fades in, holds
    const t5 = setTimeout(() => setPhase(5), 7500)   // Text zooms out, book fades
    const t6 = setTimeout(() => onComplete(), 9000) // Unmount

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); clearTimeout(t6); }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[999] bg-[#050508] overflow-hidden flex items-center justify-center perspective-[2500px]">

      {/* Ambient background glow */}
      <motion.div
        animate={{ opacity: phase >= 4 ? 0.8 : 0.3 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.15)_0%,_transparent_60%)] pointer-events-none"
      />

      {/* The Magic Book Container */}
      <AnimatePresence>
        {phase < 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 10 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative z-20 w-[160px] h-[240px] sm:w-[220px] sm:h-[320px] md:w-[280px] md:h-[400px] lg:w-[320px] lg:h-[460px]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* BOOK SPINE SHADOW */}
            <div className="absolute left-0 top-0 bottom-0 w-8 -translate-x-full bg-gradient-to-r from-transparent to-black/40 blur-sm pointer-events-none" />

            {/* BASE BACK COVER */}
            <div className="absolute inset-0 bg-[#4a2e18] rounded-r-2xl border-y-4 border-r-4 border-[#2b1708] shadow-[10px_10px_30px_rgba(0,0,0,0.8)] flex">
              <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />
            </div>

            {/* Static Stack of Pages */}
            <div className="absolute inset-y-2 left-1 right-2 bg-[#e8e4d9] rounded-r-lg border-y border-r border-[#d4cfc0] shadow-inner flex flex-col justify-stretch">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex-1 border-b border-black/5" />
              ))}
            </div>

            {/* THE FINAL SPREAD (Right Page) */}
            <div className="absolute inset-y-2 left-1 right-3 bg-[#fdfbf7] rounded-r-md border-l border-black/10 overflow-hidden shadow-[-5px_0_15px_rgba(0,0,0,0.1)] flex items-center justify-center p-8">
              {/* Ambient Pencil Sketch Background */}
              <div className="absolute inset-0 opacity-40 font-[family-name:var(--font-chalk)] text-sm whitespace-pre pointer-events-none overflow-hidden text-center text-slate-900 font-bold rotate-[-5deg]">
                {`\n∫ e^x dx = e^x + C\n\nF = G(m1m2)/r^2\n\nΔS ≥ 0\n\nH20 → 2H+ + O2-`}
              </div>

              {/* Magic Text Reveals Here */}
              <motion.div
                initial={{ opacity: 0, filter: "blur(10px)", scale: 0.9 }}
                animate={{ opacity: phase >= 4 ? 1 : 0, filter: phase >= 4 ? "blur(0px)" : "blur(10px)", scale: phase >= 4 ? 1 : 0.9 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="flex flex-col items-center relative z-10"
              >
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1a1a1a] text-center leading-tight">
                  Padhle Bhai <br />
                  <span className="text-[#d4af37] inline-block mt-2 font-emoji">🫵</span>
                </h1>
              </motion.div>
            </div>

            {/* --- FLIPPING PAGES (Anchored at left edge/spine) --- */}

            {/* Page 2 (Science Notes) */}
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: phase >= 3 ? -179 : 0 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className="absolute inset-y-2 left-[3px] right-[10px] origin-left"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 bg-[#fdfbf7] rounded-r-md border-l border-black/10 border-r-2 border-[#d4cfc0] p-6 text-[10px] md:text-sm font-[family-name:var(--font-chalk)] text-slate-900/60 font-medium italic" style={{ backfaceVisibility: "hidden" }}>
                <p>Theory of Relativity:</p>
                <h3 className="text-xl md:text-3xl text-center my-4 font-bold text-slate-900 opacity-100 border-b border-slate-900/40 pb-2">E = mc²</h3>
                <p className="indent-4 leading-relaxed">The equation expresses the fact that mass and energy are the same physical entity and can be changed into each other.</p>
              </div>
              <div className="absolute inset-0 bg-[#fdfbf7] rounded-l-md border-r border-[#d4cfc0] shadow-[5px_0_10px_rgba(0,0,0,0.1)] flex items-center justify-center" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-800/10" />
              </div>
            </motion.div>

            {/* Page 1 (Biology Sketches) */}
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: phase >= 2 ? -180 : 0 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className="absolute inset-y-2 left-[2px] right-[8px] origin-left"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 bg-[#fdfbf7] rounded-r-md border-l border-black/10 border-r-2 border-[#d4cfc0] p-6 text-xs md:text-sm font-[family-name:var(--font-chalk)] text-slate-900/70 font-medium overflow-hidden" style={{ backfaceVisibility: "hidden" }}>
                <p className="font-bold underline mb-2">Cellular Respiration</p>
                <p>C6H12O6 + 6O2 → 6CO2 + 6H2O</p>
                <div className="mt-4 border border-slate-900/40 p-4 rotate-2 opacity-90 font-bold">
                  Mitochondria (Powerhouse)
                </div>
              </div>
              <div className="absolute inset-0 bg-[#fdfbf7] rounded-l-md border-r border-[#d4cfc0] shadow-[5px_0_10px_rgba(0,0,0,0.1)]" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }} />
            </motion.div>

            {/* THE FRONT LEATHER COVER */}
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: phase >= 1 ? -182 : 0 }}
              transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 origin-left"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Outside of the Cover */}
              <div className="absolute inset-0 bg-[#4a2e18] rounded-r-2xl border-y-4 border-r-4 border-l-2 border-[#2b1708] shadow-[5px_0_20px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden" style={{ backfaceVisibility: "hidden" }}>
                <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />

                {/* Decorative leather stitching / embossing */}
                <div className="absolute inset-3 border-2 border-[#3d2411]/50 rounded-xl" />
                <div className="absolute inset-4 border border-[#2b1708]/30 rounded-lg" />

                <div className="relative z-10 p-8 border-4 border-[#3d2411]/50 rounded-full">
                  <BookOpen className="w-16 h-16 text-[#2b1708]/60" />
                </div>
              </div>

              {/* Inside of the Cover (Visible when flipped to the left) */}
              <div className="absolute inset-0 bg-[#3d2411] rounded-l-2xl border-y-4 border-l-4 border-r border-[#2b1708] shadow-[5px_0_20px_rgba(0,0,0,0.6)] flex items-center justify-center" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />
                {/* Inner paper pasted to leather */}
                <div className="absolute inset-y-2 left-4 right-1 bg-[#2b1708] opacity-80 rounded-l-md" />
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* THE MAGIC ZOOM TEXT */}
      <AnimatePresence>
        {phase >= 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0, scale: 3, filter: "blur(20px)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute z-50 flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="flex justify-center items-center gap-6 mt-8">
              <h1 className="text-6xl md:text-8xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-[#d4af37] drop-shadow-[0_0_40px_rgba(212,175,55,0.8)] tracking-tight leading-tight">
                Padhle Bhai
              </h1>
              <span className="text-[100px] md:text-[140px] filter drop-shadow-[0_0_30px_rgba(212,175,55,1)] pointer-events-none -rotate-12 translate-y-4">🫵</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}