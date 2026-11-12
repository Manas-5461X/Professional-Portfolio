import { useEffect, useRef, useState } from 'react';
import { isReducedMotion } from '../lib/smooth';

interface StatementRevealProps {
  text: string;
  className?: string;
}

/**
 * Editorial scroll-activated statement reveal.
 * Words light up sequentially as the block crosses the viewport center,
 * and remain immediately opaque under reduced-motion or without JS.
 */
export function StatementReveal({ text, className = '' }: StatementRevealProps) {
  const containerRef = useRef<HTMLParagraphElement | null>(null);
  const words = text.split(' ');
  const [activeCount, setActiveCount] = useState<number>(() =>
    typeof window !== 'undefined' && isReducedMotion() ? words.length : 0
  );

  useEffect(() => {
    if (isReducedMotion()) {
      setActiveCount(words.length);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    let rafId = 0;

    const updateProgress = () => {
      rafId = 0;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight || 800;
      // Progress from 0 when top enters bottom 85% to 1 when top hits upper 38%
      const start = viewportH * 0.85;
      const end = viewportH * 0.36;
      const raw = (start - rect.top) / (start - end);
      const clamped = Math.max(0, Math.min(1, raw));
      const nextCount = Math.round(clamped * words.length);
      setActiveCount((prev) => (nextCount > prev ? nextCount : prev));
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateProgress);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          updateProgress();
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    observer.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [words.length]);

  return (
    <p ref={containerRef} className={className} aria-label={text}>
      {words.map((word, idx) => (
        <span key={idx}>
          <span className="statement-word" data-active={idx < activeCount ? 'true' : 'false'}>
            {word}
          </span>
          {idx < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  );
}

