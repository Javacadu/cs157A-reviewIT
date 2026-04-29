# ReviewIT

A universal review platform where users can rate, review, and categorize anything.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript 5
- **Styling:** Tailwind CSS v4
- **Backend:** Next.js Server Actions
- **Database:** PostgreSQL (via `postgres` library)
- **Linting:** ESLint

---

## Step-by-Step Installation (macOS)

### Step 1: Install Homebrew (if not installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Step 2: Install Node.js

```bash
# Using Homebrew
brew install node

# Or using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

Verify:
```bash
node -v  # Should show v20.x.x
```

### Step 3: Install PostgreSQL

```bash
brew install postgresql
```

### Step 4: Start PostgreSQL

```bash
brew services start postgresql
```

Verify:
```bash
psql -v  # Should show version
```

### Step 5: Create Database

```bash
createdb reviewit

# If that fails, try:
psql -c "CREATE DATABASE reviewit;" -U $(whoami)
```

### Step 6: Clone the Project

```bash
git clone <repo-url>
cd reviewIT
```

### Step 7: Install Dependencies

```bash
npm install
```

### Step 8: Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` in your editor:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/reviewit
```

**Getting your PostgreSQL username:**
```bash
whoami  # Use this as username

# Or check PostgreSQL roles:
psql -c "\du"
```

**If using peer authentication (macOS default):**
```env
DATABASE_URL=postgresql://localhost:5432/reviewit
```

### Step 9: Initialize Database Schema

```bash
psql $DATABASE_URL -f src/lib/db/schema.sql
```

Verify tables created:
```bash
psql $DATABASE_URL -c "\dt"
```

You should see: `categories`, `items`, `reviews`, `users`

### Step 10: Start the App

```bash
npm run dev
```

### Step 11: Verify It Works

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Quick Start (If You Already Have Prerequisites)

```bash
git clone <repo-url>
cd reviewIT
npm install
cp .env.local.example .env.local
# Edit .env.local with your DATABASE_URL
psql $DATABASE_URL -f src/lib/db/schema.sql
npm run dev
```

---

## Features

- **Browse & Search** - Search items by name or description with predictive autocomplete
- **View Reviews** - See all reviews for any item with star ratings
- **User Authentication** - Sign up, sign in, sign out
- **Create Review** - Add reviews with 0-5 star ratings, title, and description
- **Predictive Search** - When creating a review, search for existing items first
- **Categories** - Create new categories on-the-fly when adding reviews (case-insensitive dedup)
- **Multiple Reviews** - Users can review the same item multiple times
- **User Profile** - View your reviews and items at `/user/[id]`

---

## Commands

```bash
npm run dev     # Development server (http://localhost:3000)
npm run build  # Production build
npm run start  # Production server
npm run lint   # ESLint check
```

---

## Project Structure

```
src/
  app/              # Next.js pages and layouts
    item/[id]/       # Item detail page
    item/new/        # Create review page
    search/          # Search/browse page
    user/[id]/       # User profile page
    auth/           # Login/register page
    api/            # API routes (auth)
  components/        # React components
    ui/             # Reusable UI components (TextInput, StarRating, etc.)
    reviews/         # Review components (ReviewList, ReviewCard)
    search/          # Search components (SearchBar)
  lib/
    actions/         # Server Actions
    auth/           # Session management
    db/             # Database connection and schema
  types/            # TypeScript types
```

---

## Troubleshooting

**Could not connect to database**
- Ensure PostgreSQL is running: `brew services start postgresql`
- Check `.env.local` has correct `DATABASE_URL`
- Verify database exists: `psql $DATABASE_URL -c "\l"`

**DATABASE_URL not set**
- Ensure `.env.local` exists with valid `DATABASE_URL`

**Connection refused on port 5432**
- PostgreSQL not running: `brew services start postgresql`

**Module not found**
- Delete `node_modules` and `package-lock.json`, then run `npm install`

**Database does not exist**
- Run `createdb reviewit`

**Permission denied (database)**
- Try: `export PGUSER=your_username` before psql commands
- Or use peer auth: `psql -d reviewit`

---

## Reset Database (Start Fresh)

```bash
# Drop and recreate
dropdb reviewit
createdb reviewit
psql $DATABASE_URL -f src/lib/db/schema.sql
```

---

## Contributing

See [CONVENTIONS.md](./CONVENTIONS.md) for coding standards and component patterns.