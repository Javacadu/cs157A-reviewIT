"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { User, LogOut } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NavbarUser {
  userId: number;
  username: string;
}

export interface NavbarProps {
  user?: NavbarUser | null;
}

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

// Always initialize with "/" to avoid hydration mismatch
// The actual history is loaded in useEffect (client-only)
function initHistory(): string[] {
  return ["/"];
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [history, setHistory] = useState<string[]>(() => initHistory());
  const historyRef = useRef<string[]>(history);

  // Keep ref in sync with state
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  // Sync history when pathname changes (non-blocking)
  // Uses requestIdleCallback pattern via setTimeout to avoid setState in effect
  useEffect(() => {
    const updateHistory = () => {
      const stored = getHistory();
      const lastPath = stored[stored.length - 1];

      if (lastPath !== pathname) {
        const pageIndex = stored.indexOf(pathname);
        let newHistory: string[];

        if (pageIndex !== -1) {
          // Going back - truncate forward history
          newHistory = stored.slice(0, pageIndex + 1);
        } else {
          // New page - add to history
          newHistory = [...stored, pathname];
        }

        saveHistory(newHistory);
        historyRef.current = newHistory;
        setHistory(newHistory);
      }
    };

    // Defer to next tick to avoid setState in effect
    const timeoutId = setTimeout(updateHistory, 0);
    return () => clearTimeout(timeoutId);
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

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.href = "/";
    }
  }, []);

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
              : "border-gray-200 text-gray-300"
          } ${hasHistory ? "" : "cursor-not-allowed"}`}
          suppressHydrationWarning
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
        {user ? (
          <>
            <Link href="/item/new" className="hover:text-blue-600 flex items-center gap-1">
              <span>Add Item</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href={`/user/${user.userId}`}
                className="flex flex-col items-center hover:text-blue-600"
              >
                <User size={18} />
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 p-1"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </>
        ) : (
          <Link href="/auth" className="hover:text-blue-600">
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}