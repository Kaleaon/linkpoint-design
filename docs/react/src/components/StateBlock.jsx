import React, { Component } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import Icon from "./Icon.jsx";
import CrystalLoader from "./CrystalLoader.jsx";

export class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (this.props.onCatch) {
      this.props.onCatch(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
            padding: "34px 26px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "62px",
              height: "62px",
              flex: "none",
              borderRadius: "12px",
              border: "1px solid #FF6C6C",
              background: "rgba(255,108,108,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FF6C6C",
            }}
          >
            <Icon name="alert-triangle" size={28} />
          </div>
          <div style={{ font: "700 16px/1.3 sans-serif", letterSpacing: ".1em", color: "#FF6C6C" }}>
            SCREEN EXECUTION EXCEPTION
          </div>
          <div style={{ maxWidth: "320px", font: "400 12px/1.6 sans-serif", color: "rgba(255,255,255,0.7)" }}>
            {this.state.error?.message || "An unexpected error occurred in viewer component tree."}
          </div>
          <div
            onClick={this.handleReset}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this.handleReset(); } }}
            style={{
              minHeight: "44px",
              padding: "0 22px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              background: "#FF6C6C",
              color: "#FFFFFF",
              font: "700 11px/1 sans-serif",
              letterSpacing: ".18em",
              cursor: "pointer",
              gap: "8px",
            }}
            role="button" aria-label="Retry component" tabIndex={0}
          >
            <Icon name="refresh-cw" size={14} />
            RETRY SCREEN EXECUTION
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Ported from the `stateBlock` computation + its <sc-if> template block —
// the shared loading/empty/error UI shown in place of a screen's normal body.
export default function StateBlock() {
  const { state, actions } = useApp();
  const { V, t, condPack, stateBlockActive } = useTheme();
  if (!stateBlockActive || !condPack) return null;
  const isError = state.cond === "error" || state.recoveryState === "failed";
  const isLoading = state.cond === "loading";

  const handleAction = () => {
    if (isError) {
      actions.setCond("normal");
      actions.attemptReconnection(1);
    } else if (actions.setCond) {
      actions.setCond("normal");
    }
  };

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "15px",
        padding: "34px 26px",
        textAlign: "center",
      }}
    >
      {/* Loading swaps the lucide glyph for the crystal loader; empty/error keep the
          glyph, which carries the specific meaning (inbox, plug-zap, cloud-off, …). */}
      {isLoading ? (
        <CrystalLoader />
      ) : (
        <div
          style={{
            width: "62px",
            height: "62px",
            flex: "none",
            borderRadius: V.rp,
            border: "1px solid " + (isError ? V.err : V.outv),
            background: V.surf,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isError ? V.err : V.pri,
          }}
        >
          <Icon name={condPack.icon} size={26} />
        </div>
      )}
      <div style={{ font: "700 15px/1.3 " + t.dfont, letterSpacing: V.tls, color: isError ? V.err : V.ink }}>{condPack.title}</div>
      <div style={{ maxWidth: "300px", font: "400 12px/1.7 " + t.font, color: V.ink2 }}>{condPack.body}</div>
      {condPack.bar ? (
        <div style={{ width: "216px", height: "4px", borderRadius: "2px", background: V.surf2, overflow: "hidden" }}>
          <div style={{ width: Math.round(condPack.bar * 100) + "%", height: "100%", background: V.pri }} />
        </div>
      ) : null}
      {condPack.log ? (
        <div style={{ font: "400 10.5px/1.75 " + t.font, color: V.ink2, textAlign: "left", border: "1px dashed " + V.outv, borderRadius: V.rs, padding: "8px 10px", maxWidth: "300px" }}>
          {condPack.log.map((ln, i) => (
            <div key={i}>{ln}</div>
          ))}
        </div>
      ) : null}
      {condPack.btn ? (
        <div
          onClick={handleAction}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleAction(); } }}
          style={{
            minHeight: "44px",
            padding: "0 22px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: V.rs,
            background: isError ? V.err : V.pri,
            color: isError ? "#FFFFFF" : V.onpri,
            font: "700 11px/1 " + t.font,
            letterSpacing: ".18em",
            cursor: "pointer",
          }}
          role="button" aria-label={condPack.btn} tabIndex={0}
        >
          {condPack.btn}
        </div>
      ) : null}
    </div>
  );
}
