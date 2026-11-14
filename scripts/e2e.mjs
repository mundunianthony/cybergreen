#!/usr/bin/env node
/**
 * Browser test runner. Builds the site twice, because the Formspree IDs are baked in at build time:
 *   1. without Formspree IDs  -> all general tests plus the original WhatsApp/email form flow
 *   2. with test Formspree IDs -> the Formspree submission flow (network is mocked in the tests)
 * Finally rebuilds dist/ with your real environment so the folder is left deployable.
 *
 * Extra arguments are passed to Playwright, e.g. `npm run test:e2e -- --project=desktop`.
 */
import { spawnSync } from "node:child_process";

const extra = process.argv.slice(2);
let failed = false;

function run(label, command, env = {}) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, { stdio: "inherit", shell: true, env: { ...process.env, ...env } });
  return result.status === 0;
}

const noFormspree = { PUBLIC_FORMSPREE_CONTACT_ID: "", PUBLIC_FORMSPREE_PICKUP_ID: "" };
const testFormspree = { PUBLIC_FORMSPREE_CONTACT_ID: "testcontact1", PUBLIC_FORMSPREE_PICKUP_ID: "testpickup1" };
const args = extra.map((a) => JSON.stringify(a)).join(" ");

if (!run("Build without Formspree", "npx astro build", noFormspree)) process.exit(1);
// Run every phase even if an earlier one failed (no short-circuiting).
if (!run("Browser tests (default mode)", `npx playwright test --grep-invert @formspree ${args}`)) failed = true;

if (!run("Build with test Formspree IDs", "npx astro build", testFormspree)) process.exit(1);
if (!run("Browser tests (Formspree mode)", `npx playwright test --grep @formspree ${args}`)) failed = true;

if (!run("Rebuild dist/ with the real environment", "npx astro build")) process.exit(1);
process.exit(failed ? 1 : 0);
