import postgres, { type Sql } from "postgres";
import { logQuery } from "./logger";

declare global {
  var _pgPool: ReturnType<typeof postgres> | undefined;
  var _sqlProxy: Sql | undefined;
}

function wrapSql(sql: Sql): Sql {
  const original = sql as typeof sql & { _wrapped?: boolean };
  if (original._wrapped) return original;
  original._wrapped = true;

  const proxy = new Proxy(sql, {
    apply(target, thisArg, args) {
      const start = performance.now();
      const result = Reflect.apply(target, thisArg, args);
      
      if (result instanceof Promise) {
        return result.then((data: unknown) => {
          const duration = performance.now() - start;
          const rows = Array.isArray(data) ? data.length : (data ? 1 : 0);
          logQuery(args[0], duration, rows);
          return data;
        }) as typeof result;
      }

      const duration = performance.now() - start;
      logQuery(args[0], duration, 0);
      return result;
    },
  });

  return proxy as typeof sql;
}

export function getSql(): ReturnType<typeof postgres> {
  if (globalThis._pgPool) {
    if (!globalThis._sqlProxy) {
      globalThis._sqlProxy = wrapSql(globalThis._pgPool);
    }
    return globalThis._sqlProxy;
  }

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
    globalThis._sqlProxy = wrapSql(pool);
  }

  return globalThis._sqlProxy || pool;
}

export default getSql;


