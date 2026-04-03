"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChalkboardLayout } from "@/components/chalkboard-layout"
import { GlassCard } from "@/components/glass-card"
import {
  ArrowLeft,
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle,
  Download,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export default function AnalyticsPage() {
  const params = useParams()
  const childId = params.childId as string

  const [loading, setLoading] = useState(true)
  const [weeklyDailyData, setWeeklyDailyData] = useState<any[]>([])
  const [recentTopics, setRecentTopics] = useState<any[]>([])
  const [weeklySummary, setWeeklySummary] = useState({
    totalStudyMinutes: 0,
    totalAlerts: 0,
    completedTasks: 0,
    totalQueries: 0,
  })

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const numericId = childId.replace(/\D/g, "")
        const res = await fetch(`http://localhost:8001/analytics/child/${numericId}/details`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (res.ok) {
          const data = await res.json()
          setWeeklySummary(data.summary)
          setWeeklyDailyData(data.weeklyDailyData)
          setRecentTopics(data.recentTopics)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [childId])

  const handleDownloadReport = () => {
    console.log("Downloading report for", childId)
  }

  if (loading) return null

  return (
    <ChalkboardLayout>
      <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10"
        >
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-chalk-white/60 hover:text-chalk-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-chalk-white font-[family-name:var(--font-chalk)] chalk-text">
                Weekly Analytics
              </h1>
              <p className="text-chalk-white/50 text-sm">Performance breakdown for {childId}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadReport}
            className="px-5 py-2.5 rounded-xl glass text-chalk-white font-medium text-sm flex items-center gap-2 hover:bg-chalk-white/10"
          >
            <Download className="w-4 h-4" />
            Download Report
          </motion.button>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            {
              label: "Total Study Time",
              value: `${Math.floor(weeklySummary.totalStudyMinutes / 60)}h ${weeklySummary.totalStudyMinutes % 60}m`,
              icon: Clock,
              color: "text-neon-blue",
              glow: "blue" as const,
            },
            {
              label: "Total Alerts",
              value: weeklySummary.totalAlerts.toString(),
              icon: AlertTriangle,
              color: "text-neon-pink",
              glow: "pink" as const,
            },
            {
              label: "Completed Tasks",
              value: weeklySummary.completedTasks.toString(),
              icon: CheckCircle,
              color: "text-neon-green",
              glow: "green" as const,
            },
            {
              label: "Buddy AI Queries",
              value: weeklySummary.totalQueries.toString(),
              icon: MessageCircle,
              color: "text-neon-yellow",
              glow: "yellow" as const,
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard glow={stat.glow} hover={false} className="p-5">
                <stat.icon className={`w-6 h-6 ${stat.color} mb-3`} />
                <p className="text-2xl font-bold text-chalk-white">{stat.value}</p>
                <p className="text-xs text-chalk-white/40 mt-1">{stat.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard hover={false}>
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-4 h-4 text-neon-blue" />
                <span className="text-sm font-semibold text-chalk-white">Daily Study Minutes</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyDailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(20,20,35,0.9)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#e8e4df",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="studyMinutes"
                      stroke="#38bdf8"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#38bdf8" }}
                      activeDot={{ r: 7 }}
                      name="Study Minutes"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          {/* Bar Chart - Alerts vs Queries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard hover={false}>
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="w-4 h-4 text-neon-pink" />
                <span className="text-sm font-semibold text-chalk-white">Focus Alerts vs Buddy AI Queries</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyDailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(20,20,35,0.9)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#e8e4df",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="alerts" fill="#ec4899" radius={[6, 6, 0, 0]} name="Focus Alerts" />
                    <Bar dataKey="queries" fill="#eab308" radius={[6, 6, 0, 0]} name="AI Queries" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* REVISION GEN-Z Style Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard hover={false}>
            <h3 className="text-xl font-black text-neon-yellow uppercase tracking-tight mb-6 flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              Topics you need to revise one more time !!
            </h3>

            {recentTopics.length === 0 ? (
              <p className="text-chalk-white/40 text-sm">No recent AI queries made yet. Get studying!</p>
            ) : (
              <div className="flex flex-col gap-4">
                {recentTopics.map((t, idx) => (
                  <div key={idx} className="bg-black/20 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-5 h-5 text-neon-blue mt-1 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-chalk-white">{t.prompt}</p>
                        <p className="text-xs text-chalk-white/40 mt-1">
                          {new Date(t.created_at).toLocaleDateString()} at {new Date(t.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-neon-pink/10 text-neon-pink text-[10px] font-black uppercase tracking-widest rounded-full border border-neon-pink/20 whitespace-nowrap self-start md:self-auto">
                      Needs Revision
                    </span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </ChalkboardLayout>
  )
}
