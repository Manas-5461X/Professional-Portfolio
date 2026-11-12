import { useEffect, useState } from 'react';

interface GreetingStep {
  text: string;
  hold: number;
  fadeIn?: boolean;
}

const SEQUENCE: readonly GreetingStep[] = [
  { text: 'Hello', hold: 1200, fadeIn: true },
  { text: 'bonjour', hold: 230 },
  { text: 'Ciao', hold: 230 },
  { text: 'Olà', hold: 280 },
  { text: 'やあ', hold: 850 }
];

const FADE_DELAY_MS = 250;
const FADE_DURATION_MS = 750;
const WIPE_DURATION_MS = 1100;
const WIPE_EASE = 'cubic-bezier(0.3, 1.4, 0.5, 1)';
const CLEAR_FADE_MS = 320;

type LoaderPhase = 'words' | 'wiping' | 'clearing' | 'done';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function shouldShowPreloader(): boolean {
  if (typeof window === 'undefined') return false;
  if (prefersReducedMotion()) return false;
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
 * Full-viewport multilingual greeting intro with a bottom-up curved valley wave
 * wipeout that dissolves into the live portfolio without altering page layout.
 */
export function WipeoutPreloader() {
  const [phase, setPhase] = useState<LoaderPhase>(() => (shouldShowPreloader() ? 'words' : 'done'));
  const [step, setStep] = useState(0);
  const [wipeActive, setWipeActive] = useState(false);

  const completePreloader = () => {
    try {
      sessionStorage.setItem('mg_preloader_seen', '1');
    } catch {}
    setPhase('done');
  };

  useEffect(() => {
    document.documentElement.dataset.preloader = phase;
  }, [phase]);

  useEffect(() => {
    if (phase === 'done') {
      try {
        sessionStorage.setItem('mg_preloader_seen', '1');
      } catch {}
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        completePreloader();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'words') return;

    if (step >= SEQUENCE.length) {
      setPhase('wiping');
      return;
    }

    const timer = window.setTimeout(() => setStep((s) => s + 1), SEQUENCE[step].hold);
    return () => window.clearTimeout(timer);
  }, [phase, step]);

  useEffect(() => {
    if (phase !== 'wiping') return;

    setWipeActive(false);
    let raf1 = 0;
    let raf2 = 0;
    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => setWipeActive(true));
    });

    const wipeTimer = window.setTimeout(() => setPhase('clearing'), WIPE_DURATION_MS);
    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      window.clearTimeout(wipeTimer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'clearing') return;
    const clearTimer = window.setTimeout(() => completePreloader(), CLEAR_FADE_MS);
    return () => window.clearTimeout(clearTimer);
  }, [phase]);

  if (phase === 'done') return null;

  const current = SEQUENCE[Math.min(step, SEQUENCE.length - 1)];
  const showWords = phase === 'words' || phase === 'wiping';
  const showWave = phase === 'wiping' || phase === 'clearing';

  return (
    <div
      data-html2canvas-ignore=""
      data-wipeout-preloader={phase}
      aria-hidden="true"
      className="fixed inset-0 z-[950] overflow-hidden"
      style={{
        pointerEvents: phase === 'words' ? 'auto' : 'none',
        opacity: phase === 'clearing' ? 0 : 1,
        transition: phase === 'clearing' ? `opacity ${CLEAR_FADE_MS}ms ease-out` : undefined
      }}
    >
      {showWords && (
        <div
          onClick={completePreloader}
          className="absolute inset-0 flex cursor-pointer items-center justify-center bg-[#EEEAE2]"
        >
          <span
            key={step}
            className="select-none text-6xl font-bold tracking-tight text-[#121210] sm:text-7xl"
            style={
              current.fadeIn
                ? {
                    opacity: 0,
                    transform: 'translateY(6px)',
                    animation: `words-preloader-fade-in ${FADE_DURATION_MS}ms ease-out ${FADE_DELAY_MS}ms forwards`
                  }
                : { opacity: 1 }
            }
          >
            {current.text}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              completePreloader();
            }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full border border-neutral-300 bg-white/80 px-4 py-1.5 font-mono text-xs text-neutral-600 backdrop-blur-xs transition hover:border-neutral-500 hover:text-neutral-900"
          >
            Skip intro · Esc
          </button>
        </div>
      )}

      {showWave && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-0 top-0 flex w-full flex-col"
            style={{
              height: '150vh',
              transform: wipeActive ? 'translateY(-35vh)' : 'translateY(100vh)',
              transition: `transform ${WIPE_DURATION_MS}ms ${WIPE_EASE}`,
              willChange: 'transform'
            }}
          >
            <svg
              viewBox="0 0 1440 300"
              preserveAspectRatio="none"
              className="block w-full shrink-0"
              style={{ height: '30vh' }}
            >
              <path d="M0,0 Q720,300 1440,0 L1440,300 L0,300 Z" fill="black" />
            </svg>
            <div className="w-full flex-1 bg-black" />
          </div>
        </div>
      )}
    </div>
  );
}

