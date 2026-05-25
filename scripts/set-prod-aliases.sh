#!/usr/bin/env bash
# Point friendy-ui + friedy-ui at the latest Production deployment.
set -euo pipefail
cd "$(dirname "$0")/.."

# Last known good production (from vercel --prod output); used if ls parse fails.
FALLBACK="https://friendy-82klt57mg-tonys-projects-6d126fa0.vercel.app"

echo "Fetching latest Production deployment for friendy-ui..."
LATEST="$(
  npx vercel ls friendy-ui 2>&1 \
    | grep -oE 'https://[a-zA-Z0-9-]+\.vercel\.app' \
    | head -1
)"

if [[ -z "${LATEST:-}" ]]; then
  echo "Could not parse from vercel ls; using fallback: $FALLBACK"
  LATEST="$FALLBACK"
fi

echo "Latest Production: $LATEST"
echo "Aliasing friendy-ui.vercel.app and friedy-ui.vercel.app..."
npx vercel alias set "$LATEST" friendy-ui.vercel.app
npx vercel alias set "$LATEST" friedy-ui.vercel.app

echo ""
echo "Verify static asset (optional; QR is also bundled in JS after deploy):"
curl -sI "https://friendy-ui.vercel.app/friendy-qr.svg" | head -3 || true
echo ""
echo "Open: https://friendy-ui.vercel.app/"
