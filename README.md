# ReviewIT - CS157A Course Project

A universal review platform where users can rate, review, and categorize anything.

---

## Project Overview

ReviewIT is a web application that allows users to create and browse reviews for any item. Users can register, login, create items, and submit reviews with star ratings. The application demonstrates proper database design, SQL operations, and error handling.

This project was developed as part of the CS157A Database Systems course requirements.

---

## Course Submission Requirements

### Code Organization

The project is organized as follows:

```
reviewIT/
├── src/
│   ├── app/              # Next.js pages and layouts
│   ├── components/       # React components
│   ├── lib/
│   │   ├── actions/      # Server Actions (database operations)
│   │   ├── auth/         # Session management
│   │   └── db/           # Database connection and SQL scripts
│   └── types/            # TypeScript types
├── create_schema.sql    # Database schema creation script
├── initialize_data.sql  # Database initialization script (15+ entries per table)
└── package.json         # Project dependencies
```

---

## Dependencies and Required Software

- **Node.js**
- **PostgreSQL** 
- **npm** 

To verify Node.js is installed:
```bash
node --version
```

To verify PostgreSQL is installed:
```bash
psql --version
```

---

## Instructions for Setting Up and Running the Project

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd reviewIT
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Copy the example environment file:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your PostgreSQL connection string:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/reviewit
```

To find your PostgreSQL username:
```bash
whoami
```

On macOS with peer authentication (no password needed):
```env
DATABASE_URL=postgresql://localhost:5432/reviewit
```

### Step 4: Create the Database

If the database does not exist, create it:
```bash
createdb reviewit
```

### Step 5: Run the Schema Creation Script

```bash
psql $DATABASE_URL -f src/lib/db/create_schema.sql
```

This creates all tables, constraints, and indexes.

To verify tables were created:
```bash
psql $DATABASE_URL -c "\dt"
```

Expected output: categories, items, reviews, users

### Step 6: Initialize Database with Sample Data

```bash
psql $DATABASE_URL -f src/lib/db/initialize_data.sql
```

This populates each table with at least 15 entries.

To verify data:
```bash
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
psql $DATABASE_URL -c "SELECT COUNT(*) FROM categories;"
psql $DATABASE_URL -c "SELECT COUNT(*) FROM items;"
psql $DATABASE_URL -c "SELECT COUNT(*) FROM reviews;"
```

### Step 7: Start the Development Server

```bash
npm run dev
```

The application will be available at: http://localhost:3000

---

## Additional Configuration Steps

### Database Connection Issues

If you cannot connect to the database:
1. Ensure PostgreSQL is running: `brew services start postgresql` (macOS)
2. Check `.env.local` has the correct `DATABASE_URL`
3. Verify the database exists: `psql $DATABASE_URL -c "\l"`

### Connection Refused on Port 5432

PostgreSQL is not running. Start it with:
```bash
brew services start postgresql
```

### Permission Denied

Try specifying the username:
```bash
export PGUSER=your_username
psql $DATABASE_URL -f src/lib/db/create_schema.sql
```

---

## JDBC Code (Database Access Layer)

This project uses the `postgres` library (Node.js equivalent of JDBC for database connectivity). All database operations are implemented as Server Actions in `src/lib/actions/`.

### Key Database Files

| File | Purpose |
|------|---------|
| `src/lib/db/index.ts` | Database connection pool management |
| `src/lib/db/create_schema.sql` | SQL DDL for table creation |
| `src/lib/db/initialize_data.sql` | SQL DML for sample data |
| `src/lib/actions/reviewActions.ts` | CRUD operations for reviews |
| `src/lib/actions/itemActions.ts` | CRUD operations for items |
| `src/lib/actions/authActions.ts` | User authentication operations |
| `src/lib/actions/searchActions.ts` | Search functionality |

### Example Database Operation (SELECT)

```typescript
// From src/lib/actions/reviewActions.ts
export async function getReviewsByItemId(itemId: number) {
  const sql = getSql();
  const reviews = await sql<ReviewWithUser[]>`
    SELECT
      r.*,
      u.username
    FROM reviews r
    JOIN users u ON u.id = r.user_id
    WHERE r.item_id = ${itemId}
    ORDER BY r.created_at DESC
  `;
  return reviews;
}
```

### Example Database Operation (INSERT)

```typescript
// From src/lib/actions/reviewActions.ts
export async function createReview(input: CreateReviewInput) {
  const sql = getSql();
  const { item_id, user_id, rating, title, body } = input;

  const [review] = await sql<Review[]>`
    INSERT INTO reviews (item_id, user_id, rating, title, body)
    VALUES (${item_id}, ${user_id}, ${rating}, ${title}, ${body ?? null})
    RETURNING *
  `;

  return review;
}
```

### Error Handling

All database operations include error handling:

```typescript
// From src/lib/db/index.ts
export function getSql(): ReturnType<typeof postgres> {
  if (globalThis._pgPool) {
    if (!globalThis._sqlProxy) {
      globalThis._sqlProxy = wrapSql(globalThis._pgPool);
    }
    return globalThis._sqlProxy;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
        "Please add it to your .env.local file."
    );
  }

  const pool = postgres(connectionString);
  // ... rest of connection logic
}
```

Server actions also include error handling for user input validation:

```typescript
// From src/lib/actions/reviewActions.ts
export async function updateReview(reviewId, userId, input) {
  const sql = getSql();

  const userIdToUse = userId ?? (await getSession())?.userId;
  if (!userIdToUse) {
    throw new Error("You must be logged in to update a review");
  }

  const [updated] = await sql`...`;
  if (!updated) {
    throw new Error(
      `Review ${reviewId} not found or you do not have permission to update it.`
    );
  }

  return updated;
}
```

---

## SQL Script for Database Creation

The schema is defined in `src/lib/db/create_schema.sql`. This script:
- Creates the `users` table with unique constraints on email and username
- Creates the `categories` table with unique category names
- Creates the `items` table with foreign keys to users and categories
- Creates the `reviews` table with foreign keys, check constraints (rating 0-5)
- Creates indexes for common query patterns

Run with:
```bash
psql $DATABASE_URL -f src/lib/db/create_schema.sql
```

---

## Database Initialization Script

The initialization data is defined in `src/lib/db/initialize_data.sql`. This script:
- Inserts 15 users
- Inserts 15 categories
- Inserts 20 items
- Inserts 20 reviews
- All required fields are populated (no NULL values)

Run with:
```bash
psql $DATABASE_URL -f src/lib/db/initialize_data.sql
```

---

## Error Handling and Comments

### Error Handling

The codebase includes error handling for:
1. **Database Connection Errors**: Throws clear error messages when DATABASE_URL is missing or connection fails
2. **Validation Errors**: Server actions validate user input and throw descriptive errors
3. **Ownership Errors**: Users can only modify their own reviews
4. **Not Found Errors**: Operations verify data exists before proceeding

### Code Comments

All database operations include comments explaining:
- Purpose of each function
- SQL operations being performed
- Parameter descriptions
- Return value documentation

Example from `src/lib/actions/reviewActions.ts`:
```typescript
/**
 * Create a new review for an item.
 */
