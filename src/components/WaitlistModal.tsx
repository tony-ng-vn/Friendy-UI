"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type ModalPhase = "form" | "success";

interface WaitlistModalProps {
  open: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ open, onClose }: WaitlistModalProps) {
  const titleId = useId();
  const descId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [phone, setPhone] = useState("");
  const [phase, setPhase] = useState<ModalPhase>("form");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reset = useCallback(() => {
    setPhone("");
    setPhase("form");
    setError(null);
    setLoading(false);
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    window.setTimeout(reset, 280);
  }, [onClose, reset]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  useEffect(() => {
    if (open && phase === "form") {
      const t = window.setTimeout(() => inputRef.current?.focus(), 120);
      return () => window.clearTimeout(t);
    }
  }, [open, phase]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
      };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setPhase("success");
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close waitlist dialog"
            className="absolute inset-0 cursor-pointer bg-[#2d2640]/25 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={phase === "form" ? descId : undefined}
            className="relative z-10 w-full max-w-[360px] rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-glass-bg)] p-6 shadow-glass backdrop-blur-xl"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3 top-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors hover:bg-white/50 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label="Close"
            >
              <X className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
            </button>

            {phase === "form" ? (
              <>
                <h2
                  id={titleId}
                  className="pr-8 text-lg font-medium text-text"
                >
                  Join the waitlist
                </h2>
                <p
                  id={descId}
                  className="mt-1 text-sm text-text-muted"
                >
                  US numbers only. We&apos;ll text you when Friendy is ready.
                </p>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <div>
                    <label
                      htmlFor="waitlist-phone"
                      className="mb-1.5 block text-sm font-medium text-text"
                    >
                      Phone number
                    </label>
                    <div className="flex overflow-hidden rounded-xl border border-white/60 bg-white/70 shadow-sm focus-within:ring-2 focus-within:ring-accent/40">
                      <span className="flex min-h-[44px] items-center border-r border-white/60 bg-white/40 px-3 text-sm font-medium text-text-muted">
                        +1
                      </span>
                      <input
                        ref={inputRef}
                        id="waitlist-phone"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        placeholder="(555) 123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={loading}
                        className="min-h-[44px] flex-1 bg-transparent px-3 text-base text-text placeholder:text-text-muted/60 focus:outline-none disabled:opacity-60"
                        aria-invalid={error ? true : undefined}
                        aria-describedby={error ? "waitlist-error" : undefined}
                      />
                    </div>
                  </div>

                  {error && (
                    <p
                      id="waitlist-error"
                      role="alert"
                      className="text-sm text-[#b4234a]"
                    >
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex min-h-[44px] w-full cursor-pointer items-center justify-center rounded-xl bg-accent px-4 text-base font-medium text-white transition-colors hover:bg-[#5a7fc8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Joining…" : "Join waitlist"}
                  </button>
                </form>
              </>
            ) : (
              <div className="py-2 text-center">
                <p
                  id={titleId}
                  className="text-xl font-medium text-text"
                  role="status"
                >
                  You&apos;re on the list!
                </p>
                <p className="mt-2 text-sm text-text-muted">
                  We&apos;ll be in touch soon.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-6 min-h-[44px] cursor-pointer rounded-xl border border-white/60 bg-white/50 px-6 text-base font-medium text-text transition-colors hover:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
