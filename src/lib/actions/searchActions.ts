"use server";

import getSql from "@/lib/db";

export interface SearchSuggestion {
  id: number;
  name: string;
  category_name: string;
}

/**
 * Get search suggestions based on a partial query.
 * Returns up to 5 items matching the query for autocomplete dropdown.
 */
export async function getSearchSuggestions(
  query: string
): Promise<SearchSuggestion[]> {
  const sql = getSql();
  const trimmed = query.trim();

  // Return empty array for very short queries
  if (trimmed.length < 2) {
    return [];
  }

  const pattern = `%${trimmed}%`;
  const prefix = `${trimmed}%`;

  // Simple ordering: exact prefix matches first, then alphabetically
  const suggestions = await sql<SearchSuggestion[]>`
    SELECT i.id, i.name, c.name AS category_name,
      CASE WHEN i.name ILIKE ${prefix} THEN 0 ELSE 1 END AS rank
    FROM items i
    JOIN categories c ON c.id = i.category_id
    WHERE i.name ILIKE ${pattern}
       OR i.description ILIKE ${pattern}
    ORDER BY rank, i.name
    LIMIT 5
  `;

  return suggestions;
}