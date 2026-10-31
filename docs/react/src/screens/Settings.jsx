import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { subView } from "../theme/constants.js";
import Icon from "../components/Icon.jsx";
import KInteractive from "../components/KInteractive.jsx";

export default function Settings() {
  const { state, actions } = useApp();
  const { V, t, bleed, pad, ink } = useTheme();
  const curSub = subView(state, "Settings") || "PREFS";

  const { prefs, toggles, dense } = state;
  const [activeCategory, setActiveCategory] = useState("GRAPHICS");

  const actBtn = (primary = false) => ({
    minHeight: "44px",
    padding: "0 14px",
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

  const selectStyle = {
    minHeight: "44px",
    padding: "0 10px",
    borderRadius: V.rs,
    background: V.surf2,
    color: V.ink,
    border: "1px solid " + V.outv,
    font: "600 12px/1 " + t.font,
    outline: "none",
    cursor: "pointer",
  };

  const categories = [
    "GRAPHICS",
    "AUDIO & VOICE",
    "NETWORK",
    "GENERAL",
    "UI & DENSITY",
  ];

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
      {/* Header Banner */}
      <div
        style={{
          padding: pad,
          background: V.surf,
          border: bleed ? "none" : "1px solid " + V.outv,
          borderLeft: bleed ? "4px solid " + V.pri : undefined,
          borderRadius: bleed ? 0 : V.rp,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: V.rs,
              background: V.surf2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: V.pri,
              border: "1px solid " + V.outv,
              flexShrink: 0,
            }}
          >
            <Icon name="settings" size={22} />
          </div>
          <div>
            <div style={{ font: "700 15px/1.2 " + t.dfont, color: V.ink }}>
              Viewer Preferences
            </div>
            <div
              style={{
                font: "400 11px/1.3 " + t.font,
                color: V.ink2,
                marginTop: "2px",
              }}
            >
              Configure rendering quality, audio mixing, network limits, and
              privacy controls
            </div>
          </div>
        </div>

        <KInteractive
          as="button"
          onClick={() => actions.notify("Preferences saved to local storage")}
          style={actBtn(true)}
          aria-label="Save preferences"
        >
          <Icon name="save" size={13} />
          <span>SAVE CHANGES</span>
        </KInteractive>
      </div>

      {/* Category Pills */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          overflowX: "auto",
          paddingBottom: "2px",
        }}
      >
        {categories.map((cat) => {
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
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
              {cat}
            </button>
          );
        })}
      </div>

      {/* GRAPHICS PREFERENCES */}
      {activeCategory === "GRAPHICS" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: bleed ? "4px" : "8px",
          }}
        >
          <div
            style={{
              padding: pad,
              background: V.surf,
              border: bleed ? "none" : "1px solid " + V.outv,
              borderRadius: bleed ? 0 : V.rp,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                font: "700 12px/1 " + t.dfont,
                color: V.ink2,
                letterSpacing: ".08em",
              }}
            >
              RENDER QUALITY & DRAW DISTANCE
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "10px",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <label style={{ font: "600 12px/1.2 " + t.font, color: V.ink }}>
                  Draw Distance
                </label>
                <select
                  value={prefs.draw}
                  onChange={(e) => actions.setPref("draw", e.target.value)}
                  style={selectStyle}
                >
                  <option value="64 m">64 meters (Indoor / Low Lag)</option>
                  <option value="96 m">96 meters (Standard Mainland)</option>
                  <option value="128 m">128 meters (High Vista)</option>
                  <option value="256 m">256 meters (Ultra Scenic)</option>
                  <option value="512 m">512 meters (Full Sim)</option>
                </select>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <label style={{ font: "600 12px/1.2 " + t.font, color: V.ink }}>
                  Quality Preset
                </label>
                <select
                  value={prefs.quality}
                  onChange={(e) => actions.setPref("quality", e.target.value)}
                  style={selectStyle}
                >
                  <option value="Low">Low (Maximum Performance)</option>
                  <option value="Balanced">Balanced (Recommended)</option>
                  <option value="High">High (Fitted Mesh & ALM)</option>
                  <option value="Ultra">Ultra (Shadows & Full Shaders)</option>
                </select>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <label style={{ font: "600 12px/1.2 " + t.font, color: V.ink }}>
                  Target Framerate
                </label>
                <select
                  value={prefs.fps}
                  onChange={(e) => actions.setPref("fps", e.target.value)}
                  style={selectStyle}
                >
                  <option value="30 fps">30 FPS (Power Saver)</option>
                  <option value="60 fps">60 FPS (Smooth)</option>
                  <option value="120 fps">120 FPS (High Refresh)</option>
                  <option value="Uncapped">Uncapped (Benchmark)</option>
                </select>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <label style={{ font: "600 12px/1.2 " + t.font, color: V.ink }}>
                  Max Avatar Complexity (ARC)
                </label>
                <select
                  value={prefs.complexity}
                  onChange={(e) =>
                    actions.setPref("complexity", e.target.value)
                  }
                  style={selectStyle}
                >
                  <option value="35 000">35,000 ARC (Jellydoll Crowds)</option>
                  <option value="80 000">80,000 ARC (Standard)</option>
                  <option value="150 000">150,000 ARC (High)</option>
                  <option value="No Limit">No Limit (Render All)</option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                borderTop: "1px solid " + V.outv,
                paddingTop: "10px",
                flexWrap: "wrap",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  font: "500 12px/1 " + t.font,
                  color: V.ink,
                }}
              >
                <input
                  type="checkbox"
                  checked={toggles.shadows}
                  onChange={() => actions.toggleSetting("shadows")}
                  style={{ accentColor: V.pri, cursor: "pointer" }}
                />
                <span>Real-Time Atmospheric Shadows</span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  font: "500 12px/1 " + t.font,
                  color: V.ink,
                }}
              >
                <input
                  type="checkbox"
                  checked={toggles.battery}
                  onChange={() => actions.toggleSetting("battery")}
                  style={{ accentColor: V.pri, cursor: "pointer" }}
                />
                <span>Battery & Thermal Throttle Protection</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* AUDIO & VOICE PREFERENCES */}
      {activeCategory === "AUDIO & VOICE" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: bleed ? "4px" : "8px",
          }}
        >
          <div
            style={{
              padding: pad,
              background: V.surf,
              border: bleed ? "none" : "1px solid " + V.outv,
              borderRadius: bleed ? 0 : V.rp,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                font: "700 12px/1 " + t.dfont,
                color: V.ink2,
                letterSpacing: ".08em",
              }}
            >
              VOLUME & SPATIAL AUDIO
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "10px",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <label style={{ font: "600 12px/1.2 " + t.font, color: V.ink }}>
                  Master Volume
                </label>
                <select
                  value={prefs.volume}
                  onChange={(e) => actions.setPref("volume", e.target.value)}
                  style={selectStyle}
                >
                  <option value="Muted">Muted</option>
                  <option value="25%">25%</option>
                  <option value="50%">50%</option>
                  <option value="70%">70% (Default)</option>
                  <option value="100%">100% (Maximum)</option>
                </select>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <label style={{ font: "600 12px/1.2 " + t.font, color: V.ink }}>
                  Voice Chat System
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    minHeight: "44px",
                  }}
                >
                  <input
                    type="checkbox"
                    id="pref-voice"
                    checked={toggles.voice}
                    onChange={() => actions.toggleSetting("voice")}
                    style={{ accentColor: V.pri, cursor: "pointer" }}
                  />
                  <label
                    htmlFor="pref-voice"
                    style={{
                      font: "500 12px/1 " + t.font,
                      color: V.ink,
                      cursor: "pointer",
                    }}
                  >
                    Enable Spatial 3D Voice Audio (Vivox)
                  </label>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                borderTop: "1px solid " + V.outv,
                paddingTop: "10px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  font: "500 12px/1 " + t.font,
                  color: V.ink,
                }}
              >
                <input
                  type="checkbox"
                  checked={toggles.mediaAuto}
                  onChange={() => actions.toggleSetting("mediaAuto")}
                  style={{ accentColor: V.pri, cursor: "pointer" }}
                />
                <span>Autoplay Parcel Music & Shared Media (MOAP)</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* NETWORK PREFERENCES */}
      {activeCategory === "NETWORK" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: bleed ? "4px" : "8px",
          }}
        >
          <div
            style={{
              padding: pad,
              background: V.surf,
              border: bleed ? "none" : "1px solid " + V.outv,
              borderRadius: bleed ? 0 : V.rp,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                font: "700 12px/1 " + t.dfont,
                color: V.ink2,
                letterSpacing: ".08em",
              }}
            >
              BANDWIDTH & CONNECTION LIMITS
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "10px",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <label style={{ font: "600 12px/1.2 " + t.font, color: V.ink }}>
                  Maximum Bandwidth
                </label>
                <select
                  value={prefs.bandwidth}
                  onChange={(e) => actions.setPref("bandwidth", e.target.value)}
                  style={selectStyle}
                >
                  <option value="500 kbps">500 kbps (Mobile Hotspot)</option>
                  <option value="1 500 kbps">
                    1,500 kbps (Standard Cable)
                  </option>
                  <option value="3 000 kbps">
                    3,000 kbps (Broadband Fiber)
                  </option>
                  <option value="10 000 kbps">
                    10,000 kbps (Uncapped LAN)
                  </option>
                </select>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <label style={{ font: "600 12px/1.2 " + t.font, color: V.ink }}>
                  Disk Cache Capacity
                </label>
                <select
                  value={prefs.cacheLimit}
                  onChange={(e) =>
                    actions.setPref("cacheLimit", Number(e.target.value))
                  }
                  style={selectStyle}
                >
                  <option value={256}>256 MB</option>
                  <option value={512}>512 MB (Default)</option>
                  <option value={1024}>1,024 MB (1 GB)</option>
                  <option value={2048}>2,048 MB (2 GB)</option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                borderTop: "1px solid " + V.outv,
                paddingTop: "10px",
              }}
            >
              <KInteractive
                as="button"
                onClick={() => actions.setScreen("Cache")}
                style={actBtn(false)}
              >
                <Icon name="hard-drive" size={13} />
                <span>OPEN ADVANCED CACHE MANAGER...</span>
              </KInteractive>
            </div>
          </div>
        </div>
      )}

      {/* GENERAL PREFERENCES */}
      {activeCategory === "GENERAL" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: bleed ? "4px" : "8px",
          }}
        >
          <div
            style={{
              padding: pad,
              background: V.surf,
              border: bleed ? "none" : "1px solid " + V.outv,
              borderRadius: bleed ? 0 : V.rp,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                font: "700 12px/1 " + t.dfont,
                color: V.ink2,
                letterSpacing: ".08em",
              }}
            >
              CONTENT RATINGS & PRIVACY
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "10px",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <label style={{ font: "600 12px/1.2 " + t.font, color: V.ink }}>
                  Maturity Rating Access
                </label>
                <select
                  value={prefs.maturity}
                  onChange={(e) => actions.setPref("maturity", e.target.value)}
                  style={selectStyle}
                >
                  <option value="General">General (PG only)</option>
                  <option value="Moderate">General & Moderate (PG/M)</option>
                  <option value="Adult">
                    General, Moderate & Adult (PG/M/A)
                  </option>
                </select>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <label style={{ font: "600 12px/1.2 " + t.font, color: V.ink }}>
                  RestrainedLove (RLV) Protocol
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    minHeight: "44px",
                  }}
                >
                  <input
                    type="checkbox"
                    id="pref-rlv"
                    checked={toggles.rlv}
                    onChange={() => actions.toggleSetting("rlv")}
                    style={{ accentColor: V.pri, cursor: "pointer" }}
                  />
                  <label
                    htmlFor="pref-rlv"
                    style={{
                      font: "500 12px/1 " + t.font,
                      color: V.ink,
                      cursor: "pointer",
                    }}
                  >
                    Enable RLV Script API Extensions
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UI & DENSITY PREFERENCES */}
      {activeCategory === "UI & DENSITY" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: bleed ? "4px" : "8px",
          }}
        >
          <div
            style={{
              padding: pad,
              background: V.surf,
              border: bleed ? "none" : "1px solid " + V.outv,
              borderRadius: bleed ? 0 : V.rp,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                font: "700 12px/1 " + t.dfont,
                color: V.ink2,
                letterSpacing: ".08em",
              }}
            >
              LAYOUT PACK & THEME DENSITY
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "10px",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <label style={{ font: "600 12px/1.2 " + t.font, color: V.ink }}>
                  Interface Density
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    minHeight: "44px",
                  }}
                >
                  <input
                    type="checkbox"
                    id="pref-dense"
                    checked={dense}
                    onChange={(e) => actions.setDense(e.target.checked)}
                    style={{ accentColor: V.pri, cursor: "pointer" }}
                  />
                  <label
                    htmlFor="pref-dense"
                    style={{
                      font: "500 12px/1 " + t.font,
                      color: V.ink,
                      cursor: "pointer",
                    }}
                  >
                    Compact Density Mode (Tighter Margins)
                  </label>
                </div>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <label style={{ font: "600 12px/1.2 " + t.font, color: V.ink }}>
                  Large Type Display
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    minHeight: "44px",
                  }}
                >
                  <input
                    type="checkbox"
                    id="pref-largetype"
                    checked={toggles.largeType}
                    onChange={() => actions.toggleSetting("largeType")}
                    style={{ accentColor: V.pri, cursor: "pointer" }}
                  />
                  <label
                    htmlFor="pref-largetype"
                    style={{
                      font: "500 12px/1 " + t.font,
                      color: V.ink,
                      cursor: "pointer",
                    }}
                  >
                    High-Legibility Enlarged Typography
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
