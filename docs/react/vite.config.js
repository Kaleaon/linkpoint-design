import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

// Resolve Ktheme react package location (supports sibling checkout, installed node_modules, or nested)
const kthemeReactDir = [
  path.resolve(__dirname, "../../../Ktheme/packages/react"),
  path.resolve(__dirname, "../../Ktheme/packages/react"),
  path.resolve(__dirname, "node_modules/@ktheme/react"),
  "/app/Ktheme/packages/react",
].find((dir) => fs.existsSync(dir));

const kthemeAliases = kthemeReactDir
  ? {
      "@ktheme/react/studio": path.resolve(
        kthemeReactDir,
        "src/studio/index.ts",
      ),
      "@ktheme/react/support": path.resolve(
        kthemeReactDir,
        "src/support/index.ts",
      ),
      "@ktheme/react": path.resolve(kthemeReactDir, "src/index.ts"),
    }
  : {};

// This app is a standalone dev/build sandbox that lives under docs/react in the
// linkpoint-design repo. It is not currently wired into any parent site's base
// path, so base is left at the default "/". Adjust if you deploy it elsewhere.
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: kthemeAliases,
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
