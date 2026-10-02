# Linkpoint Design Language Specification

## 1. Overview & Common Reference Frame

**Linkpoint Design** is the universal design language and reference system for the Linkpoint ecosystem, supporting Second Life and OpenSimulator viewers across Mobile, Web PWA, Desktop (Tauri/Electron), and native platforms.

By establishing a single, coherent reference frame, all client implementations share:
- **Identical Information Architecture (IA)** and screen hierarchies (Chat, Friends, Radar, Map, 3D View, Inventory, Profile, Groups, Notices, Teleport, Settings, Diagnostics, Login, Outfits, Objects, Parcel, Transactions, Mute List, Search, Cache).
- **A 4-Token Color Grouping Framework** mapped to Material Design 3 and app-neutral **Ktheme** schemas.
- **Interchangeable Layout Packs** allowing decoupled navigation paradigms (Tabs, Rail, Sweep Console / LCARS, Metro Tiles, Aero Glass, Floaters Desktop) without altering the application state tree or component contract.
- **Dynamic Device Scale & Window Chrome Adaptation** across phones, tablets, foldables, and desktop window managers.

---

## 2. Token Architecture & Ktheme Schema Alignment

Linkpoint Design utilizes a semantic token hierarchy that maps directly to the app-neutral **Ktheme** specification (`https://github.com/Kaleaon/Ktheme`).

### 2.1 Core Color Token Mapping

| Linkpoint Token | Ktheme / M3 Token | Description |
| --- | --- | --- |
| `V.bg` | `colorScheme.background` | App background ground surface |
| `V.surf` | `colorScheme.surface` | Primary container / card surface |
| `V.surf2` | `colorScheme.surfaceVariant` | Secondary / elevated panel surface |
| `V.ink` | `colorScheme.onBackground` / `onSurface` | High-contrast primary text and icons |
| `V.ink2` | `colorScheme.onSurfaceVariant` | Subdued secondary labels / metadata |
| `V.pri` | `colorScheme.primary` | Primary brand accent / active highlights |
| `V.onpri` | `colorScheme.onPrimary` | Text / icons placed on primary accent fills |
| `V.priC` | `colorScheme.primaryContainer` | Container fill for primary grouped controls |
| `V.onpriC` | `colorScheme.onPrimaryContainer` | Text on primary container fills |
| `V.sec` | `colorScheme.secondary` | Secondary action fill / badge accent |
| `V.onsec` | `colorScheme.onSecondary` | Text / icons on secondary fills |
| `V.outv` | `colorScheme.outlineVariant` | Hairlines, borders, and divider rules |
| `V.ok` | `colorScheme.tertiary` / custom | Success status indicators (green/cyan) |
| `V.err` | `colorScheme.error` | Destructive / error states |
| `V.warn` | custom `warning` | Warning / alert highlights |

### 2.2 Geometry & Shape Tokens

| Token | Description | Examples |
| --- | --- | --- |
| `V.rs` | Control radius (buttons, chips, inputs) | `0px` (Metro), `4px` (Terminal), `12px` (Aero), `999px` (LCARS) |
| `V.rp` | Panel radius (cards, floaters, bottom sheets) | `0px` (Metro), `4px` (Terminal), `16px` (Aero), `22px` (LCARS) |
| `V.rl` | Large radius (modals, hero containers) | `0px` (Metro), `8px` (Terminal), `18px` (Aero), `28px` (LCARS) |
| `V.navr` | Navigation item border radius | Custom per layout pack |
| `V.pad` | Content padding module | `10px` – `14px` standard baseline grid |
| `V.tls` | Title letter spacing (tracking) | `.0em` (Metro) – `.35em` (Art Deco) |

---

## 3. Palette Families (24 Ktheme Presets)

The 24 color packs are organized into four distinct aesthetic families. Any color pack can be applied over any layout pack (producing 144+ combination permutations):

1. **TERMINAL & NEON**: High-contrast, phosphor, and dark neon themes designed for low-light environments and terminal aesthetics.
   - Presets: `Ink Terminal Modern`, `Neo-Noir Neon`, `Metro Cyan`, `Metro Zune Orange`, `Metro Magenta`, `Aurora Glass Night`, `Slate Cyan`.
2. **CONSOLE & AMBER**: Warm aubergine, amber, and sci-fi console aesthetics inspired by LCARS and tactical HUDs.
   - Presets: `LCARS Amber`, `LCARS Okuda Blue`, `Midnight Amber`, `Royal Bronze`, `Forest Copper`, `Obsidian Crimson`.
3. **METAL & JEWEL**: Metallic accents (gold, silver, platinum, bronze) on deep jewel fields.
   - Presets: `Navy Gold`, `Art Deco`, `Emerald Silver`, `Royal Silver`, `Deep Purple Platinum`, `Charcoal Champagne`, `Slate Gunmetal`, `Rose Gold`, `Burgundy Rose Gold`.
4. **DAYLIGHT**: High-legibility, daylight-optimized, and light-first themes.
   - Presets: `Frutiger Aero`, `Paper & Ink` (hueless accessibility/sunlight mode), `Art Nouveau`, `Calm Clinical`, `Solarpunk Civic`.

---

## 4. Navigation & Layout Packs

Linkpoint Design defines six distinct layout packs, providing full adaptability across mobile screens, tablets, foldables, and desktop displays:

1. **Tabs**: Classic mobile bottom navigation bar with top app header. Ideal for compact handheld viewports.
2. **Rail**: Vertical navigation rail docked to the left edge. Optimal for tablet and landscape mobile viewports.
3. **Sweep Console (LCARS)**: Full-bleed frame with swept elbow joint, sub-segments off the spine, and pill buttons.
4. **Metro Tiles**: Flat, zero-radius tile navigation grid with wide lowercase pivot titles.
5. **Aero Glass**: Translucent, blurred glass panels with soft rounded corners (`12px–18px`) and sky/grass horizon rendering in 3D.
6. **Floaters Desktop**: Window-manager paradigm with N draggable/resizable floater windows, menu bar, taskbar/dock, and camera HUD.

---

## 5. Desktop Window Chrome Adaptation

For desktop window-manager mode, themes specify `adaptation.desktopAdaptation` in their JSON definition:

```json
"adaptation": {
  "desktopAdaptation": {
    "windowChrome": {
      "titleBarHeight": 26,
      "headerStyle": "terminal-bar | glass | lcars-elbow | flat | standard",
      "cornerStyle": "sharp | rounded | pill | quiet",
      "panelRadius": 4,
      "controlRadius": 4,
      "borderWidth": 1,
      "shadow": "0 12px 32px rgba(0, 0, 0, 0.6)"
    },
    "menuBar": {
      "height": 28,
      "fontSize": 11,
      "letterSpacing": "0.1em",
      "textTransform": "uppercase | lowercase | none",
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
    }
  }
}
```

---

## 6. Upstream Ktheme Contribution Standard

All theme files created or updated in the Linkpoint ecosystem are app-neutral **Ktheme** JSON files:
- Placed in `docs/*.json` and `ktheme-pr/themes/community/` (or `themes/examples/`).
- Validated via `update_json_themes.py` against contrast guardrails (WCAG AA compliant).
- Ready to be contributed directly upstream to `github.com/Kaleaon/Ktheme`.
