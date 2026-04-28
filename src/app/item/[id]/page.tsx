import { notFound } from "next/navigation";
import getSql from "@/lib/db";
import type { ItemWithDetails } from "@/types";
import ReviewList from "@/components/reviews/ReviewList";

interface ItemPageProps {
  params: Promise<{ id: string }>;
}

async function getItem(id: number): Promise<ItemWithDetails | null> {
  const sql = getSql();
  const items = await sql<ItemWithDetails[]>`
    SELECT i.*, c.name AS category_name, u.username AS creator_username
    FROM items i
    JOIN categories c ON c.id = i.category_id
    JOIN users u ON u.id = i.created_by
    WHERE i.id = ${id}
  `;
  return items[0] ?? null;
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { id } = await params;
  const itemId = Number(id);

  if (!Number.isInteger(itemId) || itemId <= 0) {
    notFound();
  }

  const item = await getItem(itemId);

  if (!item) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 bg-white">
      <h1 className="mb-2 text-3xl font-bold">{item.name}</h1>
      <div className="mb-4 flex items-center gap-3 text-sm text-gray-500">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
          {item.category_name}
        </span>
        <span>Created by {item.creator_username}</span>
        <time dateTime={item.created_at.toISOString()}>
          {item.created_at.toLocaleDateString()}
        </time>
      </div>
      {item.description && (
        <p className="mb-8 text-lg text-gray-700">{item.description}</p>
      )}
      <hr className="mb-8 border-gray-200" />
      <h2 className="mb-4 text-2xl font-semibold">Reviews</h2>
      <ReviewList itemId={itemId} />
    </main>
  );
}
