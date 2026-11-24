import { Link } from 'react-router-dom';
import { ArrowUpRight, GithubLogo, Globe } from '@phosphor-icons/react';
import { PROJECTS } from '../../content/projects';
import { RoomDrawerShell } from './RoomDrawerShell';

interface ProjectsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectsDrawer({ isOpen, onClose }: ProjectsDrawerProps) {
  return (
    <RoomDrawerShell
      isOpen={isOpen}
      onClose={onClose}
      category="Developer Workstation"
      title="Flagship Software Projects"
      badge="4 Production Repos"
      actionText="View All in Index"
      actionHref="/#projects"
    >
      <p className="text-sm leading-relaxed text-[var(--muted)]">
        The dual-monitor workstation hosts Manas’s active codebases. Here, systems-level packet inspection tooling pairs with TypeScript compiler archaeology and browser security sandboxes.
      </p>

      <div className="space-y-4">
        {PROJECTS.map((p) => (
          <div
            key={p.slug}
            className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--signal)] transition-colors group flex flex-col gap-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-[11px] text-[var(--signal)] uppercase tracking-wider block">
                  {p.disciplineLabel}
                </span>
                <h3 className="serif text-xl font-normal text-[var(--fg)]">
                  {p.name}
                </h3>
              </div>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[var(--surface-subtle)] text-[var(--muted)] border border-[var(--line)] whitespace-nowrap">
                {p.statusLabel}
              </span>
            </div>

            <p className="text-xs leading-relaxed text-[var(--muted)]">
              {p.tagline}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {p.stack.slice(0, 5).map((st) => (
                <span
                  key={st}
                  className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface-elevated)] text-[var(--fg-2)] border border-[var(--line)]"
                >
                  {st}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-[var(--line)] text-xs font-mono">
              <Link
                to={`/projects/${p.slug}`}
                onClick={onClose}
                className="inline-flex items-center gap-1 text-[var(--signal)] hover:underline"
              >
                Case Study <ArrowUpRight size={13} weight="bold" />
              </Link>
              {p.liveUrl && (
                <a
                  href={p.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--muted)] hover:text-[var(--fg)]"
                >
                  <Globe size={13} /> Live App
                </a>
              )}
              {p.repoUrl && (
                <a
                  href={p.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--muted)] hover:text-[var(--fg)]"
                >
                  <GithubLogo size={13} /> GitHub
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </RoomDrawerShell>
  );
}
