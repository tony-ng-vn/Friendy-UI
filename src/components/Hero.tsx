"use client";

import { useRef, useCallback, useState } from "react";
import type { FormEvent } from "react";
import RoseCurve from "./RoseCurve";
import Headline from "./Headline";
import type { HeadlineHandle } from "./Headline";
import GlassButton from "./GlassButton";
import type { GlassButtonHandle } from "./GlassButton";
import { normalizeEmail } from "@/lib/email";

type ConnectState = "idle" | "open" | "submitting" | "waitlisted" | "error";

export default function Hero() {
  const headlineRef = useRef<HeadlineHandle>(null);
  const buttonRef = useRef<GlassButtonHandle>(null);
  const startedRef = useRef(false);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [connectState, setConnectState] = useState<ConnectState>("idle");
  const [message, setMessage] = useState("");

  const handleFirstDraw = useCallback(async () => {
    if (startedRef.current) return;
    startedRef.current = true;

    await headlineRef.current?.start();
    await buttonRef.current?.startAnimation();
  }, []);

  function resetModal() {
    setConnectState("idle");
    setMessage("");
    setEmail("");
    setPhoneNumber("");
  }

  async function connectFriendy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
      setConnectState("error");
      setMessage("Enter a valid email address (for example, you@gmail.com).");
      return;
    }

    const trimmedPhone = phoneNumber.trim();
    if (!trimmedPhone) {
      setConnectState("error");
      setMessage("Enter the phone number you want to connect with Friendy.");
      return;
    }

    setConnectState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          phoneNumber: trimmedPhone,
          source: "homepage",
        }),
      });
      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
      };

      if (
        response.status === 400 &&
        (body.error === "invalid_email" || body.error === "invalid_phone")
      ) {
        setConnectState("error");
        setMessage(body.message ?? "Check your waitlist details and try again.");
        return;
      }

      if (!response.ok) {
        setConnectState("error");
        setMessage(body.message ?? "Could not join the waitlist right now. Please try again.");
        return;
      }

      setConnectState("waitlisted");
      setMessage(body.message ?? "You're on the waitlist. We'll email you when Friendy is ready.");
    } catch {
      setConnectState("error");
      setMessage("Could not join the waitlist right now. Please try again.");
    }
  }

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-bg px-4">
      <RoseCurve onFirstDrawComplete={handleFirstDraw} />
      <Headline ref={headlineRef} />
      <GlassButton ref={buttonRef} onClick={() => setConnectState("open")} />

      {connectState !== "idle" ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#4d4034]/25 px-4 py-5 backdrop-blur-[2px] sm:items-center">
          <div className="w-full max-w-[420px] rounded-[8px] border border-[#d9984b]/30 bg-[#fffaf4]/95 p-5 text-[#4d4034] shadow-[0_20px_60px_rgba(77,64,52,0.18)]">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9d6b33]">
                  Friendy waitlist
                </p>
                <h2 className="mt-1 font-serif text-2xl leading-tight">Join the waitlist</h2>
              </div>
              <button
                type="button"
                className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-[#d9984b]/30 text-lg leading-none transition hover:bg-[#f7eadb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9d6b33]"
                onClick={resetModal}
                aria-label="Close waitlist form"
              >
                x
              </button>
            </div>

            <form className="space-y-3" onSubmit={connectFriendy} noValidate>
              <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="friendy-email">
                  Email
                </label>
                <input
                  id="friendy-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@gmail.com"
                  className="h-12 w-full rounded-[6px] border border-[#d9984b]/35 bg-white px-3 font-display text-base outline-none transition focus:border-[#9d6b33] focus:ring-2 focus:ring-[#d9984b]/20"
                  aria-describedby={connectState === "error" ? "friendy-form-error" : undefined}
                />
                <p className="mt-1 text-xs text-[#7a644e]">
                  We&apos;ll email you when Friendy is ready.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="friendy-phone">
                  Phone number
                </label>
                <input
                  id="friendy-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  placeholder="+1234567890"
                  className="h-12 w-full rounded-[6px] border border-[#d9984b]/35 bg-white px-3 font-display text-base outline-none transition focus:border-[#9d6b33] focus:ring-2 focus:ring-[#d9984b]/20"
                  aria-describedby={connectState === "error" ? "friendy-form-error" : undefined}
                />
              </div>

              <button
                type="submit"
                disabled={connectState === "submitting"}
                className="h-11 w-full cursor-pointer rounded-[6px] bg-[#4d4034] px-4 text-sm font-semibold text-[#fffaf4] transition hover:bg-[#3d3228] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9d6b33]"
              >
                {connectState === "submitting" ? "Joining..." : "Join waitlist"}
              </button>
            </form>

            {message ? (
              <p
                id="friendy-form-error"
                role={connectState === "error" ? "alert" : "status"}
                className="mt-4 rounded-[6px] border border-[#d9984b]/25 bg-[#faf4ec] p-3 text-sm leading-6"
              >
                {message}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
