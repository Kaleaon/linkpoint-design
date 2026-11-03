import { useState, useRef, useMemo } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { subView } from "../theme/constants.js";
import { REGIONS, REGION_META } from "../data/content.js";
import Icon from "../components/Icon.jsx";

export default function Map() {
  const { state } = useApp();
  const { V, t, bleed, C } = useTheme();
  const [tileOk, setTileOk] = useState(true);

  // Viewport scale (zoom) and offset (pan)
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });

  // Search query & auto-completion state
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("Da Boom");
  const [targetCoords, setTargetCoords] = useState(null);

  const mini = subView(state, "Map") === "MINI";

  // Coordinate regex parser for forms like <112, 44, 51>, 112,44,51 or 112/44/51
  const parsedCoords = useMemo(() => {
    if (!query) return null;
    const match = query.match(/(?:<)?\s*(\d+)\s*[\s,\/]\s*(\d+)(?:\s*[\s,\/]\s*(\d+))?\s*(?:>)?/);
    if (match) {
      return `<${match[1]}, ${match[2]}, ${match[3] || 20}>`;
    }
    return null;
  }, [query]);

  // Generate suggestions matching query from REGION_META and REGIONS
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const results = [];

    // Check REGION_META
    Object.entries(REGION_META).forEach(([key, meta]) => {
      const matchKey = key.toLowerCase().includes(q);
      const matchName = meta.name.toLowerCase().includes(q);
      const matchCoords = meta.coords.toLowerCase().includes(q);
      if (matchKey || matchName || matchCoords) {
        if (!results.some(r => r.name === meta.name)) {
          results.push({
            name: meta.name,
            sub: meta.coords + " · " + meta.avatars,
            meta,
          });
        }
      }
    });

    // Check REGIONS
    REGIONS.forEach(([name, info]) => {
      if (name.toLowerCase().includes(q) || info.toLowerCase().includes(q)) {
        if (!results.some(r => r.name === name)) {
          results.push({
            name,
            sub: info,
          });
        }
      }
    });

    // If query parses as coordinates, add explicit coordinate jump option
    if (parsedCoords) {
      results.unshift({
        name: `Jump to coordinates ${parsedCoords}`,
        sub: "Coordinate search result",
        coords: parsedCoords,
        isCoord: true,
      });
    }

    return results;
  }, [query, parsedCoords]);

  // Pan offsets for regions in grid
  const regionOffsets = {
    "Da Boom": { x: 60, y: 60 },
    "Bay City — Hollywood": { x: -60, y: 60 },
    "Ahern": { x: 60, y: -60 },
    "Sansara Ridge": { x: -60, y: -60 },
  };

  const handleSelectSuggestion = (sug) => {
    if (sug.isCoord) {
      setQuery(sug.coords);
      setTargetCoords(sug.coords);
      setSelectedRegion("Coordinates: " + sug.coords);
      setPan({ x: -40, y: 40 });
    } else {
      setQuery(sug.name);
      setSelectedRegion(sug.name);
      const offset = regionOffsets[sug.name] || regionOffsets[sug.name.split("—")[0].trim()] || { x: -50, y: 30 };
      setPan(offset);
      if (sug.meta) {
        setTargetCoords(sug.meta.coords);
      } else {
        setTargetCoords(null);
      }
    }
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleSelectSuggestion(suggestions[0]);
      } else if (parsedCoords) {
        setTargetCoords(parsedCoords);
        setSelectedRegion("Coordinates: " + parsedCoords);
        setPan({ x: -40, y: 40 });
        setShowSuggestions(false);
      }
    }
  };

  // Zoom handlers (0.5x min to 3.0x max in 0.25x steps)
  const handleZoomIn = () => {
    setZoom(z => Math.min(3.0, +(z + 0.25).toFixed(2)));
  };

  const handleZoomOut = () => {
    setZoom(z => Math.max(0.5, +(z - 0.25).toFixed(2)));
  };

  const handleReset = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    setQuery("");
    setSelectedRegion("Da Boom");
    setTargetCoords(null);
    setShowSuggestions(false);
  };

  // Viewport drag pan handlers
  const handleMouseDown = (e) => {
    if (e.target.closest(".map-control-overlay")) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.target.closest(".map-control-overlay")) return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStartRef.current = { ...pan };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const mapBoxStyle = bleed
    ? { flex: 1, minHeight: 0, position: "relative", overflow: "hidden", background: V.surf, borderRadius: C.rad + "px 0 0 0" }
    : { flex: 1, minHeight: 0, margin: "2px 16px", position: "relative", overflow: "hidden", border: "1px solid " + V.outv, borderRadius: V.rp, background: V.surf };
  const mapFootStyle = { flex: "none", display: "flex", gap: "8px", padding: bleed ? "10px 0 10px 10px" : "12px 16px" };

  return (
    <>
      <div
        style={mapBoxStyle}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Floating Search Input Overlay */}
        <div className="map-control-overlay" style={{ position: "absolute", left: "10px", top: "10px", right: "64px", zIndex: 12 }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <div style={{ position: "absolute", left: "10px", color: V.ink2, pointerEvents: "none", display: "flex", alignItems: "center" }}>
              <Icon name="search" size={14} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleSearchSubmit}
              placeholder="Search region or <x, y, z>..."
              aria-label="Search map region or coordinates"
              style={{
                width: "100%",
                height: "36px",
                paddingLeft: "30px",
                paddingRight: query ? "28px" : "10px",
                borderRadius: V.rs,
                border: "1px solid " + V.outv,
                background: V.surf,
                color: V.ink,
                font: "400 11.5px/1 " + t.font,
                outline: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
              }}
            />
            {query ? (
              <div
                onClick={() => { setQuery(""); setShowSuggestions(false); }}
                style={{ position: "absolute", right: "8px", cursor: "pointer", color: V.ink2, display: "flex", alignItems: "center", padding: "2px" }}
                role="button"
                aria-label="Clear search"
                tabIndex={0}
              >
                <Icon name="x" size={14} />
              </div>
            ) : null}
          </div>

          {/* Auto-complete suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 ? (
            <div style={{
              position: "absolute",
              top: "40px",
              left: 0,
              right: 0,
              maxHeight: "180px",
              overflowY: "auto",
              background: V.surf2 || V.surf,
              border: "1px solid " + V.outv,
              borderRadius: V.rs,
              boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
              zIndex: 20,
            }}>
              {suggestions.map((sug, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSuggestion(sug)}
                  style={{
                    padding: "8px 10px",
                    borderBottom: idx < suggestions.length - 1 ? "1px solid " + V.outv : "none",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <span style={{ font: "600 11px/1.2 " + t.font, color: V.pri }}>{sug.name}</span>
                  <span style={{ font: "400 9.5px/1.2 " + t.font, color: V.ink2 }}>{sug.sub}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Dynamic Transformed Map Viewport Layer (Zoom + Pan) */}
        <div style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
          transition: isDragging ? "none" : "transform 0.15s ease-out",
          cursor: isDragging ? "grabbing" : "grab",
        }}>
          {/* Region Grid Ground */}
          <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr" }}>
            {(mini ? [] : REGIONS).map(([name, meta], i) => {
              const isSelected = selectedRegion && (selectedRegion === name || selectedRegion.includes(name));
              return (
                <div
                  key={name}
                  onClick={() => {
                    setSelectedRegion(name);
                    const offset = regionOffsets[name] || { x: 0, y: 0 };
                    setPan(offset);
                  }}
                  style={{
                    border: "1px solid " + V.outv,
                    display: "flex",
                    flexDirection: "column",
                    justify: "flex-end",
                    padding: "8px",
                    background: isSelected ? V.priC : V.surf2,
                    borderColor: isSelected ? V.pri : V.outv,
                    boxShadow: isSelected ? "inset 0 0 0 2px " + V.pri : "none",
                  }}
                >
                  <span style={{ font: "600 11px/1.25 " + t.font, color: V.ink, display: "block" }}>{name}</span>
                  <span style={{ font: "400 9.5px/1.25 " + t.font, color: V.ink2, display: "block" }}>{meta}</span>
                </div>
              );
            })}
          </div>

          {/* SL Map Tile Image Layer */}
          <div style={{ position: "absolute", inset: 0 }}>
            {tileOk ? (
              <img
                src="https://secondlife-maps-cdn.akamaized.net/map-1-1000-1000-objects.jpg"
                alt="Map Tile"
                onError={() => setTileOk(false)}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }}
              />
            ) : null}
          </div>

          {/* User / Target Marker Pin */}
          <div style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "14px",
            height: "14px",
            margin: "-7px 0 0 -7px",
            borderRadius: "7px",
            background: V.pri,
            border: "2px solid " + V.bg,
            boxShadow: "0 0 8px " + V.pri,
            zIndex: 5,
          }} />
        </div>

        {/* Minimap Position Readout Overlay (if subView is MINI) */}
        {mini ? (
          <div className="map-control-overlay" style={{ position: "absolute", left: "10px", top: "54px", zIndex: 10, display: "flex", flexDirection: "column", gap: "3px", background: V.surf, border: "1px solid " + V.outv, borderRadius: V.rs, padding: "8px 10px" }}>
            {[["REGION", selectedRegion || "Da Boom"], ["POSITION", targetCoords || "<128, 128, 26>"], ["HEADING", "214\u00b0 \u00b7 SW"], ["DRAW", state.prefs.draw]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: "12px", font: "400 10px/1.4 " + t.font, color: V.ink2 }}>
                <span style={{ width: "62px", flex: "none", letterSpacing: ".16em", color: V.pri }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        ) : null}

        {/* Floating Zoom and Pan Controls (Plus, Minus, Reset) */}
        <div className="map-control-overlay" style={{ position: "absolute", right: "10px", top: "10px", zIndex: 10, display: "flex", flexDirection: "column", gap: "6px" }}>
          <div
            onClick={handleZoomIn}
            style={{ width: "44px", height: "44px", border: "1px solid " + V.outv, borderRadius: V.rs, background: V.surf, display: "flex", alignItems: "center", justifyContent: "center", color: V.ink, cursor: "pointer" }}
            role="button"
            aria-label="Zoom in map"
            tabIndex={0}
          >
            <Icon name="plus" size={16} />
          </div>
          <div
            onClick={handleZoomOut}
            style={{ width: "44px", height: "44px", border: "1px solid " + V.outv, borderRadius: V.rs, background: V.surf, display: "flex", alignItems: "center", justifyContent: "center", color: V.ink, cursor: "pointer" }}
            role="button"
            aria-label="Zoom out map"
            tabIndex={0}
          >
            <Icon name="minus" size={16} />
          </div>
          <div
            onClick={handleReset}
            style={{ width: "44px", height: "44px", border: "1px solid " + V.outv, borderRadius: V.rs, background: V.surf, display: "flex", alignItems: "center", justifyContent: "center", color: V.pri, cursor: "pointer" }}
            role="button"
            aria-label="Recenter map viewport"
            tabIndex={0}
          >
            <Icon name="locate-fixed" size={16} />
          </div>
        </div>

        {/* Map Attribution and Zoom Status Note */}
        <div className="map-control-overlay" style={{ position: "absolute", left: "10px", bottom: "10px", zIndex: 10, font: "400 9.5px/1.35 " + t.font, color: V.ink2, background: V.surf, border: "1px solid " + V.outv, padding: "4px 6px", maxWidth: "74%" }}>
          {mini
            ? "minimap · north up · draw " + state.prefs.draw
            : tileOk
            ? `live SL map tile · zoom ${zoom.toFixed(2)}x`
            : "tile CDN unreachable — themed vector grid fallback"}
        </div>
      </div>

      {/* Map Action Footer */}
      <div style={mapFootStyle}>
        <div style={{ flex: 1, height: "46px", borderRadius: V.rs, background: V.pri, color: V.onpri, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", font: "700 12px/1 " + t.font, letterSpacing: ".2em", cursor: "pointer" }}>
          <Icon name="zap" size={16} />
          TELEPORT
        </div>
        <div style={{ width: "46px", height: "46px", border: "1px solid " + V.outv, borderRadius: V.rs, display: "flex", alignItems: "center", justifyContent: "center", color: V.pri, cursor: "pointer" }}>
          <Icon name="star" size={18} />
        </div>
      </div>
    </>
  );
}
