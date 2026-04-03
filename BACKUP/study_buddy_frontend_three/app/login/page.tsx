"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChalkboardLayout } from "@/components/chalkboard-layout"
import { GlassCard } from "@/components/glass-card"
import { Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/libb/api"


export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new URLSearchParams()
      formData.append("username", form.email)
      formData.append("password", form.password)

      const response = await fetch("http://localhost:8001/parent/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error("Login failed")
      }

      localStorage.setItem("token", result.access_token)

      router.push("/dashboard")
    } catch (err) {
      alert("Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ChalkboardLayout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-pink flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-background" />
            </div>
            <h1 className="text-3xl font-bold text-chalk-white font-[family-name:var(--font-chalk)] chalk-text">
              Welcome Back
            </h1>
            <p className="text-chalk-white/50 text-sm mt-2">Time to check on your grinder</p>
          </div>

          <GlassCard glow="blue" hover={false}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-chalk-white/5 rounded-xl px-4 py-3.5 text-chalk-white placeholder:text-chalk-white/30 focus:outline-none focus:ring-2 focus:ring-neon-blue/40 transition-all peer"
                  placeholder=" "
                  id="email"
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-3.5 text-chalk-white/40 text-sm transition-all peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-neon-blue peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                >
                  Email Address
                </label>
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-chalk-white/5 rounded-xl px-4 py-3.5 pr-12 text-chalk-white placeholder:text-chalk-white/30 focus:outline-none focus:ring-2 focus:ring-neon-blue/40 transition-all peer"
                  placeholder=" "
                  id="password"
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 top-3.5 text-chalk-white/40 text-sm transition-all peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-neon-blue peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-chalk-white/40 hover:text-chalk-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-pink text-background font-bold text-base flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-chalk-white/40 text-sm">
                {"Don't have an account?"}{" "}
                <Link href="/register-parent" className="text-neon-blue hover:underline font-medium">
                  Register
                </Link>
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </ChalkboardLayout>
  )
}
