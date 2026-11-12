# DESIGN.md: The Developer's Workspace (Editorial Tech)

## Design Read
Reading this as: Personal developer portfolio for technical recruiters, engineering managers, and systems peers, in an Editorial Tech workspace aesthetic, dial ENERGY 2 / RHYTHM 3 / MOTION 2.

## Art Direction & Intent
- **Concept**: The Developer's Workspace: Editorial Tech. Clean architectural paper in light mode and obsidian slate in dark mode, grounded by crisp 1px hairlines, restrained elevation, and deliberate light-blue focus markers.
- **Target Audience**: Engineering managers, software recruiters, and fellow developers evaluating full-stack, AI/ML, and security engineering craft.
- **Primary Accent**: Sky/Light Blue (`#0369A1` interactive text/buttons in light mode for >=5.68:1 WCAG AA contrast, `#E0F2FE` soft sky washes, `#38BDF8` accent in dark mode for 8.29:1 contrast).
- **Palette System**:
  - Light theme: `--bg: #FAFAFA`, `--bg-elevated: #FFFFFF`, `--bg-subtle: #F1F5F9`, `--fg: #111827`, `--fg-secondary: #374151`, `--muted: #4B5563`, `--line: #E2E8F0`, `--border-strong: #64748B`, `--accent: #0369A1`, `--accent-bright: #0EA5E9`, `--accent-tint: #E0F2FE`.
  - Dark theme: `--bg: #181818`, `--bg-elevated: #1F1F1F`, `--bg-subtle: #272727`, `--fg: #F8FAFC`, `--fg-secondary: #CBD5E1`, `--muted: #94A3B8`, `--line: #313131`, `--border-strong: #64748B`, `--accent: #38BDF8`, `--accent-bright: #38BDF8`, `--accent-tint: rgba(56, 189, 248, 0.14)`.
- **Typography**: `Geist` (`400`, `500`, `600`, `700`) for display and body copy; `Geist Mono` (`400`, `500`, `600`) strictly for code tokens, network five-tuples, file paths, and structured metadata. Fluid scale via `clamp()`, `tabular-nums` for verified counts, `text-wrap: balance` on headings, zero italic styles, zero ultra-bold weights.
- **Motion Strategy**: GSAP + `@gsap/react` + Lenis inertial smooth scroll on desktop. Masked hero arrival, word-by-word scroll statement reveal, and interactive architectural explorers. Fully bypassed when `prefers-reduced-motion: reduce` is enabled; all content remains opaque without JavaScript.
- **Iconography**: Phosphor Icons (`@phosphor-icons/react`) with uniform regular stroke weight, used strictly for functional clarity.
- **Purpose-Gate Justifications**:
  - Technical workspace grid in Hero & blueprint case-study headers: anchors the "Developer's Workspace" engineering motif at <6% opacity so text contrast remains unaffected.
  - Light blue accent: fulfills user art direction while holding >=5.1:1 contrast on interactive surfaces in both themes.
  - Uniform border rules (`1px solid` around full containers, zero single-sided decorative stripes): reinforces schematic structural precision.

