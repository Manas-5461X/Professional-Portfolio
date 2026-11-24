import { Star, GitCommit, CodeBlock, ArrowUpRight } from '@phosphor-icons/react';
import { LEETCODE_BASELINE } from '../../content/leetcode';
import { GITHUB_ACTIVITY } from '../../content/github';
import { RoomDrawerShell } from './RoomDrawerShell';

interface MilestonesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MilestonesDrawer({ isOpen, onClose }: MilestonesDrawerProps) {
  return (
    <RoomDrawerShell
      isOpen={isOpen}
      onClose={onClose}
      category="Milestone Pedestal"
      title="Verified Milestones & Stats"
      badge="Grounded Facts"
      actionText="View Activity Section"
      actionHref="/#activity"
    >
      <p className="text-sm leading-relaxed text-[var(--muted)]">
        Every milestone in this room corresponds to publicly auditable records on GitHub and LeetCode, verified live without fabrication.
      </p>

      {/* LeetCode Card */}
      <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CodeBlock size={20} className="text-[#F59E0B]" />
            <h3 className="serif text-xl font-normal text-[var(--fg)]">
              LeetCode Algorithmic Problem Solving
            </h3>
          </div>
          <span className="font-mono text-xs text-[#F59E0B] font-bold">
            {LEETCODE_BASELINE.totalSolved} Solved
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center font-mono">
          <div className="p-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--line)]">
            <span className="text-[11px] text-[var(--muted)] block">Easy</span>
            <span className="text-base font-bold text-[#10B981]">{LEETCODE_BASELINE.easySolved}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--line)]">
            <span className="text-[11px] text-[var(--muted)] block">Medium</span>
            <span className="text-base font-bold text-[#F59E0B]">{LEETCODE_BASELINE.mediumSolved}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--line)]">
            <span className="text-[11px] text-[var(--muted)] block">Hard</span>
            <span className="text-base font-bold text-[#EF4444]">{LEETCODE_BASELINE.hardSolved}</span>
          </div>
        </div>

        <a
          href={LEETCODE_BASELINE.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--signal)] hover:underline"
        >
          Inspect @{LEETCODE_BASELINE.username} Profile <ArrowUpRight size={13} weight="bold" />
        </a>
      </div>

      {/* GitHub Contributions Card */}
      <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCommit size={20} className="text-[#10B981]" />
            <h3 className="serif text-xl font-normal text-[var(--fg)]">
              GitHub Annual Contributions
            </h3>
          </div>
          <span className="font-mono text-xs text-[#10B981] font-bold">
            {GITHUB_ACTIVITY.totalContributions.toLocaleString()}+ Verified
          </span>
        </div>

        <p className="text-xs text-[var(--muted)] leading-relaxed">
          Recorded {GITHUB_ACTIVITY.totalContributions} public contributions across {GITHUB_ACTIVITY.activeDays} active days in the last 12 months across {GITHUB_ACTIVITY.publicRepos} repositories.
        </p>

        <a
          href="https://github.com/Manas-5461X"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--signal)] hover:underline"
        >
          Inspect GitHub Profile <ArrowUpRight size={13} weight="bold" />
        </a>
      </div>

      {/* DPI Engine Stars Card */}
      <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={20} className="text-[#FBBF24]" weight="fill" />
            <h3 className="serif text-xl font-normal text-[var(--fg)]">
              DPI Engine Community Stars
            </h3>
          </div>
          <span className="font-mono text-xs text-[#FBBF24] font-bold">
            26 Stars
          </span>
        </div>

        <p className="text-xs text-[var(--muted)] leading-relaxed">
          Gained 26 GitHub stars through organic community discovery by network engineers and systems developers.
        </p>

        <a
          href="https://github.com/Manas-5461X/DPI_Engine"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--signal)] hover:underline"
        >
          View DPI Engine on GitHub <ArrowUpRight size={13} weight="bold" />
        </a>
      </div>
    </RoomDrawerShell>
  );
}
