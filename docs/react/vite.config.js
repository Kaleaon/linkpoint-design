import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This app is a standalone dev/build sandbox that lives under docs/react in the
// linkpoint-design repo. It is not currently wired into any parent site's base
// path, so base is left at the default "/". Adjust if you deploy it elsewhere.
export default defineConfig({
  base: "./",
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    exclude: ["**/node_modules/**", "**/SystemDialog.test.js", "**/component-sizing.test.js", "**/useFocusTrap.test.js"],
  },
});
