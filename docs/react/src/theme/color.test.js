import { test, assert } from "vitest";
import { lum, ratio, pickInk, lumCache, hexToRgba } from "./color.js";

test("lum: returns consistent luminance for hex inputs and caches results", () => {
  lumCache.clear();
  assert.equal(lumCache.size, 0);

  const whiteLum = lum("#FFFFFF");
  assert.equal(whiteLum, 1);
  assert.equal(lumCache.has("#FFFFFF"), true);
  assert.equal(lumCache.get("#FFFFFF"), 1);

  // Subsequent call should return cached value
  const cachedWhiteLum = lum("#FFFFFF");
  assert.equal(cachedWhiteLum, 1);

  const blackLum = lum("#000000");
  assert.equal(blackLum, 0);
  assert.equal(lumCache.has("#000000"), true);

  // 3-digit hex format
  const shortWhiteLum = lum("#fff");
  assert.equal(shortWhiteLum, 1);
  assert.equal(lumCache.has("#fff"), true);
});

test("lum: handles non-hex color formats and caches them", () => {
  lumCache.clear();

  const rgbWhite = lum("rgb(255, 255, 255)");
  assert.equal(rgbWhite, 1);
  assert.equal(lumCache.has("rgb(255, 255, 255)"), true);

  const rgbBlack = lum("rgba(0, 0, 0, 1)");
  assert.equal(rgbBlack, 0);
  assert.equal(lumCache.has("rgba(0, 0, 0, 1)"), true);
});

test("lum: falls back gracefully on invalid inputs without corrupting cache key", () => {
  lumCache.clear();

  const invalidLum = lum("not-a-color");
  assert.equal(invalidLum, 0.5);
  assert.equal(lumCache.has("not-a-color"), true);
  assert.equal(lumCache.get("not-a-color"), 0.5);

  const nullLum = lum(null);
  assert.equal(nullLum, 0.5);

  const undefinedLum = lum(undefined);
  assert.equal(undefinedLum, 0.5);
});

test("ratio: computes contrast ratio correctly with string colors and numeric luminance", () => {
  const r1 = ratio("#FFFFFF", "#000000");
  assert.equal(r1, 21);

  // Pre-calculated luminance
  const r2 = ratio(1, "#000000");
  assert.equal(r2, 21);

  const r3 = ratio(0, 1);
  assert.equal(r3, 21);
});

test("pickInk: picks optimal ink for hex and non-hex backgrounds", () => {
  lumCache.clear();

  // Dark hex background -> should pick #FFFFFF
  const inkDark = pickInk("#000000", ["#111111", "#222222"]);
  assert.equal(inkDark, "#FFFFFF");

  // Light hex background -> should pick #000000 as highest contrast candidate
  const inkLight = pickInk("#FFFFFF", ["#EEEEEE", "#333333"]);
  assert.equal(inkLight, "#000000");

  // Non-hex dark background -> should pick #FFFFFF
  const inkRgbDark = pickInk("rgb(15, 15, 15)", ["#222222"]);
  assert.equal(inkRgbDark, "#FFFFFF");

  // Non-hex light background -> should pick dark ink #000000
  const inkRgbLight = pickInk("rgb(240, 240, 240)", ["#111111"]);
  assert.equal(inkRgbLight, "#000000");
});

test("pickInk: hoists background luminance so bg lum is calculated once and cached", () => {
  lumCache.clear();

  const bg = "#1a1a1a";
  const candidates = ["#333333", "#666666", "#999999", "#CCCCCC"];

  const chosenInk = pickInk(bg, candidates);
  assert.equal(chosenInk, "#FFFFFF");

  // Background luminance must be in cache
  assert.equal(lumCache.has(bg), true);
  // Candidates must also be in cache
  for (const c of candidates) {
    assert.equal(lumCache.has(c), true);
  }
});

test("hexToRgba: converts 3-character and 6-character hex colors to rgba strings", () => {
  assert.equal(hexToRgba("#6CFF9A", 0.12), "rgba(108, 255, 154, 0.12)");
  assert.equal(hexToRgba("#6CFF9A"), "rgba(108, 255, 154, 1)");
  assert.equal(hexToRgba("#fff", 0.5), "rgba(255, 255, 255, 0.5)");
  assert.equal(hexToRgba("00f0ff", 0.8), "rgba(0, 240, 255, 0.8)");
});

test("hexToRgba: handles invalid, non-hex, null, or undefined inputs gracefully", () => {
  assert.equal(hexToRgba("rgba(108, 255, 154, 0.12)", 0.5), "rgba(108, 255, 154, 0.12)");
  assert.equal(hexToRgba("invalid-color", 0.2), "invalid-color");
  assert.equal(hexToRgba(null), null);
  assert.equal(hexToRgba(undefined), undefined);
});

