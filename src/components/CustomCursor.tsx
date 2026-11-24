import { useEffect, useRef } from 'react';
import { isReducedMotion, isCoarsePointer } from '../lib/smooth';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || isReducedMotion() || isCoarsePointer()) {
      return;
    }

    const cursorEl = cursorRef.current;
    const innerEl = innerRef.current;
    const textEl = textRef.current;
    if (!cursorEl || !innerEl) return;

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let rafId = 0;
    let isVisible = false;
    let isInput = false;
    let isHovered = false;
    let cursorText = '';

    const updateVisibility = () => {
      cursorEl.style.opacity = isVisible && !isInput ? '1' : '0';
    };

    const updateShape = () => {
      if (cursorText) {
        innerEl.className = 'flex items-center justify-center rounded-full bg-white transition-all duration-200 ease-out h-20 w-20 shadow-2xl scale-100';
        if (textEl) {
          textEl.textContent = cursorText;
          textEl.style.display = 'block';
        }
      } else if (isHovered) {
        innerEl.className = 'flex items-center justify-center rounded-full bg-white transition-all duration-200 ease-out h-8 w-8 scale-100';
        if (textEl) textEl.style.display = 'none';
      } else {
        innerEl.className = 'flex items-center justify-center rounded-full bg-white transition-all duration-200 ease-out h-3.5 w-3.5 scale-100';
        if (textEl) textEl.style.display = 'none';
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        updateVisibility();
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const nextInput = Boolean(
        target.closest('input, textarea, select, .monaco-editor, [contenteditable="true"]')
      );
      if (nextInput !== isInput) {
        isInput = nextInput;
        updateVisibility();
      }

      const interactive = Boolean(
        target.closest('a, button, [role="button"], summary, [data-cursor], .pill, .chip, .row, .li-card')
      );
      if (interactive !== isHovered) {
        isHovered = interactive;
        updateShape();
      }

      const cursorTarget = target.closest<HTMLElement>('[data-cursor]');
      const nextText = cursorTarget?.dataset.cursor || '';
      if (nextText !== cursorText) {
        cursorText = nextText;
        updateShape();
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      updateVisibility();
    };

    const onMouseEnter = () => {
      isVisible = true;
      updateVisibility();
    };

    const animate = () => {
      const ease = 0.28;
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
  }, []);

  if (typeof window !== 'undefined' && (isReducedMotion() || isCoarsePointer())) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      data-html2canvas-ignore=""
      aria-hidden="true"
      className="custom-cursor pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-200 opacity-0"
      style={{
        willChange: 'transform',
        mixBlendMode: 'difference'
      }}
    >
      <div
        ref={innerRef}
        className="flex items-center justify-center rounded-full bg-white transition-all duration-200 ease-out h-3.5 w-3.5 scale-100"
      >
        <span
          ref={textRef}
          style={{ display: 'none' }}
          className="font-mono text-[10px] font-bold uppercase tracking-wider text-black select-none text-center px-2"
        />
      </div>
    </div>
  );
}
