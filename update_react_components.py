
# 1. Update computeTheme.js
with open("docs/react/src/theme/computeTheme.js", "r", encoding="utf-8") as f:
    compute_code = f.read()

old_compute = """  const isFloat = nav === "floaters";
  const bleed = isConsole || isFloat;"""

new_compute = """  const isFloat = nav === "floaters";
  const isSweepDesk = isFloat && (state.layout === "sweep" || t.nav === "SWEEP");
  const bleed = isConsole || isFloat;"""

if old_compute in compute_code:
    compute_code = compute_code.replace(old_compute, new_compute, 1)
    compute_code = compute_code.replace("return { t, d,", "return { t, d, isSweepDesk,")
    with open("docs/react/src/theme/computeTheme.js", "w", encoding="utf-8") as f:
        f.write(compute_code)
    print("Updated computeTheme.js!")

# 2. Update MenuBar.jsx
with open("docs/react/src/components/MenuBar.jsx", "r", encoding="utf-8") as f:
    menubar_code = f.read()

old_menubar_use = "const { V, t, ink, isFloat } = useTheme();"
new_menubar_use = "const { V, t, ink, isFloat, isSweepDesk } = useTheme();"

old_menubar_container = "borderBottom: \"1px solid \" + V.outv"
new_menubar_container = "borderBottom: (isSweepDesk ? \"2px solid \" : \"1px solid \") + (isSweepDesk ? V.pri : V.outv)"

old_menubar_item = "font: \"500 11px/1 \" + t.font, letterSpacing: \".04em\", borderRadius: V.rs"
new_menubar_item = "font: (isSweepDesk ? \"700 11px/1 \" + t.dfont : \"500 11px/1 \" + t.font), letterSpacing: (isSweepDesk ? \".12em\" : \".04em\"), borderRadius: isSweepDesk ? \"999px\" : V.rs, textTransform: isSweepDesk ? \"uppercase\" : \"none\""

if old_menubar_use in menubar_code:
    menubar_code = menubar_code.replace(old_menubar_use, new_menubar_use, 1)
if old_menubar_container in menubar_code:
    menubar_code = menubar_code.replace(old_menubar_container, new_menubar_container, 1)
if old_menubar_item in menubar_code:
    menubar_code = menubar_code.replace(old_menubar_item, new_menubar_item, 1)

with open("docs/react/src/components/MenuBar.jsx", "w", encoding="utf-8") as f:
    f.write(menubar_code)
print("Updated MenuBar.jsx!")

# 3. Update FloatersDesktop.jsx
with open("docs/react/src/components/FloatersDesktop.jsx", "r", encoding="utf-8") as f:
    floaters_code = f.read()

floaters_code = floaters_code.replace(
    "const { V, t, ink } = useTheme();",
    "const { V, t, ink, isSweepDesk } = useTheme();"
)

# Update Camera HUD overlay
floaters_code = floaters_code.replace(
    "border: \"1px solid \" + V.outv,\n              borderRadius: V.rp, boxShadow: \"0 8px 24px rgba(0,0,0,0.4)\"",
    "border: (isSweepDesk ? \"2px solid \" : \"1px solid \") + (isSweepDesk ? V.pri : V.outv),\n              borderRadius: isSweepDesk ? \"18px\" : V.rp, boxShadow: \"0 12px 32px rgba(0,0,0,0.5)\""
)

# Update Camera HUD buttons
floaters_code = floaters_code.replace(
    "borderRadius: V.rs, cursor: \"pointer\"",
    "borderRadius: isSweepDesk ? \"999px\" : V.rs, cursor: \"pointer\""
)

# Update Floater window frame
floaters_code = floaters_code.replace(
    "border: \"1px solid \" + (act ? V.pri : V.outv), borderRadius: V.rp, overflow: \"hidden\",\n              boxShadow: act ? \"0 16px 44px rgba(0,0,0,.58)\" : \"0 6px 18px rgba(0,0,0,.34)\"",
    "border: (isSweepDesk ? \"2px solid \" : \"1px solid \") + (act ? V.pri : V.outv), borderRadius: isSweepDesk ? \"22px 22px 14px 14px\" : V.rp, overflow: \"hidden\",\n              boxShadow: act ? \"0 18px 48px rgba(0,0,0,.65)\" : \"0 6px 18px rgba(0,0,0,.34)\""
)

