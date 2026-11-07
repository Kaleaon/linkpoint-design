import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

// Resolve Ktheme package path supporting both sibling and repo-relative locations
const kthemePkg = (sub) => {
  const siblingPath = path.resolve(__dirname, "../../../Ktheme/packages", sub);
  const localPath = path.resolve(__dirname, "../../Ktheme/packages", sub);
  return fs.existsSync(siblingPath) ? siblingPath : localPath;
};

// This app is a standalone dev/build sandbox that lives under docs/react in the
// linkpoint-design repo. It is not currently wired into any parent site's base
// path, so base is left at the default "/". Adjust if you deploy it elsewhere.
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@ktheme/react/studio": kthemePkg("react/src/studio/index.ts"),
      "@ktheme/react/support": kthemePkg("react/src/support/index.ts"),
      "@ktheme/react": kthemePkg("react/src/index.ts"),
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
