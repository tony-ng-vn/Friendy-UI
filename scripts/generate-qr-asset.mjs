import { writeFileSync } from "node:fs";
import { join } from "node:path";
import QRCode from "qrcode";

const SITE_URL = "https://friendy-ui.vercel.app";
const svgOut = join(process.cwd(), "public/qr_code.svg");

const svg = await QRCode.toString(SITE_URL, {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 2,
  color: { dark: "#000000", light: "#ffffff" },
});

writeFileSync(svgOut, svg);
console.log(`Wrote ${svgOut} (${svg.length} bytes) -> ${SITE_URL}`);
