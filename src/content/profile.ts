export interface TimelineEntry {
  period: string;
  title: string;
  category: string;
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
    'Software developer exploring the intersection of AI-ML, Backend development and cybersecurity.',
  heroSubheadline:
    'I build things, experiment with technologies, and enjoy understanding how software works under the hood.',
  statementReveal:
    'Curious about how technology works, from intelligent systems and machine learning to the software and security layers that bring ideas to life.',

  biographyParagraphs:
    [
      "I'm Manas, a second-year Computer Science undergraduate (2025–2029) based in Bengaluru. I'm passionate about software development, artificial intelligence, machine learning, and cybersecurity. I enjoy turning ideas into working products, experimenting with emerging technologies, and understanding the fundamentals behind them.",
      "My interests span multiple areas of technology — building web applications with React and JavaScript, exploring machine learning and AI engineering, experimenting with LLMs, RAG pipelines and AI-powered applications, and diving into cybersecurity, networking, and OSINT. I enjoy exploring how these fields intersect and how they can be used to solve practical problems.",
      "My learning approach is deliberately hands-on: I take systems apart until I can trace their failure modes, build small working implementations from scratch, and ship projects in public on GitHub so I can revisit, refine, and sharpen the design over time. Whether I'm developing intelligent tools, solving algorithmic challenges, or exploring unfamiliar technologies, I believe the best way to understand something is to build it myself."
    ],
  footerNote:
    "Written, built, and maintained by Manas Gandhi while exploring full-stack architecture, Artificial Intelligence & machine learning fundamentals, and security tooling.",
  education: {
    degree: 'Bachelors in Computer Science from BITS PILANI',
    batch: '2025 to 2029',
    standing: 'Second-year undergraduate student',
    focus: 'Data Structures & Algorithms, DBMS, Networking, Operating Systems, Security, AI and Applied ML'
  },
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
      'Foundational ML math , NumPy , Pandas & Sklearn',
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
      'Node.js, Express.js, MongoDB and Spring Boot fundamentals',
      'Building RESTful APIs with authentication, validation and error handling',
      'Working with PostgreSQL, SQL, Prisma ORM and database design',
      'Exploring backend architecture, API integration and asynchronous processing'
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
      'Security testing and vulnerability assessment of open-source repositories',
      'Evaluating AI/LLM models for security weaknesses, prompt injection and unsafe outputs',
      'Exploring AI security, model behavior and adversarial testing techniques',
      'Static code analysis, secret detection and OWASP-aligned security checks',
      'Investigating dependency vulnerabilities and potential attack surfaces'
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
      'Understanding TCP/IP, OSI layers, subnetting, routing and network protocols',
      'Analyzing Ethernet, IPv4, TCP and UDP packet structures',
      'Exploring DNS, DHCP, NAT, HTTP/HTTPS and TLS handshake mechanisms',
      'Experimenting with packet capture, traffic inspection and network troubleshooting',
      'Learning network security, traffic analysis and deep packet inspection (DPI)'
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
      'Writing clean, modular and maintainable code with Java, C++, JavaScript and Python',
      'Designing scalable application structures and reusable software components',
      'Version control, Git workflows, collaborative development and open-source contributions',
      'Debugging, testing, performance optimization and handling edge cases',
      'Exploring software architecture, design patterns and engineering best practices'
    ],
    projectLinks: [
      { label: 'CodeForensics', slug: 'codeforensics' },
      { label: 'DPI Engine', slug: 'dpi-engine' }
    ]
  }
];


