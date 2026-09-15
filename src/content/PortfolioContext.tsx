import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { DEFAULT_DATA, DEFAULT_PIN, type PortfolioData } from '../data/portfolio';
import committedContent from '../data/content.json';

const DATA_KEY = 'portfolio_data_v2';
const PIN_KEY = 'portfolio_pin_v1';
const SESSION_KEY = 'portfolio_admin_session';

/*
 * Placeholder values that earlier versions wrote into storage as though they
 * were real content. They are dropped on load so a genuine default can replace
 * them, rather than being frozen in the owner's browser forever.
 */
const STALE_PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=600&h=600&fit=crop&auto=format',
];

/** Merge stored data over defaults so new default fields survive old saves.
 *  Nested plain objects (profile, about, social, contact) are merged one level
 *  deep; arrays and primitives are taken wholesale from the saved copy.
 *
 *  Type checks guard the object case: content.json is meant to be hand-edited,
 *  and spreading a string or an array where an object belongs would silently
 *  produce nonsense (`{...'abc'}` becomes `{0:'a',1:'b',2:'c'}`). A malformed
 *  value is now ignored instead of corrupting the section. */
function mergeData(base: PortfolioData, saved: unknown): PortfolioData {
  if (!saved || typeof saved !== 'object') return base;
  const s = saved as Record<string, any>;
  const out: any = { ...base };
  for (const key of Object.keys(base) as (keyof PortfolioData)[]) {
    const sv = s[key];
    if (sv == null) continue;
    const bv = base[key];

    if (Array.isArray(bv)) {
      if (Array.isArray(sv)) out[key] = sv;
      continue;
    }
    if (typeof bv !== 'object' || bv === null) {
      out[key] = sv;
      continue;
    }
    if (typeof sv === 'object' && !Array.isArray(sv)) {
      out[key] = { ...bv, ...sv };
    }
  }
  return out as PortfolioData;
}

/*
 * The published baseline: code defaults, overridden by the committed
 * content.json. Everything else layers on top of this.
 *
 * It resolves at BUILD TIME because the JSON is imported as a module, so the
 * published content is inlined into the bundle — no extra request, no flash of
 * default content, and it still works offline.
 */
const PUBLISHED_BASE: PortfolioData = mergeData(DEFAULT_DATA, committedContent);

/*
 * content.json is meant to be edited by hand, so a typo should be loud rather
 * than silent. Unknown sections are ignored by mergeData; say so once.
 */
(function warnAboutUnknownSections() {
  const known = new Set<string>(Object.keys(DEFAULT_DATA));
  const unknown = Object.keys(committedContent as object).filter(
    (k) => !k.startsWith('_') && !known.has(k),
  );
  if (unknown.length) {
    console.warn(
      `[content.json] Ignoring unknown section(s): ${unknown.join(', ')}.\n` +
        `Known sections: ${[...known].sort().join(', ')}`,
    );
  }
})();

/**
 * Produce the smallest patch that turns `base` into `current`.
 *
 * Only real edits are stored. This used to persist the whole merged dataset on
 * every mount, which meant the first visit silently froze that day's defaults:
 * renaming a section, fixing a typo or — as actually happened — replacing a
 * placeholder portrait with the owner's real photo would have no effect on any
 * browser that had ever opened the site. Storing a diff keeps defaults live.
 *
 * Diffs are taken against the *published* baseline, not the code defaults, so
 * once an edit is exported into content.json and committed it stops being an
 * unpublished local change.
 *
 * The one-level-deep shape mirrors mergeData, so the two stay consistent.
 */
function diffAgainst(base: PortfolioData, current: PortfolioData): Record<string, any> {
  const patch: Record<string, any> = {};
  for (const key of Object.keys(base) as (keyof PortfolioData)[]) {
    const cur = current[key] as any;
    const def = base[key] as any;

    if (def === null || Array.isArray(def) || typeof def !== 'object') {
      if (JSON.stringify(cur) !== JSON.stringify(def)) patch[key] = cur;
      continue;
    }
    if (cur === null || typeof cur !== 'object') {
      patch[key] = cur;
      continue;
    }

    const sub: Record<string, any> = {};
    for (const k of Object.keys(def)) {
      if (JSON.stringify(cur[k]) !== JSON.stringify(def[k])) sub[k] = cur[k];
    }
    // preserve anything the owner added that the defaults do not describe
    for (const k of Object.keys(cur)) {
      if (!(k in def) && cur[k] !== undefined) sub[k] = cur[k];
    }
    if (Object.keys(sub).length) patch[key] = sub;
  }
  return patch;
}

/** Read a nested value by dot-path, e.g. "profile.name". */
function getByPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

