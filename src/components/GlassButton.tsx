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

/* ─── ANIMATION TIMING ──────────────────────────────────────── */
const FADE_DURATION = 0.8;
const EASE_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ─── PUBLIC HANDLE ─────────────────────────────────────────── */
export interface GlassButtonHandle {
  startAnimation: () => Promise<void>;
}

const GlassButton = forwardRef<GlassButtonHandle>(
  function GlassButton(_, ref) {
    const controls = useAnimationControls();
    const hasAnimated = useRef(false);

    const [reducedMotion, setReducedMotion] = useState(false);
    useEffect(() => {
      setReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    }, []);

    const startAnimation = useCallback(async () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      await controls.start({
        opacity: 1,
        transition: { duration: FADE_DURATION, ease: EASE_SOFT },
      });
    }, [controls, reducedMotion]);

    useImperativeHandle(ref, () => ({ startAnimation }), [startAnimation]);

    return (
      <motion.div
        className="relative z-30"
        initial={{ opacity: 0 }}
        animate={controls}
      >
        <a
          href="#"
          className="block transition-transform duration-300 ease-soft
            hover:scale-[1.04] active:scale-[0.98] cursor-pointer"
        >
          <img
            src="/button.svg"
            alt="manage your contacts with friendy - signup to end waitlist"
            className="h-auto w-[clamp(190px,42vw,645px)]"
            draggable={false}
          />
        </a>
      </motion.div>
    );
  }
);

export default GlassButton;