export async function createReview(input: CreateReviewInput): Promise<Review> { ... }

/**
 * Fetch all reviews for a given item, including the reviewer's username.
 */
export async function getReviewsByItemId(itemId: number): Promise<ReviewWithUser[]> { ... }
```

---

## Permissions and Path

### File Permissions

All source files have standard read permissions. To run the application:
- Read: Required for all source files
- Write: Required for `.env.local` (created during setup)
- Execute: Not required (run via npm scripts)

### Absolute Paths

Key paths for configuration:

| Path | Description |
|------|-------------|
| `/Users/username/reviewIT/src/lib/db/create_schema.sql` | Database schema script |
| `/Users/username/reviewIT/src/lib/db/initialize_data.sql` | Data initialization script |
| `/Users/username/reviewIT/.env.local` | Database configuration |

Relative path from project root:
```bash
# Schema script
src/lib/db/create_schema.sql

# Initialization script
src/lib/db/initialize_data.sql

# Environment configuration
.env.local
```

---

## Reset Database

To start fresh:
```bash
dropdb reviewit
createdb reviewit
psql $DATABASE_URL -f src/lib/db/create_schema.sql
psql $DATABASE_URL -f src/lib/db/initialize_data.sql
```

---

## Tech Stack

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

A live database query viewer - perfect for demonstrations, debugging, and teaching database concepts.

### Enable Demo Mode

Append `?demo=true` to any URL (only needed once):

```
http://localhost:3000/search?demo=true
http://localhost:3000/item/1?demo=true
```

### How It Works

- When `?demo=true` is present, a cookie is set and the terminal appears (bottom-right)
- **Persists across pages** - Navigate normally, the `?demo=true` param is auto-added to URLs
- **Persists on reload** - Cookie keeps demo mode active even after browser refresh
- All database queries are intercepted and displayed in real-time
- Each query shows: operation type, table name, duration, and row count
- Queries are color-coded:
  - [SELECT] - Data retrieval
  - [INSERT] - Data creation
  - [UPDATE] - Data modification
  - [DELETE] - Data removal

### Usage for Presentations

1. Visit any page with `?demo=true` (e.g., `/search?demo=true`)
2. The terminal appears - navigate freely, it persists
3. Perform actions as normal - the audience watches SQL execute in real-time
4. To disable: click the **Off** button in the terminal header

### Demo Mode Controls

- **Off button** - Disables demo mode, removes cookie, hides terminal
- **Toggle** - Click the terminal header to collapse/expand
- **Clear** - Button to clear the log display
- **Click to expand** - Click any log entry to see full SQL

### Production Safety

- **Default: OFF** - Zero overhead when not in demo mode
- Terminal only appears when:
  - `?demo=true` is in the URL, OR
  - The `demo_mode` cookie is set
- Remove the cookie or click "Off" to disable completely
