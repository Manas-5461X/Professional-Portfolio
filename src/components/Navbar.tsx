import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DotsThreeVertical, Moon, Sun, X } from '@phosphor-icons/react';
import { useTheme } from '../hooks/useTheme';
import { PROFILE } from '../content/profile';
import { scrollToElement, scrollToTopImmediate, stopScroll, startScroll } from '../lib/smooth';

interface NavItem {
  label: string;
  hash?: string;
  path?: string;
}

const NAV_LINKS: NavItem[] = [
  { label: 'About', hash: '#about' },
  { label: 'Projects', hash: '#projects' },
  { label: 'Index', hash: '#skills' },
  { label: 'Exploring', path: '/exploring' },
  { label: 'Contact', hash: '#contact' }
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile drawer on route change or Escape key
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!menuOpen) {
      startScroll();
      return;
    }
    stopScroll();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      startScroll();
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const handleNavClick = (item: NavItem) => {
    setMenuOpen(false);
    if (item.path) {
      navigate(item.path);
      return;
    }
    const hash = item.hash || '';
    if (hash === '#top') {
      if (location.pathname === '/') {
        scrollToTopImmediate();
        window.history.replaceState(null, '', '/');
      } else {
        navigate('/');
      }
      return;
    }
    if (location.pathname === '/') {
      scrollToElement(hash);
      window.history.replaceState(null, '', `/${hash}`);
    } else {
      navigate(`/${hash}`);
    }
  };

  const handleBrandClick = () => {
    setMenuOpen(false);
    if (location.pathname === '/') {
      scrollToTopImmediate();
      window.history.replaceState(null, '', '/');
    }
  };

  return (
    <>
      {/* Floating transparent navigation with mix-blend-mode matching reference portfolio */}
      <header className="site-nav">
        {/* Brand Mark (Image 1 Parity: Italic Serif) */}
        <Link
          to="/"
          onClick={handleBrandClick}
          className="site-nav-brand"
          aria-label="Home"
        >
          <span className="serif text-2xl sm:text-[22px] italic tracking-tight font-normal">
            {PROFILE.name}
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Primary navigation" className="site-nav-links hidden lg:flex">
          {NAV_LINKS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleNavClick(item)}
              className={`btn-tactile ulink text-[13.5px] font-normal ${
                item.path && location.pathname === item.path ? 'text-[var(--accent)] font-semibold' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action CTAs & Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 pointer-events-auto">
          {/* Circular WebGL2 Ink-Bleed Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-pressed={theme === 'dark'}
            className="btn-tactile inline-flex min-h-[34px] min-w-[34px] items-center justify-center rounded-full border border-current text-inherit opacity-85 hover:opacity-100 transition-opacity"
          >
            <Sun size={15} weight="regular" className="theme-icon-sun" aria-hidden="true" />
            <Moon size={15} weight="regular" className="theme-icon-moon" aria-hidden="true" />
            <span className="sr-only">
              {theme === 'dark' ? 'Dark mode active, activate for light mode' : 'Light mode active, activate for dark mode'}
            </span>
          </button>

          {/* Mobile 3-Dots Drawer Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            title={menuOpen ? 'Close menu' : 'Open menu'}
            className="btn-tactile inline-flex h-[36px] w-[36px] min-h-[36px] min-w-[36px] items-center justify-center rounded-full border border-current text-inherit opacity-85 hover:opacity-100 transition-opacity lg:hidden"
          >
            {menuOpen ? <X size={20} weight="bold" /> : <DotsThreeVertical size={24} weight="bold" />}
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Curtain Menu */}
      {menuOpen && (
        <div
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          className="fixed inset-0 z-[200] flex flex-col justify-between overflow-y-auto bg-[var(--ink)] text-[var(--paper)] px-6 py-6 lg:hidden"
        >
          {/* Clean single top bar replacing underlying header */}
          <div className="flex justify-between items-center pb-5 border-b border-white/15">
            <span className="serif text-2xl italic tracking-tight">{PROFILE.name}</span>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                className="btn-tactile inline-flex h-[36px] w-[36px] min-h-[36px] min-w-[36px] items-center justify-center rounded-full border border-white/40 text-[var(--paper)] opacity-85 hover:opacity-100 transition-opacity"
              >
                <Sun size={15} weight="regular" className="theme-icon-sun" aria-hidden="true" />
                <Moon size={15} weight="regular" className="theme-icon-moon" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation menu"
                className="btn-tactile inline-flex h-[36px] w-[36px] min-h-[36px] min-w-[36px] items-center justify-center rounded-full border border-white/40 text-[var(--paper)] opacity-85 hover:opacity-100 transition-opacity"
              >
                <X size={20} weight="bold" />
              </button>
            </div>
          </div>

          <nav aria-label="Mobile navigation" className="flex flex-col gap-3 my-auto py-8">
            <span className="mono opacity-50 text-xs uppercase tracking-wider mb-2">Navigation</span>
            {NAV_LINKS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item)}
                className={`serif text-4xl text-left transition-colors py-1 ${
                  item.path && location.pathname === item.path
                    ? 'text-[var(--signal)]'
                    : 'text-[var(--paper)] hover:text-[var(--signal)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="border-t border-white/15 pt-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* Resume download hidden for now as requested */}
              {/* <a href="/resume.pdf" download className="pill solid light">
                <span className="dot" /> Resume &darr;
              </a> */}
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="pill light"
              >
                LinkedIn <span className="arrow">&#8599;</span>
              </a>
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="pill light"
              >
                GitHub <span className="arrow">&#8599;</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
