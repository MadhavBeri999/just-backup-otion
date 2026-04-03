"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, Loader2 } from "lucide-react"

interface Message {
  id: string
  role: "user" | "ai"
  content: string
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: "Hey! I'm your Study Buddy AI. Ask me anything about your study material!",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessageContent = input.trim()
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: userMessageContent }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    try {
      // PHASE 6: Real Backend Connection
      const res = await fetch("http://localhost:8001/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessageContent,
          child_id: 1
        }),
      })

      if (!res.ok) throw new Error("Failed to fetch AI response")

      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai", // Mapped from 'assistant' to 'ai' for UI consistency
          content: data.reply || "I couldn't process that. Try again!",
        },
      ])
    } catch (error) {
      console.error("AI Chat Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: "Sorry, I'm having trouble connecting to my brain right now. Please try again later!",
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="glass rounded-2xl flex flex-col h-80">
      <div className="px-4 py-3 border-b border-chalk-white/10 flex items-center gap-2">
        <Bot className="w-4 h-4 text-neon-blue" />
        <span className="text-sm font-semibold text-chalk-white">Study Buddy AI</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ai" && (
                <div className="w-6 h-6 rounded-full bg-neon-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3 h-3 text-neon-blue" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${msg.role === "user"
                  ? "bg-neon-blue/20 text-chalk-white"
                  : "bg-chalk-white/5 text-chalk-white/80"
                  }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-6 h-6 rounded-full bg-neon-pink/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3 h-3 text-neon-pink" />
                </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2 justify-start"
            >
              <div className="w-6 h-6 rounded-full bg-neon-blue/10 flex items-center justify-center">
                <Loader2 className="w-3 h-3 text-neon-blue animate-spin" />
              </div>
              <div className="bg-chalk-white/5 text-chalk-white/40 rounded-2xl px-3 py-2 text-xs italic">
                Thinking...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-3 border-t border-chalk-white/10 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask anything..."
          disabled={isTyping}
          className="flex-1 bg-chalk-white/5 rounded-xl px-3 py-2 text-sm text-chalk-white placeholder:text-chalk-white/30 focus:outline-none focus:ring-1 focus:ring-neon-blue/40 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={isTyping || !input.trim()}
          className="w-9 h-9 rounded-xl bg-neon-blue/20 flex items-center justify-center hover:bg-neon-blue/30 transition-colors disabled:opacity-50"
        >
          {isTyping ? (
            <Loader2 className="w-4 h-4 text-neon-blue animate-spin" />
          ) : (
            <Send className="w-4 h-4 text-neon-blue" />
          )}
        </button>
      </div>
    </div>
  )
}
