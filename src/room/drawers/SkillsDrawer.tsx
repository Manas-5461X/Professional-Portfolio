import { GraduationCap } from '@phosphor-icons/react';
import { SKILL_CATEGORIES } from '../../content/skills';
import { RoomDrawerShell } from './RoomDrawerShell';

interface SkillsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SkillsDrawer({ isOpen, onClose }: SkillsDrawerProps) {
  return (
    <RoomDrawerShell
      isOpen={isOpen}
      onClose={onClose}
      category="CS Library & Bookshelf"
      title="Academics & Technical Stack"
      badge="BITS Pilani (2025–2029)"
      actionText="Explore Skill Index"
      actionHref="/#skills"
    >
      <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] space-y-2.5">
        <div className="flex items-center gap-2">
          <GraduationCap size={20} className="text-[var(--signal)]" />
          <h3 className="serif text-xl font-normal text-[var(--fg)]">
            BITS Pilani — B.Sc. Computer Science
          </h3>
        </div>
        <span className="font-mono text-xs text-[var(--muted)] block">
          Second-Year Undergraduate (Batch 2025 – 2029) • Bengaluru, India
        </span>
        <p className="text-xs leading-relaxed text-[var(--muted)]">
          Curriculum & independent focus: Data Structures & Algorithms, Database Management Systems (PostgreSQL, SQL), Computer Networks, Operating Systems, Systems Programming, and Applied AI/ML.
        </p>
      </div>

      <div className="space-y-4">
        {SKILL_CATEGORIES.slice(0, 5).map((cat) => (
          <div
            key={cat.id}
            className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <h4 className="serif text-lg font-normal text-[var(--fg)]">
                {cat.title}
              </h4>
              <span className="font-mono text-[11px] text-[var(--muted)]">
                {cat.items.length} Skills
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {cat.items.map((item) => (
                <span
                  key={item.name}
                  className="font-mono text-xs px-2.5 py-1 rounded-md bg-[var(--surface-elevated)] text-[var(--fg)] border border-[var(--line)] flex items-center gap-1.5"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.maturity === 'applied' ? 'bg-[var(--signal)]' : 'bg-[#38BDF8]'
                    }`}
                  />
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </RoomDrawerShell>
  );
}
