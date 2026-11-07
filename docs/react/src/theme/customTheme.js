import { validateThemeJson } from "./themeValidator.js";

export const THEME_STORAGE_KEY = "linkpoint.custom-theme.v1";

export const EDITABLE_THEME_TOKENS = [
  ["pri", "Primary"], ["sec", "Secondary"], ["sec2", "Accent"],
  ["bg", "Background"], ["surf", "Surface"], ["surf2", "Raised surface"],
  ["ink", "Text"], ["ink2", "Muted text"], ["ok", "Success"],
  ["warn", "Warning"], ["err", "Danger"],
];

export function sanitizeTheme(input) {
  const result = validateThemeJson(input);
  return result.valid ? result.theme : null;
}

export function themeFromPalette(palette, name = "My Linkpoint theme") {
  return { version: 1, active: false, name, colors: Object.fromEntries(EDITABLE_THEME_TOKENS.map(([key]) => [key, palette.c[key]])) };
}

export function readSavedTheme() {
  try { return sanitizeTheme(JSON.parse(localStorage.getItem(THEME_STORAGE_KEY))); } catch { return null; }
}

export function encodeSharedTheme(theme) {
  const bytes = new TextEncoder().encode(JSON.stringify(theme));
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export function decodeSharedTheme(value) {
  try {
    const binary = atob(value.replaceAll("-", "+").replaceAll("_", "/"));
    return sanitizeTheme(JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)))));
  } catch { return null; }
}
