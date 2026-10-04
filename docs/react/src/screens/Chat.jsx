import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { LOCAL_MSGS, IM_THREADS, GROUP_THREADS, IM_CHIPS, GROUP_CHIPS, parseSlurl } from "../data/content.js";
import Icon from "../components/Icon.jsx";

function LandmarkCard({ slurlData, state, actions, V, t }) {
  const [imgFailed, setImgFailed] = useState(false);
  const regionKey = slurlData.regionName.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const isSaved = !!state.pinned[regionKey];
  const isOffline = state.loginMode === "offline";

  return (
    <div
      style={{
        marginTop: "8px",
        maxHeight: "140px",
        height: "128px",
        border: "1px solid " + V.outv,
        borderRadius: V.rs,
        overflow: "hidden",
        background: V.bg,
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div
        style={{
          width: "96px",
          height: "100%",
          flex: "none",
          position: "relative",
          background: "repeating-linear-gradient(135deg," + V.surf2 + " 0 8px, transparent 8px 16px)",
          borderRight: "1px solid " + V.outv,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {!imgFailed && slurlData.img ? (
          <img
            src={slurlData.img}
            alt={slurlData.regionName}
            onError={() => setImgFailed(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              color: V.pri,
              opacity: 0.9,
            }}
          >
            <Icon name="map-pin" size={22} />
            <span style={{ font: "700 9px/1 " + t.dfont, letterSpacing: ".08em", textTransform: "uppercase" }}>
              {slurlData.rating}
            </span>
          </div>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0, padding: "8px 10px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ font: "600 12px/1.2 " + t.font, color: V.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {slurlData.regionName}
          </div>
          <div style={{ font: "400 10px/1.3 " + t.font, color: V.ink2, marginTop: "2px" }}>
            {slurlData.coords} · <span style={{ color: V.sec2 }}>{slurlData.avatars}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <button
            onClick={() => actions.teleportToRegion(slurlData.regionName, slurlData.coords)}
            style={{
              flex: "none",
              padding: "4px 8px",
              borderRadius: V.rs,
              border: "none",
              background: isOffline ? V.surf2 : V.pri,
              color: isOffline ? V.ink2 : V.onpri,
              font: "600 10px/1 " + t.dfont,
              letterSpacing: ".06em",
              cursor: isOffline ? "not-allowed" : "pointer",
              opacity: isOffline ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Icon name="zap" size={11} />
            TELEPORT
          </button>

          <button
            onClick={() => {
              actions.notify("Viewing " + slurlData.regionName + " on Map");
              actions.setScreen("Map");
            }}
            style={{
              flex: "none",
              padding: "4px 8px",
              borderRadius: V.rs,
              border: "1px solid " + V.outv,
              background: "transparent",
              color: V.ink,
              font: "500 10px/1 " + t.font,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Icon name="map" size={11} />
            VIEW ON MAP
          </button>

          <button
            onClick={() => actions.saveLandmark(slurlData.regionName)}
            style={{
              flex: "none",
              padding: "4px 8px",
              borderRadius: V.rs,
              border: "1px solid " + (isSaved ? V.pri : V.outv),
              background: isSaved ? V.priC : "transparent",
              color: isSaved ? V.pri : V.ink,
              font: "500 10px/1 " + t.font,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Icon name={isSaved ? "check" : "bookmark"} size={11} />
            {isSaved ? "SAVED" : "SAVE LANDMARK"}
          </button>
        </div>
      </div>
    </div>
  );
}

function LureCard({ msg, state, actions, V, t }) {
  const response = state.lureState[msg.id || msg.ts];
  const isOffline = state.loginMode === "offline";

  return (
    <div
      style={{
        marginTop: "8px",
        maxHeight: "140px",
        padding: "8px 10px",
        border: "1px solid " + (response === "accepted" ? V.pri : response === "declined" ? V.outv : V.sec2),
        borderRadius: V.rs,
        background: V.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "6px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <Icon name="zap" size={14} style={{ color: V.sec2 }} />
        <span style={{ font: "600 11px/1.2 " + t.dfont, color: V.sec2, letterSpacing: ".06em" }}>
          TELEPORT OFFER
        </span>
        {response && (
          <span
            style={{
              marginLeft: "auto",
              font: "700 9px/1 " + t.dfont,
              padding: "2px 6px",
              borderRadius: V.rs,
              background: response === "accepted" ? V.pri : V.surf2,
              color: response === "accepted" ? V.onpri : V.ink2,
            }}
          >
            {response === "accepted" ? "✓ ACCEPTED" : "✗ DECLINED"}
          </span>
        )}
      </div>

      <div style={{ font: "400 11px/1.3 " + t.font, color: V.ink }}>
        “{msg.lureMsg || "Come teleport to my location"}”
      </div>

      <div style={{ font: "400 10px/1.2 " + t.font, color: V.ink2 }}>
        Destination: {msg.lureRegion} {msg.lureCoords}
      </div>

      {!response ? (
        <div style={{ display: "flex", gap: "8px", marginTop: "2px" }}>
          <button
            onClick={() => actions.respondLure(msg.id || msg.ts, "accepted", msg.lureRegion, msg.lureCoords)}
            style={{
              padding: "5px 10px",
              borderRadius: V.rs,
              border: "none",
              background: isOffline ? V.surf2 : V.pri,
              color: isOffline ? V.ink2 : V.onpri,
              font: "600 10px/1 " + t.dfont,
              letterSpacing: ".06em",
              cursor: isOffline ? "not-allowed" : "pointer",
              opacity: isOffline ? 0.7 : 1,
            }}
          >
            ACCEPT LURE
          </button>
          <button
            onClick={() => actions.respondLure(msg.id || msg.ts, "declined", msg.lureRegion, msg.lureCoords)}
            style={{
              padding: "5px 10px",
              borderRadius: V.rs,
              border: "1px solid " + V.outv,
              background: "transparent",
              color: V.ink2,
              font: "500 10px/1 " + t.font,
              cursor: "pointer",
            }}
          >
            DECLINE
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function Chat() {
  const { state, actions } = useApp();
  const { V, t, bleed, pad, C, nav } = useTheme();

  const curTab = state.tabs.Chat;
  const chipList = curTab === "GROUP" ? GROUP_CHIPS : curTab === "IM" ? IM_CHIPS : [];
  const activeChip = chipList.includes(state.chip) ? state.chip : chipList[0];
  const source = curTab === "IM" ? IM_THREADS[activeChip] : curTab === "GROUP" ? GROUP_THREADS[activeChip] : LOCAL_MSGS;

  const wrapBase = { width: "100%", display: "flex", justifyContent: "flex-start" };
  const bubBase = { maxWidth: "88%", padding: "8px 10px", border: "1px solid " + V.outv, borderRadius: V.rp, background: V.surf };
  const headBase = { font: "400 10px/1.3 " + t.font, color: V.pri, marginBottom: "3px" };
  const textBase = { font: "400 13px/1.45 " + t.font, color: V.ink };

  const chatBodyStyle = bleed
    ? { flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column", gap: C.gap + "px", padding: 0, background: V.bg }
    : { flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column", gap: "6px", padding: "8px 12px" };

  const composerStyle = { flex: "none", display: "flex", gap: "8px", borderTop: "1px solid " + V.outv, background: V.surf, padding: nav === "sweep" ? "12px 12px 12px 0" : "12px", borderTopLeftRadius: nav === "sweep" ? V.rl : "0", borderTopRightRadius: nav === "sweep" ? V.rl : "0" };
  const composerFieldStyle = { flex: 1, minWidth: 0, minHeight: "44px", display: "flex", alignItems: "center", gap: "8px", padding: "0 12px", border: "1px solid " + V.outv, background: V.bg, borderRadius: nav === "sweep" ? "0 " + V.rs + " " + V.rs + " 0" : V.rs };

  return (
    <>
      <div style={chatBodyStyle}>
        {source.map((m, i) => {
          const acc = m.sys ? V.info : m.me ? V.pri : V.sec2;
          const align = bleed ? { display: "flex", width: "100%" } : { ...wrapBase, ...(m.me ? { justifyContent: "flex-end" } : null) };
          const bubble = bleed
            ? { flex: 1, minWidth: 0, background: V.surf, borderLeft: "4px solid " + acc, overflow: "hidden", padding: pad + " 12px " + pad + " 10px" }
            : { ...bubBase, ...(m.me ? { background: V.priC, borderColor: V.pri } : m.sys ? { background: "transparent", borderStyle: "dashed", borderColor: V.info } : null) };
          const headStyle = bleed ? { font: "400 10px/1.3 " + t.font, color: acc, letterSpacing: ".06em", marginBottom: "3px" } : { ...headBase, ...(m.sys ? { color: V.info } : m.me ? { color: V.onpriC } : null) };
          const textStyle = bleed ? { ...textBase, ...(m.sys ? { color: V.info } : null) } : { ...textBase, ...(m.sys ? { color: V.info } : m.me ? { color: V.onpriC } : null) };

          const slurlData = parseSlurl(m.text, m.linkUrl, m.linkTitle);

          return (
            <div key={i} style={align}>
              <div style={bubble}>
                <div style={headStyle}>
                  [{m.ts}] {m.sender}
                </div>
                <div style={textStyle}>{m.text}</div>

                {m.isLure ? (
                  <LureCard msg={m} state={state} actions={actions} V={V} t={t} />
                ) : slurlData ? (
                  <LandmarkCard slurlData={slurlData} state={state} actions={actions} V={V} t={t} />
                ) : null}
              </div>
            </div>
          );
        })}
        <div style={{ font: "400 12px/1.4 " + t.font, color: V.ink2, padding: bleed ? "6px 10px" : "4px 2px" }}>
          &gt; Nyx is typing<span style={{ animation: "blink 1s steps(1) infinite" }}>_</span>
        </div>
      </div>
      <div style={composerStyle}>
        <div style={composerFieldStyle}>
          <Icon name="smile" size={16} style={{ opacity: 0.55 }} />
          <span style={{ font: "400 13px/1 " + t.font, color: V.ink2 }}>say to local…</span>
          <span style={{ marginLeft: "auto", font: "600 10px/1 " + t.font, color: V.ink2, letterSpacing: ".1em" }}>/1</span>
        </div>
        <div style={{ width: "48px", height: "44px", flex: "none", borderRadius: V.rs, background: V.pri, color: V.onpri, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Icon name="send" size={19} />
        </div>
      </div>
    </>
  );
}
