import json, glob

theme_desktop_configs = {
    "lcars": {
        "windowChrome": {
            "titleBarHeight": 28,
            "headerStyle": "lcars-elbow",
            "cornerStyle": "pill",
            "panelRadius": 22,
            "controlRadius": 999,
            "borderWidth": 1,
            "shadow": "0 16px 44px rgba(0, 0, 0, 0.65)"
        },
        "menuBar": {
            "height": 28,
            "fontSize": 11,
            "letterSpacing": "0.12em",
            "textTransform": "uppercase",
            "dropdownRadius": 12,
            "dropdownShadow": "0 14px 34px rgba(0,0,0,.65)"
        },
        "taskbar": {
            "height": 40,
            "buttonRadius": 999,
            "dockAlignment": "left",
            "quickChatBorderRadius": 999
        },
        "cameraHud": {
            "panelRadius": 16,
            "buttonRadius": 999,
            "shadow": "0 8px 24px rgba(0,0,0,0.5)"
        },
        "sweep": {
            "elbowWidth": 36,
            "titleCapRadius": "999px",
            "accentBand": "primary",
            "showElbowBar": True
        }
    },
    "frutiger-aero": {
        "windowChrome": {
            "titleBarHeight": 26,
            "headerStyle": "glass",
            "cornerStyle": "rounded",
            "panelRadius": 16,
            "controlRadius": 12,
            "borderWidth": 1,
            "backdropBlur": 12,
            "shadow": "0 12px 32px rgba(0, 80, 140, 0.22)"
        },
        "menuBar": {
            "height": 28,
            "fontSize": 11,
            "letterSpacing": "0.06em",
            "textTransform": "none",
            "dropdownRadius": 12,
            "dropdownShadow": "0 10px 28px rgba(0, 60, 120, 0.25)"
        },
        "taskbar": {
            "height": 40,
            "buttonRadius": 12,
            "dockAlignment": "left",
            "quickChatBorderRadius": 12
        },
        "cameraHud": {
            "panelRadius": 16,
            "buttonRadius": 10,
            "shadow": "0 8px 20px rgba(0, 60, 120, 0.2)"
        },
        "sweep": {
            "elbowWidth": 28,
            "titleCapRadius": "18px",
            "accentBand": "secondary",
            "showElbowBar": True
        }
    },
    "art-deco": {
        "windowChrome": {
            "titleBarHeight": 26,
            "headerStyle": "geometric-stepped",
            "cornerStyle": "sharp",
            "panelRadius": 0,
            "controlRadius": 0,
            "borderWidth": 1,
            "shadow": "0 16px 40px rgba(0, 0, 0, 0.75)"
        },
        "menuBar": {
            "height": 28,
            "fontSize": 11,
            "letterSpacing": "0.18em",
            "textTransform": "uppercase",
            "dropdownRadius": 0,
            "dropdownShadow": "0 14px 30px rgba(0,0,0,.7)"
        },
        "taskbar": {
            "height": 40,
            "buttonRadius": 0,
            "dockAlignment": "left",
            "quickChatBorderRadius": 0
        },
        "cameraHud": {
            "panelRadius": 0,
            "buttonRadius": 0,
            "shadow": "0 8px 24px rgba(0,0,0,0.6)"
        },
        "sweep": {
            "elbowWidth": 30,
            "titleCapRadius": "0px",
            "accentBand": "primary",
            "showElbowBar": True
        }
    },
    "windows-phone-metro": {
        "windowChrome": {
            "titleBarHeight": 26,
            "headerStyle": "flat",
            "cornerStyle": "sharp",
            "panelRadius": 0,
            "controlRadius": 0,
            "borderWidth": 1,
            "shadow": "0 10px 24px rgba(0, 0, 0, 0.45)"
        },
        "menuBar": {
            "height": 28,
            "fontSize": 11,
            "letterSpacing": "0.02em",
            "textTransform": "lowercase",
            "dropdownRadius": 0,
            "dropdownShadow": "0 10px 24px rgba(0, 0, 0, 0.45)"
        },
        "taskbar": {
            "height": 40,
            "buttonRadius": 0,
            "dockAlignment": "left",
            "quickChatBorderRadius": 0
        },
        "cameraHud": {
            "panelRadius": 0,
            "buttonRadius": 0,
            "shadow": "0 6px 18px rgba(0, 0, 0, 0.4)"
        },
        "sweep": {
            "elbowWidth": 26,
            "titleCapRadius": "0px",
            "accentBand": "primary",
            "showElbowBar": False
        }
    },
    "ink-terminal-modern": {
        "windowChrome": {
            "titleBarHeight": 26,
            "headerStyle": "terminal-bar",
            "cornerStyle": "sharp",
            "panelRadius": 4,
            "controlRadius": 4,
            "borderWidth": 1,
            "shadow": "0 12px 32px rgba(0, 0, 0, 0.6)"
        },
        "menuBar": {
            "height": 28,
            "fontSize": 11,
            "letterSpacing": "0.1em",
            "textTransform": "uppercase",
            "dropdownRadius": 4,
            "dropdownShadow": "0 12px 30px rgba(0, 0, 0, 0.6)"
        },
        "taskbar": {
            "height": 40,
            "buttonRadius": 4,
            "dockAlignment": "left",
            "quickChatBorderRadius": 4
        },
        "cameraHud": {
            "panelRadius": 4,
            "buttonRadius": 4,
            "shadow": "0 8px 20px rgba(0, 0, 0, 0.5)"
        },
        "sweep": {
            "elbowWidth": 28,
            "titleCapRadius": "4px",
            "accentBand": "primary",
            "showElbowBar": True
        }
    },
    "paper-ink": {
        "windowChrome": {
            "titleBarHeight": 26,
            "headerStyle": "editorial",
            "cornerStyle": "quiet",
            "panelRadius": 3,
            "controlRadius": 2,
            "borderWidth": 1,
            "shadow": "0 6px 16px rgba(0, 0, 0, 0.15)"
        },
        "menuBar": {
            "height": 28,
            "fontSize": 11,
            "letterSpacing": "0.08em",
            "textTransform": "none",
            "dropdownRadius": 3,
            "dropdownShadow": "0 8px 20px rgba(0, 0, 0, 0.15)"
        },
        "taskbar": {
            "height": 40,
            "buttonRadius": 2,
            "dockAlignment": "left",
            "quickChatBorderRadius": 2
        },
        "cameraHud": {
            "panelRadius": 3,
            "buttonRadius": 2,
            "shadow": "0 4px 12px rgba(0, 0, 0, 0.12)"
        },
        "sweep": {
            "elbowWidth": 26,
            "titleCapRadius": "3px",
            "accentBand": "primary",
            "showElbowBar": True
        }
    }
}

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

for path in sorted(glob.glob('docs/*.json')):
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
