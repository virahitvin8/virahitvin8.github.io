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
      className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/40 px-6 backdrop-blur-md"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="relative w-full max-w-sm rounded-2xl border border-primary/20 bg-white p-8 text-center shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-mist/60 transition hover:text-primary"
          aria-label="Close"
        >
          <X width={18} height={18} />
        </button>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
          <Lock width={22} height={22} />
        </div>
        <p className="font-mono text-xs font-bold uppercase tracking-wider text-primary">Owner Portal</p>
        <h3 className="mb-4 font-display text-2xl font-bold text-ink">Admin Security Gate</h3>
        <p className="mb-5 text-xs text-mist">Enter your 4-digit administrative PIN to enable inline live editing and content customization.</p>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          autoFocus
          placeholder="••••"
          className="mb-4 w-full rounded-lg border border-primary/25 bg-primary/[0.03] px-4 py-3 text-center font-mono text-lg tracking-[0.4em] text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-primary py-3 font-semibold text-white transition hover:bg-primary-light shadow-md"
        >
          Unlock Admin Mode
        </button>
        <p className="mt-4 font-mono text-[11px] text-faint">
          Default Master PIN: 2080
        </p>
      </form>
    </div>
  )
}
