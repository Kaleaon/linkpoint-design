import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { NAV_ALL, TABS_NAV_IDS } from "../data/content.js";
import Icon from "./Icon.jsx";
import { navActive } from "../theme/look.js";
import { TabGroup, TabList, Tab, TabPanel } from "./TabGroup.jsx";

// Ported from the `isTabs` <sc-if> block — bottom tab bar (Ink Terminal,
// Aero Glass, Press packs).
export default function BottomTabs({ children, style }) {
  const { state, actions } = useApp();
  const { V, t, nav, immersive } = useTheme();
  if (nav !== "tabs" || immersive) return null;
  const items = NAV_ALL.filter((n) => TABS_NAV_IDS.includes(n.id));

  const activeIndex = items.findIndex((n) => navActive(state.screen, n.id));

  const handleSelect = (index) => {
    if (items[index]) {
      actions.setScreen(items[index].id);
    }
  };

  return (
    <nav
      aria-label="Bottom Tabs Navigation"
      style={{ flex: "none", display: "flex", background: V.surf, borderTop: "1px solid " + V.outv, padding: "6px 0 10px", ...style }}
    >
      <TabGroup
        activeIndex={activeIndex >= 0 ? activeIndex : 0}
        onSelect={handleSelect}
        id="bottom-tabs"
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <TabList
          aria-label="Bottom Tabs Navigation"
          style={{ flex: 1, display: "flex" }}
        >
          {items.map((n, index) => {
            const active = navActive(state.screen, n.id);
            return (
              <Tab
                key={n.id}
                index={index}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "6px 0", cursor: "pointer", color: active ? V.pri : V.ink2, position: "relative" }}
              >
                <Icon name={n.icon} size={22} />
                <span style={{ font: "600 9px/1 " + t.font, letterSpacing: ".14em" }}>{n.label}</span>
                {n.badge ? (
                  <span style={{ position: "absolute", top: "2px", right: "24%", minWidth: "16px", height: "16px", padding: "0 4px", borderRadius: "8px", background: V.bdg, color: V.onbdg, font: "700 9px/16px " + t.font, textAlign: "center" }}>
                    {n.badge}
                  </span>
                ) : null}
              </Tab>
            );
          })}
        </TabList>
        {children || (
          <TabPanel
            index={activeIndex >= 0 ? activeIndex : 0}
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              padding: 0,
              margin: "-1px",
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          >
            {items[activeIndex]?.label || "Active"} Screen
          </TabPanel>
        )}
      </TabGroup>
    </nav>
  );
}

