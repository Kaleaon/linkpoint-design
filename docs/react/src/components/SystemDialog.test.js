import { test, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

test("SystemDialog.jsx contains WAI-ARIA dialog attributes", () => {
  const filePath = path.resolve("src/components/SystemDialog.jsx");
  const code = fs.readFileSync(filePath, "utf8");

  // Check role="dialog"
  expect(code).toContain('role="dialog"');
  // Check aria-modal="true"
  expect(code).toContain('aria-modal="true"');
  // Check aria-labelledby="dialog-title"
  expect(code).toContain('aria-labelledby="dialog-title"');
  // Check aria-describedby="dialog-desc"
  expect(code).toContain('aria-describedby="dialog-desc"');
  // Check title ID binding
  expect(code).toContain('id="dialog-title"');
  // Check description ID binding
  expect(code).toContain('id="dialog-desc"');
  // Check useFocusTrap hook import and usage
  expect(code).toContain("useFocusTrap(");
});
