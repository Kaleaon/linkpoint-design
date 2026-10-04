import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("MenuBar component sizing meets target requirements", () => {
  const fileContent = fs.readFileSync(path.join(__dirname, "MenuBar.jsx"), "utf8");

  // Outer menu bar height must be 32px
  assert.match(fileContent, /height:\s*"32px"/);

  // Dropdown menu top position must be 32px
  assert.match(fileContent, /top:\s*"32px"/);

  // Dropdown item minHeight must be at least 32px
  assert.match(fileContent, /minHeight:\s*"32px"/);
});

test("Header component status badge sizing meets target requirements", () => {
  const fileContent = fs.readFileSync(path.join(__dirname, "Header.jsx"), "utf8");

  // Status badge container height must be 32px and padding 0 12px
  assert.match(fileContent, /height:\s*"32px"/);
  assert.match(fileContent, /padding:\s*"0 12px"/);
});

test("SegmentedTabs float tab height and padding meet target requirements", () => {
  const fileContent = fs.readFileSync(path.join(__dirname, "SegmentedTabs.jsx"), "utf8");

  // Float tab item minHeight: 28px, height: 28px, padding: 0 12px
  assert.match(fileContent, /minHeight:\s*"28px"/);
  assert.match(fileContent, /height:\s*"28px"/);
  assert.match(fileContent, /padding:\s*"0 12px"/);
});

test("ConsoleFrame dock slot remove button size meets target requirements", () => {
  const fileContent = fs.readFileSync(path.join(__dirname, "ConsoleFrame.jsx"), "utf8");

  // Remove button width 24px, height 24px, borderRadius 12px
  assert.match(fileContent, /width:\s*"24px"/);
  assert.match(fileContent, /height:\s*"24px"/);
  assert.match(fileContent, /borderRadius:\s*"12px"/);

  // Centered vertical alignment
  assert.ok(
    fileContent.includes('alignItems: "center"') || fileContent.includes("lineHeight"),
    "dock edit remove button should center text vertically"
  );
});

test("FloatersDesktop control button target sizes meet target requirements", () => {
  const fileContent = fs.readFileSync(path.join(__dirname, "FloatersDesktop.jsx"), "utf8");

  // Minimize button width/height 24px
  assert.match(fileContent, /aria-label="Minimize"/);

  // Close button width/height 24px
  assert.match(fileContent, /aria-label="Close"/);

  // Camera HUD close button target size 24px x 24px
  assert.match(fileContent, /width:\s*"24px"/);
  assert.match(fileContent, /height:\s*"24px"/);

  // Count instances of width: "24px" and height: "24px" in FloatersDesktop
  const width24Matches = (fileContent.match(/width:\s*"24px"/g) || []).length;
  const height24Matches = (fileContent.match(/height:\s*"24px"/g) || []).length;
  assert.ok(width24Matches >= 3, `Expected at least 3 elements with width 24px, got ${width24Matches}`);
  assert.ok(height24Matches >= 3, `Expected at least 3 elements with height 24px, got ${height24Matches}`);
});
