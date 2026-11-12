import { useMemo, useState } from 'react';
import { PROJECT_BY_SLUG, type ProjectRecord } from '../content/projects';

interface Props {
  slug: string;
}

// ---------------------------------------------------------------------------
// 1. DevGuard Pro: Comment-Aware Regex Heuristic Sandbox (subset of analyzer.js)
// ---------------------------------------------------------------------------
const DEVGUARD_PRESETS = [
  {
    id: 'js',
    label: 'JavaScript XSS + Secret',
    code: `// Safe commented example: eval(test)\nconst API_KEY = "sk_live_demo_12345678";\ndocument.getElementById("bio").innerHTML = userInput;\nconst token = Math.random();`
  },
  {
    id: 'sql',
    label: 'SQL Concatenation',
    code: `/* Old query comment: SELECT * FROM logs */\nconst query = "SELECT * FROM users WHERE name = '" + userName;\n`
  },
  {
    id: 'docker',
    label: 'Dockerfile Config',
    code: `# Non-root best practice check\nFROM node:20-alpine\nUSER root\nADD ./archive.tar.gz /app`
  }
];

const MINI_DEVGUARD_RULES = [
  {
    id: 'eval-usage',
    type: 'Arbitrary Code Execution',
    severity: 'critical',
    pattern: /eval\s*\(/i,
    fix: 'Avoid dynamic code evaluation.'
  },
  {
    id: 'sql-injection-concat',
    type: 'SQL Injection',
    severity: 'critical',
    pattern: /(?:SELECT|UPDATE|DELETE|INSERT).*(?:WHERE|VALUES).*(?:\s*\+\s*[a-zA-Z0-9_$.]+|\$\{[^}]+\})/i,
    fix: 'Use parameterized queries or prepared statements.'
  },
  {
    id: 'hardcoded-api-key',
    type: 'Sensitive Data Exposure',
    severity: 'critical',
    pattern: /(?:\bapi[_-]?key\b|\bsecret\b|\btoken\b|password)\s*[:=]\s*['"][a-zA-Z0-9-_]{8,}['"]/i,
    fix: 'Move secrets into environment variables (.env).'
  },
  {
    id: 'xss-innerhtml',
    type: 'Cross-Site Scripting (XSS)',
    severity: 'high',
    pattern: /\.innerHTML\s*=/i,
    fix: 'Use textContent instead of raw innerHTML.'
  },
  {
    id: 'docker-root-user',
    type: 'Privileged Container Risk',
    severity: 'high',
    pattern: /USER\s+root/i,
    fix: 'Switch to a non-privileged user in Dockerfile.'
  },
  {
    id: 'insecure-random',
    type: 'Insecure Randomness',
    severity: 'low',
    pattern: /Math\.random\(\)/i,
    fix: 'Use crypto.getRandomValues() for security tokens.'
  },
  {
    id: 'docker-add-vs-copy',
    type: 'Insecure Docker Instruction',
    severity: 'low',
    pattern: /\bADD\s+/i,
    fix: 'Prefer COPY for local build artifacts.'
  }
];

function DevGuardSandbox() {
  const [presetId, setPresetId] = useState('js');
  const [code, setCode] = useState(DEVGUARD_PRESETS[0].code);

  const findings = useMemo(() => {
    const lines = code.split('\n');
    const out: { line: number; type: string; severity: string; fix: string; snippet: string }[] = [];
    let inBlockComment = false;

    lines.forEach((raw, idx) => {
      const trimmed = raw.trim();
      if (trimmed.startsWith('/*')) inBlockComment = true;
      const isSingle = trimmed.startsWith('//') || trimmed.startsWith('#');
      if (!inBlockComment && !isSingle) {
        MINI_DEVGUARD_RULES.forEach((rule) => {
          if (rule.pattern.test(raw)) {
            out.push({
              line: idx + 1,
              type: rule.type,
              severity: rule.severity,
              fix: rule.fix,
              snippet: trimmed
            });
          }
        });
      }
      if (trimmed.includes('*/')) inBlockComment = false;
    });
    return out;
  }, [code]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {DEVGUARD_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setPresetId(p.id);
              setCode(p.code);
            }}
            aria-pressed={presetId === p.id}
            className={`min-h-[40px] rounded-md border px-3 text-xs font-medium transition-colors ${
              presetId === p.id
                ? 'border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--accent)]'
                : 'border-[var(--line)] bg-[var(--bg)] text-[var(--fg-2)] hover:border-[var(--line-strong)]'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <label htmlFor="devguard-sandbox-code" className="mb-1.5 block font-mono text-xs text-[var(--muted)]">
            Editable Code Snippet (comments are stripped before matching)
          </label>
          <textarea
            id="devguard-sandbox-code"
            rows={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded-lg border border-[var(--line-strong)] bg-[var(--bg)] p-3 font-mono text-xs leading-relaxed text-[var(--fg)]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-[var(--muted)]">
            <span>Layer 1 Regex Output</span>
            <span className="tabular-nums">{findings.length} flagged</span>
          </div>
          {findings.length === 0 ? (
            <div className="rounded-lg border border-[var(--status-live-border)] bg-[var(--status-live-bg)] p-4 text-xs text-[var(--status-live-fg)]">
              Zero heuristic matches triggered on non-comment lines.
            </div>
          ) : (
            <ul className="space-y-2">
              {findings.map((f, i) => (
                <li
                  key={`${f.line}-${i}`}
                  className="rounded-lg border border-[var(--line)] bg-[var(--bg)] p-3 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[var(--fg)]">{f.type}</span>
                    <span className="font-mono text-[11px] uppercase text-[var(--accent)]">
                      Line {f.line} · {f.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-[var(--fg-2)]">{f.fix}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. CodeForensics: Evidence Taxonomy & Confidence Tracer
// ---------------------------------------------------------------------------
const CODEFORENSICS_CASES = [
  {
    id: 'merged-fix',
    label: 'Merged PR ("Fixes #28941")',
    prTitle: 'fix(reconciler): prevent tearing during nested sync transition',
    prState: 'MERGED',
    issueState: 'CLOSED',
    relationship: 'FIXED_BY (PR -> Issue)',
    category: 'INFERENCE',
    confidence: 'HIGH',
    ruleId: 'RULE_MERGED_CLOSING_DIRECTIVE',
    rationale:
      'Assigned HIGH confidence because PR was merged into default branch with explicit closing keyword "fixes #28941".',
    limitation: 'Does not claim defect resolution without verified test execution.'
  },
  {
    id: 'contextual-ref',
    label: 'Open PR ("Related to #112")',
    prTitle: 'refactor(scheduler): clean up priority lane checks',
    prState: 'OPEN',
    issueState: 'OPEN',
    relationship: 'ADDRESSES',
    category: 'INFERENCE',
    confidence: 'MEDIUM',
    ruleId: 'RULE_CONTEXTUAL_REFERENCE',
    rationale:
      'Assigned MEDIUM confidence because reference cites context without GitHub closing keyword syntax.',
    limitation: 'Cannot assert that referenced issue will be closed by this branch.'
  },
  {
    id: 'closed-orphan',
    label: 'Closed Issue (No Linked PR)',
    prTitle: 'None observed in synchronized pull requests',
    prState: 'NONE',
    issueState: 'CLOSED',
    relationship: 'NONE',
    category: 'UNKNOWN',
    confidence: 'NOT_ASSESSED',
    ruleId: 'ABSTENTION_NO_EVIDENCE',
    rationale:
      'Issue is closed on GitHub, but no referencing PR or commit matched. CodeForensics abstains instead of guessing.',
    limitation: 'May have been closed as stale, duplicate, or via external commit.'
  }
];

function CodeForensicsSandbox() {
  const [selectedId, setSelectedId] = useState(CODEFORENSICS_CASES[0].id);
  const current = CODEFORENSICS_CASES.find((c) => c.id === selectedId) || CODEFORENSICS_CASES[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CODEFORENSICS_CASES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedId(item.id)}
            aria-pressed={selectedId === item.id}
            className={`min-h-[40px] rounded-md border px-3 text-xs font-medium transition-colors ${
              selectedId === item.id
                ? 'border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--accent)]'
                : 'border-[var(--line)] bg-[var(--bg)] text-[var(--fg-2)] hover:border-[var(--line-strong)]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4 sm:grid-cols-2">
        <div className="space-y-2.5 text-xs">
          <div className="font-mono text-[11px] uppercase text-[var(--muted)]">Observed Input Signals</div>
          <div>
            <span className="text-[var(--muted)]">PR Title / Record: </span>
            <span className="font-mono text-[var(--fg)]">{current.prTitle}</span>
          </div>
          <div className="flex flex-wrap gap-2 font-mono text-[11px]">
            <span className="rounded border border-[var(--line)] bg-[var(--surface)] px-2 py-0.5 text-[var(--fg-2)]">
              PR State: {current.prState}
            </span>
            <span className="rounded border border-[var(--line)] bg-[var(--surface)] px-2 py-0.5 text-[var(--fg-2)]">
              Issue State: {current.issueState}
            </span>
          </div>
          <p className="pt-1 text-[var(--fg-2)]">{current.rationale}</p>
        </div>

        <div className="space-y-2.5 border-t border-[var(--line)] pt-3 text-xs sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4">
          <div className="font-mono text-[11px] uppercase text-[var(--muted)]">Evidentiary Output</div>
          <div className="flex flex-wrap gap-2 font-mono text-[11px]">
            <span className="rounded border border-[var(--accent)] bg-[var(--accent-tint)] px-2 py-0.5 font-semibold text-[var(--accent)]">
              {current.category}
            </span>
            <span className="rounded border border-[var(--line)] bg-[var(--surface)] px-2 py-0.5 text-[var(--fg)]">
              Confidence: {current.confidence}
            </span>
          </div>
          <div className="font-mono text-[11px] text-[var(--fg-2)]">
            Rule: {current.ruleId} · Link: {current.relationship}
          </div>
          <p className="text-[var(--muted)]">Explicit limitation: {current.limitation}</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. DPI Engine: 5-Tuple Flow & SNI Rule Classifier Simulator
// ---------------------------------------------------------------------------
const SAMPLE_FLOWS = [
  { srcIp: '192.168.1.100', dstPort: 443, proto: 'TCP', sni: 'www.youtube.com', detected: 'YouTube' },
  { srcIp: '192.168.1.50', dstPort: 443, proto: 'TCP', sni: 'github.com', detected: 'GitHub' },
  { srcIp: '192.168.1.100', dstPort: 443, proto: 'TCP', sni: 'www.tiktok.com', detected: 'TikTok' },
  { srcIp: '192.168.1.100', dstPort: 53, proto: 'UDP', sni: '(port 53 DNS query)', detected: 'DNS' },
  { srcIp: '192.168.1.100', dstPort: 443, proto: 'TCP', sni: 'www.microsoft.com', detected: 'Twitter/X (t.co substring collision)' }
];

function DPISandbox() {
  const [blockYouTube, setBlockYouTube] = useState(true);
  const [blockIp50, setBlockIp50] = useState(false);
  const [blockTiktok, setBlockTiktok] = useState(false);

  const evaluated = SAMPLE_FLOWS.map((flow) => {
    const blocked =
      (blockYouTube && flow.detected === 'YouTube') ||
      (blockIp50 && flow.srcIp === '192.168.1.50') ||
      (blockTiktok && flow.sni.toLowerCase().includes('tiktok'));
    return { ...flow, blocked };
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[
          { label: '--block-app YouTube', active: blockYouTube, toggle: () => setBlockYouTube((v) => !v) },
          { label: '--block-ip 192.168.1.50', active: blockIp50, toggle: () => setBlockIp50((v) => !v) },
          { label: '--block-domain tiktok', active: blockTiktok, toggle: () => setBlockTiktok((v) => !v) }
        ].map((rule) => (
          <button
            key={rule.label}
            type="button"
            onClick={rule.toggle}
            aria-pressed={rule.active}
            className={`min-h-[40px] rounded-md border px-3 font-mono text-xs transition-colors ${
              rule.active
                ? 'border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--accent)]'
                : 'border-[var(--line)] bg-[var(--bg)] text-[var(--fg-2)] hover:border-[var(--line-strong)]'
            }`}
          >
            {rule.label}: {rule.active ? 'ON' : 'OFF'}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--bg)]">
        <table className="w-full min-w-[540px] border-collapse text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-[var(--line)] bg-[var(--surface)] text-[var(--muted)]">
              <th className="px-3 py-2.5 font-medium">Source IP</th>
              <th className="px-3 py-2.5 font-medium">Port / Proto</th>
              <th className="px-3 py-2.5 font-medium">Extracted SNI / Signal</th>
              <th className="px-3 py-2.5 font-medium">types.py Classification</th>
              <th className="px-3 py-2.5 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {evaluated.map((row) => (
              <tr key={`${row.srcIp}-${row.sni}`}>
                <td className="px-3 py-2.5 text-[var(--fg)]">{row.srcIp}</td>
                <td className="px-3 py-2.5 text-[var(--fg-2)]">
                  {row.dstPort} / {row.proto}
                </td>
                <td className="px-3 py-2.5 text-[var(--fg)]">{row.sni}</td>
                <td className="px-3 py-2.5 text-[var(--fg-2)]">{row.detected}</td>
                <td className="px-3 py-2.5">
                  <span
                    className={`inline-block rounded border px-2 py-0.5 text-[11px] font-semibold ${
                      row.blocked
                        ? 'border-[var(--status-err-border)] bg-[var(--status-err-bg)] text-[var(--status-err-fg)]'
                        : 'border-[var(--status-live-border)] bg-[var(--status-live-bg)] text-[var(--status-live-fg)]'
                    }`}
                  >
                    {row.blocked ? 'DROP' : 'FORWARD'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. SecScan.io: Exact RiskCalculator.ts Weighting Sandbox
// ---------------------------------------------------------------------------
const SECSCAN_FACTORS = [
  { id: 'aws', label: 'Exposed AWS Access Key (Critical Secret)', points: 50, category: 'SecretScanner' },
  { id: 'git', label: 'Exposed .git/config Directory (High Config)', points: 30, category: 'ConfigScanner' },
  { id: 'osv', label: 'OSV.dev High npm CVE in package.json', points: 30, category: 'DependencyScanner' },
  { id: 'docker', label: 'Dockerfile runs as USER root (Medium Config)', points: 15, category: 'ConfigScanner' }
];

function SecScanSandbox() {
  const [selected, setSelected] = useState<string[]>(['aws', 'docker']);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const totalScore = SECSCAN_FACTORS.reduce(
    (sum, item) => (selected.includes(item.id) ? sum + item.points : sum),
    0
  );

  let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
  if (totalScore > 100) riskLevel = 'Critical';
  else if (totalScore > 50) riskLevel = 'High';
  else if (totalScore > 20) riskLevel = 'Medium';

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-2 lg:col-span-2">
        {SECSCAN_FACTORS.map((factor) => {
          const active = selected.includes(factor.id);
          return (
            <button
              key={factor.id}
              type="button"
              onClick={() => toggle(factor.id)}
              aria-pressed={active}
              className={`flex min-h-[44px] w-full items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-left text-xs transition-colors ${
                active
                  ? 'border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--fg)]'
                  : 'border-[var(--line)] bg-[var(--bg)] text-[var(--fg-2)] hover:border-[var(--line-strong)]'
              }`}
            >
              <span>
                <span className="font-medium">{factor.label}</span>
                <span className="ml-2 font-mono text-[11px] text-[var(--muted)]">({factor.category})</span>
              </span>
              <span className="font-mono font-semibold text-[var(--accent)] tabular-nums">+{factor.points}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col justify-between rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--muted)]">
            Computed Risk Posture
          </span>
          <div className="mt-2 text-3xl font-semibold text-[var(--fg)] tabular-nums">{totalScore}</div>
          <div className="mt-1 font-mono text-xs font-semibold text-[var(--accent)]">Level: {riskLevel}</div>
        </div>
        <p className="mt-4 font-mono text-[11px] text-[var(--muted)]">
          Thresholds from RiskCalculator.ts: &le;20 Low · &gt;20 Medium · &gt;50 High · &gt;100 Critical
        </p>
      </div>
    </div>
  );
}

function GenericProjectSandbox({ project }: { project?: ProjectRecord }) {
  const [ran, setRan] = useState(false);
  if (!project) return null;

  return (
    <div className="space-y-4">
      {project.cliOutputPreview ? (
        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-subtle)] p-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
            <span className="text-[var(--muted)]">Interactive CLI Simulator</span>
            <button
              type="button"
              onClick={() => setRan(true)}
              className="rounded bg-[var(--accent)] px-2.5 py-1 text-xs font-semibold text-[#0B0B0A] hover:opacity-90"
            >
              {ran ? 'Rerun Command' : 'Run Command ▶'}
            </button>
          </div>
          <div className="mt-3 text-[var(--fg)]">$ {project.cliOutputPreview.command}</div>
          {ran && (
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-[var(--accent)]">
              {project.cliOutputPreview.output}
            </pre>
          )}
          <p className="mt-2 text-[11px] text-[var(--muted)]">{project.cliOutputPreview.note}</p>
        </div>
      ) : (
        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-subtle)] p-4 text-xs">
          <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--accent)] mb-2">
            Verified Architecture Pipeline
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.architecture.map((stage) => (
              <div key={stage.step} className="rounded border border-[var(--line)]/50 bg-[var(--surface)] p-3">
                <span className="font-mono text-[10px] text-[var(--accent)] font-semibold">Stage {stage.step}</span>
                <div className="font-semibold text-[var(--fg)] mt-1">{stage.title}</div>
                <div className="text-[var(--fg-2)] text-[11px] mt-1">{stage.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function InteractiveProjectLab({ slug }: Props) {
  const hasCustomLab = ['devguard-pro', 'codeforensics', 'dpi-engine', 'secscan-io'].includes(slug);
  const project = PROJECT_BY_SLUG[slug];

  return (
    <section
      aria-labelledby="interactive-lab-heading"
      className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
        <div>
          <h2 id="interactive-lab-heading" className="text-base font-semibold text-[var(--fg)]">
            Interactive Architecture Walkthrough
          </h2>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            Client-side simulation faithfully implementing the verified rules from this repository.
          </p>
        </div>
        <span className="rounded border border-[var(--line)] bg-[var(--surface-subtle)] px-2.5 py-1 font-mono text-[11px] text-[var(--muted)]">
          Illustrative Sandbox
        </span>
      </div>

      {slug === 'devguard-pro' && <DevGuardSandbox />}
      {slug === 'codeforensics' && <CodeForensicsSandbox />}
      {slug === 'dpi-engine' && <DPISandbox />}
      {slug === 'secscan-io' && <SecScanSandbox />}
      {!hasCustomLab && <GenericProjectSandbox project={project} />}
    </section>
  );
}
