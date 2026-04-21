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

## Git Commands

Git commands are allowed when explicitly requested by the human. For example:
- "commit and push these changes" - run `git add`, `git commit`, `git push`
- "create a PR" - run `gh pr create`

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
- Components: `@/components/navbar/Navbar`, `@/components/search/SearchBar`, `@/components/reviews/ReviewList`
- Types: `src/types/index.ts` (User, Item, Category, Review, plus enriched join types)

## Tailwind v4 note

Config is in `src/app/globals.css` via `@import "tailwindcss"` and CSS custom properties (`@theme inline`). Do not create or modify `tailwind.config.js`.

## Styling Rules

- Use Tailwind CSS classes for all styling (no external CSS files)
- Prefer utility classes over custom CSS: `className="text-xl font-bold"` not `<style>.title</style>`
- Follow existing patterns in `globals.css` for custom properties (CSS variables)
- Use CSS custom properties from `@theme inline` for colors: `text-foreground`, `bg-background`
- Keep responsive design in mind: use `md:`, `lg:` prefixes for larger screens

## Component Rules

- Components live in `src/components/` organized by feature (e.g., `reviews/`, `search/`, `navbar/`)
- Export components as default: `export default function ComponentName()`
- Use TypeScript interfaces for props (see existing components for examples)
- Server Components are default; add `"use client"` only when you need interactivity (onClick, useState, etc.)
- Use `import type` for type-only imports
- Import paths use `@/*` alias: `import { Something } from "@/components/foo"`

### Persistent Layout Components

For components that persist across all pages (like navbar):

1. **Create the component** in `src/components/<feature>/ComponentName.tsx`
2. **Add "use client"** since it needs client-side interactivity
3. **Use usePathname** from `next/navigation` to track route changes
4. **Add to layout.tsx** inside `<body>` to persist across pages
5. **For history/back navigation:** prefer `router.back()` over custom history stacks — delegates to browser native history

Example pattern for navbar:
```tsx
"use client";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  // useEffect to sync state when pathname changes
  useEffect(() => { ... }, [pathname]);
}
```

## Missing features (not yet implemented)

- Authentication (`/auth` page shows placeholder)
- Item creation/fetch (item page just renders "Item #N" without real data)
