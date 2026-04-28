"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createItem, type CreateItemInput } from "@/lib/actions/itemActions";
import type { Category } from "@/types";

interface NewItemFormProps {
  categories: Category[];
}

export default function NewItemForm({ categories }: NewItemFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const input: CreateItemInput = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      categoryId: Number(formData.get("categoryId")),
    };

    const result = await createItem(input);

    if (result.success) {
      router.push(`/item/${result.itemId}`);
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={255}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="Enter item name"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="Optional description"
        />
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          defaultValue=""
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-[var(--foreground)] px-4 py-2 text-[var(--background)] transition-colors hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Item"}
      </button>
    </form>
  );
}