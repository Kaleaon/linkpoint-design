// Ported verbatim from the `PALETTES` (and `LEGACY_PALETTES`) constants inside
// index.html's <script type="text/x-dc"> block.
//
// LEGACY_PALETTES was declared in the source file but never referenced by
// render() (PALETTES was used instead) — it's kept here for completeness /
// reference only and is not wired into the running app. See README.md ->
// "Known deviations from the mockup".

/**
 * @deprecated Local JS palette definitions are deprecated in favor of `@ktheme/react` <KthemeProvider> central token registry.
 */
export const LEGACY_PALETTES = {
  ink: { name: "Ink Terminal", nav: "TABS", font: '"JetBrains Mono","IBM Plex Mono",monospace', dfont: '"JetBrains Mono",monospace',
    v: { bg:"#0A1112", surf:"#101A1C", surf2:"#1B2A2D", ink:"#D7F5E6", ink2:"#A7C8BC", pri:"#6CFF9A", onpri:"#03240F", priC:"#1F6640", onpriC:"#D7FFE4",
         sec:"#3E4E5E", onsec:"#EAF3FF", sec2:"#8AD0B0", bdg:"#8AD0B0", onbdg:"#0E3021", info:"#8AD0B0", outv:"#365047", ok:"#6CFF9A", err:"#CF6679", warn:"#FFC98A",
         rs:"4px", rl:"8px", rp:"4px", navr:"4px", pad:"12px", tls:".26em", sky1:"#1c4a5c", sky2:"#12333a", gnd:"#10241d", gnd2:"#0a1112" },
    note: "Ktheme ink-terminal-modern: JetBrains Mono, #6CFF9A on #0A1112, sharp 4px corners, bottom tabs. Closest to the app today, contrast raised to AA." },
  rail: { name: "Rail Console", nav: "SWEEP", font: '"Antonio","Jost",sans-serif', dfont: '"Antonio",sans-serif',
    v: { bg:"#120C1C", surf:"#1C132A", surf2:"#3D1F5C", ink:"#F3E9FF", ink2:"#D0B3E6", pri:"#F2A65A", onpri:"#1B0E24", priC:"#CC7A2B", onpriC:"#FFE6CC",
         sec:"#A485F7", onsec:"#170F2E", sec2:"#C5678D", bdg:"#A485F7", onbdg:"#170F2E", info:"#C5678D", outv:"#4D2F5C", ok:"#F2A65A", err:"#CF6679", warn:"#FFC46B",
         rs:"999px", rl:"28px", rp:"22px", navr:"0 999px 999px 0", pad:"10px", tls:".16em", sky1:"#3D1F5C", sky2:"#241338", gnd:"#1C132A", gnd2:"#120C1C" },
    note: "Sweep-rail console built to the LCARS manifesto's own rules: the swept elbow is the whole frame, rail segments ARE the buttons (never separate ones), frame thickness changes at every turn, rounded caps terminate each bar, labels sit bottom-right, three hues + tints only, no gradients, no borders — fills alone. Ktheme lcars tokens (#F2A65A amber, #A485F7 violet, #C5678D mauve); original geometry, no franchise marks." },
  metro: { name: "Metro Tiles", nav: "TILES", font: '"Open Sans","Nunito Sans",sans-serif', dfont: '"Open Sans",sans-serif',
    v: { bg:"#001A33", surf:"#002448", surf2:"#3D4854", ink:"#F0F8FF", ink2:"#B8CAD6", pri:"#00AEEF", onpri:"#00151F", priC:"#0078D7", onpriC:"#E8F7FF",
         sec:"#2D89EF", onsec:"#001021", sec2:"#00AEEF", bdg:"#2D89EF", onbdg:"#FFFFFF", info:"#00AEEF", outv:"#4D5A66", ok:"#00AEEF", err:"#CF6679", warn:"#FFC300",
         rs:"0px", rl:"0px", rp:"0px", navr:"0px", pad:"14px", tls:"0em", sky1:"#0a3a63", sky2:"#04263f", gnd:"#062033", gnd2:"#001a33" },
    note: "Ktheme windows-phone-metro: flat #00AEEF on #001A33, zero radius, spacious 1.25 scale, light-weight Open Sans, pivot titles and a tile nav strip." },
  aero: { name: "Frutiger Aero", nav: "TABS", font: '"Nunito Sans",sans-serif', dfont: '"Nunito Sans",sans-serif',
    v: { bg:"#EAF7FF", surf:"#F7FCFF", surf2:"#DDF1FF", ink:"#173A52", ink2:"#34566E", pri:"#39B6F0", onpri:"#022A40", priC:"#A9E6FF", onpriC:"#00314D",
         sec:"#79D87E", onsec:"#07350D", sec2:"#0A6FA0", bdg:"#0A6FA0", onbdg:"#FFFFFF", info:"#0A6FA0", outv:"#A9C7DA", ok:"#0A6FA0", err:"#BA1A1A", warn:"#8A5A00",
         rs:"12px", rl:"18px", rp:"16px", navr:"12px", pad:"14px", tls:".06em", sky1:"#BEEBFF", sky2:"#DAF0FF", gnd:"#79D87E", gnd2:"#3f8f57" },
    note: "Ktheme frutiger-aero: light glossy #EAF7FF ground, #39B6F0 sky primary, 12–18px rounded, glass panels, comfortable 1.1 scale. The only light-first skin with a green horizon in the 3D view." },
  navy: { name: "Navy Gold", nav: "RAIL", font: '"Jost",system-ui,sans-serif', dfont: '"Jost",sans-serif',
    v: { bg:"#0A1630", surf:"#1A2645", surf2:"#2A3655", ink:"#E8E3D8", ink2:"#C9C4B9", pri:"#D4AF37", onpri:"#0A1630", priC:"#856D34", onpriC:"#FFF8DC",
         sec:"#4A90E2", onsec:"#FFFFFF", sec2:"#9C8970", bdg:"#4A90E2", onbdg:"#FFFFFF", info:"#4A90E2", outv:"#44483E", ok:"#D4AF37", err:"#CF6679", warn:"#E0B84C",
         rs:"8px", rl:"14px", rp:"10px", navr:"8px", pad:"13px", tls:".14em", sky1:"#16305c", sky2:"#0e1f3f", gnd:"#141f38", gnd2:"#0a1630" },
    note: "Ktheme navy-gold: #D4AF37 metallic accent on #0A1630, 8px radius, elevated panels, Jost. Rail nav on tablet; the accent is used sparingly as a hairline and label colour." },
  paper: { name: "Paper & Ink", nav: "TABS", font: '"Source Serif 4",Georgia,serif', dfont: '"Jost",sans-serif',
    v: { bg:"#F0F0EB", surf:"#FAF9F6", surf2:"#EBEAE4", ink:"#2C2C2C", ink2:"#454545", pri:"#2C2C2C", onpri:"#FAF9F6", priC:"#EBEAE4", onpriC:"#2C2C2C",
         sec:"#595959", onsec:"#FAF9F6", sec2:"#6B6B6B", bdg:"#2C2C2C", onbdg:"#FAF9F6", info:"#454545", outv:"#C9C9C9", ok:"#2C6B3F", err:"#BA1A1A", warn:"#8A5A00",
         rs:"2px", rl:"6px", rp:"3px", navr:"2px", pad:"14px", tls:".1em", sky1:"#d9d9d2", sky2:"#eceae3", gnd:"#cfcec6", gnd2:"#bfbeb6" },
    note: "Ktheme paper-ink: no colour at all — #2C2C2C on #F0F0EB, serif body, 2px corners. This is the accessibility / bright-sunlight skin; every state reads as weight and rule, not hue." },
  deco: { name: "Art Deco", nav: "RAIL", font: '"Jost",sans-serif', dfont: '"Jost",sans-serif',
    v: { bg:"#0B0A0A", surf:"#141314", surf2:"#232124", ink:"#F3E8D0", ink2:"#C9BDA2", pri:"#D4AF37", onpri:"#1A1405", priC:"#8F7121", onpriC:"#FFF2C6",
         sec:"#F4E7CF", onsec:"#221A0A", sec2:"#B8A17A", bdg:"#B8A17A", onbdg:"#161005", info:"#B8A17A", outv:"#4B4332", ok:"#D4AF37", err:"#FFB4AB", warn:"#E0B84C",
         rs:"0px", rl:"0px", rp:"0px", navr:"0px", pad:"11px", tls:".35em", sky1:"#1d1a14", sky2:"#12100c", gnd:"#191712", gnd2:"#0b0a0a" },
    note: "Ktheme art-deco: gold hairlines on #0B0A0A, sharp corners, 0.35em tracking, compact 0.94 scale, geometric Jost caps. Rules replace fills; the rail becomes a stepped column." },
};

