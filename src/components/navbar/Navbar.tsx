"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const STORAGE_KEY = "navHistory";

function getHistory(): string[] {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return ["/"];
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : ["/"];
  } catch {
    return ["/"];
  }
}

function saveHistory(history: string[]) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [history, setHistory] = useState<string[]>(() => getHistory());

  // useEffect is the sole source of truth for history management
  // This handles: nav clicks, browser back/forward, direct URL access
  useEffect(() => {
    const stored = getHistory();
    const lastPath = stored[stored.length - 1];

    if (lastPath !== pathname) {
      const pageIndex = stored.indexOf(pathname);
      if (pageIndex !== -1) {
        // Going back - truncate forward history
        const newHistory = stored.slice(0, pageIndex + 1);
        saveHistory(newHistory);
        setHistory(newHistory);
      } else {
        // New page - add to history
        const newHistory = [...stored, pathname];
        saveHistory(newHistory);
        setHistory(newHistory);
      }
    }
  }, [pathname]);

  const hasHistory = history.length > 1;

  // Custom back navigation using sessionStorage history
  const handleBack = useCallback(() => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const previousPath = newHistory[newHistory.length - 1];
      saveHistory(newHistory);
      setHistory(newHistory);
      router.push(previousPath);
    }
  }, [history, router]);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-bold text-blue-600">
          ReviewIT
        </Link>

        {/* Back Button */}
        <button
          onClick={handleBack}
          disabled={!hasHistory}
          className={`text-sm px-3 py-1.5 rounded border transition-colors ${
            hasHistory
              ? "border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              : "border-gray-200 text-gray-300 cursor-not-allowed"
          }`}
          aria-label="Go back to previous page"
        >
          ← Back
        </button>
      </div>

      <nav className="flex gap-4 text-sm text-gray-600">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>
        <Link href="/search" className="hover:text-blue-600">
          Browse
        </Link>
        <Link href="/auth" className="hover:text-blue-600">
          Sign in
        </Link>
      </nav>
    </header>
  );
}