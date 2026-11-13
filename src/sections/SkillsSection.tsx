import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';
import { useGSAP } from '@gsap/react';
import { SKILL_CATEGORIES, type SkillMaturity } from '../content/skills';
import { gsap, ScrollTrigger, isReducedMotion } from '../lib/smooth';
import { TechLogo } from '../components/TechLogos';

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
  const rowsContainerRef = useRef<HTMLDivElement | null>(null);

  const [maturityFilter, setMaturityFilter] = useState<'all' | SkillMaturity>('all');
  const totalSkills = SKILL_CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0);

  // Entrance animations on scroll into Technical Index
  useGSAP(
    () => {
      if (isReducedMotion()) return;

      // Section header entrance
      gsap.from('[data-skills-header]', {
        y: 36,
        autoAlpha: 0,
        duration: 0.85,
        ease: 'expo.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          once: true
        }
      });

      // Category rows entrance with stagger (Desktop)
      gsap.from('.skill-category-row', {
        y: 32,
        autoAlpha: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: 'expo.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true
        }
      });
    },
    { scope: sectionRef }
  );

  const handleMaturityClick = (tabId: 'all' | SkillMaturity) => {
    setMaturityFilter(tabId);
    if (!isReducedMotion() && rowsContainerRef.current) {
      window.requestAnimationFrame(() => {
        if (!rowsContainerRef.current) return;
        const rows = rowsContainerRef.current.querySelectorAll('.skill-category-row');
        if (!rows.length) return;
        gsap.fromTo(
          rows,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.04,
            ease: 'expo.out',
            clearProps: 'transform,opacity,visibility'
          }
        );
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-labelledby="skills-heading"
      className="scroll-mt-20 border-b border-[var(--line)] bg-[var(--surface-subtle)]/40 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div data-skills-header className="flex flex-col justify-between gap-6 border-b border-[var(--line)] pb-8 md:flex-row md:items-end">
          <div>
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

          <div role="group" aria-label="Filter skills by experience level" className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: `All (${totalSkills})` },
              { id: 'applied', label: 'Experienced / Applied' },
              { id: 'exploring', label: 'Currently Exploring' }
            ].map((tab) => {
              const active = maturityFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleMaturityClick(tab.id as 'all' | SkillMaturity)}
                  aria-pressed={active}
                  className={`btn-tactile min-h-[44px] rounded-md border px-3.5 text-xs font-medium ${
                    active
                      ? 'border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--accent)]'
                      : 'border-[var(--line)] bg-transparent text-[var(--fg-2)] hover:border-[var(--line-strong)]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
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
        <div className="sm:hidden mt-8">
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
        {/* DESKTOP & TABLET: Clean 7-Category Typographic Ledger */}
        {/* ------------------------------------------------------------- */}
        <div ref={rowsContainerRef} className="mt-8 hidden sm:block divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {SKILL_CATEGORIES.map((category) => {
            const visibleItems =
              maturityFilter === 'all'
                ? category.items
                : category.items.filter((item) => item.maturity === maturityFilter);

            if (visibleItems.length === 0) return null;

            return (
              <div
                key={category.id}
                className="skill-category-row grid grid-cols-1 gap-4 py-5 sm:gap-5 sm:py-7 lg:grid-cols-12 lg:gap-10"
              >
                <div className="lg:col-span-4">
                  <span className="font-mono text-xs text-[var(--muted)]">{category.index}</span>
                  <h3 className="mt-1 text-base sm:text-lg font-semibold text-[var(--fg)]">{category.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{category.summary}</p>
                </div>

                <div className="lg:col-span-8">
                  <div className="flex flex-wrap gap-2">
                    {visibleItems.map((item) => (
                      <span
                        key={item.name}
                        className={`inline-flex items-center gap-2 rounded-md px-3 py-1 font-mono text-xs font-medium ${
                          item.maturity === 'applied'
                            ? 'border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--fg)]'
                            : 'border border-dashed border-[var(--accent)]/60 bg-[var(--accent-tint)]/40 text-[var(--accent)]'
                        }`}
                      >
                        <TechLogo name={item.name} className="h-3.5 w-3.5 shrink-0" />
                        <span>{item.name}</span>
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            item.maturity === 'applied'
                              ? 'bg-[var(--status-live-fg)]'
                              : 'border border-[var(--accent)]'
                          }`}
                          aria-hidden="true"
                        />
                      </span>
                    ))}
                  </div>

                  {/* Dense evidence ledger with case study links */}
                  <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 border-t border-[var(--line)]/70 pt-3 sm:grid-cols-2">
                    {visibleItems.map((item) => (
                      <div key={item.name} className="flex items-baseline justify-between gap-2 text-xs">
                        <div className="min-w-0">
                          <dt className="inline font-semibold text-[var(--fg)]">{item.name}: </dt>
                          <dd className="inline text-[var(--fg-2)]">{item.evidence}</dd>
                        </div>
                        {item.projectSlug && (
                          <Link
                            to={`/projects/${item.projectSlug}`}
                            aria-label={`View ${item.name} evidence in project case study`}
                            className="inline-flex shrink-0 items-center gap-0.5 font-mono text-[11px] font-medium text-[var(--accent)] hover:underline"
                          >
                            <span>Proof</span>
                            <ArrowUpRight size={11} aria-hidden="true" />
                          </Link>
                        )}
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dedicated Research Topics Discovery Card linking to /exploring */}
        <div className="mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">
              Research &amp; Ongoing Study
            </p>
            <h3 className="mt-1 text-base sm:text-lg font-semibold text-[var(--fg)]">
              Currently Exploring (4 Dedicated Study Tracks)
            </h3>
            <p className="mt-1 text-xs text-[var(--fg-2)] max-w-xl">
              Deep-dives into ML from scratch, AST static analysis, and concurrent systems architectures backed by active public repositories.
            </p>
          </div>

          <Link
            to="/exploring"
            className="btn-tactile inline-flex shrink-0 items-center gap-2 rounded-lg border border-[var(--line-strong)] bg-[var(--surface-elevated,var(--surface))] px-4 py-2.5 font-mono text-xs font-medium text-[var(--accent)] hover:border-[var(--accent)]"
          >
            <span>View Dedicated Exploring Page</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
export default SkillsSection;
