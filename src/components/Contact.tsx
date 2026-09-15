import { usePortfolio } from '../content/PortfolioContext';
import { Editable } from './admin/Editable';
import { Github, Linkedin, Mail, ArrowUpRight, Satellite } from './icons';

export function Contact() {
  const { data } = usePortfolio();
  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
      <div className="reveal grain relative overflow-hidden rounded-3xl border border-hair bg-[radial-gradient(ellipse_at_top,#0d2b1f,#04120c)] px-8 py-16 text-center lg:px-16 lg:py-24">
        <div className="mb-6 flex items-center justify-center gap-2 text-neon">
          <Satellite width={18} height={18} />
          <span className="hud-label">Open Channel</span>
        </div>
        <Editable
          field="contact.headline"
          as="h2"
          multiline
          className="mx-auto max-w-3xl font-display text-4xl leading-tight text-ink lg:text-6xl"
        />
        <Editable
          field="contact.sub"
          as="p"
          multiline
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-mist lg:text-lg"
        />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`mailto:${data.profile.email}`}
            className="group flex items-center gap-2 rounded-full bg-neon px-7 py-3.5 font-semibold text-void transition hover:bg-sage-light hover:shadow-[0_0_30px_var(--neon-soft)]"
          >
            <Mail width={18} height={18} /> Email me
          </a>
          <a
            href={data.social.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 rounded-full border border-gold/50 px-7 py-3.5 font-medium text-gold-light transition hover:bg-gold hover:text-void"
          >
            <Linkedin width={18} height={18} /> LinkedIn
            <ArrowUpRight width={16} height={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href={data.social.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border border-hair px-7 py-3.5 font-medium text-ink transition hover:border-neon hover:text-neon"
          >
            <Github width={18} height={18} /> GitHub
          </a>
        </div>

        <p className="mt-10 font-mono text-xs text-faint">
          <Editable field="profile.email" /> · <Editable field="profile.location" />
        </p>
      </div>

      <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-hair pt-8 text-sm text-faint sm:flex-row">
        <p>
          © {new Date().getFullYear()} {data.profile.name}. Observed from orbit, built for 2080.
        </p>
        <p className="font-mono text-xs">Remote Sensing · GIS · Precision Agriculture</p>
      </footer>
    </section>
  );
}
