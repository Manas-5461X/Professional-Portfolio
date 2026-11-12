export type SkillMaturity = 'applied' | 'exploring';

export interface SkillItem {
  name: string;
  maturity: SkillMaturity;
  evidence: string;
  projectSlug?: string;
}

export interface SkillCategory {
  id: string;
  index: string;
  title: string;
  summary: string;
  items: SkillItem[];
}

export interface ExploringTopic {
  topic: string;
  why: string;
  evidence: string;
  repoUrl?: string;
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'frontend',
    index: '01',
    title: 'Frontend Development',
    summary: 'Component architecture, interactive editors, and responsive styling across modern React toolchains.',
    items: [
      { name: 'HTML', maturity: 'applied', evidence: 'Semantic landmarks & accessible forms across web apps' },
      { name: 'CSS', maturity: 'applied', evidence: 'Custom properties, responsive layout systems & themes' },
      { name: 'JavaScript', maturity: 'applied', evidence: 'DevGuard Pro client scanner & editor state', projectSlug: 'devguard-pro' },
      { name: 'React', maturity: 'applied', evidence: 'React 18/19 SPAs in CodeForensics, DevGuard Pro & SecScan.io', projectSlug: 'codeforensics' },
      { name: 'Vite', maturity: 'applied', evidence: 'Build & HMR pipeline across all three web platforms', projectSlug: 'devguard-pro' },
      { name: 'Tailwind CSS', maturity: 'applied', evidence: 'Design systems in DevGuard Pro, CodeForensics & SecScan.io', projectSlug: 'secscan-io' }
    ]
  },
  {
    id: 'backend',
    index: '02',
    title: 'Backend Development and APIs',
    summary: 'Stateless REST services, database schemas, auth verification, and queue-driven workers.',
    items: [
      { name: 'REST APIs', maturity: 'applied', evidence: 'Fastify 5 API in CodeForensics; Express 5 API in SecScan.io', projectSlug: 'codeforensics' },
      { name: 'Firebase', maturity: 'applied', evidence: 'Firebase Auth & UID-scoped Firestore rules in DevGuard Pro', projectSlug: 'devguard-pro' },
      { name: 'Supabase', maturity: 'exploring', evidence: 'PostgreSQL BaaS evaluation and auth workflows' },
      { name: 'Database integration', maturity: 'applied', evidence: 'Prisma ORM + PostgreSQL 16 schema & migrations in CodeForensics', projectSlug: 'codeforensics' },
      { name: 'Authentication fundamentals', maturity: 'applied', evidence: 'Bearer token verification via Firebase Admin SDK in Fastify', projectSlug: 'codeforensics' },
      { name: 'API development and integration', maturity: 'applied', evidence: 'GitHub REST/Octokit, OSV.dev CVE queries & Gemini REST bridge', projectSlug: 'secscan-io' }
    ]
  },
  {
    id: 'languages',
    index: '03',
    title: 'Programming Languages',
    summary: 'Typed application code, systems scripting, and core algorithmic problem solving.',
    items: [
      { name: 'Python', maturity: 'applied', evidence: 'DPI Engine binary packet parser & ML practice repositories', projectSlug: 'dpi-engine' },
      { name: 'Java', maturity: 'applied', evidence: 'Coursework OOP, DSA & codecrafters-shell-java exploration' },
      { name: 'C++', maturity: 'applied', evidence: 'Systems fundamentals & memory-safety rules studied for DPI/DevGuard' }
    ]
  },
  {
    id: 'ai-ml',
    index: '04',
    title: 'AI and Machine Learning',
    summary: 'Foundational ML implementation alongside practical LLM orchestration and fallback design.',
    items: [
      { name: 'Machine Learning fundamentals', maturity: 'exploring', evidence: 'Regular problem solving in deep-ml & TensorTonic-Solutions repos' },
      { name: 'AI application development', maturity: 'applied', evidence: '4-model Gemini fallback bridge & JSON parsing in DevGuard Pro', projectSlug: 'devguard-pro' },
      { name: 'OpenCV', maturity: 'exploring', evidence: 'Computer vision pipeline experiments & image processing basics' },
      { name: 'Data Analytics', maturity: 'exploring', evidence: 'Repository churn metrics, statistical co-change & study notes' },
      { name: 'LLM and AI tooling exploration', maturity: 'exploring', evidence: 'Grounded vs hallucinated code explanations in CodeForensics', projectSlug: 'codeforensics' }
    ]
  },
  {
    id: 'cybersecurity',
    index: '05',
    title: 'Cybersecurity and Networking',
    summary: 'Static analysis heuristics, vulnerability correlation, and binary packet inspection.',
    items: [
      { name: 'Cybersecurity fundamentals', maturity: 'applied', evidence: 'OWASP injection/XSS/secret rules & path traversal defense', projectSlug: 'devguard-pro' },
      { name: 'OSINT', maturity: 'exploring', evidence: 'Public repository secret exposure & artifact discovery concepts', projectSlug: 'secscan-io' },
      { name: 'Computer Networks', maturity: 'applied', evidence: 'Ethernet/IPv4/TCP/UDP header decoding in DPI Engine', projectSlug: 'dpi-engine' },
      { name: 'Network Analysis', maturity: 'applied', evidence: 'PCAP binary framing, 5-tuple flow tables & TLS SNI extraction', projectSlug: 'dpi-engine' },
      { name: 'Security-focused development', maturity: 'applied', evidence: 'Helmet, Zod validation, Firestore UID isolation & non-executing AST reads', projectSlug: 'codeforensics' }
    ]
  },
  {
    id: 'cs-core',
    index: '06',
    title: 'Computer Science',
    summary: 'Core undergraduate foundations supporting clean architecture and systems debugging.',
    items: [
      { name: 'Data Structures and Algorithms', maturity: 'applied', evidence: 'Graph lineage traversal, flow hash tables & DSA revision tracking' },
      { name: 'DBMS', maturity: 'applied', evidence: 'Relational indexing, compound unique keys & cascade constraints', projectSlug: 'codeforensics' },
      { name: 'SQL', maturity: 'applied', evidence: 'PostgreSQL migrations & Prisma-backed relational querying', projectSlug: 'codeforensics' },
      { name: 'Object-Oriented Programming', maturity: 'applied', evidence: 'Modular scanner engines & Java/TypeScript class hierarchies' },
      { name: 'Problem Solving', maturity: 'applied', evidence: 'Root-cause regression analysis & algorithmic exercises' }
    ]
  },
  {
    id: 'devtools',
    index: '07',
    title: 'Developer Tools',
    summary: 'Version control, Unix environments, HTTP debugging, and container packaging.',
    items: [
      { name: 'Git', maturity: 'applied', evidence: 'Daily branch workflows & git history/provenance analysis', projectSlug: 'codeforensics' },
      { name: 'GitHub', maturity: 'applied', evidence: '31 public repos, GitHub Actions telemetry & GitHub App integration', projectSlug: 'codeforensics' },
      { name: 'VS Code', maturity: 'applied', evidence: 'Primary IDE plus embedded Monaco Editor integration', projectSlug: 'devguard-pro' },
      { name: 'Linux', maturity: 'applied', evidence: 'System administration coursework & POSIX shell experimentation' },
      { name: 'Postman', maturity: 'applied', evidence: 'REST endpoint inspection for Fastify & Express backends' },
      { name: 'Docker fundamentals', maturity: 'exploring', evidence: 'Compose setup for Postgres/Redis & multi-stage SecScan images', projectSlug: 'secscan-io' }
    ]
  }
];

