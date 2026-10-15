import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { subView } from "../theme/constants.js";
import Icon from "../components/Icon.jsx";
import KInteractive from "../components/KInteractive.jsx";

export default function Cache() {
  const { state, actions } = useApp();
  const { V, t, bleed, pad, ink } = useTheme();

  const [cacheUsage, setCacheUsage] = useState({
    textures: 112,
    inventory: 42,
    audio: 18,
    vfs: 12,
  });

  const totalUsed = Object.values(cacheUsage).reduce((a, b) => a + b, 0);
  const cacheLimit = state.prefs?.cacheLimit || 512;
  const ratio = Math.min(1, totalUsed / cacheLimit);

  const clearSection = (sec, name) => {
    setCacheUsage((prev) => ({ ...prev, [sec]: 0 }));
    actions.notify(`Cleared ${name} (${cacheUsage[sec]} MB freed)`);
  };

  const purgeAll = () => {
    setCacheUsage({ textures: 0, inventory: 0, audio: 0, vfs: 0 });
    actions.purgeDiskCache();
    actions.notify("Entire disk cache purged. Will rebuild on relog.");
  };

  const actBtn = (primary = false, danger = false) => ({
    minHeight: "44px",
    padding: "0 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    cursor: "pointer",
    background: primary ? V.pri : danger ? V.err || "#dc2626" : V.surf2,
    color: primary
      ? ink(V.pri, [V.bg, V.onpri, V.ink])
      : danger
        ? "#fff"
        : V.ink,
    border:
      "1px solid " + (primary ? V.pri : danger ? V.err || "#dc2626" : V.outv),
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
      {/* Cache Usage Hero Card */}
      <div
        style={{
          padding: pad,
          background: V.surf,
          border: bleed ? "none" : "1px solid " + V.outv,
          borderLeft: bleed ? "4px solid " + V.pri : undefined,
          borderRadius: bleed ? 0 : V.rp,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
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
              <Icon name="hard-drive" size={22} />
            </div>
            <div>
              <div style={{ font: "700 15px/1.2 " + t.dfont, color: V.ink }}>
                Local Cache & Storage
              </div>
              <div
                style={{
                  font: "400 11px/1.3 " + t.font,
                  color: V.ink2,
                  marginTop: "2px",
                }}
              >
                Location: {state.prefs?.cacheLoc || "Internal flash storage"} ·
                Max limit: {cacheLimit} MB
              </div>
            </div>
          </div>

          <KInteractive
            as="button"
            onClick={purgeAll}
            style={actBtn(false, true)}
            aria-label="Purge entire disk cache"
          >
            <Icon name="trash-2" size={13} />
            <span>PURGE ENTIRE CACHE</span>
          </KInteractive>
        </div>

        {/* Capacity Meter Bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              font: "600 11.5px/1 " + t.mfont,
            }}
          >
            <span style={{ color: V.ink }}>{totalUsed} MB used</span>
            <span style={{ color: V.ink2 }}>
              {cacheLimit - totalUsed} MB free
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: "10px",
              background: V.surf2,
              borderRadius: "5px",
              overflow: "hidden",
              border: "1px solid " + V.outv,
            }}
          >
            <div
              style={{
                width: `${ratio * 100}%`,
                height: "100%",
                background: ratio > 0.85 ? V.warn || "#f59e0b" : V.pri,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* Itemized Cache Sections */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: bleed ? "4px" : "8px",
        }}
      >
        {[
          {
            key: "textures",
            name: "Texture & Mesh Asset Cache",
            desc: "Cached diffuse, normal, and specular maps for in-world 3D rendering",
            icon: "image",
          },
          {
            key: "inventory",
            name: "Inventory Hierarchy & Skeleton",
            desc: "Local cache of personal inventory folder hierarchy and item metadata",
            icon: "folder",
          },
          {
            key: "audio",
            name: "Sound Effects & Audio Cache",
            desc: "Cached spatial sound loops, gesture audio clips, and UI chimes",
            icon: "volume-2",
          },
          {
            key: "vfs",
            name: "Virtual File System (VFS) Temp Data",
            desc: "Temporary client buffers, region terrain tiles, and object geometry indices",
            icon: "layers",
          },
        ].map(({ key, name, desc, icon }) => (
          <div
            key={key}
            style={{
              padding: pad,
              background: V.surf,
              border: bleed ? "none" : "1px solid " + V.outv,
              borderRadius: bleed ? 0 : V.rp,
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
                <Icon name={icon} size={18} />
              </div>
              <div>
                <div
                  style={{ font: "700 13.5px/1.2 " + t.dfont, color: V.ink }}
                >
                  {name}
                </div>
                <div
                  style={{
                    font: "400 11px/1.3 " + t.font,
                    color: V.ink2,
                    marginTop: "2px",
                  }}
                >
                  {desc}
                </div>
                <div
                  style={{
                    font: "600 11px/1 " + t.mfont,
                    color: V.pri,
                    marginTop: "3px",
                  }}
                >
                  {cacheUsage[key]} MB occupied
                </div>
              </div>
            </div>

            <KInteractive
              as="button"
              onClick={() => clearSection(key, name)}
              style={actBtn(false)}
              aria-label={`Clear ${name}`}
            >
              <Icon name="refresh-cw" size={13} />
              <span>CLEAR</span>
            </KInteractive>
          </div>
        ))}
      </div>
    </div>
  );
}
