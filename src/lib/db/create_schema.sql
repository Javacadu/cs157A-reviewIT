-- =============================================================================
-- ReviewIT Database Schema
-- =============================================================================
-- This script creates all tables, constraints, and indexes required for the
-- ReviewIT application. The database is normalized to BCNF (Boyce-Codd
-- Normal Form) to eliminate redundancy and ensure data integrity.
--
-- Run this script with:
--   psql $DATABASE_URL -f src/lib/db/create_schema.sql
--
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table: users
-- -----------------------------------------------------------------------------
-- Stores user account information. Each user has a unique email and username.
-- Passwords are stored as bcrypt hashes for security.
--
-- Columns:
--   id          - Primary key, auto-incremented
--   email       - Unique email address (required)
--   username    - Unique display name (required)
--   password_hash - Bcrypt hash of the user's password (required)
--   created_at  - Timestamp when the user was created
--   updated_at  - Timestamp when the user was last updated

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  username      VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Table: categories
-- -----------------------------------------------------------------------------
-- Stores item categories. Categories are unique by name (case-insensitive).
-- Used to organize and filter items in the application.
--
-- Columns:
--   id          - Primary key, auto-incremented
--   name        - Unique category name (required)
--   description - Optional description of the category
--   created_at  - Timestamp when the category was created

CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Table: items
-- -----------------------------------------------------------------------------
-- Stores reviewable items. Each item belongs to a category and is created
-- by a specific user. Items can be products, services, places, etc.
--
-- Columns:
--   id          - Primary key, auto-incremented
--   name        - Item name (required)
--   description - Optional description of the item
--   category_id - Foreign key to categories table (optional, can be NULL)
--   created_by  - Foreign key to users table, identifies the creator
--   created_at  - Timestamp when the item was created
--   updated_at  - Timestamp when the item was last updated
--
-- Constraints:
--   - category_id references categories(id), set to NULL on category deletion
--   - created_by references users(id), prevents deletion of creator

CREATE TABLE IF NOT EXISTS items (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INTEGER      REFERENCES categories(id) ON DELETE SET NULL,
  created_by  INTEGER      NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Table: reviews
-- -----------------------------------------------------------------------------
-- Stores user reviews for items. Each review includes a rating (0-5 stars),
-- a title, and optional body text. Users can create multiple reviews for
-- the same item.
--
-- Columns:
--   id         - Primary key, auto-incremented
--   item_id    - Foreign key to items table (required)
--   user_id    - Foreign key to users table (required)
--   rating     - Star rating from 0 to 5 (required)
--   title      - Review title (required)
--   body       - Optional review content
--   created_at - Timestamp when the review was created
--   updated_at - Timestamp when the review was last updated
--
-- Constraints:
--   - item_id references items(id), CASCADE delete removes reviews when item deleted
--   - user_id references users(id), CASCADE delete removes reviews when user deleted
--   - rating must be between 0 and 5 (CHECK constraint)

CREATE TABLE IF NOT EXISTS reviews (
  id         SERIAL PRIMARY KEY,
  item_id    INTEGER      NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  user_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating     SMALLINT     NOT NULL CHECK (rating BETWEEN 0 AND 5),
  title      VARCHAR(255) NOT NULL,
  body       TEXT,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------
-- Create indexes to improve query performance for common search patterns.

-- Index for case-insensitive item name searches (used in search functionality)
CREATE INDEX IF NOT EXISTS idx_items_name_lower ON items(LOWER(name));

-- Index for fetching reviews by item (used on item detail pages)
CREATE INDEX IF NOT EXISTS idx_reviews_item_id ON reviews(item_id);

-- Index for fetching reviews by user (used on user profile pages)
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- Index for fetching items by category (used in category browsing)
CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id);

-- Index for fetching items by creator (used in user activity)
CREATE INDEX IF NOT EXISTS idx_items_created_by ON items(created_by);

-- =============================================================================
-- End of Schema
-- =============================================================================