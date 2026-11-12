import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Copy, EnvelopeSimple, GithubLogo, LinkedinLogo, PaperPlaneRight } from '@phosphor-icons/react';
import { PROFILE } from '../content/profile';

type FormStatus = 'idle' | 'submitting' | 'success' | 'fallback' | 'error';

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot spam trap
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [statusText, setStatusText] = useState('');
  const [copied, setCopied] = useState(false);

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (name.trim().length < 2) next.name = 'Please enter your name (at least 2 characters).';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Please enter a valid email address.';
    if (subject.trim().length < 3) next.subject = 'Please add a clear subject (at least 3 characters).';
    if (message.trim().length < 10) next.message = 'Please write a message of at least 10 characters.';
    return next;
  };

  const buildMailtoHref = () => {
    const mailSubject = encodeURIComponent(subject.trim() || 'Portfolio inquiry');
    const mailBody = encodeURIComponent(
      `Hi Manas,\n\n${message.trim()}\n\nBest,\n${name.trim()}\n${email.trim()}`
    );
    return `${PROFILE.mailto}?subject=${mailSubject}&body=${mailBody}`;
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setStatus('error');
      setStatusText('Please fix the highlighted fields before sending.');
      return;
    }

    setStatus('submitting');
    setStatusText('Sending your message...');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          website
        })
      });

      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? ((await response.json()) as { ok?: boolean; error?: string; fallbackMailto?: boolean })
        : {};

      if (response.ok && data.ok) {
        setStatus('success');
        setStatusText('Message delivered. Thank you for reaching out.');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        return;
      }

      if (response.status === 503 || response.status === 404 || data.fallbackMailto) {
        setStatus('fallback');
        setStatusText(
          'Direct SMTP transport is not configured on this preview host. Use the pre-filled email action below to send directly to manas.devx@gmail.com.'
        );
        return;
      }

      setStatus('error');
      setStatusText(data.error || 'Could not send message right now. You can use the direct email link instead.');
    } catch {
      setStatus('fallback');
      setStatusText(
        'No active mail relay detected on this host. Click the pre-filled email button below to send directly via your email client.'
      );
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-[var(--surface-subtle)]/40 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">Contact</p>
            <h2 id="contact-heading" className="heading-section display-serif mt-3 text-[var(--fg)]">
              Want to talk about code, AI tooling, or security?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--fg-2)]">
              Happy to connect regarding engineering projects, open-source ideas, technical conversations, or student
              collaborations.
            </p>

            <div className="mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)]">
              <div className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div className="min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--muted)]">Email</p>
                  <a
                    href={PROFILE.mailto}
                    className="mt-1 block truncate text-sm font-semibold text-[var(--accent)] hover:underline"
                  >
                    {PROFILE.email}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="btn-tactile inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 text-xs font-medium text-[var(--fg)] hover:border-[var(--line-strong)]"
                >
                  {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[48px] items-center justify-between py-3 text-sm font-medium text-[var(--fg)] hover:text-[var(--accent)]"
              >
                <span className="inline-flex items-center gap-2.5">
                  <GithubLogo size={17} aria-hidden="true" />
                  <span>GitHub (@{PROFILE.handle})</span>
                </span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>

              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[48px] items-center justify-between py-3 text-sm font-medium text-[var(--fg)] hover:text-[var(--accent)]"
              >
                <span className="inline-flex items-center gap-2.5">
                  <LinkedinLogo size={17} aria-hidden="true" />
                  <span>LinkedIn</span>
                </span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 lg:border-l lg:border-[var(--line)] lg:pl-10">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-7"
            >
              {/* Hidden honeypot field for basic spam filtering */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="contact-website">Leave empty</label>
                <input
                  id="contact-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-[var(--fg)]">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'error-name' : undefined}
                    className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[var(--line-strong)] bg-[var(--bg)] px-3.5 text-sm text-[var(--fg)] placeholder:text-[var(--muted)]"
                  />
                  {errors.name && (
                    <p id="error-name" className="mt-1 text-xs text-[var(--status-err-fg)]">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-[var(--fg)]">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'error-email' : undefined}
                    className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[var(--line-strong)] bg-[var(--bg)] px-3.5 text-sm text-[var(--fg)] placeholder:text-[var(--muted)]"
                  />
                  {errors.email && (
                    <p id="error-email" className="mt-1 text-xs text-[var(--status-err-fg)]">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="contact-subject" className="block text-xs font-semibold text-[var(--fg)]">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  placeholder="Project inquiry, collaboration, or feedback"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
                  }}
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? 'error-subject' : undefined}
                  className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[var(--line-strong)] bg-[var(--bg)] px-3.5 text-sm text-[var(--fg)] placeholder:text-[var(--muted)]"
                />
                {errors.subject && (
                  <p id="error-subject" className="mt-1 text-xs text-[var(--status-err-fg)]">
                    {errors.subject}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <label htmlFor="contact-message" className="block text-xs font-semibold text-[var(--fg)]">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Share context about what you are building or exploring..."
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                  }}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'error-message' : undefined}
                  className="mt-1.5 w-full rounded-lg border border-[var(--line-strong)] bg-[var(--bg)] p-3.5 text-sm leading-relaxed text-[var(--fg)] placeholder:text-[var(--muted)]"
                />
                {errors.message && (
                  <p id="error-message" className="mt-1 text-xs text-[var(--status-err-fg)]">
                    {errors.message}
                  </p>
                )}
              </div>

              <div aria-live="polite" className="mt-4">
                {status === 'success' && (
                  <div className="rounded-lg border border-[var(--status-live-border)] bg-[var(--status-live-bg)] p-3.5 text-xs font-medium text-[var(--status-live-fg)]">
                    {statusText}
                  </div>
                )}

                {status === 'error' && (
                  <div className="rounded-lg border border-[var(--status-err-border)] bg-[var(--status-err-bg)] p-3.5 text-xs font-medium text-[var(--status-err-fg)]">
                    {statusText}
                  </div>
                )}

                {status === 'fallback' && (
                  <div className="space-y-3 rounded-lg border border-[var(--status-warn-border)] bg-[var(--status-warn-bg)] p-4 text-xs text-[var(--status-warn-fg)]">
                    <p className="font-medium leading-relaxed">{statusText}</p>
                    <a
                      href={buildMailtoHref()}
                      className="inline-flex min-h-[40px] items-center gap-2 rounded-md bg-[var(--accent)] px-3.5 py-2 text-xs font-semibold text-[var(--accent-fg)]"
                    >
                      <EnvelopeSimple size={15} aria-hidden="true" />
                      <span>Open Pre-filled Email to {PROFILE.email}</span>
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-tactile inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-fg)] hover:bg-[var(--accent-hover)] disabled:opacity-60"
                >
                  <PaperPlaneRight size={16} weight="bold" aria-hidden="true" />
                  <span>{status === 'submitting' ? 'Sending...' : 'Send Message'}</span>
                </button>

                <a
                  href={buildMailtoHref()}
                  className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--accent)]"
                >
                  <span>Or email directly via mail client</span>
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

