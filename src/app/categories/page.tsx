import Link from "next/link";
import { getCategories } from "@/lib/actions/itemActions";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 bg-white">
      <h1 className="mb-2 text-3xl font-bold">Browse by Category</h1>
      <p className="mb-8 text-gray-500">Select a category to see all items.</p>

      {categories.length === 0 ? (
        <p className="text-sm text-gray-500">No categories yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/categories/${category.id}`}
                className="block rounded-lg border border-gray-200 px-5 py-4 hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <span className="text-lg font-semibold text-blue-700">
                  {category.name}
                </span>
                {category.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
