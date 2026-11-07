import json, glob, os

token_file_candidates = [
    "../Ktheme/packages/tokens/dist/tokens.json",
    "../../Ktheme/packages/tokens/dist/tokens.json",
    "node_modules/@ktheme/tokens/dist/tokens.json",
    "docs/react/node_modules/@ktheme/tokens/dist/tokens.json"
]

token_data = {}
for candidate in token_file_candidates:
    if os.path.exists(candidate):
        with open(candidate, 'r', encoding='utf-8') as f:
            token_data = json.load(f)
        print(f"Loaded token JSON assets from {candidate}")
        break

theme_desktop_configs = token_data.get("desktopConfigs", {})

# Generic fallback builder for any theme ID not explicitly in theme_desktop_configs
def build_default_desktop_config(data):
    dark = data.get("darkMode", True)
    corner = data.get("adaptation", {}).get("layout", {}).get("cornerStyle", "rounded")
    nav = data.get("adaptation", {}).get("layout", {}).get("navigationStyle", "tabs")

    if corner == "pill":
        pr, cr = 18, 999
        cap = "999px"
    elif corner == "sharp":
        pr, cr = 0, 0
        cap = "0px"
    else:
        pr, cr = 10, 8
        cap = "10px"

    return {
        "windowChrome": {
            "titleBarHeight": 26,
            "headerStyle": "lcars-elbow" if nav == "rail" else "standard",
            "cornerStyle": corner,
            "panelRadius": pr,
            "controlRadius": cr,
            "borderWidth": 1,
            "shadow": "0 14px 36px rgba(0,0,0,0.5)" if dark else "0 10px 26px rgba(0,0,0,0.2)"
        },
        "menuBar": {
            "height": 28,
            "fontSize": 11,
            "letterSpacing": "0.06em",
            "textTransform": "uppercase" if dark else "none",
            "dropdownRadius": pr,
            "dropdownShadow": "0 12px 28px rgba(0,0,0,0.4)" if dark else "0 8px 20px rgba(0,0,0,0.18)"
        },
        "taskbar": {
            "height": 40,
            "buttonRadius": cr,
            "dockAlignment": "left",
            "quickChatBorderRadius": cr
        },
        "cameraHud": {
            "panelRadius": pr,
            "buttonRadius": cr,
            "shadow": "0 8px 20px rgba(0,0,0,0.3)"
        },
        "sweep": {
            "elbowWidth": 30,
            "titleCapRadius": cap,
            "accentBand": "primary",
            "showElbowBar": True
        }
    }

theme_paths = sorted(glob.glob('docs/*.json') + glob.glob('ktheme-pr/themes/community/*.json'))
for path in theme_paths:
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    tid = data.get("metadata", {}).get("id", "")
    cfg = theme_desktop_configs.get(tid) or build_default_desktop_config(data)

    if "adaptation" not in data:
        data["adaptation"] = {}

    data["adaptation"]["desktopAdaptation"] = cfg

    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
        f.write('\n')

    print(f"Updated {path} ({tid}) with desktopAdaptation.")
