with open("docs/index.html", "r", encoding="utf-8") as f:
    code = f.read()

# Replace floaters mapping block in index.html
old_floaters_block = """      floaters: FLOATERS.filter(f => s.flOpen[f.id] && !s.flMin[f.id]).map(f => {
        const r = this.flR(f.id), act = f.id === scr;
        return {
          title: f.title, icon: f.icon,
          rows: act ? null : (FBODY[f.id] || []).map(x => ({ a: x.a, b: x.b, style: fRow,
            aStyle: { flex: 1, minWidth: 0, font: "400 11.5px/1.2 " + t.font, color: V.ink,
              overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" },
            bStyle: { flex: "none", font: "400 10px/1 " + t.font, color: V.ink2 } })),
          focus: () => this.flFocus(f.id),
          drag: (e) => this.flDrag(f.id, e, "move"),
          resize: (e) => this.flDrag(f.id, e, "size"),
          min: (e) => { e.stopPropagation(); this.setState(st => ({ flMin: { ...st.flMin, [f.id]: true } })); },
          close: (e) => { e.stopPropagation(); this.flClose(f.id); },
          style: { position: "absolute", left: r.x + "px", top: r.y + "px", width: r.w + "px", height: r.h + "px",
            zIndex: 10 + Math.max(0, s.flZ.indexOf(f.id)), display: "flex", flexDirection: "column", background: V.surf,
            border: "1px solid " + (act ? V.pri : V.outv), borderRadius: V.rp, overflow: "hidden",
            boxShadow: act ? "0 16px 44px rgba(0,0,0,.58)" : "0 6px 18px rgba(0,0,0,.34)" },
          barStyle: { flex: "none", height: FBAR + "px", display: "flex", alignItems: "center", gap: "7px", padding: "0 5px 0 9px",
            background: act ? V.pri : V.surf2, color: act ? this.ink(V.pri, [V.bg, V.onpri, V.ink]) : V.ink2,
            font: "600 10px/1 " + t.dfont, letterSpacing: ".12em", cursor: "move", userSelect: "none", touchAction: "none" },
          btnStyle: { width: "17px", height: "17px", flex: "none", display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid currentColor", borderRadius: V.rs, font: "600 11px/1 " + t.font, cursor: "pointer", opacity: .75 },
          bodyStyle: { flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1px", background: V.bg },
          gripStyle: { position: "absolute", right: 0, bottom: 0, width: "15px", height: "15px", cursor: "nwse-resize",
            background: "linear-gradient(135deg,transparent 0 52%," + (act ? V.pri : V.outv) + " 52% 100%)" },
        };
      }),"""

