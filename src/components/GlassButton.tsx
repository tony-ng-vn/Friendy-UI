"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
} from "react";
import { motion, useAnimationControls } from "framer-motion";

const FADE_DURATION = 1.1;
const EASE_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export interface GlassButtonHandle {
  startAnimation: () => Promise<void>;
}

interface GlassButtonProps {
  onJoinClick: () => void;
}

const GlassButton = forwardRef<GlassButtonHandle, GlassButtonProps>(
  function GlassButton({ onJoinClick }, ref) {
    const controls = useAnimationControls();
    const hasAnimated = useRef(false);

    const startAnimation = useCallback(async () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      await controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: FADE_DURATION, ease: EASE_SOFT },
      });
    }, [controls]);

    useImperativeHandle(ref, () => ({ startAnimation }), [startAnimation]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={controls}
      >
        <button
          type="button"
          onClick={onJoinClick}
          className="min-h-[44px] cursor-pointer rounded-full border border-[var(--color-glass-border)] bg-[var(--color-glass-bg)] px-6 py-2.5 text-base font-medium text-text shadow-glass backdrop-blur-md transition-[transform,background-color,box-shadow] duration-200 hover:bg-white/65 hover:shadow-[0_10px_36px_var(--color-glass-shadow)] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Join waitlist
        </button>
      </motion.div>
    );
  }
);

export default GlassButton;
