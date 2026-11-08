import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

// Resolve Ktheme react package location (supports sibling checkout or nested)
const candidateDirs = [
  path.resolve(__dirname, "../../../Ktheme/packages/react"),
  path.resolve(__dirname, "../../Ktheme/packages/react"),
  "/app/Ktheme/packages/react",
];
const kthemeReactDir = candidateDirs.find((dir) =>
  fs.existsSync(path.join(dir, "src/index.ts"))
);
const fallbackMockPath = path.resolve(
  __dirname,
  "src/mocks/ktheme-react-mock.js"
);

// This app is a standalone dev/build sandbox that lives under docs/react in the
// linkpoint-design repo. It is not currently wired into any parent site's base
// path, so base is left at the default "/". Adjust if you deploy it elsewhere.
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@ktheme/react/studio": kthemeReactDir
        ? path.resolve(kthemeReactDir, "src/studio/index.ts")
        : fallbackMockPath,
      "@ktheme/react/support": kthemeReactDir
        ? path.resolve(kthemeReactDir, "src/support/index.ts")
        : fallbackMockPath,
      "@ktheme/react": kthemeReactDir
        ? path.resolve(kthemeReactDir, "src/index.ts")
        : fallbackMockPath,
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