new_floaters_block = """      floaters: FLOATERS.filter(f => s.flOpen[f.id] && !s.flMin[f.id]).map(f => {
        const r = this.flR(f.id), act = f.id === scr;
        const isSweepDesk = isFloat && (s.layout === "sweep" || t.nav === "SWEEP");
        return {
          title: f.title, icon: f.icon, isSweep: isSweepDesk,
          elbowCapStyle: { display: "flex", alignItems: "center", height: "100%", padding: "0 8px", background: act ? V.sec : V.sec2, color: act ? V.bg : V.onsec, borderRadius: "18px 0 10px 0", font: "700 9.5px/1 " + t.dfont, letterSpacing: ".1em", flex: "none", marginRight: "4px" },
          elbowText: act ? "LCARS" : "SYS",
          rows: act ? null : (FBODY[f.id] || []).map(x => ({ a: x.a, b: x.b, style: fRow,
            aStyle: { flex: 1, minWidth: 0, font: "400 11.5px/1.2 " + t.font, color: V.ink,
              overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" },
            bStyle: { flex: "none", font: "400 10px/1 " + t.font, color: V.ink2 } })),
          focus: () => this.flFocus(f.id),
          drag: (e) => this.flDrag(f.id, e, "move"),
          resize: (e) => this.flDrag(f.id, e, "size"),
          min: (e) => { e.stopPropagation(); this.setState(st => ({ flMin: { ...st.flMin, [f.id]: true } })); },
          close: (e) => { e.stopPropagation(); this.flClose(f.id); },
          style: { position: "absolute", left: r.x + "px", top: r.y + "px", width: r.w + "px", height: r.h + "px",
            zIndex: 10 + Math.max(0, s.flZ.indexOf(f.id)), display: "flex", flexDirection: "column", background: V.surf,
            border: (isSweepDesk ? "2px solid " : "1px solid ") + (act ? V.pri : V.outv),
            borderRadius: isSweepDesk ? "22px 22px 14px 14px" : V.rp, overflow: "hidden",
            boxShadow: act ? "0 18px 48px rgba(0,0,0,.65)" : "0 6px 18px rgba(0,0,0,.34)" },
          barStyle: { flex: "none", height: FBAR + "px", display: "flex", alignItems: "center", gap: "7px",
            padding: isSweepDesk ? "0 5px 0 0" : "0 5px 0 9px",
            background: act ? V.pri : V.surf2, color: act ? this.ink(V.pri, [V.bg, V.onpri, V.ink]) : V.ink2,
            font: "700 10.5px/1 " + t.dfont, letterSpacing: ".14em", cursor: "move", userSelect: "none", touchAction: "none" },
          btnStyle: { width: "17px", height: "17px", flex: "none", display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid " + (isSweepDesk && act ? V.sec : "currentColor"),
            borderRadius: isSweepDesk ? "999px" : V.rs,
            background: isSweepDesk && act ? V.sec : "transparent",
            color: isSweepDesk && act ? V.bg : "inherit",
            font: "700 11px/1 " + t.dfont, cursor: "pointer", opacity: .85 },
          bodyStyle: { flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1px", background: V.bg },
          gripStyle: { position: "absolute", right: 0, bottom: 0, width: "15px", height: "15px", cursor: "nwse-resize",
            background: "linear-gradient(135deg,transparent 0 52%," + (act ? V.pri : V.outv) + " 52% 100%)" },
        };
      }),"""

if old_floaters_block in code:
    code = code.replace(old_floaters_block, new_floaters_block, 1)
    print("Successfully replaced floaters logic in index.html!")
else:
    print("Warning: old_floaters_block not found in index.html")

# Also update fmBar, flTaskbar, flQuickInputStyle, flQuickBtnStyle, camHudOverlayStyle
old_fmbar = """      fmBar: { flex: "none", display: "flex", alignItems: "stretch", height: "28px", padding: "0 8px",
        background: V.surf, borderBottom: "1px solid " + V.outv, position: "relative", zIndex: 80 },"""

new_fmbar = """      fmBar: { flex: "none", display: "flex", alignItems: "stretch", height: "28px", padding: "0 8px",
        background: V.surf, borderBottom: (isFloat && (s.layout === "sweep" || t.nav === "SWEEP")) ? "2px solid " + V.pri : "1px solid " + V.outv, position: "relative", zIndex: 80 },"""

if old_fmbar in code:
    code = code.replace(old_fmbar, new_fmbar, 1)
    print("Successfully replaced fmBar style in index.html!")

# Update fmMenus items style
old_fmmenu_item = """          style: { display: "flex", alignItems: "center", padding: "0 10px", cursor: "pointer", position: "relative",
            background: open ? V.pri : "transparent", color: open ? this.ink(V.pri, [V.bg, V.onpri, V.ink]) : V.ink,
            font: "500 11px/1 " + t.font, letterSpacing: ".04em", borderRadius: V.rs },"""

new_fmmenu_item = """          style: { display: "flex", alignItems: "center", padding: "0 10px", cursor: "pointer", position: "relative",
            background: open ? V.pri : "transparent", color: open ? this.ink(V.pri, [V.bg, V.onpri, V.ink]) : V.ink,
            font: (isFloat && (s.layout === "sweep" || t.nav === "SWEEP")) ? "700 11px/1 " + t.dfont : "500 11px/1 " + t.font,
            letterSpacing: (isFloat && (s.layout === "sweep" || t.nav === "SWEEP")) ? ".12em" : ".04em",
            borderRadius: (isFloat && (s.layout === "sweep" || t.nav === "SWEEP")) ? "999px" : V.rs },"""