const mkPal = (name, c, note, light) => {
  const isLight = !!light;
  c.surfaceDim = c.surfaceDim || (isLight ? c.surf2 || c.surf : c.bg);
  c.surfaceBright = c.surfaceBright || (isLight ? c.surf : c.surf2 || c.surf);
  c.surfaceContainerLowest = c.surfaceContainerLowest || (isLight ? "#FFFFFF" : c.bg);
  c.surfaceContainerLow = c.surfaceContainerLow || c.surf;
  c.surfaceContainer = c.surfaceContainer || c.surf;
  c.surfaceContainerHigh = c.surfaceContainerHigh || (c.surf2 || c.surf);
  c.surfaceContainerHighest = c.surfaceContainerHighest || (c.surf2 || c.surf);

  Object.defineProperties(c, {
    surf2: {
      get() { return this.surfaceContainerHigh || this.surfaceContainer; },
      enumerable: true,
      configurable: true
    },
    sky1: {
      get() { return this.surfaceContainerHighest || this.surfaceContainerHigh; },
      enumerable: true,
      configurable: true
    },
    sky2: {
      get() { return this.surfaceContainerHigh || this.surfaceContainer; },
      enumerable: true,
      configurable: true
    },
    gnd: {
      get() { return this.surfaceContainerLow || this.surfaceContainerLowest; },
      enumerable: true,
      configurable: true
    },
    gnd2: {
      get() { return this.surfaceDim || this.bg; },
      enumerable: true,
      configurable: true
    }
  });

  return { name, note, light: isLight, c };
};

