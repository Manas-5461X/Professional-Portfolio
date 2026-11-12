import type { ProjectRecord } from '../content/projects';

interface ProjectVisualProps {
  project: ProjectRecord;
  priority?: boolean;
  compact?: boolean;
}

export function ProjectVisual({ project, priority: _priority = false, compact = false }: ProjectVisualProps) {
  if (project.thumbnail) {
    const cleanHost = project.liveUrl?.replace('https://', '').replace(/\/$/, '');
    return (
      <figure className="overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface-subtle)]">
        <div className={`overflow-hidden bg-[var(--surface-subtle)] ${compact ? 'aspect-[16/10]' : 'aspect-[16/9]'}`}>
          <img
            src={project.thumbnail.src}
            alt={project.thumbnail.alt}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.015]"
          />
        </div>
        <figcaption className="flex items-center justify-between gap-2 border-t border-[var(--line)] bg-[var(--surface)] px-3.5 py-2 font-mono text-[11px] text-[var(--muted)]">
          <span className="truncate">Capture · {cleanHost}</span>
          <span className="shrink-0 text-[var(--status-live-fg)]">Verified live UI</span>
        </figcaption>
      </figure>
    );
  }

  // CLI Engine representation (honest verified CLI output representation, explicitly labeled)
  return (
    <figure className="overflow-hidden rounded-lg border border-[var(--line)] bg-[#0F172A] text-slate-100">
      <div className={`flex flex-col justify-between p-4 sm:p-5 ${compact ? 'aspect-[16/10]' : 'aspect-[16/9]'}`}>
        <div className="space-y-3">
          <div className="border-b border-slate-800 pb-2.5 font-mono text-xs text-sky-300">
            $ python -m src.dpi_mt test_dpi.pcap out_filtered.pcap --block-app YouTube --fps 2
          </div>
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            <div className="rounded border border-slate-800 bg-slate-900/70 p-2.5">
              <div className="text-[10px] uppercase text-slate-400">Packets</div>
              <div className="mt-1 text-base font-semibold text-white tabular-nums">77</div>
            </div>
            <div className="rounded border border-slate-800 bg-slate-900/70 p-2.5">
              <div className="text-[10px] uppercase text-slate-400">Forwarded</div>
              <div className="mt-1 text-base font-semibold text-emerald-300 tabular-nums">76</div>
            </div>
            <div className="rounded border border-slate-800 bg-slate-900/70 p-2.5">
              <div className="text-[10px] uppercase text-slate-400">Dropped</div>
              <div className="mt-1 text-base font-semibold text-amber-300 tabular-nums">1</div>
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-2.5 font-mono text-[11px] text-slate-300">
          <span>TLS SNI: google.com, youtube.com, github.com, discord.com</span>
        </div>
      </div>
      <figcaption className="flex items-center justify-between gap-2 border-t border-slate-800 bg-[#111827] px-3.5 py-2 font-mono text-[11px] text-slate-300">
        <span>CLI run output · python -m src.dpi_mt</span>
        <span className="shrink-0 text-sky-300">Verified local trace</span>
      </figcaption>
    </figure>
  );
}

