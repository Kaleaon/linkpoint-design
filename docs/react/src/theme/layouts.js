// Ported and expanded from index.html + layout-variations.json.
// Layout packs: geometry, nav model, type, density. No colour.

export const LAYOUTS = {
  terminal: {
    id: "terminal",
    name: "Ink Terminal",
    nav: "TABS",
    font: '"JetBrains Mono","IBM Plex Mono",monospace',
    dfont: '"JetBrains Mono",monospace',
    s: { rs: "4px", rl: "8px", rp: "4px", navr: "4px", pad: "12px", tls: ".26em" },
    look: { card: "box", head: "stack", seg: "fill", chips: true, gap: "9px", measure: null },
    note: "Dense command terminal grid with monospaced typography, tight line heights, and prompt indicators.",
  },
  lcars: {
    id: "lcars",
    name: "LCARS Console",
    nav: "SWEEP",
    font: '"Antonio","Jost",sans-serif',
    dfont: '"Antonio",sans-serif',
    s: { rs: "999px", rl: "28px", rp: "22px", navr: "0 999px 999px 0", pad: "10px", tls: ".16em" },
    look: { card: "cap", head: "sweep", seg: "fill", chips: true, gap: "6px", measure: null },
    note: "Authentic Star Trek LCARS console layout with swept elbow rail frames, flush button segments, and rounded pill caps.",
  },
  metro: {
    id: "metro",
    name: "Metro Tiles",
    nav: "TILES",
    font: '"Open Sans","Segoe UI",sans-serif',
    dfont: '"Open Sans","Segoe UI",sans-serif',
    s: { rs: "0px", rl: "0px", rp: "0px", navr: "0px", pad: "14px", tls: "0em" },
    look: { card: "flat", head: "pivot", seg: "pivot", chips: false, gap: "2px", measure: null },
    note: "High-contrast Windows Phone Metro layout with flat tiles, zero corner radii, lowercase pivot headers, and live tile badges.",
  },
  frutiger_aero: {
    id: "frutiger_aero",
    name: "Frutiger Aero",
    nav: "TABS",
    font: '"Nunito Sans",sans-serif',
    dfont: '"Nunito Sans",sans-serif',
    s: { rs: "12px", rl: "18px", rp: "16px", navr: "12px", pad: "14px", tls: ".06em" },
    look: { card: "soft", head: "stack", seg: "fill", chips: true, gap: "11px", measure: null },
    note: "Glossy Frutiger Aero layout with 12-18px curved corners, comfortable padding, soft translucent panels, and sky/grass horizons.",
  },
  art_deco: {
    id: "art_deco",
    name: "Art Deco",
    nav: "RAIL",
    font: '"Jost",system-ui,sans-serif',
    dfont: '"Jost",sans-serif',
    s: { rs: "0px", rl: "0px", rp: "0px", navr: "0px", pad: "11px", tls: ".35em" },
    look: { card: "rule", head: "rule", seg: "text", chips: false, gap: "0px", measure: null },
    note: "Architectural Art Deco layout with hairline rules, sharp geometric angles, and wide letter-spacing.",
  },
  press: {
    id: "press",
    name: "Press",
    nav: "TABS",
    font: '"Source Serif 4",Georgia,serif',
    dfont: '"Jost",sans-serif',
    s: { rs: "2px", rl: "6px", rp: "3px", navr: "2px", pad: "14px", tls: ".1em" },
    look: { card: "quiet", head: "editorial", seg: "text", chips: false, gap: "0px", measure: "58ch" },
    note: "Editorial: serif body, 2px corners, generous leading — the legibility layout for sunlight and large-type mode.",
  },
  modern_glass: {
    id: "modern_glass",
    name: "Modern Glass",
    nav: "TABS",
    font: '"Nunito Sans",sans-serif',
    dfont: '"Nunito Sans",sans-serif',
    s: { rs: "14px", rl: "22px", rp: "18px", navr: "14px", pad: "14px", tls: ".04em" },
    look: { card: "soft", head: "stack", seg: "fill", chips: true, gap: "12px", measure: null },
    note: "Modern frosted glass layout with deep curvature, subtle glowing borders, and fluid animations.",
  },
  material3: {
    id: "material3",
    name: "Material3",
    nav: "TABS",
    font: "system-ui,-apple-system,sans-serif",
    dfont: "system-ui,-apple-system,sans-serif",
    s: { rs: "12px", rl: "24px", rp: "16px", navr: "999px", pad: "14px", tls: "0em" },
    look: { card: "tonal", head: "stack", seg: "fill", chips: true, gap: "10px", measure: null },
    note: "Material Design 3 layout with rounded pill containers, expressive tonal elevation, and dynamic color integration.",
  },
  cyberpunk: {
    id: "cyberpunk",
    name: "Cyberpunk",
    nav: "RAIL",
    font: '"JetBrains Mono",monospace',
    dfont: '"JetBrains Mono",monospace',
    s: { rs: "0px", rl: "0px", rp: "0px", navr: "0px", pad: "10px", tls: ".2em" },
    look: { card: "chamfer", head: "sweep", seg: "fill", chips: true, gap: "4px", measure: null },
    note: "High-tech dystopian cyberpunk layout with wireframe borders, chamfered cuts, and HUD telemetry rails.",
  },
};

