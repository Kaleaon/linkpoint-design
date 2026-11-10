import { LAYOUTS, resolveLayout } from "./layouts.js";
import { PALETTES } from "./palettes.js";
import { DEVICES, STATES } from "./constants.js";
import { pickInk, ratio } from "./color.js";

function getLuminance(hex) {
  if (!hex || typeof hex !== "string") return 0;
  const cleanHex = hex.replace("#", "");
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split("")
          .map((c) => c + c)
          .join("")
      : cleanHex;
  const num = parseInt(fullHex, 16);
  if (isNaN(num)) return 0;
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  const a = [r, g, b].map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// Helper to audit contrast between two theme token colors
function auditPair(label, tokenA, tokenB, colorA, colorB, threshold = 4.5) {
  const rawRatio = ratio(colorA, colorB);
  const roundedRatio = Math.round(rawRatio * 10) / 10;
  const pass = roundedRatio >= threshold;
  return {
    label,
    tokenA,
    tokenB,
    colorA,
    colorB,
    ratio: roundedRatio,
    rawRatio,
    threshold,
    pass,
    status: `${roundedRatio.toFixed(1)}:1 AA ${pass ? "PASS" : "FAIL"}`,
  };
}

// Resolves static visual design tokens (V, t, pad, LK, ink, motion, contrastAudit, typography)
export function computeThemeTokens(state) {
  const L = resolveLayout(state.layout);
  const base = PALETTES[state.palette] || PALETTES.ink;
  const P = state.customTheme?.active
    ? {
        ...base,
        name: state.customTheme.name,
        note: "A custom, shareable colour theme.",
        c: { ...base.c, ...state.customTheme.colors },
      }
    : base;
  const t = {
    name: L.name + " / " + P.name,
    nav: L.nav,
    font: L.font,
    dfont: L.dfont,
    note: L.note + "   Colour pack: " + P.note + ".",
    v: { ...P.c, ...L.s },
  };
  const typography = {
    fontFamily: `var(--ktheme-font-family, ${
      t.dfont || '"JetBrains Mono", monospace'
    })`,
    fontSizeSmall: "var(--ktheme-font-size-small, 12px)",
    fontSizeMedium: "var(--ktheme-font-size-medium, 14px)",
    fontSizeLarge: "var(--ktheme-font-size-large, 18px)",
    fontSizeXLarge: "var(--ktheme-font-size-xlarge, 24px)",
    fontWeightLight: "var(--ktheme-font-weight-light, 300)",
    fontWeightRegular: "var(--ktheme-font-weight-regular, 400)",
    fontWeightMedium: "var(--ktheme-font-weight-medium, 500)",
    fontWeightBold: "var(--ktheme-font-weight-bold, 700)",
    lineHeight: "var(--ktheme-line-height, 1.5)",
    letterSpacing: "var(--ktheme-letter-spacing, 0em)",
  };
  t.typography = typography;
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
  const focusRingShadow = isLightBg
    ? "rgba(0, 0, 0, 0.4)"
    : "rgba(0, 0, 0, 0.6)";

  V.focusRing = focusRing;
  V.focusRingShadow = focusRingShadow;

  const pad = state.dense ? "8px" : V.pad;
  const LK = L.look;
  const ink = (bg, candidates) => pickInk(bg, candidates);
  const motion = {
    duration: "300ms",
    durationFast: "150ms",
    durationSlow: "500ms",
    durationReduced: "0ms",
    easing: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
    easingReduced: "cubic-bezier(0.0, 0.0, 1.0, 1.0)",
  };

  // Requirement 3 & 5: Audit critical theme pairs (primary vs background, surface vs text, outline vs surface)
  const priColor = V.pri || V.primary || "#D4AF37";
  const bgColor = V.bg || V.background || "#0A1112";
  const surfColor = V.surf || V.surface || "#101A1C";
  const textColor = V.ink || V.text || V.onSurface || "#D7F5E6";
  const outlineColor = V.outv || V.outline || "#365047";

  const priVsBg = auditPair(
    "primary vs background",
    "primary",
    "background",
    priColor,
    bgColor,
    4.5
  );
  const surfVsText = auditPair(
    "surface vs text",
    "surface",
    "text",
    surfColor,
    textColor,
    4.5
  );
  const outlineVsSurf = auditPair(
    "outline vs surface",
    "outline",
    "surface",
    outlineColor,
    surfColor,
    4.5
  );

  const pairs = [priVsBg, surfVsText, outlineVsSurf];
  const violations = pairs.filter((p) => !p.pass);
  const contrastAudit = {
    pairs,
    violations,
    hasErrors: violations.length > 0,
    pass: violations.length === 0,
    summary: {
      total: pairs.length,
      passed: pairs.length - violations.length,
      failed: violations.length,
      pass: violations.length === 0,
    },
    "primary vs background": priVsBg,
    "surface vs text": surfVsText,
    "outline vs surface": outlineVsSurf,
    primaryVsBackground: priVsBg,
    surfaceVsText: surfVsText,
    outlineVsSurface: outlineVsSurf,
  };

  return { V, t, pad, LK, ink, motion, contrastAudit, typography };
}

/**
 * Creates an inline style object utilizing CSS custom properties for typography
 * with fallback values for non-browser environments.
 */
export function createTypographyStyle({
  family = 'var(--ktheme-font-family, "JetBrains Mono", monospace)',
  size,
  weight,
  lineHeight = "1",
  letterSpacing,
  fallbackFamily = '"JetBrains Mono", monospace',
} = {}) {
  const resolvedFamily =
    family || `var(--ktheme-font-family, ${fallbackFamily})`;
  const style = {};
  if (size !== undefined && weight !== undefined) {
    style.font = `${weight} ${size}/${lineHeight} ${resolvedFamily}`;
  }
  style.fontFamily = resolvedFamily;
  if (size !== undefined) style.fontSize = String(size);
  if (weight !== undefined) style.fontWeight = String(weight);
  if (lineHeight !== undefined) style.lineHeight = String(lineHeight);
  if (letterSpacing !== undefined) style.letterSpacing = String(letterSpacing);
  return style;
}

// Resolves dynamic runtime viewport, screen, and navigation state
export function computeThemeRuntime(state, cf, tokens) {
  const d = DEVICES[state.device] || DEVICES.and;
  const L = resolveLayout(state.layout);
  const tNav = tokens ? tokens.t.nav : L.nav;

  let nav;
  if (d.desk) nav = "floaters";
  else if (tNav === "SWEEP") nav = "sweep";
  else if (d.split) nav = "rail";
  else
    nav =
      tNav === "TILES"
        ? "tiles"
        : tNav === "RAIL" && d.w > 700
          ? "rail"
          : "tabs";

  const C = cf();
  const isConsole = nav === "sweep";
  const consoleScene =
    isConsole && state.screen === "3D View" && state.cond === "normal";
  const isFloat = nav === "floaters";
  const isSweepDesk =
    isFloat &&
    (state.layout === "sweep" || state.layout === "lcars" || tNav === "SWEEP");
  const bleed = isConsole || isFloat;

  const scr = state.screen;
  const sel = (n) => scr === n;

  const condPack =
    state.cond === "normal"
      ? null
      : STATES[state.cond][scr] || STATES[state.cond]._;
  const stateBlockActive =
    !!condPack &&
    state.cond !== "loading" &&
    !["Login", "Settings", "Cache", "Search"].includes(scr);
  const norm = !stateBlockActive;
  const bare = ["3D View", "Login", "Search"].includes(scr);
  const immersive = scr === "3D View" && norm;
  const headLook =
    bare || isFloat
      ? "none"
      : nav === "sweep"
        ? "sweep"
        : tokens
          ? tokens.LK.head
          : L.look.head;

  return {
    d,
    nav,
    scr,
    sel,
    condPack,
    bare,
    immersive,
    headLook,
    isSweepDesk,
    C,
    isConsole,
    consoleScene,
    isFloat,
    bleed,
    stateBlockActive,
    norm,
  };
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
