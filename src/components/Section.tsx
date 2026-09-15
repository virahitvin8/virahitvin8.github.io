import type { ReactNode } from "react"

export function Section({
  id,
  index,
  eyebrow,
  title,
  children,
  className = "",
}: {
  id: string
  index: string
  eyebrow: string
  title: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32 ${className}`}
    >
      <header className="reveal mb-14 flex flex-col gap-4 border-b border-hair pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="font-mono text-sm text-gold">{index}</span>
            <span className="h-px w-10 bg-gold/40" />
            <span className="hud-label">{eyebrow}</span>
          </div>
          <h2 className="max-w-2xl font-display text-4xl leading-tight text-ink lg:text-5xl">
            {title}
          </h2>
        </div>
      </header>
      {children}
    </section>
  )
}
