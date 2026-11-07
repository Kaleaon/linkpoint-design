import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../context/ThemeContext.jsx";
import Icon from "./Icon.jsx";
import KInteractive from "./KInteractive.jsx";

/**
 * BlockKeypad — Authentic 24th-century LCARS block-matrix numeric keypad.
 * Provides tactile numeric input for Linden Dollar payments, sim coordinates,
 * and quantity adjustments with flush rectangular buttons, structural gaps,
 * and digital readout telemetry.
 */
export default function BlockKeypad({
  title = "ENTER VALUE",
  subtitle,
  systemCode = "OPS-03-KEYPAD",
  initialValue = "",
  unit = "L$",
  unitPosition = "prefix", // "prefix" | "suffix"
  presets = [100, 250, 500, 1000],
  allowDecimal = false,
  max,
  onConfirm,
  onCancel,
}) {
  const { V, t, LK, pad, ink } = useTheme();
  const [value, setValue] = useState(String(initialValue || ""));

  const handleDigit = useCallback(
    (digit) => {
      setValue((prev) => {
        if (digit === "." && prev.includes(".")) return prev;
        if (prev === "0" && digit !== ".") return String(digit);
        const next = prev + digit;
        if (max != null && Number(next) > max) return prev;
        return next;
      });
    },
    [max]
  );

  const handleBackspace = useCallback(() => {
    setValue((prev) => (prev.length > 1 ? prev.slice(0, -1) : ""));
  }, []);

  const handleClear = useCallback(() => {
    setValue("");
  }, []);

  const handlePreset = useCallback((preset) => {
    setValue(String(preset));
  }, []);

  // Keyboard navigation & direct typing
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === "." && allowDecimal) {
        e.preventDefault();
        handleDigit(".");
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === "Escape") {
        e.preventDefault();
        if (onCancel) onCancel();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (onConfirm) onConfirm(Number(value) || 0);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDigit, handleBackspace, onCancel, onConfirm, value, allowDecimal]);

  const numVal = Number(value) || 0;
  const isLcars = LK?.card === "cap" || LK?.head === "sweep";
  const btnRadius = isLcars ? "0px" : V.rs === "999px" ? "8px" : V.rs;

  const keyStyle = {
    flex: 1,
    minHeight: "46px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: V.surf2,
    color: V.ink,
    border: "1px solid " + V.outv,
    borderRadius: btnRadius,
    font: "700 18px/1 " + t.dfont,
    cursor: "pointer",
    userSelect: "none",
    transition: "background 0.1s ease",
  };

  const actionBtn = (primary = false, danger = false) => ({
    flex: 1,
    minHeight: "46px",
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    cursor: "pointer",
    background: primary ? V.pri : danger ? V.err || "#dc2626" : V.surf2,
    color: primary
      ? ink(V.pri, [V.bg, V.onpri, V.ink])
      : danger
        ? V.onerr || "var(--onerr, #fff)"
        : V.ink,
    border:
      "1px solid " + (primary ? V.pri : danger ? V.err || "#dc2626" : V.outv),
    borderRadius: isLcars ? (primary ? "0 22px 22px 0" : "0px") : V.rs,
    font: "700 11px/1 " + t.dfont,
    letterSpacing: ".14em",
    whiteSpace: "nowrap",
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && onCancel) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          width: "100%",
          maxWidth: "360px",
          background: V.surf,
          border: isLcars ? "none" : "1px solid " + V.outv,
          borderLeft: isLcars ? "6px solid " + V.pri : undefined,
          borderRadius: isLcars ? "0px" : V.rp,
          boxShadow: "0 12px 36px rgba(0,0,0,0.45)",
          padding: pad,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* Header with LCARS alphanumeric subsystem code */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          <div>
            <div
              style={{
                font: "700 9px/1 " + t.dfont,
                letterSpacing: ".18em",
                color: V.sec2 || V.pri,
                textTransform: "uppercase",
              }}
            >
              [{systemCode}]
            </div>
            <div
              style={{
                font: "700 15px/1.2 " + t.dfont,
                color: V.ink,
                marginTop: "2px",
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  font: "400 11px/1.3 " + t.font,
                  color: V.ink2,
                  marginTop: "2px",
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
          <KInteractive
            as="button"
            onClick={onCancel}
            style={{
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              color: V.ink2,
              cursor: "pointer",
            }}
            aria-label="Close keypad"
          >
            <Icon name="x" size={18} />
          </KInteractive>
        </div>

        {/* Glowing Readout Display Well */}
        <div
          style={{
            padding: "12px 14px",
            background: V.bg || "#000",
            border: "1px solid " + V.outv,
            borderLeft: "4px solid " + (V.ok || V.pri),
            borderRadius: isLcars ? "0px" : "4px",
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              font: "700 12px/1 " + t.dfont,
              letterSpacing: ".12em",
              color: V.ink2,
            }}
          >
            {unitPosition === "prefix" ? unit : "AMOUNT"}
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span
              style={{
                font: "700 28px/1 " + (t.mfont || t.dfont),
                color: V.pri,
                letterSpacing: ".04em",
              }}
            >
              {value || "0"}
            </span>
            {unitPosition === "suffix" && (
              <span style={{ font: "600 12px/1 " + t.font, color: V.ink2 }}>
                {unit}
              </span>
            )}
          </div>
        </div>

        {/* Quick Amount Presets */}
        {presets && presets.length > 0 && (
          <div style={{ display: "flex", gap: "4px" }}>
            {presets.map((p) => (
              <KInteractive
                key={p}
                as="button"
                onClick={() => handlePreset(p)}
                style={{
                  flex: 1,
                  height: "32px",
                  background: Number(value) === p ? V.pri : V.surf2,
                  color:
                    Number(value) === p
                      ? ink(V.pri, [V.bg, V.onpri, V.ink])
                      : V.ink,
                  border: "1px solid " + (Number(value) === p ? V.pri : V.outv),
                  borderRadius: isLcars ? "0px" : "3px",
                  font: "700 10.5px/1 " + t.dfont,
                  letterSpacing: ".08em",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                +{p}
              </KInteractive>
            ))}
          </div>
        )}

        {/* 4x3 Block Matrix Keypad */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", gap: "4px" }}>
            {["7", "8", "9"].map((d) => (
              <KInteractive
                key={d}
                as="button"
                onClick={() => handleDigit(d)}
                style={keyStyle}
              >
                {d}
              </KInteractive>
            ))}
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {["4", "5", "6"].map((d) => (
              <KInteractive
                key={d}
                as="button"
                onClick={() => handleDigit(d)}
                style={keyStyle}
              >
                {d}
              </KInteractive>
            ))}
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {["1", "2", "3"].map((d) => (
              <KInteractive
                key={d}
                as="button"
                onClick={() => handleDigit(d)}
                style={keyStyle}
              >
                {d}
              </KInteractive>
            ))}
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {allowDecimal ? (
              <KInteractive
                as="button"
                onClick={() => handleDigit(".")}
                style={keyStyle}
              >
                .
              </KInteractive>
            ) : (
              <KInteractive
                as="button"
                onClick={handleClear}
                style={{
                  ...keyStyle,
                  fontSize: "12px",
                  letterSpacing: ".1em",
                  color: V.err || "#dc2626",
                }}
              >
                CLR
              </KInteractive>
            )}
            <KInteractive
              as="button"
              onClick={() => handleDigit("0")}
              style={keyStyle}
            >
              0
            </KInteractive>
            <KInteractive
              as="button"
              onClick={handleBackspace}
              style={{ ...keyStyle, fontSize: "14px", color: V.ink2 }}
              aria-label="Backspace"
            >
              <Icon name="delete" size={18} />
            </KInteractive>
          </div>
        </div>

        {/* Actions Footer */}
        <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
          <KInteractive as="button" onClick={onCancel} style={actionBtn(false)}>
            CANCEL
          </KInteractive>
          <KInteractive
            as="button"
            onClick={() => {
              if (numVal > 0 && onConfirm) onConfirm(numVal);
            }}
            style={actionBtn(true)}
            disabled={numVal <= 0}
          >
            CONFIRM
          </KInteractive>
        </div>
      </div>
    </div>
  );
}
