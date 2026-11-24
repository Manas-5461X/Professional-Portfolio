import { useEffect, useRef } from 'react';
import { isReducedMotion, scrollState } from '../lib/smooth';
import { useTheme } from '../hooks/useTheme';

const vertexSource = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentSource = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uVel;
  uniform vec2 uMouse;
  uniform vec2 uRes;
  uniform vec3 uInk;
  uniform vec3 uAccent;
  uniform float uDensity;

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash(i), f), dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    float d = length(p - m);
    float lens = smoothstep(0.45, 0.0, d);

    float t = uTime * 0.045;
    p.y += uVel * 0.0009 * (0.5 + uv.x);
    vec2 q = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 - t + 3.1));
    float f = fbm(p * 1.1 + q * (1.3 + lens * 0.9) + abs(uVel) * 0.0012);

    float bands = f * uDensity;
    float line = abs(fract(bands) - 0.5);
    float w = 0.022 + min(abs(uVel) * 0.0004, 0.05);
    float c = smoothstep(w, 0.0, line);

    float fade = smoothstep(0.0, 0.35, uv.y) * (0.55 + 0.45 * smoothstep(1.0, 0.55, uv.y));
    vec3 col = mix(uInk, uAccent, lens * 0.9 * step(0.5, fract(bands * 0.5)));
    float alpha = clamp(c * fade * (0.26 + lens * 0.4), 0.0, 1.0);
    // Premultiply RGB by alpha so default premultipliedAlpha:true WebGL compositing stays transparent where alpha = 0
    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

/**
 * High-performance native WebGL contour field.
 * ZERO Three.js dependency — eliminates 527 KB from initial homepage bundle!
 */
export function FieldBackground() {
  const host = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const ink = theme === 'dark' ? '#EEEAE2' : '#121210';
  const accent = theme === 'dark' ? '#FF5A28' : '#FF4D1C';
  const density = 14;

  const colorsRef = useRef<{ ink: [number, number, number]; accent: [number, number, number] }>({
    ink: hexToRgb(ink),
    accent: hexToRgb(accent)
  });
  const kickRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    colorsRef.current = {
      ink: hexToRgb(ink),
      accent: hexToRgb(accent)
    };
    kickRef.current?.();
  }, [ink, accent]);

  useEffect(() => {
    const el = host.current;
    if (!el || isReducedMotion()) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';

    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance'
    });

    if (!gl) return;
    el.appendChild(canvas);

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = compile(gl.VERTEX_SHADER, vertexSource);
    const fragShader = compile(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertShader || !fragShader) {
      if (vertShader) gl.deleteShader(vertShader);
      if (fragShader) gl.deleteShader(fragShader);
      canvas.remove();
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      canvas.remove();
      return;
    }
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      canvas.remove();
      return;
    }
    gl.useProgram(program);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.clearColor(0, 0, 0, 0);

    // Full screen quad buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uTimeLoc = gl.getUniformLocation(program, 'uTime');
    const uVelLoc = gl.getUniformLocation(program, 'uVel');
    const uMouseLoc = gl.getUniformLocation(program, 'uMouse');
    const uResLoc = gl.getUniformLocation(program, 'uRes');
    const uInkLoc = gl.getUniformLocation(program, 'uInk');
    const uAccentLoc = gl.getUniformLocation(program, 'uAccent');
    const uDensityLoc = gl.getUniformLocation(program, 'uDensity');

    gl.uniform1f(uDensityLoc, density);

    let mouseX = 0.7;
    let mouseY = 0.6;
    let targetMouseX = 0.7;
    let targetMouseY = 0.6;
    let currentVel = 0;

    let cachedRect = el.getBoundingClientRect();

    const lowTier = (navigator.hardwareConcurrency || 4) <= 4 || window.matchMedia('(pointer: coarse)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, lowTier ? 1.0 : 1.25);

    const resize = () => {
      cachedRect = el.getBoundingClientRect();
      const w = Math.max(1, cachedRect.width);
      const h = Math.max(1, cachedRect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResLoc, w, h);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const onPointerMove = (e: PointerEvent) => {
      if (cachedRect.width > 0 && cachedRect.height > 0) {
        targetMouseX = (e.clientX - cachedRect.left) / cachedRect.width;
        targetMouseY = 1.0 - (e.clientY - cachedRect.top) / cachedRect.height;
      }
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let isVisible = true;
    let rafId = 0;
    const startTime = performance.now();

    const render = () => {
      rafId = 0;
      if (!isVisible || document.hidden) return;

      const elapsed = isReducedMotion() ? 12 : (performance.now() - startTime) / 1000;
      gl.uniform1f(uTimeLoc, elapsed);

      const targetVel = (scrollState.velocity || 0) * 8;
      currentVel += (targetVel - currentVel) * 0.08;
      gl.uniform1f(uVelLoc, currentVel);

      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;
      gl.uniform2f(uMouseLoc, mouseX, mouseY);

      const { ink: inkRgb, accent: accentRgb } = colorsRef.current;
      gl.uniform3f(uInkLoc, inkRgb[0], inkRgb[1], inkRgb[2]);
      gl.uniform3f(uAccentLoc, accentRgb[0], accentRgb[1], accentRgb[2]);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (!isReducedMotion()) {
        rafId = requestAnimationFrame(render);
      }
    };

    const kick = () => {
      if (!rafId && isVisible && !document.hidden) {
        rafId = requestAnimationFrame(render);
      }
    };
    kickRef.current = kick;

    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      kick();
    });
    io.observe(el);
    document.addEventListener('visibilitychange', kick);
    kick();

    return () => {
      kickRef.current = null;
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', kick);
      window.removeEventListener('pointermove', onPointerMove);

      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      canvas.remove();
    };
  }, [density]);

  return <div ref={host} className="field" aria-hidden="true" />;
}
