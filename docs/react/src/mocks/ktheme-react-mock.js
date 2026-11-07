import React from "react";

export function KthemeProvider({ children, themeId }) {
  return React.createElement("div", { "data-ktheme-theme": themeId }, children);
}

export function batchSetCssVariables(element, vars) {
  if (element && vars) {
    for (const [key, val] of Object.entries(vars)) {
      element.style.setProperty(key, val);
    }
  }
}

export function flushCssVariables() {}

export function useKtheme() {
  return { themeId: "navy-gold" };
}

export function useKthemeToken(token) {
  return "";
}

export function usePrefersReducedMotion() {
  return false;
}

export function useMotionTokens() {
  return {};
}

export function ThemeStudio() {
  return null;
}

export default {
  KthemeProvider,
  batchSetCssVariables,
  flushCssVariables,
  useKtheme,
  useKthemeToken,
  usePrefersReducedMotion,
  useMotionTokens,
  ThemeStudio,
};
