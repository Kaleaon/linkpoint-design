import { describe, expect, it } from "vitest";
import { validateThemeJson, normalizeHexColor, MAX_THEME_FILE_SIZE } from "./themeValidator.js";

const VALID_THEME_OBJ = {
  version: 1,
  name: "Custom Cyberpunk",
  colors: {
    pri: "#FF0055",
    sec: "#00FFCC",
    sec2: "#FFCC00",
    bg: "#0D0D15",
    surf: "#1A1A26",
    surf2: "#262638",
    ink: "#FFFFFF",
    ink2: "#A0A0B0",
    ok: "#00FF66",
    warn: "#FF9900",
    err: "#FF3333",
  },
};

describe("normalizeHexColor", () => {
  it("normalizes 3-digit hex to 6-digit uppercase hex", () => {
    expect(normalizeHexColor("#f05")).toBe("#FF0055");
    expect(normalizeHexColor("#abc")).toBe("#AABBCC");
  });

  it("normalizes 6-digit hex to uppercase", () => {
    expect(normalizeHexColor("#ff0055")).toBe("#FF0055");
    expect(normalizeHexColor("#00ffcc")).toBe("#00FFCC");
  });

  it("returns invalid input as trimmed upper string", () => {
    expect(normalizeHexColor("invalid")).toBe("INVALID");
  });
});

describe("validateThemeJson", () => {
  it("validates and returns parsed theme for valid JSON string", () => {
    const result = validateThemeJson(JSON.stringify(VALID_THEME_OBJ));
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.theme).not.toBeNull();
    expect(result.theme.name).toBe("Custom Cyberpunk");
    expect(result.theme.colors.pri).toBe("#FF0055");
  });

  it("normalizes 3-digit hex color tokens during validation", () => {
    const themeWith3DigitHex = {
      ...VALID_THEME_OBJ,
      colors: {
        ...VALID_THEME_OBJ.colors,
        pri: "#f05",
        bg: "#000",
      },
    };
    const result = validateThemeJson(JSON.stringify(themeWith3DigitHex));
    expect(result.valid).toBe(true);
    expect(result.theme.colors.pri).toBe("#FF0055");
    expect(result.theme.colors.bg).toBe("#000000");
  });

  it("rejects empty, null, or undefined input", () => {
    expect(validateThemeJson("").valid).toBe(false);
    expect(validateThemeJson(null).valid).toBe(false);
    expect(validateThemeJson(undefined).valid).toBe(false);
  });

  it("rejects invalid JSON syntax / truncated JSON", () => {
    const result = validateThemeJson('{"version": 1, "name": "Broken');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("Invalid JSON syntax");
  });

  it("rejects non-object JSON primitives and arrays", () => {
    expect(validateThemeJson("123").errors[0]).toContain("JSON object");
    expect(validateThemeJson('"hello"').errors[0]).toContain("JSON object");
    expect(validateThemeJson("true").errors[0]).toContain("JSON object");
    expect(validateThemeJson("null").errors[0]).toContain("JSON object");
    expect(validateThemeJson("[1, 2, 3]").errors[0]).toContain("JSON object");
  });

  it("rejects unsupported theme schema version", () => {
    const badVersion = { ...VALID_THEME_OBJ, version: 99 };
    const result = validateThemeJson(JSON.stringify(badVersion));
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("version"))).toBe(true);
  });

  it("rejects payload with missing colors object", () => {
    const noColors = { version: 1, name: "No Colors" };
    const result = validateThemeJson(JSON.stringify(noColors));
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("colors"))).toBe(true);
  });

  it("rejects missing color tokens", () => {
    const incomplete = {
      version: 1,
      name: "Incomplete",
      colors: { pri: "#112233" },
    };
    const result = validateThemeJson(JSON.stringify(incomplete));
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some((e) => e.includes('Missing required color token "sec"'))).toBe(true);
  });

  it("rejects malformed hex color codes", () => {
    const badHex = {
      ...VALID_THEME_OBJ,
      colors: {
        ...VALID_THEME_OBJ.colors,
        pri: "not-a-color",
        sec: "#12345", // 5 digits
        bg: "#GGGGGG",
      },
    };
    const result = validateThemeJson(JSON.stringify(badHex));
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("pri"))).toBe(true);
    expect(result.errors.some((e) => e.includes("sec"))).toBe(true);
    expect(result.errors.some((e) => e.includes("bg"))).toBe(true);
  });

  it("rejects oversized payloads exceeding max file size", () => {
    const hugeString = "a".repeat(MAX_THEME_FILE_SIZE + 10);
    const result = validateThemeJson(hugeString);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("exceeds the maximum limit");
  });
});
