import { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '../../content/PortfolioContext';
import { AdminGate } from './AdminGate';
import { EditorDrawer } from './EditorDrawer';
import { Download, Lock, LogOut, Pencil, Sliders, Upload } from '../icons';

export function AdminBar() {
  const { isAdmin, editing, toggleEditing, logout, exportJSON, importJSON } = usePortfolio();
  const [gateOpen, setGateOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Secret shortcut to open the login gate: Ctrl/Cmd + Shift + A
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (!isAdmin) setGateOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isAdmin]);

  return (
    <>
      <AdminGate open={gateOpen} onClose={() => setGateOpen(false)} />
      <EditorDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Discreet lock trigger (always present, bottom-left) */}
      {!isAdmin && (
        <button
          onClick={() => setGateOpen(true)}
          title="Owner login (Ctrl+Shift+A)"
          className="fixed bottom-5 left-5 z-[10020] flex h-10 w-10 items-center justify-center rounded-full border border-hair bg-void/70 text-faint backdrop-blur transition hover:border-neon hover:text-neon"
        >
          <Lock width={16} height={16} />
        </button>
      )}

      {isAdmin && (
        <div className="fixed bottom-5 left-1/2 z-[10020] flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-hair bg-abyss/90 px-2 py-2 shadow-2xl backdrop-blur-xl">
          <span className="px-2 hud-label hidden sm:inline">Admin</span>
          <BarBtn onClick={toggleEditing} active={editing} label={editing ? 'Editing on' : 'Inline edit'}>
            <Pencil width={16} height={16} />
          </BarBtn>
          <BarBtn onClick={() => setDrawerOpen(true)} label="Editor">
            <Sliders width={16} height={16} />
          </BarBtn>
          <BarBtn onClick={exportJSON} label="Export">
            <Download width={16} height={16} />
          </BarBtn>
          <BarBtn onClick={() => fileRef.current?.click()} label="Import">
            <Upload width={16} height={16} />
          </BarBtn>
          <BarBtn onClick={logout} label="Sign out">
            <LogOut width={16} height={16} />
          </BarBtn>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importJSON(f);
              e.target.value = '';
            }}
          />
        </div>
      )}
    </>
  );
}

function BarBtn({
  children,
  onClick,
  label,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition ${
        active ? 'bg-neon text-void' : 'text-mist hover:bg-neon/10 hover:text-neon'
      }`}
    >
      {children}
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}
