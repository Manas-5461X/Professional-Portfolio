import { useEffect, useRef, useState } from 'react';
import { isReducedMotion, isCoarsePointer } from '../lib/smooth';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [cursorText, setCursorText] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined' || isReducedMotion() || isCoarsePointer()) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let dotX = -100;
    let dotY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;
    let isHovered = false;
    let isInput = false;
    let currentBadgeText = '';
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        dotX = mouseX;
        dotY = mouseY;
        ringX = mouseX;
        ringY = mouseY;
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const nextInput = Boolean(
        target.closest('input, textarea, select, .monaco-editor, [contenteditable="true"]')
      );
      if (nextInput !== isInput) {
        isInput = nextInput;
        dot.style.opacity = isInput ? '0' : '1';
        ring.style.opacity = isInput ? '0' : '1';
      }

      const nextHovered = Boolean(
        target.closest('a, button, [role="button"], summary, [data-cursor], .pill, .chip, .row, .li-card, input[type="range"]')
      );
      if (nextHovered !== isHovered) {
        isHovered = nextHovered;
        if (isHovered) {
          ring.classList.add('cursor-ring--hovered');
        } else {
          ring.classList.remove('cursor-ring--hovered');
        }
      }

      const cursorTarget = target.closest<HTMLElement>('[data-cursor]');
      const nextText = cursorTarget?.dataset.cursor || '';
      if (nextText !== currentBadgeText) {
        currentBadgeText = nextText;
        setCursorText(nextText);
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const onMouseEnter = () => {
      isVisible = true;
      if (!isInput) {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
    };

    const animate = () => {
      // Dot moves with very high responsiveness (0.85 ease) so there is 0 perceived cursor lag
      dotX += (mouseX - dotX) * 0.85;
      dotY += (mouseY - dotY) * 0.85;
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;

      // Ring smoothly follows with organic spring easing (0.42 ease)
      ringX += (mouseX - ringX) * 0.42;
      ringY += (mouseY - ringY) * 0.42;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

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
  }, []);

  if (typeof window !== 'undefined' && (isReducedMotion() || isCoarsePointer())) {
    return null;
  }

  const isBadge = Boolean(cursorText);

  return (
    <>
      {/* Precision Instant Center Dot */}
      <div
        ref={dotRef}
        data-html2canvas-ignore=""
        aria-hidden="true"
        className="custom-cursor pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-150"
        style={{ willChange: 'transform' }}
      >
        <div className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
      </div>

      {/* Fluid Trailing Magnetic Ring & Badge */}
      <div
        ref={ringRef}
        data-html2canvas-ignore=""
        aria-hidden="true"
        className="custom-cursor pointer-events-none fixed left-0 top-0 z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-150"
        style={{ willChange: 'transform' }}
      >
        <div
          className={`flex items-center justify-center rounded-full border border-white/60 bg-white/10 backdrop-blur-[1px] transition-all duration-200 ease-out shadow-[0_0_12px_rgba(255,255,255,0.15)] ${
            isBadge
              ? 'h-20 w-20 bg-white text-black !border-white shadow-2xl scale-100'
              : 'h-8 w-8 scale-75 [&.cursor-ring--hovered]:scale-125 [&.cursor-ring--hovered]:border-[var(--accent)] [&.cursor-ring--hovered]:bg-[var(--accent)]/15'
          }`}
        >
          {isBadge && (
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-black select-none text-center px-2">
              {cursorText}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
