"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChalkboardLayout } from "@/components/chalkboard-layout"
import { GlassCard } from "@/components/glass-card"
import { TaskCard } from "@/components/task-card"
import {
  Plus,
  ArrowLeft,
  Clock,
  BookOpen,
  X,
} from "lucide-react"
import Link from "next/link"
import { useRouter, useParams, useSearchParams } from "next/navigation"

const priorities = ["Low", "Medium", "High"] as const

export default function ChildTaskPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const childId = params.childId as string
  const activeSessionId = searchParams.get("session")

  const [tasks, setTasks] = useState<any[]>([])
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    subject: "",
    duration_minutes: "",
    priority: "Medium" as typeof priorities[number],
  })
  const [remainingTime, setRemainingTime] = useState<number | null>(null)

  // 🔥 Fetch Tasks (Working Backend)
  useEffect(() => {
    async function fetchTasks() {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const res = await fetch(`http://localhost:8001/tasks/${childId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
          const data = await res.json()
          setTasks(data)
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error)
      }
    }

    if (childId) fetchTasks()
  }, [childId])

  // 🔥 Fetch Remaining Session Time
  useEffect(() => {
    if (!activeSessionId) return

    const fetchRemainingTime = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const res = await fetch(
          `http://localhost:8001/sessions/${activeSessionId}/remaining-time`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!res.ok) return

        const data = await res.json()
        setRemainingTime(data.remaining_seconds)
      } catch (error) {
        console.error("Failed to fetch remaining time:", error)
      }
    }

    fetchRemainingTime()
  }, [activeSessionId])

  // 🔥 Countdown Timer
  useEffect(() => {
    if (remainingTime === null || remainingTime <= 0) return

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev === null) return null
        if (prev <= 1) {
          clearInterval(interval)
          alert("Session completed!")
          router.push(`/child/${childId}`)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [remainingTime, router, childId])

  // 🔥 Add Task
  const handleAddTask = async () => {
    const token = localStorage.getItem("token")
    if (!token || !newTask.title) return

    try {
      const res = await fetch("http://localhost:8001/tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newTask,
          duration_minutes: Number(newTask.duration_minutes),
          child_id: Number(childId),
        }),
      })

      if (res.ok) {
        const created = await res.json()
        setTasks((prev) => [...prev, created])
        setShowAddTask(false)
        setNewTask({ title: "", subject: "", duration_minutes: "", priority: "Medium" })
      }
    } catch (error) {
      console.error("Failed to add task:", error)
    }
  }

  // 🔥 Start Grinding (Session Logic)
  const handleStartGrinding = async (taskId: number) => {
    const token = localStorage.getItem("token")
    if (!token) return
    localStorage.setItem("child_id", childId);

    try {
      // 1️⃣ Check if active session exists
      const activeRes = await fetch(
        `http://localhost:8001/sessions/child/${childId}/active`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (activeRes.ok) {
        const activeSession = await activeRes.json()
        router.push(`/child/${childId}?session=${activeSession.id}`)
        return
      }

      // 2️⃣ Otherwise create new session
      const res = await fetch("http://localhost:8001/sessions/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          child_id: Number(childId),
          task_id: taskId,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        alert(err.detail || "Failed to start session")
        return
      }

      const session = await res.json()
      router.push(`/study-session/${session.id}`)
    } catch (error) {
      console.error("Failed to start session:", error)
    }
  }

  return (
    <ChalkboardLayout>
      <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <button className="w-10 h-10 rounded-xl glass flex items-center justify-center text-chalk-white/60 hover:text-chalk-white transition-all">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-chalk-white chalk-text">
                Study Tasks
              </h1>
              <p className="text-chalk-white/50 text-sm">Child ID: {childId}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddTask(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-pink text-background font-bold text-sm flex items-center gap-2 shadow-lg shadow-neon-blue/20"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </motion.button>
        </motion.div>

        {/* Active Session Indicator */}
        <AnimatePresence>
          {activeSessionId && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 p-6 rounded-2xl glass-strong border border-neon-green/30 bg-neon-green/5 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-neon-green font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Active Session Running
                  </h3>
                  <p className="text-chalk-white/40 text-xs mt-1">ID: {activeSessionId}</p>
                </div>

                {remainingTime !== null && (
                  <div className="text-3xl font-bold text-neon-green font-mono">
                    {Math.floor(remainingTime / 60)}:
                    {(remainingTime % 60).toString().padStart(2, "0")}
                  </div>
                )}

                <button
                  onClick={async () => {
                    const token = localStorage.getItem("token")
                    if (!token) return
                    await fetch(`http://localhost:8001/sessions/${activeSessionId}/end`, {
                      method: "POST",
                      headers: { Authorization: `Bearer ${token}` },
                    })
                    router.push(`/child/${childId}`)
                  }}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-6 py-2 rounded-xl transition-all font-bold text-sm"
                >
                  End Session
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlassCard hover={false} className="p-4 border-none bg-black/20">
              <p className="text-2xl font-bold text-chalk-white">{tasks.length}</p>
              <p className="text-xs text-chalk-white/40 uppercase tracking-wider">Total Tasks</p>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard hover={false} className="p-4 border-none bg-black/20">
              <p className="text-2xl font-bold text-neon-yellow">
                {tasks.filter((t) => t.status !== "completed").length}
              </p>
              <p className="text-xs text-chalk-white/40 uppercase tracking-wider">Pending</p>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <GlassCard hover={false} className="p-4 border-none bg-black/20">
              <p className="text-2xl font-bold text-neon-green">
                {tasks.filter((t) => t.status === "completed").length}
              </p>
              <p className="text-xs text-chalk-white/40 uppercase tracking-wider">Completed</p>
            </GlassCard>
          </motion.div>
        </div>

        {/* Task List */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TaskCard
                  title={task.title}
                  subject={task.subject}
                  duration={task.duration_minutes}
                  priority={task.priority}
                  status={task.status}
                  onStartGrinding={() => handleStartGrinding(task.id)}
                  hideStartGrinding={task.status === "completed"}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ADD TASK MODAL */}
        <AnimatePresence>
          {showAddTask && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-md"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
              >
                <GlassCard glow="blue" hover={false} className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-chalk-white">
                      New Study Task
                    </h2>
                    <button onClick={() => setShowAddTask(false)} className="text-chalk-white/40 hover:text-chalk-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    <input
                      placeholder="Task Title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-chalk-white/5 text-chalk-white border border-chalk-white/10 focus:outline-none focus:ring-2 focus:ring-neon-blue/40 transition-all placeholder:text-chalk-white/30"
                    />
                    <input
                      placeholder="Subject"
                      value={newTask.subject}
                      onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-chalk-white/5 text-chalk-white border border-chalk-white/10 focus:outline-none focus:ring-2 focus:ring-neon-blue/40 transition-all placeholder:text-chalk-white/30"
                    />
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-chalk-white/30 ml-2" />
                      <input
                        type="number"
                        placeholder="Duration (minutes)"
                        value={newTask.duration_minutes}
                        onChange={(e) => setNewTask({ ...newTask, duration_minutes: e.target.value })}
                        className="flex-1 px-4 py-3 rounded-xl bg-chalk-white/5 text-chalk-white border border-chalk-white/10 focus:outline-none focus:ring-2 focus:ring-neon-blue/40 transition-all placeholder:text-chalk-white/30"
                      />
                    </div>

                    <div className="flex gap-2">
                      {priorities.map((p) => (
                        <button
                          key={p}
                          onClick={() => setNewTask({ ...newTask, priority: p })}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${newTask.priority === p
                            ? p === "High" ? "bg-neon-pink/20 text-neon-pink border-neon-pink/40"
                              : p === "Medium" ? "bg-neon-blue/20 text-neon-blue border-neon-blue/40"
                                : "bg-neon-green/20 text-neon-green border-neon-green/40"
                            : "bg-chalk-white/5 text-chalk-white/40 border-transparent"
                            }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddTask}
                      className="w-full mt-2 bg-gradient-to-r from-neon-blue to-neon-pink text-background py-3 rounded-xl font-bold shadow-lg shadow-neon-blue/20"
                    >
                      Create Task
                    </motion.button>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </ChalkboardLayout>
  )
}
