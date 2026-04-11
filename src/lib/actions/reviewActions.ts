"use server";

import getSql from "@/lib/db";
import type { Review, ReviewWithUser } from "@/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CreateReviewInput {
  item_id: number;
  user_id: number;
  rating: number;
  title: string;
  body?: string;
}

export interface UpdateReviewInput {
  rating?: number;
  title?: string;
  body?: string;
}

// ---------------------------------------------------------------------------
// Server Actions
// ---------------------------------------------------------------------------

/**
 * Create a new review for an item.
 */
export async function createReview(
  input: CreateReviewInput
): Promise<Review> {
  const sql = getSql();
  const { item_id, user_id, rating, title, body } = input;

  const [review] = await sql<Review[]>`
    INSERT INTO reviews (item_id, user_id, rating, title, body)
    VALUES (${item_id}, ${user_id}, ${rating}, ${title}, ${body ?? null})
    RETURNING *
  `;

  return review;
}

/**
 * Fetch all reviews for a given item, including the reviewer's username.
 */
export async function getReviewsByItemId(
  itemId: number
): Promise<ReviewWithUser[]> {
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

/**
 * Update an existing review.
 * Only fields provided in the input object will be updated.
 */
export async function updateReview(
  reviewId: number,
  userId: number,
  input: UpdateReviewInput
): Promise<Review> {
  const sql = getSql();
  // Build a partial update: only touch columns that were supplied
  const updates: Partial<Pick<Review, "rating" | "title" | "body">> & {
    updated_at?: Date;
  } = {
    ...input,
    updated_at: new Date(),
  };

  const [updated] = await sql<Review[]>`
    UPDATE reviews
    SET ${sql(updates)}
    WHERE id = ${reviewId}
      AND user_id = ${userId}
    RETURNING *
  `;

  if (!updated) {
    throw new Error(
      `Review ${reviewId} not found or you do not have permission to update it.`
    );
  }

  return updated;
}

/**
 * Delete a review.
 * The userId guard ensures users can only delete their own reviews.
 */
export async function deleteReview(
  reviewId: number,
  userId: number
): Promise<void> {
  const sql = getSql();
  const result = await sql`
    DELETE FROM reviews
    WHERE id = ${reviewId}
      AND user_id = ${userId}
  `;

  if (result.count === 0) {
    throw new Error(
      `Review ${reviewId} not found or you do not have permission to delete it.`
    );
  }
}
