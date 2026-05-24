# Friendy UI

Marketing site and waitlist for [Friendy](https://github.com/tony-ng-vn/Friendy).

- **Production:** https://friendy-ui.vercel.app
- **Repository:** https://github.com/tony-ng-vn/Friendy-UI

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and set the server-only Turso values:

```bash
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
```

The waitlist form posts to `/api/waitlist`. The API route stores signups in the
`waitlist_signups` table and creates the table/index on first use if they do not
exist yet.
