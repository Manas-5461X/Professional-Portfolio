import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { getCurtainForPath } from '../content/projects';
import { isReducedMotion } from '../lib/smooth';

/**
 * RouteCurtain: Full-screen cinematic colored wipe between pages.
 * Displays the project's signature brand accent color with its name
 * centered in an italic serif font, seamlessly swapping the page underneath
 * before wiping up and off to reveal the destination.
 */
export function RouteCurtain() {
  const navigate = useNavigate();
  const curtainRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Respect user modifiers (Ctrl/Cmd/Shift/Alt click or non-primary mouse buttons)
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Ignore external links, mailto, tel, downloads, or target="_blank"
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('//') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        target.target === '_blank' ||
        target.hasAttribute('download')
      ) {
        return;
      }

      // Parse target URL
      let url: URL;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return;
      }

      const currentPath = window.location.pathname;
      const targetPath = url.pathname;
      const targetHash = url.hash;

      // In-page anchor link on the current page: allow default smooth scrolling
      if (targetPath === currentPath) {
        return;
      }

      // If link explicitly opts out of curtain, or has a target section hash (e.g. /#skills, /#work), navigate directly
      if (target.closest('[data-no-curtain]') || targetHash) {
        return;
      }

      // Check if this navigation involves a route transition (projects, exploring, or back to home)
      const isTargetProject = targetPath.startsWith('/projects/');
      const isCurrentProject = currentPath.startsWith('/projects/');
      const isTargetExploring = targetPath === '/exploring';
      const isCurrentExploring = currentPath === '/exploring';
      const isTargetHome = targetPath === '/' || targetPath === '';

      const shouldAnimate =
        isTargetProject ||
        isTargetExploring ||
        ((isCurrentProject || isCurrentExploring) && isTargetHome) ||
        (isCurrentExploring && isTargetProject) ||
        (isCurrentProject && isTargetExploring);

      if (!shouldAnimate) {
        return;
      }

      // Prevent immediate default link jump
      e.preventDefault();
      e.stopPropagation();

      if (busyRef.current) return;

      const targetDestination = targetPath + targetHash;

      // If user prefers reduced motion or curtain DOM is unavailable, navigate immediately
      if (isReducedMotion() || !curtainRef.current || !labelRef.current) {
        navigate(targetDestination);
        window.scrollTo(0, 0);
        return;
      }

      busyRef.current = true;
      const curtain = curtainRef.current;
      const label = labelRef.current;
      const config = getCurtainForPath(targetPath);

      label.textContent = config.label;
      curtain.style.backgroundColor = config.bg;
      curtain.style.color = config.fg;

      gsap.killTweensOf([curtain, label]);

      const tl = gsap.timeline({
        onComplete: () => {
          busyRef.current = false;
          gsap.set(curtain, { visibility: 'hidden' });
        }
      });

      tl.set(curtain, { visibility: 'visible', clipPath: 'inset(100% 0% 0% 0%)' })
        .to(curtain, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.52,
          ease: 'expo.inOut'
        })
        .fromTo(
          label,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.46, ease: 'expo.out' },
          '-=0.25'
        )
        .add(() => {
          navigate(targetDestination);
          window.scrollTo(0, 0);
        })
        .to(label, { yPercent: -110, duration: 0.38, ease: 'expo.in' }, '+=0.08')
        .to(
          curtain,
          {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 0.58,
            ease: 'expo.inOut'
          },
          '-=0.15'
        );
    };

    window.addEventListener('click', handleClick, { capture: true });
    return () => window.removeEventListener('click', handleClick, { capture: true });
  }, [navigate]);

  return (
    <div
      ref={curtainRef}
      className="curtain"
      data-route-curtain
      aria-hidden="true"
    >
      <span className="curtain-mask">
        <span ref={labelRef} className="curtain-label" />
      </span>
    </div>
  );
}
