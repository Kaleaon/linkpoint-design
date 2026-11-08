import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { subView } from "../theme/constants.js";
import { panelLook } from "../theme/look.js";
import Icon from "../components/Icon.jsx";
import KInteractive from "../components/KInteractive.jsx";
import SegmentedMeter from "../components/SegmentedMeter.jsx";

export default function Diagnostics() {
  const { state, actions } = useApp();
  const { V, t, LK, bleed, pad, ink } = useTheme();
  const curSub = subView(state, "Diagnostics") || "AGNI";
  const cardStyle = (accent) => panelLook(V, LK, pad, accent);

  const [simFps, setSimFps] = useState(44.8);
  const [timeDilation, setTimeDilation] = useState(0.998);
  const [packetLoss, setPacketLoss] = useState(0.02);
  const [ping, setPing] = useState(48);

  // Slight live telemetry drift for authentic feel
  useEffect(() => {
    const timer = setInterval(() => {
      setSimFps((prev) => +(44.4 + Math.random() * 0.6).toFixed(1));
      setTimeDilation((prev) => +(0.994 + Math.random() * 0.006).toFixed(3));
      setPacketLoss((prev) => +(Math.random() * 0.05).toFixed(2));
      setPing((prev) => Math.floor(45 + Math.random() * 8));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

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
          ...cardStyle(V.ok || "#22c55e"),
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
                color: V.ok || "#22c55e",
                border: "1px solid " + V.outv,
                flexShrink: 0,
              }}
            >
              <Icon name="activity" size={22} />
            </div>
            <div>
              <div
                style={{
                  font: "700 9px/1 " + t.dfont,
                  letterSpacing: ".18em",
                  color: V.sec2 || V.pri,
                }}
              >
                [SYS-01-1701] SIMULATOR CORE TELEMETRY
              </div>
              <div
                style={{
                  font: "700 15px/1.2 " + t.dfont,
                  color: V.ink,
                  marginTop: "2px",
                }}
              >
                Simulator Telemetry & Diagnostics
              </div>
              <div
                style={{
                  font: "400 11px/1.3 " + t.font,
                  color: V.ink2,
                  marginTop: "2px",
                }}
              >
                Connected grid:{" "}
                <span style={{ color: V.pri, fontWeight: 700 }}>
                  {curSub} (
                  {curSub === "AGNI"
                    ? "Production Main Grid"
                    : "Beta Test Grid"}
                  )
                </span>{" "}
                · Region: Da Boom
              </div>
            </div>
          </div>

          <KInteractive
            as="button"
            onClick={() =>
              actions.notify("Diagnostics snapshot dumped to log file")
            }
            style={actBtn(false)}
            aria-label="Dump logs"
          >
            <Icon name="file-text" size={13} />
            <span>COPY TELEMETRY</span>
          </KInteractive>
        </div>
      </div>

      {/* Real-time KPI Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: bleed ? "6px" : "10px",
        }}
      >
        {/* Simulator FPS */}
        <div
          style={{
            ...cardStyle(),
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                font: "700 8.5px/1 " + t.dfont,
                letterSpacing: ".14em",
                color: V.sec2 || V.pri,
              }}
            >
              [ENG-01-FPS45]
            </span>
            <span
              style={{
                font: "700 10.5px/1 " + t.dfont,
                color: V.ink2,
                letterSpacing: ".1em",
              }}
            >
              SIMULATOR FPS
            </span>
          </div>
          <div
            style={{
              font: "700 22px/1.1 " + (t.mfont || t.font),
              color: simFps >= 40 ? V.ok || "#22c55e" : V.warn || "#f59e0b",
            }}
          >
            {simFps}{" "}
            <span style={{ fontSize: "12px", color: V.ink2 }}>/ 45.0</span>
          </div>
          <SegmentedMeter
            value={simFps}
            max={45}
            segments={15}
            height={8}
            gap={2}
            label="Simulator FPS"
          />
          <span style={{ font: "400 10px/1 " + t.font, color: V.ink2 }}>
            Target 45 Hz physics loop
          </span>
        </div>

        {/* Time Dilation */}
        <div
          style={{
            ...cardStyle(),
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                font: "700 8.5px/1 " + t.dfont,
                letterSpacing: ".14em",
                color: V.sec2 || V.pri,
              }}
            >
              [ENG-01-TD100]
            </span>
            <span
              style={{
                font: "700 10.5px/1 " + t.dfont,
                color: V.ink2,
                letterSpacing: ".1em",
              }}
            >
              TIME DILATION
            </span>
          </div>
          <div
            style={{
              font: "700 22px/1.1 " + (t.mfont || t.font),
              color:
                timeDilation >= 0.95 ? V.ok || "#22c55e" : V.err || "#dc2626",
            }}
          >
            {timeDilation}
          </div>
          <SegmentedMeter
            value={timeDilation * 100}
            max={100}
            segments={15}
            height={8}
            gap={2}
            label="Time Dilation"
          />
          <span style={{ font: "400 10px/1 " + t.font, color: V.ink2 }}>
            1.000 = Real-time sync
          </span>
        </div>

        {/* Ping / Latency */}
        <div
          style={{
            ...cardStyle(),
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                font: "700 8.5px/1 " + t.dfont,
                letterSpacing: ".14em",
                color: V.sec2 || V.pri,
              }}
            >
              [COM-01-PING]
            </span>
            <span
              style={{
                font: "700 10.5px/1 " + t.dfont,
                color: V.ink2,
                letterSpacing: ".1em",
              }}
            >
              PING / RTT
            </span>
          </div>
          <div
            style={{
              font: "700 22px/1.1 " + (t.mfont || t.font),
              color: ping < 80 ? V.ok || "#22c55e" : V.warn || "#f59e0b",
            }}
          >
            {ping} ms
          </div>
          <SegmentedMeter
            value={Math.min(150, ping)}
            max={150}
            segments={15}
            height={8}
            gap={2}
            label="Ping RTT"
          />
          <span style={{ font: "400 10px/1 " + t.font, color: V.ink2 }}>
            Linden Lab Dallas Host
          </span>
        </div>

        {/* Packet Loss */}
        <div
          style={{
            ...cardStyle(),
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                font: "700 8.5px/1 " + t.dfont,
                letterSpacing: ".14em",
                color: V.sec2 || V.pri,
              }}
            >
              [COM-01-LOSS]
            </span>
            <span
              style={{
                font: "700 10.5px/1 " + t.dfont,
                color: V.ink2,
                letterSpacing: ".1em",
              }}
            >
              PACKET LOSS
            </span>
          </div>
          <div
            style={{
              font: "700 22px/1.1 " + (t.mfont || t.font),
              color: packetLoss < 0.1 ? V.ok || "#22c55e" : V.err || "#dc2626",
            }}
          >
            {packetLoss}%
          </div>
          <SegmentedMeter
            value={Math.min(5, packetLoss * 10)}
            max={5}
            segments={15}
            height={8}
            gap={2}
            label="Packet Loss"
          />
          <span style={{ font: "400 10px/1 " + t.font, color: V.ink2 }}>
            UDP reliability channel
          </span>
        </div>
      </div>

      {/* Detailed Diagnostics Breakdown */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: bleed ? "6px" : "10px",
        }}
      >
        {/* Simulator & Physics Metrics */}
        <div
          style={{
            ...cardStyle(),
            display: "flex",
            flexDirection: "column",
            gap: "8px",
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
              [ENG-02-9042] HAVOK PHYSICS ENGINE
            </div>
            <div
              style={{
                font: "700 11px/1 " + t.dfont,
                color: V.ink2,
                letterSpacing: ".1em",
                marginTop: "2px",
              }}
            >
              SIMULATOR &amp; PHYSICS ENGINE
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              font: "400 12px/1.4 " + t.font,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: V.ink2 }}>Physics Engine:</span>
              <span style={{ fontWeight: 600, color: V.ink }}>
                Havok 2026.1 Sub-step
              </span>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "3px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: V.ink2 }}>Total In-World Prims:</span>
                <span style={{ fontFamily: t.mfont || t.font, color: V.ink }}>
                  14 280 / 15 000 (95.2%)
                </span>
              </div>
              <SegmentedMeter
                value={14280}
                max={15000}
                segments={20}
                height={6}
                gap={2}
                label="In-world prims"
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: V.ink2 }}>Active Script Count:</span>
              <span style={{ fontFamily: t.mfont || t.font, color: V.ink }}>
                1 204 running
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: V.ink2 }}>Script Engine Frame Time:</span>
              <span style={{ fontFamily: t.mfont || t.font, color: V.pri }}>
                0.82 ms / 22.2 ms
              </span>
            </div>
          </div>
        </div>

        {/* Network & Protocol Telemetry */}
        <div
          style={{
            ...cardStyle(),
            display: "flex",
            flexDirection: "column",
            gap: "8px",
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
              [COM-02-2804] UDP PROTOCOL PIPELINE
            </div>
            <div
              style={{
                font: "700 11px/1 " + t.dfont,
                color: V.ink2,
                letterSpacing: ".1em",
                marginTop: "2px",
              }}
            >
              NETWORK &amp; PROTOCOL STACK
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              font: "400 12px/1.4 " + t.font,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: V.ink2 }}>Simulator Host:</span>
              <span style={{ fontFamily: t.mfont || t.font, color: V.ink }}>
                sim10428.agni.lindenlab.com
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: V.ink2 }}>UDP Inbound Bandwidth:</span>
              <span style={{ fontFamily: t.mfont || t.font, color: V.ink }}>
                128.4 kbps
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: V.ink2 }}>UDP Outbound Bandwidth:</span>
              <span style={{ fontFamily: t.mfont || t.font, color: V.ink }}>
                18.2 kbps
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: V.ink2 }}>Server Software Channel:</span>
              <span style={{ fontWeight: 600, color: V.ink }}>
                Second Life Server 2026-09-28
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
