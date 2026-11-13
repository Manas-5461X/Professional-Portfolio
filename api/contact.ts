import type { IncomingMessage, ServerResponse } from 'node:http';
import nodemailer from 'nodemailer';

interface VercelRequest extends IncomingMessage {
  body?: unknown;
}

interface VercelResponse extends ServerResponse {
  status: (code: number) => VercelResponse;
  json: (data: unknown) => void;
}

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 3;
const rateBuckets = new Map<string, number[]>();

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripHeaderBreaks(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0].split(',')[0]?.trim() || 'unknown';
  }
  return req.socket?.remoteAddress || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const existing = (rateBuckets.get(ip) || []).filter((ts) => now - ts < RATE_WINDOW_MS);
  if (existing.length >= RATE_MAX_REQUESTS) {
    rateBuckets.set(ip, existing);
    return true;
  }
  existing.push(now);
  rateBuckets.set(ip, existing);
  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false, error: 'Method not allowed. Use POST.' });
    return;
  }

  let payload: Record<string, unknown> = {};
  try {
    if (typeof req.body === 'string') {
      payload = JSON.parse(req.body) as Record<string, unknown>;
    } else if (req.body && typeof req.body === 'object') {
      payload = req.body as Record<string, unknown>;
    }
  } catch {
    res.status(400).json({ ok: false, error: 'Malformed JSON payload.' });
    return;
  }

  // Honeypot field: silently drop automated bot submissions
  const website = typeof payload.website === 'string' ? payload.website.trim() : '';
  if (website.length > 0) {
    res.status(200).json({ ok: true, message: 'Message received.' });
    return;
  }

  const name = stripHeaderBreaks(typeof payload.name === 'string' ? payload.name : '').slice(0, 120);
  const email = stripHeaderBreaks(typeof payload.email === 'string' ? payload.email : '').slice(0, 160);
  const subject = stripHeaderBreaks(typeof payload.subject === 'string' ? payload.subject : '').slice(0, 180);
  const message = (typeof payload.message === 'string' ? payload.message : '').trim().slice(0, 4000);

  if (name.length < 2) {
    res.status(400).json({ ok: false, error: 'Please provide your name (at least 2 characters).' });
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    res.status(400).json({ ok: false, error: 'Please provide a valid email address.' });
    return;
  }

  if (subject.length < 3) {
    res.status(400).json({ ok: false, error: 'Please provide a subject (at least 3 characters).' });
    return;
  }

  if (message.length < 10) {
    res.status(400).json({ ok: false, error: 'Please write a message (at least 10 characters).' });
    return;
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    res.status(429).json({
      ok: false,
      error: 'Too many messages sent recently. Please wait a few minutes or use the direct email link.'
    });
    return;
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || '587');
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const contactTo = process.env.CONTACT_TO || process.env.SMTP_USER;

  if (!smtpHost || !smtpUser || !smtpPass || !contactTo) {
    res.status(503).json({
      ok: false,
      fallbackMailto: true,
      error: 'Direct email transport is not configured on this host. Please use the direct mailto link.'
    });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    await transporter.sendMail({
      from: smtpUser,
      to: contactTo,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
      html: `
        <div style="font-family: system-ui, sans-serif; line-height: 1.6; color: #111827;">
          <p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <hr />
          <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      `
    });

    res.status(200).json({ ok: true, message: 'Message delivered.' });
  } catch {
    res.status(502).json({
      ok: false,
      fallbackMailto: true,
      error: 'Unable to reach mail server right now. Please use the direct email link.'
    });
  }
}

