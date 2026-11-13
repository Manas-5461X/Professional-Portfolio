export type ProjectDiscipline = 'security' | 'systems' | 'fullstack';

export interface StatusFeatureGroup {
  implemented: string[];
  partialOrFallback: string[];
  plannedRoadmap: string[];
}

export interface ArchitectureStage {
  step: string;
  title: string;
  detail: string;
  artifact: string;
}

export interface ChallengeSolution {
  challenge: string;
  solution: string;
}

export interface ProjectScreenshot {
  src: string;
  alt: string;
  caption: string;
}

export interface ProjectRecord {
  slug: string;
  index: string;
  name: string;
  category: string;
  discipline: ProjectDiscipline;
  disciplineLabel: string;
  statusLabel: string;
  timeline: string;
  tagline: string;
  summary: string;
  overview: string;
  problem: string;
  motivation: string;
  whatIBuilt: string[];
  role: string;
  contribution: string;
  stack: string[];
  repoUrl: string;
  liveUrl?: string;
  demoVideoUrl?: string;
  verifiedHighlights: { label: string; value: string }[];
  thumbnail: ProjectScreenshot | null;
  screenshots: ProjectScreenshot[];
  accentColor?: string;
  accentTextColor?: string;
  cliOutputPreview?: {
    command: string;
    output: string;
    note: string;
  };
  architecture: ArchitectureStage[];
  engineeringDecisions: string[];
  challenges: ChallengeSolution[];
  featureStatus: StatusFeatureGroup;
  futureImprovements: string[];
  accentHex: string;
}

