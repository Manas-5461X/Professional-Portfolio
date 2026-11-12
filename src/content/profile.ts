export interface TimelineEntry {
  period: string;
  title: string;
  category: 'Education' | 'Engineering' | 'Research';
  summary: string;
  evidence?: string;
}

export interface InterestTrack {
  id: 'ai-ml' | 'frontend' | 'backend' | 'cybersecurity' | 'networking' | 'software-eng';
  index: string;
  title: string;
  shortLabel: string;
  headline: string;
  description: string;
  currentFocus: string[];
  projectLinks: { label: string; slug: string }[];
}

export interface VerifiedMilestone {
  id: string;
  metric: string;
  label: string;
  detail: string;
  sourceLabel: string;
  sourceUrl: string;
}

export const PROFILE = {
  name: 'Manas Gandhi',
  handle: 'Manas-5461X',
  monogram: 'MG',
  role: 'Computer Science Undergraduate (2025 to 2029)',
  location: 'Bengaluru, Karnataka, India',
  focusTags: ['Backend / Distributed Systems', 'AI/ML & AST Archaeology'],
  email: 'manas.devx@gmail.com',
  mailto: 'mailto:manas.devx@gmail.com',
  github: 'https://github.com/Manas-5461X',
  linkedin: 'https://www.linkedin.com/in/manas-gandhi-09a341375/',
  heroHeadline: 'Manas Gandhi',
  heroPositioning:
    'Software developer exploring the intersection of AI, software engineering and cybersecurity.',
  heroSubheadline:
    'I build things, experiment with technologies, and enjoy understanding how software works under the hood.',
  statementReveal:
    'I enjoy pulling back the abstraction layer to see how packets, parsers, APIs, and interfaces actually behave, then turning those mechanics into working tools.',
  biographyParagraphs: [
    "I'm Manas, a second-year Computer Science undergraduate (2025 to 2029) based in Bengaluru. I build software products and small developer tools to test ideas, make sense of unfamiliar systems, and turn coursework concepts into things that actually run.",
    "What keeps me curious is how connected the stack really is. One week I am refining React interfaces and Monaco editor workflows; the next I am debugging Fastify queues, reading raw Ethernet and TLS frames in Python, or seeing how LLMs fail when you ask them for structured code reviews without strict validation.",
    "My learning approach is deliberately hands-on: take a system apart until I can trace its failure modes, write a small working implementation from scratch, and ship it in public on GitHub so I can revisit and sharpen the design over time."
  ],
  footerNote:
    "Written, built, and maintained by Manas Gandhi while exploring full-stack architecture, machine learning fundamentals, and security tooling.",
  education: {
    degree: 'Undergraduate Studies in Computer Science',
    batch: '2025 to 2029',
    standing: 'Second-year undergraduate student',
    focus: 'Data Structures & Algorithms, DBMS, Computer Networks, Operating Systems, Security, and Applied ML'
  },
  verificationNote:
    'All project specs, technology stacks, and contribution counts are verified directly against source code in public GitHub repositories. LinkedIn profile metadata could not be verified programmatically without sign-in, so only explicitly supplied education details are listed.'
} as const;

