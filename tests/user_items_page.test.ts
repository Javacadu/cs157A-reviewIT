import { test, expect } from "bun:test";

// Verify that the user page module can be imported without error and exposes a default export that is a function
test("User page module can be imported without error and has a default export function", async () => {
  const mod = await import("../src/app/user/[id]/page");
  expect(mod).toBeDefined();
  expect(typeof mod.default).toBe("function");
});

// Type-level check: ensure the default export is a function type (server component signature)
test("Default export has a callable server component type", () => {
  type PageType = typeof import("../src/app/user/[id]/page").default;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type IsFunction = PageType extends (...args: any[]) => any ? true : false;
  const _ok: IsFunction = true;
  expect(_ok).toBe(true);
});
