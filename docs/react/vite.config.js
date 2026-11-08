import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

// Resolve Ktheme react package location (supports sibling checkout or nested)
const kthemeReactCandidate = [
  path.resolve(__dirname, "../../../Ktheme/packages/react"),
  path.resolve(__dirname, "../../Ktheme/packages/react"),
  "/app/Ktheme/packages/react",
].find((dir) => fs.existsSync(path.resolve(dir, "src/index.ts")));

const kthemeReactEntry = kthemeReactCandidate
  ? path.resolve(kthemeReactCandidate, "src/index.ts")
  : path.resolve(__dirname, "src/support/kthemeFallback.js");

const kthemeStudioEntry = kthemeReactCandidate
  ? path.resolve(kthemeReactCandidate, "src/studio/index.ts")
  : path.resolve(__dirname, "src/support/kthemeFallback.js");

const kthemeSupportEntry = kthemeReactCandidate
  ? path.resolve(kthemeReactCandidate, "src/support/index.ts")
  : path.resolve(__dirname, "src/support/kthemeFallback.js");

// This app is a standalone dev/build sandbox that lives under docs/react in the
// linkpoint-design repo. It is not currently wired into any parent site's base
// path, so base is left at the default "/". Adjust if you deploy it elsewhere.
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@ktheme/react/studio": kthemeStudioEntry,
      "@ktheme/react/support": kthemeSupportEntry,
      "@ktheme/react": kthemeReactEntry,
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: [
      "src/theme/color.test.js",
      "src/**/*.test.jsx",
      "src/**/__tests__/*.jsx",
    ],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "src/components/SystemDialog.test.js",
      "src/components/component-sizing.test.js",
      "src/hooks/useFocusTrap.test.js",
    ],
  },
});
