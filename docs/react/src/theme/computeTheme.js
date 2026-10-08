import { LAYOUTS } from "./layouts.js";
import { PALETTES } from "./palettes.js";
import { DEVICES, STATES } from "./constants.js";
import { pickInk } from "./color.js";

function getLuminance(hex) {
  if (!hex || typeof hex !== "string") return 0;
  const cleanHex = hex.replace("#", "");
  const fullHex = cleanHex.length === 3 ? cleanHex.split("").map((c) => c + c).join("") : cleanHex;
  const num = parseInt(fullHex, 16);
  if (isNaN(num)) return 0;
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  const a = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// Resolves static visual design tokens (V, t, pad, LK, ink)
export function computeThemeTokens(state) {
  const L = LAYOUTS[state.layout];
  const base = PALETTES[state.palette];
  const P = state.customTheme?.active
    ? { ...base, name: state.customTheme.name, note: "A custom, shareable colour theme.", c: { ...base.c, ...state.customTheme.colors } }
    : base;
  const t = { name: L.name + " / " + P.name, nav: L.nav, font: L.font, dfont: L.dfont, note: L.note + "   Colour pack: " + P.note + ".", v: { ...P.c, ...L.s } };
  const V = t.v;

  let focusRing = V.pri;
  if (getContrastRatio(focusRing, V.bg) < 3.0) {
    if (V.sec2 && getContrastRatio(V.sec2, V.bg) >= 3.0) {
      focusRing = V.sec2;
    } else if (V.ink && getContrastRatio(V.ink, V.bg) >= 3.0) {
      focusRing = V.ink;
    }
  }
  const isLightBg = getLuminance(V.bg) >= 0.5;
  const focusRingShadow = isLightBg ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.6)";

  V.focusRing = focusRing;
  V.focusRingShadow = focusRingShadow;

  const pad = state.dense ? "8px" : V.pad;
  const LK = L.look;
  const ink = (bg, candidates) => pickInk(bg, candidates);

  return { V, t, pad, LK, ink };
}

// Resolves dynamic runtime viewport, screen, and navigation state
export function computeThemeRuntime(state, cf, tokens) {
  const d = DEVICES[state.device];
  const tNav = tokens ? tokens.t.nav : LAYOUTS[state.layout].nav;

  let nav;
  if (d.desk) nav = "floaters";
  else if (tNav === "SWEEP") nav = "sweep";
  else if (d.split) nav = "rail";
  else nav = tNav === "TILES" ? "tiles" : tNav === "RAIL" && d.w > 700 ? "rail" : "tabs";

  const C = cf();
  const isConsole = nav === "sweep";
  const consoleScene = isConsole && state.screen === "3D View" && state.cond === "normal";
  const isFloat = nav === "floaters";
  const isSweepDesk = isFloat && (state.layout === "sweep" || tNav === "SWEEP");
  const bleed = isConsole || isFloat;

  const scr = state.screen;
  const sel = (n) => scr === n;

  const condPack = state.cond === "normal" ? null : STATES[state.cond][scr] || STATES[state.cond]._;
  const stateBlockActive = !!condPack && state.cond !== "loading" && !["Login", "Settings", "Cache", "Search"].includes(scr);
  const norm = !stateBlockActive;
  const bare = ["3D View", "Login", "Search"].includes(scr);
  const immersive = scr === "3D View" && norm;
  const headLook = bare || isFloat ? "none" : nav === "sweep" ? "sweep" : (tokens ? tokens.LK.head : LAYOUTS[state.layout].look.head);

  return { d, nav, scr, sel, condPack, bare, immersive, headLook, isSweepDesk, C, isConsole, consoleScene, isFloat, bleed, stateBlockActive, norm };
}

// Ported from the top of renderVals(): resolves the active layout+palette into
// the token set `V`, the device, the console geometry, and the handful of
// screen-independent flags (isConsole/isFloat/bleed/bare/immersive/norm/
// headLook/stateBlock) that every screen and chrome component needs.
/**
 * @deprecated Deprecated in favor of `@ktheme/react` <KthemeProvider> and `useKthemeToken()` dynamic token hooks.
 * Kept for legacy compatibility layer with AppContext.
 */
export function computeTheme(state, cf) {
  const tokens = computeThemeTokens(state);
  const runtime = computeThemeRuntime(state, cf, tokens);
  return { ...tokens, ...runtime };
}
