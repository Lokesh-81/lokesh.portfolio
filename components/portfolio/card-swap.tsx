'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Project } from '@/lib/data/projects';
import { ProjectCard } from './project-card';

const STEP_X = 25;
const STEP_Y = 19;
const STEP_Z = 42;
const slot = (k: number) => `translate3d(${k * STEP_X}px, ${-k * STEP_Y}px, ${-k * STEP_Z}px) rotate(${k * -1.1}deg)`;

export function CardSwap({ projects }: { projects: Project[] }) {
  const [order, setOrder] = useState(() => projects.map((project) => project.id));
  const elements = useRef<Record<string, HTMLDivElement | null>>({});
  const drag = useRef<{ id: string; x: number; y: number; dx: number; dy: number; started: number } | null>(null);
  const suppressClick = useRef(false);
  const cleanup = useRef<() => void>(() => {});

  useEffect(() => {
    setOrder(projects.map((project) => project.id));
  }, [projects]);

  useEffect(() => () => cleanup.current(), []);

  const settle = () => {
    Object.values(elements.current).forEach((element) => {
      if (element) {
        element.style.transition = '';
        element.style.transform = '';
      }
    });
  };

  const swap = () => {
    settle();
    setOrder((current) => current.length > 1 ? [...current.slice(1), current[0]] : current);
  };

  const startDrag = (event: React.PointerEvent<HTMLDivElement>, id: string, isFront: boolean) => {
    if (!isFront || event.button !== 0 || drag.current) return;
    const element = event.currentTarget;
    drag.current = { id, x: event.clientX, y: event.clientY, dx: 0, dy: 0, started: performance.now() };
    suppressClick.current = false;
    element.style.transition = 'none';
    const mine = (pointer: PointerEvent) => drag.current && pointer.pointerId === event.pointerId;
    const move = (pointer: PointerEvent) => {
      if (!mine(pointer) || !drag.current) return;
      const current = drag.current;
      current.dx = pointer.clientX - current.x;
      current.dy = pointer.clientY - current.y;
      const x = 150 * Math.tanh(current.dx / 150);
      const y = 150 * Math.tanh(current.dy / 150);
      element.style.transform = `translateX(-50%) ${slot(0)} translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(x * .045).toFixed(2)}deg)`;
    };
    const up = (pointer: PointerEvent) => {
      if (!mine(pointer) || !drag.current) return;
      const current = drag.current;
      drag.current = null;
      cleanup.current();
      const distance = Math.hypot(current.dx, current.dy);
      const elapsed = Math.max(1, performance.now() - current.started);
      const quick = distance / elapsed > .6;
      if (pointer.type !== 'pointercancel' && (distance > 70 || (quick && distance > 24))) {
        suppressClick.current = true;
        swap();
      } else {
        settle();
        if (distance > 6) suppressClick.current = true;
      }
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    cleanup.current = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      cleanup.current = () => {};
    };
  };

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    const target = event.target as HTMLElement;
    if (target.closest('a,button')) return;
    swap();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, isFront: boolean) => {
    if (isFront && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      swap();
    }
  };

  const ordered = projects.filter((project) => order.includes(project.id));

  return (
    <div className="projects-swap-wrap">
      <div className="projects-swap-hint"><span>INTERACTIVE PROJECT STACK</span><span>CLICK · DRAG · SWAP</span></div>
      <div className="projects-swap-stage" aria-label="Project cards. Click or drag the front card to cycle through projects.">
        {ordered.map((project) => {
          const position = order.indexOf(project.id);
          const isFront = position === 0;
          return (
            <div
              key={project.id}
              ref={(element) => { elements.current[project.id] = element; }}
              className="projects-swap-card"
              data-front={isFront ? 'true' : undefined}
              style={{ zIndex: projects.length - position, ['--csw-slot' as string]: slot(position) }}
              onPointerDown={(event) => startDrag(event, project.id, isFront)}
              onClick={handleCardClick}
              onKeyDown={(event) => handleKeyDown(event, isFront)}
              role={isFront ? 'button' : undefined}
              tabIndex={isFront ? 0 : -1}
              aria-label={isFront ? `Swap front card: ${project.title || project.name}` : undefined}
            >
              <ProjectCard project={project} disableCardClick />
            </div>
          );
        })}
      </div>
      <div className="projects-swap-footer"><span>FRONT CARD MOVES TO THE BACK</span><span>{String(order.length).padStart(2, '0')} BUILDS</span></div>
    </div>
  );
}
