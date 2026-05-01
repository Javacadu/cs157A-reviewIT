"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import type { QueryLog } from "@/lib/db/logger";

const COOKIE_NAME = "demo_mode";

const COLORS = {
  SELECT: "bg-blue-100 text-blue-700 border-blue-300",
  INSERT: "bg-green-100 text-green-700 border-green-300",
  UPDATE: "bg-orange-100 text-orange-700 border-orange-300",
  DELETE: "bg-red-100 text-red-700 border-red-300",
};

const ICONS = {
  SELECT: "🔵",
  INSERT: "🟢",
  UPDATE: "🟠",
  DELETE: "🔴",
};

function getCookie(name: string): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim().startsWith(`${name}=true`));
}

function setCookie(name: string, value: boolean, days: number = 365): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/;SameSite=Lax`;
}

function removeCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

interface LogEntryProps {
  log: QueryLog;
  isLatest: boolean;
}

function LogEntry({ log, isLatest }: LogEntryProps) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLatest && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isLatest]);

  return (
    <div
      ref={ref}
      className={`border-b border-gray-700 py-2 px-3 hover:bg-gray-800 transition-colors ${isLatest ? "bg-gray-800" : ""}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-2 text-sm">
        <span className={`px-2 py-0.5 rounded border text-xs font-mono ${COLORS[log.operation]}`}>
          {ICONS[log.operation]} {log.operation}
        </span>
        <span className="font-mono text-gray-300">{log.table}</span>
        <span className="text-gray-500 text-xs">({log.duration.toFixed(1)}ms)</span>
        {log.rows > 0 && (
          <span className="text-gray-500 text-xs">[rows: {log.rows}]</span>
        )}
      </div>
      <div className={`font-mono text-xs text-gray-400 mt-1 truncate ${expanded ? "whitespace-pre-wrap break-all" : "truncate"}`}>
        {expanded ? log.sql : log.sql.slice(0, 100) + (log.sql.length > 100 ? "..." : "")}
      </div>
    </div>
  );
}

export default function SqlTerminal() {
  const searchParams = useSearchParams();
  const urlDemo = searchParams.get("demo");

  const [demoState, setDemoState] = useState<"loading" | "enabled" | "disabled">("loading");
  const [isVisible, setIsVisible] = useState(true);
  const [logs, setLogs] = useState<QueryLog[]>([]);

  useEffect(() => {
    const cookieEnabled = getCookie(COOKIE_NAME);
    if (urlDemo === "true" && !cookieEnabled) {
      setCookie(COOKIE_NAME, true);
    }
    if (urlDemo === "true" || cookieEnabled) {
      setDemoState("enabled");
    } else {
      setDemoState("disabled");
    }
  }, [urlDemo]);

  useEffect(() => {
    if (demoState !== "enabled") return;
    
    if (!searchParams.get("demo")) {
      const newUrl = `${window.location.pathname}${window.location.search ? window.location.search + "&" : "?"}demo=true${window.location.hash}`;
      window.history.replaceState(null, "", newUrl);
    }
  }, [demoState, searchParams]);

  useEffect(() => {
    if (demoState !== "enabled") return;

    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/logs?action=getAll");
        const data = await res.json();
        if (data.logs && data.logs.length > 0) {
          setLogs(data.logs);
        }
      } catch (e) {
        console.error("Failed to fetch logs:", e);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 500);

    return () => clearInterval(interval);
  }, [demoState]);

  if (demoState !== "enabled") {
    return null;
  }

  const handleClear = async () => {
    setLogs([]);
    try {
      await fetch("/api/logs?action=clear", { method: "POST" });
    } catch (e) {
      console.error("Failed to clear logs:", e);
    }
  };

  const handleDisable = () => {
    removeCookie(COOKIE_NAME);
    setDemoState("disabled");
    setIsVisible(false);
    const newUrl = window.location.pathname + window.location.search.replace(/[?&]demo=true/, "");
    window.history.replaceState(null, "", newUrl);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isVisible ? (
        <button
          onClick={() => setIsVisible(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700 text-sm"
        >
          📊 SQL Logs
        </button>
      ) : (
        <div className="bg-gray-900 rounded-lg shadow-2xl border border-gray-700 w-[400px] max-h-[350px] flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-gray-800 rounded-t-lg">
            <span className="text-white font-semibold text-sm">📊 SQL Query Log</span>
            <div className="flex gap-2">
              <button
                onClick={handleClear}
                className="text-xs text-gray-400 hover:text-white px-2 py-1"
              >
                Clear
              </button>
              <button
                onClick={handleDisable}
                className="text-xs text-red-400 hover:text-red-300 px-2 py-1"
                title="Disable demo mode"
              >
                Off
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white text-lg leading-none"
              >
                ×
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto font-mono">
            {logs.length === 0 ? (
              <div className="text-gray-500 text-sm p-4 text-center">
                Waiting for queries...
              </div>
            ) : (
              logs.map((log, idx) => (
                <LogEntry
                  key={log.id}
                  log={log}
                  isLatest={idx === logs.length - 1}
                />
              ))
            )}
          </div>
          <div className="px-3 py-2 border-t border-gray-700 text-xs text-gray-500 flex gap-3">
            <span>🔵 SELECT</span>
            <span>🟢 INSERT</span>
            <span>🟠 UPDATE</span>
            <span>🔴 DELETE</span>
          </div>
        </div>
      )}
    </div>
  );
}