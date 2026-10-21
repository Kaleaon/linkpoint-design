import { useApp } from "../context/AppContext.jsx";
import { PROFILE_BLOCKS } from "../data/content.js";
import { subView } from "../theme/constants.js";
import Icon from "../components/Icon.jsx";

// Ported from the `isProfile` <sc-if> block.
export default function Profile() {
  const { state, actions: { startIm, notify } } = useApp();
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
      <div style={{ position: "relative", height: "158px", background: "repeating-linear-gradient(135deg, var(--ktheme-surf2) 0 10px, var(--ktheme-surf) 10px 20px)", display: "flex", alignItems: "flex-end", padding: "12px" }}>
        <span style={{ font: "400 10px/1 var(--ktheme-font, system-ui, sans-serif)", color: "var(--ktheme-ink2)" }}>profile banner — drop 2nd Life picture</span>
      </div>
      <div style={{ padding: "0 16px", marginTop: "-36px", display: "flex", alignItems: "flex-end", gap: "12px" }}>
        <div style={{ width: "76px", height: "76px", border: "1px solid var(--ktheme-outv)", background: "repeating-linear-gradient(45deg, var(--ktheme-surf2) 0 6px, var(--ktheme-surf) 6px 12px)" }} />
        <div style={{ paddingBottom: "6px" }}>
          <div style={{ font: "600 17px/1.2 var(--ktheme-font, system-ui, sans-serif)" }}>Nyx Vaher</div>
          <div style={{ font: "400 11px/1.3 var(--ktheme-font, system-ui, sans-serif)", color: "var(--ktheme-ink2)", marginTop: "4px" }}>nyx.vaher · online · Da Boom</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px", padding: "14px 16px" }}>
        <div role="button" tabIndex={0} aria-label="Send IM" onClick={() => startIm("Nyx Vaher")} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startIm("Nyx Vaher"); } }} style={{ flex: 1, height: "44px", borderRadius: "var(--ktheme-rs)", background: "var(--ktheme-pri)", color: "var(--ktheme-onpri)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", font: "700 11px/1 var(--ktheme-font, system-ui, sans-serif)", letterSpacing: ".16em", cursor: "pointer" }}>
          <Icon name="message-square" size={16} />
          IM
        </div>
        <div role="button" tabIndex={0} aria-label="Offer Teleport" onClick={() => notify("Nyx Vaher — TELEPORT OFFER SENT")} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); notify("Nyx Vaher — TELEPORT OFFER SENT"); } }} style={{ flex: 1, height: "44px", border: "1px solid var(--ktheme-outv)", borderRadius: "var(--ktheme-rs)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", font: "700 11px/1 var(--ktheme-font, system-ui, sans-serif)", letterSpacing: ".16em", cursor: "pointer" }}>
          <Icon name="zap" size={16} />
          OFFER TP
        </div>
        <div role="button" tabIndex={0} aria-label="More options" onClick={() => notify("Nyx Vaher — MORE OPTIONS")} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); notify("Nyx Vaher — MORE OPTIONS"); } }} style={{ width: "44px", height: "44px", border: "1px solid var(--ktheme-outv)", borderRadius: "var(--ktheme-rs)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Icon name="more-horizontal" size={18} />
        </div>
      </div>
      {(PROFILE_BLOCKS[subView(state, "Profile")] || PROFILE_BLOCKS["2ND LIFE"]).map((pb) => (
        <div key={pb.label} style={{ margin: "0 16px 12px", border: "1px solid var(--ktheme-outv)", borderRadius: "var(--ktheme-rs)", background: "var(--ktheme-surf)", padding: "12px" }}>
          <div style={{ font: "600 11px/1 var(--ktheme-font, system-ui, sans-serif)", letterSpacing: ".26em", color: "var(--ktheme-pri)", marginBottom: "8px" }}>{pb.label}</div>
          <div style={{ font: "400 12px/1.65 var(--ktheme-font, system-ui, sans-serif)", color: "var(--ktheme-ink2)" }}>{pb.body}</div>
        </div>
      ))}
    </div>
  );
}
