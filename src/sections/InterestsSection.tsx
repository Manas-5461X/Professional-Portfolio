import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';
import { AREAS_OF_INTEREST, type InterestTrack } from '../content/profile';

export function InterestsSection() {
  const [activeId, setActiveId] = useState<InterestTrack['id']>('ai-ml');
  const activeTrack = AREAS_OF_INTEREST.find((t) => t.id === activeId) || AREAS_OF_INTEREST[0];

  return (
    <section id="interests" aria-labelledby="interests-heading" className="hidden sm:block border-b border-[var(--line)] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 border-b border-[var(--line)] pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">Areas of Interest</p>
            <h2 id="interests-heading" className="heading-section display-serif mt-3 max-w-xl text-[var(--fg)]">
              Six connected threads I study and build across.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[var(--fg-2)]">
            Every area below connects directly to repositories on GitHub rather than isolated buzzwords.
          </p>
        </div>

        {/* Desktop interactive editorial index + reading pane */}
        <div data-reveal className="mt-10 hidden grid-cols-12 gap-10 lg:grid">
          <div
            role="tablist"
            aria-label="Engineering focus areas"
            className="col-span-5 divide-y divide-[var(--line)] border-y border-[var(--line)]"
          >
            {AREAS_OF_INTEREST.map((track) => {
              const isSelected = track.id === activeTrack.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveId(track.id)}
                  className={`flex min-h-[56px] w-full items-center justify-between gap-4 px-2 py-3 text-left transition-colors ${
                    isSelected
                      ? 'border-l-2 border-[var(--accent)] pl-4 text-[var(--fg)]'
                      : 'text-[var(--fg-2)] hover:pl-3 hover:text-[var(--fg)]'
                  }`}
                >
                  <span className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-[var(--muted)]">{track.index}</span>
                    <span className={`text-sm ${isSelected ? 'font-semibold text-[var(--accent)]' : 'font-medium'}`}>
                      {track.title}
                    </span>
                  </span>
                  <span className="font-mono text-[11px] text-[var(--muted)]">
                    {isSelected ? 'Reading' : track.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            className="col-span-7 flex flex-col justify-between border-l border-[var(--line)] pl-10"
          >
            <div>
              <p className="font-mono text-xs text-[var(--accent)]">
                {activeTrack.index} / {activeTrack.title}
              </p>

              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--fg)]">{activeTrack.headline}</h3>
              <p className="mt-3 text-base leading-relaxed text-[var(--fg-2)]">{activeTrack.description}</p>

              <div className="mt-6 border-t border-[var(--line)] pt-5">
                <p className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">What I Focus On</p>
                <ul className="mt-3 space-y-2.5">
                  {activeTrack.currentFocus.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-[var(--fg-2)]">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                        aria-hidden="true"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[var(--line)] pt-5">
              <span className="font-mono text-xs text-[var(--muted)]">Related work:</span>
              {activeTrack.projectLinks.map((proj) => (
                <Link
                  key={proj.slug}
                  to={`/projects/${proj.slug}`}
                  className="inline-flex min-h-[36px] items-center gap-1 font-mono text-xs font-medium text-[var(--accent)] hover:underline"
                >
                  <span>{proj.label}</span>
                  <ArrowUpRight size={13} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile / Tablet clean editorial rows */}
        <div className="mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)] lg:hidden">
          {AREAS_OF_INTEREST.map((track) => (
            <article key={track.id} className="py-6">
              <p className="font-mono text-xs text-[var(--accent)]">
                {track.index} / {track.title}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-[var(--fg)]">{track.headline}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--fg-2)]">{track.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {track.projectLinks.map((proj) => (
                  <Link
                    key={proj.slug}
                    to={`/projects/${proj.slug}`}
                    className="inline-flex min-h-[36px] items-center gap-1 font-mono text-xs font-medium text-[var(--accent)] hover:underline"
                  >
                    <span>{proj.label}</span>
                    <ArrowUpRight size={12} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

