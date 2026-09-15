import { useEffect, useState } from "react"
import { usePortfolio } from "../../content/PortfolioContext"
import { Lock, X } from "../icons"

export function AdminGate({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { login } = usePortfolio()
  const [pin, setPin] = useState("")

  useEffect(() => {
    if (!open) setPin("")
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  if (!open) return null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(pin)) onClose()
    setPin("")
  }

  return (
    <div
      className="fixed inset-0 z-[10050] flex items-center justify-center bg-void/85 px-6 backdrop-blur-xl"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="glass relative w-full max-w-sm rounded-2xl border-gold/30 p-8 text-center"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-faint transition hover:text-ink"
          aria-label="Close"
        >
          <X width={18} height={18} />
        </button>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-gold/40 text-gold">
          <Lock width={22} height={22} />
        </div>
        <p className="hud-label mb-1">Owner Access</p>
        <h3 className="mb-5 font-display text-xl text-ink">Enter your PIN</h3>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          autoFocus
          placeholder="••••"
          className="mb-4 w-full rounded-lg border border-hair bg-void/60 px-4 py-3 text-center font-mono tracking-[0.4em] text-ink outline-none focus:border-neon"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-neon py-3 font-semibold text-void transition hover:bg-sage-light"
        >
          Unlock
        </button>
        <p className="mt-4 text-xs text-faint">
          Default PIN is 2080 — change it once inside.
        </p>
      </form>
    </div>
  )
}
