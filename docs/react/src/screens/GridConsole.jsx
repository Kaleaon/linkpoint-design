import React from "react";
import { useApp } from "../context/AppContext.jsx";
import KInteractive from "../components/KInteractive.jsx";
import FormInput from "../components/FormInput.jsx";

export default function GridConsole() {
  const { state, actions } = useApp();

  const logs = (state.consoleLogs || []).filter((entry) => {
    if (state.consoleQuery) {
      const q = state.consoleQuery.toLowerCase();
      return entry.msg.toLowerCase().includes(q) || entry.tag.toLowerCase().includes(q);
    }
    return true;
  });

  const totalCount = (state.consoleLogs || []).length;
  const warnCount = (state.consoleLogs || []).filter((e) => e.level === "WARN").length;
  const errorCount = (state.consoleLogs || []).filter((e) => e.level === "ERROR" || e.level === "FATAL").length;

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", padding: "12px", gap: "10px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", padding: "10px", border: "1px solid var(--ktheme-outv)", borderRadius: "var(--ktheme-rs)", background: "var(--ktheme-surf)" }}>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <span style={{ padding: "4px 8px", borderRadius: "var(--ktheme-rs)", background: "var(--ktheme-surf2)", font: "700 10px/1 var(--ktheme-font, system-ui, sans-serif)", color: "var(--ktheme-ink)" }}>ENTRIES: {totalCount}</span>
          <span style={{ padding: "4px 8px", borderRadius: "var(--ktheme-rs)", background: "rgba(255,176,32,0.15)", font: "700 10px/1 var(--ktheme-font, system-ui, sans-serif)", color: "var(--ktheme-warn)" }}>WARN: {warnCount}</span>
          <span style={{ padding: "4px 8px", borderRadius: "var(--ktheme-rs)", font: "700 10px/1 var(--ktheme-font, system-ui, sans-serif)", background: errorCount > 0 ? "rgba(255,85,85,0.25)" : "var(--ktheme-surf2)", color: errorCount > 0 ? "var(--ktheme-err)" : "var(--ktheme-ink2)" }}>
            ERRORS: {errorCount}
          </span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
          <FormInput
            aria-label="Filter console logs"
            value={state.consoleQuery || ""}
            onChange={(e) => actions.setConsoleQuery(e.target.value)}
            placeholder="filter logs..."
            style={{ height: "28px", padding: "0 8px", border: "1px solid var(--ktheme-outv)", borderRadius: "var(--ktheme-rs)", background: "var(--ktheme-bg)", color: "var(--ktheme-ink)", font: "400 11px/1 var(--ktheme-font, system-ui, sans-serif)" }}
          />
          <KInteractive
            onClick={actions.copyConsoleLogs}
            style={{ padding: "6px 10px", border: "1px solid var(--ktheme-outv)", borderRadius: "var(--ktheme-rs)", background: "var(--ktheme-surf2)", font: "700 10px/1 var(--ktheme-font, system-ui, sans-serif)", color: "var(--ktheme-pri)", cursor: "pointer" }}
            label="Copy logs"
          >
            COPY
          </KInteractive>
          <KInteractive
            onClick={actions.downloadConsoleLogs}
            style={{ padding: "6px 10px", border: "1px solid var(--ktheme-outv)", borderRadius: "var(--ktheme-rs)", background: "var(--ktheme-surf2)", font: "700 10px/1 var(--ktheme-font, system-ui, sans-serif)", color: "var(--ktheme-pri)", cursor: "pointer" }}
            label="Download logs"
          >
            DOWNLOAD
          </KInteractive>
          <KInteractive
            onClick={actions.clearConsoleLogs}
            style={{ padding: "6px 10px", border: "1px solid var(--ktheme-outv)", borderRadius: "var(--ktheme-rs)", background: "var(--ktheme-surf2)", font: "700 10px/1 var(--ktheme-font, system-ui, sans-serif)", color: "var(--ktheme-err)", cursor: "pointer" }}
            label="Clear logs"
          >
            CLEAR
          </KInteractive>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "10px", border: "1px solid var(--ktheme-outv)", borderRadius: "var(--ktheme-rs)", background: "var(--ktheme-bg)", fontFamily: "var(--ktheme-font, 'JetBrains Mono', monospace)" }}>
        {logs.map((cl, i) => {
          let col = "var(--ktheme-ink2)";
          if (cl.level === "INFO") col = "var(--ktheme-pri)";
          if (cl.level === "WARN") col = "var(--ktheme-warn)";
          if (cl.level === "ERROR" || cl.level === "FATAL") col = "var(--ktheme-err)";
          return (
            <div key={i} style={{ font: "400 11px/1.5 var(--ktheme-font, system-ui, sans-serif)", color: col, display: "flex", gap: "8px", padding: "2px 0", borderBottom: "1px solid var(--ktheme-surf2)" }}>
              <span style={{ opacity: 0.6, flex: "none" }}>[{cl.ts}]</span>
              <span style={{ fontWeight: 700, flex: "none", width: "52px" }}>{cl.level}</span>
              <span style={{ color: "var(--ktheme-pri)", flex: "none" }}>{cl.tag}</span>
              <span style={{ flex: 1 }}>{cl.msg}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
