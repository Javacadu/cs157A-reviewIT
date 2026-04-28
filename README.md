# ReviewIT

A universal review platform where users can rate, review, and categorize anything.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript 5
- **Styling:** Tailwind CSS v4
- **Backend:** Next.js Server Actions
- **Database:** PostgreSQL (via `postgres` library)
- **Linting:** ESLint

## Prerequisites

- Node.js 18+
- PostgreSQL (local or cloud)

## Quick Start

```bash
# Clone the repo
git clone <repo-url>
cd reviewIT

# Run setup script
./scripts/setup.sh

# Or manual setup:
npm install
cp .env.local.example .env.local
# Edit .env.local with your DATABASE_URL
psql $DATABASE_URL -f src/lib/db/schema.sql
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

- **Browse & Search** - Search items by name or description with predictive autocomplete
- **View Reviews** - See all reviews for any item with star ratings
- **Create Review** - Add reviews with 0-5 star ratings, title, and description
- **Predictive Search** - When creating a review, search for existing items first
- **Categories** - Create new categories on-the-fly when adding reviews (case-insensitive dedup)
- **Multiple Reviews** - Users can review the same item multiple times

## Commands

```bash
npm run dev     # Development server
npm run build   # Production build
npm run start  # Production server
npm run lint   # ESLint
```

## Project Structure

```
src/
  app/           # Next.js pages and layouts
    item/        # Item pages (view, create review)
    search/      # Search page
  components/    # React components
    ui/          # Reusable UI components
    reviews/     # Review components
    search/      # Search components
  lib/
    actions/     # Server Actions
    db/          # Database connection and schema
  types/         # TypeScript types
```

## Troubleshooting

**DATABASE_URL not set**
- Ensure `.env.local` exists with valid `DATABASE_URL`

**Connection refused on port 5432**
- PostgreSQL not running: `brew services start postgresql` (macOS)

**Module not found**
- Delete `node_modules` and `package-lock.json`, then run `npm install`

**Database does not exist**
- Run `createdb reviewit` or create via your DB tool

## Contributing

See [CONVENTIONS.md](./CONVENTIONS.md) for coding standards and component patterns.