import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode
} from 'react';
import { InkTransitionController } from '../theme/inkTransition';
import type { ThemeMode } from '../theme/types';

export type { ThemeMode };

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: (event?: MouseEvent<HTMLButtonElement>) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = 'mg-portfolio-theme';

function getInitialTheme(): ThemeMode {
  if (typeof document !== 'undefined') {
    const preset = document.documentElement.dataset.theme;
    if (preset === 'dark' || preset === 'light') return preset;
  }
  return 'light';
}

function applyThemeToDocument(next: ThemeMode): void {
  const root = document.documentElement;
  root.dataset.theme = next;
  root.classList.toggle('dark', next === 'dark');
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Ignore storage access restrictions
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const themeRef = useRef<ThemeMode>(theme);
  const controllerRef = useRef<InkTransitionController | null>(null);

  useEffect(() => {
    themeRef.current = theme;
    applyThemeToDocument(theme);
  }, [theme]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const canvas = document.createElement('canvas');
    canvas.className = 'ink-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.setAttribute('data-html2canvas-ignore', '');
    document.body.appendChild(canvas);

    const params = new URLSearchParams(window.location.search);
    const allowWebGL = params.get('gl') !== '0';

    const controller = new InkTransitionController(canvas, {
      webgl: allowWebGL,
      getTheme: () => themeRef.current
    });
    controllerRef.current = controller;
    // Delay viewport prewarming until the page is fully hydrated and idle
    controller.scheduleWarm(1600);

    return () => {
      controllerRef.current = null;
      controller.destroy();
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  const commitTheme = useCallback((next: ThemeMode) => {
    themeRef.current = next;
    applyThemeToDocument(next);
    setTheme(next);
  }, []);

  const toggleTheme = useCallback(
    (event?: MouseEvent<HTMLButtonElement>) => {
      const current = themeRef.current;
      const next: ThemeMode = current === 'light' ? 'dark' : 'light';
      const controller = controllerRef.current;

      if (!controller) {
        commitTheme(next);
        return;
      }

      const toggleButton = event?.currentTarget ?? null;
      const hasPointerOrigin =
        Boolean(event) && event!.detail > 0 && (event!.clientX !== 0 || event!.clientY !== 0);
      const point = hasPointerOrigin ? { x: event!.clientX, y: event!.clientY } : undefined;

      void controller.toggle({
        currentTheme: current,
        point,
        toggleButton,
        onApplyTheme: commitTheme
      });
    },
    [commitTheme]
  );

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return ctx;
}