export const CURRENTLY_EXPLORING: ExploringTopic[] = [
  {
    topic: 'Machine Learning Math & Algorithms from Scratch',
    why: 'Understanding matrix operations, loss functions, and optimization without relying purely on high-level wrappers.',
    evidence: 'Active solutions in deep-ml and TensorTonic-Solutions repositories',
    repoUrl: 'https://github.com/Manas-5461X/deep-ml'
  },
  {
    topic: 'Static AST Analysis Beyond Regex',
    why: 'Moving past line-by-line regex limitations toward syntactic tree traversal and safer code intelligence.',
    evidence: 'Implemented TypeScript Compiler API symbol indexing in CodeForensics; planned upgrade for DevGuard Pro',
    repoUrl: 'https://github.com/Manas-5461X/CodeForensics'
  },
  {
    topic: 'Concurrent & Multi-Process Systems Architecture',
    why: 'Studying how worker queues, flow sharding, and process isolation scale packet and repository processing.',
    evidence: 'BullMQ + Redis workers in CodeForensics, Python multiprocessing in DPI Engine, and Java shell builds',
    repoUrl: 'https://github.com/Manas-5461X/DPI_Engine'
  },
  {
    topic: 'OpenCV, Data Analytics & Dockerized Environments',
    why: 'Broadening practical capability across vision tooling, quantitative analysis, and reproducible container deployments.',
    evidence: 'DA_Interview study notes, Docker Compose stacks in CodeForensics, and multi-stage Dockerfiles in SecScan.io',
    repoUrl: 'https://github.com/Manas-5461X/SecScan.io'
  }
];

