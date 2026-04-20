# Development Standards

Quick reference for contributing to this project.

## Tech Stack

| What | Why |
|------|-----|
| Next.js 16 | App Router with React Server Components |
| TypeScript | Catches bugs before runtime |
| Tailwind CSS | Utility-first styling (no custom CSS files) |
| PostgreSQL | Relational database |

## Code Conventions

### Styling

- **Use Tailwind classes** — `className="text-xl font-bold"` not `<style>` blocks
- **Use CSS variables** from `@theme inline` — `text-foreground` instead of hardcoded colors
- **Responsive prefix** — `md:text-2xl` for desktop, `sm:` for tablet
- **No external CSS files** — all styling in Tailwind classes

### Components

- **Default export** — `export default function ComponentName()`
- **TypeScript interfaces** for props:
  ```typescript
  interface Props {
    title: string;
    count?: number;
  }
  export default function Component({ title, count = 0 }: Props) { }
  ```
- **"use client" only when needed** — if you need `useState`, `onClick`, or event handlers
- **Use `import type`** for type-only imports
- **Path alias** — `@/components/foo` not relative paths like `../../components/foo`

### File Organization

```
src/
  app/              # Pages (page.tsx files)
  components/       # Reusable UI components
    reviews/
    search/
  lib/
    db/             # Database connection + schema
    actions/        # Server actions
  types/            # TypeScript interfaces
```

### Database

- Schema is in `src/lib/db/schema.sql`
- All tables have `id`, `created_at`, `updated_at`
- Foreign keys use `ON DELETE RESTRICT`
- Unique constraints for preventing duplicates (e.g., one review per user per item)

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Check code style
```

## Common Patterns

### Adding a new page
1. Create `src/app/path/page.tsx`
2. Export default function: `export default function Page() { }`
3. Add links in navigation if needed

### Adding a new component
1. Create `src/components/feature/ComponentName.tsx`
2. Use existing components as reference
3. Export as default

### Making a component interactive
Add `"use client"` at the top of the file when you need:
- `useState`, `useEffect`, or other hooks
- `onClick`, `onChange`, or event handlers
- Browser APIs

## Setup Checklist

- [ ] Copy `.env.local.example` to `.env.local` and add `DATABASE_URL`
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Create database tables with schema

## Getting Help

If stuck on something:
1. Check existing components in `src/components/`
2. Read the schema in `src/lib/db/schema.sql`
3. Ask your teammate or instructor
