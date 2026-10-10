# Ktheme Design System Guidelines

This document establishes **Ktheme / linkpoint-design** as the primary source of truth for design tokens, color palette presets (24 total), and structural layout variations across Linkpoint client applications.

## 1. Unified Color Palettes (24 Presets)

The Ktheme design system defines 24 standardized color palette presets grouped into four families:

1. **TERMINAL & NEON**

   - `ink-terminal-modern` (Ink Terminal): Phosphor green on near-black.
   - `neo-noir-neon` (Neo-Noir Neon): Electric purple and cyan glow.
   - `windows-phone-metro` (Metro Cyan): Flat cyan on deep blue/black.
   - `aurora-glass-night` (Aurora Glass Night): Night glass with cyan/violet aurora accents.
   - `slate-cyan` (Slate Cyan): Cool slate gray with vibrant cyan accents.

2. **CONSOLE & AMBER**

   - `lcars` (LCARS Amber): Amber, violet, and mauve on aubergine.
   - `midnight-amber` (Midnight Amber): Golden amber on midnight navy.
   - `royal-bronze` (Royal Bronze): Regal deep purple with bronze accents.
   - `forest-copper` (Forest Copper): Deep forest green with warm copper accents.
   - `obsidian-crimson` (Obsidian Crimson): Crimson on deep obsidian black.

3. **METAL & JEWEL**

   - `navy-gold` (Navy Gold): Metallic gold on deep navy blue.
   - `art-deco` (Art Deco): Gold hairlines on ivory black.
   - `emerald-silver` (Emerald Silver): Silver on deep emerald green.
   - `royal-silver` (Royal Silver): Royal purple with silver metallic accents.
   - `deep-purple-platinum` (Deep Purple Platinum): Deep purple with platinum accents.
   - `charcoal-champagne` (Charcoal Champagne): Charcoal gray with warm champagne gold.
   - `slate-gunmetal` (Slate Gunmetal): Industrial slate gray with gunmetal accents.
   - `rose-gold` (Rose Gold): Warm rose gold with burgundy undertones.
   - `burgundy-rose-gold` (Burgundy Rose Gold): Rich burgundy with rose gold accents.

4. **DAYLIGHT**
   - `frutiger-aero` (Frutiger Aero): Sky blue and nature green (light-first).
   - `paper-ink` (Paper & Ink): Clean hueless monochrome for high legibility (light-first).
   - `art-nouveau` (Art Nouveau): Organic curves and botanical tones (light-first).
   - `calm-clinical` (Calm Clinical): Low-stress healthcare cyan/green (light-first).
   - `solarpunk-civic` (Solarpunk Civic): Daylight green and civic clarity (light-first).

---

## 2. Structural Layout Variations (8 Variations)

Ktheme layout variations control geometry, navigation patterns, card treatments, typography scale, and motion profiles independently of color palette:

| Layout Variation  | Nav Model | Corner Profile | Density Profile | Card Look | Description                                                |
| ----------------- | --------- | -------------- | --------------- | --------- | ---------------------------------------------------------- |
| **Metro**         | TILES     | SHARP          | COMFORTABLE     | Flat      | High-contrast tile navigation with zero corner radii.      |
| **LCARS**         | SWEEP     | PILLED         | COMPACT         | Cap       | Swept elbow rail frame and pill button caps.               |
| **Frutiger Aero** | TABS      | ROUNDED        | COMFORTABLE     | Soft      | Glassy 12-18px curved corners and translucent panels.      |
| **Art Deco**      | RAIL      | SHARP          | COMPACT         | Rule      | Hairline rules, sharp angles, and geometric tracking.      |
| **Terminal**      | TABS      | SHARP          | COMPACT         | Box       | Monospaced dense telemetry with prompt markers.            |
| **Modern Glass**  | TABS      | ROUNDED        | STANDARD        | Soft      | Frosted glass blur, curved corners, and expressive motion. |
| **Material3**     | TABS      | ROUNDED        | STANDARD        | Quiet     | M3 rounded containers and tonal elevation.                 |
| **Cyberpunk**     | RAIL      | SHARP          | COMPACT         | Box       | Dystopian neon HUD with chamfered cut corners.             |

---

## 3. Cross-Platform Contract

Both **Linkpoint (Android/Kotlin)** and **React-Linkpoint (Web/React)** map their respective theme state to these Ktheme token schemas, allowing theme files and presets to be interchanged across platforms without loss of visual fidelity.
