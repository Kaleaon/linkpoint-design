import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

const kthemeReactPath = fs.existsSync(
  path.resolve(__dirname, "../../Ktheme/packages/react/src/index.ts")
)
  ? path.resolve(__dirname, "../../Ktheme/packages/react/src")
  : path.resolve(__dirname, "../../../Ktheme/packages/react/src");

// This app is a standalone dev/build sandbox that lives under docs/react in the
// linkpoint-design repo. It is not currently wired into any parent site's base
// path, so base is left at the default "/". Adjust if you deploy it elsewhere.
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@ktheme/react/studio": path.resolve(kthemeReactPath, "studio/index.ts"),
      "@ktheme/react/support": path.resolve(
        kthemeReactPath,
        "support/index.ts"
      ),
      "@ktheme/react": path.resolve(kthemeReactPath, "index.ts"),
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
