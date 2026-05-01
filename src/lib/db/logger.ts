export interface QueryLog {
  id: number;
  timestamp: string;
  operation: "SELECT" | "INSERT" | "UPDATE" | "DELETE";
  table: string;
  sql: string;
  duration: number;
  rows: number;
}

const MAX_ENTRIES = 25;

// Use globalThis to persist across hot reloads in dev mode
declare global {
  var _sqlLogs: QueryLog[] | undefined;
  var _sqlLogId: number | undefined;
}

function getLogsStorage(): { logs: QueryLog[]; nextId: number } {
  if (!globalThis._sqlLogs) {
    globalThis._sqlLogs = [];
    globalThis._sqlLogId = 1;
  }
  return { logs: globalThis._sqlLogs, nextId: globalThis._sqlLogId ?? 1 };
}

function setLogId(id: number): void {
  if (!globalThis._sqlLogId) globalThis._sqlLogId = 1;
  globalThis._sqlLogId = id;
}

function parseOperation(sql: unknown): { operation: QueryLog["operation"]; table: string } {
  // Handle postgres.js template literal arrays or strings
  let sqlStr = "";
  if (Array.isArray(sql)) {
    sqlStr = sql.join(" ");
  } else if (typeof sql === "string") {
    sqlStr = sql;
  } else if (sql && typeof sql === "object" && "sql" in sql) {
    // Handle query object with sql property
    sqlStr = (sql as { sql: unknown }).sql as string;
  }
  
  const trimmed = sqlStr.trim().toUpperCase();
  
  if (trimmed.startsWith("SELECT")) {
    const fromMatch = trimmed.match(/FROM\s+(\w+)/i);
    return { operation: "SELECT", table: fromMatch?.[1] || "unknown" };
  }
  if (trimmed.startsWith("INSERT")) {
    const intoMatch = trimmed.match(/INTO\s+(\w+)/i);
    return { operation: "INSERT", table: intoMatch?.[1] || "unknown" };
  }
  if (trimmed.startsWith("UPDATE")) {
    const updateMatch = trimmed.match(/UPDATE\s+(\w+)/i);
    return { operation: "UPDATE", table: updateMatch?.[1] || "unknown" };
  }
  if (trimmed.startsWith("DELETE")) {
    const fromMatch = trimmed.match(/FROM\s+(\w+)/i);
    return { operation: "DELETE", table: fromMatch?.[1] || "unknown" };
  }
  return { operation: "SELECT", table: "unknown" };
}

export function logQuery(sql: unknown, duration: number, rows: number = 0): void {
  const sqlString = Array.isArray(sql) ? sql.join(" ") : String(sql);
  const { operation, table } = parseOperation(sql);
  
  const { logs, nextId } = getLogsStorage();
  
  const entry: QueryLog = {
    id: nextId,
    timestamp: new Date().toISOString(),
    operation,
    table,
    sql: sqlString.slice(0, 300),
    duration,
    rows,
  };

  logs.push(entry);
  setLogId(nextId + 1);
  
  if (logs.length > MAX_ENTRIES) {
    logs.shift();
  }
}

export function getLogs(sinceId: number = 0): QueryLog[] {
  const { logs } = getLogsStorage();
  return logs.filter(log => log.id > sinceId);
}

export function clearLogs(): void {
  globalThis._sqlLogs = [];
  globalThis._sqlLogId = 1;
}

export function getAllLogs(): QueryLog[] {
  const { logs } = getLogsStorage();
  return [...logs];
}