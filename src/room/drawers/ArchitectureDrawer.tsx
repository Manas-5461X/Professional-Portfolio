import { TreeStructure, CodeBlock, ShieldCheck } from '@phosphor-icons/react';
import { RoomDrawerShell } from './RoomDrawerShell';

interface ArchitectureDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ArchitectureDrawer({ isOpen, onClose }: ArchitectureDrawerProps) {
  return (
    <RoomDrawerShell
      isOpen={isOpen}
      onClose={onClose}
      category="Whiteboard"
      title="DSA & Packet Analysis"
      badge="Algorithms & Security"
      actionText="Open DPI Case Study"
      actionHref="/projects/dpi-engine"
    >
      <p className="text-sm leading-relaxed text-[var(--muted)]">
        The left-wall whiteboard tracks Manas’s active problem-solving notes, binary packet inspection pipelines, and static security heuristics.
      </p>

      {/* LeetCode DSA Patterns */}
      <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
        <div className="flex items-center gap-2">
          <CodeBlock size={20} className="text-[#10B981]" />
          <h3 className="serif text-xl font-normal text-[var(--fg)]">
            Algorithmic Problem Solving (157 Solved)
          </h3>
        </div>
        <p className="text-xs leading-relaxed text-[var(--muted)]">
          Core algorithmic paradigms mastered across LeetCode:
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--line)]">
            <span className="text-[#10B981] font-bold block">Arrays & Hashing</span>
            <span className="text-[11px] text-[var(--muted)]">Two Pointers, Prefix Sums, Frequency Hash Maps (O(N) Time).</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--line)]">
            <span className="text-[#38BDF8] font-bold block">Trees & Graphs</span>
            <span className="text-[11px] text-[var(--muted)]">BFS Level-Order, DFS Recursion, Connected Components.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--line)]">
            <span className="text-[#F59E0B] font-bold block">Binary Search</span>
            <span className="text-[11px] text-[var(--muted)]">Rotated sorted arrays, boundary condition convergence.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--line)]">
            <span className="text-[#A855F7] font-bold block">Dynamic Prog</span>
            <span className="text-[11px] text-[var(--muted)]">1D/2D memoization, recurrence relations, greedy paradigms.</span>
          </div>
        </div>
      </div>

      {/* Packet Inspection Pipeline */}
      <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
        <div className="flex items-center gap-2">
          <TreeStructure size={20} className="text-[#38BDF8]" />
          <h3 className="serif text-xl font-normal text-[var(--fg)]">
            Packet Inspection Pipeline (DPI Engine)
          </h3>
        </div>
        <p className="text-xs leading-relaxed text-[var(--muted)]">
          Decodes wire frames into structured network connections:
        </p>
        <ul className="text-xs space-y-1.5 text-[var(--muted)] font-mono">
          <li>1. <code>pcap_reader.py</code>: Endianness check & 16-byte record streaming</li>
          <li>2. <code>packet_parser.py</code>: Ethernet (14B) & IPv4 IHL variable header slicing</li>
          <li>3. <code>sni_extractor.py</code>: TLS 0x16 Handshake & 0x0000 SNI extension parser</li>
          <li>4. <code>dpi_mt.py</code>: Multi-process worker distribution & rule classification</li>
        </ul>
      </div>

      {/* Security Analysis */}
      <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-[var(--signal)]" />
          <h3 className="serif text-xl font-normal text-[var(--fg)]">
            Code Security & Static Vulnerability Analysis
          </h3>
        </div>
        <p className="text-xs leading-relaxed text-[var(--muted)]">
          Practical security tooling built into DevGuard Pro and SecScan.io: comment-aware regex scanner with 34 vulnerability rules, hardcoded API secret detection, and direct OSV.dev CVE advisory lookup.
        </p>
      </div>
    </RoomDrawerShell>
  );
}
