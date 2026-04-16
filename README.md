# ReviewIT

A universal review platform where users can rate, review, and categorize anything. Browse items, read reviews, and share your thoughts.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript 5
- **Styling:** Tailwind CSS v4
- **Backend:** Next.js Server Actions
- **Database:** PostgreSQL (via `postgres` library)
- **Linting:** ESLint

## Prerequisites

- Node.js 18+
- PostgreSQL (local or cloud)
## Setup(setup script)

Run the setup script to get started:
```bash
./scripts/setup.sh
This script:
- Verifies Node.js 18+ is installed
- Checks for PostgreSQL client
- Creates .env.local from .env.local.example
- Installs npm dependencies
- Prints next steps for database setup
```

## Setup(manual)

### 1. Clone and install

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your `DATABASE_URL`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/reviewit
```

### 3. Create database

If PostgreSQL is running locally:

```bash
createdb reviewit
```

Or use your preferred DB tool (pgAdmin, TablePlus, DBeaver, etc.).

### 4. Initialize schema

```bash
psql $DATABASE_URL -f src/lib/db/schema.sql
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Commands

```bash
npm run dev     # Development server
npm run build  # Production build
npm run start  # Production server
npm run lint   # ESLint
```

## Troubleshooting

**`DATABASE_URL environment variable is not set`**
- Ensure `.env.local` exists and contains a valid `DATABASE_URL`

**Connection refused on port 5432**
- PostgreSQL is not running. Start it: `brew services start postgresql` (macOS) or `sudo systemctl start postgresql` (Linux)

**npm command not found**
- Install Node.js from [nodejs.org](https://nodejs.org) or use [nvm](https://github.com/nvm-sh/nvm)

**Module not found errors**
- Delete `node_modules` and `package-lock.json`, then re-run `npm install`

**Database does not exist**
- Run `createdb reviewit` or create the database in your DB tool

## Project Structure

```
src/
  app/           # Next.js pages and layouts
  components/    # React components
  lib/
    actions/     # Server Actions
    db/          # Database connection and schema
  types/         # TypeScript types
```

## Features

- Search items by name or description
- View item details and reviews
- Create, update, and delete reviews (via Server Actions)

## Status

- [x] Search and browse items
- [x] Review display and CRUD
- [ ] User authentication
- [ ] Item creation
- [ ] Category browsing
