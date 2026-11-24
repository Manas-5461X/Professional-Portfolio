import { CanvasTexture, SRGBColorSpace } from 'three';

/**
 * High-performance procedural textures rendered once to canvas.
 * Zero network latency, crisp pixel clarity, and reactive to light/dark themes.
 */

export function createIdeScreenTexture(isDark: boolean): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d')!;

  const bg = isDark ? '#141416' : '#FAF8F5';
  const sidebar = isDark ? '#1C1C20' : '#EFECE6';
  const textMain = isDark ? '#EEEAE2' : '#121210';
  const textMuted = isDark ? '#8E8A80' : '#88847C';
  const accentBlue = '#38BDF8';
  const accentPurple = '#A855F7';
  const accentGreen = '#10B981';
  const accentOrange = '#FF5A28';

  // Background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Sidebar
  ctx.fillStyle = sidebar;
  ctx.fillRect(0, 0, 220, canvas.height);

  // Title bar
  ctx.fillStyle = isDark ? '#0F0F11' : '#E5E1D8';
  ctx.fillRect(0, 0, canvas.width, 36);

  // Traffic lights
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.arc(18, 18, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.arc(36, 18, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#10B981';
  ctx.beginPath();
  ctx.arc(54, 18, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = 'bold 13px Geist, sans-serif';
  ctx.fillStyle = textMuted;
  ctx.fillText('CodeForensics — apps/api/src/intelligence/archaeologyEngine.ts', 240, 22);

  // Sidebar tree
  ctx.font = '12px Geist, sans-serif';
  ctx.fillStyle = textMuted;
  ctx.fillText('EXPLORER: CODEFORENSICS', 16, 60);

  const files = [
    '▾ apps/api',
    '  ▸ src/routes',
    '  ▾ src/intelligence',
    '    • archaeologyEngine.ts',
    '    • relationshipEngine.ts',
    '    • contributorScore.ts',
    '▾ packages/shared',
    '  • schemas.ts',
    '• vitest.config.ts'
  ];
  let fileY = 86;
  files.forEach((f) => {
    ctx.fillStyle = f.includes('archaeology') ? accentOrange : textMuted;
    ctx.fillText(f, 16, fileY);
    fileY += 22;
  });

  // Code editor lines
  const codeLines = [
    { num: '01', text: '// CodeForensics AST Archaeology & Symbol Extraction', col: textMuted },
    { num: '02', text: 'import * as ts from "typescript";', col: accentPurple },
    { num: '03', text: 'import { EvidenceType, ConfidenceRating } from "@shared/types";', col: accentPurple },
    { num: '04', text: '', col: textMain },
    { num: '05', text: 'export class ArchaeologyEngine {', col: accentBlue },
    { num: '06', text: '  private readonly sourceFile: ts.SourceFile;', col: textMain },
    { num: '07', text: '  private readonly MAX_SAFE_CAP = 1024 * 1024; // 1 MB cap', col: textMuted },
    { num: '08', text: '', col: textMain },
    { num: '09', text: '  public extractDeterministicLineage(astNode: ts.Node): EvidenceGraph {', col: accentOrange },
    { num: '10', text: '    const claims = new Map<string, EvidenceType>();', col: textMain },
    { num: '11', text: '    claims.set("AST_SYMBOL", EvidenceType.FACT);', col: accentGreen },
    { num: '12', text: '    claims.set("PRECEDENT_LINK", EvidenceType.INFERENCE);', col: accentBlue },
    { num: '13', text: '    return this.buildConfidenceTree(claims, { calibrated: true });', col: textMain },
    { num: '14', text: '  }', col: textMain },
    { num: '15', text: '}', col: accentBlue },
    { num: '16', text: '// Verified: 25 Vitest Test Suites Passing (100% Type Safe)', col: accentGreen }
  ];

  let codeY = 64;
  ctx.font = '13.5px "Geist Mono", monospace';
  codeLines.forEach((cl) => {
    ctx.fillStyle = textMuted;
    ctx.fillText(cl.num, 240, codeY);
    ctx.fillStyle = cl.col;
    ctx.fillText(cl.text, 275, codeY);
    codeY += 26;
  });

  // Status bar
  ctx.fillStyle = isDark ? '#0C0D0F' : '#E0DBD2';
  ctx.fillRect(0, canvas.height - 28, canvas.width, 28);
  ctx.fillStyle = textMuted;
  ctx.font = '12px "Geist Mono", monospace';
  ctx.fillText('TypeScript 5.7  |  Fastify 5  |  Prisma 6  |  25 Vitest Suites: PASS', 20, canvas.height - 10);
  ctx.fillStyle = accentOrange;
  ctx.fillText('● LIVE WORKSPACE', canvas.width - 150, canvas.height - 10);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export function createTerminalScreenTexture(isDark: boolean): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = isDark ? '#0A0A0C' : '#141416';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Terminal header
  ctx.fillStyle = isDark ? '#16161A' : '#1F1F24';
  ctx.fillRect(0, 0, canvas.width, 36);

  ctx.font = 'bold 12px "Geist Mono", monospace';
  ctx.fillStyle = '#FF5A28';
  ctx.fillText('DPI ENGINE v2.0 — MULTI-PROCESS PCAP INSPECTOR', 16, 23);

  const lines = [
    { text: '$ python -m src.dpi_mt capture.pcap --block-app YouTube', col: '#EEEAE2' },
    { text: '==================================================', col: '#44444A' },
    { text: '  DPI ENGINE v2.0 (Zero External Libraries)', col: '#FF5A28' },
    { text: '  Workers: 2  |  Endianness: Native (0xA1B2C3D4)', col: '#A855F7' },
    { text: '==================================================', col: '#44444A' },
    { text: '[Reader] Opened PCAP: snaplen=65535, Ethernet (1)', col: '#9CA3AF' },
    { text: '[Reader] Streamed 77 packets across workers', col: '#9CA3AF' },
    { text: ' ', col: '#000' },
    { text: '[Rules] Active Policy: Drop YouTube TLS SNI', col: '#F59E0B' },
    { text: '  -> 192.168.1.100 -> YouTube ClientHello [DROPPED]', col: '#EF4444' },
    { text: '  -> github.com -> GitHub [FORWARDED]', col: '#10B981' },
    { text: '  -> discord.com -> Discord [FORWARDED]', col: '#10B981' },
    { text: '  -> cloudflare.com -> Cloudflare [FORWARDED]', col: '#10B981' },
    { text: ' ', col: '#000' },
    { text: 'STATISTICS:', col: '#38BDF8' },
    { text: '  • Total Packets: 77 | Forwarded: 76 | Dropped: 1', col: '#EEEAE2' },
    { text: '  • Worker 0: 38 pkts | Worker 1: 39 pkts', col: '#EEEAE2' },
    { text: '  • Community: 26 GitHub Stars (Organic)', col: '#FBBF24' },
    { text: ' ', col: '#000' },
    { text: '$ dpi-engine --listen eth0 --filter tls.sni', col: '#10B981' },
    { text: '● Sniffing packets live on interface eth0...', col: '#10B981' }
  ];

  let y = 64;
  ctx.font = '12px "Geist Mono", monospace';
  lines.forEach((l) => {
    ctx.fillStyle = l.col;
    ctx.fillText(l.text, 16, y);
    y += 24;
  });

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export function createWhiteboardTexture(isDark: boolean): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d')!;

  // Whiteboard background
  ctx.fillStyle = isDark ? '#202025' : '#FBF9F4';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle grid
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Heading written in marker (DSA & Network Protocols)
  ctx.font = 'bold 22px Geist, sans-serif';
  ctx.fillStyle = isDark ? '#FF754A' : '#FF4D1C';
  ctx.fillText('DSA, NETWORK PROTOCOLS & SECURITY TOOLS', 40, 50);

  // Diagram 1: DPI Packet Parsing Flow
  ctx.font = 'bold 15px "Geist Mono", monospace';
  ctx.fillStyle = isDark ? '#38BDF8' : '#0284C7';
  ctx.fillText('01. PACKET FILTERING & TLS SNI (DPI Engine v2.0 — 26★)', 40, 95);

  const drawBox = (x: number, y: number, w: number, h: number, text: string, strokeCol: string, bgCol: string) => {
    ctx.fillStyle = bgCol;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = strokeCol;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
    ctx.font = 'bold 12px "Geist Mono", monospace';
    ctx.fillStyle = isDark ? '#EEEAE2' : '#121210';
    ctx.textAlign = 'center';
    ctx.fillText(text, x + w / 2, y + h / 2 + 4);
    ctx.textAlign = 'left';
  };

  const drawArrow = (x1: number, y1: number, x2: number, y2: number) => {
    ctx.strokeStyle = isDark ? '#A1A1AA' : '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    // arrowhead
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 6, y2 - 4);
    ctx.lineTo(x2 - 6, y2 + 4);
    ctx.closePath();
    ctx.fillStyle = isDark ? '#A1A1AA' : '#666';
    ctx.fill();
  };

  const boxBg = isDark ? '#2A2A32' : '#EAE6DD';
  drawBox(40, 115, 120, 44, 'PCAP Binary', '#38BDF8', boxBg);
  drawArrow(160, 137, 195, 137);
  drawBox(200, 115, 135, 44, 'struct.unpack', '#A855F7', boxBg);
  drawArrow(335, 137, 370, 137);
  drawBox(375, 115, 140, 44, 'TLS ClientHello', '#FF5A28', boxBg);
  drawArrow(515, 137, 550, 137);
  drawBox(555, 115, 140, 44, 'SNI Extractor', '#10B981', boxBg);

  // Diagram 2: LeetCode DSA Patterns
  ctx.font = 'bold 15px "Geist Mono", monospace';
  ctx.fillStyle = isDark ? '#10B981' : '#059669';
  ctx.fillText('02. ALGORITHMIC PROBLEM SOLVING (LeetCode 157 Solved)', 40, 205);

  drawBox(40, 225, 140, 44, 'Hash Maps & Sets', '#10B981', boxBg);
  drawArrow(180, 247, 215, 247);
  drawBox(220, 225, 140, 44, 'Two Pointers / Slid', '#38BDF8', boxBg);
  drawArrow(360, 247, 395, 247);
  drawBox(400, 225, 150, 44, 'Trees & Graphs BFS', '#A855F7', boxBg);

  // Sticky notes on the right side
  // Sticky 1: LeetCode
  ctx.fillStyle = isDark ? '#3D3522' : '#FEF3C7';
  ctx.fillRect(740, 50, 240, 150);
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(740, 50, 240, 150);

  ctx.font = 'bold 13px Geist, sans-serif';
  ctx.fillStyle = isDark ? '#FCD34D' : '#92400E';
  ctx.fillText('LEETCODE MILESTONE', 755, 80);
  ctx.font = '12px "Geist Mono", monospace';
  ctx.fillStyle = isDark ? '#FDE68A' : '#78350F';
  ctx.fillText('• 157 Total Problems Solved', 755, 105);
  ctx.fillText('  - Easy: 97', 755, 125);
  ctx.fillText('  - Medium: 55', 755, 145);
  ctx.fillText('  - Hard: 5', 755, 165);
  ctx.fillText('• Ranking: #1,143,314', 755, 185);

  // Sticky 2: GitHub & BITS
  ctx.fillStyle = isDark ? '#1C312C' : '#D1FAE5';
  ctx.fillRect(740, 230, 240, 140);
  ctx.strokeStyle = '#10B981';
  ctx.strokeRect(740, 230, 240, 140);

  ctx.font = 'bold 13px Geist, sans-serif';
  ctx.fillStyle = isDark ? '#6EE7B7' : '#065F46';
  ctx.fillText('GITHUB & ACADEMICS', 755, 260);
  ctx.font = '12px "Geist Mono", monospace';
  ctx.fillStyle = isDark ? '#A7F3D0' : '#064E3B';
  ctx.fillText('• 1,000+ Contributions / 12 mo', 755, 285);
  ctx.fillText('• 143 Active Days', 755, 305);
  ctx.fillText('• BITS Pilani (2025–2029)', 755, 325);
  ctx.fillText('• DPI Engine: 26 GitHub Stars', 755, 345);

  // Bottom quote
  ctx.font = 'italic 16px "Instrument Serif", Georgia, serif';
  ctx.fillStyle = isDark ? '#D4D0C5' : '#4A463F';
  ctx.fillText('"Take systems apart until you can trace their failure modes from scratch."', 40, 320);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export function createWindowBackdropTexture(isDark: boolean): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  if (isDark) {
    // Night sky gradient with luminous cyber-city backdrop
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#0F172A');
    grad.addColorStop(0.5, '#1E293B');
    grad.addColorStop(1, '#334155');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Glowing Moon
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(380, 80, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.arc(370, 75, 28, 0, Math.PI * 2);
    ctx.fill();

    // Stars
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    const stars = [
      [60, 40], [120, 80], [180, 30], [240, 95], [300, 50],
      [80, 160], [140, 200], [210, 140], [440, 120], [470, 60]
    ];
    stars.forEach(([sx, sy]) => {
      ctx.beginPath();
      ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
      ctx.fill();
    });

    // Glowing skyline
    const bldgs = [
      [20, 220, 50, 200], [80, 180, 60, 240], [150, 250, 45, 170],
      [210, 200, 70, 220], [290, 240, 55, 180], [360, 170, 65, 250],
      [440, 220, 55, 200]
    ];
    bldgs.forEach(([bx, by, bw, bh]) => {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(bx, by, bw, bh);
      // Windows
      ctx.fillStyle = 'rgba(255, 230, 150, 0.65)';
      for (let wx = bx + 8; wx < bx + bw - 8; wx += 14) {
        for (let wy = by + 12; wy < by + bh - 20; wy += 20) {
          if ((wx + wy) % 4 !== 0) {
            ctx.fillRect(wx, wy, 4, 6);
          }
        }
      }
    });
  } else {
    // Warm daytime sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#7DD3FC');
    grad.addColorStop(0.55, '#BAE6FD');
    grad.addColorStop(0.85, '#E0F2FE');
    grad.addColorStop(1, '#FFFBEB');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Warm Sun
    const sunGrad = ctx.createRadialGradient(380, 90, 10, 380, 90, 80);
    sunGrad.addColorStop(0, '#FFFBEB');
    sunGrad.addColorStop(0.3, '#FEF08A');
    sunGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(280, 0, 220, 200);

    // Soft clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.arc(100, 140, 38, 0, Math.PI * 2);
    ctx.arc(140, 130, 45, 0, Math.PI * 2);
    ctx.arc(180, 140, 35, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
