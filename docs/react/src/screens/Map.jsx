import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { subView } from "../theme/constants.js";
import { REGIONS } from "../data/content.js";
import Icon from "../components/Icon.jsx";
import KInteractive from "../components/KInteractive.jsx";

// Ported from the `isMap` <sc-if> block: 4-region grid ground, a live SL map
// tile (falls back to a themed note if the CDN image 404s, same as `tileOk`),
// zoom/locate buttons and the teleport/favourite footer.
export default function Map() {
  const { state, actions } = useApp();
  const { V, t, bleed, C } = useTheme();
  const [tileOk, setTileOk] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("Da Boom");
  // WORLD lays the four loaded regions over the tile; MINI drops that grid for a
  // single centred position readout, the way a viewer's minimap does.
  const mini = subView(state, "Map") === "MINI";

  const mapBoxStyle = bleed
    ? { flex: 1, minHeight: 0, position: "relative", overflow: "hidden", background: V.surf, borderRadius: C.rad + "px 0 0 0" }
    : { flex: 1, minHeight: 0, margin: "2px 16px", position: "relative", overflow: "hidden", border: "1px solid " + V.outv, borderRadius: V.rp, background: V.surf };
  const mapFootStyle = { flex: "none", display: "flex", gap: "8px", padding: bleed ? "10px 0 10px 10px" : "12px 16px" };

  return (
    <>
      <div style={mapBoxStyle}>
        <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr" }}>
          {(mini ? [] : REGIONS).map(([name, meta], i) => {
            const isSelected = selectedRegion === name || (i === 0 && !selectedRegion);
            return (
              <KInteractive
                key={name}
                onClick={() => {
                  setSelectedRegion(name);
                  actions.notify(`Selected region: ${name}`);
                }}
                label={`Select region ${name}`}
                style={{
                  border: "1px solid " + (isSelected ? V.pri : V.outv),
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "8px",
                  background: isSelected ? V.priC : V.surf2,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{ font: "600 11px/1.25 " + t.font, color: V.ink, display: "block" }}>{name}</span>
                <span style={{ font: "400 9.5px/1.25 " + t.font, color: V.ink2, display: "block" }}>{meta}</span>
              </KInteractive>
            );
          })}
        </div>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {tileOk ? (
            <img
              src="https://secondlife-maps-cdn.akamaized.net/map-1-1000-1000-objects.jpg"
              alt=""
              onError={() => setTileOk(false)}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }}
            />
          ) : null}
        </div>
        {mini ? (
          <div style={{ position: "absolute", left: "10px", top: "10px", display: "flex", flexDirection: "column", gap: "3px", background: V.surf, border: "1px solid " + V.outv, borderRadius: V.rs, padding: "8px 10px" }}>
            {[["REGION", "Da Boom"], ["POSITION", "<128, 128, 26>"], ["HEADING", "214\u00b0 \u00b7 SW"], ["DRAW", state.prefs.draw]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: "12px", font: "400 10px/1.4 " + t.font, color: V.ink2 }}>
                <span style={{ width: "62px", flex: "none", letterSpacing: ".16em", color: V.pri }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        ) : null}
        <div style={{ position: "absolute", left: "50%", top: "50%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "7px", background: V.pri, border: "2px solid " + V.bg, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: "10px", top: "10px", display: "flex", flexDirection: "column", gap: "6px", zIndex: 10 }}>
          {["plus", "minus", "locate-fixed"].map((mb) => (
            <KInteractive
              key={mb}
              onClick={() => {
                if (mb === "plus") actions.notify("Zoomed in map view");
                else if (mb === "minus") actions.notify("Zoomed out map view");
                else actions.notify("Centered on current location");
              }}
              label={`Map ${mb}`}
              style={{ width: "44px", height: "44px", border: "1px solid " + V.outv, borderRadius: V.rs, background: V.surf, display: "flex", alignItems: "center", justifyContent: "center", color: V.ink, cursor: "pointer" }}
            >
              <Icon name={mb} size={16} />
            </KInteractive>
          ))}
        </div>
        <div style={{ position: "absolute", left: "10px", bottom: "10px", font: "400 9.5px/1.35 " + t.font, color: V.ink2, background: V.surf, border: "1px solid " + V.outv, padding: "4px 6px", maxWidth: "74%", pointerEvents: "none" }}>
          {mini ? "minimap · north up · draw distance " + state.prefs.draw : tileOk ? "live SL map tile · secondlife-maps-cdn" : "tile CDN unreachable — themed vector grid fallback"}
        </div>
      </div>
      <div style={mapFootStyle}>
        <KInteractive
          onClick={() => actions.teleportToRegion(selectedRegion)}
          label="Teleport to region"
          style={{ flex: 1, height: "46px", borderRadius: V.rs, background: V.pri, color: V.onpri, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", font: "700 12px/1 " + t.font, letterSpacing: ".2em", cursor: "pointer" }}
        >
          <Icon name="zap" size={16} />
          TELEPORT
        </KInteractive>
        <KInteractive
          onClick={() => actions.saveLandmark(selectedRegion)}
          label="Bookmark location"
          style={{ width: "46px", height: "46px", border: "1px solid " + V.outv, borderRadius: V.rs, display: "flex", alignItems: "center", justifyContent: "center", color: V.pri, cursor: "pointer" }}
        >
          <Icon name="star" size={18} />
        </KInteractive>
      </div>
    </>
  );
}
