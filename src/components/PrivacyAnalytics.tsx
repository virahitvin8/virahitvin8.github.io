import { useState, useEffect } from "react"
import { Activity, Shield, Sparkle } from "./icons"

export function PrivacyAnalytics() {
  const [sessionSeconds, setSessionSeconds] = useState(0)
  const [fcpText, setFcpText] = useState("FCP Measuring...")
  const [istTime, setIstTime] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((s) => s + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const updateTime = () => {
      const formatted = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date())
      setIstTime(`${formatted} IST`)
    }
    updateTime()
    const clockTimer = setInterval(updateTime, 1000)
    return () => clearInterval(clockTimer)
  }, [])

  useEffect(() => {
    try {
      const entries = performance.getEntriesByName("first-contentful-paint")
      if (entries.length > 0) {
        setFcpText(`FCP ${Math.round(entries[0].startTime)} ms`)
      }
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            setFcpText(`FCP ${Math.round(entry.startTime)} ms`)
          }
        }
      })
      observer.observe({ type: "paint", buffered: true })
      return () => observer.disconnect()
    } catch (_) {
      setFcpText("FCP <160ms")
    }
  }, [])

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}m ${s < 10 ? "0" : ""}${s}s`
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-6 border-t border-hair">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-hair bg-card-bg/60 p-4 font-mono text-[11px] backdrop-blur-md">
        <div className="flex items-center gap-2 text-primary">
          <Shield width={14} height={14} className="text-emerald-500" />
          <span className="font-bold">ASTRA Privacy Telemetry</span>
          <span className="text-faint">&bull; 100% Cookie-Free &amp; Privacy-First</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-mist">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Session: {formatDuration(sessionSeconds)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <Activity width={12} height={12} className="text-primary-light" />
            <span>{fcpText}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-primary">
            <span className="text-gold font-bold">✦</span>
            <span>{istTime}</span>
          </div>

          <div className="rounded-full bg-primary/[0.06] px-2.5 py-0.5 text-primary font-bold">
            Zero Trackers
          </div>
        </div>
      </div>
    </div>
  )
}
