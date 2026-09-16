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
      className={`mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16 ${className}`}
    >
      <header className="reveal mb-8 flex flex-col gap-3 border-b border-primary/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-gold-light">{index}</span>
            <span className="h-px w-8 bg-gold/40" />
            <span className="hud-label text-primary">{eyebrow}</span>
          </div>
          <h2 className="max-w-3xl font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            {title}
          </h2>
        </div>
      </header>
      {children}
    </section>
  )
}
