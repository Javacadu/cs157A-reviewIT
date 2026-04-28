"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createItem, createCategory, type CreateItemInput } from "@/lib/actions/itemActions";
import { getSearchSuggestions, type SearchSuggestion } from "@/lib/actions/searchActions";
import TextInput from "@/components/ui/TextInput";
import TextArea from "@/components/ui/TextArea";
import SelectInput from "@/components/ui/SelectInput";
import StarRating from "@/components/ui/StarRating";
import type { Category } from "@/types";

interface NewItemFormProps {
  categories: Category[];
  initialName?: string;
}

export default function NewItemForm({ categories, initialName }: NewItemFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryMode, setCategoryMode] = useState<"select" | "new">("select");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [rating, setRating] = useState(0);

  const [itemQuery, setItemQuery] = useState(initialName || "");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (itemQuery.trim().length >= 2) {
        setSuggestionsLoading(true);
        const results = await getSearchSuggestions(itemQuery);
        setSuggestions(results);
        setShowDropdown(results.length > 0);
        setSuggestionsLoading(false);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [itemQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    let categoryId = Number(formData.get("categoryId"));
    const categoryNameValue = formData.get("categoryName") as string;

    if (categoryMode === "new") {
      if (!categoryNameValue || categoryNameValue.trim().length === 0) {
        setError("Category name is required");
        setLoading(false);
        return;
      }
      const category = await createCategory(categoryNameValue);
      categoryId = category.id;
    }

    const input: CreateItemInput = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      categoryId,
      rating,
      reviewTitle: formData.get("reviewTitle") as string,
    };

    const result = await createItem(input);

    if (result.success) {
      window.history.replaceState({}, "", "/");
      router.push(`/item/${result.itemId}`);
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  function handleSuggestionClick(suggestion: SearchSuggestion) {
    setItemQuery(suggestion.name);
    setShowDropdown(false);
    setSuggestions([]);
  }

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <div ref={wrapperRef} className="relative">
        <TextInput
          id="name"
          name="name"
          label="Name"
          required
          value={itemQuery}
          onChange={(e) => setItemQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          placeholder="Enter item name"
        />
        {showDropdown && (
          <ul className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
            {suggestionsLoading ? (
              <li className="px-3 py-2 text-sm text-gray-500">Loading...</li>
            ) : (
              suggestions.map((suggestion) => (
                <li key={suggestion.id}>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-900">
                      {suggestion.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {suggestion.category_name}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <TextInput
          id="reviewTitle"
          name="reviewTitle"
          label="Review Title"
          required
          placeholder="Enter a title for your review"
        />

      <TextArea
        id="description"
        name="description"
        label="Description"
        rows={4}
        placeholder="Optional description"
      />

      <div>
        {categoryMode === "select" ? (
          <>
            <SelectInput
              id="categoryId"
              name="categoryId"
              label="Category"
              required
              options={[
                ...categoryOptions,
                { value: "__new__", label: "+ Add new category" },
              ]}
              placeholder="Select a category"
              onChange={(e) => {
                if (e.target.value === "__new__") {
                  setCategoryMode("new");
                }
              }}
            />
          </>
        ) : (
          <div className="space-y-2">
            <TextInput
              id="categoryName"
              name="categoryName"
              label="New Category"
              required
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter new category name"
            />
            <button
              type="button"
              onClick={() => {
                setCategoryMode("select");
                setNewCategoryName("");
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to select
            </button>
          </div>
        )}
      </div>

      <StarRating value={rating} onChange={setRating} required />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-[var(--foreground)] px-4 py-2 text-[var(--background)] transition-colors hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Review"}
      </button>
    </form>
  );
}