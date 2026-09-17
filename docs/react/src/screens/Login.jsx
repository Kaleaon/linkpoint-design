import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import Icon from "../components/Icon.jsx";

// Ported from the `isLogin` <sc-if> block. GRID LOGIN/OFFLINE is a real
// toggle that swaps the field set; CONNECT TO GRID always "fails" after
// ~1s since this mockup has no live backend to succeed against.
export default function Login() {
  const { state, actions } = useApp();
  const { V, t } = useTheme();
  const isGrid = state.loginMode === "grid";
  const fields = isGrid
    ? [
        { label: "AVATAR NAME", value: "Ruth   /   Resident" },
        { label: "PASSWORD", value: "••••••••" },
      ]
    : [{ label: "AVATAR NAME", value: "Ruth Resident" }];

  return (
    <div style={{ flex: 1, minHeight: 0, position: "relative", overflowY: "auto" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "340px", background: "repeating-linear-gradient(135deg,#1B2A2D 0 12px,#101A1C 12px 24px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "420px", background: "linear-gradient(180deg,transparent 0%," + V.bg + " 88%)" }} />
      <div style={{ position: "relative", padding: "36px 16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <Icon name="hexagon" size={24} style={{ color: V.pri }} />
          <span style={{ font: "700 27px/1 " + t.dfont, letterSpacing: ".24em", color: V.pri }}>Linkpoint</span>
        </div>
        <div style={{ font: "400 11px/1 " + t.font, color: V.ink2, letterSpacing: ".18em", marginTop: "7px" }}>SECONDLIFE COMMUNICATOR // v2.0</div>
        <div style={{ marginTop: "150px", border: "1px solid " + V.outv, borderRadius: V.rp, background: V.surf, padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", border: "1px solid " + V.outv, borderRadius: V.rs, overflow: "hidden", marginBottom: "6px" }}>
            {[
              { mode: "grid", label: "GRID LOGIN" },
              { mode: "offline", label: "OFFLINE" },
            ].map((x) => {
              const active = x.mode === state.loginMode;
              return (
                <div
                  key={x.mode}
                  onClick={() => actions.setLoginMode(x.mode)}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "10px 0",
                    cursor: "pointer",
                    font: "600 12px/1 " + t.font,
                    letterSpacing: ".18em",
                    ...(active
                      ? { background: V.priC, color: V.onpriC, borderBottom: "2px solid " + V.pri }
                      : { color: V.ink2 }),
                  }}
                >
                  {x.label}
                </div>
              );
            })}
          </div>

          {isGrid ? (
            <div>
              <div style={{ font: "400 11px/1 " + t.font, letterSpacing: ".2em", color: V.pri, margin: "8px 0 6px" }}>GRID</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {actions.allGrids().map((g) => {
                  const active = state.loginGrid === g.key;
                  return (
                    <div
                      key={g.key}
                      onClick={() => actions.setLoginGrid(g.key)}
                      style={{
                        flex: "1 1 84px",
                        textAlign: "center",
                        padding: "9px 6px",
                        border: "1px solid " + (active ? V.pri : V.outv),
                        borderRadius: V.rs,
                        font: "600 10.5px/1 " + t.font,
                        letterSpacing: ".04em",
                        color: active ? V.pri : V.ink2,
                        background: active ? V.priC : "transparent",
                        cursor: "pointer",
                      }}
                    >
                      {g.label}
                    </div>
                  );
                })}
                <div
                  onClick={actions.openAddGrid}
                  style={{
                    flex: "1 1 84px", textAlign: "center", padding: "9px 6px", border: "1px dashed " + V.outv,
                    borderRadius: V.rs, font: "600 10.5px/1 " + t.font, letterSpacing: ".04em", color: V.ink2,
                    background: "transparent", cursor: "pointer",
                  }}
                >
                  + CUSTOM
                </div>
              </div>

              {/* A resident can point the viewer at any OpenSim grid, not
                  just the built-in presets — the mockup's "add custom grid
                  URI" flow, themed off the same tokens as everything else
                  here so it re-skins with the layout/colour pack. */}
              {state.addGrid ? (
                <div style={{ marginTop: "10px", border: "1px dashed " + V.outv, borderRadius: V.rs, padding: "10px" }}>
                  <div style={{ font: "400 10px/1 " + t.font, letterSpacing: ".16em", color: V.ink2 }}>ADD CUSTOM GRID</div>
                  <input
                    value={state.addGridName}
                    onChange={(e) => actions.setAddGridName(e.target.value)}
                    placeholder="grid name"
                    style={{ minHeight: "42px", width: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 12px", border: "1px solid " + V.outv, borderRadius: V.rs, background: V.bg, font: "400 13px/1 " + t.font, color: V.ink, marginTop: "6px" }}
                  />
                  <input
                    value={state.addGridHost}
                    onChange={(e) => actions.setAddGridHost(e.target.value)}
                    placeholder="login URI (e.g. login.example.com:8002)"
                    style={{ minHeight: "42px", width: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 12px", border: "1px solid " + V.outv, borderRadius: V.rs, background: V.bg, font: "400 13px/1 " + t.font, color: V.ink, marginTop: "6px" }}
                  />
                  <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                    <div
                      onClick={actions.cancelAddGrid}
                      style={{ flex: 1, textAlign: "center", padding: "9px 0", border: "1px solid " + V.outv, borderRadius: V.rs, font: "600 10.5px/1 " + t.font, letterSpacing: ".14em", color: V.ink2, cursor: "pointer" }}
                    >
                      CANCEL
                    </div>
                    <div
                      onClick={actions.saveCustomGrid}
                      style={{ flex: 1, textAlign: "center", padding: "9px 0", borderRadius: V.rs, background: V.pri, color: V.onpri, font: "600 10.5px/1 " + t.font, letterSpacing: ".14em", cursor: "pointer" }}
                    >
                      ADD GRID
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {fields.map((lf) => (
            <div key={lf.label}>
              <div style={{ font: "400 11px/1 " + t.font, letterSpacing: ".2em", color: V.pri, margin: "8px 0 6px" }}>{lf.label}</div>
              <div style={{ minHeight: "42px", display: "flex", alignItems: "center", padding: "0 12px", border: "1px solid " + V.outv, borderRadius: V.rs, background: V.bg, font: "400 13px/1 " + t.font, color: V.ink2 }}>{lf.value}</div>
            </div>
          ))}

          {!isGrid ? (
            <div style={{ font: "400 10.5px/1.5 " + t.font, color: V.ink2 }}>&gt; Offline mode: no grid connection, chat stays local.</div>
          ) : null}

          <div
            onClick={actions.connectLogin}
            style={{
              marginTop: "14px",
              height: "48px",
              borderRadius: V.rs,
              background: V.pri,
              color: V.onpri,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              font: "700 13px/1 " + t.font,
              letterSpacing: ".22em",
              cursor: "pointer",
              opacity: state.loginBusy ? 0.7 : 1,
            }}
          >
            <Icon name="power" size={17} />
            {state.loginBusy ? "CONNECTING…" : isGrid ? "CONNECT TO GRID" : "ENTER OFFLINE"}
          </div>

          {state.loginError ? (
            <div style={{ font: "400 10.5px/1.5 " + t.font, color: V.err, marginTop: "8px", border: "1px solid " + V.err, borderRadius: V.rs, padding: "8px" }}>
              &gt; {state.loginError}
            </div>
          ) : (
            <div style={{ font: "400 10.5px/1.5 " + t.font, color: V.ink2, marginTop: "8px" }}>&gt; last: Agni · Da Boom · 14:02 · biometric unlock available</div>
          )}
        </div>
      </div>
    </div>
  );
}
