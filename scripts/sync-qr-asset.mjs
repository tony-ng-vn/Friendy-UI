import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const source = join(root, ".next/https_friendy-ui_vercel_app_.svg");
const raw = readFileSync(source, "utf8");

const marker = 'viewBox="0 0 2000 2000"';
const start = raw.indexOf(marker);
if (start < 0) {
  throw new Error("QR source is missing the 2000×2000 matrix.");
}

const chunk = raw.slice(start);
const logo = chunk.indexOf('<svg version="1.1"');
if (logo < 0) {
  throw new Error("QR source is malformed.");
}

const matrixPart = chunk.slice(0, logo);
const inner = matrixPart.slice(matrixPart.indexOf(">") + 1).trim();
const clean =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" width="256" height="256" shape-rendering="crispEdges">\n' +
  inner +
  "\n</svg>\n";

const svgOut = join(root, "public/friendy-qr.svg");
writeFileSync(svgOut, clean);
console.log(`Wrote ${svgOut} (${clean.length} bytes, ${inner.split("<rect").length - 1} rects)`);
