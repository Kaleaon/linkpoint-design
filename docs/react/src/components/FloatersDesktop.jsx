import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { LAYOUTS } from "../theme/layouts.js";
import { PALETTES } from "../theme/palettes.js";
import { FLOATERS, FBAR, CBTN } from "../theme/constants.js";
import { LOCAL_MSGS, RADAR_AVATARS, FRIEND_ROWS, INVENTORY_SOURCE, REGIONS, buildCards } from "../data/content.js";
import Icon from "./Icon.jsx";
import ScreenBody from "./ScreenBody.jsx";

// Ported from the `isFloat` block: desktop SL isn't a screen stack, it's N
// resizable windows over one scene (the `FLOATERS` window model — position,
// size, z-order and minimise all live in state). The currently-focused
// floater's real interactive screen content is overlaid on top of its
// window chrome via `shellStyle`; every other open floater just shows a
// read-only preview list built from the same data (`FBODY` in the source).
export default function FloatersDesktop() {
  const { state, actions } = useApp();
  const { V, t, ink } = useTheme();

  const cardsByScreen = buildCards({ state, actions, layoutName: LAYOUTS[state.layout].name, paletteName: PALETTES[state.palette].name });
  const fBody = buildFBody(state, cardsByScreen);

  const flScene = {
    position: "absolute", inset: 0, overflow: "hidden", cursor: state.cDrag ? "grabbing" : "grab",
    background: "linear-gradient(180deg," + V.sky1 + " 0%," + V.sky2 + " 52%," + V.gnd + " 52%," + V.gnd2 + " 100%)",
  };
  const flHorizon = {
    position: "absolute", inset: "-20% -40%", transform: "translate(" + (-state.cHdg * 0.9).toFixed(1) + "px," + (state.cPitch * 0.8).toFixed(1) + "px)",
    transition: state.cDrag ? "none" : "transform .35s ease-out", opacity: 0.45, backgroundImage: "repeating-linear-gradient(90deg," + V.outv + " 0 1px,transparent 1px 104px)",
  };
  const regionRead = "HELIOTROPE · 128,64,42 · HDG " + String(Math.round(((state.cHdg % 360) + 360) % 360)).padStart(3, "0") + "° " + (state.cPitch > 2 ? "DN" : state.cPitch < -2 ? "UP" : "LVL");

  const openFloaters = FLOATERS.filter((f) => state.flOpen[f.id] && !state.flMin[f.id]);
  const flFocused = state.flOpen[state.screen] && !state.flMin[state.screen] ? actions.flR(state.screen) : null;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: V.bg }}>
      <div
        onMouseDown={actions.sceneDown}
        onMouseMove={actions.sceneMove}
        onMouseUp={actions.sceneUp}
        onMouseLeave={actions.sceneUp}
        onClick={() => state.menu && actions.setMenu(null)}
        style={flScene}
      >
        <div style={flHorizon} />
        <div style={{ position: "absolute", left: "14px", bottom: "52px", display: "flex", alignItems: "center", height: "24px", padding: "0 11px", background: V.surf, color: V.ink2, font: "500 10px/1 " + t.font, letterSpacing: ".08em", borderLeft: "5px solid " + V.sec2 }}>
          {regionRead}
        </div>
      </div>

      {openFloaters.map((f) => {
        const r = actions.flR(f.id);
        const act = f.id === state.screen;
        const rows = act ? null : fBody[f.id] || [];
        return (
          <div
            key={f.id}
            onMouseDown={() => actions.flFocus(f.id)}
            style={{
              position: "absolute", left: r.x + "px", top: r.y + "px", width: r.w + "px", height: r.h + "px",
              zIndex: 10 + Math.max(0, state.flZ.indexOf(f.id)), display: "flex", flexDirection: "column", background: V.surf,
              border: "1px solid " + (act ? V.pri : V.outv), borderRadius: V.rp, overflow: "hidden",
              boxShadow: act ? "0 16px 44px rgba(0,0,0,.58)" : "0 6px 18px rgba(0,0,0,.34)",
            }}
          >
            <div
              onMouseDown={(e) => actions.flDrag(f.id, e, "move")}
              style={{ flex: "none", height: FBAR + "px", display: "flex", alignItems: "center", gap: "7px", padding: "0 5px 0 9px", background: act ? V.pri : V.surf2, color: act ? ink(V.pri, [V.bg, V.onpri, V.ink]) : V.ink2, font: "600 10px/1 " + t.dfont, letterSpacing: ".12em", cursor: "move", userSelect: "none" }}
            >
              <Icon name={f.icon} size={13} />
              <span style={{ flex: 1, minWidth: 0, font: "inherit", letterSpacing: "inherit", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{f.title}</span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  actions.flToggle(f.id);
                }}
                style={{ width: "17px", height: "17px", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid currentColor", borderRadius: V.rs, font: "600 11px/1 " + t.font, cursor: "pointer", opacity: 0.75 }}
              >
                &minus;
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  actions.flClose(f.id);
                }}
                style={{ width: "17px", height: "17px", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid currentColor", borderRadius: V.rs, font: "600 11px/1 " + t.font, cursor: "pointer", opacity: 0.75 }}
              >
                &times;
              </span>
            </div>
            {rows ? (
              <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1px", background: V.bg }}>
                {rows.map((row, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", minHeight: "26px", padding: "0 10px", background: V.surf }}>
                    <span style={{ flex: 1, minWidth: 0, font: "400 11.5px/1.2 " + t.font, color: V.ink, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{row.a}</span>
                    <span style={{ flex: "none", font: "400 10px/1 " + t.font, color: V.ink2 }}>{row.b}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ flex: 1, minHeight: 0, background: V.bg }} />
            )}
            <div
              onMouseDown={(e) => actions.flDrag(f.id, e, "size")}
              style={{ position: "absolute", right: 0, bottom: 0, width: "15px", height: "15px", cursor: "nwse-resize", background: "linear-gradient(135deg,transparent 0 52%," + (act ? V.pri : V.outv) + " 52% 100%)" }}
            />
          </div>
        );
      })}

      {flFocused ? (
        <div
          style={{
            position: "absolute", left: flFocused.x + "px", top: flFocused.y + FBAR + "px", width: flFocused.w + "px", height: flFocused.h - FBAR + "px",
            display: "flex", minWidth: 0, overflow: "hidden", background: V.surf, borderWidth: "0 1px 1px", borderStyle: "solid", borderColor: V.pri,
            borderBottomLeftRadius: V.rp, borderBottomRightRadius: V.rp,
            boxSizing: "border-box", zIndex: 50,
          }}
        >
          <ScreenBody />
        </div>
      ) : null}

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "40px", display: "flex", alignItems: "center", gap: "4px", padding: "0 8px", background: V.surf, borderTop: "1px solid " + V.outv, zIndex: 60 }}>
        {FLOATERS.filter((f) => state.flOpen[f.id]).map((f) => {
          const min = !!state.flMin[f.id];
          const act = f.id === state.screen && !min;
          return (
            <div
              key={f.id}
              onClick={() => actions.flToggle(f.id)}
              style={{ flex: "none", height: "26px", display: "flex", alignItems: "center", padding: "0 10px", cursor: "pointer", background: act ? V.pri : min ? "transparent" : V.surf2, color: act ? ink(V.pri, [V.bg, V.onpri, V.ink]) : V.ink2, border: "1px solid " + (min ? V.outv : "transparent"), borderRadius: V.rs, font: "500 10px/1 " + t.font, letterSpacing: ".08em", whiteSpace: "nowrap" }}
            >
              {f.title}
            </div>
          );
        })}
        <div style={{ flex: 1, minWidth: "8px" }} />
        {state.cDock.map((k) => {
          const b = CBTN[k],
            lit = !!state.cTog[k],
            dis = !!b.off;
          const bg = lit ? V.pri : V.surf2;
          return (
            <div
              key={k}
              onClick={() => actions.cPress(k)}
              style={{ flex: "none", height: "26px", display: "flex", alignItems: "center", gap: "6px", padding: "0 9px", background: dis ? "transparent" : bg, color: dis ? V.ink2 : ink(bg, [V.bg, V.onpri, V.ink]), border: "1px solid " + (dis ? V.outv : "transparent"), borderRadius: V.rs, cursor: dis ? "not-allowed" : "pointer", font: "600 9.5px/1 " + t.dfont, letterSpacing: ".1em", whiteSpace: "nowrap" }}
            >
              <Icon name={b.icon} size={13} />
              {b.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Ported from `FBODY` — unfocused floaters keep ticking with real data, not
// placeholders.
function buildFBody(state, cardsByScreen) {
  const invNodes = INVENTORY_SOURCE.map(([name, icon, depth, parent, ver]) => ({ name, ver, parent, depth })).filter((n) => n.depth === 0 || (n.parent && state.invOpen[n.parent] !== false));
  return {
    Chat: LOCAL_MSGS.slice(-6).map((m) => ({ a: m.sender, b: m.ts })),
    Radar: RADAR_AVATARS.slice()
      .sort((a, b) => a[1] - b[1])
      .slice(0, 8)
      .map((r) => ({ a: r[0], b: r[1] + "m" })),
    Friends: FRIEND_ROWS.map((r) => ({ a: r[0], b: r[1].split(" · ")[0] })),
    Inventory: invNodes.map((n) => ({ a: n.name, b: n.ver })),
    Map: REGIONS.map(([name, meta]) => ({ a: name, b: meta })),
    Profile: [
      { a: "Nyx Vaher", b: "online" },
      { a: "Region", b: "Da Boom" },
      { a: "Rezzed", b: "2007-03-14" },
      { a: "Groups", b: "12" },
    ],
    Groups: (cardsByScreen.Groups || []).map((c) => ({ a: c.title, b: c.right || "" })),
    Notices: (cardsByScreen.Notices || []).map((c) => ({ a: c.title, b: c.right || "" })),
    Teleport: (cardsByScreen.Teleport || []).map((c) => ({ a: c.title, b: c.right || "" })),
    Settings: (cardsByScreen.Settings || []).map((c) => ({ a: c.title, b: c.right || "" })),
    Diagnostics: (cardsByScreen.Diagnostics || []).map((c) => ({ a: c.title, b: c.right || "" })),
  };
}
