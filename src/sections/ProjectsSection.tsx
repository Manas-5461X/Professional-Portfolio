import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, GithubLogo, Globe } from '@phosphor-icons/react';
import { PROJECTS, type ProjectDiscipline, type ProjectRecord } from '../content/projects';
import { ProjectVisual } from '../components/ProjectVisual';
import { gsap, isReducedMotion } from '../lib/smooth';

const FILTER_TABS: { id: 'all' | ProjectDiscipline; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'security', label: 'Security' },
  { id: 'fullstack', label: 'Full-Stack' },
  { id: 'systems', label: 'Networking' }
];

export function ProjectsSection() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | ProjectDiscipline>('all');

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return PROJECTS;
    return PROJECTS.filter((p) => p.discipline === activeFilter);
  }, [activeFilter]);

  // Horizontal pinned camera pan for Flagships on desktop
  useEffect(() => {
    if (isReducedMotion()) return;
    const pinEl = pinRef.current;
    const trackEl = trackRef.current;
    if (!pinEl || !trackEl) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1001px) and (prefers-reduced-motion: no-preference)', () => {
      const getDistance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth + 48);

      const tween = gsap.to(trackEl, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinEl,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true
        }
      });

      gsap.to('.flag-progress i', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: pinEl,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          scrub: true
        }
      });

      return () => {
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  const handleManualPan = (direction: 'next' | 'prev') => {
    if (!trackRef.current) return;
    const scrollAmount = window.innerWidth * 0.72;
    trackRef.current.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section id="projects" aria-labelledby="projects-heading" className="border-b border-[var(--line)]">
      {/* =========================================================================
          Flagship Showcase: Horizontal Pinned Experience on Desktop
          ========================================================================= */}
      <div ref={pinRef} className="flag-pin">
        <div ref={trackRef} className="flag-track">
          {/* Section Introduction Column */}
          <div className="flag-intro">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">
                (02) Selected Projects
              </span>
              <h2 id="projects-heading" className="display-serif mt-3 text-4xl sm:text-5xl lg:text-6xl text-[var(--fg)]">
                The builds I&apos;d <span className="italic text-[var(--accent)]">demo first.</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[var(--fg-2)]">
                Four engineering projects spanning in-browser security analysis, AST repository archaeology,
                multithreaded packet inspection, and automated container audits.
              </p>
            </div>

            <div className="hidden lg:flex flex-col gap-3">
              <span className="font-mono text-xs text-[var(--muted)]">Scroll to pan horizontally →</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleManualPan('prev')}
                  aria-label="Previous project"
                  className="btn-tactile flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--fg)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  <ArrowLeft size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleManualPan('next')}
                  aria-label="Next project"
                  className="btn-tactile flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--fg)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Project Flagship Cards */}
          {filteredProjects.map((project: ProjectRecord) => (
            <article
              key={project.slug}
              className="flag-card group"
              data-cursor="Explore"
              aria-label={`${project.name}: ${project.tagline}`}
            >
              {/* Left Column: Copy & Metadata */}
              <div className="copy">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-[var(--muted)]">
                    <span className="tracking-wider">
                      {project.index} / {project.disciplineLabel.toUpperCase()}
                    </span>
                    <span className="rounded-full bg-[var(--accent-tint)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--accent)]">
                      {project.statusLabel}
                    </span>
                  </div>

                  <h3 className="name mt-3 text-[var(--fg)]">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="ulink hover:text-[var(--accent)] focus-visible:text-[var(--accent)]"
                    >
                      {project.name}
                    </Link>
                  </h3>

                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-[var(--fg-2)] max-w-lg">
                    {project.tagline}
                  </p>

                  {/* Verified highlights metrics */}
                  <div className="metrics mt-5 border-y border-[var(--line)] py-3">
                    {project.verifiedHighlights.map((m) => (
                      <div key={m.label} className="flex flex-col">
                        <b className="text-[var(--fg)]">{m.value}</b>
                        <span className="font-mono text-[11px] text-[var(--muted)]">{m.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack pills */}
                  <ul aria-label={`${project.name} technologies`} className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 5).map((tech) => (
                      <li
                        key={tech}
                        className="rounded border border-[var(--line)] bg-[var(--surface-subtle)] px-2.5 py-0.5 font-mono text-[11px] text-[var(--fg-2)]"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA Actions */}
                <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--line)]">
                  <Link
                    to={`/projects/${project.slug}`}
                    className="pill solid text-xs"
                    style={{ height: '2.5rem', padding: '0 1.1rem' }}
                  >
                    <span className="dot" />
                    <span>View Case Study</span>
                    <span className="arrow">&#8599;</span>
                  </Link>

                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill text-xs"
                    style={{ height: '2.5rem', padding: '0 1rem' }}
                  >
                    <GithubLogo size={14} />
                    <span>GitHub</span>
                    <span className="arrow">&#8599;</span>
                  </a>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pill text-xs"
                      style={{ height: '2.5rem', padding: '0 1rem' }}
                    >
                      <Globe size={14} />
                      <span>Live App</span>
                      <span className="arrow">&#8599;</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Right Column: Visual Preview */}
              <div className="visual">
                <Link
                  to={`/projects/${project.slug}`}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="block w-full max-w-lg no-underline transition-transform duration-500 ease-out group-hover:scale-[1.015]"
                >
                  <ProjectVisual project={project} compact />
                </Link>
              </div>
            </article>
          ))}

          {/* Spacer end cap */}
          <div className="hidden lg:block w-4 shrink-0" aria-hidden="true" />
        </div>

        {/* Horizontal Progress Bar Track */}
        <div className="flag-progress" aria-hidden="true">
          <i />
        </div>
      </div>

      {/* =========================================================================
          Works Index: Rapid Editorial Filterable Project Directory (Image 4 Parity)
          ========================================================================= */}
      <div id="work" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 border-t border-[var(--line)] overflow-x-clip">
        <div className="flex flex-col justify-between gap-6 pb-6 md:flex-row md:items-end">
          <div>
            <span className="mono muted">
              (03) Index
            </span>
            <h2 className="display h-lg mt-3 text-[var(--fg)]">
              Selected work.
            </h2>
          </div>

          {/* Discipline Filters */}
          <div role="group" aria-label="Filter projects by discipline" className="filters">
            {FILTER_TABS.map((tab) => {
              const active = activeFilter === tab.id;
              const count = tab.id === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.discipline === tab.id).length;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  aria-pressed={active}
                  aria-label={tab.id === 'all' ? `All (${PROJECTS.length})` : tab.label}
                  className="chip"
                >
                  <span>{tab.label}</span>
                  <sup>{count}</sup>
                </button>
              );
            })}
          </div>
        </div>

        {/* Index Table List (Image 4 Parity with Bottom-Up Dark Wipe on Hover) */}
        <div role="list" className="mt-6 border-b border-[var(--line)] pb-4">
          {filteredProjects.map((project) => (
            <Link
              key={project.slug}
              to={`/projects/${project.slug}`}
              role="listitem"
              data-cursor="Open"
              className="row group"
            >
              <span className="num mono muted">
                {project.index}
              </span>

              <div>
                <span className="rname">
                  {project.name}
                </span>
                <span className="tag">Flagship</span>
                <span className="mono muted" style={{ display: 'block', marginTop: 4 }}>
                  {project.liveUrl
                    ? project.liveUrl.replace('https://', '').replace(/\/$/, '')
                    : project.repoUrl.replace('https://github.com/', '')}
                </span>
              </div>

              <span className="rblurb">
                {project.summary}
              </span>

              <span className="rstack">
                {project.stack.slice(0, 4).join(' / ')}
              </span>

              <span className="mono rlink" style={{ textAlign: 'right' }}>
                {project.disciplineLabel.toUpperCase()} <span className="arrow">&#8599;</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
