import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const source = join(root, "public/qr_code.svg");
const out = join(root, "public/qr_code.svg");
const raw = readFileSync(source, "utf8");

const marker = 'viewBox="0 0 2000 2000"';
const markerIndex = raw.indexOf(marker);
if (markerIndex < 0) {
  throw new Error("qr_code.svg: missing 2000×2000 QR matrix.");
}

const openIndex = raw.lastIndexOf("<svg", markerIndex);
let depth = 0;
let pos = openIndex;

while (pos < raw.length) {
  const nextOpen = raw.indexOf("<svg", pos);
  const nextClose = raw.indexOf("</svg>", pos);
  if (nextClose === -1) {
    throw new Error("qr_code.svg: unclosed <svg>.");
  }

  if (nextOpen !== -1 && nextOpen < nextClose) {
    depth += 1;
    pos = nextOpen + 4;
    continue;
  }

  depth -= 1;
  pos = nextClose + "</svg>".length;
  if (depth === 0) {
    const inner = raw.slice(openIndex, pos);
    const flat =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      inner
        .replace(/\swidth="100"/, ' width="256"')
        .replace(/\sheight="100"/, ' height="256"') +
      "\n";
    writeFileSync(out, flat);
    console.log(`Flattened ${out} (${flat.length} bytes)`);
    process.exit(0);
  }
}

throw new Error("qr_code.svg: could not extract matrix SVG.");
