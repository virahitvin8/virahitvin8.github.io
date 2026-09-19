import { useState, useEffect, useRef } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import { playSound } from "./SoundFX"
import {
  generateCopilotResponse,
  COPILOT_SUGGESTIONS,
  type CopilotMessage,
} from "./CopilotKnowledge"
import {
  Sparkle,
  X,
  FilePdf,
  Mail,
  ArrowUpRight,
  Copy,
  Check,
  RotateCcw,
  Send,
  Bot,
  User,
} from "./icons"

const MEM0_STORAGE_KEY = "akshit_copilot_memory_v1"

const INITIAL_MESSAGES: CopilotMessage[] = [
  {
    id: "init-1",
    role: "assistant",
    text: "Welcome! I am **Akshit's Autonomous AI Copilot** (built on multi-agent RAG patterns). Ask me anything about Akshit's **10.0 CGPA M.Sc Remote Sensing** track record, **CSIR-NGRI research**, **published Sorghum HCN paper**, or **UAV drone mapping** experience.",
    timestamp: "Just now",
  },
]

export function AgentCopilot() {
  const { data, soundEnabled, showToast, toggleTheme } = usePortfolio()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [rememberDevice, setRememberDevice] = useState(() => {
    return localStorage.getItem(MEM0_STORAGE_KEY) !== null
  })
  const [messages, setMessages] = useState<CopilotMessage[]>(() => {
    try {
      const saved = localStorage.getItem(MEM0_STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch (_) {}
    return INITIAL_MESSAGES
  })
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Listen for open-copilot custom events
  useEffect(() => {
    const handleOpen = () => setOpen(true)
    window.addEventListener("open-copilot", handleOpen)
    return () => window.removeEventListener("open-copilot", handleOpen)
  }, [])

  // Mem0 persistent memory layer sync
  useEffect(() => {
    if (rememberDevice) {
      try {
        localStorage.setItem(MEM0_STORAGE_KEY, JSON.stringify(messages))
      } catch (_) {}
    }
  }, [messages, rememberDevice])

  // Scroll chat to bottom on new message
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, open, isTyping])

  const handleSend = (userText: string) => {
    const text = userText.trim()
    if (!text) return

    const userMsg: CopilotMessage = {
      id: "u-" + Date.now(),
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)
    playSound("terminal", soundEnabled)

    setTimeout(() => {
      const resp = generateCopilotResponse(text)
      const botMsg: CopilotMessage = {
        id: "b-" + Date.now(),
        role: "assistant",
        text: resp.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        action: resp.action,
      }
      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
      playSound("blip", soundEnabled)
    }, 450)
  }

  const handleActionClick = (action: CopilotMessage["action"]) => {
    if (!action) return

    if (action.type === "cv") {
      const a = document.createElement("a")
      a.href = data.profile.cvUrl
      a.download = data.profile.resumeName
      a.target = "_blank"
      a.click()
      showToast("Downloading official CV...")
    } else if (action.type === "email") {
      navigator.clipboard.writeText(data.profile.email)
      showToast("Copied email: " + data.profile.email)
      playSound("chime", soundEnabled)
    } else if (action.type === "projects") {
      const el = document.getElementById("projects")
      if (el) el.scrollIntoView({ behavior: "smooth" })
      setOpen(false)
    } else if (action.type === "telemetry") {
      const el = document.getElementById("telemetry")
      if (el) el.scrollIntoView({ behavior: "smooth" })
      setOpen(false)
    }
  }

  const handleClearMemory = () => {
    setMessages(INITIAL_MESSAGES)
    localStorage.removeItem(MEM0_STORAGE_KEY)
    showToast("Agent conversation memory reset ✓")
    playSound("click", soundEnabled)
  }

  return (
    <>
      {/* Floating Agent Launcher Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-[8900]">
        {!open && (
          <button
            onClick={() => {
              setOpen(true)
              playSound("whoosh", soundEnabled)
            }}
            className="group relative flex items-center gap-2.5 rounded-full border border-emerald-500/40 bg-primary px-4 py-3 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-primary-light hover:shadow-primary/25"
            title="Open Akshit AI Research Copilot"
          >
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-xs font-bold tracking-wide">✦ Ask Akshit</span>
            <span className="rounded bg-white/20 px-1.5 py-0.2 font-mono text-[9px] uppercase tracking-wider">
              Copilot
            </span>
          </button>
        )}
      </div>

      {/* Copilot Drawer / Modal */}
      {open && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-[9500] flex flex-col w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh] rounded-3xl border border-primary/30 bg-card-bg shadow-2xl backdrop-blur-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-hair bg-primary/[0.04] px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/25">
                <Sparkle width={16} height={16} />
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-sm font-bold text-primary">Akshit AI Copilot</h3>
                  <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 font-mono text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                    Mem0 Active
                  </span>
                </div>
                <p className="font-mono text-[10px] text-faint">
                  Autonomous Multi-Agent RAG Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearMemory}
                className="rounded-lg p-1.5 text-faint hover:text-ink transition"
                title="Reset Agent Memory"
              >
                <RotateCcw width={14} height={14} />
              </button>
              <button
                onClick={() => {
                  setOpen(false)
                  playSound("click", soundEnabled)
                }}
                className="rounded-lg p-1.5 text-faint hover:text-ink transition"
                title="Close Copilot"
              >
                <X width={16} height={16} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs scroll-smooth">
            {messages.map((m) => {
              const isUser = m.role === "user"
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 text-xs">
                      AI
                    </span>
                  )}

                  <div
                    className={`max-w-[84%] rounded-2xl p-3 shadow-2xs leading-relaxed ${
                      isUser
                        ? "bg-primary text-white rounded-br-xs"
                        : "border border-hair bg-primary/[0.03] text-ink rounded-bl-xs"
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans text-xs">
                      {m.text}
                    </div>

                    {/* Interactive Action Button */}
                    {m.action && (
                      <button
                        onClick={() => handleActionClick(m.action)}
                        className="mt-2.5 flex items-center gap-1.5 rounded-full border border-primary/30 bg-card-bg px-3 py-1 font-mono text-[11px] font-bold text-primary shadow-xs hover:bg-primary hover:text-white transition"
                      >
                        <span>{m.action.label}</span>
                        <ArrowUpRight width={12} height={12} />
                      </button>
                    )}

                    <div
                      className={`mt-1 font-mono text-[9px] ${
                        isUser ? "text-white/70 text-right" : "text-faint"
                      }`}
                    >
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              )
            })}

            {isTyping && (
              <div className="flex gap-2 items-center text-faint font-mono text-[11px] pl-9">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Agent reasoning across portfolio knowledge base...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="border-t border-hair bg-primary/[0.02] p-2.5 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
            {COPILOT_SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="shrink-0 rounded-full border border-hair bg-card-bg px-2.5 py-1 font-mono text-[10px] text-mist hover:text-ink hover:border-primary transition shadow-2xs"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Quick Utility Actions inspired by ASTRA prototype */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-hair bg-card-bg/60 px-3 py-1.5 font-mono text-[10px]">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="rounded-full border border-hair bg-card-bg px-2 py-0.5 text-mist hover:text-primary hover:border-primary transition"
              >
                Inspect projects ↗
              </button>
              <button
                type="button"
                onClick={() => {
                  toggleTheme()
                  playSound("click", soundEnabled)
                }}
                className="rounded-full border border-hair bg-card-bg px-2 py-0.5 text-mist hover:text-primary hover:border-primary transition"
              >
                Switch theme ◐
              </button>
            </div>

            <label className="flex items-center gap-1 text-faint cursor-pointer">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => {
                  setRememberDevice(e.target.checked)
                  if (!e.target.checked) {
                    localStorage.removeItem(MEM0_STORAGE_KEY)
                    showToast("Saved memory removed")
                  } else {
                    showToast("Memory enabled on this browser")
                  }
                }}
                className="h-3 w-3 rounded border-hair text-primary focus:ring-0"
              />
              <span>Remember chat</span>
            </label>
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend(input)
            }}
            className="border-t border-hair bg-card-bg p-3 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about research, GIS, UAV, or skills..."
              className="flex-1 bg-primary/[0.04] border border-hair rounded-full px-4 py-2 text-xs text-ink placeholder:text-faint focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white disabled:opacity-40 transition hover:bg-primary-light"
            >
              <Send width={13} height={13} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
