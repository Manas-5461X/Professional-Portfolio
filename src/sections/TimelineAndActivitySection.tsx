import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';
import { useGSAP } from '@gsap/react';
import { GITHUB_ACTIVITY, type ContributionDay, type GitHubActivityData } from '../content/github';
import { PROFILE, TIMELINE, VERIFIED_MILESTONES } from '../content/profile';
import { gsap, ScrollTrigger, isReducedMotion } from '../lib/smooth';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function getCellClass(count: number): string {
  if (count === 0) return 'bg-[var(--surface-subtle)] border-[var(--line)]';
  if (count <= 3) return 'bg-sky-200 dark:bg-sky-900/60 border-sky-300 dark:border-sky-800';
  if (count <= 9) return 'bg-sky-400 dark:bg-sky-700/80 border-sky-500 dark:border-sky-600';
  if (count <= 19) return 'bg-sky-600 dark:bg-sky-500 border-sky-700 dark:border-sky-400';
  return 'bg-[#0369A1] dark:bg-[#38BDF8] border-[#075985] dark:border-sky-300';
}

export function TimelineAndActivitySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const timelineListRef = useRef<HTMLOListElement | null>(null);
  const githubRef = useRef<HTMLDivElement | null>(null);
  const milestonesRef = useRef<HTMLDivElement | null>(null);

  const [activity, setActivity] = useState<GitHubActivityData>(GITHUB_ACTIVITY);
  const [isLive, setIsLive] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadLiveGitHub() {
      try {
        const CACHE_TTL_MS = 10 * 60 * 1000; // 10-minute cache TTL
        const cached = sessionStorage.getItem('live_github_activity');

        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            const isFresh = parsed?.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS;
            const isNotStale =
              parsed?.data && parsed.data.totalContributions >= GITHUB_ACTIVITY.totalContributions;

            if (isFresh && isNotStale && !cancelled) {
              setActivity(parsed.data);
              setIsLive(true);
              return;
            } else {
              // Expire stale cache so fresh live data is fetched immediately
              sessionStorage.removeItem('live_github_activity');
            }
          } catch {
            sessionStorage.removeItem('live_github_activity');
          }
        }

        const handle = PROFILE.handle || 'Manas-5461X';
        const [contribRes, userRes, reposRes] = await Promise.allSettled([
          fetch(`https://github-contributions-api.jogruber.de/v4/${handle}?y=last`)
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
          fetch(`https://api.github.com/users/${handle}`)
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
          fetch(`https://api.github.com/users/${handle}/repos?per_page=100`)
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null)
        ]);

        if (cancelled) return;

        if (contribRes.status === 'fulfilled' && contribRes.value?.contributions) {
          const days = contribRes.value.contributions as { date: string; count: number }[];
          const weeks: ContributionDay[][] = [];
          let currentWeek: ContributionDay[] = [];

          for (const d of days) {
            const dt = new Date(`${d.date}T00:00:00Z`);
            const dow = dt.getUTCDay();
            if (dow === 0 && currentWeek.length > 0) {
              weeks.push(currentWeek);
              currentWeek = [];
            }
            currentWeek.push({ date: d.date, count: d.count });
          }
          if (currentWeek.length > 0) weeks.push(currentWeek);

          const total = contribRes.value.total?.lastYear || days.reduce((acc, d) => acc + d.count, 0);
          const activeDays = days.filter((d) => d.count > 0).length;
          let longestStreak = 0;
          let tempStreak = 0;
          let bestDay = { date: '', count: 0 };

          for (const d of days) {
            if (d.count > bestDay.count) bestDay = { date: d.date, count: d.count };
            if (d.count > 0) {
              tempStreak++;
              if (tempStreak > longestStreak) longestStreak = tempStreak;
            } else {
              tempStreak = 0;
            }
          }

          let currentStreak = 0;
          for (let i = days.length - 1; i >= 0; i--) {
            if (days[i].count > 0) currentStreak++;
            else if (i === days.length - 1) continue;
            else break;
          }

          let publicRepos = GITHUB_ACTIVITY.publicRepos;
          let originalRepos = GITHUB_ACTIVITY.originalRepos;
          let totalStars = GITHUB_ACTIVITY.totalStars;

          if (userRes.status === 'fulfilled' && userRes.value?.public_repos) {
            publicRepos = userRes.value.public_repos;
          }

          if (reposRes.status === 'fulfilled' && Array.isArray(reposRes.value)) {
            originalRepos = reposRes.value.filter((r: { fork?: boolean }) => !r.fork).length;
            totalStars = reposRes.value.reduce(
              (acc: number, r: { stargazers_count?: number }) => acc + (r.stargazers_count || 0),
              0
            );
          }

          const finalTotal = Math.max(total, GITHUB_ACTIVITY.totalContributions);
          const finalActiveDays = Math.max(activeDays, GITHUB_ACTIVITY.activeDays);

          const liveData: GitHubActivityData = {
            username: handle,
            generatedAt: new Date().toISOString(),
            range: {
              start: days[0]?.date || GITHUB_ACTIVITY.range.start,
              end: days[days.length - 1]?.date || GITHUB_ACTIVITY.range.end
            },
            totalContributions: finalTotal,
            activeDays: finalActiveDays,
            avgPerActiveDay: Math.round((finalTotal / Math.max(1, finalActiveDays)) * 10) / 10,
            currentStreak: { length: currentStreak },
            longestStreak: { length: longestStreak },
            bestDay,
            publicRepos,
            originalRepos,
            totalStars,
            weeks
          };

          try {
            sessionStorage.setItem(
              'live_github_activity',
              JSON.stringify({ data: liveData, timestamp: Date.now() })
            );
          } catch {}

          setActivity(liveData);
          setIsLive(true);
        }
      } catch {
        // Graceful fallback to verified baseline telemetry
      }
    }

    void loadLiveGitHub();
    return () => {
      cancelled = true;
    };
  }, []);

  // Entrance animations on scroll into Development Journey & GitHub Activity
  useGSAP(
    () => {
      if (isReducedMotion()) return;

      // Development Journey left column header
      gsap.from('[data-journey-header]', {
        y: 32,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: {
          trigger: '[data-journey-header]',
          start: 'top 88%',
          once: true
        }
      });

      // Timeline entries progressive scroll reveal
      const timelineEntries = gsap.utils.toArray<HTMLElement>('.timeline-entry', sectionRef.current);
      timelineEntries.forEach((entry) => {
        gsap.from(entry, {
          y: 32,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility',
          scrollTrigger: {
            trigger: entry,
            start: 'top 88%',
            once: true
          }
        });
      });

      // Public GitHub Activity header & profile button
      gsap.from('[data-github-header]', {
        y: 32,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: {
          trigger: '[data-github-header]',
          start: 'top 88%',
          once: true
        }
      });

      // GitHub Stats Grid
      const stats = gsap.utils.toArray<HTMLElement>('.github-stat-item', sectionRef.current);
      stats.forEach((stat) => {
        gsap.from(stat, {
          y: 24,
          autoAlpha: 0,
          duration: 0.7,
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility',
          scrollTrigger: {
            trigger: stat,
            start: 'top 88%',
            once: true
          }
        });
      });

      // Contribution Matrix
      gsap.from('[data-github-matrix]', {
        y: 28,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: {
          trigger: '[data-github-matrix]',
          start: 'top 85%',
          once: true
        }
      });

      // Verified Highlights milestones
      const milestones = gsap.utils.toArray<HTMLElement>('.milestone-card', sectionRef.current);
      milestones.forEach((card) => {
        gsap.from(card, {
          y: 32,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            once: true
          }
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="activity"
      aria-labelledby="activity-heading"
      className="scroll-mt-20 border-b border-[var(--line)] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Part 1: Editorial Development Journey */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div data-journey-header className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">
              Development Journey
            </p>
            <h2 id="activity-heading" className="heading-section display-serif mt-3 text-[var(--fg)]">
              How the projects built on each other.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--fg-2)]">
              A chronological log traced directly to coursework progression and public commit history.
            </p>
          </div>

          <div className="lg:col-span-8">
            {/* Mobile swipe helper */}
            <div className="mb-3 flex items-center justify-between sm:hidden font-mono text-[11px] text-[var(--muted)]">
              <span className="text-[var(--accent)] font-semibold uppercase tracking-wider">Milestones</span>
              <span>← Swipe timeline ({TIMELINE.length}) →</span>
            </div>

            <ol
              ref={timelineListRef}
              className="flex gap-3 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:block sm:divide-y sm:divide-[var(--line)] sm:border-y sm:border-[var(--line)] sm:overflow-visible sm:pb-0 sm:pt-0"
            >
              {TIMELINE.map((entry, idx) => (
                <li
                  key={`${entry.period}-${entry.title}`}
                  className="timeline-entry min-w-[275px] max-w-[295px] shrink-0 snap-start rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:min-w-0 sm:max-w-none sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:py-5 grid grid-cols-1 gap-2 sm:grid-cols-12 sm:gap-6"
                >
                  <div className="sm:col-span-4">
                    <div className="flex items-center justify-between sm:block">
                      <span className="font-mono text-xs font-semibold text-[var(--accent)]">{entry.period}</span>
                      <span className="font-mono text-[10px] text-[var(--muted)] sm:hidden">
                        {String(idx + 1).padStart(2, '0')} / {String(TIMELINE.length).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--muted)]">
                      {entry.category}
                    </p>
                  </div>
                  <div className="sm:col-span-8">
                    <h3 className="text-sm sm:text-base font-semibold text-[var(--fg)]">{entry.title}</h3>
                    <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[var(--fg-2)]">{entry.summary}</p>
                    {entry.evidence && (
                      <p className="mt-2 font-mono text-[11px] sm:text-xs text-[var(--muted)]">Artifact: {entry.evidence}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Part 2: GitHub Open-Source Logbook */}
        <div ref={githubRef} className="mt-16 border-t border-[var(--line)] pt-12">
          <div data-github-header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">
                Public GitHub Activity
              </p>
              <h3 className="mt-2 flex flex-wrap items-center gap-2.5 text-2xl font-semibold tracking-tight text-[var(--fg)]">
                <span>Building in the open as @{activity.username}</span>
                {isLive ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-normal text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live GitHub Sync
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface-subtle)] px-2.5 py-0.5 font-mono text-[11px] font-normal text-[var(--muted)]">
                    Verified Baseline
                  </span>
                )}
              </h3>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Range: {activity.range.start} to {activity.range.end}.
              </p>
            </div>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tactile inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-[var(--line)] bg-[var(--surface)] px-4 text-sm font-medium text-[var(--fg)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <span>Inspect GitHub Profile</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-[var(--line)] py-6 sm:grid-cols-4">
            {[
              { label: 'Contributions (12 mo)', value: String(activity.totalContributions) },
              { label: 'Active Days', value: String(activity.activeDays) },
              {
                label: 'Public Repositories',
                value: `${activity.publicRepos} (${activity.originalRepos} original)`
              },
              { label: 'Total Repository Stars', value: String(activity.totalStars) }
            ].map((stat) => (
              <div key={stat.label} className="github-stat-item">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-[var(--muted)]">{stat.label}</dt>
                <dd className="mt-1.5 text-lg font-semibold text-[var(--fg)] tabular-nums sm:text-xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          <div data-github-matrix className="mt-6">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-mono text-[var(--muted)]">
                53-Week Contribution Matrix · Longest streak: {activity.longestStreak.length} days · Peak day:{' '}
                {activity.bestDay.count} on {activity.bestDay.date}
              </span>
              <span className="font-mono text-[var(--accent)]" aria-live="polite">
                {hoveredDay ? `${hoveredDay.date}: ${hoveredDay.count} contributions` : 'Hover or focus a day cell'}
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
              <div
                className="inline-grid grid-flow-col gap-1"
                role="img"
                aria-label={`GitHub contribution calendar showing ${activity.totalContributions} contributions across ${activity.activeDays} active days`}
              >
                {activity.weeks.map((week, wIdx) => (
                  <div key={wIdx} className="grid grid-rows-7 gap-1">
                    {week.map((day) => (
                      <button
                        key={day.date}
                        type="button"
                        onMouseEnter={() => setHoveredDay(day)}
                        onFocus={() => setHoveredDay(day)}
                        onBlur={() => setHoveredDay(null)}
                        aria-label={`${day.date}: ${day.count} contributions`}
                        className={`h-3 w-3 rounded-[2px] border transition-transform hover:scale-125 ${getCellClass(
                          day.count
                        )}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
            Open-source engagement includes original tooling (DPI_Engine, CodeForensics, DevGuard Pro, SecScan.io),
            ML learning repositories (deep-ml, TensorTonic-Solutions), and public forks such as apidash and
            code-review-graph.
          </p>
        </div>

        {/* Part 3: Verified Facts Ledger (hidden on mobile per user request) */}
        <div ref={milestonesRef} className="hidden sm:block mt-14 border-t border-[var(--line)] pt-10">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">Verified Highlights</p>
              <h3 className="mt-2 text-xl font-semibold text-[var(--fg)]">
                Grounded facts from public repositories
              </h3>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-8 border-t border-[var(--line)] pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {VERIFIED_MILESTONES.map((item) => (
              <article key={item.id} className="milestone-card flex flex-col justify-between">
                <div>
                  <span className="font-mono text-2xl font-semibold text-[var(--accent)] tabular-nums">
                    {item.metric}
                  </span>
                  <h4 className="mt-2 text-sm font-semibold text-[var(--fg)]">{item.label}</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--fg-2)]">{item.detail}</p>
                </div>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-[32px] items-center gap-1 font-mono text-xs text-[var(--muted)] hover:text-[var(--accent)]"
                >
                  <span>{item.sourceLabel}</span>
                  <ArrowUpRight size={12} aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
