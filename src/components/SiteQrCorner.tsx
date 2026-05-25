"use client";

import friendyQr from "../../public/friendy-qr.png";

const SITE_URL = "https://friendy-ui.vercel.app";
const DEBUG_ENDPOINT =
  "http://127.0.0.1:7594/ingest/3e957aba-bc7c-4763-b429-62631fed9900";

function logQr(
  message: string,
  hypothesisId: string,
  data: Record<string, unknown>
) {
  // #region agent log
  fetch(DEBUG_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "c24b8b",
    },
    body: JSON.stringify({
      sessionId: "c24b8b",
      runId: "post-fix",
      hypothesisId,
      location: "SiteQrCorner.tsx",
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
}

export default function SiteQrCorner() {
  const qrSrc = friendyQr.src;

  return (
    <aside
      className="pointer-events-none fixed bottom-4 right-4 z-[60] pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)] sm:bottom-5 sm:right-5"
      aria-label="QR code to open the Friendy website"
    >
      <div className="pointer-events-auto rounded-[8px] border border-[#d9984b]/30 bg-[#fffaf4]/95 p-3 shadow-[0_12px_40px_rgba(77,64,52,0.14)] backdrop-blur-[2px] transition-shadow duration-200 hover:shadow-[0_16px_48px_rgba(77,64,52,0.18)]">
        <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9d6b33]">
          Scan to visit
        </p>
        <a
          href={SITE_URL}
          className="block cursor-pointer rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9d6b33]"
          aria-label={`Open ${SITE_URL} (same link as this QR code)`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrSrc}
            alt="QR code for friendy-ui.vercel.app"
            width={friendyQr.width}
            height={friendyQr.height}
            className="size-28 sm:size-32"
            onLoad={() => {
              logQr("qr-image-loaded", "H-deploy", {
                qrSrc,
                host:
                  typeof window !== "undefined"
                    ? window.location.host
                    : "",
              });
            }}
            onError={() => {
              logQr("qr-image-error", "H-deploy", {
                qrSrc,
                host:
                  typeof window !== "undefined"
                    ? window.location.host
                    : "",
              });
            }}
          />
        </a>
      </div>
    </aside>
  );
}
