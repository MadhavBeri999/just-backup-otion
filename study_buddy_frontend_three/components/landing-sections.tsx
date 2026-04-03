"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import {
  Gamepad2,
  Bot,
  BarChart3,
  MapPin,
  Mail,
  ChevronDown,
  Rocket,
  Sparkles,
} from "lucide-react"

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax chalkboard */}
      <motion.div
        className="absolute inset-0 chalkboard-bg"
        style={{ y: bgY }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a18]/70 via-[#0a0a18]/50 to-[#0a0a18]" />

      <motion.div style={{ opacity }} className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-neon-blue">
            <Sparkles className="w-3 h-3" />
            AI-Powered Study Discipline
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-chalk-white font-[family-name:var(--font-chalk)] leading-tight tracking-tight chalk-text text-balance"
        >
          Stop Lying
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-pink to-neon-yellow">
            To Yourself.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl text-chalk-white/60 mt-6 mb-10 font-medium text-pretty"
        >
          Start Studying. Track focus. Crush distractions. Level up.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/register-parent">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(56,189,248,0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-neon-blue to-neon-pink text-background font-bold text-lg flex items-center gap-2 justify-center"
            >
              {"Let's Get Started"}
              <Rocket className="w-5 h-5" />
            </motion.button>
          </Link>
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-2xl glass text-chalk-white font-semibold text-lg hover:bg-chalk-white/10 transition-colors"
            >
              I Have an Account
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-chalk-white/30"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>
  )
}

/* ─── Lifecycle Timeline ─── */

const steps = [
  {
    step: "01",
    title: "Parent Registers",
    desc: "Create your account & connect with your child",
    color: "neon-blue",
    icon: "register",
  },
  {
    step: "02",
    title: "Child Adds Tasks",
    desc: "Set up study goals and daily tasks",
    color: "neon-pink",
    icon: "tasks",
  },
  {
    step: "03",
    title: "Start Grinding",
    desc: "Focus session begins with live webcam",
    color: "neon-green",
    icon: "grind",
  },
  {
    step: "04",
    title: "AI Detects Distraction",
    desc: "Real-time monitoring catches off-task behavior",
    color: "neon-yellow",
    icon: "detect",
  },
  {
    step: "05",
    title: "Lives Reduce",
    desc: "Minecraft-style hearts drop on each distraction",
    color: "neon-pink",
    icon: "lives",
  },
  {
    step: "06",
    title: "Parent Notified",
    desc: "Instant alerts when focus drops",
    color: "neon-blue",
    icon: "notify",
  },
  {
    step: "07",
    title: "Weekly Report",
    desc: "Full analytics & performance insights",
    color: "neon-green",
    icon: "report",
  },
]

const colorMap: Record<string, string> = {
  "neon-blue": "from-neon-blue/20 border-neon-blue/30 text-neon-blue",
  "neon-pink": "from-neon-pink/20 border-neon-pink/30 text-neon-pink",
  "neon-green": "from-neon-green/20 border-neon-green/30 text-neon-green",
  "neon-yellow": "from-neon-yellow/20 border-neon-yellow/30 text-neon-yellow",
}

const dotColorMap: Record<string, string> = {
  "neon-blue": "bg-neon-blue",
  "neon-pink": "bg-neon-pink",
  "neon-green": "bg-neon-green",
  "neon-yellow": "bg-neon-yellow",
}

const stepNumColor: Record<string, string> = {
  "neon-blue": "text-neon-blue",
  "neon-pink": "text-neon-pink",
  "neon-green": "text-neon-green",
  "neon-yellow": "text-neon-yellow",
}

