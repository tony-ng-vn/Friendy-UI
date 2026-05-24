"use client";

import { useRef, useEffect } from "react";

/* ─── TIMING (seconds) ──────────────────────────────────────── */
const TIMING = {
  firstDraw: 3.5,
  draw: 12,
  hold: 3,
  erase: 10,
  swapGap: 0.8,
};

const EASE = "cubic-bezier(0.45, 0, 0.55, 1)";

/* ─── LISSAJOUS DRIFT ───────────────────────────────────────── */
// x = sin(a·t), y = sin(b·t)
// Different sine frequencies on x and y make the path cross itself,
// producing a woven oscilloscope trace feel.
const SHAPE = { a: 3, b: 2 };

/* ─── MATH ──────────────────────────────────────────────────── */

/**
 * Lissajous curve: x = sin(a·t), y = sin(b·t)
 * Closes at t = 2π when a and b are integers.
 * Adding a small phase delta on y creates the "drift" —
 * the crossings don't perfectly align, giving organic flow.
 */
function buildLissajous(a: number, b: number, delta: number = Math.PI / 4): string {
  const thetaMax = 2 * Math.PI;
  const steps = 800;
  const parts: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * thetaMax;
    const x = Math.sin(a * t + delta);
    const y = Math.sin(b * t);
    parts.push(`${i === 0 ? "M" : "L"}${x.toFixed(4)},${y.toFixed(4)}`);
  }

  return parts.join(" ");
}

/* ─── COMPONENT ─────────────────────────────────────────────── */

interface RoseCurveProps {
  onFirstDrawComplete?: () => void;
}

export default function RoseCurve({ onFirstDrawComplete }: RoseCurveProps) {
  const ghostRef = useRef<SVGPathElement>(null);
  const tracerRef = useRef<SVGPathElement>(null);

  const timersRef = useRef<number[]>([]);
  const calledFirstRef = useRef(false);
  const onFirstDrawRef = useRef(onFirstDrawComplete);
  onFirstDrawRef.current = onFirstDrawComplete;

  useEffect(() => {
    const ghost = ghostRef.current;
    const tracer = tracerRef.current;
    if (!ghost || !tracer) return;

    function later(fn: () => void, ms: number) {
      timersRef.current.push(window.setTimeout(fn, ms));
    }

    const { a, b } = SHAPE;
    const pathD = buildLissajous(a, b);

    ghost.setAttribute("d", pathD);
    tracer.setAttribute("d", pathD);

    /* ── Reduced motion ── */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ghost.style.opacity = "1";
      tracer.style.strokeDasharray = "none";
      tracer.style.strokeDashoffset = "0";
      if (!calledFirstRef.current) {
        calledFirstRef.current = true;
        onFirstDrawRef.current?.();
      }
      return;
    }

    ghost.style.transition = "opacity 2s ease";
    ghost.style.opacity = "1";

    const len = tracer.getTotalLength();

    /* ── Infinite loop: draw → hold → erase (same shape) ── */
    function runCycle(isFirst: boolean) {
      const drawDur = isFirst ? TIMING.firstDraw : TIMING.draw;

      tracer!.style.transition = "none";
      tracer!.style.strokeDasharray = String(len);
      tracer!.style.strokeDashoffset = String(len);
      tracer!.getBoundingClientRect();

      tracer!.style.transition = `stroke-dashoffset ${drawDur}s ${EASE}`;
      tracer!.style.strokeDashoffset = "0";

      if (isFirst && !calledFirstRef.current) {
        later(() => {
          calledFirstRef.current = true;
          onFirstDrawRef.current?.();
        }, drawDur * 1000);
      }

      later(() => {
        tracer!.style.transition = `stroke-dashoffset ${TIMING.erase}s ${EASE}`;
        tracer!.style.strokeDashoffset = String(len);
      }, (drawDur + TIMING.hold) * 1000);

      later(
        () => runCycle(false),
        (drawDur + TIMING.hold + TIMING.erase + TIMING.swapGap) * 1000
      );
    }

    runCycle(true);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  return (
    <svg
      className="fixed inset-0 z-0 h-screen w-screen"
      viewBox="-0.75 -0.75 1.5 1.5"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity: 0.7 }}
    >
      <path
        ref={ghostRef}
        stroke="var(--color-ghost)"
        strokeWidth="0.175"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0"
      />
      <path
        ref={tracerRef}
        className="tracer"
        stroke="var(--color-curve)"
        strokeWidth="0.175"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