export const PALETTES = {
  ink: mkPal("Ink Terminal", { bg:"#0A1112", surf:"#101A1C", surf2:"#1B2A2D", ink:"#D7F5E6", ink2:"#A7C8BC", pri:"#6CFF9A", onpri:"#0A1112", priC:"#1F6640", onpriC:"#D7F5E6", sec:"#3E4E5E", onsec:"#D7F5E6", sec2:"#8AD0B0", bdg:"#8AD0B0", onbdg:"#0A1112", info:"#8AD0B0", outv:"#365047", ok:"#6CFF9A", err:"#CF6679", warn:"#FFC98A", surfaceDim:"#0A1112", surfaceContainerLowest:"#0E1618", surfaceContainerLow:"#101A1C", surfaceContainer:"#142225", surfaceContainerHigh:"#1B2A2D", surfaceContainerHighest:"#223539", surfaceBright:"#2A3F44" }, "ink-terminal-modern, phosphor green on near-black"),
  lcars: mkPal("LCARS Amber", { bg:"#120C1C", surf:"#1C132A", surf2:"#3D1F5C", ink:"#F3E9FF", ink2:"#D0B3E6", pri:"#F2A65A", onpri:"#120C1C", priC:"#CC7A2B", onpriC:"#120C1C", sec:"#A485F7", onsec:"#120C1C", sec2:"#C5678D", bdg:"#A485F7", onbdg:"#120C1C", info:"#C5678D", outv:"#4D2F5C", ok:"#F2A65A", err:"#CF6679", warn:"#FFC46B", surfaceDim:"#120C1C", surfaceContainerLowest:"#170F24", surfaceContainerLow:"#1C132A", surfaceContainer:"#281A3C", surfaceContainerHigh:"#34224E", surfaceContainerHighest:"#3D1F5C", surfaceBright:"#4A2B6B" }, "lcars, amber + violet + mauve on aubergine"),
  lcars_blue: mkPal("LCARS Okuda Blue", { bg:"#0C0814", surf:"#161024", surf2:"#281E3D", ink:"#F0E6FF", ink2:"#C5B5E6", pri:"#5599FF", onpri:"#0C0814", priC:"#3366CC", onpriC:"#F0E6FF", sec:"#CC99FF", onsec:"#0C0814", sec2:"#FF9900", bdg:"#5599FF", onbdg:"#0C0814", info:"#CC99FF", outv:"#3D305C", ok:"#5599FF", err:"#FF4444", warn:"#FF9900", surfaceDim:"#0C0814", surfaceContainerLowest:"#110C1B", surfaceContainerLow:"#161024", surfaceContainer:"#1F1731", surfaceContainerHigh:"#281E3D", surfaceContainerHighest:"#32264C", surfaceBright:"#3D305C" }, "lcars, Okuda ice blue + pale purple + gold on dark aubergine"),
  metro: mkPal("Metro Cyan", { bg:"#001A33", surf:"#002448", surf2:"#3D4854", ink:"#F0F8FF", ink2:"#B8CAD6", pri:"#00AEEF", onpri:"#001A33", priC:"#0070ca", onpriC:"#F0F8FF", sec:"#2D89EF", onsec:"#001A33", sec2:"#00AEEF", bdg:"#2D89EF", onbdg:"#001A33", info:"#00AEEF", outv:"#4D5A66", ok:"#00AEEF", err:"#CF6679", warn:"#FFC300", surfaceDim:"#001A33", surfaceContainerLowest:"#001F3D", surfaceContainerLow:"#002448", surfaceContainer:"#0E3054", surfaceContainerHigh:"#1F3D61", surfaceContainerHighest:"#2A486C", surfaceBright:"#3D4854" }, "windows-phone-metro, flat cyan on deep blue"),
  metro_zune: mkPal("Metro Zune Orange", { bg:"#181818", surf:"#242424", surf2:"#333333", ink:"#FFFFFF", ink2:"#CCCCCC", pri:"#D83B01", onpri:"#FFFFFF", priC:"#A02B00", onpriC:"#FFFFFF", sec:"#F0A30A", onsec:"#181818", sec2:"#E35900", bdg:"#D83B01", onbdg:"#FFFFFF", info:"#F0A30A", outv:"#444444", ok:"#D83B01", err:"#CF6679", warn:"#F0A30A", surfaceDim:"#181818", surfaceContainerLowest:"#1E1E1E", surfaceContainerLow:"#242424", surfaceContainer:"#2B2B2B", surfaceContainerHigh:"#333333", surfaceContainerHighest:"#3E3E3E", surfaceBright:"#484848" }, "windows-phone-metro, Zune orange & mango on dark slate"),
  metro_magenta: mkPal("Metro Magenta", { bg:"#000000", surf:"#141414", surf2:"#282828", ink:"#FFFFFF", ink2:"#B3B3B3", pri:"#E0115F", onpri:"#FFFFFF", priC:"#A00040", onpriC:"#FFFFFF", sec:"#D80073", onsec:"#FFFFFF", sec2:"#E0115F", bdg:"#E0115F", onbdg:"#FFFFFF", info:"#E0115F", outv:"#404040", ok:"#E0115F", err:"#FF3366", warn:"#F0A30A", surfaceDim:"#000000", surfaceContainerLowest:"#0A0A0A", surfaceContainerLow:"#141414", surfaceContainer:"#1E1E1E", surfaceContainerHigh:"#282828", surfaceContainerHighest:"#333333", surfaceBright:"#3E3E3E" }, "windows-phone-metro, Windows Phone magenta on pitch black"),
  aero: mkPal("Frutiger Aero", { bg:"#EAF7FF", surf:"#F7FCFF", surf2:"#DDF1FF", ink:"#173A52", ink2:"#34566E", pri:"#39B6F0", onpri:"#173A52", priC:"#A9E6FF", onpriC:"#173A52", sec:"#79D87E", onsec:"#173A52", sec2:"#0A6FA0", bdg:"#0A6FA0", onbdg:"#EAF7FF", info:"#0A6FA0", outv:"#A9C7DA", ok:"#0A6FA0", err:"#BA1A1A", warn:"#8A5A00", surfaceDim:"#D5E8F5", surfaceContainerLowest:"#FFFFFF", surfaceContainerLow:"#F2F9FF", surfaceContainer:"#EAF7FF", surfaceContainerHigh:"#E0F1FD", surfaceContainerHighest:"#DDF1FF", surfaceBright:"#F7FCFF" }, "frutiger-aero, sky and nature, light-first", true),
  navy: mkPal("Navy Gold", { bg:"#0A1630", surf:"#1A2645", surf2:"#2A3655", ink:"#E8E3D8", ink2:"#C9C4B9", pri:"#D4AF37", onpri:"#0A1630", priC:"#715f33", onpriC:"#E8E3D8", sec:"#4A90E2", onsec:"#0A1630", sec2:"#9C8970", bdg:"#4A90E2", onbdg:"#0A1630", info:"#4A90E2", outv:"#44483E", ok:"#D4AF37", err:"#CF6679", warn:"#E0B84C", surfaceDim:"#0A1630", surfaceContainerLowest:"#121E3B", surfaceContainerLow:"#1A2645", surfaceContainer:"#222E4D", surfaceContainerHigh:"#2A3655", surfaceContainerHighest:"#333E5D", surfaceBright:"#3D4766" }, "navy-gold, metallic gold on navy"),
  paper: mkPal("Paper & Ink", { bg:"#F0F0EB", surf:"#FAF9F6", surf2:"#EBEAE4", ink:"#2C2C2C", ink2:"#454545", pri:"#2C2C2C", onpri:"#F0F0EB", priC:"#EBEAE4", onpriC:"#2C2C2C", sec:"#595959", onsec:"#F0F0EB", sec2:"#6B6B6B", bdg:"#2C2C2C", onbdg:"#F0F0EB", info:"#454545", outv:"#C9C9C9", ok:"#2C6B3F", err:"#BA1A1A", warn:"#8A5A00", surfaceDim:"#E2E1DC", surfaceContainerLowest:"#FFFFFF", surfaceContainerLow:"#FAF9F6", surfaceContainer:"#F0F0EB", surfaceContainerHigh:"#EBEAE4", surfaceContainerHighest:"#E5E4DE", surfaceBright:"#FAF9F6" }, "paper-ink, hueless, maximum legibility", true),
  deco: mkPal("Art Deco", { bg:"#0B0A0A", surf:"#141314", surf2:"#232124", ink:"#F3E8D0", ink2:"#C9BDA2", pri:"#D4AF37", onpri:"#0B0A0A", priC:"#977b2f", onpriC:"#0B0A0A", sec:"#F4E7CF", onsec:"#0B0A0A", sec2:"#B8A17A", bdg:"#B8A17A", onbdg:"#0B0A0A", info:"#B8A17A", outv:"#4B4332", ok:"#D4AF37", err:"#FFB4AB", warn:"#E0B84C", surfaceDim:"#0B0A0A", surfaceContainerLowest:"#0F0E0F", surfaceContainerLow:"#141314", surfaceContainer:"#1B191C", surfaceContainerHigh:"#232124", surfaceContainerHighest:"#2C2A2D", surfaceBright:"#353336" }, "art-deco, gold hairlines on ivory-black"),
  noir: mkPal("Neo-Noir Neon", { bg:"#090A10", surf:"#111420", surf2:"#1C2130", ink:"#E7EAF7", ink2:"#B9C0D8", pri:"#aa43ff", onpri:"#090A10", priC:"#4B1D73", onpriC:"#E7EAF7", sec:"#00D1FF", onsec:"#090A10", sec2:"#FF3D9E", bdg:"#00D1FF", onbdg:"#090A10", info:"#00D1FF", outv:"#363D52", ok:"#00D1FF", err:"#FF6B6B", warn:"#FF3D9E", surfaceDim:"#090A10", surfaceContainerLowest:"#0D0F18", surfaceContainerLow:"#111420", surfaceContainer:"#161B28", surfaceContainerHigh:"#1C2130", surfaceContainerHighest:"#23293B", surfaceBright:"#2B3246" }, "neo-noir-neon, violet and cyan glow"),
  emerald: mkPal("Emerald Silver", { bg:"#0D3B2E", surf:"#1A5544", surf2:"#2A6554", ink:"#E8F5E8", ink2:"#C9E4D9", pri:"#C0C0C0", onpri:"#0D3B2E", priC:"#505050", onpriC:"#E8F5E8", sec:"#50C878", onsec:"#0D3B2E", sec2:"#8BA888", bdg:"#50C878", onbdg:"#0D3B2E", info:"#50C878", outv:"#3E4E44", ok:"#50C878", err:"#CF6679", warn:"#E0B84C", surfaceDim:"#0D3B2E", surfaceContainerLowest:"#134839", surfaceContainerLow:"#1A5544", surfaceContainer:"#225D4C", surfaceContainerHigh:"#2A6554", surfaceContainerHighest:"#336E5D", surfaceBright:"#3E7867" }, "emerald-silver, silver on deep emerald"),
  amber: mkPal("Midnight Amber", { bg:"#0C1824", surf:"#15202E", surf2:"#253447", ink:"#E8EEF5", ink2:"#B8C5D6", pri:"#FFBF00", onpri:"#0C1824", priC:"#CC9900", onpriC:"#0C1824", sec:"#D4A76A", onsec:"#0C1824", sec2:"#D4A76A", bdg:"#D4A76A", onbdg:"#0C1824", info:"#D4A76A", outv:"#3D4854", ok:"#FFBF00", err:"#CF6679", warn:"#FFBF00", surfaceDim:"#0C1824", surfaceContainerLowest:"#101C29", surfaceContainerLow:"#15202E", surfaceContainer:"#1B2A3B", surfaceContainerHigh:"#253447", surfaceContainerHighest:"#2E3E53", surfaceBright:"#38495F" }, "midnight-amber, amber on midnight blue"),
  crimson: mkPal("Obsidian Crimson", { bg:"#0A0A0A", surf:"#141414", surf2:"#2D2D2D", ink:"#F5F5F5", ink2:"#D0D0D0", pri:"#DC143C", onpri:"#F5F5F5", priC:"#B00F30", onpriC:"#F5F5F5", sec:"#A8505A", onsec:"#F5F5F5", sec2:"#A8505A", bdg:"#A8505A", onbdg:"#F5F5F5", info:"#D0D0D0", outv:"#3D3D3D", ok:"#DC143C", err:"#FF6B6B", warn:"#DC143C", surfaceDim:"#0A0A0A", surfaceContainerLowest:"#0F0F0F", surfaceContainerLow:"#141414", surfaceContainer:"#1E1E1E", surfaceContainerHigh:"#2D2D2D", surfaceContainerHighest:"#383838", surfaceBright:"#424242" }, "obsidian-crimson, crimson on obsidian"),
  nouveau: mkPal("Art Nouveau", { bg:"#F6F0E6", surf:"#FFF8EE", surf2:"#E7D8C7", ink:"#2C2218", ink2:"#584638", pri:"#7B5737", onpri:"#F6F0E6", priC:"#D9C2A9", onpriC:"#2C2218", sec:"#769762", onsec:"#2C2218", sec2:"#C57C52", bdg:"#769762", onbdg:"#2C2218", info:"#C57C52", outv:"#CBB8A5", ok:"#6B8F57", err:"#BA1A1A", warn:"#C57C52", surfaceDim:"#DFCEBC", surfaceContainerLowest:"#FFFFFF", surfaceContainerLow:"#FFF8EE", surfaceContainer:"#F6F0E6", surfaceContainerHigh:"#EFE6DA", surfaceContainerHighest:"#E7D8C7", surfaceBright:"#FFF8EE" }, "art-nouveau, organic curves, botanical accents, and decorative linework with a warm natural palette", true),
  aurora: mkPal("Aurora Glass Night", { bg:"#0A1224", surf:"#101C33", surf2:"#1D2B4A", ink:"#E7F0FF", ink2:"#B5C7E9", pri:"#6DE8FF", onpri:"#0A1224", priC:"#2A6F85", onpriC:"#E7F0FF", sec:"#8C7CFF", onsec:"#0A1224", sec2:"#7CFFD8", bdg:"#8C7CFF", onbdg:"#0A1224", info:"#7CFFD8", outv:"#334364", ok:"#8C7CFF", err:"#CF6679", warn:"#7CFFD8", surfaceDim:"#0A1224", surfaceContainerLowest:"#0D172B", surfaceContainerLow:"#101C33", surfaceContainer:"#16233E", surfaceContainerHigh:"#1D2B4A", surfaceContainerHighest:"#253557", surfaceBright:"#2E3F64" }, "aurora-glass-night, night-first glass aesthetic with aurora accents and disciplined blur"),
  burgundy: mkPal("Burgundy Rose Gold", { bg:"#2D0F1A", surf:"#3D1525", surf2:"#5C2A3D", ink:"#FFE6ED", ink2:"#E6C0CC", pri:"#B76E79", onpri:"#2D0F1A", priC:"#93575F", onpriC:"#FFE6ED", sec:"#4D1A2A", onsec:"#FFE6ED", sec2:"#C99BA5", bdg:"#4D1A2A", onbdg:"#FFE6ED", info:"#C99BA5", outv:"#6D3F4D", ok:"#4D1A2A", err:"#FFB4AB", warn:"#C99BA5", surfaceDim:"#2D0F1A", surfaceContainerLowest:"#351220", surfaceContainerLow:"#3D1525", surfaceContainer:"#4A1E2F", surfaceContainerHigh:"#5C2A3D", surfaceContainerHighest:"#6B344A", surfaceBright:"#7B3F57" }, "burgundy-rose-gold, rich burgundy with elegant rose gold metallic accents"),
  calm: mkPal("Calm Clinical", { bg:"#F5FAFD", surf:"#FFFFFF", surf2:"#E5EEF4", ink:"#1F394B", ink2:"#445F72", pri:"#38779e", onpri:"#F5FAFD", priC:"#C4DFF2", onpriC:"#1F394B", sec:"#61b48b", onsec:"#1F394B", sec2:"#7D9AB2", bdg:"#61b48b", onbdg:"#1F394B", info:"#7D9AB2", outv:"#B5C8D5", ok:"#4DAA7C", err:"#BA1A1A", warn:"#7D9AB2", surfaceDim:"#D8E5EF", surfaceContainerLowest:"#FFFFFF", surfaceContainerLow:"#FAFDFF", surfaceContainer:"#F5FAFD", surfaceContainerHigh:"#EDF4F9", surfaceContainerHighest:"#E5EEF4", surfaceBright:"#FFFFFF" }, "calm-clinical, low-stress healthcare/admin palette with clear status readability", true),
  charcoal: mkPal("Charcoal Champagne", { bg:"#1F1F1F", surf:"#2A2A2A", surf2:"#3D3D3D", ink:"#F5F5F5", ink2:"#D0D0D0", pri:"#F7E7CE", onpri:"#1F1F1F", priC:"#C5B8A5", onpriC:"#1F1F1F", sec:"#3D3D3D", onsec:"#F5F5F5", sec2:"#D4C4A8", bdg:"#3D3D3D", onbdg:"#F5F5F5", info:"#D4C4A8", outv:"#4D4D4D", ok:"#3D3D3D", err:"#CF6679", warn:"#D4C4A8", surfaceDim:"#1F1F1F", surfaceContainerLowest:"#242424", surfaceContainerLow:"#2A2A2A", surfaceContainer:"#333333", surfaceContainerHigh:"#3D3D3D", surfaceContainerHighest:"#484848", surfaceBright:"#525252" }, "charcoal-champagne, sophisticated charcoal gray with warm champagne accents"),
  deep: mkPal("Deep Purple Platinum", { bg:"#1A0F2E", surf:"#24153D", surf2:"#3D2A5C", ink:"#F0EBFF", ink2:"#D0C0E6", pri:"#E5E4E2", onpri:"#1A0F2E", priC:"#B8B7B5", onpriC:"#1A0F2E", sec:"#2E1A50", onsec:"#F0EBFF", sec2:"#C8BFE0", bdg:"#2E1A50", onbdg:"#F0EBFF", info:"#C8BFE0", outv:"#4D3F6D", ok:"#2E1A50", err:"#CF6679", warn:"#C8BFE0", surfaceDim:"#1A0F2E", surfaceContainerLowest:"#1F1237", surfaceContainerLow:"#24153D", surfaceContainer:"#2F1E4C", surfaceContainerHigh:"#3D2A5C", surfaceContainerHighest:"#48346B", surfaceBright:"#543F7A" }, "deep-purple-platinum, deep purple background with luxurious platinum metallic accents"),
  forest: mkPal("Forest Copper", { bg:"#0D1F0D", surf:"#152915", surf2:"#2A4D2A", ink:"#E8F5E8", ink2:"#B8D9B8", pri:"#B87333", onpri:"#0D1F0D", priC:"#935E29", onpriC:"#E8F5E8", sec:"#1A3D1A", onsec:"#E8F5E8", sec2:"#8FA886", bdg:"#1A3D1A", onbdg:"#E8F5E8", info:"#8FA886", outv:"#3D5A3D", ok:"#1A3D1A", err:"#CF6679", warn:"#8FA886", surfaceDim:"#0D1F0D", surfaceContainerLowest:"#112411", surfaceContainerLow:"#152915", surfaceContainer:"#1F3A1F", surfaceContainerHigh:"#2A4D2A", surfaceContainerHighest:"#345C34", surfaceBright:"#3E6B3E" }, "forest-copper, deep forest green with warm copper metallic accents"),
  rose: mkPal("Rose Gold", { bg:"#3D1F2B", surf:"#4D2F3B", surf2:"#5D3F4B", ink:"#F5E5E8", ink2:"#E5D5D8", pri:"#c1818b", onpri:"#3D1F2B", priC:"#7D4A52", onpriC:"#F5E5E8", sec:"#D4A5A5", onsec:"#3D1F2B", sec2:"#C9A9A9", bdg:"#D4A5A5", onbdg:"#3D1F2B", info:"#C9A9A9", outv:"#4E3A3E", ok:"#D4A5A5", err:"#FFB4AB", warn:"#C9A9A9", surfaceDim:"#3D1F2B", surfaceContainerLowest:"#452733", surfaceContainerLow:"#4D2F3B", surfaceContainer:"#553743", surfaceContainerHigh:"#5D3F4B", surfaceContainerHighest:"#6B4C58", surfaceBright:"#795965" }, "rose-gold, warm and elegant rose gold with burgundy undertones"),
  royalb: mkPal("Royal Bronze", { bg:"#1A0A30", surf:"#220D40", surf2:"#3D1F5C", ink:"#F0E6FF", ink2:"#D0B3E6", pri:"#CD7F32", onpri:"#1A0A30", priC:"#975929", onpriC:"#F0E6FF", sec:"#2D1550", onsec:"#F0E6FF", sec2:"#9B7A5F", bdg:"#2D1550", onbdg:"#F0E6FF", info:"#9B7A5F", outv:"#4D2F5C", ok:"#2D1550", err:"#CF6679", warn:"#9B7A5F", surfaceDim:"#1A0A30", surfaceContainerLowest:"#1E0C38", surfaceContainerLow:"#220D40", surfaceContainer:"#2F1550", surfaceContainerHigh:"#3D1F5C", surfaceContainerHighest:"#4A286B", surfaceBright:"#58327A" }, "royal-bronze, regal deep purple with luxurious bronze metallic accents"),
  royals: mkPal("Royal Silver", { bg:"#1A1535", surf:"#211A40", surf2:"#3D2F5C", ink:"#F0EBFF", ink2:"#C8BFE6", pri:"#C0C0C0", onpri:"#1A1535", priC:"#9A9A9A", onpriC:"#1A1535", sec:"#2A1F50", onsec:"#F0EBFF", sec2:"#A89BC9", bdg:"#2A1F50", onbdg:"#F0EBFF", info:"#A89BC9", outv:"#4D3F66", ok:"#2A1F50", err:"#CF6679", warn:"#A89BC9", surfaceDim:"#1A1535", surfaceContainerLowest:"#1E183B", surfaceContainerLow:"#211A40", surfaceContainer:"#2F244E", surfaceContainerHigh:"#3D2F5C", surfaceContainerHighest:"#493B6B", surfaceBright:"#56467A" }, "royal-silver, royal purple background with elegant silver metallic accents"),
  slatec: mkPal("Slate Cyan", { bg:"#1A1F24", surf:"#232930", surf2:"#3D4854", ink:"#E8F0F5", ink2:"#B8CAD6", pri:"#00D9FF", onpri:"#1A1F24", priC:"#00A8CC", onpriC:"#1A1F24", sec:"#2A333D", onsec:"#E8F0F5", sec2:"#6BA5B8", bdg:"#2A333D", onbdg:"#E8F0F5", info:"#6BA5B8", outv:"#4D5A66", ok:"#2A333D", err:"#CF6679", warn:"#6BA5B8", surfaceDim:"#1A1F24", surfaceContainerLowest:"#1F242A", surfaceContainerLow:"#232930", surfaceContainer:"#2F3842", surfaceContainerHigh:"#3D4854", surfaceContainerHighest:"#475462", surfaceBright:"#526070" }, "slate-cyan, cool modern slate gray with vibrant cyan metallic accents"),
  slateg: mkPal("Slate Gunmetal", { bg:"#1A2029", surf:"#232C38", surf2:"#3D4854", ink:"#E6ECF2", ink2:"#B8C5D6", pri:"#8F9CA8", onpri:"#1A2029", priC:"#7d8a94", onpriC:"#1A2029", sec:"#2D3844", onsec:"#E6ECF2", sec2:"#9DAAB6", bdg:"#2D3844", onbdg:"#E6ECF2", info:"#9DAAB6", outv:"#4D5A66", ok:"#2D3844", err:"#CF6679", warn:"#9DAAB6", surfaceDim:"#1A2029", surfaceContainerLowest:"#1F2631", surfaceContainerLow:"#232C38", surfaceContainer:"#2F3A4A", surfaceContainerHigh:"#3D4854", surfaceContainerHighest:"#475462", surfaceBright:"#526070" }, "slate-gunmetal, industrial slate gray with gunmetal metallic accents"),
  solarpunk: mkPal("Solarpunk Civic", { bg:"#F2FBF4", surf:"#FBFFFC", surf2:"#E2F2E8", ink:"#1E3A27", ink2:"#456355", pri:"#38B56A", onpri:"#1E3A27", priC:"#BFEFD0", onpriC:"#1E3A27", sec:"#4FAEEA", onsec:"#1E3A27", sec2:"#F2C46C", bdg:"#4FAEEA", onbdg:"#1E3A27", info:"#F2C46C", outv:"#B3D0BF", ok:"#4FAEEA", err:"#BA1A1A", warn:"#F2C46C", surfaceDim:"#D5E7DC", surfaceContainerLowest:"#FFFFFF", surfaceContainerLow:"#F8FEFA", surfaceContainer:"#F2FBF4", surfaceContainerHigh:"#EBF6EE", surfaceContainerHighest:"#E2F2E8", surfaceBright:"#FBFFFC" }, "solarpunk-civic, optimistic civic palette with daylight greens and trust-building clarity", true),
};

// Colour packs grouped by family — 24+ packs grouped by aesthetic family.
export const FAMILIES = [
  { name: "TERMINAL & NEON", keys: ["ink", "noir", "metro", "metro_zune", "metro_magenta", "aurora", "slatec"] },
  { name: "CONSOLE & AMBER", keys: ["lcars", "lcars_blue", "amber", "royalb", "forest", "crimson"] },
  { name: "METAL & JEWEL",   keys: ["navy", "deco", "emerald", "royals", "deep", "charcoal", "slateg", "rose", "burgundy"] },
  { name: "DAYLIGHT",        keys: ["aero", "paper", "nouveau", "calm", "solarpunk"] },
];