if old_fmmenu_item in code:
    code = code.replace(old_fmmenu_item, new_fmmenu_item, 1)
    print("Successfully replaced fmMenu item style in index.html!")

# Update flTaskbar
old_fltaskbar = """      flTaskbar: { position: "absolute", left: 0, right: 0, bottom: 0, height: "40px", display: "flex", alignItems: "center", gap: "4px",
        padding: "0 8px", background: V.surf, borderTop: "1px solid " + V.outv, zIndex: 60 },"""

new_fltaskbar = """      flTaskbar: { position: "absolute", left: 0, right: 0, bottom: 0, height: "40px", display: "flex", alignItems: "center", gap: "4px",
        padding: "0 8px", background: V.surf, borderTop: (isFloat && (s.layout === "sweep" || t.nav === "SWEEP")) ? "2px solid " + V.pri : "1px solid " + V.outv, zIndex: 60 },"""

if old_fltaskbar in code:
    code = code.replace(old_fltaskbar, new_fltaskbar, 1)
    print("Successfully replaced flTaskbar style in index.html!")

# Update flTasks style
old_fltasks = """          style: { flex: "none", height: "26px", display: "flex", alignItems: "center", padding: "0 10px", cursor: "pointer",
            background: act ? V.pri : (min ? "transparent" : V.surf2),
            color: act ? this.ink(V.pri, [V.bg, V.onpri, V.ink]) : V.ink2,
            border: "1px solid " + (min ? V.outv : "transparent"), borderRadius: V.rs, font: "500 10px/1 " + t.font,
            letterSpacing: ".08em", whiteSpace: "nowrap" } };"""

new_fltasks = """          style: { flex: "none", height: "26px", display: "flex", alignItems: "center", padding: "0 10px", cursor: "pointer",
            background: act ? V.pri : (min ? "transparent" : V.surf2),
            color: act ? this.ink(V.pri, [V.bg, V.onpri, V.ink]) : V.ink2,
            border: "1px solid " + (min ? V.outv : "transparent"),
            borderRadius: (isFloat && (s.layout === "sweep" || t.nav === "SWEEP")) ? "999px" : V.rs,
            font: (isFloat && (s.layout === "sweep" || t.nav === "SWEEP")) ? "700 10px/1 " + t.dfont : "500 10px/1 " + t.font,
            letterSpacing: (isFloat && (s.layout === "sweep" || t.nav === "SWEEP")) ? ".12em" : ".08em", whiteSpace: "nowrap" } };"""

if old_fltasks in code:
    code = code.replace(old_fltasks, new_fltasks, 1)
    print("Successfully replaced flTasks style in index.html!")

# Update flTools style
old_fltools = """          style: { flex: "none", height: "26px", display: "flex", alignItems: "center", gap: "6px", padding: "0 9px",
            background: dis ? "transparent" : bg, color: dis ? V.ink2 : this.ink(bg, [V.bg, V.onpri, V.ink]),
            border: "1px solid " + (dis ? V.outv : "transparent"), borderRadius: V.rs, cursor: dis ? "not-allowed" : "pointer",
            font: "600 9.5px/1 " + t.dfont, letterSpacing: ".1em", whiteSpace: "nowrap" } };"""

new_fltools = """          style: { flex: "none", height: "26px", display: "flex", alignItems: "center", gap: "6px", padding: "0 9px",
            background: dis ? "transparent" : bg, color: dis ? V.ink2 : this.ink(bg, [V.bg, V.onpri, V.ink]),
            border: "1px solid " + (dis ? V.outv : "transparent"),
            borderRadius: (isFloat && (s.layout === "sweep" || t.nav === "SWEEP")) ? "999px" : V.rs,
            cursor: dis ? "not-allowed" : "pointer",
            font: "600 9.5px/1 " + t.dfont, letterSpacing: ".1em", whiteSpace: "nowrap" } };"""