export function LifecycleTimeline() {
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-chalk-white font-[family-name:var(--font-chalk)] chalk-text mb-4">
            How It Works
          </h2>
          <p className="text-chalk-white/50 text-lg">Your journey from procrastination to productivity</p>
        </motion.div>

        {/* Sticky-note / pin-card style timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-blue/40 via-neon-pink/40 to-neon-green/40 hidden md:block" />

          <div className="flex flex-col gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50, rotate: i % 2 === 0 ? -3 : 3 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative flex ${i % 2 === 0 ? "md:justify-start" : "md:justify-end"} justify-center`}
              >
                {/* Pin dot on timeline */}
                <div className="absolute left-1/2 top-6 -translate-x-1/2 hidden md:block z-10">
                  <div className={`w-4 h-4 rounded-full ${dotColorMap[step.color]} shadow-lg`} />
                </div>

                {/* Card */}
                <div className={`md:w-[45%] w-full`}>
                  <motion.div
                    whileHover={{ rotate: [0, 1, -1, 0], scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                    className={`glass rounded-2xl p-5 border ${colorMap[step.color]} relative`}
                  >
                    {/* Pin */}
                    <div className="absolute -top-2 left-6 w-4 h-4 rounded-full bg-red-500/80 shadow-md border-2 border-red-400/50" />

                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-2xl font-bold font-mono ${stepNumColor[step.color]} opacity-60`}>
                        {step.step}
                      </span>
                      <h3 className="text-lg font-bold text-chalk-white">{step.title}</h3>
                    </div>
                    <p className="text-sm text-chalk-white/60 pl-11">{step.desc}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Feature Pinboard ─── */

const features = [
  {
    icon: Gamepad2,
    title: "Lives System",
    desc: "Minecraft-style hearts. Lose one every time you get distracted.",
    color: "text-neon-pink",
    bg: "bg-neon-pink/10",
    glow: "neon-glow-pink",
    rotate: -2,
  },
  {
    icon: Bot,
    title: "AI Study Buddy",
    desc: "Your personal AI assistant to help you understand tough topics.",
    color: "text-neon-blue",
    bg: "bg-neon-blue/10",
    glow: "neon-glow-blue",
    rotate: 1.5,
  },
  {
    icon: BarChart3,
    title: "Weekly Analytics",
    desc: "Detailed performance breakdowns for parents and students.",
    color: "text-neon-green",
    bg: "bg-neon-green/10",
    glow: "neon-glow-green",
    rotate: -1,
  },
  {
    icon: MapPin,
    title: "Location Alerts",
    desc: "Know exactly where focus sessions are happening.",
    color: "text-neon-yellow",
    bg: "bg-neon-yellow/10",
    glow: "neon-glow-yellow",
    rotate: 2,
  },
  {
    icon: Mail,
    title: "Parent Notifications",
    desc: "Instant alerts when your child gets distracted or loses lives.",
    color: "text-neon-blue",
    bg: "bg-neon-blue/10",
    glow: "neon-glow-blue",
    rotate: -1.5,
  },
]

export function FeaturePinboard() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-chalk-white font-[family-name:var(--font-chalk)] chalk-text mb-4">
            Feature Board
          </h2>
          <p className="text-chalk-white/50 text-lg">Everything you need to stay locked in</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30, rotate: feat.rotate }}
              whileInView={{ opacity: 1, y: 0, rotate: feat.rotate }}
              whileHover={{ rotate: 0, scale: 1.04, y: -5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`glass rounded-2xl p-6 relative cursor-default ${feat.glow}`}
            >
              {/* Pin */}
              <div className="absolute -top-2 right-6 w-5 h-5 rounded-full bg-red-500/80 shadow-lg border-2 border-red-400/50" />

              <div className={`w-12 h-12 rounded-2xl ${feat.bg} flex items-center justify-center mb-4`}>
                <feat.icon className={`w-6 h-6 ${feat.color}`} />
              </div>
              <h3 className="text-lg font-bold text-chalk-white mb-2">{feat.title}</h3>
              <p className="text-sm text-chalk-white/60 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/register-parent">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(56,189,248,0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-neon-blue to-neon-pink text-background font-bold text-lg"
            >
              Join Padhle Bhai 🫵 Now
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Footer ─── */

export function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-chalk-white/5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-neon-blue to-neon-pink flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-background" />
          </div>
          <span className="font-bold text-chalk-white text-lg">Padhle Bhai 🫵</span>
        </div>
        <p className="text-chalk-white/30 text-sm">
          Built for students who are done lying to themselves.
        </p>
      </div>
    </footer>
  )
}
