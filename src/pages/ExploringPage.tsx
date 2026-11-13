import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, BookOpen, Code, Cpu, ShieldCheck } from '@phosphor-icons/react';
import { CURRENTLY_EXPLORING } from '../content/skills';
import { useMeta } from '../hooks/useMeta';
import { useScrollReveals } from '../lib/motion';
import { scrollToTopImmediate, ScrollTrigger } from '../lib/smooth';
import { FieldBackground } from '../components/FieldBackground';

interface TopicDetails {
  icon: typeof Code;
  discipline: string;
  keyQuestions: string[];
  stack: string[];
}

const TOPIC_METADATA: Record<string, TopicDetails> = {
  'Machine Learning Math & Algorithms from Scratch': {
    icon: Cpu,
    discipline: 'Applied Math & ML Systems',
    keyQuestions: [
      'Deriving backpropagation and matrix gradients without torch.autograd',
      'Loss function behavior under numerical precision constraints',
      'Optimizers from scratch: SGD, Momentum, Adam update steps'
    ],
    stack: ['Python', 'NumPy', 'Math / Linear Algebra', 'deep-ml']
  },
  'Static AST Analysis Beyond Regex': {
    icon: Code,
    discipline: 'Compilers & Static Analysis',
    keyQuestions: [
      'Walking Abstract Syntax Trees (AST) safely without code execution',
      'Extracting TypeScript Compiler API symbol graphs & call hierarchies',
      'Eliminating false positives from string/comment regex pattern scans'
    ],
    stack: ['TypeScript', 'Compiler API', 'AST Traversal', 'CodeForensics']
  },
  'Concurrent & Multi-Process Systems Architecture': {
    icon: BookOpen,
    discipline: 'Distributed & Systems Engineering',
    keyQuestions: [
      'Flow sharding and binary PCAP packet queues across OS processes',
      'Redis & BullMQ worker backpressure handling under high concurrency',
      'IPC memory overhead vs threading in network analysis workloads'
    ],
    stack: ['Python multiprocessing', 'Redis', 'BullMQ', 'DPI Engine']
  },
  'OpenCV, Data Analytics & Dockerized Environments': {
    icon: ShieldCheck,
    discipline: 'Vision, Analytics & Container Tooling',
    keyQuestions: [
      'Deterministic multi-stage container builds for security tools',
      'Real-time image kernel convolutions and morphological filters',
      'Statistical repository churn and developer co-change telemetry'
    ],
    stack: ['Docker Compose', 'OpenCV', 'Pandas', 'SecScan.io']
  }
};

