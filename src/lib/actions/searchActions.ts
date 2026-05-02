"use server";

import getSql from "@/lib/db";

export interface SearchSuggestion {
  id: number;
  name: string;
  category_name: string;
}

/**
 * Get search suggestions based on a partial query.
 * Returns up to 7 items with weighted relevance ranking:
 * 1. Exact name match
 * 2. Name prefix match
 * 3. Name contains match
 * 4. Description prefix match
 * 5. Description contains match
 * Within each tier, sorts by relevance score (name matches weighted higher).
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
  const exact = trimmed;

  const suggestions = await sql<SearchSuggestion[]>`
    SELECT i.id, i.name, c.name AS category_name,
      CASE
        WHEN i.name = ${exact} THEN 0
        WHEN i.name ILIKE ${prefix} THEN 1
        WHEN i.name ILIKE ${pattern} THEN 2
        WHEN i.description ILIKE ${prefix} THEN 3
        ELSE 4
      END AS rank,
      CASE
        WHEN i.name ILIKE ${pattern} THEN 10
        ELSE 0
      END +
      CASE
        WHEN i.description ILIKE ${pattern} THEN 5
        ELSE 0
      END AS relevance_score
    FROM items i
    JOIN categories c ON c.id = i.category_id
    WHERE i.name ILIKE ${pattern}
       OR i.description ILIKE ${pattern}
    ORDER BY rank, relevance_score DESC, i.name
    LIMIT 7
  `;

  return suggestions;
}