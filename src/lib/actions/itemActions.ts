"use server";

import { revalidatePath } from "next/cache";

import getSql from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import type { Item, Category } from "@/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CreateItemInput {
  name: string;
  description?: string;
  categoryId: number;
  rating: number;
  reviewTitle: string;
}

export interface CreateItemSuccess {
  success: true;
  itemId: number;
  isNewItem: boolean;
}

export interface CreateItemFailure {
  success: false;
  error: string;
}

export type CreateItemResult = CreateItemSuccess | CreateItemFailure;

// ---------------------------------------------------------------------------
// Server Actions
// ---------------------------------------------------------------------------

/**
 * Create a new item.
 * - Requires authenticated user
 * - Validates name and category are provided
 * - Returns error for unauthenticated users
 */
export async function createItem(
  input: CreateItemInput
): Promise<CreateItemResult> {
  const sql = getSql();
  const session = await getSession();

  if (!session) {
    return { success: false, error: "You must be logged in to create an item" };
  }

  const { name, description, categoryId, rating, reviewTitle } = input;

  if (!name || name.trim().length === 0) {
    return { success: false, error: "Name is required" };
  }

  if (rating === undefined || rating < 0 || rating > 5) {
    return { success: false, error: "Rating is required and must be between 0 and 5" };
  }

  if (!reviewTitle || reviewTitle.trim().length === 0) {
    return { success: false, error: "Review title is required" };
  }

  if (categoryId) {
    const [category] = await sql<Category[]>`
      SELECT id FROM categories WHERE id = ${categoryId}
    `;

    if (!category) {
      return { success: false, error: "Invalid category" };
    }
  }

  const [existing] = await sql<Item[]>`
    SELECT id FROM items WHERE LOWER(name) = LOWER(${name.trim()})
  `;

  let itemId: number;
  let isNewItem = false;

  if (existing) {
    itemId = existing.id;
  } else {
    const [newItem] = await sql<Item[]>`
      INSERT INTO items (name, description, category_id, created_by)
      VALUES (${name.trim()}, ${description?.trim() || null}, ${categoryId}, ${session.userId})
      RETURNING id
    `;
    itemId = newItem.id;
    isNewItem = true;
  }

  await sql`
    INSERT INTO reviews (item_id, user_id, rating, title, body)
    VALUES (${itemId}, ${session.userId}, ${rating}, ${reviewTitle.trim()}, ${description?.trim() || null})
  `;

  revalidatePath("/search");

  return {
    success: true,
    itemId,
    isNewItem,
  };
}

/**
 * Get all categories for the category select dropdown.
 */
export async function getCategories(): Promise<Category[]> {
  const sql = getSql();
  return sql<Category[]>`
    SELECT id, name, description, created_at
    FROM categories
    ORDER BY name
  `;
}

/**
 * Create a new category or return existing one if found (case-insensitive).
 * Normalizes input: trims whitespace and compares case-insensitively.
 */
export async function createCategory(name: string): Promise<Category> {
  const sql = getSql();
  const normalizedName = name.trim();

  if (!normalizedName || normalizedName.length === 0) {
    throw new Error("Category name is required");
  }

  const [existing] = await sql<Category[]>`
    SELECT id, name, description, created_at
    FROM categories
    WHERE LOWER(TRIM(name)) = LOWER(${normalizedName})
  `;

  if (existing) {
    return existing;
  }

  const [category] = await sql<Category[]>`
    INSERT INTO categories (name)
    VALUES (${normalizedName})
    RETURNING id, name, description, created_at
  `;

  return category;
}
