"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChalkboardLayout } from "@/components/chalkboard-layout"
import { GlassCard } from "@/components/glass-card"
import { Sparkles, ArrowRight, ArrowLeft, Eye, EyeOff, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const steps = ["Name", "Contact", "Password"]

export default function RegisterParentPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  })

  const handleSubmit = async () => {
    setLoading(true)

    // TODO: POST to /parents or /parent/register with { name, email, mobile, password }
    // TODO: Store JWT from response
    // TODO: Redirect to /register-child on success

    setTimeout(() => {
      setLoading(false)
      router.push("/register-child")
    }, 1000)
  }

  const canProceed = () => {
    if (step === 0) return form.name.trim().length > 0
    if (step === 1) return form.email.trim().length > 0 && form.mobile.trim().length > 0
    if (step === 2) return form.password.trim().length >= 6
    return false
  }

  return (
    <ChalkboardLayout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-pink flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-background" />
            </div>
            <h1 className="text-3xl font-bold text-chalk-white font-[family-name:var(--font-chalk)] chalk-text">
              Parent Registration
            </h1>
            <p className="text-chalk-white/50 text-sm mt-2">{"Set up your account in 3 easy steps"}</p>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8 px-4">
            {steps.map((s, i) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    i <= step
                      ? "bg-gradient-to-r from-neon-blue to-neon-pink text-background"
                      : "bg-chalk-white/10 text-chalk-white/40"
                  }`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${
                      i < step ? "bg-neon-blue" : "bg-chalk-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <GlassCard glow="blue" hover={false}>
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-5"
                >
                  <h2 className="text-lg font-semibold text-chalk-white">{"What's your name?"}</h2>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-chalk-white/5 rounded-xl px-4 py-3.5 text-chalk-white placeholder:text-chalk-white/30 focus:outline-none focus:ring-2 focus:ring-neon-blue/40"
                      placeholder="Full Name"
                      autoFocus
                    />
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-5"
                >
                  <h2 className="text-lg font-semibold text-chalk-white">Contact Details</h2>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-chalk-white/5 rounded-xl px-4 py-3.5 text-chalk-white placeholder:text-chalk-white/30 focus:outline-none focus:ring-2 focus:ring-neon-blue/40"
                    placeholder="Email Address"
                    autoFocus
                  />
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    className="w-full bg-chalk-white/5 rounded-xl px-4 py-3.5 text-chalk-white placeholder:text-chalk-white/30 focus:outline-none focus:ring-2 focus:ring-neon-blue/40"
                    placeholder="Mobile Number"
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-5"
                >
                  <h2 className="text-lg font-semibold text-chalk-white">Create a Password</h2>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full bg-chalk-white/5 rounded-xl px-4 py-3.5 pr-12 text-chalk-white placeholder:text-chalk-white/30 focus:outline-none focus:ring-2 focus:ring-neon-blue/40"
                      placeholder="Min 6 characters"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-chalk-white/40 hover:text-chalk-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-chalk-white/30">At least 6 characters</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(step - 1)}
                  className="px-5 py-3 rounded-xl glass text-chalk-white font-medium text-sm flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!canProceed() || loading}
                onClick={() => (step < 2 ? setStep(step + 1) : handleSubmit())}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-pink text-background font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                ) : step < 2 ? (
                  <>
                    Continue <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-chalk-white/40 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-neon-blue hover:underline font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </ChalkboardLayout>
  )
}
