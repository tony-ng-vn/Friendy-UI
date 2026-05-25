# Fix blank QR on friendy-ui.vercel.app

**Cause:** Production still serves an old build (`/friendy-qr.svg` → 500). The bundled PNG fix must be **committed, pushed, and deployed**.

## One command (after commit + push)

```bash
cd /Users/minhthiennguyen/Desktop/Friendy-UI
git add src/components/SiteQrCorner.tsx scripts/set-prod-aliases.sh package.json
git commit -m "Bundle QR PNG in JS and sync Vercel aliases."
git push origin main
npm run deploy:prod
```

## Or alias only (if you already deployed)

```bash
npx vercel alias set https://friendy-82klt57mg-tonys-projects-6d126fa0.vercel.app friendy-ui.vercel.app
```

Replace the URL with the newest **Production** URL from `npx vercel ls friendy-ui` (full `https://…vercel.app` line — no `<` `>`).

## Verify

```bash
curl -sI https://friendy-ui.vercel.app/ | head -3
```

Open the site → View Source → QR `img` should use `/_next/static/media/…` not `/friendy-qr.svg`.
