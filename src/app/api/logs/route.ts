import { NextResponse } from "next/server";
import { getLogs, getAllLogs, clearLogs } from "@/lib/db/logger";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sinceId = parseInt(searchParams.get("since") || "0", 10);
  const action = searchParams.get("action");

  if (action === "getAll") {
    return NextResponse.json({ logs: getAllLogs() });
  }

  return NextResponse.json({ logs: getLogs(sinceId) });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "clear") {
    clearLogs();
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}