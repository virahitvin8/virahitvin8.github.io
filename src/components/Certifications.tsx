import { useState } from 'react';
import { usePortfolio } from '../content/PortfolioContext';
import type { Certification } from '../data/portfolio';
import { Section } from './Section';
import { SecureCertViewer } from './SecureCertViewer';
import { Lock, Shield } from './icons';

export function Certifications() {
  const { data } = usePortfolio();
  const [active, setActive] = useState<Certification | null>(null);

  return (
    <Section
      id="certifications"
      index="06"
      eyebrow="Verified Credentials"
      title="Certifications & research"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.certifications.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c)}
            className="reveal group relative flex flex-col overflow-hidden rounded-2xl border border-hair bg-white/[0.02] p-6 text-left transition duration-500 hover:-translate-y-1.5 hover:border-gold/50 hover:bg-gold/[0.04]"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/30 text-gold transition group-hover:scale-110">
                <Shield width={20} height={20} />
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-hair px-3 py-1 font-mono text-[10px] text-neon">
                <Lock width={11} height={11} /> SECURE
              </span>
            </div>
            <h3 className="font-display text-lg leading-snug text-ink">{c.title}</h3>
            <p className="mt-2 text-sm font-medium text-gold-light">{c.issuer}</p>
            <p className="mt-1 font-mono text-xs text-faint">{c.date}</p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-mist">{c.blurb}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-neon opacity-70 transition group-hover:opacity-100">
              View credential →
            </span>
          </button>
        ))}
      </div>

      <SecureCertViewer cert={active} onClose={() => setActive(null)} />
    </Section>
  );
}
