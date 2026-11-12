import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useHeroEntrance, useScrollReveals } from '../lib/motion';
import { scrollToElement, scrollToTopImmediate, ScrollTrigger } from '../lib/smooth';
import { useMeta } from '../hooks/useMeta';
import { HeroSection } from '../sections/HeroSection';
import { AboutSection } from '../sections/AboutSection';
import { InterestsSection } from '../sections/InterestsSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { SkillsSection } from '../sections/SkillsSection';
import { TimelineAndActivitySection } from '../sections/TimelineAndActivitySection';

export function HomePage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  useMeta({
    title: 'Manas Gandhi | Software, AI/ML & Security Engineering Portfolio',
    description:
      'Personal portfolio of Manas Gandhi, Computer Science undergraduate (2025-2029) building across AI/ML, full-stack software engineering, and cybersecurity.',
    path: '/'
  });

  useHeroEntrance(containerRef);
  useScrollReveals(containerRef);

  useEffect(() => {
    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
    const secondTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 800);
    return () => {
      window.clearTimeout(refreshTimer);
      window.clearTimeout(secondTimer);
    };
  }, []);

  useEffect(() => {
    if (location.hash) {
      const target = location.hash;
      const timer = window.setTimeout(() => {
        scrollToElement(target);
        ScrollTrigger.refresh();
      }, 60);
      return () => window.clearTimeout(timer);
    } else {
      scrollToTopImmediate();
      ScrollTrigger.refresh();
    }
  }, [location.hash]);

  return (
    <div ref={containerRef}>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <InterestsSection />
      <SkillsSection />
      <TimelineAndActivitySection />
    </div>
  );
}

