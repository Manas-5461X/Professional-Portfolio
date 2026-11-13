import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { PROFILE } from '../content/profile';
import { StatementReveal } from '../components/StatementReveal';
import { gsap, ScrollTrigger, isReducedMotion } from '../lib/smooth';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      gsap.from('[data-about-heading]', {
        y: 32,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: {
          trigger: '[data-about-heading]',
          start: 'top 88%',
          once: true
        }
      });

      gsap.from('[data-about-figure]', {
        y: 32,
        autoAlpha: 0,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: {
          trigger: '[data-about-figure]',
          start: 'top 88%',
          once: true
        }
      });

      gsap.from('[data-about-meta] > div', {
        y: 20,
        autoAlpha: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: {
          trigger: '[data-about-meta]',
          start: 'top 90%',
          once: true
        }
      });

      gsap.from('[data-about-bio] > p', {
        y: 24,
        autoAlpha: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: {
          trigger: '[data-about-bio]',
          start: 'top 88%',
          once: true
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-heading"
      className="border-b border-[var(--line)] bg-[var(--surface-subtle)]/40 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <div data-about-heading>
              <span className="mono text-xs uppercase tracking-wider text-[var(--accent)]">(01) About</span>
              <h2 id="about-heading" className="heading-section display-serif mt-3 text-[var(--fg)]">
                Curious about the whole stack, not just one layer.
              </h2>
            </div>

            {/* Editorial Builder Blueprint Card */}
            <figure data-about-figure className="mt-6 mx-auto max-w-sm lg:max-w-none overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)] p-2.5 shadow-sm">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-white">
                <img
                  src="/images/about-portrait.jpg"
                  alt="Manas Gandhi — Systems, AI & Security builder illustration"
                  loading="lazy"
                  width={600}
                  height={600}
                  className="h-full w-full object-cover select-none transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
              <figcaption className="mt-2.5 flex items-center justify-between px-1 font-mono text-[10px] text-[var(--muted)]">
                <span className="font-semibold uppercase tracking-wider text-[var(--accent)]">
                  FIG. 01 // BUILDER BLUEPRINT
                </span>
                <span className="tracking-wider text-[var(--muted)]">EST. 2026</span>
              </figcaption>
            </figure>

            <dl data-about-meta className="mt-6 space-y-4 border-t border-[var(--line)] pt-5 text-sm">
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

            <div data-about-bio className="space-y-4 border-t border-[var(--line)] pt-6">
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

