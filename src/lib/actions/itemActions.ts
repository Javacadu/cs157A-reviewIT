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
}

export interface CreateItemSuccess {
  success: true;
  itemId: number;
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

  const { name, description, categoryId } = input;

  // Validate required fields
  if (!name || name.trim().length === 0) {
    return { success: false, error: "Name is required" };
  }

  if (!categoryId || categoryId <= 0) {
    return { success: false, error: "Category is required" };
  }

  // Verify category exists
  const [category] = await sql<Category[]>`
    SELECT id FROM categories WHERE id = ${categoryId}
  `;

  if (!category) {
    return { success: false, error: "Invalid category" };
  }

  // Check if item with same name already exists
  const [existing] = await sql<Item[]>`
    SELECT id FROM items WHERE LOWER(name) = LOWER(${name.trim()})
  `;

  if (existing) {
    return { success: false, error: "An item with this name already exists" };
  }

  // Create the item
  const [newItem] = await sql<Item[]>`
    INSERT INTO items (name, description, category_id, created_by)
    VALUES (${name.trim()}, ${description?.trim() || null}, ${categoryId}, ${session.userId})
    RETURNING id
  `;

  revalidatePath("/search");

  return {
    success: true,
    itemId: newItem.id,
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