import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';
import { CURRENTLY_EXPLORING, SKILL_CATEGORIES, type SkillMaturity } from '../content/skills';

export function SkillsSection() {
  const [maturityFilter, setMaturityFilter] = useState<'all' | SkillMaturity>('all');
  const totalSkills = SKILL_CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="border-b border-[var(--line)] bg-[var(--surface-subtle)]/40 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 border-b border-[var(--line)] pb-8 md:flex-row md:items-end">
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
                  onClick={() => setMaturityFilter(tab.id as 'all' | SkillMaturity)}
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

        {/* Typography-driven legend */}
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-[var(--muted)]">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--status-live-fg)]" aria-hidden="true" />
            <span>Applied in projects</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full border border-dashed border-[var(--accent)]" aria-hidden="true" />
            <span>Currently exploring</span>
          </span>
        </div>

        {/* 7-category typographic ledger without SaaS card boxes */}
        <div className="mt-6 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {SKILL_CATEGORIES.map((category) => {
            const visibleItems =
              maturityFilter === 'all'
                ? category.items
                : category.items.filter((item) => item.maturity === maturityFilter);

            if (visibleItems.length === 0) return null;

            return (
              <div
                key={category.id}
                data-reveal
                className="grid grid-cols-1 gap-5 py-7 lg:grid-cols-12 lg:gap-10"
              >
                <div className="lg:col-span-4">
                  <span className="font-mono text-xs text-[var(--muted)]">{category.index}</span>
                  <h3 className="mt-1 text-lg font-semibold text-[var(--fg)]">{category.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted)]">{category.summary}</p>
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

        {/* Dedicated Currently Exploring band with typographic columns */}
        <div id="exploring" className="mt-14">
          <div className="flex flex-col justify-between gap-2 border-b border-[var(--line)] pb-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">Currently Exploring</p>
              <h3 className="mt-2 text-xl font-semibold text-[var(--fg)]">
                Topics &amp; reading backed by public repositories
              </h3>
            </div>
            <span className="font-mono text-xs text-[var(--muted)]">Verified on GitHub</span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
            {CURRENTLY_EXPLORING.map((topic, idx) => (
              <article key={topic.topic} data-reveal className="flex flex-col justify-between border-b border-[var(--line)] pb-5">
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

