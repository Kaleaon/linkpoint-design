import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("SystemDialog.jsx contains WAI-ARIA dialog attributes", () => {
  const filePath = path.resolve("src/components/SystemDialog.jsx");
  const code = fs.readFileSync(filePath, "utf8");

  // Check role="dialog"
  assert.ok(code.includes('role="dialog"'), 'SystemDialog must specify role="dialog"');
  // Check aria-modal="true"
  assert.ok(code.includes('aria-modal="true"'), 'SystemDialog must specify aria-modal="true"');
  // Check aria-labelledby="dialog-title"
  assert.ok(code.includes('aria-labelledby="dialog-title"'), 'SystemDialog must specify aria-labelledby="dialog-title"');
  // Check aria-describedby="dialog-desc"
  assert.ok(code.includes('aria-describedby="dialog-desc"'), 'SystemDialog must specify aria-describedby="dialog-desc"');
  // Check title ID binding
  assert.ok(code.includes('id="dialog-title"'), 'SystemDialog must assign id="dialog-title" to title element');
  // Check description ID binding
  assert.ok(code.includes('id="dialog-desc"'), 'SystemDialog must assign id="dialog-desc" to description element');
  // Check useFocusTrap hook import and usage
  assert.ok(code.includes('useFocusTrap('), 'SystemDialog must invoke useFocusTrap hook');
});
