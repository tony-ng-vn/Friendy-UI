"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const DESKTOP_WIDTH = 260;
const MOBILE_WIDTH = 160;
const WANDER_DELAY_MS = 1000;

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface WanderingCharacterProps {
  visible: boolean;
  avoidRect: Rect | null;
}

function getCharacterWidth(): number {
  if (typeof window === "undefined") return DESKTOP_WIDTH;
  return window.innerWidth < 768 ? MOBILE_WIDTH : DESKTOP_WIDTH;
}

function rectsOverlap(a: Rect, b: Rect, padding: number): boolean {
  return !(
    a.right + padding < b.left ||
    a.left - padding > b.right ||
    a.bottom + padding < b.top ||
    a.top - padding > b.bottom
  );
}

function pickWanderTarget(
  vw: number,
  vh: number,
  size: number,
  avoid: Rect | null
): { x: number; y: number } {
  const margin = 16;
  const maxY = vh * 0.7;
  const padding = 24;

  const fallback = {
    x: Math.max(margin, vw - size - margin - 40),
    y: Math.max(margin, maxY * 0.25),
  };

  for (let i = 0; i < 48; i++) {
    const x = margin + Math.random() * Math.max(0, vw - size - margin * 2);
    const y = margin + Math.random() * Math.max(0, maxY - size - margin);

    const candidate: Rect = {
      left: x,
      top: y,
      right: x + size,
      bottom: y + size,
    };

    if (avoid && rectsOverlap(candidate, avoid, padding)) {
      continue;
    }
    return { x, y };
  }

  return fallback;
}

export default function WanderingCharacter({
  visible,
  avoidRect,
}: WanderingCharacterProps) {
  const reducedMotion = useReducedMotion();
  const [size, setSize] = useState(DESKTOP_WIDTH);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [wanderEnabled, setWanderEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const avoidRef = useRef(avoidRect);
  avoidRef.current = avoidRect;

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateSize = useCallback(() => {
    setSize(getCharacterWidth());
  }, []);

  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [updateSize]);

  useEffect(() => {
    if (!visible) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const charW = getCharacterWidth();
    const initial = pickWanderTarget(vw, vh, charW, avoidRef.current);
    setPosition(initial);
  }, [visible]);

  useEffect(() => {
    if (!visible || reducedMotion) return;

    const t = window.setTimeout(() => setWanderEnabled(true), WANDER_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [visible, reducedMotion]);

  useEffect(() => {
    if (!wanderEnabled || reducedMotion) return;

    let cancelled = false;
    let timeoutId: number;

    const step = () => {
      if (cancelled) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const charW = getCharacterWidth();
      const next = pickWanderTarget(vw, vh, charW, avoidRef.current);
      setPosition(next);
      const duration = 9000 + Math.random() * 6000;
      timeoutId = window.setTimeout(step, duration);
    };

    timeoutId = window.setTimeout(step, 8000);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [wanderEnabled, reducedMotion]);

  const x =
    mounted && reducedMotion
      ? (typeof window !== "undefined" ? window.innerWidth / 2 - size / 2 : 0)
      : position.x;
  const y =
    mounted && reducedMotion
      ? (typeof window !== "undefined" ? window.innerHeight * 0.55 - size / 2 : 0)
      : position.y;

  if (!mounted) {
    return null;
  }

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-20"
      initial={{ opacity: 0 }}
      animate={{
        opacity: visible ? 1 : 0,
        x,
        y,
      }}
      transition={{
        opacity: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
        x: {
          duration: reducedMotion ? 0 : 10,
          ease: [0.45, 0, 0.55, 1],
        },
        y: {
          duration: reducedMotion ? 0 : 10,
          ease: [0.45, 0, 0.55, 1],
        },
      }}
      aria-hidden
    >
      <div className={reducedMotion ? undefined : "character-bob"}>
        <Image
          src="/character.jpg"
          alt=""
          width={DESKTOP_WIDTH}
          height={DESKTOP_WIDTH}
          priority
          className="h-auto drop-shadow-character"
          style={{ width: size, height: "auto" }}
          draggable={false}
        />
      </div>
    </motion.div>
  );
}
