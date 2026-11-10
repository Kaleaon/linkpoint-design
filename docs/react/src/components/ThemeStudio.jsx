import { useContext, useRef, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { EDITABLE_THEME_TOKENS } from "../theme/customTheme.js";
import { validateThemeJson } from "../theme/themeValidator.js";
import {
  ThemeStudio as UnifiedThemeStudio,
  KthemeContext,
} from "@ktheme/react";

export default function ThemeStudio() {
  const app = useContext(AppContext);
  if (!app) {
    const kthemeCtx = useContext(KthemeContext);
    if (!kthemeCtx) return null;
    return <UnifiedThemeStudio embedded={false} />;
  }
  const state = app?.state || { customTheme: null };
  const actions = app?.actions || {};
  const [open, setOpen] = useState(false);
  const [importError, setImportError] = useState(null);
  const fileRef = useRef(null);
  const theme = state?.customTheme;

  const importFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImportError(null);
    try {
      const text = await file.text();
      const validation = validateThemeJson(text);
      if (!validation.valid) {
        setImportError(validation.errors.join("; "));
      } else {
        const ok = await actions.importTheme?.(text);
        if (!ok) {
          setImportError("Theme import failed. Check that the theme is valid.");
        }
      }
    } catch (err) {
      setImportError(
        `File import error: ${err.message || "Unable to read file."}`
      );
    } finally {
      if (event.target) event.target.value = "";
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleReset = () => {
    setImportError(null);
    actions.resetTheme?.();
  };

  return (
    <div className="theme-studio">
      <button
        className="theme-studio-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="theme-studio-icon">◈</span>
        <span>
          <strong>THEME STUDIO</strong>
          <small>{theme ? theme.name : "Make this palette your own"}</small>
        </span>
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && theme && (
        <div className="theme-studio-body">
          {importError && (
            <div className="theme-studio-alert" role="alert" aria-live="polite">
              <span className="theme-studio-alert-message">{importError}</span>
              <button
                className="theme-studio-alert-dismiss"
                onClick={() => setImportError(null)}
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}
          <label className="theme-name">
            THEME NAME
            <input
              value={theme.name}
              maxLength={48}
              onChange={(e) => actions.renameTheme?.(e.target.value)}
            />
          </label>
          <div className="theme-colors">
            {EDITABLE_THEME_TOKENS.map(([key, label]) => (
              <label className="color-field" key={key}>
                <span>{label}</span>
                <span className="color-control">
                  <input
                    type="color"
                    value={theme.colors[key]}
                    onChange={(e) =>
                      actions.setThemeColor?.(key, e.target.value)
                    }
                    aria-label={`${label} color`}
                  />
                  <code>{theme.colors[key].toUpperCase()}</code>
                </span>
              </label>
            ))}
          </div>
          <div className="theme-actions">
            <button onClick={actions.saveTheme}>SAVE TO DEVICE</button>
            <button onClick={actions.shareTheme}>COPY SHARE LINK</button>
            <button onClick={actions.downloadTheme}>EXPORT JSON</button>
            <button onClick={() => fileRef.current?.click()}>IMPORT</button>
            <button className="theme-reset" onClick={handleReset}>
              RESET
            </button>
          </div>
          <input
            ref={fileRef}
            className="visually-hidden"
            type="file"
            accept="application/json,.json"
            onChange={importFile}
          />
          <p className="theme-hint">
            Changes preview instantly. Save keeps them in this browser; a link
            or JSON file can be shared with anyone.
          </p>
        </div>
      )}
    </div>
  );
}