if old_fltools in code:
    code = code.replace(old_fltools, new_fltools, 1)
    print("Successfully replaced flTools style in index.html!")

# Update flQuickInputStyle and flQuickBtnStyle
old_quick = """      flQuickInputStyle: { width: "100%", height: "26px", padding: "0 8px", background: V.bg, color: V.ink,
        border: "1px solid " + V.outv, borderRadius: V.rs, font: "400 11px/1 " + t.font, outline: "none" },
      flQuickBtnStyle: { height: "26px", padding: "0 10px", background: V.pri, color: this.ink(V.pri, [V.bg, V.onpri, V.ink]),
        border: "none", borderRadius: V.rs, font: "600 9.5px/1 " + t.dfont, letterSpacing: ".08em", cursor: "pointer", flex: "none" },"""

new_quick = """      flQuickInputStyle: { width: "100%", height: "26px", padding: "0 8px", background: V.bg, color: V.ink,
        border: "1px solid " + V.outv, borderRadius: (isFloat && (s.layout === "sweep" || t.nav === "SWEEP")) ? "999px" : V.rs, font: "400 11px/1 " + t.font, outline: "none" },
      flQuickBtnStyle: { height: "26px", padding: "0 10px", background: V.pri, color: this.ink(V.pri, [V.bg, V.onpri, V.ink]),
        border: "none", borderRadius: (isFloat && (s.layout === "sweep" || t.nav === "SWEEP")) ? "999px" : V.rs,
        font: "700 9.5px/1 " + t.dfont, letterSpacing: ".12em", cursor: "pointer", flex: "none" },"""

if old_quick in code:
    code = code.replace(old_quick, new_quick, 1)
    print("Successfully replaced flQuick style in index.html!")

# Update camHudBtnStyle and camHudOverlayStyle
old_cam = """      camHudBtnStyle: { flex: "none", height: "26px", display: "flex", alignItems: "center", gap: "4px", padding: "0 8px",
        background: s.showCamHud ? V.pri : V.surf2, color: s.showCamHud ? this.ink(V.pri, [V.bg, V.onpri, V.ink]) : V.ink2,
        border: "1px solid " + (s.showCamHud ? V.pri : V.outv), borderRadius: V.rs, cursor: "pointer",
        font: "600 9.5px/1 " + t.dfont, letterSpacing: ".08em" },
      camHudOverlayStyle: { position: "absolute", right: "16px", bottom: "52px", padding: "8px", background: V.surf, border: "1px solid " + V.outv,
        borderRadius: V.rp, boxShadow: "0 8px 24px rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", gap: "6px", zIndex: 20 },"""

new_cam = """      camHudBtnStyle: { flex: "none", height: "26px", display: "flex", alignItems: "center", gap: "4px", padding: "0 8px",
        background: s.showCamHud ? V.pri : V.surf2, color: s.showCamHud ? this.ink(V.pri, [V.bg, V.onpri, V.ink]) : V.ink2,
        border: "1px solid " + (s.showCamHud ? V.pri : V.outv),
        borderRadius: (isFloat && (s.layout === "sweep" || t.nav === "SWEEP")) ? "999px" : V.rs, cursor: "pointer",
        font: "700 9.5px/1 " + t.dfont, letterSpacing: ".1em" },
      camHudOverlayStyle: { position: "absolute", right: "16px", bottom: "52px", padding: "8px", background: V.surf,
        border: (isFloat && (s.layout === "sweep" || t.nav === "SWEEP")) ? "2px solid " + V.pri : "1px solid " + V.outv,
        borderRadius: (isFloat && (s.layout === "sweep" || t.nav === "SWEEP")) ? "18px" : V.rp,
        boxShadow: "0 12px 32px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", gap: "6px", zIndex: 20 },"""

if old_cam in code:
    code = code.replace(old_cam, new_cam, 1)
    print("Successfully replaced camHud style in index.html!")

with open("docs/index.html", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated docs/index.html!")
