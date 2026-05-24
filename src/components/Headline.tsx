"use client";

import { forwardRef, useImperativeHandle, useCallback, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";

const FADE_DURATION = 1.1;
const EASE_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export interface HeadlineHandle {
  start: () => void;
}

const Headline = forwardRef<HeadlineHandle>(function Headline(_, ref) {
  const line1 = useAnimationControls();
  const line2 = useAnimationControls();
  const hasStarted = useRef(false);

  const startHeadline = useCallback(async () => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    await Promise.all([
      line1.start({
        opacity: 1,
        y: 0,
        transition: { duration: FADE_DURATION, ease: EASE_SOFT },
      }),
      line2.start({
        opacity: 1,
        y: 0,
        transition: { duration: FADE_DURATION, ease: EASE_SOFT },
      }),
    ]);
  }, [line1, line2]);

  useImperativeHandle(ref, () => ({ start: startHeadline }), [startHeadline]);

  return (
    <header className="flex max-w-[min(90vw,28rem)] flex-col items-center gap-2 text-center">
      <motion.h1
        className="text-xl font-medium tracking-tight text-text"
        initial={{ opacity: 0, y: 8 }}
        animate={line1}
      >
        Don&apos;t lose the connection
      </motion.h1>
      <motion.p
        className="text-md font-normal text-text-muted"
        initial={{ opacity: 0, y: 8 }}
        animate={line2}
      >
        always remember the moment
      </motion.p>
    </header>
  );
});

export default Headline;
