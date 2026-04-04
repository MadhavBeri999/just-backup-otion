"use client"

import { useEffect, useRef, useState } from "react"
import { Users, Wifi, WifiOff } from "lucide-react"
import type SimplePeer from "simple-peer"

type Status = "connecting" | "waiting" | "paired" | "disconnected"

export function VirtualLibrary() {
  const [status, setStatus] = useState<Status>("connecting")
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const peerRef = useRef<SimplePeer.Instance | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    let cancelled = false
    let peerInstance: any = null

    async function init() {
      // 1. Get webcam (video only, NO audio)
      let stream: MediaStream
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        })
      } catch {
        console.log("[CoStudy] Webcam not available, using existing session cam")
        return
      }

      if (cancelled) { stream.getTracks().forEach(t => t.stop()); return }

      localStreamRef.current = stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // 2. Load simple-peer dynamically (client-side only)
      const SimplePeer = (await import("simple-peer")).default

      // 3. Connect to WebSocket
      const ws = new WebSocket("ws://localhost:8001/ws/study")
      wsRef.current = ws

      ws.onopen = () => {
        if (!cancelled) setStatus("waiting")
      }

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data)

        if (msg.type === "waiting") {
          setStatus("waiting")
        }

        if (msg.type === "paired") {
          setStatus("paired")
          createPeer(msg.role === "initiator", stream, ws, SimplePeer)
        }

        if (msg.type === "offer" || msg.type === "answer" || msg.type === "ice-candidate") {
          if (peerRef.current) {
            peerRef.current.signal(msg.signal)
          }
        }

        if (msg.type === "partner-disconnected") {
          setStatus("disconnected")
          if (peerRef.current) {
            peerRef.current.destroy()
            peerRef.current = null
          }
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null
          }
        }
      }

      ws.onclose = () => {
        if (!cancelled) setStatus("disconnected")
      }
    }

    function createPeer(initiator: boolean, stream: MediaStream, ws: WebSocket, PeerClass: any) {
      if (peerRef.current) peerRef.current.destroy()

      const peer = new PeerClass({
        initiator,
        stream,
        trickle: true,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ]
        }
      })

      peer.on("signal", (signal: any) => {
        let type = "ice-candidate"
        if (signal.type === "offer") type = "offer"
        else if (signal.type === "answer") type = "answer"
        ws.send(JSON.stringify({ type, signal }))
      })

      peer.on("stream", (remoteStream: any) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream
        }
      })

      peer.on("close", () => {
        setStatus("disconnected")
      })

      peer.on("error", (err: any) => {
        console.error("[CoStudy] Peer error:", err)
      })

      peerRef.current = peer
    }

    init()

    return () => {
      cancelled = true
      if (peerRef.current) { peerRef.current.destroy(); peerRef.current = null }
      if (wsRef.current) { wsRef.current.close(); wsRef.current = null }
      if (localStreamRef.current) { localStreamRef.current.getTracks().forEach(t => t.stop()) }
    }
  }, [])

  return (
    <div className="glass rounded-2xl p-4 border border-white/10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-4 h-4 text-neon-green" />
        <span className="text-xs font-bold text-chalk-white uppercase tracking-[0.15em]">
          Virtual Co-Study
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          {status === "paired" ? (
            <Wifi className="w-3 h-3 text-neon-green" />
          ) : (
            <WifiOff className="w-3 h-3 text-chalk-white/30" />
          )}
          <span className={`text-[10px] font-mono uppercase ${status === "paired" ? "text-neon-green" :
              status === "waiting" ? "text-neon-yellow animate-pulse" :
                status === "disconnected" ? "text-red-400" :
                  "text-chalk-white/30"
            }`}>
            {status === "connecting" && "Connecting..."}
            {status === "waiting" && "Waiting for partner..."}
            {status === "paired" && "Connected"}
            {status === "disconnected" && "Disconnected"}
          </span>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Your Camera */}
        <div className="relative">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full aspect-video rounded-xl bg-black/60 object-cover border border-white/10"
          />
          <span className="absolute bottom-2 left-2 text-[9px] font-bold text-chalk-white/60 bg-black/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
            You
          </span>
        </div>

        {/* Partner Camera */}
        <div className="relative">
          {status === "paired" ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full aspect-video rounded-xl bg-black/60 object-cover border border-neon-green/30"
            />
          ) : (
            <div className="w-full aspect-video rounded-xl bg-black/40 border border-white/5 flex items-center justify-center">
              <span className="text-[10px] text-chalk-white/20 uppercase tracking-widest text-center px-4">
                {status === "waiting" ? "Waiting for\npartner..." :
                  status === "disconnected" ? "Partner left" : "..."}
              </span>
            </div>
          )}
          <span className="absolute bottom-2 left-2 text-[9px] font-bold text-chalk-white/60 bg-black/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Partner
          </span>
        </div>
      </div>
    </div>
  )
}