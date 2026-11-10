import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

// Resolve Ktheme react package location (supports sibling checkout, installed node_modules, or nested)
const candidateDirs = [
  path.resolve(__dirname, "../../../Ktheme/packages/react"),
  path.resolve(__dirname, "../../Ktheme/packages/react"),
  path.resolve(__dirname, "node_modules/@ktheme/react"),
  "/app/Ktheme/packages/react",
];
const kthemeReactDir = candidateDirs.find((dir) =>
  fs.existsSync(path.join(dir, "src/index.ts"))
);
const fallbackMockPath = path.resolve(
  __dirname,
  "src/mocks/ktheme-react-mock.js"
);

const kthemeAliases = kthemeReactDir
  ? {
      "@ktheme/react/studio": path.resolve(
        kthemeReactDir,
        "src/studio/index.ts"
      ),
      "@ktheme/react/support": path.resolve(
        kthemeReactDir,
        "src/support/index.ts"
      ),
      "@ktheme/react": path.resolve(kthemeReactDir, "src/index.ts"),
    }
  : fs.existsSync(fallbackMockPath)
  ? {
      "@ktheme/react/studio": fallbackMockPath,
      "@ktheme/react/support": fallbackMockPath,
      "@ktheme/react": fallbackMockPath,
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