export const PROJECTS: ProjectRecord[] = [
  {
    slug: 'devguard-pro',
    index: '01',
    name: 'DevGuard Pro',
    category: 'Developer Security Platform',
    discipline: 'security',
    disciplineLabel: 'Security Tooling',
    statusLabel: 'Live Web App (v1.0.4)',
    timeline: 'Jun to Jul 2026',
    tagline: 'In-browser security analyzer pairing Monaco Editor with comment-aware heuristic rules and resilient AI remediation.',
    summary:
      'A developer security dashboard built with React, Vite, Tailwind CSS, Monaco Editor, and Firebase that flags hardcoded secrets, XSS, injection patterns, and container risks across 16 code templates.',
    overview:
      'DevGuard Pro is a client-side developer security analyzer and scan-history workspace. Developers write or paste snippets inside an embedded Monaco Editor, run a local comment-aware static regex pass across 34 rules in 9 vulnerability categories, and optionally escalate findings to a Gemini REST fallback chain with an inline Monaco DiffEditor for inspecting proposed fixes.',
    problem:
      'Developers frequently paste prototypes, configuration files, and queries containing hardcoded API keys, unsafe DOM sinks, or SQL string interpolation without running heavyweight CI security pipelines locally.',
    motivation:
      'Wanted a fast, browser-native security workbench that explains why a pattern is dangerous, persists scan history per user via Firebase, and stays useful even when external AI endpoints hit rate limits.',
    whatIBuilt: [
      'Embedded Monaco Editor and inline DiffEditor workspace supporting 16 language and framework templates (JavaScript, Python, Java, PHP, Shell, Go, C++, Rust, Ruby, Swift, Kotlin, Vue, Svelte, Docker, React, Angular).',
      'Layer 1 comment-aware regex scanner (src/utils/analyzer.js) implementing 34 rules across 9 security domains with single-line and multi-line comment stripping.',
      'Gemini REST bridge (src/utils/ai.js) cycling sequentially across 4 model endpoints with a 60-second UI cooldown and a local deterministic simulation layer (src/utils/simulation.js).',
      'Firebase Authentication (Email/Password, Google, GitHub) paired with optimistic localStorage caching and UID-isolated Firestore rules (firestore.rules).'
    ],
    role: 'Sole Creator & Full-Stack Builder',
    contribution:
      'Sole creator and full-stack builder responsible for the React component architecture, heuristic rulebook, Monaco z-index layering fixes, Firebase Auth/Firestore rules, and Gemini fallback logic.',
    stack: [
      'React 19',
      'Vite 8',
      'JavaScript',
      'Tailwind CSS v4',
      'Monaco Editor',
      'Firebase Auth',
      'Cloud Firestore',
      'Gemini REST API'
    ],
    repoUrl: 'https://github.com/Manas-5461X/DevGuard-Pro-Developer-Security-Dashboard',
    liveUrl: 'https://dev-guard-omega.vercel.app',
    verifiedHighlights: [
      { label: 'Security Heuristics', value: '34 Static Rules' },
      { label: 'Monaco Templates', value: '16 Languages' },
      { label: 'Static Analysis', value: '100% Client-Side' }
    ],
    thumbnail: {
      src: '/images/projects/devguard-live.png',
      alt: 'DevGuard Pro live authentication screen deployed on Vercel showing email, password, Google, and GitHub sign-in options.',
      caption: 'Live authentication gateway captured from dev-guard-omega.vercel.app (protected routes guard Scanner, Dashboard, and History).'
    },
    screenshots: [
      {
        src: '/images/projects/devguard-live.png',
        alt: 'DevGuard Pro live login view at dev-guard-omega.vercel.app',
        caption: 'Deployed authentication view enforcing Firebase Auth before accessing user-isolated Firestore scan history.'
      }
    ],
    architecture: [
      {
        step: '01',
        title: 'Monaco Code Workspace',
        detail: 'Captures active snippet per language in React state and sessionStorage with custom suggest-widget layering.',
        artifact: 'src/pages/Scanner.jsx'
      },
      {
        step: '02',
        title: 'Layer 1 Comment-Aware Scanner',
        detail: 'Tracks //, #, and /* ... */ block boundaries line by line before testing 34 regex vulnerability signatures.',
        artifact: 'src/utils/analyzer.js'
      },
      {
        step: '03',
        title: '4-Tier Gemini + Simulation Bridge',
        detail: 'Requests structured JSON remediation sequentially across four Gemini endpoints; falls back to simulation.js if unavailable.',
        artifact: 'src/utils/ai.js & simulation.js'
      },
      {
        step: '04',
        title: 'Optimistic Local + Firestore Sync',
        detail: 'Writes scan logs immediately to localStorage (up to 20 items) and syncs asynchronously to UID-guarded Firestore.',
        artifact: 'src/context/ScanContext.jsx'
      }
    ],
    engineeringDecisions: [
      'Chose comment-aware line scanning over naive global regexes so commented examples and docblocks do not flood results with false positives.',
      'Built an optimistic localStorage-first persistence layer so scans survive page refreshes even before Firestore sync finishes.',
      'Scoped Firestore security rules strictly to request.auth.uid on both read/update/delete and create operations so users never access another account history.'
    ],
    challenges: [
      {
        challenge: 'Monaco autocomplete popups clipped behind dashboard panels, and external LLM endpoints returning 429/503 quota errors.',
        solution: 'Injected dedicated .suggest-widget z-index overrides and built a 4-model fallback chain with a 60s UI cooldown plus local deterministic simulation.'
      },
      {
        challenge: 'Regex heuristics cannot perform cross-file taint tracking or full syntactic scoping.',
        solution: 'Documented regex boundaries honestly in the project roadmap and targeted full AST parsing as the next major architectural upgrade.'
      }
    ],
    featureStatus: {
      implemented: [
        'In-browser Monaco Editor & DiffEditor across 16 language templates',
        'Local Layer 1 comment-aware heuristic scanner (34 regex rules across 9 categories)',
        'Firebase Auth (Email/Password, Google, GitHub) and UID-scoped Firestore rules',
        'Scan history drawer, bookmarking, code restoration, and Light/Dark theme toggle'
      ],
      partialOrFallback: [
        'AI remediation layer: calls Gemini REST API client-side when VITE_GEMINI_API_KEY is supplied, automatically switching to local simulation.js templates if quota/network fails',
        'Scanning scope operates on single pasted/edited snippets inside Monaco rather than multi-file repository trees'
      ],
      plannedRoadmap: [
        'GitHub OAuth repository scanning & automated pull request security reviews',
        'Transition from line-based regex rules to full Abstract Syntax Tree (AST) parsing',
        'VS Code extension, CI/CD GitHub Action CLI, PDF/JSON compliance export, and shared team audit boards'
      ]
    },
    futureImprovements: [
      'Move Gemini API calls behind a backend proxy so no API key is ever bundled in client builds.',
      'Replace line regex checks with tree-sitter or TypeScript AST taint analysis.',
      'Add GitHub repository import and PR diff commenting.'
    ],
    accentColor: '#2563EB',
    accentTextColor: '#0B0B0A',
    accentHex: '#2563EB'
  },
  {
    slug: 'codeforensics',
    index: '02',
    name: 'CodeForensics',
    category: 'Code Analysis & Repository Intelligence',
    discipline: 'fullstack',
    disciplineLabel: 'Full-Stack Intelligence',
    statusLabel: 'Active Monorepo + Live Web',
    timeline: 'Oct to Nov 2026',
    tagline: 'Evidence-backed repository intelligence, TypeScript AST archaeology, and deterministic PR/issue lineage.',
    summary:
      'A full-stack TypeScript monorepo connecting GitHub issues, pull requests, commit history, and TypeScript AST symbol spans into an inspectable evidence graph with calibrated confidence ratings.',
    overview:
      'CodeForensics solves context evaporation in unfamiliar or legacy codebases. Instead of letting an LLM guess why a function exists, it combines static TypeScript Compiler API parsing, deterministic PR-to-issue regex extraction, subsystem ownership scoring, and persistent investigation vaults while explicitly tagging claims as FACT, INFERENCE, HYPOTHESIS, or UNKNOWN.',
    problem:
      'Git blame only shows who edited a line last (often an automated formatter or squash-merge commit), while generic AI assistants confidently fabricate historical intent when pull request context is missing.',
    motivation:
      'Designed an engineering intelligence platform where every architectural claim links back to a verifiable commit SHA, pull request number, or 1-indexed AST line span, and abstains honestly when data is incomplete.',
    whatIBuilt: [
      '4-workspace TypeScript monorepo (apps/api Fastify 5 gateway, apps/web React 18 + Vite 6 SPA, apps/worker BullMQ consumer, packages/shared Zod schemas & types).',
      'ArchaeologyEngine (apps/api/src/intelligence/archaeologyEngine.ts) using ts.createSourceFile in memory with strict path traversal sanitization and a 1 MB per-file safety cap.',
      'RelationshipEngine and ContributionEngine extracting deterministic closing/superseding links, historical precedents, log-dampened contributor impact scores, and bus-factor concentration risks.',
      'RepositoryMapEngine generating folder trees, churn hotspot heatmaps, temporal co-change matrices, blast-radius predictors, and multi-format exports (Markdown, Mermaid, ASCII, HTML dossier).'
    ],
    role: 'Lead Architect & Systems Engineer',
    contribution:
      'Architected and implemented the monorepo workspaces, Prisma PostgreSQL schema, Fastify API routes, intelligence engines, React workbench pages, and 25 Vitest test suites.',
    stack: [
      'TypeScript 5.7',
      'React 18',
      'Vite 6',
      'Fastify 5',
      'Prisma 6',
      'PostgreSQL 16',
      'Redis 7',
      'BullMQ',
      'TypeScript Compiler API',
      'Firebase Auth',
      'Octokit',
      'Vitest'
    ],
    repoUrl: 'https://github.com/Manas-5461X/CodeForensics',
    liveUrl: 'https://codeforensics-dev.vercel.app/',
    demoVideoUrl: 'https://drive.google.com/drive/folders/1x_lT3jjLE0A8UWEtmDs0cvlbsKQgqd7e?usp=sharing',
    verifiedHighlights: [
      { label: 'Test Coverage', value: '25 Vitest Suites' },
      { label: 'Monorepo Stack', value: 'Fastify + Worker + React' },
      { label: 'AST Evidence Graph', value: 'TypeScript Compiler' }
    ],
    thumbnail: {
      src: '/images/projects/codeforensics-live.png',
      alt: 'CodeForensics live landing page at codeforensics-dev.vercel.app showing the Evidence Graph hero and navigation.',
      caption: 'Live public landing page captured from codeforensics-dev.vercel.app.'
    },
    screenshots: [
      {
        src: '/images/projects/codeforensics-live.png',
        alt: 'CodeForensics live landing interface with navigation and primary workbench entry points.',
        caption: 'Public entry landing view at codeforensics-dev.vercel.app.'
      },
      {
        src: '/images/projects/codeforensics-docs-live.png',
        alt: 'CodeForensics in-app technical documentation viewer showing the 4-tier evidence classification.',
        caption: 'Live public /docs reference explaining the FACT, INFERENCE, HYPOTHESIS, and UNKNOWN evidentiary hierarchy.'
      }
    ],
    architecture: [
      {
        step: '01',
        title: 'Vite React Workbench',
        detail: 'Authenticated SPA (Overview, Issues Explorer, Repository Map, Analysis Tabs, Archaeology, Investigations) plus public /docs.',
        artifact: 'apps/web/src/App.tsx'
      },
      {
        step: '02',
        title: 'Fastify 5 API & Firebase Verification',
        detail: 'Verifies Firebase ID tokens, enforces object-level investigation ownership, and serves repository analytics.',
        artifact: 'apps/api/src/app.ts'
      },
      {
        step: '03',
        title: 'Static Intelligence Engines',
        detail: 'Runs in-memory TypeScript AST symbol extraction, regex PR-issue linking, contributor scoring, and churn mapping.',
        artifact: 'apps/api/src/intelligence/*'
      },
      {
        step: '04',
        title: 'BullMQ + Prisma Persistence',
        detail: 'Stores normalized repositories, work items, relationships, and sync checkpoints in PostgreSQL via Prisma.',
        artifact: 'prisma/schema.prisma & apps/worker'
      }
    ],
    engineeringDecisions: [
      'Parsed target repository files purely in memory with ts.createSourceFile instead of executing untrusted npm scripts or postinstall hooks.',
      'Dampened raw line-churn scores logarithmically inside ContributionEngine so mass formatting or directory renames do not outrank domain PR merges.',
      'Built explicit coverageNotes and a web HTML + git info/refs fallback in GitHubAppService so public repo verification still works when unauthenticated REST quotas are tight.'
    ],
    challenges: [
      {
        challenge: 'GitHub unauthenticated REST API rate limits (60 req/hr) block quick repository discovery when no token is configured.',
        solution: 'Added a direct public verification fallback in GitHubAppService using public repo HTML metadata and git-upload-pack symrefs.'
      },
      {
        challenge: 'Initial metadata-tier syncs do not always mirror full raw git blame or reviewer approval threads.',
        solution: 'Surfaced explicit coverageNotes and deterministic limitations arrays in API responses rather than fabricating line-level attribution.'
      }
    ],
    featureStatus: {
      implemented: [
        'Fastify 5 REST gateway with Firebase Admin auth, security headers, and health/readiness probes',
        'In-memory TypeScript Compiler API AST symbol discovery (.ts/.tsx/.js/.jsx) with path traversal sanitization and 1 MB limit',
        'Deterministic relationship engine (FIXED_BY, ADDRESSES, SUPERSEDES), precedent matcher, contributor ranking, and bus-factor warnings',
        'Interactive web workbench (Architecture Map, Co-Change, Bus Factor, Blast Radius, Investigations) & 11-chapter /docs site',
        '25 Vitest unit and integration test suites across API, web, worker, and shared packages'
      ],
      partialOrFallback: [
        'When local git commit history is not mirrored, ArchaeologyEngine synthesizes revision checkpoints from merged PR metadata and reports this in coverageNotes',
        'Reviewer approvals and line-level blame are flagged as uningested in metadata-tier syncs rather than guessed'
      ],
      plannedRoadmap: [
        'Full reviewer-comment graph ingestion and multi-language AST parsers beyond TypeScript/JavaScript'
      ]
    },
    futureImprovements: [
      'Extend AST symbol extraction beyond JS/TS to Python and Go.',
      'Ingest inline PR review comment threads into the relationship confidence model.'
    ],
    accentColor: '#7C3AED',
    accentTextColor: '#0B0B0A',
    accentHex: '#7C3AED'
  },
  {
    slug: 'dpi-engine',
    index: '03',
    name: 'DPI Engine',
    category: 'Network Security & Deep Packet Inspection',
    discipline: 'systems',
    disciplineLabel: 'Systems & Networking',
    statusLabel: 'CLI Engine v2.0 (24 Stars)',
    timeline: 'Sep to Oct 2026',
    tagline: 'Zero-dependency multi-processed Python PCAP inspector extracting TLS SNI and HTTP Host payloads to classify and filter flows.',
    summary:
      'A systems-level Deep Packet Inspection engine built solely with Python standard library binary struct unpacking and multiprocessing to parse raw Ethernet/IPv4/TCP/UDP packets, extract TLS ClientHello SNI, and write filtered PCAP captures.',
    overview:
      'DPI Engine examines network packet payloads directly from Wireshark-compatible .pcap captures rather than relying solely on IP/port headers. Even when HTTPS encrypts the session body, the initial TLS ClientHello handshake transmits the Server Name Indication (SNI) in plaintext, allowing the engine to identify services, enforce IP/app/domain drop rules, and export filtered captures.',
    problem:
      'Traditional L3/L4 packet filters cannot tell whether port 443 traffic belongs to YouTube, GitHub, or Cloudflare once IPs rotate behind CDNs.',
    motivation:
      'Built to understand network framing, endianness, TLS handshake byte offsets, and multi-process worker architectures directly at the byte level without external libraries like Scapy.',
    whatIBuilt: [
      'PCAP binary reader (src/pcap_reader.py) supporting both native (0xA1B2C3D4) and byte-swapped (0xD4C3B2A1) global headers and 16-byte packet headers.',
      'Layer 2 to Layer 4 byte parser (src/packet_parser.py) decoding 14-byte Ethernet headers, variable-IHL IPv4 headers, TCP flags/sequence numbers/data offsets, and UDP headers.',
      'Payload inspector (src/sni_extractor.py) implementing TLS ClientHello validation (0x16 handshake, 0x01 ClientHello), variable-length field skipping, and SNI extension (0x0000) extraction alongside HTTP Host parsing and a standalone DNS query parser.',
      'Single-threaded (dpi_simple.py) and multi-processed (dpi_mt.py) CLI runners plus synthetic PCAP generator (generate_test_pcap.py) outputting filtered PCAPs and traffic reports.'
    ],
    role: 'Systems Engineer & Tool Author',
    contribution:
      'Implemented the complete Python port (adapted from a C++ packet-inspector design), CLI argument parser, multi-process worker queues, synthetic test generator, and architecture documentation.',
    stack: [
      'Python 3.8+',
      'struct (Binary Unpacking)',
      'multiprocessing',
      'PCAP Binary Format',
      'IPv4 / TCP / UDP',
      'TLS ClientHello SNI',
      'HTTP Host Parsing'
    ],
    repoUrl: 'https://github.com/Manas-5461X/DPI_Engine',
    verifiedHighlights: [
      { label: 'Community Adoption', value: '24 GitHub Stars' },
      { label: 'Runtime Overhead', value: 'Zero External Libs' },
      { label: 'Packet Inspection', value: 'TLS SNI & DNS Parser' }
    ],
    thumbnail: null,
    screenshots: [],
    cliOutputPreview: {
      command: 'python -m src.dpi_mt test_dpi.pcap out_filtered.pcap --block-app YouTube --fps 2',
      note: 'Captured directly from executing DPI_Engine in this workspace (192.168.1.100 -> YouTube dropped; 76 forwarded, 1 dropped).',
      output: `[Rules] Blocked app: YouTube

==============================================================
               DPI ENGINE v2.0 (Multi-processed)
==============================================================
  Workers: 2
==============================================================

Opened PCAP file: test_dpi.pcap
  Version: 2.4 | Snaplen: 65535 bytes | Link type: 1 (Ethernet)
[Reader] Done reading 77 packets

  Total Packets: 77   | Total Bytes: 5738
  TCP Packets:   73   | UDP Packets: 4
  Forwarded:     76   | Dropped:     1
  Worker 0 processed: 38 | Worker 1 processed: 39

[Detected Applications/Domains]
  www.google.com -> Google    | www.youtube.com -> YouTube
  github.com -> GitHub        | discord.com -> Discord
  www.cloudflare.com -> Cloudflare | apple.com -> Apple`
    },
    architecture: [
      {
        step: '01',
        title: 'PCAP Binary Reader',
        detail: 'Reads 24-byte global header, detects endianness via magic number, and streams 16-byte packet records.',
        artifact: 'src/pcap_reader.py'
      },
      {
        step: '02',
        title: 'Ethernet / IPv4 / L4 Parser',
        detail: 'Unpacks MACs, EtherType (0x0800), IPv4 header length (IHL * 4), TCP/UDP ports, and payload slices.',
        artifact: 'src/packet_parser.py'
      },
      {
        step: '03',
        title: 'TLS SNI & HTTP Host Inspector',
        detail: 'Walks TLS ClientHello offsets (Session ID, Cipher Suites, Compression) to extract extension 0x0000 hostname.',
        artifact: 'src/sni_extractor.py'
      },
      {
        step: '04',
        title: 'Multi-Process Fast Path & PCAP Writer',
        detail: 'Distributes PacketJob items across worker processes, applies IP/App/Domain rules, and writes non-blocked packets.',
        artifact: 'src/dpi_mt.py & types.py'
      }
    ],
    engineeringDecisions: [
      'Used Python built-in struct and multiprocessing exclusively so the engine runs out of the box without C compilers or libpcap wrappers.',
      'Represented network connections using a frozen/hashable FiveTuple (src_ip, dst_ip, src_port, dst_port, protocol) for O(1) flow table lookups.',
      'Handled both native and byte-swapped PCAP captures automatically at file open.'
    ],
    challenges: [
      {
        challenge: 'In dpi_mt.py, hashing raw bytes in the Reader to route flows requires parsing headers before worker dispatch.',
        solution: 'Currently uses round-robin dispatch across workers (documented in source comments) while noting 5-tuple hash affinity is required when multi-packet stateful blocking spans workers.'
      },
      {
        challenge: 'Live test execution revealed substring order collision in sni_to_app_type(): "x.com" and "t.co" matched "www.netflix.com" and "www.microsoft.com" before their own rules.',
        solution: 'Verified the real output during this portfolio audit; switching to domain-label / suffix matching (e.g., host == "t.co" or host.endswith(".t.co")) resolves the collision cleanly.'
      }
    ],
    featureStatus: {
      implemented: [
        'Binary PCAP reader/writer supporting native & swapped endianness',
        'Ethernet (14B), IPv4, TCP, and UDP header unpacking via struct',
        'TLS ClientHello SNI extraction & HTTP Host extraction across 17 named app rules',
        'CLI blocking filters (--block-ip, --block-app, --block-domain) in single-threaded & multi-processed modes'
      ],
      partialOrFallback: [
        'Multi-process dispatch uses round-robin queueing rather than 5-tuple hash sharding (per-flow consistency holds strictly in single-process dpi_simple.py)',
        'DNSExtractor class is implemented in sni_extractor.py, while main loops currently classify port 53 traffic as DNS without logging extracted query strings'
      ],
      plannedRoadmap: [
        'IPv6 header parsing (0x86DD constant defined, IPv4 parser active)',
        'Consistent 5-tuple hash-based load balancing in multi-process mode and label-exact domain matching'
      ]
    },
    futureImprovements: [
      'Replace substring domain matching in types.py with exact domain-suffix matching to eliminate t.co / x.com false matches.',
      'Implement lightweight 5-tuple header hashing in the reader process for true per-flow worker affinity.',
      'Add IPv6 parsing and live TUN/pcap capture bindings.'
    ],
    accentColor: '#FF4D1C',
    accentTextColor: '#0B0B0A',
    accentHex: '#FF4D1C'
  },
  {
    slug: 'secscan-io',
    index: '04',
    name: 'SecScan.io',
    category: 'Security Analysis & Vulnerability Identification',
    discipline: 'security',
    disciplineLabel: 'Security Tooling',
    statusLabel: 'Live Web App + Docker Stack',
    timeline: 'May 2026',
    tagline: 'Full-stack public GitHub repository scanner detecting leaked secrets, npm CVEs via OSV.dev, and configuration flaws.',
    summary:
      'A decoupled Express 5 + TypeScript backend and React 19 + Vite frontend that fetches public GitHub repository trees, scans code and Dockerfiles for secrets and misconfigurations, queries OSV.dev for npm CVEs, and scores aggregate risk.',
    overview:
      'SecScan.io shifts basic repository hygiene checks to a single URL scan. Rather than cloning and executing untrusted repositories locally, the Express backend pulls the recursive file tree via GitHub REST APIs, runs regex secret/config scanners, queries the OSV.dev vulnerability database for package.json manifests, and renders a risk-scored dashboard with Markdown remediation guides and JSON export.',
    problem:
      'Public student and startup repositories frequently ship .env files, hardcoded cloud keys, wildcard CORS rules, or outdated npm packages without realizing what is exposed in the default branch.',
    motivation:
      'Built to practice decoupled TypeScript API design, Zod request validation, external vulnerability intelligence integration (OSV.dev), and containerized frontend/backend deployment.',
    whatIBuilt: [
      'Express 5 + TypeScript backend (backend/src/controllers/ScanController.ts) secured with Helmet, Express Rate Limit, Winston logging, and Zod GitHub URL validation.',
      'SecretScanner scanning lines against 10 credential signatures (AWS Access/Secret Keys, Google API keys, Stripe keys, JWTs, RSA private keys, database connection strings, Twilio keys, Firebase URLs) plus .env files.',
      'DependencyScanner parsing package.json dependencies & devDependencies and querying api.osv.dev/v1/query for npm vulnerabilities.',
      'ConfigScanner flagging .git/config exposure, Dockerfile root users or hardcoded ENV secrets, debug=true flags, S3 URLs, and wildcard CORS headers, paired with RiskCalculator and React 19 + Recharts dashboard.'
    ],
    role: 'Full-Stack Security Builder',
    contribution:
      'Built the full TypeScript backend, scanner modules, OSV.dev integration, React frontend dashboard, JSON export, and Dockerfiles for containerized local deployment.',
    stack: [
      'TypeScript',
      'React 19',
      'Vite 7',
      'Tailwind CSS v4',
      'Node.js',
      'Express 5',
      'Zod',
      'Helmet',
      'OSV.dev API',
      'GitHub REST API',
      'Docker'
    ],
    repoUrl: 'https://github.com/Manas-5461X/SecScan.io',
    liveUrl: 'https://sec-scan-io.vercel.app',
    verifiedHighlights: [
      { label: 'Repository Scan', value: '100 Files per Commit' },
      { label: 'Vulnerability DB', value: 'Live OSV.dev CVEs' },
      { label: 'Secret Detection', value: '10 Pattern Rules' }
    ],
    thumbnail: {
      src: '/images/projects/secscan-live.png',
      alt: 'SecScan.io live home interface deployed on Vercel showing repository URL scanner input and Secrets, Dependency, and Misconfiguration cards.',
      caption: 'Live public scanner interface captured from sec-scan-io.vercel.app.'
    },
    screenshots: [
      {
        src: '/images/projects/secscan-live.png',
        alt: 'SecScan.io live web application interface on Vercel',
        caption: 'Deployed React frontend accepting public GitHub repository URLs at sec-scan-io.vercel.app.'
      }
    ],
    architecture: [
      {
        step: '01',
        title: 'Zod URL Validation & Tree Fetch',
        detail: 'Validates GitHub repository URL and retrieves recursive default-branch tree metadata, capped at 100 target files.',
        artifact: 'backend/src/services/githubService.ts'
      },
      {
        step: '02',
        title: 'Secret & Config Scanners',
        detail: 'Inspects matched source and config files (.ts, .js, .py, .json, .env, .yml, Dockerfile) for exposed keys and unsafe settings.',
        artifact: 'SecretScanner.ts & ConfigScanner.ts'
      },
      {
        step: '03',
        title: 'OSV.dev npm CVE Lookup',
        detail: 'Extracts dependencies from package.json and queries api.osv.dev/v1/query for known vulnerability advisories.',
        artifact: 'backend/src/scanners/DependencyScanner.ts'
      },
      {
        step: '04',
        title: 'Weighted Risk Scoring & JSON Export',
        detail: 'Aggregates Low/Medium/High/Critical severity weights and returns findings with Markdown remediation notes.',
        artifact: 'RiskCalculator.ts & Dashboard.tsx'
      }
    ],
    engineeringDecisions: [
      'Kept GitHub API calls, optional PAT headers, and OSV.dev correlation strictly on the Express backend to avoid CORS limits and client token exposure.',
      'Capped synchronous scans to 100 relevant files so request latency stays predictable without running long-lived background workers for small scans.',
      'Stripped semver prefixes (^, ~) before querying OSV.dev so package.json specs resolve cleanly in MVP scans.'
    ],
    challenges: [
      {
        challenge: 'Long OSV markdown vulnerability disclosures broke dashboard card proportions and layouts.',
        solution: 'Truncated overly long OSV descriptions to the first paragraphs with a direct link back to the canonical osv.dev advisory URL.'
      },
      {
        challenge: 'Synchronous request loops and npm-only manifest parsing limit large polyglot repositories.',
        solution: 'Documented Python requirements.txt scanning as a clear TODO in DependencyScanner.ts and included BullMQ/ioredis dependencies for future async job scaling.'
      }
    ],
    featureStatus: {
      implemented: [
        'POST /api/scan endpoint with Zod validation, Helmet security headers, rate limiting, and GitHub REST tree inspection (max 100 files)',
        '10 heuristic secret regex rules + .env credential detection',
        'ConfigScanner checks for .git/config, Dockerfile USER root / ENV secrets, debug=true, S3 URLs, and CORS *',
        'package.json dependency CVE lookup via OSV.dev API, RiskCalculator scoring, and JSON report download'
      ],
      partialOrFallback: [
        'Dependency vulnerability lookup supports npm (package.json) manifests only; Python requirements.txt is marked TODO in source',
        'BullMQ and ioredis are present in backend package.json, while ScanController executes scans synchronously in-request today'
      ],
      plannedRoadmap: [
        'Python requirements.txt and additional ecosystem support in DependencyScanner',
        'Asynchronous BullMQ scan worker pipeline plus GitLab/Bitbucket adapters and automated PR remediation'
      ]
    },
    futureImprovements: [
      'Implement lockfile-exact version resolution (package-lock.json) and Python requirements.txt parsing.',
      'Wire BullMQ job queues so repositories exceeding 100 files scan asynchronously without HTTP timeouts.'
    ],
    accentColor: '#0EA5E9',
    accentTextColor: '#0B0B0A',
    accentHex: '#0EA5E9'
  }
];

