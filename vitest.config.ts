import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Unit tests only; browser tests in tests/e2e run under Playwright.
    include: ["tests/**/*.test.ts"],
  },
});
