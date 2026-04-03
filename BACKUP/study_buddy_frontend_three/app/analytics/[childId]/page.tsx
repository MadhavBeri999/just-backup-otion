"use client"

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
  TrendingUp,
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

// TODO: GET /analytics/child/{child_id}/weekly-daily-breakdown
const weeklyDailyData = [
  { day: "Mon", studyMinutes: 120, alerts: 2, sessions: 3 },
  { day: "Tue", studyMinutes: 90, alerts: 1, sessions: 2 },
  { day: "Wed", studyMinutes: 150, alerts: 0, sessions: 4 },
  { day: "Thu", studyMinutes: 60, alerts: 3, sessions: 2 },
  { day: "Fri", studyMinutes: 180, alerts: 1, sessions: 5 },
  { day: "Sat", studyMinutes: 200, alerts: 0, sessions: 4 },
  { day: "Sun", studyMinutes: 45, alerts: 2, sessions: 1 },
]

// TODO: GET /analytics/child/{child_id}/weekly-summary-basic
const weeklySummary = {
  totalStudyMinutes: 845,
  totalAlerts: 9,
  completedSessions: 18,
  averageSessionMinutes: 47,
}

export default function AnalyticsPage() {
  const params = useParams()
  const childId = params.childId as string

  const handleDownloadReport = () => {
    // TODO: GET /analytics/child/{child_id}/report/download
    console.log("Downloading report for", childId)
  }

  return (
    <ChalkboardLayout>
      <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
        {/* Header */}
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
              label: "Sessions Done",
              value: weeklySummary.completedSessions.toString(),
              icon: CheckCircle,
              color: "text-neon-green",
              glow: "green" as const,
            },
            {
              label: "Avg Session",
              value: `${weeklySummary.averageSessionMinutes} min`,
              icon: TrendingUp,
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
          {/* Line Chart - Study Minutes */}
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

          {/* Bar Chart - Alerts & Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard hover={false}>
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="w-4 h-4 text-neon-pink" />
                <span className="text-sm font-semibold text-chalk-white">Alerts vs Sessions</span>
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
                    <Bar dataKey="sessions" fill="#22c55e" radius={[6, 6, 0, 0]} name="Sessions" />
                    <Bar dataKey="alerts" fill="#ec4899" radius={[6, 6, 0, 0]} name="Alerts" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Daily Breakdown Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard hover={false}>
            <h3 className="text-lg font-bold text-chalk-white mb-4">Daily Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-chalk-white/10">
                    <th className="text-left py-3 px-4 text-sm font-medium text-chalk-white/50">Day</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-chalk-white/50">Study Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-chalk-white/50">Sessions</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-chalk-white/50">Alerts</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-chalk-white/50">Focus Score</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyDailyData.map((d) => {
                    const focusScore = d.sessions > 0 ? Math.max(0, 100 - d.alerts * 15) : 0
                    return (
                      <tr key={d.day} className="border-b border-chalk-white/5">
                        <td className="py-3 px-4 text-sm text-chalk-white font-medium">{d.day}</td>
                        <td className="py-3 px-4 text-sm text-chalk-white/70">{d.studyMinutes} min</td>
                        <td className="py-3 px-4 text-sm text-chalk-white/70">{d.sessions}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-sm font-medium ${
                              d.alerts === 0
                                ? "text-neon-green"
                                : d.alerts <= 1
                                ? "text-neon-yellow"
                                : "text-neon-pink"
                            }`}
                          >
                            {d.alerts}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 rounded-full bg-chalk-white/10 max-w-20">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  focusScore >= 80
                                    ? "bg-neon-green"
                                    : focusScore >= 60
                                    ? "bg-neon-yellow"
                                    : "bg-neon-pink"
                                }`}
                                style={{ width: `${focusScore}%` }}
                              />
                            </div>
                            <span className="text-xs text-chalk-white/50">{focusScore}%</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </ChalkboardLayout>
  )
}
