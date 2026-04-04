"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChalkboardLayout } from "@/components/chalkboard-layout"
import { GlassCard } from "@/components/glass-card"
import { HeartLives } from "@/components/heart-lives"
import { Timer } from "@/components/timer"
import { AIChat } from "@/components/ai-chat"
import { VirtualLibrary } from "@/components/virtual-library"
import { ExitTrapModal } from "@/components/exit-trap-modal"
import Confetti from "react-confetti"
import { loadModel, detectFrame } from "@/ai/detector"
import {
  Video,
  BookOpen,
  MessageCircle,
  ArrowLeft,
  PartyPopper,
  AlertTriangle,
  Loader2,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

type WarningType = "none" | "phone" | "no_face" | "looking_down";

export default function StudySessionPage() {
  const params = useParams()
  const sessionId = params.sessionId as string
  const videoRef = useRef<HTMLVideoElement>(null)

  // 1. STATE MANAGEMENT
  const [loading, setLoading] = useState(true)
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null)
  const [taskName, setTaskName] = useState("Focus Mission")
  const [childId, setChildId] = useState<string | null>(null)
  const [tasks, setTasks] = useState<any[]>([])

  const [lives, setLives] = useState(5)
  const [showExitTrap, setShowExitTrap] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [webcamActive, setWebcamActive] = useState(false)

  // GAMIFICATION STATES
  const [warning, setWarning] = useState<WarningType>("none")
  const [faceCountdown, setFaceCountdown] = useState<number | null>(null)
  const [showLifeLostAnim, setShowLifeLostAnim] = useState(false)
  const [aiBox, setAiBox] = useState<{ x: number, y: number, w: number, h: number } | null>(null) // Tracks Live WebCam Box

  // 2. REFS
  const gameState = useRef({ isComplete: false, isGameOver: false, lives: 5 })
  const lifeLostAudioRef = useRef<HTMLAudioElement | null>(null)
  const backgroundAlarmRef = useRef<HTMLAudioElement | null>(null)

  const distractionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastPenaltyTime = useRef<number>(0)
  const lastLocation = useRef<{ lat: string, lng: string } | null>(null)
  const winAudioRef = useRef<HTMLAudioElement | null>(null)

  const stopWebcam = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
    }
    setWebcamActive(false);
  }, []);

  // AUDIO HELPERS
  const playBackgroundAlarm = () => {
    if (backgroundAlarmRef.current) {
      backgroundAlarmRef.current.play().catch(() => { });
    }
  }

  const stopBackgroundAlarm = () => {
    if (backgroundAlarmRef.current) {
      backgroundAlarmRef.current.pause();
      backgroundAlarmRef.current.currentTime = 0;
    }
  }

  const playLifeLostAudio = () => {
    if (lifeLostAudioRef.current) {
      lifeLostAudioRef.current.currentTime = 0;
      lifeLostAudioRef.current.play().catch(() => { });
    }
  }

  // 3. EFFECTS & INITIALIZATION
  useEffect(() => {
    gameState.current = { isComplete: sessionComplete, isGameOver: gameOver, lives: lives }
  }, [sessionComplete, gameOver, lives])

  useEffect(() => {
    lifeLostAudioRef.current = new Audio("/lifelost.mp3")
    backgroundAlarmRef.current = new Audio("/alarmtwo.mp3")
    winAudioRef.current = new Audio("/win.mp3")
    if (backgroundAlarmRef.current) {
      backgroundAlarmRef.current.loop = true
    }

    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    const storedChildId = localStorage.getItem("child_id")
    if (storedChildId) {
      setChildId(storedChildId)
    }

    if (typeof loadModel === "function") {
      loadModel()
    }

    // START LIVE LOCATION HEARTBEAT
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          lastLocation.current = {
            lat: pos.coords.latitude.toString(),
            lng: pos.coords.longitude.toString()
          };
        },
        (err) => console.log("Geolocation tracking error", err),
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [])

  // API Fetching
  useEffect(() => {
    async function fetchSessionInfo() {
      const token = localStorage.getItem("token")
      if (!token || !sessionId) return setLoading(false)
      try {
        const res = await fetch(`http://localhost:8001/sessions/${sessionId}/remaining-time`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setRemainingSeconds(data.remaining_seconds)
          if (data.task_title) {
            setTaskName(data.task_title)
            setTasks(prev => prev.length === 0 ? [{ id: data.task_id, title: data.task_title, done: false }] : prev)
          }
        }
      } catch (err) {
        console.error("Session fetch failed:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSessionInfo()
  }, [sessionId])

  useEffect(() => {
    async function fetchObjectives() {
      const token = localStorage.getItem("token")
      if (!token || !childId) return
      try {
        const res = await fetch(`http://localhost:8001/tasks/${childId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setTasks(data.map((t: any) => ({ id: t.id, title: t.title, done: t.status === "completed" })))
        }
      } catch (err) {
        console.error("fetch failed:", err)
      }
    }
    if (childId) fetchObjectives()
  }, [childId])

  const endSessionAPI = async (isDefeat: boolean = false) => {
    const token = localStorage.getItem("token")
    if (token) {
      let latLngStr = ""
      if (lastLocation.current) {
        latLngStr = `&lat=${lastLocation.current.lat}&lng=${lastLocation.current.lng}`
      } else if ("geolocation" in navigator) {
        try {
          const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3000 }))
          latLngStr = `&lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`
        } catch (e) {
          console.log("Geolocation fallback error", e)
        }
      }
      const statusParams = isDefeat ? `?status=terminated${latLngStr}` : `?status=completed${latLngStr}`
      await fetch(`http://localhost:8001/sessions/${sessionId}/end${statusParams}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        keepalive: true
      }).catch(() => { })
    }
  }

  const completeTaskAPI = async (taskId: number) => {
    const token = localStorage.getItem("token")
    if (token) {
      fetch(`http://localhost:8001/tasks/${taskId}/complete`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => { })
    }
  }

  const reportAlertAPI = async () => {
    const token = localStorage.getItem("token")
    if (token) fetch(`http://localhost:8001/sessions/${sessionId}/alert`, { method: "POST", headers: { Authorization: `Bearer ${token}` } }).catch(() => { })
  }

  // MASTER PUNISHMENT FUNCTION: Locks detection logically with animation
  const triggerDistraction = useCallback((distractionType: "tab-switch" | "back-button" | "cross-button" | "phone" | "no_face" | "looking_down") => {
    if (gameState.current.isComplete || gameState.current.isGameOver) return;

    reportAlertAPI();
    playLifeLostAudio();

    // Show Broken Heart Animation
    setShowLifeLostAnim(true);
    setTimeout(() => setShowLifeLostAnim(false), 2500);

    // Life Deduction
    setLives((prev) => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setGameOver(true);
        stopWebcam();
        stopBackgroundAlarm();
        endSessionAPI(true);
      }
      return Math.max(0, newLives);
    });
  }, [sessionId, stopWebcam]);

  // LIVE AI PARSING (Now accepts the exact box from detector.ts)
  const handleAIDetection = useCallback((type: "phone" | "no_face" | "face_present" | "looking_down", bbox?: [number, number, number, number]) => {
    if (gameState.current.isComplete || gameState.current.isGameOver) return;

    // Box Positioning Logic
    if (bbox && videoRef.current) {
      const videoW = videoRef.current.videoWidth || 640;
      const videoH = videoRef.current.videoHeight || 480;

      // Calculate Relative Percentages so drawn box maps accurately onto CSS layout!
      setAiBox({
        x: (bbox[0] / videoW) * 100,
        y: (bbox[1] / videoH) * 100,
        w: (bbox[2] / videoW) * 100,
        h: (bbox[3] / videoH) * 100
      });
    } else {
      setAiBox(null);
    }

    const now = Date.now();

    // 1. ALL CLEAR
    if (type === "face_present") {
      if (warning !== "none") {
        setWarning("none");
        setFaceCountdown(null);
        if (distractionTimerRef.current) clearTimeout(distractionTimerRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        distractionTimerRef.current = null;
        countdownIntervalRef.current = null;
      }
      return;
    }

    // 2. LIVE PHONE DETECTED!
    if (type === "phone") {
      if (warning === "phone") return;
      if (now - lastPenaltyTime.current < 2000) return; // 2s cooldown — catches phone FAST

      setWarning("phone");
      triggerDistraction("phone"); // <- Hits game logic!
      lastPenaltyTime.current = now;

      setTimeout(() => setWarning("none"), 2500);
    }

    // 3. NO FACE / AFK
    if (type === "no_face" && warning !== "no_face") {
      setWarning("no_face");
      distractionTimerRef.current = setTimeout(() => {
        setFaceCountdown(5);

        countdownIntervalRef.current = setInterval(() => {
          setFaceCountdown((prev) => {
            if (prev === null) return null;
            if (prev <= 1) {
              triggerDistraction("no_face"); // <- Hits game logic!
              lastPenaltyTime.current = Date.now();
              clearInterval(countdownIntervalRef.current!);
              setFaceCountdown(null);
              setWarning("none");
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      }, 1000);
    }
  }, [warning, triggerDistraction]);


  // NAVIGATION TRAPS (Back Arrow / Cross Arrow) -> Shows Question
  const handleBackButton = () => {
    if (gameState.current.isComplete || gameState.current.isGameOver) {
      window.location.href = "/dashboard";
      return;
    }
    triggerDistraction("back-button");
    setShowExitTrap(true);
  };

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      if (!gameState.current.isComplete && !gameState.current.isGameOver) {
        handleBackButton();
      }
    };
    window.addEventListener("popstate", handlePopState);

    // BROWSER (CROSS SIGN) CLOSURE LOGIC
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!gameState.current.isComplete && !gameState.current.isGameOver) {
        triggerDistraction("cross-button");
        const msg = "Do you accept your defeat?";
        e.preventDefault();
        e.returnValue = msg;
        return msg;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // FATAL TEARDOWN FETCH (When user genuinely forces app closed)
    const handleUnload = () => {
      if (!gameState.current.isComplete && !gameState.current.isGameOver) {
        const token = localStorage.getItem("token");
        if (token) {
          let latLngStr = "";
          if (lastLocation.current) {
            latLngStr = `&lat=${lastLocation.current.lat}&lng=${lastLocation.current.lng}`;
          }
          fetch(`http://localhost:8001/sessions/${sessionId}/end?status=terminated${latLngStr}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            keepalive: true
          }).catch(() => { });
        }
      }
    };
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [sessionId, triggerDistraction]);

  // TAB SWITCH / MINIMIZE TRAP -> alarmtwo.mp3 Loops
  useEffect(() => {
    let originalTitle = document.title;
    const handleVisibilityChange = () => {
      if (document.hidden && !gameState.current.isComplete && !gameState.current.isGameOver) {
        document.title = "🚨 TAB SWITCHED! (-1 LIFE) 🚨";

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("🚨 STUDY SESSION WARNING", {
            body: "Tab switched or window minimized! You lost 1 life! Return immediately to avoid failure.",
            icon: "/favicon.ico"
          });
        }

        triggerDistraction("tab-switch"); // Uses animation & playLifeLostAudio internally

        playBackgroundAlarm(); // Starts LOOPING sound ONLY when you look away
      } else if (!document.hidden) {
        document.title = originalTitle;
        stopBackgroundAlarm(); // Turns off when you return!
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [triggerDistraction]);


  // WEBCAM SETUP
  useEffect(() => {
    async function startWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setWebcamActive(true)
        }
      } catch {
        console.log("Webcam denied")
      }
    }
    startWebcam()
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  // FIRE LIVE AI DETECTOR
  useEffect(() => {
    let interval: any
    if (webcamActive && videoRef.current) {
      interval = setInterval(() => {
        if (typeof detectFrame === "function") {
          // Passes UI's React Callback directly to actual tensor inference handler!
          detectFrame(videoRef.current!, handleAIDetection)
        }
      }, 1500)
    }
    return () => clearInterval(interval)
  }, [webcamActive, handleAIDetection])

  const handleTimerComplete = useCallback(async () => {
    if (gameState.current.isGameOver) return;
    setSessionComplete(true);
    stopWebcam();
    if (winAudioRef.current) winAudioRef.current.play().catch(() => { });
    await endSessionAPI();
  }, [sessionId, stopWebcam]);

  const handleDoneClick = async () => {
    if (gameState.current.isGameOver || gameState.current.isComplete) return;

    // Mark task as complete if tasks exist
    if (tasks.length > 0 && tasks[0].id) {
      await completeTaskAPI(tasks[0].id)
    }

    setSessionComplete(true);
    stopWebcam();
    if (winAudioRef.current) winAudioRef.current.play().catch(() => { });
    await endSessionAPI();
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-neon-blue animate-spin" />
        <p className="text-chalk-white/30 text-xs tracking-widest uppercase font-mono tracking-tighter">Initializing Strict Protocol...</p>
      </div>
    )
  }

  return (
    <ChalkboardLayout>

      {/* 💔 EPIC LIFE CRACK ANIMATION (Gen Z Style) 💔 */}
      <AnimatePresence>
        {showLifeLostAnim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center pointer-events-none bg-red-950/40 backdrop-blur-[2px]"
          >
            <motion.div
              initial={{ scale: 0.2 }}
              animate={{ scale: [0.2, 1.2, 1] }}
              className="text-[180px] filter drop-shadow-[0_0_80px_rgba(239,68,68,1)]"
            >💔</motion.div>
            <h2 className="text-6xl font-black text-red-500 uppercase tracking-tighter bg-black/80 px-8 py-3 rounded-2xl border-2 border-red-500 shadow-xl">
              -1 LIFE 💀
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GAME OVER */}
      <AnimatePresence>
        {gameOver && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-red-950/95 backdrop-blur-2xl" />
            <div className="relative glass-strong rounded-3xl p-10 max-w-lg w-full text-center border border-red-500/50 shadow-2xl">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h2 className="text-4xl font-black text-red-500 mb-4 uppercase">Focus Broken</h2>
              <button
                onClick={() => window.location.href = "/dashboard"}
                className="w-full py-5 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 font-bold uppercase hover:bg-red-600/40"
              >
                Accept Defeat
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS */}
      <AnimatePresence>
        {sessionComplete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 z-[101] pointer-events-none">
              {typeof window !== "undefined" && (
                <Confetti
                  width={window.innerWidth}
                  height={window.innerHeight}
                  recycle={false}
                  numberOfPieces={500}
                  gravity={0.15}
                />
              )}
            </div>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <div className="relative z-[102] glass-strong rounded-3xl p-10 max-w-lg w-full text-center border border-white/10">
              <PartyPopper className="w-16 h-16 text-neon-yellow mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-chalk-white mb-2 uppercase">Mission Succeeded</h2>
              <Link href="/dashboard">
                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-pink text-white font-bold uppercase mt-8 opacity-90 hover:opacity-100">
                  Back to Dashboard
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={handleBackButton} className="w-10 h-10 rounded-xl glass flex items-center justify-center text-chalk-white/40 hover:text-white border border-white/5 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-chalk-white uppercase tracking-wider">Strict Focus Mode</h1>
            </div>
          </div>
          <HeartLives maxLives={5} currentLives={lives} />
        </div>

        <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 px-2">
          <div className="lg:col-span-3 flex flex-col gap-6">
            <GlassCard hover={false} className="border-white/5 p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-chalk-white uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> AI Monitoring Live
                </span>
                {/* 🔧 DEVELOPMENT TESTING BUTTONS 🔧 */}
                <div className="flex gap-2">
                  <button onClick={() => handleAIDetection("face_present")} className="px-2 py-1 bg-black/60 text-[10px] text-white rounded border border-white/20 hover:bg-black/80">Reset</button>
                  <button onClick={() => handleAIDetection("phone")} className="px-2 py-1 bg-black/60 text-[10px] text-neon-pink rounded border border-neon-pink/50 hover:bg-neon-pink/20">Test Phone</button>
                  <button onClick={() => handleAIDetection("looking_down")} className="px-2 py-1 bg-black/60 text-[10px] text-neon-pink rounded border border-neon-pink/50 hover:bg-neon-pink/20">Test Gaze</button>
                  <button onClick={() => handleAIDetection("no_face")} className="px-2 py-1 bg-black/60 text-[10px] text-red-500 rounded border border-red-500/50 hover:bg-red-500/20">Test AFK</button>
                </div>
              </div>

              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/60 border border-white/5">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover contrast-110" />

                {/* AI OVERLAYS */}
                <div className="absolute inset-0 pointer-events-none z-10 w-full h-full">

                  {/* LIVE MOVING DYNAMIC BOUNDING BOX! (For generic Subject Tracking) */}
                  {aiBox && warning === "none" && webcamActive && (
                    <motion.div
                      className="absolute border-2 border-neon-green/80 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all duration-300 pointer-events-none"
                      style={{
                        left: `${aiBox.x}%`,
                        top: `${aiBox.y}%`,
                        width: `${aiBox.w}%`,
                        height: `${aiBox.h}%`
                      }}
                    />
                  )}

                  {/* Phone Detected or Looking Down - DYNAMIC BOX WRAPPER TARGET */}
                  <AnimatePresence>
                    {(warning === "phone" || warning === "looking_down") && aiBox && (
                      <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute border-4 border-neon-pink shadow-[0_0_30px_rgba(236,72,153,0.8)] rounded-xl animate-pulse backdrop-blur-[1px] pointer-events-none flex items-end justify-center pb-2 transition-all duration-300"
                        style={{
                          left: `${aiBox.x}%`, top: `${aiBox.y}%`, width: `${aiBox.w}%`, height: `${aiBox.h}%`
                        }}
                      >
                        {/* WARNING POP OUT BELOW THE BOX OF THE PHONE */}
                        <div className="absolute -bottom-10 bg-neon-pink text-white font-black px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase shadow-[0_0_20px_rgba(236,72,153,0.6)] whitespace-nowrap">
                          {warning === "phone" ? "⚠️ PHONE DETECTED" : "⚠️ SUSPICIOUS HEAD TILT (POSSIBLE PHONE)"}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* No Face - WARNING + COUNTDOWN OVERLAY FULL SCREEN */}
                  <AnimatePresence>
                    {warning === "no_face" && faceCountdown !== null && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-red-900/40 backdrop-blur-[3px] flex items-center justify-center transition-all duration-500">
                        <div className="bg-black/95 p-8 rounded-3xl border border-red-500/50 text-center shadow-[0_0_50px_rgba(239,68,68,0.3)]">
                          <div className="text-red-500 font-bold uppercase tracking-[0.2em] mb-2 animate-pulse">Subject Missing</div>
                          <div className="text-7xl font-black text-white mix-blend-difference mb-4">{faceCountdown}</div>
                          <div className="text-[10px] text-red-400 font-mono bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/20">RE-ESTABLISH VISUALS NOW</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </GlassCard>

            {remainingSeconds !== null && (
              <GlassCard hover={false} glow="blue" className="border-white/5">
                <Timer
                  durationMinutes={Math.ceil(remainingSeconds / 60)}
                  taskName={taskName}
                  onComplete={handleTimerComplete}
                />
              </GlassCard>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDoneClick}
              className="w-full py-4 rounded-xl bg-neon-green/20 border border-neon-green/50 text-neon-green font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neon-green/30 transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              Mark Module as Done
            </motion.button>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <GlassCard hover={false} className="border-white/5">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-4 h-4 text-neon-yellow" />
                <span className="text-xs font-bold text-chalk-white uppercase tracking-[0.15em]">Objectives</span>
              </div>
              <div className="flex flex-col gap-3">
                {tasks.length > 0 ? (
                  tasks.map((task, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border ${task.done ? "bg-neon-green/5 border-neon-green/20" : "bg-white/5 border-white/5"}`}>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${task.done ? "border-neon-green bg-neon-green/20" : "border-white/20"}`}>
                        {task.done && <svg className="w-3 h-3 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className={`text-xs font-medium ${task.done ? "text-chalk-white/30 line-through" : "text-chalk-white"}`}>{task.title}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-4 p-4 rounded-xl border bg-white/5 border-white/5">
                    <div className="w-5 h-5 rounded-md border-2 border-white/20" />
                    <span className="text-xs font-medium text-chalk-white">{taskName}</span>
                  </div>
                )}
              </div>
            </GlassCard>

            <div className="flex flex-col gap-4">
              {showChat ? (
                <div className="h-full min-h-[400px] border-2 border-neon-pink/40 rounded-3xl p-1 bg-neon-pink/5 shadow-[0_0_20px_rgba(236,72,153,0.1)] relative overflow-hidden">
                  <button onClick={() => setShowChat(false)} className="w-full text-center text-[10px] text-neon-pink/60 mb-2 hover:text-neon-pink transition-colors font-bold uppercase tracking-widest pt-2">HIDE BESTIE</button>
                  <AIChat />
                </div>
              ) : (
                <motion.button
                  animate={{ y: [0, -4, 0], scale: [1, 1.02, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  onClick={() => setShowChat(true)}
                  className="w-full relative overflow-hidden py-6 rounded-3xl glass font-bold uppercase tracking-widest flex flex-col items-center justify-center gap-3 bg-neon-pink/10 hover:bg-neon-pink/20 transition-all border-2 border-neon-pink/50 group shadow-[0_0_30px_rgba(236,72,153,0.3)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/20 via-neon-purple/20 to-neon-blue/20 opacity-50 animate-pulse pointer-events-none" />
                  <MessageCircle className="w-8 h-8 text-neon-pink group-hover:scale-110 transition-transform relative z-10 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                  <span className="relative z-10 text-center font-black text-neon-pink text-[11px] drop-shadow-md tracking-wider leading-relaxed">
                    Wassup bestie! ✨<br />I'm your AI Buddy, no cap.
                  </span>
                </motion.button>
              )}
            </div>

            {/* Virtual Co-Study Library */}
            <VirtualLibrary />
          </div>
        </div>
      </div>

      <ExitTrapModal
        isOpen={showExitTrap && !gameOver}
        onStay={() => setShowExitTrap(false)}
        onConfirmExit={async () => {
          await endSessionAPI(true);
          window.location.href = "/dashboard";
        }}
      />
    </ChalkboardLayout>
  )
}