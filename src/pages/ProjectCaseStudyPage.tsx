import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { PROJECTS, PROJECT_BY_SLUG, type ProjectRecord } from '../content/projects';
import { useMeta } from '../hooks/useMeta';
import { useScrollReveals } from '../lib/motion';
import { scrollToTopImmediate, ScrollTrigger } from '../lib/smooth';
import { InteractiveProjectLab } from '../components/InteractiveProjectLab';
import { FieldBackground } from '../components/FieldBackground';
import { NotFoundPage } from './NotFoundPage';

export function ProjectCaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const project: ProjectRecord | undefined =
    slug && slug in PROJECT_BY_SLUG ? PROJECT_BY_SLUG[slug as ProjectRecord['slug']] : undefined;

  useMeta({
    title: project
      ? `${project.name} Case Study | Manas Gandhi`
      : 'Project Not Found | Manas Gandhi',
    description: project
      ? project.summary
      : 'The requested project case study could not be located.',
    path: project ? `/projects/${project.slug}` : '/404'
  });

  useScrollReveals(containerRef);

  const [activeShotIndex, setActiveShotIndex] = useState(0);

  useEffect(() => {
    setActiveShotIndex(0);
    scrollToTopImmediate();
    ScrollTrigger.refresh();
  }, [slug]);

  if (!project) {
    return <NotFoundPage />;
  }

  const currentIndex = PROJECTS.findIndex((p) => p.slug === project.slug);
  const prevProject = PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length];
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  return (
    <div ref={containerRef} className="pb-16">
      {/* Product Hero (Image 2 Parity) */}
      <section className="p-hero border-b border-[var(--line)]" aria-labelledby="p-title">
        <FieldBackground />

        <div className="p-hero-top mono z-10">
          <Link
            to="/#work"
            className="ulink inline-flex items-center gap-2 text-xs text-[var(--muted)] hover:text-[var(--accent)]"
          >
            <ArrowLeft size={13} aria-hidden="true" />
            <span>Flagship {project.index} / 04</span>
          </Link>
          <span className="muted">{project.disciplineLabel.toUpperCase()}</span>
        </div>

        <div className="p-hero-content z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end mt-auto">
          {/* Main Title, Tagline, Description and Single-Line Buttons */}
          <div className="lg:col-span-8 flex flex-col justify-end">
            <h1 id="p-title" className="display p-title text-[var(--fg)]">
              <span data-hero-line><span>{project.name}</span></span>
            </h1>

            <p className="display h-sm italic text-[var(--fg-2)] mt-2 max-w-3xl">
              {project.tagline}
            </p>

            <p className="body text-sm sm:text-base leading-relaxed text-[var(--fg-2)]/90 max-w-2xl mt-3">
              {project.summary}
            </p>

            {/* Single-line action buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-5">
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pill solid text-xs sm:text-sm"
              >
                <span className="dot" /> View on GitHub <span className="arrow">&#8599;</span>
              </a>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill text-xs sm:text-sm"
                >
                  Live App <span className="arrow">&#8599;</span>
                </a>
              )}

              <Link to="/#work" className="pill text-xs sm:text-sm">
                All my work <span className="arrow">&#8599;</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Compact Side Specifications */}
          <div className="lg:col-span-4 w-full">
            <div className="p-side-metrics w-full rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)]/75 p-4 backdrop-blur-md">
              <span className="mono text-[10px] uppercase tracking-wider text-[var(--accent)] block mb-2 font-semibold">
                Architecture & Scope
              </span>
              <div className="space-y-2">
                {project.verifiedHighlights.map((m) => (
                  <div
                    key={m.label}
                    className="flex items-baseline justify-between gap-3 border-t border-[var(--line)]/50 pt-2 first:border-t-0 first:pt-0"
                  >
                    <span className="mono text-[11px] text-[var(--muted)]">{m.label}</span>
                    <span className="text-xs sm:text-sm font-semibold text-[var(--fg)] text-right">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role & Tech Stack Monospace Strip */}
      <div className="border-b border-[var(--line)] bg-[var(--surface-subtle)]/40 py-5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 font-mono text-xs text-[var(--muted)]">
            <span className="uppercase text-[var(--accent)] font-semibold">Role</span>
            <span aria-hidden="true">/</span>
            <span>{project.contribution.split('.')[0]}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[var(--fg-2)]">
            {project.stack.map((s) => (
              <span key={s} className="rounded border border-[var(--line)] bg-[var(--surface)] px-2.5 py-0.5">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl space-y-14 px-4 sm:px-6 lg:px-8">
        {/* Core Showcase: Side Media + Overview, Problem, Motivation & What I Built */}
        <section aria-labelledby="overview-heading" className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Compact Media Card (Screenshot / CLI Output) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
            {project.screenshots.length > 0 && (
              <figure className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)] shadow-sm">
                <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-subtle)] px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
                      Application Preview
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[var(--muted)]">Live Deployment</span>
                </div>

                <div className="aspect-[16/10] overflow-hidden bg-[var(--surface-subtle)]">
                  <img
                    src={project.screenshots[activeShotIndex]?.src || project.screenshots[0].src}
                    alt={project.screenshots[activeShotIndex]?.alt || project.screenshots[0].alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-opacity duration-200"
                  />
                </div>

                {project.screenshots.length > 1 && (
                  <div className="flex items-center gap-1.5 border-t border-[var(--line)] bg-[var(--surface-subtle)]/60 p-2">
                    {project.screenshots.map((shot, idx) => (
                      <button
                        key={shot.src}
                        type="button"
                        onClick={() => setActiveShotIndex(idx)}
                        className={`flex-1 rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors ${
                          activeShotIndex === idx
                            ? 'bg-[var(--accent)] text-white font-semibold'
                            : 'text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--line)]/50'
                        }`}
                      >
                        View {idx + 1}
                      </button>
                    ))}
                  </div>
                )}

                <figcaption className="border-t border-[var(--line)] px-4 py-3 text-xs leading-relaxed text-[var(--fg-2)]">
                  {project.screenshots[activeShotIndex]?.caption || project.screenshots[0].caption}
                </figcaption>
              </figure>
            )}

            {project.cliOutputPreview && (
              <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-[#0F172A] text-slate-100 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800 bg-[#111827] px-4 py-2.5">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-sky-400">
                    CLI Output
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">{project.cliOutputPreview.note}</span>
                </div>
                <div className="border-b border-slate-800/80 bg-slate-900/60 px-4 py-2 font-mono text-xs text-sky-300">
                  $ {project.cliOutputPreview.command}
                </div>
                <pre className="max-h-72 overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-200">
                  <code>{project.cliOutputPreview.output}</code>
                </pre>
              </div>
            )}

            {/* Quick Links Card */}
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--muted)] block mb-3 font-semibold">
                Project Resources
              </span>
              <div className="flex flex-wrap gap-2">
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill text-xs h-9 px-3.5 inline-flex items-center gap-1.5"
                >
                  <span className="dot" /> GitHub Repo <span className="arrow">&#8599;</span>
                </a>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill solid text-xs h-9 px-3.5 inline-flex items-center gap-1.5"
                  >
                    Open Live Deployment <span className="arrow">&#8599;</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Overview, Problem, Motivation & What I Built */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6">
              <h2 id="overview-heading" className="text-lg font-semibold text-[var(--fg)]">
                Overview
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-[var(--fg-2)] sm:text-base">
                {project.overview}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
                <h3 className="text-sm font-semibold text-[var(--fg)]">Problem Addressed</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--fg-2)]">{project.problem}</p>
              </div>
              <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
                <h3 className="text-sm font-semibold text-[var(--fg)]">Motivation</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--fg-2)]">{project.motivation}</p>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6">
              <h2 className="text-lg font-semibold text-[var(--fg)]">What I Built &amp; My Contribution</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--fg-2)]">{project.contribution}</p>
              <ul className="mt-4 space-y-2.5 border-t border-[var(--line)] pt-4">
                {project.whatIBuilt.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--fg-2)]">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Architecture Workflow */}
        <section aria-labelledby="arch-heading" data-reveal>
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">System Workflow</p>
          <h2 id="arch-heading" className="mt-2 text-2xl font-semibold text-[var(--fg)]">
            Architecture Pipeline
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {project.architecture.map((stage) => (
              <div
                key={stage.step}
                className="flex flex-col justify-between rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5"
              >
                <div>
                  <span className="font-mono text-xs font-semibold text-[var(--accent)]">Stage {stage.step}</span>
                  <h3 className="mt-2 text-base font-semibold text-[var(--fg)]">{stage.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--fg-2)]">{stage.detail}</p>
                </div>
                <p className="mt-4 border-t border-[var(--line)] pt-2.5 font-mono text-[11px] text-[var(--muted)]">
                  {stage.artifact}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Walkthrough */}
        <InteractiveProjectLab slug={project.slug} />

        {/* Honest Implementation Status Matrix */}
        <section aria-labelledby="status-heading" data-reveal>
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">Honest Capability Audit</p>
          <h2 id="status-heading" className="mt-2 text-2xl font-semibold text-[var(--fg)]">
            Implemented vs. Partial vs. Planned Roadmap
          </h2>
          <p className="mt-1.5 text-sm text-[var(--fg-2)]">
            Explicit verification against repository source files so planned ideas are never presented as shipped work.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="rounded-xl border border-[var(--status-live-border)] bg-[var(--surface)] p-5">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--status-live-fg)]">
                Implemented in Repo
              </h3>
              <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-[var(--fg-2)]">
                {project.featureStatus.implemented.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--status-live-fg)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-[var(--status-warn-border)] bg-[var(--surface)] p-5">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--status-warn-fg)]">
                Partial / Fallback Behavior
              </h3>
              <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-[var(--fg-2)]">
                {project.featureStatus.partialOrFallback.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--status-warn-fg)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Planned / Future Roadmap
              </h3>
              <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-[var(--fg-2)]">
                {project.featureStatus.plannedRoadmap.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--muted)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Engineering Decisions & Challenges */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2" data-reveal>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6">
            <h2 className="text-lg font-semibold text-[var(--fg)]">Key Engineering Decisions</h2>
            <ul className="mt-4 space-y-3">
              {project.engineeringDecisions.map((dec) => (
                <li key={dec} className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--fg-2)]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                  <span>{dec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6">
            <h2 className="text-lg font-semibold text-[var(--fg)]">Challenges &amp; Solutions</h2>
            <div className="mt-4 space-y-4">
              {project.challenges.map((c) => (
                <div key={c.challenge} className="rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4 text-sm">
                  <p className="font-medium text-[var(--fg)]">Challenge: {c.challenge}</p>
                  <p className="mt-1.5 text-[var(--fg-2)]">Solution: {c.solution}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Future Improvements */}
        <section className="rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)]/50 p-6" data-reveal>
          <h2 className="text-base font-semibold text-[var(--fg)]">Next Engineering Priorities</h2>
          <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {project.futureImprovements.map((nextItem) => (
              <li
                key={nextItem}
                className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3.5 text-xs leading-relaxed text-[var(--fg-2)]"
              >
                {nextItem}
              </li>
            ))}
          </ul>
        </section>

        {/* Next Flagship Editorial Handoff (PRABHUSIDDARTH Parity) */}
        <div className="border-t border-[var(--line)] pt-14">
          <Link
            to={`/projects/${nextProject.slug}`}
            className="group block"
            data-cursor="Next"
          >
            <span className="mono muted">Next Flagship / {nextProject.index}</span>
            <div className="display h-lg mt-2 text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
              {nextProject.name} <span className="arrow italic">&rarr;</span>
            </div>
            <p className="lede mt-3">{nextProject.tagline}</p>
          </Link>
        </div>

        {/* Case Study Handoff Navigation */}
        <nav
          aria-label="Case study pagination"
          className="grid grid-cols-1 gap-4 border-t border-[var(--line)] pt-8 sm:grid-cols-2"
        >
          <Link
            to={`/projects/${prevProject.slug}`}
            className="btn-tactile flex min-h-[72px] flex-col justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 hover:border-[var(--accent)]"
          >
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--muted)]">
              <ArrowLeft size={13} aria-hidden="true" />
              <span>Previous Case Study</span>
            </span>
            <span className="mt-1 text-base font-semibold text-[var(--fg)]">{prevProject.name}</span>
          </Link>

          <Link
            to={`/projects/${nextProject.slug}`}
            className="btn-tactile flex min-h-[72px] flex-col items-end justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 text-right hover:border-[var(--accent)]"
          >
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--muted)]">
              <span>Next Case Study</span>
              <ArrowRight size={13} aria-hidden="true" />
            </span>
            <span className="mt-1 text-base font-semibold text-[var(--fg)]">{nextProject.name}</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

