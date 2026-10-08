import { useState, useRef, useCallback } from "react";
import { useThemeTokens } from "../context/ThemeContext.jsx";
import { useApp } from "../context/AppContext.jsx";
import Card from "./Card.jsx";
import Icon from "./Icon.jsx";
import { SkeletonCardList } from "./Skeletons.jsx";

// Ported from `cardListStyle` in renderVals() — the scrollable column that
// Friends/Groups/Notices/Teleport/Settings/Diagnostics all share.
// Enhanced with pull-to-refresh swipe gesture detection for balance sync.
export default function CardList({ cards }) {
  const { LK, V, t } = useThemeTokens();
  const { state, actions } = useApp();

  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const containerRef = useRef(null);
  const touchStartYRef = useRef(0);
  const isPullingRef = useRef(false);

  const isLoading = state?.cond === "loading";

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length !== 1) return;
    const scrollTop = containerRef.current ? containerRef.current.scrollTop : 0;
    if (scrollTop <= 0) {
      touchStartYRef.current = e.touches[0].clientY;
      isPullingRef.current = true;
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isPullingRef.current) return;
    const scrollTop = containerRef.current ? containerRef.current.scrollTop : 0;
    if (scrollTop > 0) {
      isPullingRef.current = false;
      setPullDistance(0);
      return;
    }
    const dy = e.touches[0].clientY - touchStartYRef.current;
    if (dy > 0) {
      const distance = Math.min(Math.pow(dy, 0.8) * 1.8, 80);
      setPullDistance(distance);
    } else {
      setPullDistance(0);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isPullingRef.current) return;
    isPullingRef.current = false;
    if (pullDistance > 40 && !refreshing) {
      setRefreshing(true);
      if (actions && typeof actions.refreshBalance === "function") {
        actions.refreshBalance();
      }
      setTimeout(() => {
        setRefreshing(false);
        setPullDistance(0);
      }, 700);
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, refreshing, actions]);

  if (isLoading) {
    return <SkeletonCardList style={{ minHeight: "320px" }} />;
  }

  const style = {
    flex: 1,
    minHeight: "320px",
    overflowY: "auto",
    padding: LK?.card === "flat" ? "0 12px 18px 0" : "2px 16px 18px",
    display: "flex",
    flexDirection: "column",
    gap: LK?.gap || "8px",
    maxWidth: LK?.measure || "none",
    boxSizing: "border-box",
    position: "relative",
  };

  const showIndicator = pullDistance > 0 || refreshing;
  const indicatorHeight = refreshing ? 44 : Math.min(pullDistance, 48);

  return (
    <div
      ref={containerRef}
      style={style}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {showIndicator && (
        <div
          data-testid="pull-to-refresh-indicator"
          style={{
            flex: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            height: `${indicatorHeight}px`,
            overflow: "hidden",
            transition: refreshing ? "height 0.2s ease" : "none",
            color: V ? V.pri : "#00f0ff",
            fontSize: "12px",
            fontWeight: "600",
            fontFamily: t ? t.font : "sans-serif",
            borderBottom: "1px dashed " + (V ? V.outv : "#333"),
            marginBottom: "4px",
          }}
        >
          <Icon
            name="refresh-cw"
            size={16}
            style={{
              transform: `rotate(${pullDistance * 5}deg)`,
              transition: refreshing ? "transform 0.8s linear infinite" : "none",
            }}
          />
          <span>{refreshing ? "Syncing balance..." : pullDistance > 40 ? "Release to sync" : "Pull to sync balance"}</span>
        </div>
      )}
      {cards.map((c, i) => (
        <Card key={i} c={c} />
      ))}
    </div>
  );
}
