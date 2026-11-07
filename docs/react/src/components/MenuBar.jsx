import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { FMENU, FLOATERS } from "../theme/constants.js";
import KInteractive from "./KInteractive.jsx";
import { useMenuNavigation } from "../hooks/useMenuNavigation.js";

// Ported from `fmBar`/`fmMenus` — the desktop-only File/Edit/View/World/
// Build/Help bar with Firestorm-style interactive menu commands.
export default function MenuBar() {
  const { state, actions } = useApp();
  const { V, t, ink, isFloat, isSweepDesk } = useTheme();
  if (!isFloat) return null;

  const handleMenuClick = (menuLabel, itemLabel) => {
    actions.setMenu(null);
    if (itemLabel === "Teleport Home") {
      actions.setScreen("Map");
      actions.notify("Teleporting Home...");
    } else if (itemLabel === "Preferences…") {
      actions.flFocus("Settings");
    } else if (itemLabel === "Appearance…") {
      actions.setScreen("Outfits");
    } else if (itemLabel === "About Linkpoint") {
      actions.notify("Linkpoint Viewer v2.0 (Firestorm Edition)");
    } else if (itemLabel === "Quit") {
      actions.setScreen("Login");
    } else {
      actions.notify(menuLabel + " > " + itemLabel);
    }
  };

  const resolvedMenus = FMENU.map((mm) => {
    const win = mm.items === "WINDOWS";
    const items = win
      ? FLOATERS.map((f) => [f.title, state.flOpen?.[f.id] && !state.flMin?.[f.id] ? "✓" : ""])
      : mm.items;
    return {
      label: mm.label,
      items,
      win,
    };
  });

  const handleSelectItem = (menuLabel, item) => {
    const itemLabel = Array.isArray(item) ? item[0] : (item?.label || item);
    const targetMenu = resolvedMenus.find((m) => m.label === menuLabel);
    if (targetMenu?.win) {
      const f = FLOATERS.find((x) => x.title === itemLabel);
      if (f) actions.flToggle(f.id);
      actions.setMenu(null);
    } else {
      handleMenuClick(menuLabel, itemLabel);
    }
  };

  const {
    menubarProps,
    getHeaderProps,
    getDropdownProps,
    getItemProps,
    focusedMenuIndex,
    focusedItemIndex,
  } = useMenuNavigation({
    menus: resolvedMenus,
    openMenu: state.menu,
    onOpenMenu: actions.setMenu,
    onSelect: handleSelectItem,
    ariaLabel: "Desktop Menu Bar",
  });

  return (
    <header
      aria-label="Desktop Menu Bar"
      style={{
        flex: "none",
        display: "flex",
        alignItems: "stretch",
        height: "32px",
        padding: "0 8px",
        background: V.surf,
        borderBottom: (isSweepDesk ? "2px solid " : "1px solid ") + (isSweepDesk ? V.pri : V.outv),
        position: "relative",
        zIndex: 80,
      }}
      onClick={() => state.menu && actions.setMenu(null)}
    >
      <div
        {...menubarProps}
        style={{
          display: "flex",
          alignItems: "stretch",
          height: "100%",
        }}
      >
        {resolvedMenus.map((mm, menuIdx) => {
          const open = state.menu === mm.label;
          const isHeaderFocused = focusedMenuIndex === menuIdx;
          const headerProps = getHeaderProps(menuIdx, mm.label);

          return (
            <div key={mm.label} style={{ position: "relative" }}>
              <KInteractive
                as="button"
                {...headerProps}
                label={mm.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                  padding: "0 10px",
                  cursor: "pointer",
                  background: open ? V.pri : "transparent",
                  color: open ? ink(V.pri, [V.bg, V.onpri, V.ink]) : V.ink,
                  font: (isSweepDesk ? "700 11px/1 " + t.dfont : "500 11px/1 " + t.font),
                  letterSpacing: (isSweepDesk ? ".12em" : ".04em"),
                  borderRadius: isSweepDesk ? "999px" : V.rs,
                  textTransform: isSweepDesk ? "uppercase" : "none",
                  outline: isHeaderFocused && !open ? "1px solid " + V.pri : "none",
                  outlineOffset: "-2px",
                }}
              >
                {mm.label}
              </KInteractive>
              {open ? (
                <div
                  {...getDropdownProps(menuIdx, mm.label)}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "32px",
                    minWidth: "216px",
                    background: V.surf,
                    border: "1px solid " + V.pri,
                    boxShadow: "0 14px 34px rgba(0,0,0,.55)",
                    padding: "3px 0",
                    zIndex: 90,
                    borderRadius: V.rp,
                    overflow: "hidden",
                  }}
                >
                  {mm.items.map((it, i) => {
                    const isItemFocused = focusedItemIndex === i;
                    const itemProps = getItemProps(menuIdx, i, it);

                    return (
                      <KInteractive
                        as="button"
                        key={i}
                        {...itemProps}
                        label={it[0] + (it[1] ? " " + it[1] : "")}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          width: "100%",
                          minHeight: "32px",
                          padding: "0 12px",
                          cursor: "pointer",
                          font: "400 11.5px/1 " + t.font,
                          color: isItemFocused ? ink(V.pri, [V.bg, V.onpri, V.ink]) : V.ink,
                          background: isItemFocused ? (V.priC || "rgba(255,255,255,0.12)") : "transparent",
                          outline: isItemFocused ? "1px solid " + V.pri : "none",
                          outlineOffset: "-1px",
                          textAlign: "left",
                        }}
                      >
                        <span style={{ flex: 1, font: "inherit" }}>{it[0]}</span>
                        <span style={{ flex: "none", font: "400 10px/1 " + t.font, color: V.ink2, letterSpacing: ".06em" }}>
                          {it[1]}
                        </span>
                      </KInteractive>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          font: "500 10.5px/1 " + t.font,
          color: V.ink2,
          letterSpacing: ".06em",
        }}
      >
        {"L$ 2 480   ·   Heliotrope (Adult)   ·   64 FPS   ·   14:32"}
      </div>
    </header>
  );
}
