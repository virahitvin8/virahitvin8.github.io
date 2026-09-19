// Web Audio API lightweight synthesized tactile sound effects
// Completely dependency-free and fails gracefully in environments without audio support.

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

export function playSound(type: "click" | "blip" | "chime" | "whoosh" | "terminal", enabled: boolean = true) {
  if (!enabled) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    if (type === "click") {
      osc.type = "sine"
      osc.frequency.setValueAtTime(800, now)
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04)
      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
      osc.start(now)
      osc.stop(now + 0.04)
    } else if (type === "blip") {
      osc.type = "triangle"
      osc.frequency.setValueAtTime(520, now)
      osc.frequency.exponentialRampToValueAtTime(980, now + 0.06)
      gain.gain.setValueAtTime(0.06, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
      osc.start(now)
      osc.stop(now + 0.06)
    } else if (type === "chime") {
      osc.type = "sine"
      osc.frequency.setValueAtTime(587.33, now) // D5
      osc.frequency.setValueAtTime(880, now + 0.08) // A5
      gain.gain.setValueAtTime(0.09, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)
      osc.start(now)
      osc.stop(now + 0.28)
    } else if (type === "terminal") {
      osc.type = "square"
      osc.frequency.setValueAtTime(750, now)
      gain.gain.setValueAtTime(0.03, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02)
      osc.start(now)
      osc.stop(now + 0.02)
    } else if (type === "whoosh") {
      osc.type = "sine"
      osc.frequency.setValueAtTime(260, now)
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.12)
      gain.gain.setValueAtTime(0.05, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
      osc.start(now)
      osc.stop(now + 0.12)
    }
  } catch {
    // Gracefully ignore any browser audio autoplay policy restrictions
  }
}
