import { useEffect, useRef, useState } from 'react';
import { isReducedMotion, isCoarsePointer } from '../lib/smooth';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [cursorText, setCursorText] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined' || isReducedMotion() || isCoarsePointer()) {
      return;
    }

    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest<HTMLElement>('[data-cursor]');
      if (cursorTarget && cursorTarget.dataset.cursor) {
        setCursorText(cursorTarget.dataset.cursor);
      } else {
        setCursorText('');
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    const animate = () => {
      const ease = 0.22;
      currentX += (mouseX - currentX) * ease;
      currentY += (mouseY - currentY) * ease;

      cursorEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (typeof window !== 'undefined' && (isReducedMotion() || isCoarsePointer())) {
    return null;
  }

  const isBadge = Boolean(cursorText);

  return (
    <div
      ref={cursorRef}
      data-html2canvas-ignore=""
      aria-hidden="true"
      className={`custom-cursor pointer-events-none fixed left-0 top-0 z-[9990] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ willChange: 'transform' }}
    >
      <div
        className={`flex items-center justify-center rounded-full transition-all duration-300 ease-out ${
          isBadge
            ? 'h-[88px] w-[88px] bg-[var(--accent)] shadow-2xl scale-100'
            : 'h-2.5 w-2.5 bg-[var(--accent)] scale-100'
        }`}
      >
        {isBadge && (
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0b0b0a] select-none text-center px-1">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}

