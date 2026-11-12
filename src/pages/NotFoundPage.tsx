import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from '@phosphor-icons/react';
import { PROJECTS } from '../content/projects';
import { useMeta } from '../hooks/useMeta';

export function NotFoundPage() {
  useMeta({
    title: '404 Route Not Found | Manas Gandhi',
    description: 'The requested page does not exist in Manas Gandhi portfolio.',
    path: '/404'
  });

  return (
    <section className="workspace-grid-bg flex min-h-[72svh] items-center py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">Error 404 · Unmapped Path</p>
        <h1 className="heading-display mt-3 text-[var(--fg)]">This route is outside the workspace index.</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--fg-2)]">
          The page or project slug you requested could not be found. Return to the main portfolio or jump straight into
          one of the four verified case studies.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="btn-tactile inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-fg)] hover:bg-[var(--accent-hover)]"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Return to Portfolio Home</span>
          </Link>
        </div>

        <div className="mt-10 border-t border-[var(--line)] pt-6">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">Verified Case Studies</p>
          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {PROJECTS.map((project) => (
              <Link
                key={project.slug}
                to={`/projects/${project.slug}`}
                className="flex min-h-[48px] items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--fg)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <span>{project.name}</span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

