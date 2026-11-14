import { useEffect, useRef, useState } from 'react';
import { isReducedMotion, isCoarsePointer } from '../lib/smooth';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [cursorText, setCursorText] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isInput, setIsInput] = useState<boolean>(false);

  const isInputRef = useRef(false);
  const isHoveredRef = useRef(false);
  const cursorTextRef = useRef('');

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

      const isInputField = Boolean(
        target.closest('input, textarea, select, .monaco-editor, [contenteditable="true"]')
      );
      if (isInputField !== isInputRef.current) {
        isInputRef.current = isInputField;
        setIsInput(isInputField);
      }

      const interactive = Boolean(
        target.closest('a, button, [role="button"], summary, [data-cursor], .pill, .chip, .row, .li-card')
      );
      if (interactive !== isHoveredRef.current) {
        isHoveredRef.current = interactive;
        setIsHovered(interactive);
      }

      const cursorTarget = target.closest<HTMLElement>('[data-cursor]');
      const nextText = cursorTarget?.dataset.cursor || '';
      if (nextText !== cursorTextRef.current) {
        cursorTextRef.current = nextText;
        setCursorText(nextText);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
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
      className={`custom-cursor pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-200 ${
        isVisible && !isInput ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        willChange: 'transform',
        mixBlendMode: 'difference'
      }}
    >
      <div
        className={`flex items-center justify-center rounded-full bg-white transition-all duration-200 ease-out ${
          isBadge
            ? 'h-20 w-20 shadow-2xl scale-100'
            : isHovered
              ? 'h-8 w-8 scale-100'
              : 'h-3.5 w-3.5 scale-100'
        }`}
      >
        {isBadge && (
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-black select-none text-center px-2">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}
