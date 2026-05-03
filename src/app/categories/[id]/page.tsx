import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategories, getItemsByCategory } from "@/lib/actions/itemActions";

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const categoryId = Number(id);

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    notFound();
  }

  const [categories, items] = await Promise.all([
    getCategories(),
    getItemsByCategory(categoryId),
  ]);

  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 bg-white">
      <div className="mb-1 text-sm text-gray-400">
        <Link href="/categories" className="hover:text-blue-600">
          Categories
        </Link>
        {" / "}
        <span>{category.name}</span>
      </div>

      <h1 className="mb-2 text-3xl font-bold">{category.name}</h1>
      {category.description && (
        <p className="mb-6 text-gray-500">{category.description}</p>
      )}

      <p className="mb-4 text-sm text-gray-400">
        {items.length} {items.length === 1 ? "item" : "items"}
      </p>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No items in this category yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {items.map((item) => (
            <li key={item.id} className="py-4">
              <Link
                href={`/item/${item.id}`}
                className="text-blue-600 hover:underline font-medium"
              >
                {item.name}
              </Link>
              {item.description && (
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {item.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
