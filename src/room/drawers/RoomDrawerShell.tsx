import { useEffect, useRef, ReactNode } from 'react';
import { X, ArrowRight } from '@phosphor-icons/react';

interface RoomDrawerShellProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  title: string;
  badge: string;
  children: ReactNode;
  actionText?: string;
  actionHref?: string;
}

export function RoomDrawerShell({
  isOpen,
  onClose,
  category,
  title,
  badge,
  children,
  actionText,
  actionHref
}: RoomDrawerShellProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="room-ui-overlay fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={drawerRef}
        className="w-full sm:w-[540px] md:w-[580px] h-full flex flex-col bg-[var(--surface-elevated)] text-[var(--fg)] border-l border-[var(--line-strong)] shadow-2xl transition-transform duration-300 transform translate-x-0"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--line)] bg-[var(--surface)]">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--signal)]">
                {category}
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--signal)]" />
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-[var(--surface-subtle)] text-[var(--muted)] border border-[var(--line)]">
                {badge}
              </span>
            </div>
            <h2 className="serif text-2xl md:text-3xl font-normal tracking-tight text-[var(--fg)]">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            title="Close (Esc)"
            className="btn-tactile p-2 rounded-full border border-[var(--line)] hover:border-[var(--signal)] text-[var(--fg)] transition-colors"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 [scrollbar-width:thin]">
          {children}
        </div>

        {/* Drawer Footer CTA */}
        {actionText && actionHref && (
          <div className="px-6 py-4 border-t border-[var(--line)] bg-[var(--surface)] flex items-center justify-between">
            <span className="font-mono text-xs text-[var(--muted)]">
              Deep-dive in portfolio
            </span>
            <a
              href={actionHref}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--signal)] text-[var(--accent-fg)] font-mono text-xs font-semibold hover:opacity-95 transition-opacity"
            >
              {actionText} <ArrowRight size={14} weight="bold" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
