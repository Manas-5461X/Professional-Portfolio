# Developer Portfolio & Technical Index

A modern, high-performance developer portfolio and project showcase built around an editorial typography system, interactive client-side engineering sandboxes, and smooth motion architecture.

## Overview

- **Interactive Engineering Sandboxes**: Live interactive demonstrations for featured projects (AST symbol graph explorer, packet inspector rules, static code security scanner, and container risk calculator).
- **Responsive Architecture**: Fluid single-screen hero experience on desktop, adaptive touch-optimized layouts on mobile, with zero horizontal overflow.
- **Editorial Typography & Visual Tone**: Clean serif display headers, monospaced metadata ledgers, and tactile button controls inspired by editorial design systems.
- **WebGL2 Ink-Bleed Theme Engine**: Custom fluid simulation shader for smooth, organic light/dark mode transitions with instant zero-motion accessibility fallbacks.
- **Technical Index & Learning Log**: Dual-mode ledger categorizing shipped technologies from areas currently under active study with filterable maturity states.

## Tech Stack

- **Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4 + custom CSS design tokens
- **Routing**: React Router
- **Animations**: GSAP + `@gsap/react` + Lenis smooth scroll
- **Icons**: Phosphor Icons (`@phosphor-icons/react`)
- **Visuals & Shaders**: Three.js / WebGL2 fragment shaders

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Manas-5461X/Professional-Portfolio.git
cd Professional-Portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be running at `http://127.0.0.1:5173`.

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with HMR |
| `npm run build` | Runs TypeScript typecheck (`tsc -b`) and produces production bundle in `dist/` |
| `npm run preview` | Previews production build locally |

## Environment Configuration

Copy `.env.example` to `.env` to configure optional canonical metadata and contact form transport:

```bash
cp .env.example .env
```

```env
# Production URL for canonical tags and Open Graph metadata
VITE_SITE_URL=https://your-portfolio.pages.dev

# Optional Contact Form SMTP credentials
# If left unset, the contact form cleanly falls back to a pre-filled client mailto: link
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
CONTACT_TO=your-email@gmail.com
```

## Deployment

### Cloudflare Pages (Recommended)
This repository includes [`public/_redirects`](./public/_redirects) for SPA client-side routing on Cloudflare Pages:
1. Connect your GitHub repository to Cloudflare Pages.
2. Build command: `npm run build`
3. Build output directory: `dist`
4. Set optional environment variable: `VITE_SITE_URL=https://your-domain.pages.dev`

### Vercel
Uses [`vercel.json`](./vercel.json) to configure SPA routing rewrites and serverless contact API handling:
```bash
npx vercel
```

### Static Hosts (Netlify, GitHub Pages, S3)
The build produces standard static assets in `dist/`. Ensure deep route fallbacks redirect to `/index.html`.

## License

MIT
