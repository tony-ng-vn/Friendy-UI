"use client";

import { useRef, useCallback } from "react";
import RoseCurve from "./RoseCurve";
import Headline from "./Headline";
import type { HeadlineHandle } from "./Headline";
import GlassButton from "./GlassButton";
import type { GlassButtonHandle } from "./GlassButton";

export default function Hero() {
  const headlineRef = useRef<HeadlineHandle>(null);
  const buttonRef = useRef<GlassButtonHandle>(null);
  const startedRef = useRef(false);

  const handleFirstDraw = useCallback(async () => {
    if (startedRef.current) return;
    startedRef.current = true;

    await headlineRef.current?.start();
    await buttonRef.current?.startAnimation();
  }, []);

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-bg px-4">
      <RoseCurve onFirstDrawComplete={handleFirstDraw} />
      <Headline ref={headlineRef} />
      <GlassButton ref={buttonRef} />
    </section>
  );
}
