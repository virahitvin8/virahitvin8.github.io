import { useState } from 'react';
import { usePortfolio } from '../../content/PortfolioContext';
import type { Certification, FeedPost, Project } from '../../data/portfolio';
import { Plus, Trash, X } from '../icons';

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

const inputCls =
  'w-full rounded-md border border-hair bg-void/60 px-3 py-2 text-sm text-ink outline-none focus:border-neon';

export function EditorDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data, updateData, changePin, resetAll, showToast } = usePortfolio();
  const [tab, setTab] = useState<'certs' | 'projects' | 'feed' | 'settings'>('certs');
  const [newPin, setNewPin] = useState('');

  const addCert = () =>
    updateData((d) => ({
      ...d,
      certifications: [
        ...d.certifications,
        { id: uid('cert'), title: 'New Certificate', issuer: 'Issuer', date: '2026', blurb: '' },
      ],
    }));
  const setCert = (id: string, patch: Partial<Certification>) =>
    updateData((d) => ({
      ...d,
      certifications: d.certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  const delCert = (id: string) =>
    updateData((d) => ({ ...d, certifications: d.certifications.filter((c) => c.id !== id) }));

  const uploadCertImage = (id: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const f = input.files?.[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = (e) => {
        setCert(id, { image: e.target?.result as string });
        showToast('Certificate image uploaded ✓');
      };
      r.readAsDataURL(f);
    };
    input.click();
  };

  const addProject = () =>
    updateData((d) => ({
      ...d,
      projects: [
        ...d.projects,
        { id: uid('prj'), title: 'New Project', category: 'Category', description: '', tags: [] },
      ],
    }));
  const setProject = (id: string, patch: Partial<Project>) =>
    updateData((d) => ({
      ...d,
      projects: d.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  const delProject = (id: string) =>
    updateData((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== id) }));

  const addPost = () =>
    updateData((d) => ({
      ...d,
      linkedinPosts: [
        { id: uid('li'), text: 'New update', date: '2026', link: d.social.linkedinUrl },
        ...d.linkedinPosts,
      ],
    }));
  const setPost = (id: string, patch: Partial<FeedPost>) =>
    updateData((d) => ({
      ...d,
      linkedinPosts: d.linkedinPosts.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  const delPost = (id: string) =>
    updateData((d) => ({ ...d, linkedinPosts: d.linkedinPosts.filter((p) => p.id !== id) }));

  const tabs = [
    ['certs', 'Certificates'],
    ['projects', 'Projects'],
    ['feed', 'LinkedIn'],
    ['settings', 'Settings'],
  ] as const;

  return (
    <>
      <div
        className={`fixed inset-0 z-[10030] bg-void/60 backdrop-blur-sm transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-[10040] flex h-full w-full max-w-md flex-col border-l border-hair bg-abyss shadow-2xl transition-transform duration-400 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-hair px-5 py-4">
          <div>
            <p className="hud-label">Control Deck</p>
            <h3 className="font-display text-lg text-ink">Content Editor</h3>
          </div>
          <button onClick={onClose} className="text-faint hover:text-ink" aria-label="Close">
            <X />
          </button>
        </header>

        <nav className="flex border-b border-hair">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 py-3 text-xs font-medium transition ${
                tab === id ? 'bg-neon/10 text-neon' : 'text-faint hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {tab === 'certs' && (
            <>
              {data.certifications.map((c) => (
                <div key={c.id} className="glass space-y-2 rounded-xl p-3">
                  <input
                    className={inputCls}
                    value={c.title}
                    onChange={(e) => setCert(c.id, { title: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className={inputCls}
                      value={c.issuer}
                      onChange={(e) => setCert(c.id, { issuer: e.target.value })}
                    />
                    <input
                      className={inputCls}
                      value={c.date}
                      onChange={(e) => setCert(c.id, { date: e.target.value })}
                    />
                  </div>
                  <input
                    className={inputCls}
                    value={c.blurb}
                    placeholder="Short blurb"
                    onChange={(e) => setCert(c.id, { blurb: e.target.value })}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => uploadCertImage(c.id)}
                      className="flex-1 rounded-md border border-hair py-2 text-xs text-neon hover:bg-neon/10"
                    >
                      {c.image ? 'Replace image' : 'Upload cert image'}
                    </button>
                    <button
                      onClick={() => delCert(c.id)}
                      className="rounded-md border border-red-400/30 p-2 text-red-300 hover:bg-red-500/10"
                      aria-label="Delete"
                    >
                      <Trash width={16} height={16} />
                    </button>
                  </div>
                </div>
              ))}
              <AddButton label="Add certificate" onClick={addCert} />
            </>
          )}

          {tab === 'projects' && (
            <>
              {data.projects.map((p) => (
                <div key={p.id} className="glass space-y-2 rounded-xl p-3">
                  <input
                    className={inputCls}
                    value={p.title}
                    onChange={(e) => setProject(p.id, { title: e.target.value })}
                  />
                  <input
                    className={inputCls}
                    value={p.category}
                    onChange={(e) => setProject(p.id, { category: e.target.value })}
                  />
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={2}
                    value={p.description}
                    onChange={(e) => setProject(p.id, { description: e.target.value })}
                  />
                  <input
                    className={inputCls}
                    value={p.tags.join(', ')}
                    placeholder="Tags, comma separated"
                    onChange={(e) =>
                      setProject(p.id, {
                        tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                      })
                    }
                  />
                  <button
                    onClick={() => delProject(p.id)}
                    className="w-full rounded-md border border-red-400/30 py-2 text-xs text-red-300 hover:bg-red-500/10"
                  >
                    Delete project
                  </button>
                </div>
              ))}
              <AddButton label="Add project" onClick={addProject} />
            </>
          )}

          {tab === 'feed' && (
            <>
              <p className="text-xs text-faint">
                LinkedIn has no public posts API, so curate highlights here. The LinkedIn icon links to
                your profile.
              </p>
              {data.linkedinPosts.map((p) => (
                <div key={p.id} className="glass space-y-2 rounded-xl p-3">
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={2}
                    value={p.text}
                    onChange={(e) => setPost(p.id, { text: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className={inputCls}
                      value={p.date}
                      onChange={(e) => setPost(p.id, { date: e.target.value })}
                    />
                    <input
                      className={inputCls}
                      value={p.link}
                      onChange={(e) => setPost(p.id, { link: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={() => delPost(p.id)}
                    className="w-full rounded-md border border-red-400/30 py-2 text-xs text-red-300 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              ))}
              <AddButton label="Add LinkedIn highlight" onClick={addPost} />
            </>
          )}

          {tab === 'settings' && (
            <div className="space-y-4">
              <div className="glass space-y-2 rounded-xl p-4">
                <p className="hud-label">Change PIN</p>
                <input
                  className={inputCls}
                  type="password"
                  value={newPin}
                  placeholder="New PIN (min 4 chars)"
                  onChange={(e) => setNewPin(e.target.value)}
                />
                <button
                  onClick={() => {
                    changePin(newPin);
                    setNewPin('');
                  }}
                  className="w-full rounded-md bg-neon py-2 text-sm font-semibold text-void hover:bg-sage-light"
                >
                  Update PIN
                </button>
              </div>
              <div className="glass space-y-2 rounded-xl p-4">
                <p className="hud-label text-gold">Danger zone</p>
                <button
                  onClick={resetAll}
                  className="w-full rounded-md border border-red-400/30 py-2 text-sm text-red-300 hover:bg-red-500/10"
                >
                  Reset all content to defaults
                </button>
              </div>
              <p className="text-xs leading-relaxed text-faint">
                Tip: after editing, use <b className="text-neon">Export</b> in the admin bar to download
                your content JSON, then commit / re-deploy it so every visitor sees the changes.
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neon/40 py-3 text-sm text-neon transition hover:bg-neon/10"
    >
      <Plus width={16} height={16} /> {label}
    </button>
  );
}
