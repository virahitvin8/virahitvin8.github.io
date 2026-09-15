import { usePortfolio } from '../content/PortfolioContext';
import { Editable } from './admin/Editable';
import { Section } from './Section';
import { Sparkle } from './icons';

export function About() {
  const { data } = usePortfolio();
  return (
    <Section
      id="about"
      index="01"
      eyebrow="Profile"
      title={<Editable field="about.lead" />}
    >
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="reveal">
          <Editable
            field="about.body"
            as="p"
            multiline
            className="text-lg leading-relaxed text-mist"
          />
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {data.stats.map((s, i) => (
              <div key={i} className="glass rounded-xl p-5">
                <div className="font-display text-3xl text-neon text-glow-neon lg:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-faint">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal">
          <p className="hud-label mb-5">Focus Domains</p>
          <div className="flex flex-col gap-3">
            {data.about.focus.map((f, i) => (
              <div
                key={i}
                className="group flex items-center gap-3 rounded-lg border border-hair bg-white/[0.02] px-4 py-3 transition hover:border-neon/40 hover:bg-neon/[0.04]"
              >
                <Sparkle width={16} height={16} className="text-gold transition group-hover:text-neon" />
                <span className="text-sm text-ink">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
