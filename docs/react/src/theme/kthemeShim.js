import React from 'react';

// Batched CSS variable DOM mutation system to prevent layout thrashing
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
    (typeof document !== 'undefined' ? document.documentElement : null);
  if (!targetEl) return;

  const existing = pendingMutations.get(targetEl) || {};
  pendingMutations.set(targetEl, { ...existing, ...styles });

  if (rafId === null) {
    if (typeof requestAnimationFrame === 'function') {
      rafId = requestAnimationFrame(flushMutations);
    } else {
      flushMutations();
    }
  }
}

export function flushCssVariables() {
  if (rafId !== null) {
    if (typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(rafId);
    }
    flushMutations();
  }
}

export function KthemeProvider({ children, themeId }) {
  return children;
}

export const KthemeContext = React.createContext({
  theme: null,
  activeThemeId: 'default',
  setThemeId: () => {},
  tokens: {}
});

export const DEFAULT_THEMES = [];

export function useKtheme() {
  return React.useContext(KthemeContext);
}

export function useKthemeToken(tokenName, fallback = '') {
  return fallback;
}

export function getKthemeCssVar(tokenName) {
  return `--ktheme-${tokenName}`;
}

export function useTablist() {
  return {
    tablistProps: { role: 'tablist' },
    tabProps: (id) => ({ role: 'tab', id }),
    panelProps: (id) => ({ role: 'tabpanel', id })
  };
}

export function ThemeStudio() {
  return null;
}

export function calcContrastRatio() {
  return 21;
}

export function calcLuminance() {
  return 1;
}

export function formatBadgeText() {
  return 'AAA';
}

export function getTokenCounterpart(token) {
  return token;
}

export function auditThemeTokens() {
  return { passed: true, issues: [] };
}

export function SculptingCanvas() {
  return null;
}

export default {
  KthemeProvider,
  KthemeContext,
  DEFAULT_THEMES,
  useKtheme,
  useKthemeToken,
  getKthemeCssVar,
  useTablist,
  batchSetCssVariables,
  flushCssVariables,
  ThemeStudio,
  calcContrastRatio,
  calcLuminance,
  formatBadgeText,
  getTokenCounterpart,
  auditThemeTokens,
  SculptingCanvas
};