# Update Floater titlebar
old_titlebar = "style={{ flex: \"none\", height: FBAR + \"px\", display: \"flex\", alignItems: \"center\", gap: \"7px\", padding: \"0 5px 0 9px\", background: act ? V.pri : V.surf2, color: act ? ink(V.pri, [V.bg, V.onpri, V.ink]) : V.ink2, font: \"600 10px/1 \" + t.dfont, letterSpacing: \".12em\", cursor: \"move\", userSelect: \"none\" }}"
new_titlebar = """style={{ flex: "none", height: FBAR + "px", display: "flex", alignItems: "center", gap: "7px", padding: isSweepDesk ? "0 5px 0 0" : "0 5px 0 9px", background: act ? V.pri : V.surf2, color: act ? ink(V.pri, [V.bg, V.onpri, V.ink]) : V.ink2, font: "700 10.5px/1 " + t.dfont, letterSpacing: ".14em", cursor: "move", userSelect: "none" }}"""

if old_titlebar in floaters_code:
    floaters_code = floaters_code.replace(old_titlebar, new_titlebar, 1)

# Add LCARS elbow cap inside titlebar
old_icon_in_title = "<Icon name={f.icon} size={13} />"
new_icon_in_title = """{isSweepDesk && (
                <span style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 8px", background: act ? V.sec : V.sec2, color: act ? V.bg : V.onsec, borderRadius: "18px 0 10px 0", font: "700 9.5px/1 " + t.dfont, letterSpacing: ".1em", flex: "none", marginRight: "4px" }}>
                  {act ? "LCARS" : "SYS"}
                </span>
              )}
              <Icon name={f.icon} size={13} />"""

if old_icon_in_title in floaters_code:
    floaters_code = floaters_code.replace(old_icon_in_title, new_icon_in_title, 1)

# Update minimize & close buttons in Floater titlebar
floaters_code = floaters_code.replace(
    "borderRadius: V.rs, font: \"600 11px/1 \" + t.font, cursor: \"pointer\", opacity: 0.75",
    "borderRadius: isSweepDesk ? \"999px\" : V.rs, font: \"700 11px/1 \" + t.dfont, cursor: \"pointer\", opacity: 0.85"
)

# Update Taskbar borderTop
floaters_code = floaters_code.replace(
    "borderTop: \"1px solid \" + V.outv, zIndex: 60",
    "borderTop: (isSweepDesk ? \"2px solid \" : \"1px solid \") + (isSweepDesk ? V.pri : V.outv), zIndex: 60"
)

# Update Quick Chat input & SAY button
floaters_code = floaters_code.replace(
    "borderRadius: V.rs, font: \"400 11px/1 \" + t.font, outline: \"none\"",
    "borderRadius: isSweepDesk ? \"999px\" : V.rs, font: \"400 11px/1 \" + t.font, outline: \"none\""
)
floaters_code = floaters_code.replace(
    "border: \"none\", borderRadius: V.rs, font: \"600 9.5px/1 \" + t.dfont, letterSpacing: \".08em\", cursor: \"pointer\", flex: \"none\"",
    "border: \"none\", borderRadius: isSweepDesk ? \"999px\" : V.rs, font: \"700 9.5px/1 \" + t.dfont, letterSpacing: \".12em\", cursor: \"pointer\", flex: \"none\""
)

# Update Taskbar task buttons and dock buttons
floaters_code = floaters_code.replace(
    "borderRadius: V.rs, font: \"500 10px/1 \" + t.font, letterSpacing: \".08em\", whiteSpace: \"nowrap\"",
    "borderRadius: isSweepDesk ? \"999px\" : V.rs, font: isSweepDesk ? \"700 10px/1 \" + t.dfont : \"500 10px/1 \" + t.font, letterSpacing: isSweepDesk ? \".12em\" : \".08em\", whiteSpace: \"nowrap\""
)

with open("docs/react/src/components/FloatersDesktop.jsx", "w", encoding="utf-8") as f:
    f.write(floaters_code)
print("Updated FloatersDesktop.jsx!")
