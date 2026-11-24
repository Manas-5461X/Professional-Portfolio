import { TreeStructure, FileCode, CheckCircle } from '@phosphor-icons/react';
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
      title="Architecture & AST Archaeology"
      badge="CodeForensics Monorepo"
      actionText="Open CodeForensics Study"
      actionHref="/projects/codeforensics"
    >
      <p className="text-sm leading-relaxed text-[var(--muted)]">
        The left-wall architectural whiteboard documents the design principles behind Manas’s platforms: deterministic AST parsing, evidence-calibrated intelligence, and zero-dependency systems pipelines.
      </p>

      <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
        <div className="flex items-center gap-2">
          <TreeStructure size={18} className="text-[#A855F7]" />
          <h3 className="serif text-xl font-normal text-[var(--fg)]">
            In-Memory TypeScript Compiler API
          </h3>
        </div>
        <p className="text-xs leading-relaxed text-[var(--muted)]">
          Rather than executing untrusted npm packages or relying on LLMs to guess historical architecture, <code>ArchaeologyEngine</code> parses source code into in-memory Abstract Syntax Trees via <code>ts.createSourceFile</code>, protected by strict path traversal sanitization and a 1 MB file cap.
        </p>
      </div>

      <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle size={18} className="text-[#10B981]" />
          <h3 className="serif text-xl font-normal text-[var(--fg)]">
            4-Tier Evidentiary Hierarchy
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--line)]">
            <span className="text-[#10B981] font-bold block">FACT</span>
            <span className="text-[11px] text-[var(--muted)]">Verifiable git commit SHA, PR number, or 1-indexed AST span.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--line)]">
            <span className="text-[#38BDF8] font-bold block">INFERENCE</span>
            <span className="text-[11px] text-[var(--muted)]">Historical commit precedent or co-change temporal clustering.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--line)]">
            <span className="text-[#F59E0B] font-bold block">HYPOTHESIS</span>
            <span className="text-[11px] text-[var(--muted)]">Heuristic correlation requiring developer validation.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--line)]">
            <span className="text-[#EF4444] font-bold block">UNKNOWN</span>
            <span className="text-[11px] text-[var(--muted)]">Honest abstention when metadata or commits are uningested.</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
        <div className="flex items-center gap-2">
          <FileCode size={18} className="text-[var(--signal)]" />
          <h3 className="serif text-xl font-normal text-[var(--fg)]">
            4-Workspace Monorepo Architecture
          </h3>
        </div>
        <p className="text-xs leading-relaxed text-[var(--muted)]">
          Decoupled Fastify 5 REST API gateway, BullMQ background worker queue, Prisma PostgreSQL persistence, and React 18 + Vite 6 interactive workbench verified by 25 Vitest unit and integration test suites.
        </p>
      </div>
    </RoomDrawerShell>
  );
}
