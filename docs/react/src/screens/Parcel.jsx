import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { subView } from "../theme/constants.js";
import { panelLook } from "../theme/look.js";
import Icon from "../components/Icon.jsx";
import KInteractive from "../components/KInteractive.jsx";
import SegmentedMeter from "../components/SegmentedMeter.jsx";

export default function Parcel() {
  const { state, actions } = useApp();
  const { V, t, LK, bleed, pad, ink } = useTheme();
  const curSub = subView(state, "Parcel") || "GENERAL";
  const cardStyle = (accent) => panelLook(V, LK, pad, accent);

  const [streamPlaying, setStreamPlaying] = useState(false);
  const [streamUrl, setStreamUrl] = useState(
    "http://stream.sl-radio.net:8000/live"
  );
  const [mediaUrl, setMediaUrl] = useState(
    "https://bay-city-builds.example/board"
  );

  const primUsed = 1240;
  const primCap = 1875;
  const primRatio = Math.min(1, primUsed / primCap);

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
    letterSpacing: ".12em",
    whiteSpace: "nowrap",
  });

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
      {/* Parcel Hero Card */}
      <div
        style={{
          ...cardStyle(V.pri),
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Icon name="map-pin" size={24} style={{ color: V.pri }} />
            <div>
              <div
                style={{
                  font: "700 9px/1 " + t.dfont,
                  letterSpacing: ".18em",
                  color: V.sec2 || V.pri,
                }}
              >
                [ENV-01-7720] PARCEL DOMAIN & BOUNDS
              </div>
              <div
                style={{
                  font: "700 16px/1.2 " + t.dfont,
                  color: V.ink,
                  marginTop: "2px",
                }}
              >
                Linden Public Park
              </div>
              <div
                style={{
                  font: "400 11.5px/1.3 " + t.font,
                  color: V.ink2,
                  marginTop: "2px",
                }}
              >
                Da Boom &lt;128, 128, 26&gt; · 4,096 m²
              </div>
            </div>
          </div>
          <span
            style={{
              padding: "4px 8px",
              background: V.priC,
              color: V.onpriC,
              borderRadius: V.rs,
              font: "700 10px/1 " + t.font,
              letterSpacing: ".1em",
              flex: "none",
            }}
          >
            GENERAL
          </span>
        </div>

        <div style={{ font: "400 12px/1.6 " + t.font, color: V.ink2 }}>
          Historic green public reserve on the continent of Sansara. Open for
          public events, gatherings, and building exploration.
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          <KInteractive
            label="Teleport here"
            onClick={() =>
              actions.teleportToRegion("Da Boom", "<128, 128, 26>")
            }
            style={actBtn(true)}
          >
            <Icon name="zap" size={14} />
            TELEPORT HERE
          </KInteractive>
          <KInteractive
            label="Create landmark"
            onClick={() => actions.saveLandmark("Linden Public Park")}
            style={actBtn(false)}
          >
            <Icon name="star" size={14} />
            LANDMARK
          </KInteractive>
          <KInteractive
            label="Region info"
            onClick={() =>
              actions.notify("Region: Da Boom · Server 2026.09 · Channel Main")
            }
            style={actBtn(false)}
          >
            <Icon name="info" size={14} />
            ABOUT REGION
          </KInteractive>
        </div>
      </div>

      {/* Sub-view: GENERAL */}
      {curSub === "GENERAL" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Prim / Land Capacity */}
          <div
            style={{
              ...cardStyle(V.pri),
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Icon name="layers" size={16} style={{ color: V.pri }} />
                <div>
                  <div
                    style={{
                      font: "700 8.5px/1 " + t.dfont,
                      letterSpacing: ".16em",
                      color: V.sec2 || V.pri,
                    }}
                  >
                    [OPS-03-5512] RESOURCE ALLOCATION
                  </div>
                  <span
                    style={{
                      font: "700 11px/1 " + t.dfont,
                      letterSpacing: ".14em",
                      color: V.pri,
                    }}
                  >
                    PARCEL PRIM CAPACITY
                  </span>
                </div>
              </div>
              <span style={{ font: "700 12px/1 " + t.font, color: V.ink }}>
                {primUsed} / {primCap} prims ({Math.round(primRatio * 100)}%)
              </span>
            </div>

            {/* Discrete Segmented Chunky Bar Meter */}
            <SegmentedMeter
              value={primUsed}
              max={primCap}
              segments={24}
              height={12}
              gap={2}
              label="Parcel prim capacity"
              showReadout={false}
            />
            <div style={{ font: "400 11px/1.3 " + t.font, color: V.ink2 }}>
              {primCap - primUsed} prims available for rezzing on this parcel.
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: "8px",
                marginTop: "4px",
              }}
            >
              {[
                { label: "OWNER PRIMS", count: 840 },
                { label: "GROUP PRIMS", count: 320 },
                { label: "OTHERS PRIMS", count: 80 },
                { label: "TEMP PRIMS", count: 0 },
              ].map((p) => (
                <div
                  key={p.label}
                  style={{
                    padding: "8px",
                    background: V.surf2,
                    borderRadius: V.rs,
                  }}
                >
                  <div
                    style={{
                      font: "600 8.5px/1 " + t.dfont,
                      letterSpacing: ".1em",
                      color: V.ink2,
                    }}
                  >
                    {p.label}
                  </div>
                  <div
                    style={{
                      font: "700 14px/1.2 " + t.font,
                      color: V.ink,
                      marginTop: "4px",
                    }}
                  >
                    {p.count}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "4px",
              }}
            >
              <KInteractive
                label="Return others' prims"
                onClick={() =>
                  actions.notify("Returned 80 unassociated prims to inventory")
                }
                style={{
                  minHeight: "44px",
                  padding: "0 12px",
                  border: "1px solid " + V.outv,
                  borderRadius: V.rs,
                  background: "transparent",
                  color: V.err || V.ink2,
                  font: "600 10.5px/1 " + t.dfont,
                  letterSpacing: ".08em",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                RETURN OTHERS' PRIMS
              </KInteractive>
            </div>
          </div>

          {/* Ownership & Group */}
          <div
            style={{
              ...cardStyle(),
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div>
              <div
                style={{
                  font: "700 8.5px/1 " + t.dfont,
                  letterSpacing: ".16em",
                  color: V.sec2 || V.pri,
                }}
              >
                [SEC-02-4190] PARCEL TITLE &amp; ESTATE RECORDS
              </div>
              <div
                style={{
                  font: "700 11px/1 " + t.dfont,
                  letterSpacing: ".14em",
                  color: V.pri,
                  marginTop: "2px",
                }}
              >
                OWNERSHIP &amp; ACCESS
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "10px",
              }}
            >
              <div>
                <div style={{ font: "500 10px/1 " + t.font, color: V.ink2 }}>
                  PARCEL OWNER
                </div>
                <div
                  style={{
                    font: "600 13px/1.3 " + t.font,
                    color: V.ink,
                    marginTop: "3px",
                  }}
                >
                  Governor Linden
                </div>
              </div>
              <div>
                <div style={{ font: "500 10px/1 " + t.font, color: V.ink2 }}>
                  GROUP DEED
                </div>
                <div
                  style={{
                    font: "600 13px/1.3 " + t.font,
                    color: V.ink,
                    marginTop: "3px",
                  }}
                >
                  Linden Dept. of Public Works
                </div>
              </div>
              <div>
                <div style={{ font: "500 10px/1 " + t.font, color: V.ink2 }}>
                  SALE STATUS
                </div>
                <div
                  style={{
                    font: "600 13px/1.3 " + t.font,
                    color: V.ink,
                    marginTop: "3px",
                  }}
                >
                  Not for sale
                </div>
              </div>
              <div>
                <div style={{ font: "500 10px/1 " + t.font, color: V.ink2 }}>
                  SNAPSHOT ACCESS
                </div>
                <div
                  style={{
                    font: "600 13px/1.3 " + t.font,
                    color: V.ink,
                    marginTop: "3px",
                  }}
                >
                  Public allowed
                </div>
              </div>
            </div>
          </div>

          {/* Parcel Rules & Flags */}
          <div
            style={{
              ...cardStyle(),
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div>
              <div
                style={{
                  font: "700 8.5px/1 " + t.dfont,
                  letterSpacing: ".16em",
                  color: V.sec2 || V.pri,
                }}
              >
                [SEC-03-1204] SIMULATOR PERMISSIONS &amp; FLAGS
              </div>
              <div
                style={{
                  font: "700 11px/1 " + t.dfont,
                  letterSpacing: ".14em",
                  color: V.pri,
                  marginTop: "2px",
                }}
              >
                PARCEL FLAGS
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "8px",
              }}
            >
              {[
                { name: "Voice Chat", ok: true },
                { name: "Run Scripts", ok: true },
                { name: "Fly Enabled", ok: true },
                { name: "Push Restricted", ok: true },
                { name: "Safe Area (No Damage)", ok: true },
                { name: "Create Objects", ok: false },
                { name: "Edit Terrain", ok: false },
              ].map((flag) => (
                <div
                  key={flag.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 8px",
                    background: V.surf2,
                    borderRadius: V.rs,
                  }}
                >
                  <Icon
                    name={flag.ok ? "check" : "x"}
                    size={14}
                    style={{ color: flag.ok ? V.ok || V.pri : V.ink2 }}
                  />
                  <span
                    style={{ font: "500 11px/1.2 " + t.font, color: V.ink }}
                  >
                    {flag.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-view: MEDIA */}
      {curSub === "MEDIA" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Audio / Music Stream */}
          <div
            style={{
              ...cardStyle(V.pri),
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Icon name="radio" size={18} style={{ color: V.pri }} />
                <div>
                  <div
                    style={{
                      font: "700 8.5px/1 " + t.dfont,
                      letterSpacing: ".16em",
                      color: V.sec2 || V.pri,
                    }}
                  >
                    [COM-02-1840] SPATIAL AUDIO STREAM
                  </div>
                  <span
                    style={{
                      font: "700 11px/1 " + t.dfont,
                      letterSpacing: ".14em",
                      color: V.pri,
                    }}
                  >
                    PARCEL AUDIO STREAM
                  </span>
                </div>
              </div>
              <span
                style={{
                  padding: "3px 7px",
                  background: streamPlaying ? V.ok || V.pri : V.surf2,
                  color: streamPlaying ? V.bg : V.ink2,
                  borderRadius: V.rs,
                  font: "700 9.5px/1 " + t.dfont,
                  letterSpacing: ".08em",
                }}
              >
                {streamPlaying ? "STREAMING LIVE" : "STOPPED"}
              </span>
            </div>

            <div>
              <div
                style={{
                  font: "500 10px/1 " + t.font,
                  color: V.ink2,
                  marginBottom: "4px",
                }}
              >
                AUDIO URL
              </div>
              <input
                type="text"
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  height: "36px",
                  padding: "0 10px",
                  background: V.bg,
                  color: V.ink,
                  border: "1px solid " + V.outv,
                  borderRadius: V.rs,
                  font: "400 11.5px/1 " + t.font,
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <KInteractive
                label={
                  streamPlaying ? "Stop audio stream" : "Play audio stream"
                }
                onClick={() => {
                  setStreamPlaying(!streamPlaying);
                  actions.notify(
                    streamPlaying
                      ? "Stream playback stopped"
                      : "Connecting to parcel audio stream..."
                  );
                }}
                style={actBtn(!streamPlaying)}
              >
                <Icon name={streamPlaying ? "pause" : "play"} size={14} />
                {streamPlaying ? "STOP STREAM" : "PLAY STREAM"}
              </KInteractive>

              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <span style={{ font: "500 10px/1 " + t.font, color: V.ink2 }}>
                  VOL:
                </span>
                {["Muted", "25%", "50%", "70%", "100%"].map((v) => {
                  const on = state.prefs.volume === v;
                  return (
                    <KInteractive
                      key={v}
                      label={`Volume ${v}`}
                      onClick={() => actions.setPref("volume", v)}
                      style={{
                        padding: "4px 8px",
                        background: on ? V.pri : V.surf2,
                        color: on ? ink(V.pri, [V.bg, V.onpri, V.ink]) : V.ink2,
                        borderRadius: V.rs,
                        font: "600 9.5px/1 " + t.dfont,
                        cursor: "pointer",
                      }}
                    >
                      {v}
                    </KInteractive>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Shared Media (MOAP) */}
          <div
            style={{
              ...cardStyle(),
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Icon name="monitor-play" size={18} style={{ color: V.pri }} />
              <div>
                <div
                  style={{
                    font: "700 8.5px/1 " + t.dfont,
                    letterSpacing: ".16em",
                    color: V.sec2 || V.pri,
                  }}
                >
                  [MED-01-3310] SHARED MEDIA &amp; PRIM FACES
                </div>
                <span
                  style={{
                    font: "700 11px/1 " + t.dfont,
                    letterSpacing: ".14em",
                    color: V.pri,
                  }}
                >
                  SHARED MEDIA (MOAP)
                </span>
              </div>
            </div>

            <div>
              <div
                style={{
                  font: "500 10px/1 " + t.font,
                  color: V.ink2,
                  marginBottom: "4px",
                }}
              >
                MEDIA URL
              </div>
              <input
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  height: "36px",
                  padding: "0 10px",
                  background: V.bg,
                  color: V.ink,
                  border: "1px solid " + V.outv,
                  borderRadius: V.rs,
                  font: "400 11.5px/1 " + t.font,
                  outline: "none",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
              }}
            >
              <div style={{ font: "400 11px/1.3 " + t.font, color: V.ink2 }}>
                Dimensions: 512 × 512 · Texture face 2 · HTML5 WebGL
              </div>
              <KInteractive
                label="Reload media"
                onClick={() =>
                  actions.notify("Reloaded parcel shared media texture")
                }
                style={actBtn(false)}
              >
                <Icon name="refresh-cw" size={13} />
                RELOAD MEDIA
              </KInteractive>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