// Aliases for backward compatibility with earlier index.html and React snapshots
export const LAYOUT_ALIASES = {
  sweep: "lcars",
  tiles: "metro",
  glass: "frutiger_aero",
  rules: "art_deco",
};

// Direct index aliases on the LAYOUTS object so legacy lookups continue to work
LAYOUTS.sweep = LAYOUTS.lcars;
LAYOUTS.tiles = LAYOUTS.metro;
LAYOUTS.glass = LAYOUTS.frutiger_aero;
LAYOUTS.rules = LAYOUTS.art_deco;

// Standard z-index stacking layers and elevation depth shadow tokens
export const Z_INDEX = {
  base: 0,
  card: 1,
  window: 10,
  dock: 20,
  taskbar: 50,
  header: 80,
  dropdown: 90,
  overlay: 100,
  toast: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  "z-base": 0,
  "z-card": 1,
  "z-window": 10,
  "z-dock": 20,
  "z-taskbar": 50,
  "z-header": 80,
  "z-dropdown": 90,
  "z-overlay": 100,
  "z-toast": 400,
  "z-modal": 500,
  "z-popover": 600,
  "z-tooltip": 700,
};

export const ELEVATION = {
  0: "none",
  1: "0 1px 3px 1px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.30)",
  2: "0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.30)",
  3: "0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px 0 rgba(0, 0, 0, 0.30)",
  4: "0 6px 10px 4px rgba(0, 0, 0, 0.15), 0 2px 3px 0 rgba(0, 0, 0, 0.30)",
  5: "0 8px 12px 6px rgba(0, 0, 0, 0.15), 0 4px 4px 0 rgba(0, 0, 0, 0.30)",
  "elevation-0": "none",
  "elevation-1": "0 1px 3px 1px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.30)",
  "elevation-2": "0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.30)",
  "elevation-3": "0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px 0 rgba(0, 0, 0, 0.30)",
  "elevation-4": "0 6px 10px 4px rgba(0, 0, 0, 0.15), 0 2px 3px 0 rgba(0, 0, 0, 0.30)",
  "elevation-5": "0 8px 12px 6px rgba(0, 0, 0, 0.15), 0 4px 4px 0 rgba(0, 0, 0, 0.30)",
};

export const PRIMARY_LAYOUT_KEYS = [
  "terminal",
  "lcars",
  "metro",
  "frutiger_aero",
  "art_deco",
  "press",
  "modern_glass",
  "material3",
  "cyberpunk",
];

export function resolveLayout(key) {
  if (!key) return LAYOUTS.terminal;
  if (LAYOUTS[key]) return LAYOUTS[key];
  const alias = LAYOUT_ALIASES[key];
  if (alias && LAYOUTS[alias]) return LAYOUTS[alias];
  return LAYOUTS.terminal;
}