export const TIMELINE: TimelineEntry[] = [
  {
    period: '2025 – 2029',
    title: 'Computer Science Undergraduate',
    category: 'Education',
    summary:
      'Pursuing undergraduate studies in Computer Science, exploring software engineering, AI/ML, cybersecurity, networking, databases and systems. Building a strong foundation through coursework, independent learning and hands-on projects.'
  },
  {
    period: '2025 – Present',
    title: 'Academic Journey — BITS Pilani & Scaler',
    category: 'Education',
    summary:
      'Building an interdisciplinary foundation through Computer Science and AI/ML studies, combining academic learning with practical software development, problem-solving and independent engineering projects.'
  },
  {
    period: '2025',
    title: 'From Fundamentals to Building Software',
    category: 'Development',
    summary:
      'Started exploring web development, JavaScript, Java, C++, Python and Data Structures & Algorithms. Built foundational projects, experimented with APIs, and began developing a public GitHub portfolio.'
  },
  {
    period: '2025 – 2026',
    title: 'Full-Stack Development & Product Building',
    category: 'Full Stack',
    summary:
      'Built ShopKart, a full-stack e-commerce application with product management, frontend-backend integration, database operations and payment gateway integration. Also explored application development through independent projects like Job Tracker.'
  },
  {
    period: '2026',
    title: 'AI Engineering, Resume Intelligence & RAG',
    category: 'Artificial Intelligence',
    summary:
      'Explored LLM-powered applications, resume parsing, structured information extraction, semantic matching and Retrieval-Augmented Generation (RAG). Experimented with document processing, AI-assisted evaluation and intelligent application workflows.'
  },
  {
    period: '2026',
    title: 'SecScan.io — Repository Security Scanner',
    category: 'Cybersecurity',
    summary:
      'Developed an automated repository security scanner using Express, TypeScript and React. Integrated GitHub repository analysis with OSV.dev vulnerability intelligence to identify vulnerable dependencies and security risks.'
  },
  {
    period: '2026',
    title: 'DevGuard Pro — Developer Security Platform',
    category: 'Developer Tools',
    summary:
      'Built a developer-focused security platform combining static analysis, secret detection, security rules, GitHub integration and AI-assisted code analysis. Explored local scanning, security reporting and developer workflow integrations.'
  },
  {
    period: '2026',
    title: 'CodeCrafter Journey — Custom Shell',
    category: 'Systems Programming',
    summary:
      'Explored operating system concepts and command-line internals by building a custom shell. Worked on command execution, shell behavior, process interaction and understanding how command-line environments operate under the hood.'
  },
  {
    period: '2026',
    title: 'DPI Engine — Deep Packet Inspection',
    category: 'Networking & Research',
    summary:
      'Built a Python-based deep packet inspection engine to explore network traffic at the byte level. Worked with PCAP parsing, Ethernet, IPv4, TCP, UDP, TLS ClientHello inspection and multi-process traffic analysis.'
  },
  {
    period: '2026',
    title: 'CodeForensics — Source Code Intelligence',
    category: 'Software Engineering',
    summary:
      'Developed a source-code analysis platform exploring AST-based inspection, code structure analysis, evidence relationships and automated security-oriented analysis using TypeScript and modern backend infrastructure.'
  }
];



export const VERIFIED_MILESTONES: VerifiedMilestone[] = [
  {
    id: 'dpi-stars',
    metric: '24 Stars',
    label: 'Open-source Community Recognition',
    detail:
      'DPI Engine, a Python-based Deep Packet Inspection project for PCAP parsing, network protocol analysis and TLS SNI inspection, gained 24 GitHub stars through organic community discovery.',
    sourceLabel: 'DPI Engine Repository',
    sourceUrl: 'https://github.com/Manas-5461X/DPI_Engine'
  },
  {
    id: 'engineering',
    metric: 'Full Stack + Systems',
    label: 'Engineering Across the Stack',
    detail:
      'Built end-to-end applications like ShopKart with payment gateway integration, alongside systems-level projects including a custom shell and DPI Engine. Exploring everything from application architecture to processes, protocols and low-level computing.',
    sourceLabel: 'GitHub Repositories',
    sourceUrl: 'https://github.com/Manas-5461X?tab=repositories'
  },
  {
    id: 'contributions',
    metric: '957',
    label: 'GitHub Contributions in 12 Months',
    detail:
      'Recorded 957 GitHub contributions across 141 active days between November 2025 and November 2026, reflecting a combination of software development, repository activity and coding practice.',
    sourceLabel: 'GitHub Profile',
    sourceUrl: 'https://github.com/Manas-5461X'
  },
  {
    id: 'ai-rag',
    metric: 'AI + RAG',
    label: 'Applied AI & LLM Engineering',
    detail:
      'Exploring machine learning, LLM-powered applications, resume parsing, document intelligence and Retrieval-Augmented Generation (RAG) to build practical AI-driven tools.',
    sourceLabel: 'GitHub Repositories',
    sourceUrl: 'https://github.com/Manas-5461X?tab=repositories'
  }
];


