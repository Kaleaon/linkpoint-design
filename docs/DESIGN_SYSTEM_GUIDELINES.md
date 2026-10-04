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

## 2. Structural Layout Variations (9 Variations)

Ktheme layout variations control geometry, navigation patterns, card treatments, typography scale, and motion profiles independently of color palette:

| Layout Variation | Nav Model | Corner Profile | Density Profile | Card Look | Head Look | Description |
|------------------|-----------|----------------|-----------------|-----------|-----------|-------------|
| **Metro** | TILES | SHARP (`0px`) | COMFORTABLE | Flat | Pivot | High-contrast Windows Phone Metro / Zune tile navigation with zero corner radii, live tile notification badges, and lowercase pivot headers. |
| **LCARS** | SWEEP | PILLED (`999px`) | COMPACT | Cap | Sweep | Authentic Michael Okuda LCARS console layout with upper swoop bar, concentric tangent elbow arc, flush button segments, and rounded pill caps. |
| **Frutiger Aero** | TABS | ROUNDED (`12-18px`) | COMFORTABLE | Soft | Stack | Glossy Aero layout with 12-18px curved corners, comfortable padding, soft translucent panels, and sky/grass horizons. |
| **Art Deco** | RAIL | SHARP (`0px`) | COMPACT | Rule | Rule | Architectural Art Deco layout with hairline rules, sharp geometric angles, and wide letter-spacing (`.35em`). |
| **Terminal** | TABS | SHARP (`4px`) | COMPACT | Box | Stack | Dense command terminal grid with monospaced typography, tight line heights, and prompt indicators (`>`). |
| **Press** | TABS | SHARP (`2px`) | COMFORTABLE | Quiet | Editorial | High-legibility editorial layout with serif body typography, 2px micro-radii, and generous leading for bright sunlight. |
| **Modern Glass** | TABS | ROUNDED (`14-22px`) | STANDARD | Soft | Stack | Modern frosted glass layout with deep curvature, subtle glowing borders, and fluid animations. |
| **Material3** | TABS | ROUNDED (`12-24px`) | STANDARD | Tonal | Stack | Material Design 3 layout with rounded pill containers, expressive tonal elevation, and dynamic surface tinting. |
| **Cyberpunk** | RAIL | SHARP (`0px`) | COMPACT | Chamfer | Sweep | High-tech dystopian cyberpunk layout with 45° chamfered cuts, wireframe borders, neon accents, and HUD telemetry rails. |

---

## 3. Cross-Platform Contract

Both **Linkpoint (Android/Kotlin)** and **React-Linkpoint (Web/React)** map their respective theme state to these Ktheme token schemas, allowing theme files and presets to be interchanged across platforms without loss of visual fidelity.