export const AREAS_OF_INTEREST: InterestTrack[] = [
  {
    id: 'ai-ml',
    index: '01',
    title: 'AI and Machine Learning',
    shortLabel: 'AI & ML',
    headline: 'From matrix math exercises to deterministic LLM workflows.',
    description:
      'I study both sides of machine learning: implementing numerical building blocks from scratch in Python and wiring LLMs into applications with strict schemas and fallback handling so outputs stay predictable.',
    currentFocus: [
      'Multi-model Gemini fallback orchestration & JSON schema checks in DevGuard Pro',
      'Foundational ML math and NumPy problem sets (deep-ml & TensorTonic repos)',
      'Computer vision experiments with OpenCV and structured data analytics'
    ],
    projectLinks: [{ label: 'DevGuard Pro', slug: 'devguard-pro' }]
  },
  {
    id: 'frontend',
    index: '02',
    title: 'Frontend Development',
    shortLabel: 'Frontend',
    headline: 'Fast, legible interfaces built around real developer workflows.',
    description:
      'I care about interfaces that feel calm and direct: responsive layouts, clear loading and error states, keyboard accessibility, and interactive tooling like embedded Monaco editors and codebase graph explorers.',
    currentFocus: [
      'React 18/19, TypeScript, Vite, and Tailwind CSS layout systems',
      'Browser code editors & review panels with Monaco Editor',
      'High-contrast typography, theme persistence, and purposeful motion'
    ],
    projectLinks: [
      { label: 'DevGuard Pro', slug: 'devguard-pro' },
      { label: 'CodeForensics', slug: 'codeforensics' },
      { label: 'SecScan.io', slug: 'secscan-io' }
    ]
  },
  {
    id: 'backend',
    index: '03',
    title: 'Backend Development',
    shortLabel: 'Backend',
    headline: 'Typed APIs, relational schemas, and background worker queues.',
    description:
      'I enjoy designing clear server boundaries: validating inputs at the edge, verifying auth tokens properly, modeling PostgreSQL tables cleanly, and pushing heavy work onto Redis/BullMQ queues.',
    currentFocus: [
      'Fastify 5 & Express 5 REST services with Zod validation and Helmet',
      'PostgreSQL schemas via Prisma ORM and UID-scoped Firestore rules',
      'Two-tier asynchronous synchronization with BullMQ and Redis'
    ],
    projectLinks: [
      { label: 'CodeForensics', slug: 'codeforensics' },
      { label: 'SecScan.io', slug: 'secscan-io' },
      { label: 'DevGuard Pro', slug: 'devguard-pro' }
    ]
  },
  {
    id: 'cybersecurity',
    index: '04',
    title: 'Cybersecurity',
    shortLabel: 'Cybersecurity',
    headline: 'Static analysis, secret detection, and non-executing code inspection.',
    description:
      'Rather than treating security as a checklist added at the end, I like building tools that inspect untrusted inputs safely: heuristic secret scanners, OSV.dev dependency CVE lookups, and path-traversal guards.',
    currentFocus: [
      'Comment-aware regex & OWASP rule engines in DevGuard Pro',
      'GitHub tree scanning and OSV.dev npm CVE correlation in SecScan.io',
      'Non-executing AST analysis with strict path containment in CodeForensics'
    ],
    projectLinks: [
      { label: 'DevGuard Pro', slug: 'devguard-pro' },
      { label: 'SecScan.io', slug: 'secscan-io' },
      { label: 'CodeForensics', slug: 'codeforensics' }
    ]
  },
  {
    id: 'networking',
    index: '05',
    title: 'Networking',
    shortLabel: 'Networking',
    headline: 'Reading raw binary PCAP frames and TLS handshakes from scratch.',
    description:
      'Protocols make much more sense once you decode the bytes yourself. I built DPI Engine in Python to parse Ethernet, IPv4, TCP, and UDP headers manually and extract TLS SNI hostnames across worker processes.',
    currentFocus: [
      'Binary PCAP global/packet header parsing without external packet libraries',
      'Consistent 5-tuple flow sharding across multi-process load balancers',
      'TLS ClientHello SNI inspection and stateful YAML/CLI filtering'
    ],
    projectLinks: [{ label: 'DPI Engine', slug: 'dpi-engine' }]
  },
  {
    id: 'software-eng',
    index: '06',
    title: 'Software Engineering',
    shortLabel: 'Engineering',
    headline: 'Architecture, testing discipline, and maintainable trade-offs.',
    description:
      'I spend time thinking about structure after the prototype works: shared types across monorepo packages, deterministic fallbacks when external APIs rate-limit, and automated Vitest suites that catch regressions.',
    currentFocus: [
      'TypeScript monorepo separation (API, worker, web, shared packages)',
      '25 Vitest unit and integration suites across parsing and routes',
      'POSIX shell experiments in Java and clean system documentation'
    ],
    projectLinks: [
      { label: 'CodeForensics', slug: 'codeforensics' },
      { label: 'DPI Engine', slug: 'dpi-engine' }
    ]
  }
];

