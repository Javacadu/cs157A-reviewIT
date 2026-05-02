# ReviewIT

A universal review platform where users can rate, review, and categorize anything.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript 5
- **Styling:** Tailwind CSS v4
- **Backend:** Next.js Server Actions
- **Database:** PostgreSQL (via `postgres` library)
- **Linting:** ESLint

---

## Database Schema

The database is normalized to BCNF with four core tables:

| Table | Description |
|-------|-------------|
| `users` | User accounts with email, username, and bcrypt password hashing |
| `categories` | Item categories (unique, case-insensitive) |
| `items` | Reviewable items with name, description, and category |
| `reviews` | User reviews with 0-5 star rating, title, and body |

Foreign key relationships:
- `items.created_by` → `users.id`
- `items.category_id` → `categories.id`
- `reviews.item_id` → `items.id` (CASCADE delete)
- `reviews.user_id` → `users.id` (CASCADE delete)

---

## Database Actions (Server Actions)

All database operations are implemented as Next.js Server Actions in `src/lib/actions/`:

### Auth Actions (`authActions.ts`)

| Action | SQL Operations |
|--------|----------------|
| `register()` | `SELECT` to check username/email uniqueness → `INSERT` into `users` |
| `login()` | `SELECT` user by username → `bcrypt.compare()` password → set session cookie |
| `logout()` | Clear session cookie (no DB operation) |

### Search Actions (`searchActions.ts`)

| Action | SQL Operations |
|--------|----------------|
| `getSearchSuggestions()` | `SELECT` from `items` + `JOIN` categories with weighted relevance ranking (exact > prefix > contains; name matches prioritized over description) |

### Item Actions (`itemActions.ts`)

| Action | SQL Operations |
|--------|----------------|
| `createItem()` | `SELECT` to check existing item (case-insensitive) → `INSERT` into `items` → `INSERT` into `reviews` |
| `getCategories()` | `SELECT` all from `categories` ordered by name |
| `createCategory()` | `SELECT` to check existing (case-insensitive) → `INSERT` into `categories` if new |

### Review Actions (`reviewActions.ts`)

| Action | SQL Operations |
|--------|----------------|
| `createReview()` | `INSERT` into `reviews` |
| `getReviewsByItemId()` | `SELECT` from `reviews` + `JOIN` users (returns reviewer username) |
| `updateReview()` | `UPDATE` on `reviews` with dynamic column set (rating, title, body) |
| `deleteReview()` | `SELECT` item_id → `DELETE` from `reviews` (user ownership enforced) |

---

## Local Setup

### Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **PostgreSQL** 14+

### Step-by-Step (macOS)

#### 1. Install Homebrew (if needed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. Install Node.js

```bash
brew install node
# Or use nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

#### 3. Install and Start PostgreSQL

```bash
brew install postgresql
brew services start postgresql
```

#### 4. Create Database

```bash
createdb reviewit
# Or: psql -c "CREATE DATABASE reviewit;" -U $(whoami)
```

#### 5. Clone and Install

```bash
git clone <repo-url>
cd reviewIT
npm install
```

#### 6. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/reviewit
```

Find your PostgreSQL username:
```bash
whoami
# Or: psql -c "\du"
```

macOS peer auth (no password):
```env
DATABASE_URL=postgresql://localhost:5432/reviewit
```

#### 7. Initialize Database

```bash
psql $DATABASE_URL -f src/lib/db/schema.sql
```

Verify:
```bash
psql $DATABASE_URL -c "\dt"
# Expected: categories, items, reviews, users
```

#### 8. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Quick Start (Already Have Prerequisites)

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
- **SQL Observability Terminal** - Live database query viewer for demos (see below)

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

## SQL Observability Terminal

A live database query viewer — perfect for demonstrations, debugging, and teaching database concepts.

### Enable Demo Mode

Append `?demo=true` to any URL (only needed once):

```
http://localhost:3000/search?demo=true
http://localhost:3000/item/1?demo=true
```

### How It Works

- When `?demo=true` is present, a cookie is set and the terminal appears (bottom-right)
- **Persists across pages** — Navigate normally, the `?demo=true` param is auto-added to URLs
- **Persists on reload** — Cookie keeps demo mode active even after browser refresh
- All database queries are intercepted and displayed in real-time
- Each query shows: operation type, table name, duration, and row count
- Queries are color-coded:
  - 🔵 **SELECT** - Data retrieval
  - 🟢 **INSERT** - Data creation
  - 🟠 **UPDATE** - Data modification
  - 🔴 **DELETE** - Data removal

### Usage for Presentations

1. Visit any page with `?demo=true` (e.g., `/search?demo=true`)
2. The terminal appears — navigate freely, it persists
3. Perform actions as normal — the audience watches SQL execute in real-time
4. To disable: click the **Off** button in the terminal header

### Demo Mode Controls

- **Off button** — Disables demo mode, removes cookie, hides terminal
- **Toggle** — Click the terminal header to collapse/expand
- **Clear** — Button to clear the log display
- **Click to expand** — Click any log entry to see full SQL

### Production Safety

- **Default: OFF** — Zero overhead when not in demo mode
- Terminal only appears when:
  - `?demo=true` is in the URL, OR
  - The `demo_mode` cookie is set
- Remove the cookie or click "Off" to disable completely