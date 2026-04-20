"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { getSearchSuggestions } from "@/lib/actions/searchActions";
import type { SearchSuggestion } from "@/lib/actions/searchActions";

interface SearchBarProps {
  initialQuery?: string;
}

export default function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounced fetch suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setLoading(true);
        const results = await getSearchSuggestions(query);
        setSuggestions(results);
        setShowDropdown(results.length > 0);
        setLoading(false);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 200); // 200ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  function handleSuggestionClick(suggestion: SearchSuggestion) {
    setQuery(suggestion.name);
    setShowDropdown(false);
    router.push(`/item/${suggestion.id}`);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            placeholder="Search for anything…"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search query"
            aria-expanded={showDropdown}
            aria-autocomplete="list"
            autoComplete="off"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Autocomplete dropdown */}
      {showDropdown && (
        <ul className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id}>
              <button
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-gray-50"
              >
                <span className="font-medium text-gray-900">
                  {suggestion.name}
                </span>
                <span className="text-xs text-gray-400">
                  {suggestion.category_name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
