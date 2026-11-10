import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

export const DEFAULT_THEMES = {
  "navy-gold": {
    primary: "#D4AF37",
    onPrimary: "#0A1630",
    primaryContainer: "#715F33",
    onPrimaryContainer: "#E8E3D8",
    secondary: "#4A90E2",
    onSecondary: "#0A1630",
    surface: "#1A2645",
    onSurface: "#E8E3D8",
    surfaceVariant: "#2A3655",
    background: "#0A1630",
    onBackground: "#E8E3D8",
    outline: "#44483E",
    error: "#CF6679",
    warning: "#E0B84C",
    success: "#D4AF37",
    surf2: "#2A3655",
    ink: "#E8E3D8",
    ink2: "#C9C4B9",
    outv: "#44483E",
    ok: "#D4AF37",
    warn: "#E0B84C",
    err: "#CF6679",
    sky1: "#16305C",
    sky2: "#0E1F3F",
    gnd: "#141F38",
    gnd2: "#0A1630",
    pad: "13px",
    rs: "8px",
    font: '"Jost",system-ui,sans-serif',
  },
  "ink-terminal-modern": {
    primary: "#6CFF9A",
    onPrimary: "#0A1112",
    primaryContainer: "#1F6640",
    onPrimaryContainer: "#D7F5E6",
    secondary: "#3E4E5E",
    onSecondary: "#D7F5E6",
    surface: "#101A1C",
    onSurface: "#D7F5E6",
    surfaceVariant: "#1B2A2D",
    background: "#0A1112",
    onBackground: "#D7F5E6",
    outline: "#365047",
    error: "#CF6679",
    warning: "#FFC98A",
    success: "#6CFF9A",
    surf2: "#1B2A2D",
    ink: "#D7F5E6",
    ink2: "#A7C8BC",
    outv: "#365047",
    ok: "#6CFF9A",
    warn: "#FFC98A",
    err: "#CF6679",
    sky1: "#1c4a5c",
    sky2: "#12333a",
    gnd: "#10241d",
    gnd2: "#0a1112",
    pad: "12px",
    rs: "4px",
    font: '"JetBrains Mono",monospace',
  },
  lcars: {
    primary: "#F2A65A",
    onPrimary: "#120C1C",
    primaryContainer: "#CC7A2B",
    onPrimaryContainer: "#120C1C",
    secondary: "#A485F7",
    onSecondary: "#120C1C",
    surface: "#1C132A",
    onSurface: "#F3E9FF",
    surfaceVariant: "#3D1F5C",
    background: "#120C1C",
    onBackground: "#F3E9FF",
    outline: "#4D2F5C",
    error: "#CF6679",
    warning: "#FFC46B",
    success: "#F2A65A",
    surf2: "#3D1F5C",
    ink: "#F3E9FF",
    ink2: "#D0B3E6",
    outv: "#4D2F5C",
    ok: "#F2A65A",
    warn: "#FFC46B",
    err: "#CF6679",
    sky1: "#3D1F5C",
    sky2: "#241338",
    gnd: "#1C132A",
    gnd2: "#120C1C",
    pad: "10px",
    rs: "999px",
    font: '"Antonio",sans-serif',
  },
};

const pendingMutations = new Map();
let rafId = null;

function flushMutations() {
  pendingMutations.forEach((styles, element) => {
    if (!element || !element.style) return;
    Object.entries(styles).forEach(([prop, val]) => {
      if (val !== undefined && val !== null) {
        element.style.setProperty(prop, val);
      } else {
        element.style.removeProperty(prop);
      }
    });
  });
  pendingMutations.clear();
  rafId = null;
}

export function batchSetCssVariables(element, styles) {
  const targetEl =
    element ||
    (typeof document !== "undefined" ? document.documentElement : null);
  if (!targetEl) return;

  const existing = pendingMutations.get(targetEl) || {};
  pendingMutations.set(targetEl, { ...existing, ...styles });

  if (rafId === null) {
    if (typeof requestAnimationFrame === "function") {
      rafId = requestAnimationFrame(flushMutations);
    } else {
      flushMutations();
    }
  }
}

export function flushCssVariables() {
  if (rafId !== null) {
    if (typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(rafId);
    }
    flushMutations();
  }
}