export const TIMELINE: TimelineEntry[] = [
  {
    period: '2025 to 2029',
    title: 'Computer Science Undergraduate Program',
    category: 'Education',
    summary:
      'Currently in the second year of undergraduate Computer Science studies, building coursework and independent software systems around algorithms, databases, networking, and security.'
  },
  {
    period: 'Aug to Oct 2025',
    title: 'Foundations on GitHub & Early Web Systems',
    category: 'Engineering',
    summary:
      'Established public GitHub workspace (Manas-5461X) and began shipping core HTML, CSS, JavaScript, and DOM fundamentals alongside structured DSA practice.'
  },
  {
    period: 'May 2026',
    title: 'SecScan.io: Automated Repository Security Scanner',
    category: 'Engineering',
    summary:
      'Built a decoupled Express 5 + TypeScript and React 19 security scanner integrating the GitHub REST tree API and OSV.dev vulnerability database with containerized Dockerfiles.',
    evidence: 'Shipped live at sec-scan-io.vercel.app'
  },
  {
    period: 'Jun to Jul 2026',
    title: 'DevGuard Pro & Systems Shell Exploration',
    category: 'Engineering',
    summary:
      'Created DevGuard Pro (Monaco Editor + 34 comment-aware regex rules + Firebase Auth/Firestore + Gemini fallback loop) while building a Java POSIX-style shell and C CLI labs.',
    evidence: 'Shipped live at dev-guard-omega.vercel.app'
  },
  {
    period: 'Sep to Oct 2026',
    title: 'DPI Engine & Applied Machine Learning Practice',
    category: 'Research',
    summary:
      'Implemented a multi-processed Python PCAP deep packet inspection engine (24 GitHub stars) and maintained consistent applied ML practice repositories (deep-ml and TensorTonic-Solutions).',
    evidence: '24 stars on Manas-5461X/DPI_Engine'
  },
  {
    period: 'Oct to Nov 2026',
    title: 'CodeForensics: AST Archaeology & Evidence Graph',
    category: 'Engineering',
    summary:
      'Architected a TypeScript monorepo combining Fastify 5, React 18, Prisma/PostgreSQL, BullMQ/Redis, and the TypeScript Compiler API with 25 automated Vitest test suites.',
    evidence: 'Shipped live at codeforensics-dev.vercel.app'
  }
];

export const VERIFIED_MILESTONES: VerifiedMilestone[] = [
  {
    id: 'dpi-stars',
    metric: '24 Stars',
    label: 'Community Recognition on DPI_Engine',
    detail:
      'Open-source Python PCAP inspection and TLS SNI classification engine earned 24 stars on GitHub without external marketing.',
    sourceLabel: 'GitHub Repository',
    sourceUrl: 'https://github.com/Manas-5461X/DPI_Engine'
  },
  {
    id: 'live-deployments',
    metric: '3 Deployed',
    label: 'Live Security & Analysis Web Platforms',
    detail:
      'CodeForensics, DevGuard Pro, and SecScan.io are publicly deployed and returning live HTTP 200 responses on Vercel.',
    sourceLabel: 'GitHub Repositories',
    sourceUrl: 'https://github.com/Manas-5461X?tab=repositories'
  },
  {
    id: 'contrib-year',
    metric: '957',
    label: 'Verified Contributions in 12-Month Snapshot',
    detail:
      'Recorded across 141 active days between Nov 2025 and Nov 2026, with a 12-day longest streak and 48 peak daily contributions.',
    sourceLabel: 'Profile Telemetry Data',
    sourceUrl: 'https://github.com/Manas-5461X/Manas-5461X'
  },
  {
    id: 'test-suites',
    metric: '25 Suites',
    label: 'Automated Tests in CodeForensics Monorepo',
    detail:
      'Vitest unit and integration test suites across API routes, AST archaeology, relationship engines, UI components, and worker pipelines.',
    sourceLabel: 'CodeForensics Tests',
    sourceUrl: 'https://github.com/Manas-5461X/CodeForensics'
  }
];