export const PROJECT_BY_SLUG = Object.fromEntries(PROJECTS.map((p) => [p.slug, p])) as Record<
  string,
  ProjectRecord
>;

/**
 * Curated high-contrast, vibrant color palette for project curtain wipes and accent branding.
 * Whenever a new project is added, it automatically receives a distinctive vibrant color.
 */
export const PROJECT_ACCENT_PALETTE: { bg: string; fg: string }[] = [
  { bg: '#2563EB', fg: '#0B0B0A' }, // Electric Royal Blue
  { bg: '#7C3AED', fg: '#0B0B0A' }, // Electric Violet
  { bg: '#FF4D1C', fg: '#0B0B0A' }, // Signal Orange
  { bg: '#0EA5E9', fg: '#0B0B0A' }, // Electric Cyan
  { bg: '#10B981', fg: '#0B0B0A' }, // Emerald Mint
  { bg: '#F59E0B', fg: '#0B0B0A' }, // Ochre Amber
  { bg: '#EC4899', fg: '#0B0B0A' }, // Electric Rose
  { bg: '#6366F1', fg: '#0B0B0A' }, // Indigo Velvet
  { bg: '#14B8A6', fg: '#0B0B0A' }, // Aquamarine Teal
  { bg: '#F97316', fg: '#0B0B0A' }, // Coral Flame
  { bg: '#8B5CF6', fg: '#0B0B0A' }, // Deep Amethyst
  { bg: '#06B6D4', fg: '#0B0B0A' }  // Caribbean Cyan
];

