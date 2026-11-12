import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { isReducedMotion, startScroll, stopScroll } from '../lib/smooth';
import { PROFILE } from '../content/profile';

function shouldShowPreloader(): boolean {
  if (typeof window === 'undefined') return false;
  if (isReducedMotion()) return false;
  try {
    if (sessionStorage.getItem('mg_preloader_seen') === '1') {
      return false;
    }
  } catch {
    // Ignore storage restrictions
  }
  return true;
}

/**
 * Editorial Monogram Vector Preloader.
 * Draws initials M & G with animated vector strokes, pops an orange signal beacon,
 * and sweeps away via a vertical clip-path curtain reveal in < 0.8s.
 */
export function MonogramPreloader() {
  const [active, setActive] = useState(() => shouldShowPreloader());
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const dotRef = useRef<SVGCircleElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) {
      document.documentElement.dataset.preloader = 'done';
      return;
    }

    document.documentElement.dataset.preloader = 'active';
    stopScroll();

    const root = rootRef.current;
    if (!root) return;

    // Initialize stroke-dash properties for drawing animation
    pathRefs.current.forEach((path) => {
      if (path) {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
      }
    });

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        try {
          sessionStorage.setItem('mg_preloader_seen', '1');
        } catch {}
        startScroll();
        document.documentElement.dataset.preloader = 'done';
        setActive(false);
      }
    });

    // 1. Draw SVG monogram strokes (0.45s)
    tl.to(pathRefs.current.filter(Boolean), {
      strokeDashoffset: 0,
      duration: 0.45,
      stagger: 0.035,
      ease: 'power2.out'
    })
      // 2. Pop signal beacon dot
      .fromTo(
        dotRef.current,
        { scale: 0, opacity: 0, transformOrigin: 'center' },
        { scale: 1, opacity: 1, duration: 0.22, ease: 'back.out(2.5)' },
        '-=0.12'
      )
      // 3. Hairline progress bar expands
      .to(
        barRef.current,
        { scaleX: 1, duration: 0.5, ease: 'power2.inOut' },
        0
      )
      // 4. Elegant curtain reveal: slides up cleanly into live hero
      .to(
        root,
        {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.45,
          ease: 'expo.inOut'
        },
        '+=0.12'
      );

    // Fast resolution: sync with fonts ready or cap at max 750ms so user is never blocked
    const fontsReady = (document as any).fonts?.ready ?? Promise.resolve();
    Promise.race([fontsReady, new Promise((resolve) => setTimeout(resolve, 750))]).then(() => {
      tl.play();
    });

    // Escape key bypass
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        tl.kill();
        try {
          sessionStorage.setItem('mg_preloader_seen', '1');
        } catch {}
        startScroll();
        document.documentElement.dataset.preloader = 'done';
        setActive(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      tl.kill();
      startScroll();
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      className="monogram-preloader"
      data-monogram-preloader
      data-wipeout-preloader
      aria-hidden="true"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      {/* Top Metadata Header */}
      <div className="mono flex justify-between items-center text-xs tracking-wider opacity-65">
        <span>{PROFILE.name}</span>
        <span>Portfolio · 2026</span>
      </div>

      {/* Center Stage: Animated Vector Monogram */}
      <div className="flex flex-col items-center justify-center my-auto py-8">
        <svg
          viewBox="0 0 160 110"
          width="160"
          height="110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-inherit overflow-visible"
        >
          {/* Letter M: Serifs, vertical stems and diagonal intersection */}
          <path
            ref={(el) => { pathRefs.current[0] = el; }}
            d="M 22 84 L 22 26"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            ref={(el) => { pathRefs.current[1] = el; }}
            d="M 15 26 L 29 26 M 15 84 L 29 84"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            ref={(el) => { pathRefs.current[2] = el; }}
            d="M 22 26 L 48 74"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            ref={(el) => { pathRefs.current[3] = el; }}
            d="M 48 74 L 74 26"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            ref={(el) => { pathRefs.current[4] = el; }}
            d="M 74 26 L 74 84"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            ref={(el) => { pathRefs.current[5] = el; }}
            d="M 67 26 L 81 26 M 67 84 L 81 84"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Letter G: Graceful serif crescent bowl, crossbar & spur */}
          <path
            ref={(el) => { pathRefs.current[6] = el; }}
            d="M 138 38 C 128 24 108 24 96 34 C 82 46 82 66 96 76 C 110 86 130 84 140 72 L 140 54 L 114 54"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            ref={(el) => { pathRefs.current[7] = el; }}
            d="M 114 48 L 114 60"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Signal Beacon Dot at Monogram Apex */}
          <circle
            ref={dotRef}
            cx="74"
            cy="26"
            r="3.5"
            fill="#FF4D1C"
            className="drop-shadow-[0_0_8px_rgba(255,77,28,0.8)]"
          />
        </svg>

        <span className="mono mt-5 text-[11px] tracking-[0.25em] text-[var(--signal)] uppercase opacity-90">
          Systems · AI · Security
        </span>
      </div>

      {/* Bottom Footer: Minimalist Hairline Progress Bar */}
      <div className="w-full">
        <div className="flex justify-between items-baseline text-[10px] mono opacity-50 mb-2">
          <span>INITIALIZING WORKSPACE</span>
          <span>EST. 2026</span>
        </div>
        <div className="w-full h-[1px] bg-white/15 relative overflow-hidden">
          <div
            ref={barRef}
            className="absolute inset-0 bg-[var(--signal)] origin-left scale-x-0"
          />
        </div>
      </div>
    </div>
  );
}

