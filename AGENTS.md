# AGENTS.md

## Stack

- **Next.js 16** (App Router, React Server Components by default)
- **TypeScript 5**, strict mode
- **Tailwind CSS v4** (CSS-based config via `@import "tailwindcss"`, not `tailwind.config.js`)
- **PostgreSQL** via `postgres` library (sql template tag)
- **ESLint** only — no typecheck or test scripts in package.json

## Commands

```bash
npm run dev      # Next.js dev server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

## Database

- Schema: `src/lib/db/schema.sql`
- Runtime requires `DATABASE_URL` in `.env.local` (copy from `.env.local.example`)
- DB connection is lazy in `src/lib/db/index.ts` — safe to import at build time, fails at runtime if `DATABASE_URL` is missing
- Dev: `globalThis._pgPool` preserves the pool across Next.js hot reloads

## Architecture

- Server Components are the default; add `"use client"` to make a component interactive
- Server Actions: `src/lib/actions/reviewActions.ts` (marked `"use server"`)
- Path alias: `@/*` → `./src/*`
- Routes: `/` (home), `/search` (browse), `/item/[id]`, `/auth`
- Types: `src/types/index.ts` (User, Item, Category, Review, plus enriched join types)

## Tailwind v4 note

Config is in `src/app/globals.css` via `@import "tailwindcss"` and CSS custom properties (`@theme inline`). Do not create or modify `tailwind.config.js`.

## Missing features (not yet implemented)

- Authentication (`/auth` page shows placeholder)
- Item creation/fetch (item page just renders "Item #N" without real data)
