import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";
import Icon from "./Icon.jsx";
import KInteractive from "./KInteractive.jsx";

export default function VoiceChatBar({
  compact = false,
  channelName = "Spatial Voice",
}) {
  const { state, actions } = useApp();
  const { V, t, ink } = useTheme();
  const reducedMotion = usePrefersReducedMotion();

  // Voice modes: 'muted', 'active', 'ptt'
  const [voiceMode, setVoiceMode] = useState("muted");
  const [isPttHeld, setIsPttHeld] = useState(false);

  const isSpeaking =
    voiceMode === "active" || (voiceMode === "ptt" && isPttHeld);

  const cycleMode = () => {
    if (voiceMode === "muted") {
      setVoiceMode("active");
      actions.notify("Microphone active (Open Mic)");
    } else if (voiceMode === "active") {
      setVoiceMode("ptt");
      actions.notify("Microphone in Push-to-Talk mode");
    } else {
      setVoiceMode("muted");
      actions.notify("Microphone muted");
    }
  };

  const modeColor = isSpeaking
    ? V.ok || "#22c55e"
    : voiceMode === "ptt"
      ? V.sec || "#f59e0b"
      : V.err || "#ef4444";
  const modeLabel = isSpeaking
    ? "SPEAKING"
    : voiceMode === "ptt"
      ? "PTT READY"
      : "MUTED";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
        padding: compact ? "4px 8px" : "6px 12px",
        background: V.surf,
        border: "1px solid " + V.outv,
        borderRadius: V.rs,
        minHeight: "44px",
        boxSizing: "border-box",
      }}
    >
      {/* Left: Mode toggle & Mic icon */}
      <KInteractive
        onClick={cycleMode}
        label={`Toggle voice mode: currently ${modeLabel}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          minHeight: "40px",
          padding: "0 10px",
          background: isSpeaking ? V.priC : V.surf2,
          color: isSpeaking ? V.onpriC : V.ink,
          borderRadius: V.rs,
          cursor: "pointer",
          border: "1px solid " + (isSpeaking ? V.pri : V.outv),
        }}
      >
        <Icon
          name={isSpeaking ? "mic" : voiceMode === "ptt" ? "radio" : "mic-off"}
          size={16}
          style={{ color: modeColor }}
        />
        <span style={{ font: "700 10px/1 " + t.dfont, letterSpacing: ".1em" }}>
          {modeLabel}
        </span>
      </KInteractive>

      {/* Middle: Channel & Speaking wave bars */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            font: "500 11px/1.2 " + t.font,
            color: V.ink2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {channelName}
        </span>

        {/* Dynamic Voice Wave Meters */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2px",
            height: "16px",
            flex: "none",
          }}
        >
          {[8, 14, 11, 16, 7].map((h, i) => (
            <span
              key={i}
              style={{
                width: "2.5px",
                height: isSpeaking
                  ? reducedMotion
                    ? `${h}px`
                    : `${Math.max(4, (h * ((i % 2) + 1)) % 16)}px`
                  : "3px",
                background: isSpeaking ? modeColor : V.outv,
                borderRadius: "1px",
                transition: reducedMotion ? "none" : "height .15s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* Right: Push-To-Talk hold button (if in PTT mode) */}
      {voiceMode === "ptt" ? (
        <KInteractive
          as="button"
          onMouseDown={() => setIsPttHeld(true)}
          onMouseUp={() => setIsPttHeld(false)}
          onMouseLeave={() => setIsPttHeld(false)}
          onTouchStart={() => setIsPttHeld(true)}
          onTouchEnd={() => setIsPttHeld(false)}
          label="Push to talk button"
          style={{
            minHeight: "40px",
            padding: "0 14px",
            background: isPttHeld ? V.pri : V.surf2,
            color: isPttHeld ? ink(V.pri, [V.bg, V.onpri, V.ink]) : V.ink,
            border: "1px solid " + (isPttHeld ? V.pri : V.outv),
            borderRadius: V.rs,
            font: "700 10px/1 " + t.dfont,
            letterSpacing: ".14em",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          HOLD TO TALK
        </KInteractive>
      ) : (
        <KInteractive
          onClick={cycleMode}
          label="Quick mute switch"
          style={{
            minHeight: "40px",
            padding: "0 10px",
            background: "transparent",
            color: V.ink2,
            border: "1px solid " + V.outv,
            borderRadius: V.rs,
            font: "600 9.5px/1 " + t.dfont,
            letterSpacing: ".08em",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          {voiceMode === "muted" ? "UNMUTE" : "MUTE"}
        </KInteractive>
      )}
    </div>
  );
}
