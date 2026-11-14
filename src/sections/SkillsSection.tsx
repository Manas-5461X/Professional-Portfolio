import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { SKILL_CATEGORIES, type SkillMaturity } from '../content/skills';
import { gsap, ScrollTrigger, isReducedMotion } from '../lib/smooth';
import { TechLogo } from '../components/TechLogos';
import { SkillsDrum3D } from '../components/SkillsDrum3D';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Curated skills for the continuous mobile marquee ticker
const MARQUEE_TRACK_1 = [
  { name: 'React', label: 'React' },
  { name: 'TypeScript', label: 'TypeScript' },
  { name: 'Python', label: 'Python' },
  { name: 'Tailwind CSS', label: 'Tailwind CSS' },
  { name: 'Vite', label: 'Vite' },
  { name: 'Firebase', label: 'Firebase' },
  { name: 'Docker', label: 'Docker' },
  { name: 'PostgreSQL', label: 'PostgreSQL' },
  { name: 'C++', label: 'C++' },
  { name: 'Git', label: 'Git' },
  { name: 'OpenCV', label: 'OpenCV' },
  { name: 'REST APIs', label: 'REST APIs' }
];

const MARQUEE_TRACK_2 = [
  { name: 'JavaScript', label: 'JavaScript' },
  { name: 'HTML', label: 'HTML5' },
  { name: 'CSS', label: 'CSS3' },
  { name: 'Java', label: 'Java' },
  { name: 'Supabase', label: 'Supabase' },
  { name: 'Linux', label: 'Linux' },
  { name: 'GitHub', label: 'GitHub' },
  { name: 'VS Code', label: 'VS Code' },
  { name: 'Postman', label: 'Postman' },
  { name: 'Computer Networks', label: 'Networks & PCAP' },
  { name: 'SQL', label: 'Database & SQL' },
  { name: 'AI application development', label: 'Applied AI & LLMs' }
];

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [maturityFilter, setMaturityFilter] = useState<'all' | SkillMaturity>('all');

  // Entrance animations on scroll into Technical Index
  useGSAP(
    () => {
      if (isReducedMotion()) return;

      // Section header entrance
      gsap.from('[data-skills-header]', {
        y: 32,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: {
          trigger: '[data-skills-header]',
          start: 'top 88%',
          once: true
        }
      });

      // Mobile Marquee entrance
      gsap.from('[data-skills-marquee]', {
        y: 28,
        autoAlpha: 0,
        duration: 0.75,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: {
          trigger: '[data-skills-marquee]',
          start: 'top 90%',
          once: true
        }
      });

      // 3D Drum entrance on scroll (Desktop)
      gsap.from('[data-skills-drum]', {
        y: 32,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: {
          trigger: '[data-skills-drum]',
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
      id="skills"
      aria-labelledby="skills-heading"
      className="scroll-mt-20 border-b border-[var(--line)] bg-[var(--surface-subtle)]/40 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div data-skills-header className="border-b border-[var(--line)] pb-8">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">
            Technical Index
          </p>
          <h2 id="skills-heading" className="heading-section display-serif mt-3 text-[var(--fg)]">
            Tools I&apos;ve built with vs. what I&apos;m exploring.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--fg-2)]">
            No synthetic percentage bars. Compact labels separate technologies shipped inside real repositories from
            areas currently under study.
          </p>
        </div>

        {/* Legend (Desktop) */}
        <div className="mt-5 hidden sm:flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-[var(--muted)]">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--status-live-fg)]" aria-hidden="true" />
            <span>Applied in projects</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full border border-dashed border-[var(--accent)]" aria-hidden="true" />
            <span>Currently exploring</span>
          </span>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* MOBILE ONLY: Automatic Continuous Marquee Ticker (Image 2 style) */}
        {/* ------------------------------------------------------------- */}
        <div data-skills-marquee className="sm:hidden mt-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--accent)]">
              Tech Stack &amp; Tooling
            </span>
            <span className="font-mono text-[10px] text-[var(--muted)]">
              Auto-scrolling stream
            </span>
          </div>

          <div className="marquee-container overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)] py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            {/* Track 1: Gliding Left */}
            <div className="animate-marquee-left flex gap-3">
              {[...MARQUEE_TRACK_1, ...MARQUEE_TRACK_1].map((skill, i) => (
                <div
                  key={`t1-${skill.name}-${i}`}
                  className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-elevated,var(--surface))] px-3.5 py-1.5 shadow-sm shrink-0"
                >
                  <TechLogo name={skill.name} className="h-4 w-4 shrink-0" />
                  <span className="font-mono text-xs font-medium text-[var(--fg)] whitespace-nowrap">
                    {skill.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Track 2: Gliding Right (Opposite Direction) */}
            <div className="animate-marquee-right mt-3 flex gap-3">
              {[...MARQUEE_TRACK_2, ...MARQUEE_TRACK_2].map((skill, i) => (
                <div
                  key={`t2-${skill.name}-${i}`}
                  className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-elevated,var(--surface))] px-3.5 py-1.5 shadow-sm shrink-0"
                >
                  <TechLogo name={skill.name} className="h-4 w-4 shrink-0" />
                  <span className="font-mono text-xs font-medium text-[var(--fg)] whitespace-nowrap">
                    {skill.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* DESKTOP & TABLET: 3D Holographic Cylindrical Drum (Rolodex) */}
        {/* ------------------------------------------------------------- */}
        <div data-skills-drum className="mt-8 hidden sm:block">
          <SkillsDrum3D
            categories={SKILL_CATEGORIES}
            maturityFilter={maturityFilter}
            onMaturityFilterChange={setMaturityFilter}
          />
        </div>
      </div>
    </section>
  );
}
export default SkillsSection;
