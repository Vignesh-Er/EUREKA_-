'use client';

import { useEffect, useRef } from 'react';

/* ─── Types ─── */
interface Star {
  x: number;
  y: number;
  r: number;
  a: number;          // fixed opacity
  color: string;
}

interface Spacecraft {
  x: number;
  y: number;
  angle: number;      // direction in radians
  speed: number;       // px/s
  size: number;
  glowColor: string;
  born: number;        // timestamp born
  life: number;        // lifetime in ms
}

interface ShootingStar {
  sx: number; sy: number;
  angle: number;
  speed: number;
  len: number;
  w: number;
  color: string;
  elapsed: number;
  life: number;
}

/* ─── Helpers ─── */
function pickStarColor(): string {
  const r = Math.random();
  if (r < 0.65) return '#FFFFFF';
  if (r < 0.78) return '#D8E4FF';
  if (r < 0.88) return '#FFF0DC';
  if (r < 0.95) return '#D4C4FF';
  return '#C0E8FF';
}

function rgba(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/* ─── Component ─── */
export default function CosmicBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    let alive = true;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    /* ── Static stars (fixed opacity, no twinkle) ── */
    const stars: Star[] = [];
    const W = c.width, H = c.height;
    for (let i = 0; i < 800; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.pow(Math.random(), 3) * 1.6 + 0.2,
        a: 0.15 + Math.random() * 0.55,
        color: pickStarColor(),
      });
    }

    /* ── Nebula blobs (static, painted once to offscreen canvas) ── */
    const nebOff = document.createElement('canvas');
    nebOff.width = W; nebOff.height = H;
    const nc = nebOff.getContext('2d')!;
    nc.globalCompositeOperation = 'screen';

    const nebulas = [
      { cx: 0.14, cy: 0.22, r: 0.30, color: [88, 28, 135], a: 0.13 },
      { cx: 0.82, cy: 0.72, r: 0.24, color: [6, 182, 212], a: 0.10 },
      { cx: 0.68, cy: 0.14, r: 0.18, color: [236, 72, 153], a: 0.09 },
      { cx: 0.48, cy: 0.55, r: 0.14, color: [245, 158, 11], a: 0.06 },
      { cx: 0.08, cy: 0.62, r: 0.25, color: [29, 78, 216], a: 0.11 },
    ];

    nebulas.forEach(n => {
      const cx = n.cx * W, cy = n.cy * H, rad = n.r * H;
      // Paint 6 overlapping blobs for a soft organic shape
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const jitter = rad * 0.15;
        const bx = cx + Math.cos(angle) * jitter * (Math.random() * 2 - 1);
        const by = cy + Math.sin(angle) * jitter * (Math.random() * 2 - 1);
        const br = rad * (0.5 + Math.random() * 0.6);
        const g = nc.createRadialGradient(bx, by, 0, bx, by, br);
        const [r, gg, b] = n.color;
        g.addColorStop(0, `rgba(${r},${gg},${b},${n.a})`);
        g.addColorStop(0.5, `rgba(${r},${gg},${b},${n.a * 0.4})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        nc.fillStyle = g;
        nc.beginPath();
        nc.arc(bx, by, br, 0, Math.PI * 2);
        nc.fill();
      }
    });

    /* ── Paint static stars to offscreen canvas too ── */
    const starOff = document.createElement('canvas');
    starOff.width = W; starOff.height = H;
    const sc = starOff.getContext('2d')!;

    stars.forEach(s => {
      sc.globalAlpha = s.a;
      sc.fillStyle = s.color;
      sc.beginPath();
      sc.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      sc.fill();

      // Soft glow for larger stars
      if (s.r > 1.0) {
        const g = sc.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3.5);
        g.addColorStop(0, rgba(s.color, s.a * 0.25));
        g.addColorStop(1, rgba(s.color, 0));
        sc.fillStyle = g;
        sc.beginPath();
        sc.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2);
        sc.fill();
      }
    });
    sc.globalAlpha = 1;

    /* ── Spacecraft pool ── */
    const craft: Spacecraft[] = [];
    const craftColors = ['#A855F7', '#06B6D4', '#EC4899', '#38BDF8', '#818CF8'];

    function spawnCraft() {
      if (reducedMotion || !alive) return;
      if (craft.length >= 3) { scheduleCraft(); return; }

      // Spawn from random edge
      const edge = Math.floor(Math.random() * 4);
      let x = 0, y = 0, angle = 0;
      if (edge === 0) { x = -20; y = Math.random() * c.height; angle = -0.3 + Math.random() * 0.6; }
      else if (edge === 1) { x = c.width + 20; y = Math.random() * c.height; angle = Math.PI - 0.3 + Math.random() * 0.6; }
      else if (edge === 2) { x = Math.random() * c.width; y = -20; angle = Math.PI / 2 - 0.4 + Math.random() * 0.8; }
      else { x = Math.random() * c.width; y = c.height + 20; angle = -Math.PI / 2 - 0.4 + Math.random() * 0.8; }

      craft.push({
        x, y, angle,
        speed: 30 + Math.random() * 50,  // slow: 30-80 px/s
        size: 3 + Math.random() * 4,
        glowColor: craftColors[Math.floor(Math.random() * craftColors.length)],
        born: performance.now(),
        life: 12000 + Math.random() * 18000,  // 12-30s lifetime
      });
      scheduleCraft();
    }

    function scheduleCraft() {
      if (!alive) return;
      setTimeout(spawnCraft, 12000 + Math.random() * 13000); // every 12-25s
    }
    spawnCraft();

    /* ── Shooting stars ── */
    const meteors: ShootingStar[] = [];

    function spawnMeteor() {
      if (reducedMotion || !alive) return;
      if (meteors.length >= 2) { scheduleMeteor(); return; }

      const colors = ['#FFFFFF', '#E0F0FF', '#D4AAFF', '#FFE8AA'];
      meteors.push({
        sx: c.width * (0.15 + Math.random() * 0.85),
        sy: c.height * Math.random() * 0.35,
        angle: Math.PI * (1.05 + Math.random() * 0.35),
        speed: 700 + Math.random() * 500,
        len: 70 + Math.random() * 120,
        w: 1 + Math.random() * 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        elapsed: 0,
        life: 0.7 + Math.random() * 0.6,
      });
      scheduleMeteor();
    }

    function scheduleMeteor() {
      if (!alive) return;
      setTimeout(spawnMeteor, 8000 + Math.random() * 7000); // every 8-15s
    }
    setTimeout(spawnMeteor, 3000); // first one after 3s

    /* ── Render loop ── */
    let raf = 0;
    let last = 0;

    function draw(now: number) {
      if (!last) last = now;
      const dt = (now - last) / 1000;
      last = now;

      ctx.clearRect(0, 0, c.width, c.height);

      // 1) Static nebulas (pre-rendered)
      ctx.drawImage(nebOff, 0, 0);

      // 2) Static stars (pre-rendered)
      ctx.drawImage(starOff, 0, 0);

      // 3) Spacecraft
      ctx.save();
      for (let i = craft.length - 1; i >= 0; i--) {
        const s = craft[i];
        const age = now - s.born;
        if (age > s.life) { craft.splice(i, 1); continue; }

        s.x += Math.cos(s.angle) * s.speed * dt;
        s.y += Math.sin(s.angle) * s.speed * dt;

        // Off-screen check
        if (s.x < -60 || s.x > c.width + 60 || s.y < -60 || s.y > c.height + 60) {
          craft.splice(i, 1); continue;
        }

        // Fade in/out
        const fadeIn = Math.min(1, age / 2000);
        const fadeOut = Math.min(1, (s.life - age) / 2000);
        const alpha = fadeIn * fadeOut * 0.7;

        // Engine trail (thin glowing line behind)
        const trailLen = 18 + s.size * 3;
        const tx = s.x - Math.cos(s.angle) * trailLen;
        const ty = s.y - Math.sin(s.angle) * trailLen;
        const tg = ctx.createLinearGradient(tx, ty, s.x, s.y);
        tg.addColorStop(0, rgba(s.glowColor, 0));
        tg.addColorStop(0.6, rgba(s.glowColor, alpha * 0.3));
        tg.addColorStop(1, rgba(s.glowColor, alpha * 0.7));
        ctx.strokeStyle = tg;
        ctx.lineWidth = s.size * 0.4;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        // Craft body (small diamond/arrow shape)
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.angle);
        ctx.globalAlpha = alpha;

        // Arrow body
        ctx.fillStyle = rgba('#FFFFFF', 0.8);
        ctx.beginPath();
        ctx.moveTo(s.size, 0);                     // nose
        ctx.lineTo(-s.size * 0.6, -s.size * 0.4);  // top wing
        ctx.lineTo(-s.size * 0.3, 0);               // notch
        ctx.lineTo(-s.size * 0.6, s.size * 0.4);   // bottom wing
        ctx.closePath();
        ctx.fill();

        // Engine glow dot
        const eg = ctx.createRadialGradient(-s.size * 0.3, 0, 0, -s.size * 0.3, 0, s.size * 1.5);
        eg.addColorStop(0, rgba(s.glowColor, 0.6));
        eg.addColorStop(0.4, rgba(s.glowColor, 0.15));
        eg.addColorStop(1, rgba(s.glowColor, 0));
        ctx.fillStyle = eg;
        ctx.beginPath();
        ctx.arc(-s.size * 0.3, 0, s.size * 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
      ctx.restore();

      // 4) Shooting stars (rare)
      if (!reducedMotion) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.elapsed += dt;
          const p = m.elapsed / m.life;
          if (p >= 1) { meteors.splice(i, 1); continue; }

          const hx = m.sx + Math.cos(m.angle) * m.speed * m.elapsed;
          const hy = m.sy + Math.sin(m.angle) * m.speed * m.elapsed;
          const tx = hx - Math.cos(m.angle) * m.len * p;
          const ty = hy - Math.sin(m.angle) * m.len * p;

          let a = 0;
          if (p < 0.1) a = p / 0.1;
          else if (p < 0.65) a = 1;
          else a = (1 - p) / 0.35;

          // Streak
          const nx = Math.cos(m.angle + Math.PI / 2);
          const ny = Math.sin(m.angle + Math.PI / 2);
          const hw = m.w * 0.5;

          const lg = ctx.createLinearGradient(tx, ty, hx, hy);
          lg.addColorStop(0, 'rgba(255,255,255,0)');
          lg.addColorStop(0.5, rgba(m.color, 0.15));
          lg.addColorStop(0.85, rgba(m.color, 0.55));
          lg.addColorStop(1, rgba(m.color, a));

          ctx.fillStyle = lg;
          ctx.beginPath();
          ctx.moveTo(hx + nx * hw, hy + ny * hw);
          ctx.lineTo(hx - nx * hw, hy - ny * hw);
          ctx.lineTo(tx, ty);
          ctx.closePath();
          ctx.fill();

          // Head glow
          const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, m.w * 6);
          hg.addColorStop(0, rgba(m.color, a * 0.4));
          hg.addColorStop(0.4, rgba(m.color, a * 0.1));
          hg.addColorStop(1, rgba(m.color, 0));
          ctx.fillStyle = hg;
          ctx.beginPath();
          ctx.arc(hx, hy, m.w * 6, 0, Math.PI * 2);
          ctx.fill();

          // Core
          ctx.fillStyle = `rgba(255,255,255,${a})`;
          ctx.beginPath();
          ctx.arc(hx, hy, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      id="cosmicCanvas"
      ref={ref}
      aria-hidden
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
