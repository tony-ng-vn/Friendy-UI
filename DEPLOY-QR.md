# Deploy Friendy UI (QR widget)

## What ships

- **QR:** `public/friendy-qr.svg` (regenerate with `npm run generate:qr`) → `/friendy-qr.svg`
- **Mobile (iPhone):** QR hidden (`hidden md:block`)
- **Desktop (≥768px):** QR bottom-right, size scales with viewport (`clamp` + `vmin`)

## Deploy

```bash
cd /Users/minhthiennguyen/Desktop/Friendy-UI

git add src/components/SiteQrCorner.tsx scripts/set-prod-aliases.sh DEPLOY-QR.md
git add -u   # stages deletion of root duplicate SVG if present

git commit -m "Desktop-only responsive QR widget; hide on mobile."

git push origin main
npx vercel --prod --yes
npm run alias:prod
```

## Verify

- **Phone:** no QR card; waitlist button not covered
- **Desktop:** QR visible bottom-right; `curl -sI https://friendy-ui.vercel.app/friendy-qr.svg` → **200**
