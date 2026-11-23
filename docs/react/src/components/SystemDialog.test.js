import { test, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

// Since the Accessible Dialog Portal refactor, SystemDialog no longer
// renders dialog semantics itself: it delegates them to
// AccessibleDialogPortal and binds its title/description ids through it.
// These assertions follow that split — ids and wiring in SystemDialog.jsx,
// the ARIA attributes themselves in AccessibleDialogPortal.jsx.
test("SystemDialog delegates WAI-ARIA dialog attributes to AccessibleDialogPortal", () => {
  const dialogCode = fs.readFileSync(
    path.resolve("src/components/SystemDialog.jsx"),
    "utf8"
  );
  const portalCode = fs.readFileSync(
    path.resolve("src/components/AccessibleDialogPortal.jsx"),
    "utf8"
  );

  // SystemDialog renders through the portal and binds its ids to it
  expect(dialogCode).toContain("AccessibleDialogPortal");
  expect(dialogCode).toContain('ariaLabelledby="dialog-title"');
  expect(dialogCode).toContain('ariaDescribedby="dialog-desc"');
  // Title and description elements carry the referenced ids
  expect(dialogCode).toContain('id="dialog-title"');
  expect(dialogCode).toContain('id="dialog-desc"');

  // The portal supplies the dialog semantics
  expect(portalCode).toContain('role = "dialog"');
  expect(portalCode).toContain('aria-modal="true"');
  expect(portalCode).toContain("aria-labelledby={ariaLabelledby}");
  expect(portalCode).toContain("aria-describedby={ariaDescribedby}");
  // And manages focus while open (focus stack registration)
  expect(portalCode).toContain("useFocusStack()");
});
