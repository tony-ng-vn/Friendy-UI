"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import RoseCurve from "./RoseCurve";
import Headline from "./Headline";
import type { HeadlineHandle } from "./Headline";
import GlassButton from "./GlassButton";
import type { GlassButtonHandle } from "./GlassButton";
import WanderingCharacter from "./WanderingCharacter";
import WaitlistModal from "./WaitlistModal";

interface AvoidRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export default function Hero() {
  const headlineRef = useRef<HeadlineHandle>(null);
  const buttonRef = useRef<GlassButtonHandle>(null);
  const safeZoneRef = useRef<HTMLDivElement>(null);

  const [introVisible, setIntroVisible] = useState(false);
  const [avoidRect, setAvoidRect] = useState<AvoidRect | null>(null);
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const updateAvoidRect = useCallback(() => {
    const el = safeZoneRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setAvoidRect({
      left: r.left,
      top: r.top,
      right: r.right,
      bottom: r.bottom,
    });
  }, []);

  useEffect(() => {
    updateAvoidRect();
    const el = safeZoneRef.current;
    if (!el) return;

    const observer = new ResizeObserver(updateAvoidRect);
    observer.observe(el);
    window.addEventListener("resize", updateAvoidRect);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateAvoidRect);
    };
  }, [updateAvoidRect]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setIntroVisible(true);
      void headlineRef.current?.start();
      void buttonRef.current?.startAnimation();
    }, 200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-12">
      <RoseCurve />
      <WanderingCharacter visible={introVisible} avoidRect={avoidRect} />

      <div
        ref={safeZoneRef}
        className="relative z-40 flex flex-col items-center gap-6"
      >
        <Headline ref={headlineRef} />
        <GlassButton
          ref={buttonRef}
          onJoinClick={() => setWaitlistOpen(true)}
        />
      </div>

      <WaitlistModal
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />
    </section>
  );
}
