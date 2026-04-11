import postgres from "postgres";

/**
 * Singleton postgres.js connection pool.
 *
 * DATABASE_URL is validated lazily (on first query) so that this module can be
 * imported during build-time static analysis without requiring the env variable.
 *
 * In development, Next.js hot-reloads modules, so we attach the pool to the
 * Node.js global object to prevent creating a new pool on every reload.
 */
declare global {
  var _pgPool: ReturnType<typeof postgres> | undefined;
}

export function getSql(): ReturnType<typeof postgres> {
  if (globalThis._pgPool) return globalThis._pgPool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
        "Please add it to your .env.local file."
    );
  }

  const pool = postgres(connectionString);

  if (process.env.NODE_ENV !== "production") {
    globalThis._pgPool = pool;
  }

  return pool;
}

export default getSql;


