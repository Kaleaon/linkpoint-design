import React, { createContext, useContext, useMemo } from "react";

// Batched CSS custom property mutations system
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

export const KthemeContext = createContext({
  themeId: "navy-gold",
  tokens: {},
});

export function KthemeProvider({ themeId = "navy-gold", children }) {
  const value = useMemo(() => ({ themeId, tokens: {} }), [themeId]);
  return React.createElement(KthemeContext.Provider, { value }, children);
}

export function useKtheme() {
  return useContext(KthemeContext);
}

export function useKthemeToken(tokenName) {
  return "";
}

export function getKthemeCssVar(tokenName) {
  return `var(--${tokenName})`;
}

export const DEFAULT_THEMES = ["navy-gold", "lcars-amber"];

export function ThemeStudio() {
  return null;
}

export function useTablist() {
  return {
    selectedTab: 0,
    setSelectedTab: () => {},
    tabProps: () => ({}),
    panelProps: () => ({}),
  };
}

export function SculptingCanvas() {
  return null;
}

export function calcContrastRatio() {
  return 21;
}

export function calcLuminance() {
  return 1;
}

export function formatBadgeText() {
  return "AAA";
}

export function getTokenCounterpart(token) {
  return token;
}

export function auditThemeTokens() {
  return { passed: true, violations: [] };
}
