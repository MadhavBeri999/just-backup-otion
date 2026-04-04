"use client"

import { motion } from "framer-motion"
import { ChalkboardLayout } from "@/components/chalkboard-layout"
import { GlassCard } from "@/components/glass-card"
import { useEffect, useState } from "react"
import {
  Sparkles,
  BarChart3,
  BookOpen,
  Clock,
  AlertTriangle,
  Plus,
  GraduationCap,
  Zap,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [parent, setParent] = useState<any>(null)
  const [children, setChildren] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [recentSessions, setRecentSessions] = useState([])

  useEffect(() => {
    async function loadDashboard() {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          console.log("No token found")
          return
        }

        // =====================
        // 1️⃣ Fetch Parent
        // =====================
        const parentRes = await fetch("http://localhost:8001/parent/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (parentRes.ok) {
          const parentData = await parentRes.json()
          setParent(parentData)
        } else {
          console.log("Parent fetch failed:", parentRes.status)
        }

        // =====================
        // 2️⃣ Fetch Children
        // =====================
        const childRes = await fetch("http://localhost:8001/children/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (childRes.ok) {
          const childData = await childRes.json()
          setChildren(childData)
        } else {
          console.log("Children fetch failed:", childRes.status)
        }

        // =====================
        // 3️⃣ Fetch Dashboard Summary
        // =====================
        const summaryRes = await fetch(
          "http://localhost:8001/analytics/dashboard-summary",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (summaryRes.ok) {
          const summaryData = await summaryRes.json()
          setSummary(summaryData)
        } else {
          console.log("Summary fetch failed:", summaryRes.status)
        }

        // =====================
        // 4️⃣ Fetch Recent Sessions
        // =====================
        const recentSessionsRes = await fetch(
          "http://localhost:8001/sessions/recent",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (recentSessionsRes.ok) {
          const recentSessionsData = await recentSessionsRes.json()

          // Fix duration issue explicitly on frontend if not on backend yet
          const fixedSessions = recentSessionsData.map((session: any) => {
            if (session.start_time && session.end_time) {
              const diffInMs = new Date(session.end_time).getTime() - new Date(session.start_time).getTime()
              const durationMinutes = Math.round(diffInMs / 60000)
              return { ...session, duration_minutes: durationMinutes }
            }
            return session
          })

          setRecentSessions(fixedSessions)
        } else {
          console.log("Recent sessions fetch failed:", recentSessionsRes.status)
        }

      } catch (err) {
        console.log("Dashboard load failed", err)
      }
    }

    loadDashboard()
  }, [])

  return (
    <ChalkboardLayout>
      <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-pink flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-background" />
              </div>
              <h1 className="text-3xl font-bold text-chalk-white font-[family-name:var(--font-chalk)] chalk-text">
                Dashboard
              </h1>
            </div>
            <p className="text-chalk-white/50">
              {parent ? `Welcome back, ${parent.name}!` : "Loading..."}
            </p>
          </div>
          <div className="flex gap-3">
            {children.length > 0 ? (
              <Link href={`/analytics/${children[0].id}`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 rounded-xl glass text-chalk-white font-medium text-sm flex items-center gap-2 hover:bg-chalk-white/10 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-neon-green" />
                  View Full Analytics
                </motion.button>
              </Link>
            ) : (
              <motion.button
                className="px-5 py-2.5 rounded-xl glass text-chalk-white/50 font-medium text-sm flex items-center gap-2 cursor-not-allowed"
              >
                <BarChart3 className="w-4 h-4 text-chalk-white/30" />
                View Full Analytics
              </motion.button>
            )}
            <Link href="/register-child">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-pink text-background font-bold text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Child
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            {
              label: "Total Children",
              value: summary?.total_children ?? 0,
              icon: GraduationCap,
              color: "text-neon-blue",
              bgCard: "bg-neon-blue/10 hover:bg-neon-blue/20 border-neon-blue/20 shadow-[0_4px_20px_rgba(0,184,255,0.05)] hover:shadow-[0_8px_30px_rgba(0,184,255,0.15)]",
              bgIcon: "bg-neon-blue/20",
            },
            {
              label: "Active Sessions",
              value: summary?.active_sessions ?? 0,
              icon: Zap,
              color: "text-neon-green",
              bgCard: "bg-neon-green/10 hover:bg-neon-green/20 border-neon-green/20 shadow-[0_4px_20px_rgba(34,197,94,0.05)] hover:shadow-[0_8px_30px_rgba(34,197,94,0.15)]",
              bgIcon: "bg-neon-green/20",
            },
            {
              label: "Today's Study",
              value: `${summary?.today_study_minutes ?? 0} min`,
              icon: Clock,
              color: "text-neon-yellow",
              bgCard: "bg-neon-yellow/10 hover:bg-neon-yellow/20 border-neon-yellow/20 shadow-[0_4px_20px_rgba(250,204,21,0.05)] hover:shadow-[0_8px_30px_rgba(250,204,21,0.15)]",
              bgIcon: "bg-neon-yellow/20",
            },
            {
              label: "Total Alerts",
              value: summary?.total_alerts ?? 0,
              icon: AlertTriangle,
              color: "text-neon-pink",
              bgCard: "bg-neon-pink/10 hover:bg-neon-pink/20 border-neon-pink/20 shadow-[0_4px_20px_rgba(236,72,153,0.05)] hover:shadow-[0_8px_30px_rgba(236,72,153,0.15)]",
              bgIcon: "bg-neon-pink/20",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard hover={true} className={`p-4 transition-all duration-300 border ${stat.bgCard}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bgIcon}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-chalk-white">{stat.value}</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-chalk-white/60 mt-1">{stat.label}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Children Cards */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-chalk-white mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-neon-blue" />
            Your Children
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children.map((child: any, i: number) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <GlassCard glow={child.status === "studying" ? "green" : "none"}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-pink/20 flex items-center justify-center">
                        <span className="text-lg font-bold text-chalk-white">{child.name[0]}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-chalk-white">{child.name}</h3>
                        <p className="text-sm text-chalk-white/40">Grade {child.grade}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${child.status === "studying"
                        ? "bg-neon-green/20 text-neon-green"
                        : "bg-chalk-white/10 text-chalk-white/40"
                        }`}
                    >
                      {child.status === "studying" ? "Studying Now" : "Idle"}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/child/${child.id}`} className="flex-1">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2.5 rounded-xl glass text-chalk-white font-medium text-sm hover:bg-chalk-white/10 transition-colors flex items-center justify-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        View Tasks
                      </motion.button>
                    </Link>
                    <Link href={`/child/${child.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}

                        className="py-2.5 px-5 rounded-xl bg-neon-green/20 text-neon-green font-bold text-sm flex items-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        Start Grinding
                      </motion.button>
                    </Link>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Sessions */}
        <div>
          <h2 className="text-xl font-bold text-chalk-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-neon-yellow" />
            Recent Sessions
          </h2>
          <GlassCard hover={true} className="bg-chalk-white/5 border border-chalk-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:bg-chalk-white/10 transition-colors">
            <div className="flex flex-col divide-y divide-chalk-white/5">
              {recentSessions.length === 0 ? (
                <div className="py-6 text-center text-chalk-white/40 text-sm">
                  No recent sessions found.
                </div>
              ) : (
                recentSessions.map((session: any) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-chalk-white/5 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-chalk-white/40" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-chalk-white">
                          {session.task?.title ?? "Study Session"}
                        </p>
                        <p className="text-xs text-chalk-white/40">
                          {session.child?.name ?? "Child"} —{" "}
                          {new Date(session.start_time).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-chalk-white/40">
                        {session.duration_minutes ?? 0} min
                      </span>

                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${session.status === "completed"
                          ? "bg-neon-green/20 text-neon-green"
                          : "bg-neon-yellow/20 text-neon-yellow"
                          }`}
                      >
                        {session.status === "completed" ? "Done" : "Active"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </ChalkboardLayout>
  )
}