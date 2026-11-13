import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { useGSAP } from '@gsap/react';
import { SKILL_CATEGORIES, type SkillMaturity } from '../content/skills';
import { gsap, ScrollTrigger, isReducedMotion } from '../lib/smooth';
import { TechLogo } from '../components/TechLogos';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface FlatSkill {
  name: string;
  categoryId: string;
  categoryTitle: string;
  maturity: SkillMaturity;
  evidence: string;
  projectSlug?: string;
}

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rowsContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollTrackRef = useRef<HTMLDivElement | null>(null);

  const [maturityFilter, setMaturityFilter] = useState<'all' | SkillMaturity>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');

  const totalSkills = SKILL_CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0);

  // Flattened deduplicated skills list with logos for full scroll bar
  const allSkills = useMemo(() => {
    const list: FlatSkill[] = [];
    const seen = new Set<string>();
    SKILL_CATEGORIES.forEach((cat) => {
      cat.items.forEach((item) => {
        if (!seen.has(item.name)) {
          seen.add(item.name);
          list.push({
            name: item.name,
            categoryId: cat.id,
            categoryTitle: cat.title,
            maturity: item.maturity,
            evidence: item.evidence,
            projectSlug: item.projectSlug
          });
        }
      });
    });
    return list;
  }, []);

  const filteredSkills = useMemo(() => {
    return allSkills.filter((s) => {
      const matchCat = selectedCategory === 'all' || s.categoryId === selectedCategory;
      const matchMat = maturityFilter === 'all' || s.maturity === maturityFilter;
      return matchCat && matchMat;
    });
  }, [allSkills, selectedCategory, maturityFilter]);

  const handleScrollBy = (offset: number) => {
    if (!scrollTrackRef.current) return;
    scrollTrackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

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

      // Category rows entrance with stagger
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

        {/* Legend */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-[var(--muted)]">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--status-live-fg)]" aria-hidden="true" />
              <span>Applied in projects</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full border border-dashed border-[var(--accent)]" aria-hidden="true" />
              <span>Currently exploring</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
            <span>Showing {filteredSkills.length} skills with logos</span>
          </div>
        </div>

        {/* Full Scroll Bar of Skills with Logos */}
        <div className="mt-6 rounded-xl border border-[var(--line-strong)] bg-[var(--surface)] p-4 sm:p-5 shadow-sm">
          {/* Header Controls for the Full Scroll Bar: Category Tabs & Left/Right buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--line)] pb-3.5">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none [mask-image:linear-gradient(to_right,black_88%,transparent)]">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`btn-tactile shrink-0 rounded-full px-3 py-1 font-mono text-[11px] font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'border border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--accent)]'
                    : 'border border-[var(--line)] bg-[var(--surface-subtle)] text-[var(--muted)] hover:border-[var(--line-strong)]'
                }`}
              >
                All Skills ({allSkills.length})
              </button>
              {SKILL_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`btn-tactile shrink-0 rounded-full px-3 py-1 font-mono text-[11px] font-medium transition-all ${
                      isSelected
                        ? 'border border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--accent)]'
                        : 'border border-[var(--line)] bg-[var(--surface-subtle)] text-[var(--muted)] hover:border-[var(--line-strong)]'
                    }`}
                  >
                    <span>{cat.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Manual Scroll Arrow Controls (Tactile Buttons) */}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleScrollBy(-280)}
                aria-label="Scroll skills left"
                className="btn-tactile rounded-md border border-[var(--line)] bg-[var(--surface-subtle)] p-1.5 text-[var(--fg-2)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--fg)]"
              >
                <CaretLeft size={14} weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => handleScrollBy(280)}
                aria-label="Scroll skills right"
                className="btn-tactile rounded-md border border-[var(--line)] bg-[var(--surface-subtle)] p-1.5 text-[var(--fg-2)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--fg)]"
              >
                <CaretRight size={14} weight="bold" />
              </button>
            </div>
          </div>

          {/* Dedicated Horizontal Scroll Track of Skills with Logos */}
          <div
            ref={scrollTrackRef}
            className="skills-scroll-track mt-4 overflow-x-auto pb-3 pt-1 scroll-smooth"
          >
            <div className="grid grid-rows-2 sm:grid-rows-3 grid-flow-col auto-cols-max gap-2.5 min-w-max pr-6">
              {filteredSkills.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center gap-2.5 rounded-lg border border-[var(--line)] bg-[var(--surface-elevated,var(--surface))] px-3 py-2 transition-all hover:border-[var(--accent)] hover:shadow-sm"
                >
                  <TechLogo name={skill.name} className="h-5 w-5 shrink-0" />
                  <span className="font-mono text-xs font-semibold text-[var(--fg)] whitespace-nowrap">
                    {skill.name}
                  </span>
                  <span
                    className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                      skill.maturity === 'applied'
                        ? 'bg-[var(--status-live-fg)]'
                        : 'border border-[var(--accent)]'
                    }`}
                    title={skill.maturity === 'applied' ? 'Applied in projects' : 'Currently exploring'}
                    aria-hidden="true"
                  />
                  {skill.projectSlug && (
                    <Link
                      to={`/projects/${skill.projectSlug}`}
                      aria-label={`View ${skill.name} project proof`}
                      className="inline-flex items-center text-[var(--accent)] opacity-60 hover:opacity-100 transition-opacity ml-0.5"
                    >
                      <ArrowUpRight size={11} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Swipe / Scroll Hint */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-[var(--muted)]">
            <span>← Scroll horizontally to view all skills →</span>
            <span className="sm:hidden flex items-center gap-1 text-[10px]">
              <span>Swipe left / right</span>
            </span>
          </div>
        </div>

        {/* 7-category typographic ledger (Desktop & Tablet) */}
        <div ref={rowsContainerRef} className="mt-10 hidden sm:block divide-y divide-[var(--line)] border-y border-[var(--line)]">
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
