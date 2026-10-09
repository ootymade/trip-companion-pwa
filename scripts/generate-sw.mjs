// Stamps a per-deploy build id into the service worker's cache name so
// every deploy gets a genuinely new cache, letting the old one be cleaned
// up on activate (see src/sw-template.js). Runs via npm's prebuild/predev
// lifecycle hooks — no manual step needed.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const buildId =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 10) ??
  process.env.GITHUB_SHA?.slice(0, 10) ??
  Date.now().toString(36);

const template = readFileSync(path.join(root, "src", "sw-template.js"), "utf8");
writeFileSync(path.join(root, "public", "sw.js"), template.replaceAll("__BUILD_ID__", buildId));

console.log(`generate-sw: wrote public/sw.js with build id "${buildId}"`);
