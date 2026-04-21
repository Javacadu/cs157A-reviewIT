"use server";

import { cookies } from "next/headers";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SessionData {
  userId: number;
  username: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const COOKIE_NAME = "session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// ---------------------------------------------------------------------------
// Cookie Configuration
// ---------------------------------------------------------------------------

/**
 * Returns cookie options based on environment.
 * In production, secure cookies are enforced.
 */
function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    maxAge: MAX_AGE_SECONDS,
    path: "/",
  };
}

// ---------------------------------------------------------------------------
// Session Functions
// ---------------------------------------------------------------------------

/**
 * Creates a session and sets the session cookie.
 *
 * @param userId - The user's ID
 * @param username - The user's username
 */
export async function setSession(userId: number, username: string): Promise<void> {
  // Simple token format: userId:username (base64 encoded for slight obfuscation)
  // For production, consider using a UUID or JWT instead
  const token = Buffer.from(`${userId}:${username}`).toString("base64");

  const cookieStore = await cookies();
  const options = getCookieOptions();

  cookieStore.set(options.name, token, {
    httpOnly: options.httpOnly,
    secure: options.secure,
    sameSite: options.sameSite,
    maxAge: options.maxAge,
    path: options.path,
  });
}

/**
 * Reads the session cookie and returns the session data.
 *
 * @returns Session data { userId, username } if valid, null if not logged in
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const decoded = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
    const [userIdStr, username] = decoded.split(":");

    const userId = parseInt(userIdStr, 10);

    if (isNaN(userId) || !username) {
      return null;
    }

    return { userId, username };
  } catch {
    // Invalid cookie format
    return null;
  }
}

/**
 * Clears the session cookie (logs the user out).
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}