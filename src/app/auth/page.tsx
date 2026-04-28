"use client";

import { useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { registerUser, loginUser } from "@/lib/actions/authActions";

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function SubmitButton({
  pendingText,
  children,
}: {
  pendingText?: string;
  children: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-[var(--foreground)] px-4 py-2 text-[var(--background)] transition-colors hover:opacity-90 disabled:opacity-50"
    >
      {pending ? pendingText : children}
    </button>
  );
}

function FormError({
  errors,
}: {
  errors?: string[];
}) {
  if (!errors || errors.length === 0) return null;

  return (
    <ul className="mb-4 space-y-1">
      {errors.map((error, index) => (
        <li key={index} className="text-sm text-red-600">
          {error}
        </li>
      ))}
    </ul>
  );
}

interface AuthFormProps {
  mode?: "login" | "register";
}

function RegisterForm({}: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const result = await response.json();

      console.log("[RegisterForm] Result:", result);

      if (result.success) {
        window.location.href = "/";
      } else {
        setError(result.error || "Registration failed");
        setLoading(false);
      }
    } catch (err) {
      console.error("[RegisterForm] Error:", err);
      setError(err instanceof Error ? err.message : "Registration failed");
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
        <label htmlFor="register-username" className="block text-sm font-medium">
          Username <span className="text-red-500">*</span>
        </label>
        <input
          id="register-username"
          name="username"
          type="text"
          required
          minLength={1}
          maxLength={100}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="Choose a username"
        />
      </div>

      <div>
        <label htmlFor="register-email" className="block text-sm font-medium">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="register-password" className="block text-sm font-medium">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          id="register-password"
          name="password"
          type="password"
          required
          minLength={6}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="Min 6 characters"
        />
      </div>

      <SubmitButton pendingText={loading ? "Creating account..." : undefined}>
        Create Account
      </SubmitButton>
    </form>
  );
}

function LoginForm({}: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
        window.location.href = "/";
      } else {
        setError(result.error || "Invalid username or password");
        setLoading(false);
      }
    } catch (err) {
      console.error("[LoginForm] Error:", err);
      setError(err instanceof Error ? err.message : "Login failed");
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
        <label htmlFor="login-username" className="block text-sm font-medium">
          Username <span className="text-red-500">*</span>
        </label>
        <input
          id="login-username"
          name="username"
          type="text"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="Your username"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="block text-sm font-medium">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="Your password"
        />
      </div>

      <SubmitButton pendingText={loading ? "Signing in..." : undefined}>Sign In</SubmitButton>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <main className="mx-auto max-w-md px-4 py-10 bg-white">
      <h1 className="mb-6 text-center text-3xl font-bold text-[var(--foreground)]">
        {mode === "login" ? "Welcome Back" : "Create Account"}
      </h1>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {mode === "login" ? <LoginForm /> : <RegisterForm />}

        <div className="mt-6 text-center text-sm">
          {mode === "login" ? (
            <>
              {"Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="font-medium text-[var(--foreground)] underline hover:no-underline"
              >
                Create one
              </button>
            </>
          ) : (
            <>
              {"Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="font-medium text-[var(--foreground)] underline hover:no-underline"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
