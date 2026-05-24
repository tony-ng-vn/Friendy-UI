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

const FADE_DURATION = 0.8;
const EASE_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export interface GlassButtonHandle {
  startAnimation: () => Promise<void>;
}

type GlassButtonProps = {
  onClick?: () => void;
};

const GlassButton = forwardRef<GlassButtonHandle, GlassButtonProps>(
  function GlassButton({ onClick }, ref) {
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
        <button
          type="button"
          onClick={onClick}
          className="min-h-[44px] min-w-[min(100%,280px)] cursor-pointer rounded-xl bg-[#D9814B]/80 px-8 py-3.5 font-serif text-base font-medium tracking-wide text-[#4d4034] shadow-[0_4px_24px_rgba(217,152,75,0.25)] transition-transform duration-300 ease-soft hover:scale-[1.04] hover:bg-[#D9814B]/90 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9984b] sm:min-w-[320px] sm:px-10 sm:text-lg"
        >
          Join waitlist
        </button>
      </motion.div>
    );
  }
);

export default GlassButton;
