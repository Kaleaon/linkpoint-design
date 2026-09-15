import { useTheme } from "../context/ThemeContext.jsx";
import { LOGIN_FIELDS } from "../data/content.js";
import Icon from "../components/Icon.jsx";

// Ported from the `isLogin` <sc-if> block.
export default function Login() {
  const { V, t } = useTheme();
  return (
    <div style={{ flex: 1, minHeight: 0, position: "relative", overflowY: "auto" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "340px", background: "repeating-linear-gradient(135deg,#1B2A2D 0 12px,#101A1C 12px 24px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "420px", background: "linear-gradient(180deg,transparent 0%," + V.bg + " 88%)" }} />
      <div style={{ position: "relative", padding: "36px 16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <Icon name="hexagon" size={24} style={{ color: V.pri }} />
          <span style={{ font: "700 27px/1 " + t.dfont, letterSpacing: ".24em", color: V.pri }}>GRIDLINK</span>
        </div>
        <div style={{ font: "400 11px/1 " + t.font, color: V.ink2, letterSpacing: ".18em", marginTop: "7px" }}>SECONDLIFE COMMUNICATOR // v2.0</div>
        <div style={{ marginTop: "150px", border: "1px solid " + V.outv, borderRadius: V.rp, background: V.surf, padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", border: "1px solid " + V.outv, borderRadius: V.rs, overflow: "hidden", marginBottom: "6px" }}>
            <div style={{ flex: 1, textAlign: "center", padding: "10px 0", background: V.priC, color: V.onpriC, borderBottom: "2px solid " + V.pri, font: "600 12px/1 " + t.font, letterSpacing: ".18em" }}>GRID LOGIN</div>
            <div style={{ flex: 1, textAlign: "center", padding: "10px 0", color: V.ink2, font: "600 12px/1 " + t.font, letterSpacing: ".18em" }}>OFFLINE</div>
          </div>
          {LOGIN_FIELDS.map((lf) => (
            <div key={lf.label}>
              <div style={{ font: "400 11px/1 " + t.font, letterSpacing: ".2em", color: V.pri, margin: "8px 0 6px" }}>{lf.label}</div>
              <div style={{ minHeight: "42px", display: "flex", alignItems: "center", padding: "0 12px", border: "1px solid " + V.outv, borderRadius: V.rs, background: V.bg, font: "400 13px/1 " + t.font, color: V.ink2 }}>{lf.value}</div>
            </div>
          ))}
          <div style={{ marginTop: "14px", height: "48px", borderRadius: V.rs, background: V.pri, color: V.onpri, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", font: "700 13px/1 " + t.font, letterSpacing: ".22em" }}>
            <Icon name="power" size={17} />
            CONNECT TO GRID
          </div>
          <div style={{ font: "400 10.5px/1.5 " + t.font, color: V.ink2, marginTop: "8px" }}>&gt; last: Agni · Da Boom · 14:02 · biometric unlock available</div>
        </div>
      </div>
    </div>
  );
}
