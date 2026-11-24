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
  Sparkle
} from '@phosphor-icons/react';
import { useTheme } from '../hooks/useTheme';
import { useMeta } from '../hooks/useMeta';
import { RoomCanvas } from './RoomCanvas';
import { HotspotId, ROOM_HOTSPOTS } from './roomHotspots';
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
      'Explore Manas Gandhi’s interactive 3D engineering lab: systems server rack, AST architecture whiteboard, workstation, and verified milestones.',
    path: '/room'
  });

  const [activeHotspot, setActiveHotspot] = useState<HotspotId>('overview');
  const [hoveredHotspot, setHoveredHotspot] = useState<HotspotId | null>(null);
  const [screenPositions, setScreenPositions] = useState<
    Record<HotspotId, { x: number; y: number; visible: boolean }>
  >({} as any);
  const [showPills] = useState(true);

  const isDrawerOpen = activeHotspot !== 'overview';

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

  const navItems: { id: HotspotId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Room', icon: <Cube size={15} /> },
    { id: 'workstation', label: 'Workstation', icon: <Desktop size={15} /> },
    { id: 'serverRack', label: 'Server Rack', icon: <HardDrives size={15} /> },
    { id: 'whiteboard', label: 'Whiteboard', icon: <TreeStructure size={15} /> },
    { id: 'bookshelf', label: 'CS Library', icon: <BookOpen size={15} /> },
    { id: 'trophyStand', label: 'Milestones', icon: <Trophy size={15} /> }
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[var(--bg)] text-[var(--fg)] select-none font-sans">
      {/* 1. 3D WebGL Canvas */}
      <RoomCanvas
        isDark={isDark}
        activeHotspot={activeHotspot}
        onSelectHotspot={handleSelectHotspot}
        onHoverHotspot={setHoveredHotspot}
        onUpdateScreenPositions={setScreenPositions}
        isDrawerOpen={isDrawerOpen}
      />

      {/* 2. Floating 3D Hotspot Badges (Rendered in screen space over 3D objects) */}
      {!isDrawerOpen && showPills && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {(['workstation', 'serverRack', 'whiteboard', 'bookshelf', 'trophyStand'] as HotspotId[]).map((key) => {
            const pos = screenPositions[key];
            if (!pos || !pos.visible) return null;
            const meta = ROOM_HOTSPOTS[key];
            const isHovered = hoveredHotspot === key;

            return (
              <div
                key={key}
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute pointer-events-auto transition-transform duration-200"
              >
                <button
                  type="button"
                  onClick={() => handleSelectHotspot(key)}
                  className={`group flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg transition-all duration-200 cursor-pointer ${
                    isHovered
                      ? 'bg-[var(--signal)] text-[var(--accent-fg)] border-[var(--signal)] scale-110 ring-4 ring-[var(--accent-tint)]'
                      : 'bg-[var(--surface-elevated)]/90 text-[var(--fg)] border-[var(--line-strong)] hover:border-[var(--signal)] hover:scale-105'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isHovered ? 'bg-white animate-pulse' : 'bg-[var(--signal)]'
                    }`}
                  />
                  <span className="font-mono text-xs font-semibold tracking-wide whitespace-nowrap">
                    {meta.badge}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Top Navigation Bar */}
      <header className="room-ui-overlay absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[var(--surface)]/80 backdrop-blur-md border-b border-[var(--line)]">
        {/* Brand & Mode */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 group text-inherit hover:text-[var(--signal)] transition-colors"
            title="Return to 2D portfolio"
          >
            <ArrowLeft size={16} weight="bold" />
            <span className="serif text-xl sm:text-2xl font-normal italic">Manas Gandhi</span>
          </Link>
          <span className="hidden md:inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[var(--surface-subtle)] text-[var(--muted)] border border-[var(--line)]">
            <Sparkle size={12} className="text-[var(--signal)]" /> 3D Workspace
          </span>
        </div>

        {/* Hotspot Direct Links */}
        <nav
          aria-label="3D room zones"
          className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-[var(--surface-subtle)] border border-[var(--line)] overflow-x-auto"
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
        <div className="flex items-center gap-2">
          {/* Reset Camera View button */}
          <button
            type="button"
            onClick={() => setActiveHotspot('overview')}
            title="Reset to room overview"
            className="btn-tactile flex items-center justify-center w-8 h-8 rounded-full border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--signal)] text-[var(--fg)] transition-colors"
          >
            <ArrowsClockwise size={15} />
          </button>

          {/* Theme Toggle (Daylight / Night Workstation) */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Switch to daylight loft' : 'Switch to night workstation'}
            aria-label="Toggle 3D room theme"
            className="btn-tactile flex items-center justify-center w-8 h-8 rounded-full border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--signal)] text-[var(--fg)] transition-colors"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Exit to Portfolio link */}
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--line-strong)] text-xs font-mono font-medium hover:border-[var(--signal)] hover:text-[var(--signal)] transition-colors"
          >
            2D Portfolio
          </Link>
        </div>
      </header>

      {/* 4. Bottom Hint / Quick Bar */}
      <footer className="room-ui-overlay absolute bottom-4 left-4 right-4 z-30 pointer-events-none flex items-center justify-between">
        <div className="pointer-events-auto hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--surface)]/80 backdrop-blur-md border border-[var(--line)] font-mono text-[11px] text-[var(--muted)]">
          <span className="w-2 h-2 rounded-full bg-[var(--signal)] animate-pulse" />
          <span>Click any 3D object to inspect • Drag to orbit • Press ESC for overview</span>
        </div>

        {/* Mobile quick exit button */}
        <Link
          to="/"
          className="pointer-events-auto sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--line)] text-xs font-mono text-[var(--fg)]"
        >
          <ArrowLeft size={13} /> Exit 3D
        </Link>
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
