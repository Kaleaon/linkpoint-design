import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { NAV_ALL } from "../data/content.js";
import { HUDS, TARGETS, CSUB, subView, setSub } from "../theme/constants.js";
import Icon from "../components/Icon.jsx";
import KInteractive from "../components/KInteractive.jsx";

const HUD_CELLS = { row: 6, grid: 9, list: 4, bar: 3, pad: 4 };
// GFX taps cycle the same preferences the Settings screen sets, so the two
// surfaces can never drift apart.
const GFX_STRIP = [
  ["DRAW", "draw", ["64 m", "96 m", "128 m", "192 m", "256 m"]],
  ["QUALITY", "quality", ["Low", "Balanced", "High", "Ultra"]],
  ["FPS", "fps", ["30 fps", "45 fps", "60 fps", "Uncapped"]],
];

function Readout({ V, t, label, value, onClick }) {
  return (
    <KInteractive
      onClick={onClick}
      label={`${label}: ${value}`}
      style={{
        padding: "6px 10px",
        borderRadius: V.rs,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "3px",
        background: "rgba(0,0,0,.42)",
        border: "1px solid " + V.outv,
      }}
    >
      <span
        style={{
          font: "600 8px/1 " + t.font,
          letterSpacing: ".18em",
          color: V.ink2,
        }}
      >
        {label}
      </span>
      <span
        style={{
          font: "700 10px/1 " + t.font,
          letterSpacing: ".08em",
          color: V.pri,
        }}
      >
        {value}
      </span>
    </KInteractive>
  );
}
const HUD_COLS = { row: 6, grid: 3, list: 1, bar: 3, pad: 2 };

