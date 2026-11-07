import { EDITABLE_THEME_TOKENS } from "./customTheme.js";

export const MAX_THEME_FILE_SIZE = 500 * 1024; // 500 KB

const HEX_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/**
 * Normalizes a 3-digit or 6-digit hex color (#RGB -> #RRGGBB).
 */
export function normalizeHexColor(hex) {
  if (typeof hex !== "string") return hex;
  const trimmed = hex.trim();
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const r = trimmed[1];
    const g = trimmed[2];
    const b = trimmed[3];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return trimmed.toUpperCase();
}

/**
 * Validates theme JSON string or parsed object against schema rules.
 * Returns diagnostic object: { valid: boolean, errors: string[], theme: object | null }
 */
export function validateThemeJson(jsonInput, options = {}) {
  const maxBytes = options.maxBytes || MAX_THEME_FILE_SIZE;
  const errors = [];

  if (jsonInput === null || jsonInput === undefined || jsonInput === "") {
    return {
      valid: false,
      errors: ["File is empty or invalid content."],
      theme: null,
    };
  }

  let parsed = null;

  if (typeof jsonInput === "string") {
    if (jsonInput.length > maxBytes) {
      return {
        valid: false,
        errors: [`File size (${Math.round(jsonInput.length / 1024)}KB) exceeds the maximum limit of ${Math.round(maxBytes / 1024)}KB.`],
        theme: null,
      };
    }
    try {
      parsed = JSON.parse(jsonInput);
    } catch (err) {
      return {
        valid: false,
        errors: [`Invalid JSON syntax: ${err.message}`],
        theme: null,
      };
    }
  } else if (typeof jsonInput === "object") {
    parsed = jsonInput;
  } else {
    return {
      valid: false,
      errors: ["Theme payload must be a JSON string or object."],
      theme: null,
    };
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {
      valid: false,
      errors: [`Theme JSON payload must be a JSON object, got ${parsed === null ? "null" : Array.isArray(parsed) ? "Array" : typeof parsed}.`],
      theme: null,
    };
  }

  // Version compatibility check
  if (parsed.version !== undefined && parsed.version !== 1) {
    errors.push(`Unsupported theme version: ${parsed.version}. Only version 1 is supported.`);
  }

  // Colors property object check
  if (!parsed.colors || typeof parsed.colors !== "object" || Array.isArray(parsed.colors)) {
    errors.push("Theme payload is missing a valid 'colors' object.");
  } else {
    // Check required tokens and format
    for (const [key, label] of EDITABLE_THEME_TOKENS) {
      const val = parsed.colors[key];
      if (val === undefined || val === null) {
        errors.push(`Missing required color token "${key}" (${label}).`);
      } else if (typeof val !== "string") {
        errors.push(`Color token "${key}" must be a string, got ${typeof val}.`);
      } else if (!HEX_REGEX.test(val.trim())) {
        errors.push(`Invalid hex color format for token "${key}": "${val}". Expected #RGB or #RRGGBB.`);
      }
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      theme: null,
    };
  }

  // Normalize tokens
  const normalizedColors = {};
  for (const [key] of EDITABLE_THEME_TOKENS) {
    normalizedColors[key] = normalizeHexColor(parsed.colors[key]);
  }

  const themeName = String(parsed.name || "My Linkpoint theme").trim().slice(0, 48) || "My Linkpoint theme";

  return {
    valid: true,
    errors: [],
    theme: {
      version: 1,
      active: true,
      name: themeName,
      colors: normalizedColors,
    },
  };
}