function tokensToCssVars(tokens) {
  const vars = {};
  if (!tokens) return vars;

  if (tokens.primary) vars["--md-sys-color-primary"] = tokens.primary;
  if (tokens.onPrimary) vars["--md-sys-color-on-primary"] = tokens.onPrimary;
  if (tokens.primaryContainer) vars["--md-sys-color-primary-container"] = tokens.primaryContainer;
  if (tokens.onPrimaryContainer) vars["--md-sys-color-on-primary-container"] = tokens.onPrimaryContainer;
  if (tokens.secondary) vars["--md-sys-color-secondary"] = tokens.secondary;
  if (tokens.onSecondary) vars["--md-sys-color-on-secondary"] = tokens.onSecondary;
  if (tokens.surface) vars["--md-sys-color-surface"] = tokens.surface;
  if (tokens.onSurface) vars["--md-sys-color-on-surface"] = tokens.onSurface;
  if (tokens.surfaceVariant) vars["--md-sys-color-surface-variant"] = tokens.surfaceVariant;
  if (tokens.background) vars["--md-sys-color-background"] = tokens.background;
  if (tokens.onBackground) vars["--md-sys-color-on-background"] = tokens.onBackground;
  if (tokens.outline) vars["--md-sys-color-outline"] = tokens.outline;
  if (tokens.error) vars["--md-sys-color-error"] = tokens.error;
  if (tokens.warning) vars["--md-sys-color-warning"] = tokens.warning || tokens.warn || "#FFB020";
  if (tokens.success) vars["--md-sys-color-success"] = tokens.success || tokens.ok || tokens.primary;

  if (tokens.primary) vars["--ktheme-pri"] = tokens.primary;
  if (tokens.onPrimary) vars["--ktheme-onpri"] = tokens.onPrimary;
  if (tokens.surface) vars["--ktheme-surf"] = tokens.surface;
  if (tokens.surf2 || tokens.surfaceVariant) vars["--ktheme-surf2"] = tokens.surf2 || tokens.surfaceVariant;
  if (tokens.background) vars["--ktheme-bg"] = tokens.background;
  if (tokens.onSurface || tokens.ink) vars["--ktheme-ink"] = tokens.ink || tokens.onSurface;
  if (tokens.ink2) vars["--ktheme-ink2"] = tokens.ink2;
  if (tokens.outline || tokens.outv) vars["--ktheme-outv"] = tokens.outv || tokens.outline;
  if (tokens.error || tokens.err) vars["--ktheme-err"] = tokens.err || tokens.error;
  if (tokens.warning || tokens.warn) vars["--ktheme-warn"] = tokens.warn || tokens.warning || "#FFB020";
  if (tokens.success || tokens.ok) vars["--ktheme-ok"] = tokens.ok || tokens.success || tokens.primary;
  if (tokens.sky1) vars["--ktheme-sky1"] = tokens.sky1;
  if (tokens.sky2) vars["--ktheme-sky2"] = tokens.sky2;
  if (tokens.gnd) vars["--ktheme-gnd1"] = tokens.gnd;
  if (tokens.gnd2) vars["--ktheme-gnd2"] = tokens.gnd2;
  if (tokens.pad) vars["--ktheme-pad"] = tokens.pad;
  if (tokens.rs) vars["--ktheme-rs"] = tokens.rs;
  if (tokens.font) vars["--ktheme-font"] = tokens.font;

  Object.keys(tokens).forEach((k) => {
    if (typeof tokens[k] === "string" && !vars[`--ktheme-${k}`]) {
      vars[`--ktheme-${k}`] = tokens[k];
    }
  });

  return vars;
}

export const KthemeContext = createContext(null);

export function useKtheme() {
  const ctx = useContext(KthemeContext);
  if (!ctx) {
    throw new Error("useKtheme must be used within a <KthemeProvider>");
  }
  return ctx;
}

export function useKthemeToken(tokenName, fallback) {
  const { tokens } = useKtheme();
  if (!tokenName) return tokens;
  const val = tokens[tokenName];
  if (val !== undefined && val !== null) return val;
  return fallback || `var(--md-sys-color-${String(tokenName)}, var(--ktheme-${String(tokenName)}))`;
}

export function getKthemeCssVar(tokenName, fallback) {
  const md3Name = `--md-sys-color-${tokenName.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
  if (fallback) {
    return `var(${md3Name}, var(--ktheme-${tokenName}, ${fallback}))`;
  }
  return `var(${md3Name}, var(--ktheme-${tokenName}))`;
}

export function useTablist() {
  return { tabs: [], activeTab: null, setActiveTab: () => {} };
}

export function KthemeProvider({
  themeId = "navy-gold",
  initialTokens,
  targetElement,
  children,
}) {
  const [activeThemeId, setActiveThemeId] = useState(themeId);
  const [tokens, setTokensState] = useState(() => {
    const base = DEFAULT_THEMES[themeId] || DEFAULT_THEMES["navy-gold"];
    return { ...base, ...initialTokens };
  });
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (themeId && DEFAULT_THEMES[themeId]) {
      setActiveThemeId(themeId);
      const base = DEFAULT_THEMES[themeId];
      setTokensState({ ...base, ...initialTokens });
    }
  }, [themeId, initialTokens]);

  useEffect(() => {
    const cssVars = tokensToCssVars(tokens);
    batchSetCssVariables(targetElement, cssVars);
  }, [tokens, targetElement]);

  const setThemeId = useCallback((id) => {
    const base = DEFAULT_THEMES[id] || DEFAULT_THEMES["navy-gold"];
    setActiveThemeId(id);
    setTokensState({ ...base });
  }, []);

  const setToken = useCallback((key, value) => {
    setTokensState((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "primary") updated.pri = value;
      if (key === "onPrimary") updated.onpri = value;
      if (key === "surface") updated.surf = value;
      if (key === "background") updated.bg = value;
      if (key === "outline") updated.outv = value;
      return updated;
    });
  }, []);

  const setTokens = useCallback((newTokens) => {
    setTokensState((prev) => ({ ...prev, ...newTokens }));
  }, []);

  const toggleThemeMode = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const resetTheme = useCallback(() => {
    const base = DEFAULT_THEMES[activeThemeId] || DEFAULT_THEMES["navy-gold"];
    setTokensState({ ...base });
  }, [activeThemeId]);

  const contextValue = useMemo(
    () => ({
      themeId: activeThemeId,
      tokens,
      setThemeId,
      setToken,
      setTokens,
      isDark,
      toggleThemeMode,
      resetTheme,
    }),
    [
      activeThemeId,
      tokens,
      setThemeId,
      setToken,
      setTokens,
      isDark,
      toggleThemeMode,
      resetTheme,
    ]
  );

  return React.createElement(
    KthemeContext.Provider,
    { value: contextValue },
    children
  );
}

export function ThemeStudio() {
  return null;
}
export function SculptingCanvas() {
  return null;
}
export function calcContrastRatio() {
  return 4.5;
}
export function calcLuminance() {
  return 0.5;
}
export function formatBadgeText() {
  return "PASS";
}
export function getTokenCounterpart(k) {
  return k;
}
export function auditThemeTokens() {
  return { pairs: [], overallScore: 100 };
}
