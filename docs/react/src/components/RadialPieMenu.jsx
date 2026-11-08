import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext.jsx";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";
import Icon from "./Icon.jsx";

const PIE_SLICES = [
  { id: "touch", label: "TOUCH", angle: -90, icon: "hand" },
  { id: "pay", label: "PAY", angle: -45, icon: "banknote" },
  { id: "profile", label: "PROFILE", angle: 0, icon: "user" },
  { id: "mute", label: "MUTE", angle: 45, icon: "volume-x" },
  { id: "inspect", label: "INSPECT", angle: 90, icon: "info" },
  { id: "track", label: "TRACK", angle: 135, icon: "map-pin" },
  { id: "take", label: "TAKE", angle: 180, icon: "package" },
  { id: "sit", label: "SIT", angle: -135, icon: "armchair" },
];

export default function RadialPieMenu({
  target = { name: "Sunset Lamp v3", type: "object" },
  x = 200,
  y = 200,
  onSelect = () => {},
  onClose = () => {},
}) {
  const { V, t, ink } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setHoveredIdx((cur) =>
          cur === null ? 0 : (cur + 1) % PIE_SLICES.length
        );
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setHoveredIdx((cur) =>
          cur === null
            ? PIE_SLICES.length - 1
            : (cur - 1 + PIE_SLICES.length) % PIE_SLICES.length
        );
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (hoveredIdx !== null) {
          onSelect(PIE_SLICES[hoveredIdx].id, target);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hoveredIdx, onSelect, onClose, target]);

  const outerR = 105;
  const innerR = 38;
  const size = (outerR + 10) * 2;
  const center = size / 2;

  // Compute SVG wedge path for 45-degree slice
  const getSlicePath = (midAngle) => {
    const startDeg = midAngle - 22.5;
    const endDeg = midAngle + 22.5;
    const startRad = (startDeg * Math.PI) / 180;
    const endRad = (endDeg * Math.PI) / 180;

    const x1 = center + innerR * Math.cos(startRad);
    const y1 = center + innerR * Math.sin(startRad);
    const x2 = center + outerR * Math.cos(startRad);
    const y2 = center + outerR * Math.sin(startRad);
    const x3 = center + outerR * Math.cos(endRad);
    const y3 = center + outerR * Math.sin(endRad);
    const x4 = center + innerR * Math.cos(endRad);
    const y4 = center + innerR * Math.sin(endRad);

    return `M ${x1} ${y1} L ${x2} ${y2} A ${outerR} ${outerR} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerR} ${innerR} 0 0 0 ${x1} ${y1} Z`;
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.35)",
        cursor: "default",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          transform: "translate(-50%, -50%)",
          width: `${size}px`,
          height: `${size}px`,
          userSelect: "none",
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{
            overflow: "visible",
            filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.6))",
          }}
        >
          {PIE_SLICES.map((slice, i) => {
            const isHovered = hoveredIdx === i;
            const midRad = (slice.angle * Math.PI) / 180;
            const labelR = (innerR + outerR) / 2;
            const lx = center + labelR * Math.cos(midRad);
            const ly = center + labelR * Math.sin(midRad);
            const path = getSlicePath(slice.angle);

            return (
              <g
                key={slice.id}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() =>
                  setHoveredIdx((cur) => (cur === i ? null : cur))
                }
                onClick={() => onSelect(slice.id, target)}
                style={{ cursor: "pointer" }}
              >
                <path
                  d={path}
                  fill={isHovered ? V.pri : V.surf}
                  stroke={isHovered ? V.pri : V.outv}
                  strokeWidth="1.5"
                  style={{
                    transition: reducedMotion
                      ? "none"
                      : "fill .12s ease, stroke .12s ease",
                  }}
                />
                <text
                  x={lx}
                  y={ly + 3}
                  textAnchor="middle"
                  fontFamily={t.dfont}
                  fontSize="9px"
                  fontWeight="700"
                  letterSpacing="0.1em"
                  fill={isHovered ? ink(V.pri, [V.bg, V.onpri, V.ink]) : V.ink}
                  style={{ pointerEvents: "none" }}
                >
                  {slice.label}
                </text>
              </g>
            );
          })}

          {/* Center Hub */}
          <circle
            cx={center}
            cy={center}
            r={innerR}
            fill={V.surf2}
            stroke={V.outv}
            strokeWidth="2"
            onClick={onClose}
            style={{ cursor: "pointer" }}
          />
        </svg>

        {/* Center Target Info */}
        <div
          onClick={onClose}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: `${innerR * 2 - 4}px`,
            height: `${innerR * 2 - 4}px`,
            borderRadius: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
            textAlign: "center",
            cursor: "pointer",
            pointerEvents: "none",
          }}
        >
          <Icon name="crosshair" size={14} style={{ color: V.pri }} />
          <span
            style={{
              font: "700 8.5px/1 " + t.dfont,
              color: V.ink,
              maxWidth: "60px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {target.name}
          </span>
          <span style={{ font: "500 7px/1 " + t.font, color: V.ink2 }}>
            CANCEL
          </span>
        </div>
      </div>
    </div>
  );
}
