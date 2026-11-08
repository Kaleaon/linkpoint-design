import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

// Resolve Ktheme react package location (supports sibling checkout, nested, container mount, or fallback shim)
const kthemeShimPath = path.resolve(__dirname, "src/theme/kthemeShim.js");
const candidateDirs = [
  path.resolve(__dirname, "../../../Ktheme/packages/react"),
  path.resolve(__dirname, "../../Ktheme/packages/react"),
  path.resolve(__dirname, "../../../../Ktheme/packages/react"),
  path.resolve(process.cwd(), "../Ktheme/packages/react"),
  path.resolve(process.cwd(), "../../Ktheme/packages/react"),
  "/app/Ktheme/packages/react",
];

const kthemeReactDir = candidateDirs.find((dir) => fs.existsSync(dir));

const kthemeReactAlias = kthemeReactDir
  ? path.resolve(kthemeReactDir, "src/index.ts")
  : kthemeShimPath;
const kthemeStudioAlias = kthemeReactDir
  ? path.resolve(kthemeReactDir, "src/studio/index.ts")
  : kthemeShimPath;
const kthemeSupportAlias = kthemeReactDir
  ? path.resolve(kthemeReactDir, "src/support/index.ts")
  : kthemeShimPath;

// This app is a standalone dev/build sandbox that lives under docs/react in the
// linkpoint-design repo. It is not currently wired into any parent site's base
// path, so base is left at the default "/". Adjust if you deploy it elsewhere.
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@ktheme/react/studio": kthemeStudioAlias,
      "@ktheme/react/support": kthemeSupportAlias,
      "@ktheme/react": kthemeReactAlias,
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
