import { useState, type FormEvent } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';
import { PROFILE } from '../content/profile';

type FormStatus = 'idle' | 'submitting' | 'success' | 'fallback' | 'error';

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function Footer() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot spam trap
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [statusText, setStatusText] = useState('');

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

      // If SMTP is unconfigured on preview host, provide graceful mailto fallback
      setStatus('fallback');
      setStatusText(
        'Direct SMTP transport is not configured on this preview host. Use the pre-filled email action below to send directly to manas.devx@gmail.com.'
      );
    } catch {
      setStatus('fallback');
      setStatusText('Network transport unavailable. Please use the direct mailto link below.');
    }
  };

  return (
    <footer id="contact" className="contact" aria-labelledby="contact-heading">
      <p className="mono muted" style={{ marginBottom: '1.8rem' }}>
        Hiring, collaborating, or just curious about one of the builds
      </p>

      <h2 id="contact-heading" className="contact-mail">
        Say <span className="italic">hello.</span>
      </h2>

      <div className="contact-grid">
        {/* Left Column: Minimal Underline Contact Form (Image 3 Parity) */}
        <div>
          {status === 'success' ? (
            <div className="rounded-xl border border-white/20 bg-white/5 p-8" role="status">
              <span className="display h-md block text-[var(--paper)]">
                Got it. <span className="italic text-[var(--signal)]">Thanks.</span>
              </span>
              <p className="mt-3 text-base text-[var(--paper)] opacity-80">
                It&apos;s in my inbox now. I usually reply within a day or two.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="pill light mt-6"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="cform">
              <div className="cform-row">
                <label htmlFor="contact-name">
                  <span className="mono">Your Name</span>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    required
                    maxLength={80}
                    autoComplete="name"
                    placeholder="Ada Lovelace"
                  />
                  {errors.name && (
                    <span id="error-name" className="font-mono text-xs text-[#FF8A6B]">
                      {errors.name}
                    </span>
                  )}
                </label>

                <label htmlFor="contact-email">
                  <span className="mono">Email</span>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    required
                    maxLength={120}
                    autoComplete="email"
                    placeholder="ada@example.com"
                  />
                  {errors.email && (
                    <span id="error-email" className="font-mono text-xs text-[#FF8A6B]">
                      {errors.email}
                    </span>
                  )}
                </label>
              </div>

              <label htmlFor="contact-subject">
                <span className="mono">Subject or Company (Optional)</span>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
                  }}
                  maxLength={120}
                  placeholder="Full-Stack Engineering / System Design"
                />
                {errors.subject && (
                  <span id="error-subject" className="font-mono text-xs text-[#FF8A6B]">
                    {errors.subject}
                  </span>
                )}
              </label>

              <label htmlFor="contact-message">
                <span className="mono">What are you working on?</span>
                <textarea
                  id="contact-message"
                  name="message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                  }}
                  required
                  minLength={10}
                  maxLength={4000}
                  rows={4}
                  placeholder="Tell me about what you are building or exploring..."
                />
                {errors.message && (
                  <span id="error-message" className="font-mono text-xs text-[#FF8A6B]">
                    {errors.message}
                  </span>
                )}
              </label>

              {/* Bot honeypot */}
              <input
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hp"
              />

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="pill solid light"
                >
                  <span className="dot" />
                  <span>{status === 'submitting' ? 'Sending...' : 'Send Message'}</span>
                </button>

                <span
                  className="mono muted"
                  role="status"
                  aria-live="polite"
                  style={{ color: status === 'error' ? '#FF8A6B' : undefined }}
                >
                  {status === 'error' ? statusText : 'Goes straight to my inbox.'}
                </span>
              </div>

              {status === 'fallback' && (
                <div className="mt-4 rounded-lg border border-[var(--signal)]/40 bg-[var(--signal)]/10 p-4">
                  <p className="text-sm text-[var(--paper)]">{statusText}</p>
                  <a
                    href={buildMailtoHref()}
                    className="pill light mt-3 inline-flex text-xs font-semibold"
                  >
                    <span>Open Pre-filled Email</span>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Right Column: Connect Cards & Quick Actions (Image 3 Parity) */}
        <div className="contact-side">
          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="li-card"
            data-cursor="Connect"
          >
            <span className="mono muted">LinkedIn</span>
            <span className="serif text-2xl sm:text-3xl text-[var(--paper)] leading-tight">
              Connect with me on LinkedIn
            </span>
            <span className="mono flex items-center gap-1.5 text-xs text-[var(--paper)] opacity-85">
              <span>{PROFILE.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com/, '')}</span>
              <span className="arrow">&#8599;</span>
            </span>
          </a>

          <a
            href="/resume.pdf"
            download
            className="pill solid light"
          >
            <span className="dot" /> Download resume (PDF)
          </a>

          <a
            href={`mailto:${PROFILE.email}`}
            className="pill light"
          >
            {PROFILE.email}
          </a>
        </div>
      </div>

      {/* Bottom Copyright & Social Navigation (Image 3 Parity) */}
      <div className="foot">
        <span className="mono muted">
          &copy; 2026 {PROFILE.name}. Built in {PROFILE.location}.
        </span>

        <nav aria-label="Social navigation" className="flex items-center gap-6">
          <a
            className="ulink text-[var(--paper)] opacity-80 hover:opacity-100"
            href={PROFILE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            className="ulink text-[var(--paper)] opacity-80 hover:opacity-100"
            href={PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
