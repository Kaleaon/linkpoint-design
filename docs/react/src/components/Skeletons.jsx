import { useThemeTokens } from "../context/ThemeContext.jsx";

function useSafeThemeTokens() {
  try {
    const tokens = useThemeTokens();
    if (tokens && tokens.V) return tokens;
  } catch (e) {
    // Context fallback for isolated component renders
  }
  return {
    V: {
      surf: "#111",
      surf2: "#222",
      outv: "#333",
      bg: "#000",
      pri: "#00f0ff",
      rs: "4px",
      rp: "50%",
    },
    LK: { card: "box", gap: "8px" },
    t: { font: "sans-serif", dfont: "sans-serif" },
  };
}

export function SkeletonCardList({ count = 5, style = {} }) {
  const { V, LK } = useSafeThemeTokens();

  const containerStyle = {
    flex: 1,
    minHeight: "320px",
    overflowY: "auto",
    padding: LK?.card === "flat" ? "0 12px 18px 0" : "2px 16px 18px",
    display: "flex",
    flexDirection: "column",
    gap: LK?.gap || "8px",
    boxSizing: "border-box",
    ...style,
  };

  const cardItems = Array.from({ length: count });

  return (
    <div data-testid="skeleton-card-list" style={containerStyle}>
      {cardItems.map((_, i) => (
        <div
          key={i}
          data-testid="skeleton-card-item"
          className="skeleton-shimmer"
          style={{
            background: V?.surf || "#111",
            border: "1px solid " + (V?.outv || "#333"),
            borderRadius: V?.rs || "4px",
            padding: "12px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxSizing: "border-box",
            minHeight: "64px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: V?.rp || "50%",
              background: V?.surf2 || "#222",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px", minWidth: 0 }}>
            <div
              style={{
                height: "14px",
                width: `${50 + (i % 3) * 15}%`,
                borderRadius: "3px",
                background: V?.surf2 || "#222",
              }}
            />
            <div
              style={{
                height: "10px",
                width: `${30 + (i % 2) * 20}%`,
                borderRadius: "3px",
                background: V?.surf2 || "#222",
              }}
            />
          </div>
          <div
            style={{
              width: "48px",
              height: "24px",
              borderRadius: V?.rs || "4px",
              background: V?.surf2 || "#222",
              flexShrink: 0,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTree({ count = 7, style = {} }) {
  const { V } = useSafeThemeTokens();

  const containerStyle = {
    flex: 1,
    minHeight: "320px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "8px 16px",
    boxSizing: "border-box",
    ...style,
  };

  const depths = [0, 0, 1, 1, 2, 0, 1];

  return (
    <div data-testid="skeleton-tree" style={containerStyle}>
      {Array.from({ length: count }).map((_, i) => {
        const depth = depths[i % depths.length];
        return (
          <div
            key={i}
            data-testid="skeleton-tree-row"
            className="skeleton-shimmer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              paddingLeft: `${12 + depth * 18}px`,
              borderBottom: "1px solid " + (V?.outv || "#333"),
              boxSizing: "border-box",
              minHeight: "42px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                background: V?.surf2 || "#222",
                flexShrink: 0,
              }}
            />
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "3px",
                background: V?.surf2 || "#222",
                flexShrink: 0,
              }}
            />
            <div
              style={{
                height: "12px",
                width: `${40 + (i % 4) * 12}%`,
                borderRadius: "3px",
                background: V?.surf2 || "#222",
                flex: "none",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export function SkeletonDetail({ style = {} }) {
  const { V } = useSafeThemeTokens();

  const containerStyle = {
    flex: "none",
    width: "100%",
    minHeight: "320px",
    height: "100%",
    background: V?.surf || "#111",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    borderLeft: "1px solid " + (V?.outv || "#333"),
    ...style,
  };

  return (
    <div data-testid="skeleton-detail" style={containerStyle}>
      <div
        data-testid="skeleton-detail-header"
        className="skeleton-shimmer"
        style={{
          padding: "14px 16px 10px",
          borderBottom: "1px solid " + (V?.outv || "#333"),
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            height: "16px",
            width: "55%",
            borderRadius: "3px",
            background: V?.surf2 || "#222",
          }}
        />
        <div
          style={{
            height: "11px",
            width: "35%",
            borderRadius: "3px",
            background: V?.surf2 || "#222",
            marginTop: "6px",
          }}
        />
      </div>

      <div
        data-testid="skeleton-detail-body"
        style={{
          flex: 1,
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          overflowY: "auto",
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="skeleton-shimmer"
            style={{
              border: "1px solid " + (V?.outv || "#333"),
              borderRadius: V?.rs || "4px",
              padding: "10px",
              background: V?.bg || "#000",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                height: "10px",
                width: "25%",
                borderRadius: "2px",
                background: V?.surf2 || "#222",
              }}
            />
            <div
              style={{
                height: "13px",
                width: `${60 + (i % 3) * 15}%`,
                borderRadius: "3px",
                background: V?.surf2 || "#222",
              }}
            />
          </div>
        ))}
      </div>

      <div
        data-testid="skeleton-detail-footer"
        className="skeleton-shimmer"
        style={{
          padding: "12px",
          borderTop: "1px solid " + (V?.outv || "#333"),
          display: "flex",
          gap: "8px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            flex: 1,
            height: "42px",
            borderRadius: V?.rs || "4px",
            background: V?.bg || "#000",
            border: "1px solid " + (V?.outv || "#333"),
          }}
        />
        <div
          style={{
            width: "44px",
            height: "42px",
            borderRadius: V?.rs || "4px",
            background: V?.surf2 || "#222",
            flexShrink: 0,
          }}
        />
      </div>
    </div>
  );
}

export default {
  SkeletonCardList,
  SkeletonTree,
  SkeletonDetail,
};
