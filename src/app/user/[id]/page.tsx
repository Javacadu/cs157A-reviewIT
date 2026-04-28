import { notFound } from "next/navigation";
import Link from "next/link";
import getSql from "@/lib/db";
import type { ReviewWithItem, ItemWithCategory } from "@/types";

interface UserRow {
  id: number;
  username: string;
  created_at: Date;
}

interface UserPageProps {
  params: Promise<{ id: string }>;
}

async function getUser(id: number): Promise<UserRow | null> {
  const sql = getSql();
  const users = await sql<UserRow[]>`
    SELECT id, username, created_at
    FROM users
    WHERE id = ${id}
  `;
  return users[0] ?? null;
}

async function getUserReviews(userId: number): Promise<ReviewWithItem[]> {
  const sql = getSql();
  const reviews = await sql<ReviewWithItem[]>`
    SELECT r.*, i.name AS item_name
    FROM reviews r
    JOIN items i ON i.id = r.item_id
    WHERE r.user_id = ${userId}
    ORDER BY r.created_at DESC
  `;
  return reviews;
}

async function getUserItems(userId: number): Promise<ItemWithCategory[]> {
  const sql = getSql();
  const items = await sql<ItemWithCategory[]>`
    SELECT items.*, categories.name AS category_name
    FROM items
    JOIN categories ON categories.id = items.category_id
    WHERE items.created_by = ${userId}
    ORDER BY items.created_at DESC
  `;
  return items;
}

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params;
  const userId = Number(id);

  if (!Number.isInteger(userId) || userId <= 0) {
    notFound();
  }

  const user = await getUser(userId);

  if (!user) {
    notFound();
  }

  const joinDate = user.created_at.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const reviews = await getUserReviews(userId);
  const items = await getUserItems(userId);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">{user.username}</h1>
      <div className="mb-8 text-sm text-gray-500">
        <time dateTime={user.created_at.toISOString()}>Joined {joinDate}</time>
      </div>
      <hr className="mb-8 border-gray-200" />
      <h2 className="mb-4 text-2xl font-semibold">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="mb-8 text-gray-500">No reviews yet.</p>
      ) : (
        <ul className="mb-8 space-y-4">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <Link
                href={`/item/${review.item_id}`}
                className="mb-2 block text-sm text-gray-500 hover:text-blue-600"
              >
                Review for {review.item_name}
              </Link>
              <div className="flex items-center justify-between">
                <span
                  className="flex items-center gap-0.5 text-yellow-500 text-sm"
                  role="img"
                  aria-label={`Rated ${review.rating} out of 5 stars`}
                >
                  <span aria-hidden="true">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </span>
              </div>
              <h3 className="mt-2 font-semibold text-gray-900">{review.title}</h3>
              {review.body && (
                <p className="mt-1 text-sm text-gray-600">{review.body}</p>
              )}
              <p className="mt-2 text-xs text-gray-400">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
      <hr className="mb-8 border-gray-200" />
      <h2 className="mb-4 text-2xl font-semibold">Items</h2>
      {items.length === 0 ? (
        <p className="mb-8 text-gray-500">No items yet.</p>
      ) : (
        <ul className="mb-8 space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
            >
              <Link
                href={`/item/${item.id}`}
                className="text-blue-600 hover:underline"
              >
                {item.name}
              </Link>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                  {item.category_name}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}