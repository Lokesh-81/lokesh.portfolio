'use client';

import { useEffect, useRef } from 'react';

type TrailPoint = { x: number; y: number; life: number; hue: number };

export function ActiveTheoryField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const points: TrailPoint[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let raf = 0;
    let pointer = { x: -1000, y: -1000 };
    let previous = { x: -1000, y: -1000 };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      const dx = pointer.x - previous.x;
      const dy = pointer.y - previous.y;
      if (Math.hypot(dx, dy) > 3) {
        points.push({ x: pointer.x, y: pointer.y, life: 1, hue: 275 + Math.sin(frame * .012) * 28 });
        previous = { ...pointer };
      }
    };
    const draw = () => {
      frame++;
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';
      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        p.life -= reduced ? .04 : .012;
        p.x += Math.sin(frame * .018 + i) * .28;
        p.y += Math.cos(frame * .014 + i) * .22;
        if (p.life <= 0) { points.splice(i, 1); continue; }
        const radius = 22 * p.life;
        const glow = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        glow.addColorStop(0, `hsla(${p.hue}, 95%, 78%, ${p.life * .26})`);
        glow.addColorStop(1, `hsla(${p.hue}, 95%, 60%, 0)`);
        context.fillStyle = glow;
        context.beginPath();
        context.arc(p.x, p.y, radius, 0, Math.PI * 2);
        context.fill();
      }
      if (points.length > 1) {
        context.lineWidth = 1.1;
        for (let i = 1; i < points.length; i++) {
          const a = points[i - 1], b = points[i];
          const alpha = Math.min(a.life, b.life) * .22;
          context.strokeStyle = `rgba(205, 164, 255, ${alpha})`;
          context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke();
        }
      }
      context.globalCompositeOperation = 'source-over';
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
    };
  }, []);

  return <canvas ref={canvasRef} className="active-theory-field" aria-hidden="true" />;
}