// Ported from the `isWorld` <sc-if> block (standalone 3D view, used by every
// nav model except the Sweep Console's own scene — see ConsoleScene.jsx for
// that one). Includes worn-HUD overlay + picker sheet and the crosshair
// target picker, both Lumiya-style overlays on the render.
export default function World3D() {
  const { state, actions } = useApp();
  const { V, t } = useTheme();
  const isAdvanced = state.prefs?.telemetryVerbosity === "advanced";
  const curSub = subView(state, "3D View");
  const overlayBtn = {
    width: "46px",
    height: "46px",
    borderRadius: V.rs,
    background: V.surf,
    border: "1px solid " + V.outv,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: V.pri,
    cursor: "pointer",
    position: "relative",
  };
  const sheetStyle = {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    background: V.surf,
    borderTop: "1px solid " + V.pri,
    borderRadius: V.rl + " " + V.rl + " 0 0",
    padding: "16px 16px 20px",
    maxHeight: "62%",
    overflowY: "auto",
  };
  const tgt = TARGETS.find((x) => x.id === state.target) || null;
  const hudPanels = HUDS.filter((h) => state.hudOn[h.id]);

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, var(--md-sys-color-surface-variant, var(--ktheme-sky1)) 0%, var(--ktheme-sky2) 46%, var(--ktheme-gnd1) 46%, var(--md-sys-color-background, var(--ktheme-gnd2)) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "-20%",
          right: "-20%",
          top: "46%",
          bottom: 0,
          backgroundImage:
            "linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px)",
          backgroundSize: "58px 36px",
          transform: "perspective(300px) rotateX(64deg)",
          transformOrigin: "top center",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "20%",
          top: "36%",
          width: "36px",
          height: "82px",
          background: V.surf2,
          border: "1px solid " + V.outv,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "56%",
          top: "31%",
          width: "54px",
          height: "100px",
          background: V.surf,
          border: "1px solid " + V.outv,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "37%",
          top: "52%",
          width: "19px",
          height: "42px",
          background: V.pri,
          opacity: 0.85,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "70%",
          top: "56%",
          width: "17px",
          height: "38px",
          background: V.sec2,
          opacity: 0.85,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "44%",
          width: "26px",
          height: "26px",
          margin: "-13px 0 0 -13px",
          border: "1px solid " + V.pri,
          borderRadius: "50%",
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "70px",
          top: "12px",
          padding: "6px 8px",
          background: V.surf,
          border: "1px solid " + V.outv,
          font: "400 10px/1.45 " + t.font,
          color: V.ink2,
        }}
      >
        {isAdvanced ? (
          <>
            Da Boom &lt;128,128,26&gt;
            <br />
            draw 96m · 34 fps
          </>
        ) : (
          <>
            Da Boom (Center)
            <br />
            View distance 96m · Smooth (34 fps)
          </>
        )}
      </div>

      <KInteractive
        label="Open navigation menu"
        onClick={() => actions.setNavPeek(true)}
        style={{
          position: "absolute",
          left: "14px",
          top: "14px",
          zIndex: 7,
          width: "46px",
          height: "46px",
          borderRadius: V.rs,
          background: V.surf,
          border: "1px solid " + V.outv,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: V.pri,
          cursor: "pointer",
        }}
      >
        <Icon name="menu" size={21} />
      </KInteractive>
      {state.navPeek ? (
        <>
          <div
            onClick={() => actions.setNavPeek(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,.5)",
              zIndex: 9,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "156px",
              zIndex: 10,
              background: V.surf,
              borderRight: "1px solid " + V.pri,
              padding: "14px 10px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "0 8px 12px",
              }}
            >
              <span
                style={{
                  flex: 1,
                  font: "700 12px/1.1 " + t.dfont,
                  letterSpacing: ".2em",
                  color: V.pri,
                }}
              >
                Linkpoint
              </span>
              <KInteractive
                as="span"
                onClick={() => actions.setNavPeek(false)}
                aria-label="Close navigation menu"
                style={{ cursor: "pointer", color: V.ink2, display: "flex" }}
              >
                <Icon name="x" size={16} />
              </KInteractive>
            </div>
            {NAV_ALL.map((n) => {
              const active = state.screen === n.id;
              return (
                <KInteractive
                  key={n.id}
                  onClick={() => {
                    actions.setScreen(n.id);
                    actions.setNavPeek(false);
                  }}
                  label={n.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    minHeight: "44px",
                    padding: "0 10px",
                    cursor: "pointer",
                    borderRadius: V.rs,
                    background: active ? V.pri : "transparent",
                    color: active ? V.onpri : V.ink,
                    font: "600 11px/1 " + t.font,
                    letterSpacing: ".12em",
                  }}
                >
                  <Icon name={n.icon} size={18} />
                  <span>{n.label}</span>
                </KInteractive>
              );
            })}
          </div>
        </>
      ) : null}

      <KInteractive
        label="Open target picker"
        onClick={() => actions.setTargetPicker(true)}
        style={{
          position: "absolute",
          right: "12px",
          top: "12px",
          width: "46px",
          height: "46px",
          border: "1px solid " + V.outv,
          background: V.surf,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: V.pri,
          cursor: "pointer",
          zIndex: 7,
        }}
      >
        <Icon name="crosshair" size={21} />
      </KInteractive>
      {tgt ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "26%",
            transform: "translate(-50%,-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            zIndex: 8,
          }}
        >
          <div
            style={{
              width: "54px",
              height: "54px",
              border: "2px solid " + V.pri,
              borderRadius: "50%",
              boxShadow: "0 0 0 1px rgba(0,0,0,.5)",
            }}
          />
          <div
            style={{
              padding: "3px 8px",
              background: V.pri,
              color: V.onpri,
              font: "700 10px/1.4 " + t.font,
              letterSpacing: ".1em",
              whiteSpace: "nowrap",
            }}
          >
            {tgt.name}
          </div>
          <KInteractive
            onClick={() => actions.setTarget(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                actions.setTarget(null);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Clear target"
            style={{
              padding: "3px 7px",
              background: V.bg,
              border: "1px solid " + V.outv,
              font: "400 9.5px/1.3 " + t.font,
              color: V.ink2,
              letterSpacing: ".08em",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {tgt.meta} · CLEAR
          </KInteractive>
        </div>
      ) : null}

      <div
        style={{
          position: "absolute",
          right: "12px",
          top: "66px",
          width: "88px",
          height: "88px",
          border: "1px solid " + V.outv,
          background: V.surf,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(" +
              V.outv +
              " 1px,transparent 1px),linear-gradient(90deg," +
              V.outv +
              " 1px,transparent 1px)",
            backgroundSize: "22px 22px",
            opacity: 0.55,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "6px",
            height: "6px",
            margin: "-3px 0 0 -3px",
            borderRadius: "3px",
            background: V.pri,
          }}
        />
      </div>
      {/* 3D View is immersive: there is no header to hang a tab strip under, so
          its CAM/GFX sub-views switch from a pill inside the scene, right above
          the strip they control. The LCARS rail drives the same state. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "196px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <div style={{ display: "flex", gap: "5px" }}>
          {(CSUB["3D View"] || []).map(([label]) => (
            <KInteractive
              key={label}
              onClick={() => setSub(actions, "3D View", label)}
              label={label}
              style={{
                padding: "6px 12px",
                borderRadius: V.rs,
                cursor: "pointer",
                font: "700 9.5px/1 " + t.font,
                letterSpacing: ".18em",
                background: curSub === label ? V.pri : "rgba(0,0,0,.42)",
                color: curSub === label ? V.onpri : V.ink,
                border: "1px solid " + (curSub === label ? V.pri : V.outv),
              }}
            >
              {label}
            </KInteractive>
          ))}
        </div>
        {curSub === "GFX" ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "6px",
              flexWrap: "wrap",
              maxWidth: "88%",
            }}
          >
            {GFX_STRIP.map(([label, key, opts]) => {
              const displayLabel = !isAdvanced
                ? label === "DRAW"
                  ? "VIEW DISTANCE"
                  : label === "QUALITY"
                    ? "GRAPHICS"
                    : label === "FPS"
                      ? "FRAME RATE"
                      : label
                : label;
              return (
                <Readout
                  key={label}
                  V={V}
                  t={t}
                  label={displayLabel}
                  value={state.prefs[key]}
                  onClick={() => {
                    const next =
                      opts[(opts.indexOf(state.prefs[key]) + 1) % opts.length];
                    actions.setPref(key, next);
                    actions.notify(displayLabel + " \u2014 " + next);
                  }}
                />
              );
            })}
            <Readout
              V={V}
              t={t}
              label="SHADOWS"
              value={
                state.toggles.shadows
                  ? isAdvanced
                    ? "ON"
                    : "Enabled"
                  : isAdvanced
                    ? "OFF"
                    : "Disabled"
              }
              onClick={() => actions.toggleSetting("shadows")}
            />
            <Readout
              V={V}
              t={t}
              label="BATTERY"
              value={
                state.toggles.battery
                  ? isAdvanced
                    ? "SAVER"
                    : "Saver Mode"
                  : isAdvanced
                    ? "FULL"
                    : "Full Power"
              }
              onClick={() => actions.toggleSetting("battery")}
            />
          </div>
        ) : (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "6px" }}
          >
            {["FRONT", "ORBIT", "MOUSELOOK"].map((cp) => {
              const on = state.camPreset === cp;
              return (
                <KInteractive
                  key={cp}
                  onClick={() => {
                    actions.setCamPreset(cp);
                    actions.notify("Camera \u2014 " + cp);
                  }}
                  label={`Camera ${cp}`}
                  style={{
                    padding: "6px 10px",
                    background: on ? V.priC : V.surf,
                    border: "1px solid " + (on ? V.pri : V.outv),
                    borderRadius: V.rs,
                    font: "600 10px/1 " + t.dfont,
                    letterSpacing: ".14em",
                    color: on ? V.onpriC : V.ink2,
                    cursor: "pointer",
                  }}
                >
                  {cp}
                </KInteractive>
              );
            })}
          </div>
        )}
      </div>

      {hudPanels.map((h) => {
        const p = state.hudPos[h.id] || { x: h.x, y: h.y };
        const n = HUD_CELLS[h.kind] || 4;
        return (
          <div
            key={h.id}
            onPointerDown={(e) => actions.hudDrag(h.id, e)}
            style={{
              position: "absolute",
              left: p.x + "px",
              top: p.y + "px",
              width: h.w + "px",
              zIndex: 6,
              background: "rgba(0,0,0,.34)",
              border: "1px solid " + V.pri,
              borderRadius: V.rs,
              boxShadow: "0 6px 20px rgba(0,0,0,.5)",
              cursor: "grab",
              touchAction: "none",
              userSelect: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "4px 5px",
                background: V.pri,
                color: V.onpri,
              }}
            >
              <Icon name="grip-horizontal" size={12} />
              <span
                style={{
                  flex: 1,
                  font: "700 8.5px/1 " + t.font,
                  letterSpacing: ".08em",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {h.name}
              </span>
              <KInteractive
                as="span"
                label={`Close ${h.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  actions.toggleHud(h.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    actions.toggleHud(h.id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Close panel"
                style={{ cursor: "pointer", display: "flex" }}
              >
                <Icon name="x" size={12} />
              </KInteractive>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(" + HUD_COLS[h.kind] + ",1fr)",
                gap: "3px",
                padding: "5px",
                height: h.h - 26 + "px",
              }}
            >
              {Array.from({ length: n }, (_, i) => (
                <span
                  key={i}
                  style={{
                    background: i === 0 ? V.pri : V.surf2,
                    opacity: i === 0 ? 0.95 : 0.75,
                    border: "1px solid " + V.outv,
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}

      <KInteractive
        label="Open HUD picker"
        onClick={() => actions.setHudPicker(true)}
        style={{
          ...overlayBtn,
          position: "absolute",
          left: "14px",
          bottom: "14px",
          zIndex: 7,
        }}
      >
        <Icon name="layers" size={21} />
        {hudPanels.length ? (
          <span
            style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              minWidth: "18px",
              height: "18px",
              padding: "0 5px",
              borderRadius: "9px",
              background: V.bdg,
              color: V.onbdg,
              font: "700 9.5px/18px " + t.font,
              textAlign: "center",
            }}
          >
            {hudPanels.length}
          </span>
        ) : null}
      </KInteractive>

      <div
        style={{
          position: "absolute",
          left: "14px",
          bottom: "72px",
          width: "112px",
          height: "112px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "1px solid " + V.outv,
            borderRadius: "50%",
            background: V.surf,
            opacity: 0.8,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "5px",
            transform: "translateX(-50%)",
            color: V.pri,
          }}
        >
          <Icon name="chevron-up" size={24} />
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "5px",
            transform: "translateX(-50%)",
            color: V.pri,
          }}
        >
          <Icon name="chevron-down" size={24} />
        </div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "5px",
            transform: "translateY(-50%)",
            color: V.pri,
          }}
        >
          <Icon name="chevron-left" size={24} />
        </div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "5px",
            transform: "translateY(-50%)",
            color: V.pri,
          }}
        >
          <Icon name="chevron-right" size={24} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: "14px",
          bottom: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div
          style={{
            width: "46px",
            height: "46px",
            borderRadius: V.rs,
            background: V.surf,
            border: "1px solid " + V.outv,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: V.pri,
          }}
        >
          <Icon name="arrow-up-from-line" size={20} />
        </div>
        <div
          style={{
            width: "46px",
            height: "46px",
            borderRadius: V.rs,
            background: V.surf,
            border: "1px solid " + V.outv,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: V.pri,
          }}
        >
          <Icon name="arrow-down-from-line" size={20} />
        </div>
        <div
          style={{
            width: "46px",
            height: "46px",
            borderRadius: V.rs,
            background: V.pri,
            color: V.onpri,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="camera" size={20} />
        </div>
      </div>

      {state.hudPicker ? (
        <div
          onClick={() => actions.setHudPicker(false)}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,.55)",
            zIndex: 9,
          }}
        >
          <div style={sheetStyle} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                marginBottom: "6px",
              }}
            >
              <Icon name="layers" size={17} style={{ color: V.pri }} />
              <span
                style={{
                  flex: 1,
                  font: "600 12px/1 " + t.font,
                  letterSpacing: ".2em",
                  color: V.pri,
                }}
              >
                WORN HUDS
              </span>
              <KInteractive
                as="span"
                onClick={() => actions.setHudPicker(false)}
                label="Done picking HUDs"
                style={{
                  font: "400 11px/1 " + t.font,
                  color: V.ink2,
                  cursor: "pointer",
                }}
              >
                DONE
              </KInteractive>
            </div>
            <div
              style={{
                font: "400 11px/1.6 " + t.font,
                color: V.ink2,
                marginBottom: "6px",
              }}
            >
              Tick a HUD to paint it over the world view. Drag its title bar to
              move it.
            </div>
            {HUDS.map((h) => {
              const on = !!state.hudOn[h.id];
              return (
                <KInteractive
                  key={h.id}
                  onClick={() => actions.toggleHud(h.id)}
                  label={h.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "11px",
                    minHeight: "48px",
                    padding: "0 2px",
                    cursor: "pointer",
                    borderBottom: "1px solid " + V.outv,
                    color: on ? V.ink : V.ink2,
                  }}
                >
                  <span
                    style={{
                      width: "22px",
                      height: "22px",
                      flex: "none",
                      borderRadius: "3px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid " + (on ? V.pri : V.outv),
                      background: on ? V.pri : "transparent",
                      color: V.onpri,
                    }}
                  >
                    {on ? <Icon name="check" size={14} /> : null}
                  </span>
                  <span style={{ flex: 1, font: "500 13px/1.25 " + t.font }}>
                    {h.name}
                  </span>
                  <span style={{ font: "400 10px/1 " + t.font, color: V.ink2 }}>
                    {h.attach + " · " + h.w + "×" + h.h + "px"}
                  </span>
                </KInteractive>
              );
            })}
          </div>
        </div>
      ) : null}

      {state.targetPicker ? (
        <div
          onClick={() => actions.setTargetPicker(false)}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,.55)",
            zIndex: 9,
          }}
        >
          <div style={sheetStyle} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                marginBottom: "6px",
              }}
            >
              <Icon name="crosshair" size={17} style={{ color: V.pri }} />
              <span
                style={{
                  flex: 1,
                  font: "600 12px/1 " + t.font,
                  letterSpacing: ".2em",
                  color: V.pri,
                }}
              >
                PICK A TARGET
              </span>
              <KInteractive
                as="span"
                onClick={() => actions.setTargetPicker(false)}
                label="Close target picker"
                style={{
                  font: "400 11px/1 " + t.font,
                  color: V.ink2,
                  cursor: "pointer",
                }}
              >
                CLOSE
              </KInteractive>
            </div>
            <div
              style={{
                font: "400 11px/1.6 " + t.font,
                color: V.ink2,
                marginBottom: "6px",
              }}
            >
              Touch, sit, or IM whatever you select — precise picking without
              pixel-hunting the scene.
            </div>
            {TARGETS.map((x) => (
              <KInteractive
                key={x.id}
                onClick={() => {
                  actions.setTarget(x.id);
                  actions.setTargetPicker(false);
                }}
                label={x.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "11px",
                  minHeight: "48px",
                  padding: "0 2px",
                  cursor: "pointer",
                  borderBottom: "1px solid " + V.outv,
                  color: state.target === x.id ? V.pri : V.ink,
                }}
              >
                <Icon name={x.icon} size={17} style={{ color: V.pri }} />
                <span style={{ flex: 1, font: "500 13px/1.25 " + t.font }}>
                  {x.name}
                </span>
                <span style={{ font: "400 10px/1 " + t.font, color: V.ink2 }}>
                  {x.meta}
                </span>
              </KInteractive>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Ported from the `actionBar` footer strip shown below the 3D view.
export function World3DActionBar() {
  const { V, t } = useTheme();
  const actionBar = [
    { icon: "armchair", label: "SIT" },
    { icon: "footprints", label: "RUN" },
    { icon: "plane", label: "FLY" },
    { icon: "hand", label: "TOUCH" },
  ];
  return (
    <div
      style={{
        flex: "none",
        display: "flex",
        gap: "6px",
        padding: "10px 12px",
        borderTop: "1px solid " + V.outv,
        background: V.surf,
      }}
    >
      {actionBar.map((a) => (
        <div
          key={a.label}
          style={{
            flex: 1,
            height: "46px",
            border: "1px solid " + V.outv,
            borderRadius: V.rs,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "3px",
            color: V.ink,
          }}
        >
          <Icon name={a.icon} size={17} />
          <span style={{ font: "600 9px/1 " + t.font, letterSpacing: ".12em" }}>
            {a.label}
          </span>
        </div>
      ))}
    </div>
  );
}
