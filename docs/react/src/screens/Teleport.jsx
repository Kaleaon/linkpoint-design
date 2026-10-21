import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { subView } from "../theme/constants.js";
import { panelLook } from "../theme/look.js";
import Icon from "../components/Icon.jsx";
import KInteractive from "../components/KInteractive.jsx";
import BlockKeypad from "../components/BlockKeypad.jsx";

const LANDMARKS_DATA = [
  {
    id: "lm-home",
    name: "Home — Da Boom Loft",
    region: "Da Boom",
    coords: "<128, 128, 26>",
    maturity: "General",
    category: "Favorites",
    avatars: 34,
    notes: "Primary build workshop and parcel landing point",
    slurl: "secondlife://Da%20Boom/128/128/26",
    pinned: true,
  },
  {
    id: "lm-hollywood",
    name: "Bay City — Hollywood Boardwalk",
    region: "Bay City — Hollywood",
    coords: "<112, 44, 51>",
    maturity: "Moderate",
    category: "Build Sites",
    avatars: 18,
    notes: "Urban architectural build jam and coastal tram line",
    slurl: "secondlife://Bay%20City%20—%20Hollywood/112/44/51",
    pinned: true,
  },
  {
    id: "lm-ahern",
    name: "Ahern Historic Welcome Hub",
    region: "Ahern",
    coords: "<128, 128, 28>",
    maturity: "General",
    category: "Social",
    avatars: 6,
    notes: "Historic mainland gateway and social gathering hub",
    slurl: "secondlife://Ahern/128/128/28",
    pinned: false,
  },
  {
    id: "lm-sansara",
    name: "Sansara Alpine Ridge Lookout",
    region: "Sansara Ridge",
    coords: "<64, 180, 42>",
    maturity: "General",
    category: "Nature",
    avatars: 0,
    notes: "Mountain trails, flight testing, and high vista overlook",
    slurl: "secondlife://Sansara%20Ridge/64/180/42",
    pinned: false,
  },
  {
    id: "lm-aqua",
    name: "Aqua Marina Coral Reef",
    region: "Aqua Marina",
    coords: "<200, 210, 15>",
    maturity: "Moderate",
    category: "Clubs",
    avatars: 12,
    notes: "Underwater dance club, live DJs, and ambient marine life",
    slurl: "secondlife://Aqua%20Marina/200/210/15",
    pinned: false,
  },
];

const TELEPORT_HISTORY = [
  {
    id: "hist-1",
    region: "Da Boom",
    coords: "<128, 128, 26>",
    timestamp: "Current Region",
    duration: "active",
    slurl: "secondlife://Da%20Boom/128/128/26",
  },
  {
    id: "hist-2",
    region: "Bay City — Hollywood",
    coords: "<112, 44, 51>",
    timestamp: "2 hours ago",
    duration: "45 min stay",
    slurl: "secondlife://Bay%20City%20—%20Hollywood/112/44/51",
  },
  {
    id: "hist-3",
    region: "Ahern",
    coords: "<128, 128, 28>",
    timestamp: "Yesterday 18:20",
    duration: "20 min stay",
    slurl: "secondlife://Ahern/128/128/28",
  },
  {
    id: "hist-4",
    region: "Sansara Ridge",
    coords: "<64, 180, 42>",
    timestamp: "3 days ago",
    duration: "1h 10m stay",
    slurl: "secondlife://Sansara%20Ridge/64/180/42",
  },
];

