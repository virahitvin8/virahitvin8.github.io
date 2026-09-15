import { usePortfolio } from "../content/PortfolioContext"

export function Toast() {
  const { toast } = usePortfolio()
  return (
    <div
      className={`fixed bottom-24 left-1/2 z-[10070] -translate-x-1/2 transition-all duration-300 ${
        toast
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <div className="glass rounded-full border-neon/30 px-5 py-2.5 font-mono text-xs text-neon shadow-2xl">
        {toast}
      </div>
    </div>
  )
}
