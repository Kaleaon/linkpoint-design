import { useMemo } from "react";
import { useTheme } from "../context/ThemeContext.jsx";

/**
 * SegmentedMeter — Authentic 24th-century LCARS / Cyberpunk discrete tick bar meter.
 * Displays quantitative telemetry as chunky, discrete level indicator blocks with
 * threshold color shifting (nominal -> cautionary -> critical alert).
 */
export default function SegmentedMeter({
  value = 0,
  max = 100,
  segments = 20,
  height = 10,
  gap = 2,
  activeColor,
  inactiveColor,
  warnThreshold = 0.70,
  dangerThreshold = 0.90,
  label = "Level meter",
  showReadout = false,
  readoutFormat,
  systemCode,
  style,
}) {
  const { V, t, LK } = useTheme();

  const safeVal = Math.max(0, Number(value) || 0);
  const safeMax = Math.max(1, Number(max) || 100);
  const ratio = Math.min(1, safeVal / safeMax);
  const percent = Math.round(ratio * 100);

  // Discrete active block count
  const activeCount = Math.round(ratio * segments);

  // Dynamic threshold color
  const computedActiveColor = useMemo(() => {
    if (activeColor) return activeColor;
    if (ratio >= dangerThreshold) return V.err || "#ef4444";
    if (ratio >= warnThreshold) return V.sec2 || V.warn || "#f59e0b";
    return V.pri || "#3b82f6";
  }, [activeColor, ratio, dangerThreshold, warnThreshold, V]);

  const blockBg = inactiveColor || V.surf2 || "rgba(255,255,255,0.08)";
  const isPill = LK?.card === "soft" || V.rs === "999px";
  const blockRadius = LK?.card === "cap" || LK?.card === "flat" || LK?.card === "chamfer" ? "0px" : "1px";

  const defaultReadout = `${safeVal.toLocaleString()} / ${safeMax.toLocaleString()} (${percent}%)`;
  const readoutText = readoutFormat ? readoutFormat(safeVal, safeMax, percent) : defaultReadout;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        width: "100%",
        ...style,
      }}
    >
      {(showReadout || systemCode) && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
          {systemCode && (
            <span
              style={{
                font: "700 9px/1 " + t.dfont,
                letterSpacing: ".16em",
                color: V.sec2 || V.pri,
                textTransform: "uppercase",
              }}
            >
              {systemCode}
            </span>
          )}
          {showReadout && (
            <span
              style={{
                font: "600 11px/1 " + (t.mfont || t.font),
                color: V.ink,
                marginLeft: "auto",
              }}
            >
              {readoutText}
            </span>
          )}
        </div>
      )}

      {/* Discrete Segmented Tick Blocks */}
      <div
        role="meter"
        aria-valuenow={safeVal}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-label={label}
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: `${gap}px`,
          width: "100%",
          height: `${height}px`,
          background: "transparent",
        }}
      >
        {Array.from({ length: segments }).map((_, i) => {
          const isActive = i < activeCount;
          // Per-tick color shift for critical alert threshold when near max
          let tickColor = blockBg;
          if (isActive) {
            const tickRatio = (i + 1) / segments;
            if (tickRatio >= dangerThreshold) {
              tickColor = V.err || "#ef4444";
            } else if (tickRatio >= warnThreshold) {
              tickColor = V.sec2 || V.warn || "#f59e0b";
            } else {
              tickColor = activeColor || V.pri;
            }
          }

          return (
            <div
              key={i}
              style={{
                flex: 1,
                minWidth: "2px",
                height: "100%",
                background: tickColor,
                borderRadius: blockRadius,
                opacity: isActive ? 1 : 0.45,
                transition: "background-color 0.15s ease, opacity 0.15s ease",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
