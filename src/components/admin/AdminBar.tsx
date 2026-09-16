import { useEffect, useRef, useState } from "react"
import { usePortfolio } from "../../content/PortfolioContext"
import { AdminGate } from "./AdminGate"
import { EditorDrawer } from "./EditorDrawer"
import { Download, Lock, LogOut, Pencil, Sliders, Upload } from "../icons"

export function AdminBar() {
  const { isAdmin, editing, toggleEditing, logout, exportJSON, importJSON } =
    usePortfolio()
  const [gateOpen, setGateOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Listen to open-admin-gate event or Ctrl/Cmd + Shift + A shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "a"
      ) {
        e.preventDefault()
        if (!isAdmin) setGateOpen(true)
      }
    }
    const onEvent = () => {
      if (!isAdmin) setGateOpen(true)
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("open-admin-gate", onEvent)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("open-admin-gate", onEvent)
    }
  }, [isAdmin])

  return (
    <>
      <AdminGate open={gateOpen} onClose={() => setGateOpen(false)} />
      <EditorDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Discreet lock trigger on bottom-left */}
      {!isAdmin && (
        <button
          onClick={() => setGateOpen(true)}
          title="Admin Login (PIN: 2080)"
          className="fixed bottom-5 left-5 z-[8000] flex h-9 items-center gap-1.5 rounded-full border border-primary/20 bg-white/90 px-3 text-xs font-semibold text-primary shadow-md backdrop-blur transition hover:border-primary hover:bg-primary/5"
        >
          <Lock width={13} height={13} />
          <span>Admin</span>
        </button>
      )}

      {isAdmin && (
        <div className="fixed bottom-5 left-1/2 z-[10020] flex -translate-x-1/2 items-center gap-1.5 rounded-2xl border border-primary/20 bg-white/95 px-3 py-2 shadow-2xl backdrop-blur-xl">
          <span className="px-2 font-mono text-xs font-bold text-primary hidden sm:inline">ADMIN CORE</span>
          <BarBtn
            onClick={toggleEditing}
            active={editing}
            label={editing ? "Editing ON" : "Inline Edit"}
          >
            <Pencil width={15} height={15} />
          </BarBtn>
          <BarBtn onClick={() => setDrawerOpen(true)} label="Panel">
            <Sliders width={15} height={15} />
          </BarBtn>
          <BarBtn onClick={exportJSON} label="Export">
            <Download width={15} height={15} />
          </BarBtn>
          <BarBtn onClick={() => fileRef.current?.click()} label="Import">
            <Upload width={15} height={15} />
          </BarBtn>
          <BarBtn onClick={logout} label="Logout">
            <LogOut width={15} height={15} />
          </BarBtn>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) importJSON(f)
              e.target.value = ""
            }}
          />
        </div>
      )}
    </>
  )
}

function BarBtn({
  children,
  onClick,
  label,
  active,
}: {
  children: React.ReactNode
  onClick: () => void
  label: string
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-primary text-white shadow-sm"
          : "text-mist hover:bg-primary/10 hover:text-primary"
      }`}
    >
      {children}
      <span className="hidden md:inline">{label}</span>
    </button>
  )
}
