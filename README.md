# Manas Gandhi: Developer Portfolio

Personal portfolio for **Manas Gandhi**, Computer Science undergraduate (2025 to 2029), built around **The Developer's Workspace: Editorial Tech** visual system.

## Selected Projects (Verified Case Studies)

1. **DevGuard Pro** (`/projects/devguard-pro`): In-browser security analyzer with Monaco Editor, 34 comment-aware heuristic rules, Gemini fallback loop, and Firebase Auth/Firestore persistence.
2. **CodeForensics** (`/projects/codeforensics`): TypeScript monorepo (`Fastify 5`, `React 18`, `Prisma`, `PostgreSQL`, `BullMQ`) for AST code archaeology and deterministic PR/issue lineage.
3. **DPI Engine** (`/projects/dpi-engine`): Zero-dependency Python PCAP Deep Packet Inspection engine with TLS SNI / HTTP Host parsing and multi-process filtering.
4. **SecScan.io** (`/projects/secscan-io`): Decoupled Express 5 + React 19 GitHub repository scanner for secrets, OSV.dev npm CVEs, and config flaws.

## Stack

- React 19, TypeScript, Vite 6
- Tailwind CSS v4 + CSS custom properties (`light` and `dark` themes)
- React Router v7
- GSAP + `@gsap/react` + Lenis (`prefers-reduced-motion` compliant)
- Phosphor Icons (`@phosphor-icons/react`)
- Vercel serverless contact handler (`api/contact.ts`) with Nodemailer and `mailto:` fallback

## Local Development

```bash
npm install
npm run dev
```

## Typecheck & Production Build

```bash
npm run typecheck
npm run build
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env` if configuring production canonical metadata or SMTP email transport:

```env
VITE_SITE_URL=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
CONTACT_TO=manas.devx@gmail.com
```

If SMTP variables are left unset, the contact form cleanly surfaces a pre-filled `mailto:manas.devx@gmail.com` fallback rather than faking delivery.

## Deployment

- **Vercel**: Uses `vercel.json` SPA rewrite (`cleanUrls: true`) and routes `/api/contact` to `api/contact.ts`.
- **Netlify / Static Hosts**: Uses `public/_redirects` (`/* /index.html 200`) for deep client routes (`/projects/:slug`, `/404`).
