"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  title: string
  subject: string
  duration: number
  priority: "Low" | "Medium" | "High"
  status: "pending" | "in_progress" | "completed"
  onStartGrinding?: () => void
  hideStartGrinding?: boolean
}

const priorityColors = {
  Low: "bg-neon-green/20 text-neon-green border-neon-green/30",
  Medium: "bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30",
  High: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
}

const statusLabels = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Done",
}

export function TaskCard({ title, subject, duration, priority, status, onStartGrinding, hideStartGrinding = false }: TaskCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-4 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-chalk-white text-base">{title}</h3>
          <p className="text-sm text-chalk-white/50">{subject}</p>
        </div>
        <span
          className={cn(
            "text-xs font-medium px-2.5 py-1 rounded-full border",
            priorityColors[priority]
          )}
        >
          {priority}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-chalk-white/50">
          <span>{duration} min</span>
          <span className="text-chalk-white/30">|</span>
          <span>{statusLabels[status]}</span>
        </div>
        {!hideStartGrinding && status !== "completed" && (
          <button
            onClick={onStartGrinding}
            className="text-xs font-semibold px-4 py-1.5 rounded-xl bg-neon-blue/20 text-neon-blue hover:bg-neon-blue/30 transition-colors"
          >
            Start Grinding
          </button>
        )}
        {(hideStartGrinding || status === "completed") && (
          <span className="text-xs text-neon-green font-medium">Completed</span>
        )}
      </div>
    </motion.div>
  )
}