export function ExploringPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useMeta({
    title: 'Currently Exploring & Research Topics | Manas Gandhi',
    description:
      'Technical reading, systems research, and coursework-adjacent concepts studied through active code implementations in public repositories.',
    path: '/exploring'
  });

  useScrollReveals(containerRef);

  useEffect(() => {
    scrollToTopImmediate();
    ScrollTrigger.refresh();
  }, []);

  return (
    <div ref={containerRef} className="pb-20">
      {/* Hero Section */}
      <section className="relative border-b border-[var(--line)] py-16 sm:py-24" aria-labelledby="exploring-page-title">
        <FieldBackground />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-6">
            <Link
              to="/#skills"
              className="inline-flex items-center gap-2 font-mono text-xs text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              <span>Back to Technical Index</span>
            </Link>
          </div>

          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">
              Research &amp; Ongoing Study
            </p>
            <h1 id="exploring-page-title" className="display-serif mt-3 text-3xl sm:text-5xl font-normal text-[var(--fg)]">
              Currently Exploring
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-[var(--fg-2)]">
              Deep-dives into systems engineering, compilers, mathematical foundations, and concurrent architectures.
              Every topic connects directly to source code in public repositories rather than aspirational wishlists.
            </p>
          </div>

          {/* Quick telemetry badges */}
          <div className="mt-8 flex flex-wrap gap-4 border-t border-[var(--line)] pt-6 text-xs font-mono text-[var(--muted)]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--status-live-fg)]" />
              <span>{CURRENTLY_EXPLORING.length} Active Study Tracks</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full border border-[var(--accent)]" />
              <span>Grounded in GitHub Commits</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              <span>Independent &amp; Coursework Systems</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Detailed Exploration Cards */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-12">
        <div className="space-y-8">
          {CURRENTLY_EXPLORING.map((topic, idx) => {
            const meta = TOPIC_METADATA[topic.topic] || {
              icon: Code,
              discipline: 'Engineering Research',
              keyQuestions: [],
              stack: []
            };
            const Icon = meta.icon;

            return (
              <article
                key={topic.topic}
                className="rounded-xl border border-[var(--line-strong)] bg-[var(--surface)] p-6 sm:p-8 shadow-sm transition-all hover:border-[var(--line-strong)] hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-[var(--line)] pb-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-subtle)] text-[var(--accent)]">
                      <Icon size={22} weight="regular" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 font-mono text-xs text-[var(--muted)]">
                        <span className="font-semibold text-[var(--accent)]">Track 0{idx + 1}</span>
                        <span>/</span>
                        <span className="uppercase tracking-wider">{meta.discipline}</span>
                      </div>
                      <h2 className="mt-1 text-xl sm:text-2xl font-semibold text-[var(--fg)]">
                        {topic.topic}
                      </h2>
                    </div>
                  </div>

                  {topic.repoUrl && (
                    <a
                      href={topic.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-tactile inline-flex shrink-0 items-center gap-2 rounded-lg border border-[var(--line-strong)] bg-[var(--surface-elevated,var(--surface))] px-4 py-2 font-mono text-xs font-medium text-[var(--accent)] hover:border-[var(--accent)] self-start sm:self-auto"
                    >
                      <span>Public Repository</span>
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </a>
                  )}
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
                  <div className="lg:col-span-7 space-y-4">
                    <div>
                      <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">
                        Core Objective &amp; Why
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--fg-2)]">
                        {topic.why}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">
                        Commitment &amp; Grounded Evidence
                      </h3>
                      <p className="mt-2 font-mono text-xs text-[var(--fg)] bg-[var(--surface-subtle)] border border-[var(--line)] rounded-lg p-3">
                        {topic.evidence}
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-4 border-t border-[var(--line)] pt-4 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
                    <div>
                      <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">
                        Key Study Questions
                      </h3>
                      <ul className="mt-2 space-y-2 text-xs text-[var(--fg-2)]">
                        {(topic.keyStudyQuestions && topic.keyStudyQuestions.length > 0
                          ? topic.keyStudyQuestions
                          : meta.keyQuestions
                        ).map((q, qIdx) => (
                          <li key={qIdx} className="flex items-start gap-2">
                            <span className="text-[var(--accent)] mt-0.5">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2">
                      <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">
                        Related Technologies
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {(topic.relatedTechnologies && topic.relatedTechnologies.length > 0
                          ? topic.relatedTechnologies
                          : meta.stack
                        ).map((tech) => (
                          <span
                            key={tech}
                            className="rounded border border-[var(--line)] bg-[var(--surface-subtle)] px-2 py-0.5 font-mono text-[11px] text-[var(--fg-2)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--line)] pt-8">
          <Link
            to="/#skills"
            className="btn-tactile inline-flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 font-mono text-xs font-medium text-[var(--fg)] hover:border-[var(--line-strong)]"
          >
            <ArrowLeft size={14} />
            <span>Return to Portfolio</span>
          </Link>

          <Link
            to="/#contact"
            className="btn-tactile inline-flex items-center gap-2 rounded-lg border border-[var(--accent)] bg-[var(--accent-tint)] px-4 py-2.5 font-mono text-xs font-medium text-[var(--accent)] hover:opacity-90"
          >
            <span>Have thoughts or ideas? Get in touch</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
export default ExploringPage;

