import { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Cube,
  Desktop,
  HardDrives,
  TreeStructure,
  BookOpen,
  Trophy,
  ArrowLeft,
  ArrowsClockwise,
  Sun,
  Moon,
  Sparkle,
  Monitor
} from '@phosphor-icons/react';
import { useTheme } from '../hooks/useTheme';
import { useMeta } from '../hooks/useMeta';
// import { RoomCanvas } from './RoomCanvas'; // 3D Room Canvas commented out as requested
import { HotspotId } from './roomHotspots';
import { ProjectsDrawer } from './drawers/ProjectsDrawer';
import { SystemsDrawer } from './drawers/SystemsDrawer';
import { ArchitectureDrawer } from './drawers/ArchitectureDrawer';
import { SkillsDrawer } from './drawers/SkillsDrawer';
import { MilestonesDrawer } from './drawers/MilestonesDrawer';

export function RoomPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  useMeta({
    title: 'Interactive 3D Workspace | Manas Gandhi',
    description:
      'Explore Manas Gandhi’s interactive 3D engineering lab: systems server rack, DSA packet analysis whiteboard, workstation, and verified milestones.',
    path: '/room'
  });

  const [activeHotspot, setActiveHotspot] = useState<HotspotId>('overview');
  // 3D Canvas state commented out:
  // const [hoveredHotspot, setHoveredHotspot] = useState<HotspotId | null>(null);
  // const pillElementsRef = useRef<Record<HotspotId, HTMLDivElement | null>>({...});
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectHotspot = useCallback((id: HotspotId) => {
    setActiveHotspot(id);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setActiveHotspot('overview');
  }, []);

  // Keyboard navigation & ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeHotspot !== 'overview') {
          setActiveHotspot('overview');
        } else {
          navigate('/');
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeHotspot, navigate]);

  // Mobile Screen Fallback (Protects phone GPUs and delivers clean UX)
  if (isMobileScreen) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[var(--bg)] text-[var(--fg)] text-center">
        <div className="max-w-md p-8 rounded-2xl border border-[var(--line-strong)] bg-[var(--surface-elevated)] shadow-xl space-y-5">
          <div className="w-14 h-14 rounded-full bg-[var(--surface-subtle)] border border-[var(--line)] flex items-center justify-center mx-auto text-[var(--signal)]">
            <Monitor size={28} weight="duotone" />
          </div>
          <h2 className="serif text-3xl font-normal tracking-tight">
            Desktop 3D Experience
          </h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            The interactive 3D engineering lab is optimized for desktop and laptop displays with mouse orbit controls and high-precision lighting.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--signal)] text-[var(--accent-fg)] font-mono text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <ArrowLeft size={14} weight="bold" /> Return to Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems: { id: HotspotId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Room', icon: <Cube size={15} /> },
    { id: 'workstation', label: 'Workstation', icon: <Desktop size={15} /> },
    { id: 'serverRack', label: 'Server Rack', icon: <HardDrives size={15} /> },
    { id: 'whiteboard', label: 'DSA & Analysis', icon: <TreeStructure size={15} /> },
    { id: 'bookshelf', label: 'CS Library', icon: <BookOpen size={15} /> },
    { id: 'trophyStand', label: 'Milestones', icon: <Trophy size={15} /> }
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[var(--bg)] text-[var(--fg)] select-none font-sans">
      {/* 3D Room Canvas rendering commented out as requested (uncomment to restore):
      <RoomCanvas
        isDark={isDark}
        activeHotspot={activeHotspot}
        onSelectHotspot={handleSelectHotspot}
        onHoverHotspot={setHoveredHotspot}
        pillElementsRef={pillElementsRef}
        isDrawerOpen={isDrawerOpen}
      />
      */}

      {/* 2. Floating 3D Hotspot Badges (Commented out with 3D Room)
      {!isDrawerOpen && (
        <div className="absolute inset-0 pointer-events-none z-20">
          ...
        </div>
      )}
      */}

      {/* Fallback view when 3D Room Canvas is paused */}
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <h2 className="text-3xl font-serif italic mb-3">3D Developer Lab</h2>
        <p className="text-[var(--muted)] text-sm max-w-md mb-6 font-mono">
          3D room rendering is paused for maximum device performance.
        </p>
        <Link to="/" className="pill solid">
          Return to 2D Portfolio
        </Link>
      </div>

      {/* 3. Top Navigation Bar */}
      <header className="room-ui-overlay absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-3.5 bg-[var(--surface)]/85 backdrop-blur-md border-b border-[var(--line)]">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 group text-inherit hover:text-[var(--signal)] transition-colors"
            title="Return to portfolio"
          >
            <ArrowLeft size={16} weight="bold" />
            <span className="serif text-2xl font-normal italic">Manas Gandhi</span>
          </Link>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[var(--surface-subtle)] text-[var(--muted)] border border-[var(--line)]">
            <Sparkle size={12} className="text-[var(--signal)]" /> 3D Cyber Lab
          </span>
        </div>

        {/* Hotspot Direct Jump Links */}
        <nav
          aria-label="3D room zones"
          className="flex items-center gap-1.5 p-1 rounded-full bg-[var(--surface-subtle)] border border-[var(--line)]"
        >
          {navItems.map((item) => {
            const isActive = activeHotspot === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectHotspot(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-[var(--signal)] text-[var(--accent-fg)] font-semibold shadow-xs'
                    : 'text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface)]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveHotspot('overview')}
            title="Reset to room overview"
            className="btn-tactile flex items-center justify-center w-8 h-8 rounded-full border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--signal)] text-[var(--fg)] transition-colors"
          >
            <ArrowsClockwise size={15} />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Switch to daylight loft' : 'Switch to night cyber lab'}
            aria-label="Toggle 3D room theme"
            className="btn-tactile flex items-center justify-center w-8 h-8 rounded-full border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--signal)] text-[var(--fg)] transition-colors"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--line-strong)] text-xs font-mono font-medium hover:border-[var(--signal)] hover:text-[var(--signal)] transition-colors"
          >
            2D Portfolio
          </Link>
        </div>
      </header>

      {/* 4. Bottom Hint Bar */}
      <footer className="room-ui-overlay absolute bottom-4 left-6 right-6 z-30 pointer-events-none flex items-center justify-between">
        <div className="pointer-events-auto flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--line)] font-mono text-[11px] text-[var(--muted)] shadow-md">
          <span className="w-2 h-2 rounded-full bg-[var(--signal)] animate-pulse" />
          <span>Click any 3D object to inspect • Drag to orbit room • Press ESC to return to overview</span>
        </div>
      </footer>

      {/* 5. Interactive Drawers */}
      <ProjectsDrawer
        isOpen={activeHotspot === 'workstation'}
        onClose={handleCloseDrawer}
      />
      <SystemsDrawer
        isOpen={activeHotspot === 'serverRack'}
        onClose={handleCloseDrawer}
      />
      <ArchitectureDrawer
        isOpen={activeHotspot === 'whiteboard'}
        onClose={handleCloseDrawer}
      />
      <SkillsDrawer
        isOpen={activeHotspot === 'bookshelf'}
        onClose={handleCloseDrawer}
      />
      <MilestonesDrawer
        isOpen={activeHotspot === 'trophyStand'}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
export default RoomPage;
