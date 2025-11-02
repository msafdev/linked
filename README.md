# Linked

Linked is a Next.js dashboard that now ships with a fully typed Supabase backend, storage bucket support for media assets, and tooling to seed development data quickly.

## Prerequisites
- Node.js 20+
- A Supabase project
- Optional: [Supabase CLI](https://supabase.com/docs/guides/cli) (helps run schema/policy SQL locally before pushing)

## Installation
```bash
npm install
```
This pulls in the Supabase SDKs (`@supabase/supabase-js`, `@supabase/ssr`, `@supabase/auth-helpers-nextjs`) plus utilities used for seeding (`dotenv`, `tsx`).

## Environment
Copy `.env.example` to `.env.local` and fill in the variables that matter for your Supabase project:

```ini
SITE_URL=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=images
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SUPABASE_JWT_SECRET=...
```

`NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` is required for server-side mutations and the seed script. Keep it out of the browser—only expose `*` keys client-side.

## Database
1. Apply tables and relationships:
   ```bash
   psql "$SUPABASE_DB_URL" -f supabase/schema.sql
   ```
   Or run `supabase db push` if you’re using the Supabase CLI.

2. Provision storage and policies (run with the service role user):
   ```bash
   psql "$SUPABASE_DB_URL" -f supabase/storage-policies.sql
   ```
   This creates (or reconfigures) a public `images` bucket and RLS policies that allow:
   - Public reads for generated URLs
   - Authenticated uploads/updates/deletes

## Seeding
Seed demo data any time with:
```bash
npm run seed
```
The script reads `.env.local`, injects a demo account, content rows, and default settings. Update `scripts/seed.ts` if you want different fixtures.

## Storage Usage
High-level helpers live in `lib/supabase/storage.ts`:
- `uploadImageFromBrowser` – upload user-selected files client-side
- `getPublicImageUrl` / `createSignedImageUrl` – generate delivery URLs
- `deleteImages` – purge unused assets

They all default to the `images` bucket but accept custom clients so you can reuse them inside server actions or route handlers.

## Development
```bash
npm run dev
```
Open `http://localhost:3000` and iterate. Lint and format helpers stay available:
```bash
npm run lint
npm run format
```

## Deployment
Deploy like any other Next.js (Vercel, Render, etc.). Remember to configure the same environment variables on the target platform and run the SQL/policy files against your production Supabase instance.

