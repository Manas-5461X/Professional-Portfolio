import { Terminal, ShieldCheck, Cpu, ArrowUpRight, GithubLogo } from '@phosphor-icons/react';
import { RoomDrawerShell } from './RoomDrawerShell';

interface SystemsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SystemsDrawer({ isOpen, onClose }: SystemsDrawerProps) {
  return (
    <RoomDrawerShell
      isOpen={isOpen}
      onClose={onClose}
      category="Systems & Security"
      title="DPI Engine & Network Security"
      badge="26★ GitHub Stars"
      actionText="Open DPI Case Study"
      actionHref="/projects/dpi-engine"
    >
      <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu size={18} className="text-[var(--signal)]" />
            <h3 className="serif text-xl font-normal text-[var(--fg)]">
              DPI Engine v2.0
            </h3>
          </div>
          <span className="font-mono text-xs text-[var(--signal)] font-semibold">
            ★ 26 Stars
          </span>
        </div>

        <p className="text-xs leading-relaxed text-[var(--muted)]">
          Built from scratch using Python standard library binary <code>struct</code> unpacking and multiprocessing. Parses raw Ethernet, IPv4, TCP, and UDP headers directly from Wireshark-compatible <code>.pcap</code> captures with zero external libraries.
        </p>

        <div className="p-3 rounded-lg bg-[var(--surface-elevated)] border border-[var(--line)] font-mono text-[11px] space-y-1.5 text-[var(--muted)]">
          <div className="flex justify-between">
            <span>Runtime Overhead:</span>
            <span className="text-[var(--signal)] font-bold">Zero External Libs</span>
          </div>
          <div className="flex justify-between">
            <span>Packet Inspection:</span>
            <span className="text-[var(--fg)]">TLS ClientHello SNI + DNS</span>
          </div>
          <div className="flex justify-between">
            <span>Concurrency:</span>
            <span className="text-[var(--fg)]">Multi-Process Queues</span>
          </div>
          <div className="flex justify-between">
            <span>Traffic Filtering:</span>
            <span className="text-[var(--fg)]">IP, Domain & App Rules</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 text-xs font-mono">
          <a
            href="https://github.com/Manas-5461X/DPI_Engine"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[var(--signal)] hover:underline font-semibold"
          >
            <GithubLogo size={14} /> View DPI Engine Repository <ArrowUpRight size={13} weight="bold" />
          </a>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
        <div className="flex items-center gap-2">
          <Terminal size={18} className="text-[#38BDF8]" />
          <h3 className="serif text-xl font-normal text-[var(--fg)]">
            Systems & OS Internals (Custom Shell)
          </h3>
        </div>
        <p className="text-xs leading-relaxed text-[var(--muted)]">
          Explored operating system primitives by implementing a custom Unix-like command-line shell. Managed process creation via <code>fork()</code> & <code>execvp()</code>, built-in commands (cd, pwd, type, echo), standard I/O redirection, and signal handling.
        </p>
      </div>

      <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-[#10B981]" />
          <h3 className="serif text-xl font-normal text-[var(--fg)]">
            Network Security & Penetration Testing
          </h3>
        </div>
        <ul className="text-xs space-y-2 text-[var(--muted)]">
          <li className="flex items-start gap-2">
            <span className="text-[var(--signal)] font-mono">•</span>
            <span><strong>TLS SNI Analysis:</strong> Extracting hostnames in plaintext from encrypted HTTPS sessions before TLS 1.3 encrypted client hello.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--signal)] font-mono">•</span>
            <span><strong>Endianness Decoding:</strong> Handling native (<code>0xA1B2C3D4</code>) and byte-swapped (<code>0xD4C3B2A1</code>) PCAP global headers.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--signal)] font-mono">•</span>
            <span><strong>Flow Table Hashing:</strong> O(1) connection state tracking with immutable 5-tuple keys.</span>
          </li>
        </ul>
      </div>
    </RoomDrawerShell>
  );
}
