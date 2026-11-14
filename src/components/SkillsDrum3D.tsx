import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import { type SkillCategory, type SkillMaturity } from '../content/skills';
import { TechLogo } from './TechLogos';
import { isReducedMotion } from '../lib/smooth';

interface SkillsDrum3DProps {
  categories: SkillCategory[];
  maturityFilter: 'all' | SkillMaturity;
  onMaturityFilterChange: (f: 'all' | SkillMaturity) => void;
}

const SHORT_TITLES: Record<string, string> = {
  '01': 'Frontend',
  '02': 'Backend & APIs',
  '03': 'Languages',
  '04': 'AI & ML',
  '05': 'Cybersecurity',
  '06': 'CS Fundamentals',
  '07': 'Systems',
  '08': 'Dev Tools',
  '09': 'Open Source'
};

export function SkillsDrum3D({
  categories,
  maturityFilter,
  onMaturityFilterChange
}: SkillsDrum3DProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const deltaXRef = useRef(0);

  const total = categories.length;

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Hover-activated keyboard arrow navigation: user can swipe simply by hovering the drum area
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let isHovered = false;

    const onEnter = () => {
      isHovered = true;
    };

    const onLeave = () => {
      isHovered = false;
    };

    const onWindowKeyDown = (e: KeyboardEvent) => {
      if (!isHovered && document.activeElement !== el) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    };

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    window.addEventListener('keydown', onWindowKeyDown);

    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('keydown', onWindowKeyDown);
    };
  }, [goToPrev, goToNext]);

  // Keyboard navigation when drum area is focused
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    },
    [goToPrev, goToNext]
  );

  // Pointer drag/swipe gesture support
  const handlePointerDown = (e: React.PointerEvent) => {
    // Don't hijack if user clicked an interactive link or button inside the card or scroll area
    if ((e.target as HTMLElement).closest('a, button, [role="button"], [data-lenis-prevent]')) return;
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    deltaXRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    deltaXRef.current = e.clientX - startXRef.current;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const threshold = 40; // minimum drag distance in px
    if (deltaXRef.current > threshold) {
      goToPrev();
    } else if (deltaXRef.current < -threshold) {
      goToNext();
    }
  };

  const reduced = isReducedMotion();

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="3D Interactive Technical Index Cylinder"
      className="outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded-2xl"
    >
      {/* Top Controls: Category Jump Ribbon */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">
            Category Deck
          </span>
          <span className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[11px] text-[var(--muted)] tabular-nums">
            {categories[activeIndex].index} / {String(total).padStart(2, '0')}
          </span>
        </div>

        {/* Maturity Filter Tabs */}
        <div role="group" aria-label="Filter skills by maturity" className="flex items-center gap-1.5">
          {[
            { id: 'all', label: 'All Stack' },
            { id: 'applied', label: 'Applied' },
            { id: 'exploring', label: 'Exploring' }
          ].map((tab) => {
            const active = maturityFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onMaturityFilterChange(tab.id as 'all' | SkillMaturity)}
                aria-pressed={active}
                className={`btn-tactile rounded-md border px-3 py-1 font-mono text-[11px] font-medium transition-colors ${
                  active
                    ? 'border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--accent)] shadow-[0_0_8px_rgba(255,90,40,0.15)]'
                    : 'border-[var(--line)] bg-[var(--surface)] text-[var(--fg-2)] hover:border-[var(--line-strong)]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick-Jump Category Ribbon */}
      <div className="mb-6 flex gap-1.5 overflow-x-auto pb-2 scrollbar-none [mask-image:linear-gradient(to_right,black_90%,transparent)]">
        {categories.map((cat, idx) => {
          const isCurrent = idx === activeIndex;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`group flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs whitespace-nowrap transition-all duration-200 shrink-0 ${
                isCurrent
                  ? 'border-[var(--accent)] bg-[var(--surface-elevated,var(--surface))] text-[var(--fg)] shadow-sm'
                  : 'border-transparent bg-[var(--surface)]/40 text-[var(--muted)] hover:border-[var(--line)] hover:text-[var(--fg)]'
              }`}
            >
              <span
                className={`text-[10px] tabular-nums ${
                  isCurrent ? 'text-[var(--accent)] font-bold' : 'text-[var(--muted)]'
                }`}
              >
                {cat.index}
              </span>
              <span className="font-medium">{SHORT_TITLES[cat.index] || cat.title}</span>
              {isCurrent && (
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3D Cylindrical Rolodex Drum Viewport */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative h-[560px] w-full overflow-hidden select-none [perspective:1400px] cursor-grab active:cursor-grabbing"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 12%, black 88%, transparent)'
        }}
      >
        <div
          className="relative h-full w-full [transform-style:preserve-3d]"
          style={{ willChange: 'transform' }}
        >
          {categories.map((category, idx) => {
            // Compute circular difference
            let diff = idx - activeIndex;
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            const isCenter = diff === 0;
            const isAdjacent = Math.abs(diff) === 1;
            const isFar = Math.abs(diff) === 2;
            const isHidden = Math.abs(diff) > 2;

            if (isHidden) return null;

            // 3D positioning on cylindrical curved trajectory
            let translateX = 0;
            let translateZ = 0;
            let rotateY = 0;
            let scale = 1;
            let opacity = 0;
            let zIndex = 10;
            let blur = '0px';

            if (isCenter) {
              translateX = 0;
              translateZ = 0;
              rotateY = 0;
              scale = 1;
              opacity = 1;
              zIndex = 30;
              blur = '0px';
            } else if (isAdjacent) {
              translateX = diff * 380;
              translateZ = -140;
              rotateY = -diff * 26;
              scale = 0.86;
              opacity = 0.42;
              zIndex = 20;
              blur = '1.5px';
            } else if (isFar) {
              translateX = diff * 640;
              translateZ = -280;
              rotateY = -diff * 44;
              scale = 0.72;
              opacity = 0.12;
              zIndex = 10;
              blur = '3px';
            }

            const visibleItems =
              maturityFilter === 'all'
                ? category.items
                : category.items.filter((item) => item.maturity === maturityFilter);

            return (
              <div
                key={category.id}
                onClick={() => {
                  if (!isCenter) setActiveIndex(idx);
                }}
                className={`absolute left-1/2 top-1/2 w-full max-w-2xl h-[450px] rounded-2xl border transition-all duration-500 ease-out ${
                  isCenter
                    ? 'border-[var(--line-strong)] bg-[#FAF8F5] dark:bg-[var(--surface-elevated,var(--surface))] shadow-[0_20px_48px_-16px_rgba(60,45,30,0.08)] dark:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-[var(--line)]'
                    : 'border-[var(--line)] bg-[#EFECE4] dark:bg-[var(--surface-subtle)] cursor-pointer hover:border-[var(--accent)] hover:opacity-70'
                }`}
                style={{
                  transform: reduced
                    ? `translate(-50%, -50%) ${isCenter ? 'scale(1)' : 'scale(0.95)'}`
                    : `translate3d(calc(-50% + ${translateX}px), -50%, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity: reduced ? (isCenter ? 1 : 0) : opacity,
                  zIndex,
                  filter: reduced ? 'none' : `blur(${blur})`,
                  pointerEvents: isCenter ? 'auto' : 'auto',
                  willChange: 'transform, opacity'
                }}
              >
                <div className="p-6 sm:p-7 flex flex-col h-full overflow-hidden">
                  {/* Card Header */}
                  <div className="shrink-0 flex items-start justify-between gap-4 border-b border-[var(--line)] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[var(--accent)]">
                          [{category.index}]
                        </span>
                        <h3 className="text-lg sm:text-xl font-semibold text-[var(--fg)]">
                          {category.title}
                        </h3>
                      </div>
                      <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed line-clamp-2">
                        {category.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 font-mono text-[11px] text-[var(--muted)]">
                      <span className="h-2 w-2 rounded-full bg-[var(--status-live-fg)]" />
                      <span>{category.items.length} tools</span>
                    </div>
                  </div>

                  {/* Skills Pills Grid */}
                  <div className="mt-4 shrink-0 flex flex-wrap gap-2">
                    {visibleItems.length === 0 ? (
                      <p className="py-2 font-mono text-xs text-[var(--muted)] italic">
                        No skills in this category match the &apos;{maturityFilter}&apos; filter.
                      </p>
                    ) : (
                      visibleItems.map((item) => (
                        <span
                          key={item.name}
                          className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-transform ${
                            item.maturity === 'applied'
                              ? 'border border-[var(--line-strong)] bg-[var(--surface-elevated,var(--surface))] text-[var(--fg)]'
                              : 'border border-dashed border-[var(--accent)]/60 bg-[var(--accent-tint)]/40 text-[var(--accent)]'
                          }`}
                        >
                          <TechLogo name={item.name} className="h-3.5 w-3.5 shrink-0" />
                          <span>{item.name}</span>
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              item.maturity === 'applied'
                                ? 'bg-[var(--status-live-fg)] shadow-[0_0_4px_var(--status-live-fg)]'
                                : 'border border-[var(--accent)]'
                            }`}
                            aria-hidden="true"
                          />
                        </span>
                      ))
                    )}
                  </div>

                  {/* Evidence & Case Study Proof Ledger */}
                  {isCenter && visibleItems.length > 0 && (
                    <div
                      data-lenis-prevent="true"
                      onWheel={(e) => {
                        e.stopPropagation();
                      }}
                      className="mt-4 flex-1 overflow-y-auto pr-1.5 border-t border-[var(--line)] pt-3 scrollbar-thin overscroll-contain"
                    >
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-2">
                        Verifiable Evidence Ledger
                      </span>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2 text-xs">
                        {visibleItems.map((item) => (
                          <div
                            key={item.name}
                            className="flex items-baseline justify-between gap-2 p-1.5 rounded bg-[var(--surface-subtle)]/50"
                          >
                            <div className="min-w-0">
                              <dt className="inline font-semibold text-[var(--fg)] font-mono text-[11px]">
                                {item.name}:{' '}
                              </dt>
                              <dd className="inline text-[var(--fg-2)] text-[11px]">
                                {item.evidence}
                              </dd>
                            </div>
                            {item.projectSlug && (
                              <Link
                                to={`/projects/${item.projectSlug}`}
                                aria-label={`View ${item.name} evidence in project case study`}
                                className="inline-flex shrink-0 items-center gap-0.5 font-mono text-[10px] font-medium text-[var(--accent)] hover:underline ml-1"
                              >
                                <span>Proof</span>
                                <ArrowUpRight size={10} aria-hidden="true" />
                              </Link>
                            )}
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Controls: Tactile Navigation and Step Indicators */}
      <div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-4">
        <button
          type="button"
          onClick={goToPrev}
          aria-label="Previous skill category"
          className="btn-tactile inline-flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2 font-mono text-xs text-[var(--fg)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span className="hidden sm:inline">Prev Category</span>
        </button>

        {/* Center Indicators */}
        <div className="flex items-center gap-2">
          {categories.map((cat, idx) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Jump to category ${cat.index}: ${cat.title}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? 'w-6 bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]'
                  : 'w-2 bg-[var(--line-strong)] hover:bg-[var(--muted)]'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goToNext}
          aria-label="Next skill category"
          className="btn-tactile inline-flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2 font-mono text-xs text-[var(--fg)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        >
          <span className="hidden sm:inline">Next Category</span>
          <ArrowRight size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
