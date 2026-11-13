import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CaretDown, CaretLeft, CaretRight, Pause, Play } from '@phosphor-icons/react';
import { useGSAP } from '@gsap/react';
import { CURRENTLY_EXPLORING, SKILL_CATEGORIES, type SkillMaturity } from '../content/skills';
import { gsap, ScrollTrigger, isReducedMotion } from '../lib/smooth';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rowsContainerRef = useRef<HTMLDivElement | null>(null);
  const exploringRef = useRef<HTMLDivElement | null>(null);
  const pillsScrollRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [maturityFilter, setMaturityFilter] = useState<'all' | SkillMaturity>('all');
  const [mobileCategoryIdx, setMobileCategoryIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [rollAnim, setRollAnim] = useState<'rolling-in' | 'rolling-out-next' | 'rolling-out-prev'>('rolling-in');
  const [isExploringExpandedMobile, setIsExploringExpandedMobile] = useState(false);

  const totalSkills = SKILL_CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0);

  const resetResumeTimer = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 4500);
  };

  const goToCategory = (newIdx: number, direction: 'next' | 'prev') => {
    if (newIdx === mobileCategoryIdx) return;
    setRollAnim(direction === 'next' ? 'rolling-out-next' : 'rolling-out-prev');
    setTimeout(() => {
      setMobileCategoryIdx(newIdx);
      setRollAnim('rolling-in');
    }, 160);
  };

  // Mobile 3D auto-roll timer
  useEffect(() => {
    if (isPaused || isReducedMotion()) return;
    const interval = setInterval(() => {
      setRollAnim('rolling-out-next');
      setTimeout(() => {
        setMobileCategoryIdx((prev) => (prev + 1) % SKILL_CATEGORIES.length);
        setRollAnim('rolling-in');
      }, 160);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, mobileCategoryIdx]);

  // Keep active category pill scrolled into view on mobile
  useEffect(() => {
    if (!pillsScrollRef.current) return;
    const activeBtn = pillsScrollRef.current.children[mobileCategoryIdx] as HTMLElement | undefined;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [mobileCategoryIdx]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    resetResumeTimer();
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        goToCategory((mobileCategoryIdx + 1) % SKILL_CATEGORIES.length, 'next');
      } else {
        goToCategory((mobileCategoryIdx - 1 + SKILL_CATEGORIES.length) % SKILL_CATEGORIES.length, 'prev');
      }
    }
  };

  const activeCategory = SKILL_CATEGORIES[mobileCategoryIdx] || SKILL_CATEGORIES[0];
  const activeCategoryVisibleItems =
    maturityFilter === 'all'
      ? activeCategory.items
      : activeCategory.items.filter((item) => item.maturity === maturityFilter);

  // Entrance animations on scroll into Technical Index & Currently Exploring
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

      // Dedicated Currently Exploring header
      gsap.from('[data-exploring-header]', {
        y: 36,
        autoAlpha: 0,
        duration: 0.85,
        ease: 'expo.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: {
          trigger: exploringRef.current,
          start: 'top 85%',
          once: true
        }
      });

      // Exploring topic cards with stagger
      gsap.from('.exploring-card', {
        y: 36,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'expo.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: {
          trigger: exploringRef.current,
          start: 'top 85%',
          once: true
        }
      });
    },
    { scope: sectionRef }
  );

  const handleFilterClick = (tabId: 'all' | SkillMaturity) => {
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
                  onClick={() => handleFilterClick(tab.id as 'all' | SkillMaturity)}
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

        {/* Typography-driven legend (Desktop) */}
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

        {/* Mobile 3D Mechanical Tumbler / Rolling Card */}
        <div className="sm:hidden mt-6 space-y-4">
          {/* Category Pill Track (horizontal scroll with smooth center alignment) */}
          <div
            ref={pillsScrollRef}
            className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none [mask-image:linear-gradient(to_right,black_85%,transparent)]"
          >
            {SKILL_CATEGORIES.map((cat, idx) => {
              const isActive = idx === mobileCategoryIdx;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setIsPaused(true);
                    resetResumeTimer();
                    goToCategory(idx, idx > mobileCategoryIdx ? 'next' : 'prev');
                  }}
                  className={`btn-tactile shrink-0 rounded-full px-3 py-1 font-mono text-[11px] font-medium transition-all duration-200 ${
                    isActive
                      ? 'border border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--accent)] shadow-sm'
                      : 'border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)]'
                  }`}
                >
                  <span className="opacity-60">{cat.index} </span>
                  <span>{cat.title}</span>
                </button>
              );
            })}
          </div>

          {/* 3D Tumbler Stage & Card */}
          <div
            className="skills-3d-stage relative"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => resetResumeTimer()}
          >
            {/* Auto-roll progress indicator line */}
            <div className="relative h-0.5 w-full overflow-hidden rounded-full bg-[var(--line)]">
              <div
                key={mobileCategoryIdx}
                className={`h-full bg-[var(--accent)] animate-roller-progress ${isPaused ? 'paused' : ''}`}
              />
            </div>

            {/* Tumbler Card */}
            <div
              className={`skills-3d-card ${rollAnim} mt-2 rounded-xl border border-[var(--line-strong)] bg-[var(--surface)] p-5 shadow-sm`}
            >
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-[var(--accent)]">
                    {activeCategory.index}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--muted)] uppercase tracking-wider">
                    {activeCategory.id}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--muted)]">
                  <span>{mobileCategoryIdx + 1}/{SKILL_CATEGORIES.length}</span>
                  <button
                    type="button"
                    onClick={() => setIsPaused((prev) => !prev)}
                    className="p-1 text-[var(--fg-2)] hover:text-[var(--fg)]"
                    aria-label={isPaused ? 'Resume auto-roll' : 'Pause auto-roll'}
                  >
                    {isPaused ? <Play size={12} weight="bold" /> : <Pause size={12} weight="bold" />}
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <h3 className="text-base font-semibold text-[var(--fg)]">{activeCategory.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--muted)] line-clamp-2">
                  {activeCategory.summary}
                </p>
              </div>

              {/* Skills pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                {activeCategoryVisibleItems.map((item) => (
                  <span
                    key={item.name}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[11px] font-medium ${
                      item.maturity === 'applied'
                        ? 'border border-[var(--line-strong)] bg-[var(--surface-elevated,var(--surface))] text-[var(--fg)]'
                        : 'border border-dashed border-[var(--accent)]/60 bg-[var(--accent-tint)]/40 text-[var(--accent)]'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        item.maturity === 'applied' ? 'bg-[var(--status-live-fg)]' : 'border border-[var(--accent)]'
                      }`}
                      aria-hidden="true"
                    />
                    <span>{item.name}</span>
                  </span>
                ))}
              </div>

              {/* Tumbler mechanical controls & swipe hint */}
              <div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-3 text-[11px] text-[var(--muted)]">
                <span className="font-mono text-[10px]">Swipe or tap to roll</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPaused(true);
                      resetResumeTimer();
                      goToCategory((mobileCategoryIdx - 1 + SKILL_CATEGORIES.length) % SKILL_CATEGORIES.length, 'prev');
                    }}
                    className="btn-tactile rounded border border-[var(--line)] p-1.5 text-[var(--fg-2)] hover:border-[var(--line-strong)]"
                    aria-label="Previous category"
                  >
                    <CaretLeft size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPaused(true);
                      resetResumeTimer();
                      goToCategory((mobileCategoryIdx + 1) % SKILL_CATEGORIES.length, 'next');
                    }}
                    className="btn-tactile rounded border border-[var(--line)] p-1.5 text-[var(--fg-2)] hover:border-[var(--line-strong)]"
                    aria-label="Next category"
                  >
                    <CaretRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 7-category typographic ledger (Desktop & Tablet) */}
        <div ref={rowsContainerRef} className="mt-6 hidden sm:block divide-y divide-[var(--line)] border-y border-[var(--line)]">
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
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            item.maturity === 'applied'
                              ? 'bg-[var(--status-live-fg)]'
                              : 'border border-[var(--accent)]'
                          }`}
                          aria-hidden="true"
                        />
                        <span>{item.name}</span>
                      </span>
                    ))}
                  </div>

                  {/* Dense evidence ledger hidden on mobile to keep category view clean & focused on tech stack */}
                  <dl className="mt-4 hidden sm:grid grid-cols-1 gap-x-6 gap-y-2 border-t border-[var(--line)]/70 pt-3 sm:grid-cols-2">
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

        {/* Dedicated Currently Exploring band with typographic columns */}
        <div ref={exploringRef} id="exploring" className="scroll-mt-24 mt-14">
          <div data-exploring-header className="flex flex-col justify-between gap-2 border-b border-[var(--line)] pb-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">Currently Exploring</p>
              <h3 className="mt-2 text-xl font-semibold text-[var(--fg)]">
                Topics &amp; reading backed by public repositories
              </h3>
            </div>
            <span className="font-mono text-xs text-[var(--muted)]">Verified on GitHub</span>
          </div>

          {/* Mobile Collapse Toggle */}
          <div className="sm:hidden mt-4">
            <button
              type="button"
              onClick={() => setIsExploringExpandedMobile((prev) => !prev)}
              className="btn-tactile flex w-full items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-left font-mono text-xs text-[var(--fg-2)] hover:border-[var(--line-strong)]"
            >
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full border border-[var(--accent)]" />
                <span className="font-semibold text-[var(--fg)]">
                  {isExploringExpandedMobile ? 'Hide Research Topics' : '+ Explore 4 Research Topics (Rust, Raft, eBPF)'}
                </span>
              </span>
              <CaretDown
                size={14}
                className={`transform transition-transform duration-200 ${isExploringExpandedMobile ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          <div
            className={`mt-6 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2 ${
              isExploringExpandedMobile ? 'block' : 'hidden sm:grid'
            }`}
          >
            {CURRENTLY_EXPLORING.map((topic, idx) => (
              <article key={topic.topic} className="exploring-card flex flex-col justify-between border-b border-[var(--line)] pb-5">
                <div>
                  <span className="font-mono text-[11px] text-[var(--muted)]">0{idx + 1}</span>
                  <h4 className="mt-1 text-base font-semibold text-[var(--fg)]">{topic.topic}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--fg-2)]">{topic.why}</p>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[var(--muted)]">{topic.evidence}</span>
                  {topic.repoUrl && (
                    <a
                      href={topic.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[32px] items-center gap-1 font-mono font-medium text-[var(--accent)] hover:underline"
                    >
                      <span>Repo</span>
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