/**
 * Automatically assigns a vibrant, consistent brand color to any project.
 * Uses the project's explicit accentColor if defined, or maps deterministically
 * to a distinct color from PROJECT_ACCENT_PALETTE so new projects get colors instantly.
 */
export function getProjectThemeColor(
  slugOrIndex: string | number,
  explicitBg?: string,
  explicitFg?: string
): { bg: string; fg: string } {
  if (explicitBg) {
    return { bg: explicitBg, fg: explicitFg || '#0B0B0A' };
  }
  if (typeof slugOrIndex === 'number') {
    return PROJECT_ACCENT_PALETTE[Math.abs(slugOrIndex) % PROJECT_ACCENT_PALETTE.length];
  }
  let hash = 0;
  for (let i = 0; i < slugOrIndex.length; i++) {
    hash = (hash << 5) - hash + slugOrIndex.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % PROJECT_ACCENT_PALETTE.length;
  return PROJECT_ACCENT_PALETTE[idx];
}

export function getCurtainForPath(path: string): { label: string; bg: string; fg: string } {
  const clean = path.replace(/#.*$/, '').replace(/\/+$/, '') || '/';
  for (let i = 0; i < PROJECTS.length; i++) {
    const p = PROJECTS[i];
    if (clean === `/projects/${p.slug}`) {
      const theme = getProjectThemeColor(p.slug || i, p.accentColor, p.accentTextColor);
      return {
        label: p.name,
        bg: theme.bg,
        fg: theme.fg
      };
    }
  }
  if (clean.startsWith('/projects/')) {
    const rawSlug = clean.replace('/projects/', '');
    const theme = getProjectThemeColor(rawSlug);
    const formattedLabel = rawSlug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return {
      label: formattedLabel,
      bg: theme.bg,
      fg: theme.fg
    };
  }
  return {
    label: 'Manas Gandhi',
    bg: '#141412',
    fg: '#EEEAE2'
  };
}

