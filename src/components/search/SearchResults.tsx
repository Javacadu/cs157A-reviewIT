import getSql from "@/lib/db";
import type { ItemWithCategory } from "@/types";
import Link from "next/link";

interface SearchResultsProps {
  query: string;
}

export default async function SearchResults({ query }: SearchResultsProps) {
  const sql = getSql();
  // postgres.js safely parameterizes all interpolated values, so the wildcard
  // characters here are part of the bound parameter, not raw SQL.
  const pattern = `%${query}%`;
  const items = await sql<ItemWithCategory[]>`
    SELECT i.*, c.name AS category_name
    FROM items i
    JOIN categories c ON c.id = i.category_id
    WHERE i.name ILIKE ${pattern}
       OR i.description ILIKE ${pattern}
    ORDER BY i.name
    LIMIT 50
  `;

  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No results found for &ldquo;{query}&rdquo;.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {items.map((item) => (
        <li key={item.id} className="py-4">
          <Link
            href={`/item/${item.id}`}
            className="text-blue-600 hover:underline font-medium"
          >
            {item.name}
          </Link>
          <span className="ml-2 text-xs text-gray-400">
            {item.category_name}
          </span>
          {item.description && (
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {item.description}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
