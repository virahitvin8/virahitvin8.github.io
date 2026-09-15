import { usePortfolio } from '../content/PortfolioContext';
import { Section } from './Section';
import { Download, Upload } from './icons';

export function Resume() {
  const { data, isAdmin, editing, updateData, showToast } = usePortfolio();
  const { cvUrl, resumeName, resumeUpdated } = data.profile;
  const canEdit = isAdmin && editing;

  const uploadResume = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';
    input.onchange = () => {
      const f = input.files?.[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = (e) => {
        updateData((d) => ({
          ...d,
          profile: {
            ...d.profile,
            cvUrl: e.target?.result as string,
            resumeName: f.name,
            resumeUpdated: new Date().toLocaleDateString('en-GB', {
              month: 'short',
              year: 'numeric',
            }),
          },
        }));
        showToast('Resume updated ✓ — Export JSON to publish it.');
      };
      r.readAsDataURL(f);
    };
    input.click();
  };

  return (
    <Section id="resume" index="07" eyebrow="Curriculum Vitae" title="The full résumé">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
        {/* Info + actions */}
        <div className="reveal flex flex-col gap-5">
          <div className="glass rounded-2xl p-6">
            <p className="hud-label mb-2">Current Document</p>
            <p className="break-all font-mono text-sm text-ink">{resumeName}</p>
            <p className="mt-1 text-xs text-faint">Last updated · {resumeUpdated}</p>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={cvUrl}
                download={resumeName}
                className="flex items-center justify-center gap-2 rounded-full bg-neon px-6 py-3 font-semibold text-void transition hover:bg-sage-light hover:shadow-[0_0_28px_var(--neon-soft)]"
              >
                <Download width={18} height={18} /> Download résumé
              </a>
              <a
                href={cvUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-hair px-6 py-3 font-medium text-ink transition hover:border-neon hover:text-neon"
              >
                Open in new tab
              </a>

              {canEdit && (
                <button
                  onClick={uploadResume}
                  className="flex items-center justify-center gap-2 rounded-full border border-dashed border-gold/50 px-6 py-3 font-medium text-gold-light transition hover:bg-gold/10"
                >
                  <Upload width={18} height={18} /> Upload new résumé
                </button>
              )}
            </div>
          </div>

          {isAdmin && (
            <p className="text-xs leading-relaxed text-faint">
              Admin: turn on inline edit, then <b className="text-gold">Upload new résumé</b> to swap
              the PDF. It saves to your browser instantly — use <b className="text-neon">Export</b> in
              the admin bar and redeploy so every visitor gets the new file.
            </p>
          )}
        </div>

        {/* Embedded preview */}
        <div className="reveal overflow-hidden rounded-2xl border border-hair bg-abyss">
          <object data={`${cvUrl}#toolbar=0&view=FitH`} type="application/pdf" className="h-[70vh] w-full">
            <div className="flex h-[70vh] flex-col items-center justify-center gap-4 p-8 text-center">
              <p className="text-mist">Your browser can&apos;t preview PDFs inline.</p>
              <a
                href={cvUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-neon px-6 py-3 font-semibold text-void"
              >
                Open the résumé
              </a>
            </div>
          </object>
        </div>
      </div>
    </Section>
  );
}
