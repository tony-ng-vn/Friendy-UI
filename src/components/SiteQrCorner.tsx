const SITE_URL = "https://friendy-ui.vercel.app";
const QR_SRC = "/qr_code.svg";

export default function SiteQrCorner() {
  return (
    <aside
      className="pointer-events-none fixed bottom-5 right-5 z-[60] hidden pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)] md:block"
      aria-label="QR code to open the Friendy website"
    >
      <div className="pointer-events-auto rounded-[8px] border border-[#d9984b]/30 bg-[#fffaf4]/95 p-[clamp(0.5rem,1.2vmin,0.75rem)] shadow-[0_12px_40px_rgba(77,64,52,0.14)] backdrop-blur-[2px] transition-shadow duration-200 hover:shadow-[0_16px_48px_rgba(77,64,52,0.18)]">
        <p className="mb-[clamp(0.375rem,0.8vmin,0.5rem)] text-center text-[clamp(0.5625rem,1.1vmin,0.625rem)] font-semibold uppercase tracking-[0.16em] text-[#9d6b33]">
          Scan to visit
        </p>
        <a
          href={SITE_URL}
          className="block cursor-pointer rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9d6b33]"
          aria-label={`Open ${SITE_URL} (same link as this QR code)`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={QR_SRC}
            alt="QR code for friendy-ui.vercel.app"
            width={128}
            height={128}
            className="aspect-square size-[clamp(5.5rem,12vmin,8.5rem)] [image-rendering:crisp-edges]"
          />
        </a>
      </div>
    </aside>
  );
}
