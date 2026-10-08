import { useRef } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { INVENTORY_SOURCE, INVENTORY_FOLDERS, INVENTORY_RECENTS } from "../data/content.js";
import Icon from "../components/Icon.jsx";
import KInteractive from "../components/KInteractive.jsx";
import { subView } from "../theme/constants.js";

// Ported from the `isTree` <sc-if> block: search/grid toolbar, recent-items
// strip, and the folder tree with multi-selection batch action bar support.
export default function Inventory() {
  const { state, actions } = useApp();
  const { V, t, bleed, pad, C } = useTheme();

  const timerRef = useRef(null);
  const isLongPressRef = useRef(false);

  const invToolStyle = { flex: "none", display: "flex", gap: "8px", padding: bleed ? "0 0 8px 10px" : "2px 16px 10px" };
  const invRecentStyle = { flex: "none", display: "flex", gap: "8px", overflowX: "auto", padding: bleed ? "0 0 8px 10px" : "0 16px 10px" };
  const invListStyle = { flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: bleed ? C.gap + "px" : 0, background: bleed ? V.bg : "transparent" };

  const curSub = subView(state, "Inventory");
  const rawItems = state.invItems || INVENTORY_SOURCE.map(([name, icon, depth, parent, ver, tags]) => ({ name, icon, depth, parent, ver, tags: tags || [] }));

  const all = rawItems.map((item) => {
    const { name, icon, depth, parent, ver, tags } = item;
    const isFolder = INVENTORY_FOLDERS.includes(name);
    const open = state.invOpen[name] !== false;
    const isSelected = (state.invSelected || []).includes(name);
    return { name, icon, ver, parent, depth, isFolder, open, isSelected, tags: tags || [], chev: isFolder ? (open ? "chevron-down" : "chevron-right") : "dot" };
  });

  const nodes = curSub === "ALL"
    ? all.filter((n) => n.depth === 0 || (n.parent && state.invOpen[n.parent] !== false))
    : all.filter((n) => n.tags.includes(curSub.toLowerCase())).map((n) => ({ ...n, depth: 0, isFolder: false, chev: "dot" }));

  const handlePointerDown = (n) => {
    if (n.isFolder) return;
    isLongPressRef.current = false;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      actions.invLongPressItem(n.name);
    }, 450);
  };

  const handlePointerUpOrLeave = () => {
    clearTimeout(timerRef.current);
  };

  const handleRowClick = (n) => {
    if (isLongPressRef.current) {
      isLongPressRef.current = false;
      return;
    }
    if (n.isFolder) {
      actions.toggleInvFolder(n.name);
    } else if (state.invSelectMode) {
      actions.toggleInvSelectedItem(n.name);
    } else {
      actions.notify(n.name + " — OPEN");
    }
  };

  const hasSelected = (state.invSelected || []).length > 0;
  const targetFolders = INVENTORY_FOLDERS.filter((f) => f !== "Inventory");

  return (
    <>
      <div style={invToolStyle}>
        <div style={{ flex: 1, height: "44px", display: "flex", alignItems: "center", gap: "8px", padding: "0 10px", border: "1px solid " + V.outv, borderRadius: V.rs, background: V.surf }}>
          <Icon name="search" size={15} style={{ opacity: 0.55 }} />
          <span style={{ font: "400 12px/1 " + t.font, color: V.ink2 }}>filter inventory…</span>
        </div>
        <div
          onClick={actions.toggleInvSelectMode}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); actions.toggleInvSelectMode(); } }}
          style={{
            width: "44px", height: "44px", border: "1px solid " + (state.invSelectMode ? V.pri : V.outv),
            borderRadius: V.rs, display: "flex", alignItems: "center", justifyContent: "center",
            color: state.invSelectMode ? V.onpri : V.pri, background: state.invSelectMode ? V.pri : "transparent",
            cursor: "pointer"
          }}
          role="button" aria-label="Toggle selection mode" tabIndex={0}
        >
          <Icon name="check-square" size={17} />
        </div>
        <div style={{ width: "44px", height: "44px", border: "1px solid " + V.outv, borderRadius: V.rs, display: "flex", alignItems: "center", justifyContent: "center", color: V.pri }}>
          <Icon name="layout-grid" size={17} />
        </div>
      </div>

      <div style={invRecentStyle}>
        {INVENTORY_RECENTS.map((ir) => (
          <div key={ir} style={{ flex: "none", width: "62px" }}>
            <div style={{ height: "62px", border: "1px solid " + V.outv, background: "repeating-linear-gradient(135deg, var(--md-sys-color-surface-variant, var(--ktheme-surf2)) 0 6px, var(--md-sys-color-surface, var(--ktheme-surf)) 6px 12px)" }} />
            <div style={{ font: "400 9px/1.3 " + t.font, color: V.ink2, marginTop: "4px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{ir}</div>
          </div>
        ))}
      </div>

      <div style={invListStyle}>
        {nodes.map((n) => {
          const indent = bleed
            ? { display: "flex", alignItems: "center", gap: "8px", padding: pad + " 12px", paddingLeft: 10 + n.depth * 16 + "px", background: n.isSelected ? V.priC : V.surf, borderLeft: "4px solid " + (n.isSelected ? V.pri : n.depth === 0 ? V.pri : n.depth === 1 ? V.sec2 : "transparent"), cursor: "pointer" }
            : { display: "flex", alignItems: "center", gap: "8px", padding: pad + " 16px", paddingLeft: 16 + n.depth * 18 + "px", background: n.isSelected ? V.priC : "transparent", borderBottom: "1px solid " + V.outv, cursor: "pointer" };
          return (
            <KInteractive
              key={n.name}
              onClick={() => handleRowClick(n)}
              onPointerDown={() => handlePointerDown(n)}
              onPointerUp={handlePointerUpOrLeave}
              onPointerLeave={handlePointerUpOrLeave}
              label={n.name}
              style={indent}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleRowClick(n); } }}
              role="button" aria-label={n.name} tabIndex={0}
            >
              {state.invSelectMode && !n.isFolder && (
                <Icon name={n.isSelected ? "check-square" : "square"} size={16} style={{ color: V.pri, flexShrink: 0 }} />
              )}
              <Icon name={n.chev} size={16} style={{ color: V.pri, flexShrink: 0 }} />
              <Icon name={n.icon} size={16} style={{ color: V.sec2, flexShrink: 0 }} />
              <span style={{ flex: 1, font: "400 13px/1.2 " + t.font, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{n.name}</span>
              <span style={{ font: "400 10px/1 " + t.font, color: V.ink2 }}>{n.ver}</span>
            </KInteractive>
          );
        })}
      </div>

      {hasSelected && (
        <div style={{ margin: bleed ? "8px 10px 10px" : "8px 16px 12px", padding: "10px", border: "1px solid " + V.pri, borderRadius: V.rs, background: V.surf2, boxShadow: "0 6px 20px rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ font: "700 11px/1 " + t.font, color: V.pri, letterSpacing: ".12em" }}>{state.invSelected.length} SELECTED</span>
            <span onClick={actions.toggleInvSelectMode} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); actions.toggleInvSelectMode(); } }} style={{ font: "600 10px/1 " + t.font, color: V.ink2, cursor: "pointer" }} role="button" tabIndex={0}>CANCEL</span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <div
              onClick={actions.invWearSelected}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); actions.invWearSelected(); } }}
              style={{ flex: 1, height: "44px", borderRadius: V.rs, background: V.pri, color: V.onpri, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", font: "700 11px/1 " + t.font, letterSpacing: ".1em", cursor: "pointer" }}
              role="button" tabIndex={0}
            >
              <Icon name="shirt" size={16} /> WEAR
            </div>
            <div
              onClick={actions.invOpenMoveModal}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); actions.invOpenMoveModal(); } }}
              style={{ flex: 1, height: "44px", border: "1px solid " + V.outv, borderRadius: V.rs, background: V.surf, color: V.ink, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", font: "700 11px/1 " + t.font, letterSpacing: ".1em", cursor: "pointer" }}
              role="button" tabIndex={0}
            >
              <Icon name="folder-input" size={16} /> MOVE TO…
            </div>
            <div
              onClick={actions.invDeleteSelected}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); actions.invDeleteSelected(); } }}
              style={{ flex: 1, height: "44px", border: "1px solid " + V.outv, borderRadius: V.rs, background: "rgba(207,102,121,0.15)", color: V.err || "var(--md-sys-color-error, var(--ktheme-err))", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", font: "700 11px/1 " + t.font, letterSpacing: ".1em", cursor: "pointer" }}
              role="button" tabIndex={0}
            >
              <Icon name="trash-2" size={16} /> DELETE
            </div>
          </div>
        </div>
      )}

      {state.invMoveModal && (
        <div style={{ margin: bleed ? "8px 10px 10px" : "8px 16px 12px", padding: "12px", border: "1px solid " + V.pri, borderRadius: V.rs, background: V.surf2, display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ font: "700 11px/1 " + t.font, color: V.pri, letterSpacing: ".12em" }}>MOVE TO FOLDER</span>
            <span onClick={actions.invCloseMoveModal} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); actions.invCloseMoveModal(); } }} style={{ font: "600 10px/1 " + t.font, color: V.ink2, cursor: "pointer" }} role="button" tabIndex={0}>CANCEL</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {targetFolders.map((folder) => (
              <div
                key={folder}
                onClick={() => actions.invMoveSelected(folder)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); actions.invMoveSelected(folder); } }}
                style={{ height: "44px", padding: "0 12px", border: "1px solid " + V.outv, borderRadius: V.rs, background: V.surf, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                role="button" tabIndex={0}
              >
                <Icon name="folder" size={16} style={{ color: V.sec2 }} />
                <span style={{ font: "600 12px/1 " + t.font, color: V.ink }}>{folder}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
