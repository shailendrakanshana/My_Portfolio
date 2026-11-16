import { useEffect, useRef } from 'react';

// fig. 01 — the cursor is a query vector; scattered keys from my work compete for its attention.
// A softmax over distance decides which keys light up, drawn as weighted links.
const KEYS = [
  'agent', 'mcp', 'tools/call', 'rag', 'citations', 'llm', 'prompt', 'retrieval', 'celery', 'queue',
  'django', 'drf', 'node.js', '.net', 'next.js', 'postgres', 'azure sql', 'redis', 'elasticsearch', 'oauth2',
  'jwt', 'docker', 'k8s', 'ci/cd', 'websocket', 'gpt-3', 'schema', 'latency', 'scout', 'verify',
];

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

type Dot = { x: number; y: number; key?: string };

export default function AttentionField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, dpr = 1, dots: Dot[] = [], anchors: Dot[] = [];
    let raf = 0, running = false, visible = true;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, last: -1e9 };

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = w < 700 ? 22 : 28;
      dots = [];
      for (let y = gap / 2; y < h; y += gap) for (let x = gap / 2; x < w; x += gap) dots.push({ x, y });
      const r = rng(7);
      anchors = [];
      const want = w < 700 ? 9 : 22;
      let tries = 0;
      while (anchors.length < want && tries++ < 4000) {
        const d = dots[Math.floor(r() * dots.length)];
        // keep keys off the headline area on the left-bottom & spread apart
        if (d.y > h * 0.86 || d.y < 130) continue;
        // keep labels clear of the name / intro block (bottom-left on desktop, bottom half on mobile)
        if (w >= 900 && d.x < w * 0.66 && d.y > h * 0.26) continue;
        if (w >= 900 && d.y > h * 0.66) continue;
        if (w < 900 && d.y > h * 0.42) continue;
        if (anchors.some((a) => Math.hypot(a.x - d.x, a.y - d.y) < (w < 700 ? 70 : 110))) continue;
        d.key = KEYS[anchors.length % KEYS.length];
        anchors.push(d);
      }
      pointer.x = pointer.tx = w * 0.68; pointer.y = pointer.ty = h * (w < 900 ? 0.27 : 0.38);
    };

    const draw = (t: number) => {
      const idle = t - pointer.last > 2600;
      if (idle) {
        const small = w < 900;
        pointer.tx = w * (small ? 0.5 + 0.32 * Math.sin(t * 0.00021) : 0.62 + 0.24 * Math.sin(t * 0.00021));
        pointer.ty = h * (small ? 0.27 + 0.07 * Math.sin(t * 0.00029 + 1.3) : 0.4 + 0.2 * Math.sin(t * 0.00029 + 1.3));
      }
      const ease = idle ? 0.03 : 0.14;
      pointer.x += (pointer.tx - pointer.x) * ease;
      pointer.y += (pointer.ty - pointer.y) * ease;
      const px = pointer.x, py = pointer.y;

      ctx.clearRect(0, 0, w, h);
      const R = Math.min(260, w * 0.3);
      for (const d of dots) {
        const dx = d.x - px, dy = d.y - py;
        const dist = Math.hypot(dx, dy) || 1;
        const f = Math.max(0, 1 - dist / R);
        const wave = 0.5 + 0.5 * Math.sin(d.x * 0.011 + d.y * 0.007 - t * 0.0011);
        const a = 0.07 + wave * 0.07 + f * f * 0.55;
        const push = f * f * 10;
        const x = d.x + (dx / dist) * push, y = d.y + (dy / dist) * push;
        const s = 1.1 + f * 1.4;
        ctx.fillStyle = f > 0.55 ? `rgba(255,140,90,${a})` : `rgba(237,234,227,${a})`;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }

      // attention: softmax over negative distance for the k nearest keys
      const scored = anchors
        .map((a) => ({ a, d: Math.hypot(a.x - px, a.y - py) }))
        .sort((p, q) => p.d - q.d)
        .slice(0, 5);
      const temp = 90;
      const ex = scored.map((s) => Math.exp(-s.d / temp));
      const sum = ex.reduce((p, q) => p + q, 0) || 1;
      const weights = ex.map((e) => e / sum);

      ctx.font = '11px "JetBrains Mono Variable", ui-monospace, monospace';
      ctx.textBaseline = 'middle';
      // keys (all, faint)
      for (const a of anchors) {
        ctx.fillStyle = 'rgba(237,234,227,0.16)';
        ctx.fillText(a.key!, a.x + 8, a.y);
        ctx.fillRect(a.x - 1.5, a.y - 1.5, 3, 3);
      }
      scored.forEach((s, i) => {
        const wgt = weights[i];
        if (s.d > 520) return;
        const al = Math.min(1, 0.12 + wgt * 1.6);
        const mx = (px + s.a.x) / 2, my = (py + s.a.y) / 2 - 30;
        ctx.strokeStyle = `rgba(255,107,53,${al * 0.75})`;
        ctx.lineWidth = 0.6 + wgt * 2.2;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.quadraticCurveTo(mx, my, s.a.x, s.a.y);
        ctx.stroke();
        ctx.fillStyle = `rgba(237,234,227,${0.35 + al * 0.65})`;
        ctx.fillText(s.a.key!, s.a.x + 8, s.a.y);
        ctx.fillStyle = `rgba(255,107,53,${al})`;
        ctx.fillRect(s.a.x - 2.5, s.a.y - 2.5, 5, 5);
        if (wgt > 0.08) {
          ctx.fillStyle = `rgba(185,181,172,${al})`;
          ctx.fillText(wgt.toFixed(2), (px + mx + s.a.x) / 3, (py + my + s.a.y) / 3 - 8);
        }
      });
      // the query
      ctx.strokeStyle = 'rgba(255,107,53,0.9)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(px, py, 9 + Math.sin(t * 0.004) * 1.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#ff6b35';
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,107,53,0.85)';
      ctx.fillText('q', px + 14, py - 12);
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      pointer.tx = e.clientX - r.left;
      pointer.ty = e.clientY - r.top;
      pointer.last = performance.now();
    };
    const onResize = () => {
      build();
      if (reduce || !running) draw(performance.now());
    };

    build();
    draw(0);
    start();

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      visible ? start() : stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      stop();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" />;
}
