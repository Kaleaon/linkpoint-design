import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

// Resolve Ktheme react package location (supports sibling checkout, devbox, or local fallback shim)
const kthemeCandidate = [
  path.resolve(__dirname, "../../../Ktheme/packages/react"),
  path.resolve(__dirname, "../../Ktheme/packages/react"),
  "/app/Ktheme/packages/react",
].find((dir) => fs.existsSync(dir));

const kthemeReactDir =
  kthemeCandidate || path.resolve(__dirname, "src/support/ktheme-shim");
const isShim = !kthemeCandidate;

const kthemeAliases = isShim
  ? {
      "@ktheme/react/studio": path.resolve(kthemeReactDir, "studio.js"),
      "@ktheme/react/support": path.resolve(kthemeReactDir, "support.js"),
      "@ktheme/react": path.resolve(kthemeReactDir, "index.js"),
    }
  : {
      "@ktheme/react/studio": fs.existsSync(
        path.resolve(kthemeReactDir, "src/studio/index.ts")
      )
        ? path.resolve(kthemeReactDir, "src/studio/index.ts")
        : path.resolve(__dirname, "src/support/ktheme-shim/studio.js"),
      "@ktheme/react/support": fs.existsSync(
        path.resolve(kthemeReactDir, "src/support/index.ts")
      )
        ? path.resolve(kthemeReactDir, "src/support/index.ts")
        : path.resolve(__dirname, "src/support/ktheme-shim/support.js"),
      "@ktheme/react": path.resolve(kthemeReactDir, "src/index.ts"),
    };

// This app is a standalone dev/build sandbox that lives under docs/react in the
// linkpoint-design repo. It is not currently wired into any parent site's base
// path, so base is left at the default "/". Adjust if you deploy it elsewhere.
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      ...kthemeAliases,
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
