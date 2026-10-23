import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { subView } from "../theme/constants.js";
import { REGIONS } from "../data/content.js";
import Icon from "../components/Icon.jsx";

// Ported from the `isMap` <sc-if> block: 4-region grid ground, a live SL map
// tile (falls back to a themed note if the CDN image 404s, same as `tileOk`),
// zoom/locate buttons and the teleport/favourite footer.
export default function Map() {
  const { state } = useApp();
  const [tileOk, setTileOk] = useState(true);
  // WORLD lays the four loaded regions over the tile; MINI drops that grid for a
  // single centred position readout, the way a viewer's minimap does.
  const mini = subView(state, "Map") === "MINI";

  const mapBoxStyle = {
    flex: 1,
    minHeight: 0,
    margin: "2px 16px",
    position: "relative",
    overflow: "hidden",
    border: "1px solid var(--ktheme-outv)",
    borderRadius: "var(--ktheme-rs)",
    background: "var(--ktheme-surf)",
  };
  const mapFootStyle = { flex: "none", display: "flex", gap: "8px", padding: "12px 16px" };

  return (
    <>
      <div style={mapBoxStyle}>
        <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr" }}>
          {(mini ? [] : REGIONS).map(([name, meta], i) => (
            <div key={name} style={{ border: "1px solid var(--ktheme-outv)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "8px", background: i === 0 ? "rgba(212,175,55,0.15)" : "var(--ktheme-surf2)", borderColor: i === 0 ? "var(--ktheme-pri)" : "var(--ktheme-outv)" }}>
              <span style={{ font: "600 11px/1.25 var(--ktheme-font, system-ui, sans-serif)", color: "var(--ktheme-ink)", display: "block" }}>{name}</span>
              <span style={{ font: "400 9.5px/1.25 var(--ktheme-font, system-ui, sans-serif)", color: "var(--ktheme-ink2)", display: "block" }}>{meta}</span>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", inset: 0 }}>
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
          <div style={{ position: "absolute", left: "10px", top: "10px", display: "flex", flexDirection: "column", gap: "3px", background: "var(--ktheme-surf)", border: "1px solid var(--ktheme-outv)", borderRadius: "var(--ktheme-rs)", padding: "8px 10px" }}>
            {[["REGION", "Da Boom"], ["POSITION", "<128, 128, 26>"], ["HEADING", "214\u00b0 \u00b7 SW"], ["DRAW", state.prefs?.draw || "128m"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: "12px", font: "400 10px/1.4 var(--ktheme-font, system-ui, sans-serif)", color: "var(--ktheme-ink2)" }}>
                <span style={{ width: "62px", flex: "none", letterSpacing: ".16em", color: "var(--ktheme-pri)" }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        ) : null}
        <div style={{ position: "absolute", left: "50%", top: "50%", width: "14px", height: "14px", margin: "-7px 0 0 -7px", borderRadius: "7px", background: "var(--ktheme-pri)", border: "2px solid var(--ktheme-bg)" }} />
        <div style={{ position: "absolute", right: "10px", top: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
          {["plus", "minus", "locate-fixed"].map((mb) => (
            <div key={mb} style={{ width: "44px", height: "44px", border: "1px solid var(--ktheme-outv)", borderRadius: "var(--ktheme-rs)", background: "var(--ktheme-surf)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ktheme-ink)" }}>
              <Icon name={mb} size={16} />
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: "10px", bottom: "10px", font: "400 9.5px/1.35 var(--ktheme-font, system-ui, sans-serif)", color: "var(--ktheme-ink2)", background: "var(--ktheme-surf)", border: "1px solid var(--ktheme-outv)", padding: "4px 6px", maxWidth: "74%" }}>
          {mini ? "minimap · north up · draw distance " + (state.prefs?.draw || "128m") : tileOk ? "live SL map tile · secondlife-maps-cdn" : "tile CDN unreachable — themed vector grid fallback"}
        </div>
      </div>
      <div style={mapFootStyle}>
        <div style={{ flex: 1, height: "46px", borderRadius: "var(--ktheme-rs)", background: "var(--ktheme-pri)", color: "var(--ktheme-onpri)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", font: "700 12px/1 var(--ktheme-font, system-ui, sans-serif)", letterSpacing: ".2em", cursor: "pointer" }}>
          <Icon name="zap" size={16} />
          TELEPORT
        </div>
        <div style={{ width: "46px", height: "46px", border: "1px solid var(--ktheme-outv)", borderRadius: "var(--ktheme-rs)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ktheme-pri)" }}>
          <Icon name="star" size={18} />
        </div>
      </div>
    </>
  );
}
