"use server";

import bcrypt from "bcryptjs";

import getSql from "@/lib/db";
import type { User } from "@/types";
import { setSession, clearSession } from "@/lib/auth/session";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface AuthSuccess {
  success: true;
  data: {
    userId: number;
    username: string;
  };
}

export interface AuthFailure {
  success: false;
  error: string;
}

export type RegisterResult = AuthSuccess | AuthFailure;
export type LoginResult = AuthSuccess | AuthFailure;
export type LogoutResult = AuthSuccess | AuthFailure;

// ---------------------------------------------------------------------------
// Server Actions
// ---------------------------------------------------------------------------

/**
 * Register a new user with unique username and email.
 * - Validates username uniqueness, returns error "Username taken, try another" if duplicate
 * - Validates email uniqueness, returns error "Email already registered" if duplicate
 * - Hashes password and creates user in database
 * - Returns success with user id
 */
export async function register(input: RegisterInput): Promise<RegisterResult> {
  const sql = getSql();
  const { username, email, password } = input;

  // Validate required fields
  if (!username || username.trim().length === 0) {
    return { success: false, error: "Username is required" };
  }
  if (!email || email.trim().length === 0) {
    return { success: false, error: "Email is required" };
  }
  if (!password || password.length === 0) {
    return { success: false, error: "Password is required" };
  }

  // Check if username already exists
  const [existingUsername] = await sql<User[]>`
    SELECT id FROM users WHERE username = ${username}
  `;
  if (existingUsername) {
    return { success: false, error: "Username taken, try another" };
  }

  // Check if email already exists
  const [existingEmail] = await sql<User[]>`
    SELECT id FROM users WHERE email = ${email}
  `;
  if (existingEmail) {
    return { success: false, error: "Email already registered" };
  }

  // Hash password and create user
  const passwordHash = await bcrypt.hash(password, 10);

  const [newUser] = await sql<User[]>`
    INSERT INTO users (username, email, password_hash)
    VALUES (${username}, ${email}, ${passwordHash})
    RETURNING id, username
  `;

  return {
    success: true,
    data: {
      userId: newUser.id,
      username: newUser.username,
    },
  };
}

/**
 * Authenticate user by username and password.
 * - Looks up user by username
 * - Verifies password against stored hash
 * - Returns error "Invalid username or password" if failed
 * - Returns success with user id and username on success
 */
export async function login(input: LoginInput): Promise<LoginResult> {
  const sql = getSql();
  const { username, password } = input;

  if (!username || username.trim().length === 0) {
    return { success: false, error: "Invalid username or password" };
  }
  if (!password || password.length === 0) {
    return { success: false, error: "Invalid username or password" };
  }

  // Look up user by username
  const [user] = await sql<User[]>`
    SELECT id, username, password_hash
    FROM users
    WHERE username = ${username}
  `;

  if (!user) {
    return { success: false, error: "Invalid username or password" };
  }

  // Verify password
  const passwordValid = await bcrypt.compare(password, user.password_hash);
  if (!passwordValid) {
    return { success: false, error: "Invalid username or password" };
  }

  // Set session cookie using existing session module
  await setSession(user.id, user.username);

  return {
    success: true,
    data: {
      userId: user.id,
      username: user.username,
    },
  };
}

/**
 * Logout the current user by clearing the session cookie.
 */
export async function logout(): Promise<LogoutResult> {
  // Clear the session cookie
  await clearSession();

  return {
    success: true,
    data: {
      userId: 0,
      username: "",
    },
  };
}

// ---------------------------------------------------------------------------
// Wrapper functions for UI (useFormState compatibility)
// ---------------------------------------------------------------------------

interface FormState {
  success?: boolean;
  errors?: {
    form?: string[];
    username?: string[];
    email?: string[];
    password?: string[];
  };
}

/**
 * Wrapper for register compatible with useActionState
 */
export async function registerUser(
  _prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  try {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("[registerUser] Received:", { username, email, password });

    const result = await register({ username, email, password });

    console.log("[registerUser] Result:", result);

    if (result.success) {
      // Set session after successful registration
      await setSession(result.data.userId, result.data.username);
      return { success: true };
    }

    return {
      success: false,
      errors: {
        form: [result.error],
      },
    };
  } catch (error) {
    console.error("[registerUser] Error:", error);
    return {
      success: false,
      errors: {
        form: [error instanceof Error ? error.message : "Registration failed"],
      },
    };
  }
}

/**
 * Wrapper for login compatible with useFormState
 */
export async function loginUser(
  _prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const result = await login({ username, password });

  if (result.success) {
    return { success: true };
  }

  return {
    success: false,
    errors: {
      form: [result.error],
    },
  };
}