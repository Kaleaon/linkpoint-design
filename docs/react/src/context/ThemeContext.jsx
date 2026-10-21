import { createContext, useContext, useMemo, useEffect } from "react";
import { useApp } from "./AppContext.jsx";
import { computeThemeTokens, computeThemeRuntime } from "../theme/computeTheme.js";

export const ThemeTokensContext = createContext(null);
export const ThemeRuntimeContext = createContext(null);
export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const { state, actions } = useApp();

  const tokens = useMemo(
    () => computeThemeTokens(state),
    [state.layout, state.palette, state.customTheme, state.dense]
  );

  const runtime = useMemo(
    () => computeThemeRuntime(state, actions.cf, tokens),
    [state.device, state.screen, state.cond, state.layout, state.palette, state.customTheme, actions.cf, tokens]
  );

  useEffect(() => {
    if (typeof document !== "undefined" && document.documentElement && tokens?.V) {
      if (tokens.V.focusRing) {
        document.documentElement.style.setProperty("--k-focus-ring", tokens.V.focusRing);
      }
      if (tokens.V.focusRingShadow) {
        document.documentElement.style.setProperty("--k-focus-ring-shadow", tokens.V.focusRingShadow);
      }
    }
  }, [tokens]);

  return (
    <ThemeTokensContext.Provider value={tokens}>
      <ThemeRuntimeContext.Provider value={runtime}>
        {children}
      </ThemeRuntimeContext.Provider>
    </ThemeTokensContext.Provider>
  );
}

export function useThemeTokens() {
  const ctx = useContext(ThemeTokensContext) || useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeTokens must be used inside <ThemeProvider>");
  return ctx;
}

export function useThemeRuntime() {
  const ctx = useContext(ThemeRuntimeContext) || useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeRuntime must be used inside <ThemeProvider>");
  return ctx;
}

export function useTheme() {
  const tokens = useContext(ThemeTokensContext);
  const runtime = useContext(ThemeRuntimeContext);
  const legacy = useContext(ThemeContext);
  if (!tokens && !runtime && !legacy) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return useMemo(() => ({ ...(legacy || {}), ...(tokens || {}), ...(runtime || {}) }), [legacy, tokens, runtime]);
}