/** Immutably set a nested value by dot-path. */
function setByPath<T>(obj: T, path: string, value: any): T {
  const keys = path.split('.');
  const clone: any = Array.isArray(obj) ? [...(obj as any)] : { ...obj };
  let cur = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    cur[k] = Array.isArray(cur[k]) ? [...cur[k]] : { ...cur[k] };
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
  return clone;
}

interface PortfolioContextValue {
  data: PortfolioData;
  isAdmin: boolean;
  editing: boolean;
  toast: string | null;
  setField: (path: string, value: any) => void;
  getField: (path: string) => any;
  updateData: (updater: (draft: PortfolioData) => PortfolioData) => void;
  login: (pin: string) => boolean;
  logout: () => void;
  changePin: (pin: string) => void;
  toggleEditing: () => void;
  exportJSON: () => void;
  importJSON: (file: File) => Promise<void>;
  resetAll: () => void;
  showToast: (msg: string) => void;
}

const Ctx = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const raw = localStorage.getItem(DATA_KEY);
      if (!raw) return PUBLISHED_BASE;
      const saved = JSON.parse(raw);

      // Migrate away from placeholders saved by the old whole-dataset writer.
      if (saved && typeof saved === 'object') {
        const profile = (saved as any).profile;
        if (profile && STALE_PLACEHOLDERS.includes(profile.photo)) {
          delete profile.photo;
        }
      }

      return mergeData(PUBLISHED_BASE, saved);
    } catch {
      return PUBLISHED_BASE;
    }
  });
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  // Persist only what the owner actually changed, so defaults stay live.
  useEffect(() => {
    try {
      const patch = diffAgainst(PUBLISHED_BASE, data);
      if (Object.keys(patch).length === 0) {
        localStorage.removeItem(DATA_KEY);
      } else {
        localStorage.setItem(DATA_KEY, JSON.stringify(patch));
      }
    } catch {
      /* storage may be full (large images) — fail silently */
    }
  }, [data]);

  // Reflect editing state on <body> for global CSS affordances.
  useEffect(() => {
    document.body.classList.toggle('admin-editing', isAdmin && editing);
  }, [isAdmin, editing]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const updateData = useCallback(
    (updater: (draft: PortfolioData) => PortfolioData) => setData((d) => updater(d)),
    [],
  );

  const setField = useCallback((path: string, value: any) => {
    setData((d) => setByPath(d, path, value));
  }, []);

  const getField = useCallback((path: string) => getByPath(data, path), [data]);

  const login = useCallback(
    (pin: string) => {
      const stored = localStorage.getItem(PIN_KEY) || DEFAULT_PIN;
      if (pin === stored) {
        setIsAdmin(true);
        sessionStorage.setItem(SESSION_KEY, '1');
        showToast('Admin access granted — welcome back, Akshit.');
        return true;
      }
      showToast('Incorrect PIN.');
      return false;
    },
    [showToast],
  );

  const logout = useCallback(() => {
    setIsAdmin(false);
    setEditing(false);
    sessionStorage.removeItem(SESSION_KEY);
    showToast('Signed out of admin.');
  }, [showToast]);

  const changePin = useCallback(
    (pin: string) => {
      if (pin.length < 4) {
        showToast('PIN must be at least 4 characters.');
        return;
      }
      localStorage.setItem(PIN_KEY, pin);
      showToast('PIN updated.');
    },
    [showToast],
  );

  const toggleEditing = useCallback(() => {
    setEditing((e) => {
      const next = !e;
      showToast(next ? 'Inline edit ON — double-click text or images.' : 'Inline edit OFF.');
      return next;
    });
  }, [showToast]);

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-content.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Content exported — commit this JSON to publish.');
  }, [data, showToast]);

  const importJSON = useCallback(
    async (file: File) => {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        setData(mergeData(DEFAULT_DATA, parsed));
        showToast('Content imported successfully.');
      } catch {
        showToast('Import failed — invalid JSON file.');
      }
    },
    [showToast],
  );

  const resetAll = useCallback(() => {
    // Back to the published content, not to code defaults — this discards the
    // owner's unpublished local edits, which is what "reset" should mean.
    setData(PUBLISHED_BASE);
    localStorage.removeItem(DATA_KEY);
    showToast('Unpublished edits discarded — back to the published content.');
  }, [showToast]);

  const value = useMemo<PortfolioContextValue>(
    () => ({
      data,
      isAdmin,
      editing,
      toast,
      setField,
      getField,
      updateData,
      login,
      logout,
      changePin,
      toggleEditing,
      exportJSON,
      importJSON,
      resetAll,
      showToast,
    }),
    [
      data,
      isAdmin,
      editing,
      toast,
      setField,
      getField,
      updateData,
      login,
      logout,
      changePin,
      toggleEditing,
      exportJSON,
      importJSON,
      resetAll,
      showToast,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePortfolio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}
