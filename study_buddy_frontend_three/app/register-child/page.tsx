"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChalkboardLayout } from "@/components/chalkboard-layout"
import { GlassCard } from "@/components/glass-card"
import { Sparkles, ArrowRight, ArrowLeft, Check, Smartphone, Laptop, Tablet } from "lucide-react"
import { useRouter } from "next/navigation"

const steps = ["Info", "School", "Device"]

const deviceTypes = [
  { value: "mobile", label: "Mobile", icon: Smartphone },
  { value: "laptop", label: "Laptop", icon: Laptop },
  { value: "tablet", label: "Tablet", icon: Tablet },
]

export default function RegisterChildPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    age: "",
    grade: "",
    school_name: "",
    device_type: "",
  })

  const handleSubmit = async () => {
    setLoading(true)

    try {
      let token = localStorage.getItem("token");

      if (!token || token === "null") {
        alert("Session expired. Please log in as a parent again.");
        router.push("/");
        return;
      }

      // 1. REGISTER CHILD
      const res = await fetch("http://localhost:8001/children/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          age: parseInt(form.age, 10),
          grade: form.grade,
          school_name: form.school_name,
          device_type: form.device_type,
        }),
      })

      if (res.ok) {
        setTimeout(() => {
          setLoading(false)
          router.push("/dashboard")
        }, 1000)
      } else {
        const errorData = await res.json()
        console.error("Failed to add child:", errorData)
        setLoading(false)
        alert("Failed to add child. Please try again.")
      }
    } catch (err) {
      console.error("Error signing up:", err)
      setLoading(false)
      alert("An error occurred during sign up.")
    }
  }

  const canProceed = () => {
    if (step === 0) return form.name.trim().length > 0 && form.age.trim().length > 0
    if (step === 1) return form.grade.trim().length > 0 && form.school_name.trim().length > 0
    if (step === 2) return form.device_type.length > 0
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
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-background" />
            </div>
            <h1 className="text-3xl font-bold text-chalk-white font-[family-name:var(--font-chalk)] chalk-text">
              Add Your Child
            </h1>
            <p className="text-chalk-white/50 text-sm mt-2">{"Let's set up their study profile"}</p>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8 px-4">
            {steps.map((s, i) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${i <= step
                    ? "bg-gradient-to-r from-neon-green to-neon-blue text-background"
                    : "bg-chalk-white/10 text-chalk-white/40"
                    }`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${i < step ? "bg-neon-green" : "bg-chalk-white/10"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>

          <GlassCard glow="green" hover={false}>
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-5"
                >
                  <h2 className="text-lg font-semibold text-chalk-white">{"Child's Info"}</h2>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-chalk-white/5 rounded-xl px-4 py-3.5 text-chalk-white placeholder:text-chalk-white/30 focus:outline-none focus:ring-2 focus:ring-neon-green/40"
                    placeholder="Child's Full Name"
                    autoFocus
                  />
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    min={5}
                    max={20}
                    className="w-full bg-chalk-white/5 rounded-xl px-4 py-3.5 text-chalk-white placeholder:text-chalk-white/30 focus:outline-none focus:ring-2 focus:ring-neon-green/40"
                    placeholder="Age (10-20)"
                  />
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
                  <h2 className="text-lg font-semibold text-chalk-white">School Details</h2>
                  <input
                    type="text"
                    value={form.grade}
                    onChange={(e) => setForm({ ...form, grade: e.target.value })}
                    className="w-full bg-chalk-white/5 rounded-xl px-4 py-3.5 text-chalk-white placeholder:text-chalk-white/30 focus:outline-none focus:ring-2 focus:ring-neon-green/40"
                    placeholder="Grade (e.g., 10th)"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={form.school_name}
                    onChange={(e) => setForm({ ...form, school_name: e.target.value })}
                    className="w-full bg-chalk-white/5 rounded-xl px-4 py-3.5 text-chalk-white placeholder:text-chalk-white/30 focus:outline-none focus:ring-2 focus:ring-neon-green/40"
                    placeholder="School Name"
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
                  <h2 className="text-lg font-semibold text-chalk-white">Study Device</h2>
                  <p className="text-sm text-chalk-white/50">Which device will they study on?</p>
                  <div className="grid grid-cols-3 gap-3">
                    {deviceTypes.map((d) => (
                      <motion.button
                        key={d.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setForm({ ...form, device_type: d.value })}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${form.device_type === d.value
                          ? "border-neon-green bg-neon-green/10 neon-glow-green"
                          : "border-chalk-white/10 bg-chalk-white/5 hover:border-chalk-white/20"
                          }`}
                      >
                        <d.icon
                          className={`w-8 h-8 ${form.device_type === d.value ? "text-neon-green" : "text-chalk-white/50"
                            }`}
                        />
                        <span
                          className={`text-xs font-medium ${form.device_type === d.value ? "text-neon-green" : "text-chalk-white/50"
                            }`}
                        >
                          {d.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
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
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-neon-green to-neon-blue text-background font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                ) : step < 2 ? (
                  <>
                    Continue <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  "Add Child"
                )}
              </motion.button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </ChalkboardLayout>
  )
}
