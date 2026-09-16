import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { FMENU, FLOATERS } from "../theme/constants.js";

// Ported from `fmBar`/`fmMenus` — the desktop-only File/Edit/View/World/
// Build/Help bar. Every menu besides View>Windows is decorative in the
// source (clicking an item just closes the menu); View>Windows toggles the
// matching floater open/closed, exactly like the mockup.
export default function MenuBar() {
  const { state, actions } = useApp();
  const { V, t, ink, isFloat } = useTheme();
  if (!isFloat) return null;

  return (
    <div style={{ flex: "none", display: "flex", alignItems: "stretch", height: "28px", padding: "0 8px", background: V.surf, borderBottom: "1px solid " + V.outv, position: "relative", zIndex: 80 }} onClick={() => state.menu && actions.setMenu(null)}>
      {FMENU.map((mm) => {
        const open = state.menu === mm.label;
        const win = mm.items === "WINDOWS";
        const items = win ? FLOATERS.map((f) => [f.title, state.flOpen[f.id] && !state.flMin[f.id] ? "✓" : ""]) : mm.items;
        return (
          <div key={mm.label} style={{ position: "relative" }}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                actions.setMenu(state.menu === mm.label ? null : mm.label);
              }}
              style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 10px", cursor: "pointer", background: open ? V.pri : "transparent", color: open ? ink(V.pri, [V.bg, V.onpri, V.ink]) : V.ink, font: "500 11px/1 " + t.font, letterSpacing: ".04em" }}
            >
              {mm.label}
            </div>
            {open ? (
              <div style={{ position: "absolute", left: 0, top: "28px", minWidth: "216px", background: V.surf, border: "1px solid " + V.pri, boxShadow: "0 14px 34px rgba(0,0,0,.55)", padding: "3px 0", zIndex: 90 }}>
                {items.map((it, i) => (
                  <div
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!win) {
                        actions.setMenu(null);
                        return;
                      }
                      const f = FLOATERS.find((x) => x.title === it[0]);
                      if (f) actions.flToggle(f.id);
                    }}
                    style={{ display: "flex", alignItems: "center", gap: "10px", minHeight: "26px", padding: "0 12px", cursor: "pointer", font: "400 11.5px/1 " + t.font, color: V.ink }}
                  >
                    <span style={{ flex: 1, font: "inherit" }}>{it[0]}</span>
                    <span style={{ flex: "none", font: "400 10px/1 " + t.font, color: V.ink2, letterSpacing: ".06em" }}>{it[1]}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "16px", font: "500 10.5px/1 " + t.font, color: V.ink2, letterSpacing: ".06em" }}>
        {"L$ 2 480   ·   Heliotrope (Adult)   ·   64 FPS   ·   14:32"}
      </div>
    </div>
  );
}
