"use client";

import { useRef, useCallback, useState } from "react";
import type { FormEvent } from "react";
import RoseCurve from "./RoseCurve";
import Headline from "./Headline";
import type { HeadlineHandle } from "./Headline";
import GlassButton from "./GlassButton";
import type { GlassButtonHandle } from "./GlassButton";

type ConnectState =
  | "idle"
  | "open"
  | "submitting"
  | "ready-to-redirect"
  | "redirecting"
  | "waitlisted"
  | "backend-offline"
  | "error";

const FRIENDY_API_BASE_URL =
  process.env.NEXT_PUBLIC_FRIENDY_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8788";

export default function Hero() {
  const headlineRef = useRef<HeadlineHandle>(null);
  const buttonRef = useRef<GlassButtonHandle>(null);
  const startedRef = useRef(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [connectState, setConnectState] = useState<ConnectState>("idle");
  const [message, setMessage] = useState("");
  const [assignedPhoneNumber, setAssignedPhoneNumber] = useState<string | undefined>();
  const [redirectUrl, setRedirectUrl] = useState<string | undefined>();

  const handleFirstDraw = useCallback(async () => {
    if (startedRef.current) return;
    startedRef.current = true;

    await headlineRef.current?.start();
    await buttonRef.current?.startAnimation();
  }, []);

  async function connectFriendy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedPhone = phoneNumber.trim();
    if (!trimmedPhone) {
      setConnectState("error");
      setMessage("Enter the phone number you want to connect with Friendy.");
      return;
    }

    setConnectState("submitting");
    setMessage("");

    try {
      const response = await fetch(`${FRIENDY_API_BASE_URL}/api/onboarding/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: trimmedPhone }),
      });
      const body = (await response.json().catch(() => ({}))) as {
        assignedPhoneNumber?: string;
        error?: string;
        message?: string;
        redirectUrl?: string;
      };

      if (response.status === 202 && body.error === "private_beta") {
        setRedirectUrl(undefined);
        setAssignedPhoneNumber(undefined);
        setConnectState("waitlisted");
        setMessage(body.message ?? "Friendy is currently in beta demo and will be rolling out to users one by one. Until then, please give Friendy some time.");
        return;
      }

      if (!response.ok || !body.redirectUrl) {
        setRedirectUrl(undefined);
        setConnectState("error");
        setMessage(body.message ?? "Friendy could not start the connection. Check the local backend and try again.");
        return;
      }

      setAssignedPhoneNumber(body.assignedPhoneNumber);
      setRedirectUrl(body.redirectUrl);
      setConnectState("ready-to-redirect");
      setMessage("Friendy is ready. Can I open iMessage so you can send the prefilled start message?");
    } catch {
      setRedirectUrl(undefined);
      setConnectState("backend-offline");
      setMessage("Friendy backend is not running on this Mac yet. Start it locally, then try Connect again.");
    }
  }

  function openImessage() {
    if (!redirectUrl) return;
    setConnectState("redirecting");
    setMessage("Opening iMessage. Send the prefilled start message to activate Friendy.");
    window.location.href = redirectUrl;
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
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9d6b33]">Friendy connect</p>
                <h2 className="mt-1 font-serif text-2xl leading-tight">Start with your number</h2>
              </div>
              <button
                type="button"
                className="grid h-8 w-8 place-items-center rounded-full border border-[#d9984b]/30 text-lg leading-none transition hover:bg-[#f7eadb]"
                onClick={() => {
                  setConnectState("idle");
                  setMessage("");
                  setRedirectUrl(undefined);
                  setAssignedPhoneNumber(undefined);
                }}
                aria-label="Close Connect"
              >
                x
              </button>
            </div>

            {connectState === "ready-to-redirect" || connectState === "redirecting" ? (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={openImessage}
                  disabled={connectState === "redirecting"}
                  className="h-11 w-full rounded-[6px] bg-[#4d4034] px-4 text-sm font-semibold text-[#fffaf4] transition hover:bg-[#3d3228] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {connectState === "redirecting" ? "Opening iMessage..." : "Open iMessage"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConnectState("open");
                    setMessage("");
                  }}
                  className="h-10 w-full rounded-[6px] border border-[#d9984b]/35 px-4 text-sm font-semibold text-[#4d4034] transition hover:bg-[#f7eadb]"
                >
                  Not now
                </button>
              </div>
            ) : (
              <form className="space-y-3" onSubmit={connectFriendy}>
                <label className="block text-sm font-medium" htmlFor="friendy-phone">
                  Phone number
                </label>
                <input
                  id="friendy-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  placeholder="+1234567890"
                  className="h-12 w-full rounded-[6px] border border-[#d9984b]/35 bg-white px-3 font-display text-base outline-none transition focus:border-[#9d6b33] focus:ring-2 focus:ring-[#d9984b]/20"
                  autoComplete="tel"
                />
                <button
                  type="submit"
                  disabled={connectState === "submitting"}
                  className="h-11 w-full rounded-[6px] bg-[#4d4034] px-4 text-sm font-semibold text-[#fffaf4] transition hover:bg-[#3d3228] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {connectState === "submitting" ? "Connecting..." : "Join waitlist"}
                </button>
              </form>
            )}

            {message ? (
              <p className="mt-4 rounded-[6px] border border-[#d9984b]/25 bg-[#faf4ec] p-3 text-sm leading-6">
                {message}
              </p>
            ) : null}

            {assignedPhoneNumber ? (
              <p className="mt-3 text-xs text-[#7a644e]">Assigned Friendy line: {assignedPhoneNumber}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
