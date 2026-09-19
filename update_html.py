with open("docs/index.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update the floaters template block to include sc-if value="{{ f.isSweep }}"
old_tpl = """        <div onMouseDown="{{ f.drag }}" style="{{ f.barStyle }}">
          <i data-lucide="{{ f.icon }}" style="width:13px;height:13px;flex:none"></i>"""

new_tpl = """        <div onMouseDown="{{ f.drag }}" style="{{ f.barStyle }}">
          <sc-if value="{{ f.isSweep }}" hint-placeholder-val="{{ false }}">
            <span style="{{ f.elbowCapStyle }}">{{ f.elbowText }}</span>
          </sc-if>
          <i data-lucide="{{ f.icon }}" style="width:13px;height:13px;flex:none"></i>"""

if old_tpl in content:
    content = content.replace(old_tpl, new_tpl, 1)
    print("Successfully updated floaters template in docs/index.html!")
else:
    print("Warning: old_tpl not found in docs/index.html")

# 2. Update renderVals() desktop logic in docs/index.html
# Find the desktop variables section around flScene and floaters
old_js_anchor = """      flRegionRead: { position: "absolute", left: "14px", bottom: "52px", display: "flex", alignItems: "center", height: "24px",
        padding: "0 11px", background: V.surf, color: V.ink2, font: "500 10px/1 " + t.font, letterSpacing: ".08em",
        borderLeft: "5px solid " + V.sec2 },"""

new_js_anchor = """      flRegionRead: { position: "absolute", left: "14px", bottom: "52px", display: "flex", alignItems: "center", height: "24px",
        padding: "0 11px", background: V.surf, color: V.ink2, font: "500 10px/1 " + t.font, letterSpacing: ".08em",
        borderLeft: "5px solid " + V.sec2 },"""

if old_js_anchor in content:
    print("Found flRegionRead anchor.")

with open("docs/index.html", "w", encoding="utf-8") as f:
    f.write(content)
