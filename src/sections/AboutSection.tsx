import { PROFILE } from '../content/profile';
import { StatementReveal } from '../components/StatementReveal';

export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-b border-[var(--line)] bg-[var(--surface-subtle)]/40 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <span className="mono text-xs uppercase tracking-wider text-[var(--accent)]">(01) About</span>
            <h2 id="about-heading" className="heading-section display-serif mt-3 text-[var(--fg)]">
              Curious about the whole stack, not just one layer.
            </h2>

            <dl className="mt-8 space-y-4 border-t border-[var(--line)] pt-5 text-sm">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-[var(--muted)]">Academic Track</dt>
                <dd className="mt-1 font-medium text-[var(--fg)]">{PROFILE.education.standing}</dd>
                <dd className="text-[var(--fg-2)]">Computer Science · {PROFILE.education.batch}</dd>
              </div>
              <div className="border-t border-[var(--line)] pt-4">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-[var(--muted)]">Location</dt>
                <dd className="mt-1 text-[var(--fg-2)]">{PROFILE.location}</dd>
              </div>
              <div className="border-t border-[var(--line)] pt-4">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-[var(--muted)]">Core Study</dt>
                <dd className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{PROFILE.education.focus}</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-6 lg:col-span-8 lg:border-l lg:border-[var(--line)] lg:pl-10">
            <StatementReveal
              text={PROFILE.statementReveal}
              className="text-2xl font-semibold leading-snug tracking-tight text-[var(--fg)] sm:text-3xl"
            />

            <div className="space-y-4 border-t border-[var(--line)] pt-6">
              {PROFILE.biographyParagraphs.map((para, idx) => (
                <p key={idx} className="max-w-2xl text-base leading-relaxed text-[var(--fg-2)]">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