export default function Teleport() {
  const { state, actions } = useApp();
  const { V, t, LK, bleed, pad, ink } = useTheme();
  const curSub = subView(state, "Teleport") || "LANDMARK";
  const cardStyle = (accent) => panelLook(V, LK, pad, accent);

  const [slurlInput, setSlurlInput] = useState("");
  const [category, setCategory] = useState("ALL");
  const [history, setHistory] = useState(TELEPORT_HISTORY);
  const [landmarks, setLandmarks] = useState(LANDMARKS_DATA);
  const [keypadConfig, setKeypadConfig] = useState(null);

  const actBtn = (primary = false) => ({
    minHeight: "44px",
    padding: "0 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    cursor: "pointer",
    background: primary ? V.pri : V.surf2,
    color: primary ? ink(V.pri, [V.bg, V.onpri, V.ink]) : V.ink,
    border: "1px solid " + (primary ? V.pri : V.outv),
    borderRadius: V.rs,
    font: "700 10.5px/1 " + t.dfont,
    letterSpacing: ".1em",
    whiteSpace: "nowrap",
  });

  const handleSlurlTeleport = (e) => {
    e?.preventDefault();
    if (!slurlInput.trim()) return;
    const target = slurlInput.trim();
    actions.notify(`Teleporting to ${target}...`);
    actions.setScreen("Map");
  };

  const openCoordKeypad = () => {
    setKeypadConfig({
      title: "SIM COORDINATE VECTOR",
      subtitle: "Enter X, Y, or Z vector coordinates (e.g. 128)",
      systemCode: "NAV-01-COORD",
      initialValue: "128",
      unit: "<XYZ>",
      unitPosition: "suffix",
      presets: [64, 128, 192, 256],
      max: 512,
      onConfirm: (val) => {
        setSlurlInput((prev) => (prev ? `${prev}/${val}` : `secondlife://Da%20Boom/${val}/${val}/26`));
        actions.notify(`Coordinate vector set: ${val}`);
        setKeypadConfig(null);
      },
      onCancel: () => setKeypadConfig(null),
    });
  };

  const triggerTeleport = (placeName, coords) => {
    actions.notify(`Initiating teleport sequence to ${placeName} ${coords}...`);
    actions.setScreen("Map");
  };

  const togglePin = (lmId) => {
    setLandmarks((prev) =>
      prev.map((lm) => (lm.id === lmId ? { ...lm, pinned: !lm.pinned } : lm))
    );
  };

  const categories = ["ALL", "Favorites", "Build Sites", "Social", "Nature", "Clubs"];

  const filteredLandmarks = landmarks.filter(
    (lm) => category === "ALL" || lm.category === category
  );

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: bleed ? "6px" : "10px",
        padding: bleed ? "8px 0 16px" : "8px 16px 16px",
      }}
    >
      {/* SLURL Teleport Resolver Bar */}
      <div style={{ ...cardStyle(V.pri), display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Icon name="zap" size={20} style={{ color: V.pri }} />
            <div>
              <div style={{ font: "700 9px/1 " + t.dfont, letterSpacing: ".18em", color: V.sec2 || V.pri }}>
                [NAV-01-8012] SPATIAL COORDINATE BEACONS
              </div>
              <div style={{ font: "700 15px/1.2 " + t.dfont, color: V.ink, marginTop: "2px" }}>Teleport &amp; Places</div>
              <div style={{ font: "400 11px/1.3 " + t.font, color: V.ink2, marginTop: "2px" }}>
                Current region: <span style={{ color: V.ink, fontWeight: 600 }}>Da Boom &lt;128, 128, 26&gt;</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "6px" }}>
            <KInteractive
              as="button"
              onClick={() => triggerTeleport("Home (Da Boom)", "<128, 128, 26>")}
              style={actBtn(true)}
              aria-label="Teleport home"
            >
              <Icon name="home" size={13} />
              <span>TELEPORT HOME</span>
            </KInteractive>

            <KInteractive
              as="button"
              onClick={() => actions.notify("Home location set to current position <128, 128, 26>")}
              style={actBtn(false)}
              aria-label="Set home here"
            >
              <Icon name="map-pin" size={13} />
              <span>SET HOME HERE</span>
            </KInteractive>
          </div>
        </div>

        {/* SLURL Input Bar */}
        <form onSubmit={handleSlurlTeleport} style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <div
            style={{
              flex: 1,
              minWidth: "220px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: V.surf2,
              padding: "0 12px",
              border: "1px solid " + V.outv,
              borderRadius: V.rs,
              minHeight: "44px",
            }}
          >
            <Icon name="link" size={15} style={{ color: V.ink2 }} />
            <input
              type="text"
              placeholder="Enter SLURL (e.g. secondlife://Hollywood/112/44/51) or region..."
              value={slurlInput}
              onChange={(e) => setSlurlInput(e.target.value)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: V.ink,
                font: "400 12px/1.4 " + t.font,
              }}
              aria-label="SLURL input"
            />
            {slurlInput && (
              <button
                type="button"
                onClick={() => setSlurlInput("")}
                style={{ background: "transparent", border: "none", color: V.ink2, cursor: "pointer" }}
                aria-label="Clear input"
              >
                <Icon name="x" size={13} />
              </button>
            )}
          </div>

          <KInteractive
            as="button"
            type="button"
            onClick={openCoordKeypad}
            style={actBtn(false)}
            aria-label="Open coordinate numeric keypad"
          >
            <Icon name="grid" size={13} />
            <span>KEYPAD COORDS</span>
          </KInteractive>

          <KInteractive
            as="button"
            type="submit"
            style={actBtn(true)}
            aria-label="Teleport to SLURL"
          >
            <Icon name="send" size={13} />
            <span>RESOLVE &amp; TELEPORT</span>
          </KInteractive>
        </form>
      </div>

      {/* LANDMARK SUB-VIEW */}
      {curSub === "LANDMARK" && (
        <>
          {/* Category Pills */}
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "2px" }}>
            {categories.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    minHeight: "36px",
                    padding: "0 12px",
                    borderRadius: V.rs,
                    background: active ? V.pri : V.surf2,
                    color: active ? ink(V.pri, [V.bg, V.onpri, V.ink]) : V.ink2,
                    border: "1px solid " + (active ? V.pri : V.outv),
                    font: "700 10.5px/1 " + t.dfont,
                    letterSpacing: ".08em",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat.toUpperCase()}
                </button>
              );
            })}
          </div>

          {/* Landmarks List */}
          <div style={{ display: "flex", flexDirection: "column", gap: bleed ? "4px" : "8px" }}>
            {filteredLandmarks.map((lm) => (
              <div
                key={lm.id}
                style={{
                  ...cardStyle(lm.pinned ? V.pri : undefined),
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: V.rs,
                        background: V.surf2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: V.pri,
                        border: "1px solid " + V.outv,
                      }}
                    >
                      <Icon name="map-pin" size={18} />
                    </div>
                    <div>
                      <div style={{ font: "700 8.5px/1 " + t.dfont, letterSpacing: ".14em", color: V.sec2 || V.pri }}>
                        [NAV-01-LMK]
                      </div>
                      <div style={{ font: "700 14px/1.2 " + t.dfont, color: V.ink, marginTop: "1px" }}>{lm.name}</div>
                      <div style={{ font: "400 11.5px/1.3 " + t.font, color: V.ink2, marginTop: "2px" }}>
                        {lm.region} {lm.coords} · {lm.notes}
                      </div>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "4px" }}>
                        <span style={{ font: "600 10px/1 " + (t.mfont || t.font), padding: "2px 6px", borderRadius: "3px", background: V.surf2, color: V.ink2, border: "1px solid " + V.outv }}>
                          {lm.maturity}
                        </span>
                        <span style={{ font: "600 10px/1 " + (t.mfont || t.font), padding: "2px 6px", borderRadius: "3px", background: V.surf2, color: V.pri, border: "1px solid " + V.outv }}>
                          👥 {lm.avatars} in region
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => togglePin(lm.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: lm.pinned ? V.pri : V.ink2,
                      cursor: "pointer",
                      padding: "4px",
                    }}
                    aria-label={lm.pinned ? "Unpin landmark" : "Pin landmark"}
                  >
                    <Icon name="pin" size={16} />
                  </button>
                </div>

                <div style={{ display: "flex", gap: "6px", borderTop: "1px solid " + V.outv, paddingTop: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <KInteractive
                    as="button"
                    onClick={() => triggerTeleport(lm.name, lm.coords)}
                    style={actBtn(true)}
                    aria-label={`Teleport to ${lm.name}`}
                  >
                    <Icon name="zap" size={13} />
                    <span>TELEPORT</span>
                  </KInteractive>

                  <KInteractive
                    as="button"
                    onClick={() => {
                      actions.notify(`Viewing ${lm.region} on World Map`);
                      actions.setScreen("Map");
                    }}
                    style={actBtn(false)}
                    aria-label={`Show ${lm.name} on map`}
                  >
                    <Icon name="map" size={13} />
                    <span>SHOW ON MAP</span>
                  </KInteractive>

                  <KInteractive
                    as="button"
                    onClick={() => actions.notify(`Copied SLURL: ${lm.slurl}`)}
                    style={actBtn(false)}
                    aria-label="Copy SLURL"
                  >
                    <Icon name="copy" size={13} />
                    <span>COPY SLURL</span>
                  </KInteractive>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* HISTORY SUB-VIEW */}
      {curSub === "HISTORY" && (
        <div style={{ display: "flex", flexDirection: "column", gap: bleed ? "4px" : "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px" }}>
            <span style={{ font: "600 11px/1 " + t.dfont, color: V.ink2, letterSpacing: ".08em" }}>
              RECENT TELEPORT LOCATIONS ({history.length})
            </span>
            <KInteractive
              as="button"
              onClick={() => {
                setHistory([]);
                actions.notify("Teleport history cleared");
              }}
              style={actBtn(false)}
              aria-label="Clear teleport history"
            >
              <Icon name="trash-2" size={12} />
              <span>CLEAR HISTORY</span>
            </KInteractive>
          </div>

          {history.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: V.ink2, font: "400 13px/1.4 " + t.font }}>
              Teleport history is empty.
            </div>
          ) : (
            history.map((h) => (
              <div
                key={h.id}
                style={{
                  ...cardStyle(h.timestamp === "Current Region" ? V.pri : undefined),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: V.rs,
                      background: V.surf2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: V.pri,
                      border: "1px solid " + V.outv,
                    }}
                  >
                    <Icon name="history" size={18} />
                  </div>
                  <div>
                    <div style={{ font: "700 8.5px/1 " + t.dfont, letterSpacing: ".14em", color: V.sec2 || V.pri }}>
                      [NAV-01-HIST]
                    </div>
                    <div style={{ font: "700 13.5px/1.2 " + t.dfont, color: V.ink, marginTop: "1px" }}>{h.region}</div>
                    <div style={{ font: "400 11px/1.3 " + t.font, color: V.ink2, marginTop: "2px" }}>
                      {h.coords} · {h.timestamp} ({h.duration})
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  <KInteractive
                    as="button"
                    onClick={() => triggerTeleport(h.region, h.coords)}
                    style={actBtn(true)}
                    aria-label={`Teleport to ${h.region}`}
                  >
                    <Icon name="zap" size={13} />
                    <span>TELEPORT</span>
                  </KInteractive>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Block-Matrix Numeric Keypad Modal */}
      {keypadConfig && <BlockKeypad {...keypadConfig} />}
    </div>
  );
}
