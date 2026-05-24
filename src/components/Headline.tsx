"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import { motion, useAnimationControls } from "framer-motion";

/* ─── TIMING ────────────────────────────────────────────────── */
const FADE_DURATION = 1.2;
const LINE_BEAT = 0.4;
const EASE_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ─── PUBLIC HANDLE ─────────────────────────────────────────── */
export interface HeadlineHandle {
  start: () => void;
}

/* ─── COMPONENT ─────────────────────────────────────────────── */
const Headline = forwardRef<HeadlineHandle>(function Headline(_, ref) {
  const line1 = useAnimationControls();
  const line2 = useAnimationControls();
  const hasStarted = useRef(false);

  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const startHeadline = useCallback(async () => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    if (reducedMotion) {
      line1.start({ opacity: 1, transition: { duration: FADE_DURATION } });
      line2.start({ opacity: 1, transition: { duration: FADE_DURATION } });
      return;
    }

    await line1.start({
      opacity: 1,
      transition: { duration: FADE_DURATION, ease: EASE_SOFT },
    });

    await new Promise((r) => setTimeout(r, LINE_BEAT * 1000));

    await line2.start({
      opacity: 1,
      transition: { duration: FADE_DURATION, ease: EASE_SOFT },
    });
  }, [line1, line2, reducedMotion]);

  useImperativeHandle(ref, () => ({ start: startHeadline }), [startHeadline]);

  return (
    <div
      className="relative z-10 flex flex-col items-center gap-2"
      style={{ mixBlendMode: "color-burn" }}
    >
      <motion.img
        src="/line1.svg"
        alt="Don't lose the connection"
        className="h-auto w-[clamp(240px,70vw,1200px)]"
        initial={{ opacity: 0 }}
        animate={line1}
        draggable={false}
      />
      <motion.img
        src="/line2.svg"
        alt="always remember the moment"
        className="h-auto w-[clamp(260px,75vw,1280px)]"
        initial={{ opacity: 0 }}
        animate={line2}
        draggable={false}
      />
    </div>
  );
});

export default Headline;
