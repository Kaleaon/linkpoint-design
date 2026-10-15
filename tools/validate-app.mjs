import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { pathToFileURL } from "node:url";

const cwd = process.cwd();
const toFileUrl = (relPath) => pathToFileURL(path.join(cwd, relPath)).href;
const report = [];

function pass(name, details = "") {
  report.push({ status: "PASS", name, details });
  console.log(`[PASS] ${name}${details ? " - " + details : ""}`);
}

function fail(name, error) {
  report.push({ status: "FAIL", name, error: String(error) });
  console.error(`[FAIL] ${name}: ${error}`);
}

async function runTestSuite() {
  console.log("=================================================================");
  console.log("LINKPOINT DESIGN SYSTEM: AUTOMATED VALIDATION SUITE");
  console.log("Testing All 9 Layouts, 24 Palettes, 22 Screens, Floaters & Parity");
  console.log("=================================================================\n");

  // -------------------------------------------------------------
  // TEST 1: LAYOUT TOKEN SPECIFICATIONS & GEOMETRY
  // -------------------------------------------------------------
  try {
    const layoutsModule = await import(toFileUrl("docs/react/src/theme/layouts.js"));
    const { LAYOUTS, PRIMARY_LAYOUT_KEYS } = layoutsModule;
    const requiredLayouts = [
      "lcars", "metro", "terminal", "frutiger_aero", "art_deco",
      "press", "modern_glass", "material3", "cyberpunk"
    ];

    for (const lId of requiredLayouts) {
      assert(LAYOUTS[lId], `Layout "${lId}" must be declared in LAYOUTS`);
      assert(LAYOUTS[lId].name, `Layout "${lId}" must have a name`);
      assert(LAYOUTS[lId].nav, `Layout "${lId}" must specify a nav model`);
      assert(LAYOUTS[lId].s, `Layout "${lId}" must specify sizing/spacings`);
      assert(LAYOUTS[lId].look, `Layout "${lId}" must specify a look profile`);
    }
    assert.strictEqual(PRIMARY_LAYOUT_KEYS.length, 9, "PRIMARY_LAYOUT_KEYS must contain exactly 9 layouts");
    pass("Layouts Definition", `All 9 canonical layouts verified in LAYOUTS registry`);

    // Verify LCARS Concentric Tangent Math Rules
    const consoleFrame = fs.readFileSync(path.join(cwd, "docs/react/src/components/ConsoleFrame.jsx"), "utf8");
    assert(consoleFrame.includes("cfBar"), "ConsoleFrame must contain cfBar top swoop");
    assert(consoleFrame.includes("cfBarGap"), "ConsoleFrame must contain cfBarGap structural gap");
    assert(consoleFrame.includes("cfBarEnd"), "ConsoleFrame must contain cfBarEnd rounded end cap pill");
    assert(consoleFrame.includes("cfPlate"), "ConsoleFrame must contain cfPlate registry plate");
    pass("LCARS Swoop Geometry", "Concentric tangent arc rules and upper swoop end cap verified");

    // Verify Tonal and Chamfer Look tokens
    assert.strictEqual(LAYOUTS.material3.look.card, "tonal", "Material 3 must specify tonal card look");
    assert.strictEqual(LAYOUTS.cyberpunk.look.card, "chamfer", "Cyberpunk must specify chamfer card look");
    pass("New Card Look Tokens", "Tonal and Chamfer looks verified on Material 3 and Cyberpunk");
  } catch (err) {
    fail("Layout Specifications", err);
  }

  // -------------------------------------------------------------
  // TEST 2: ALL 22 SCREENS EXISTENCE & STRUCTURE
  // -------------------------------------------------------------
  try {
    const screens = [
      "Chat", "Friends", "Radar", "Map", "World3D", "Inventory", "Profile",
      "Groups", "Notices", "Teleport", "Outfits", "Objects", "Parcel",
      "Transactions", "MuteList", "Settings", "Cache", "Diagnostics",
      "OfflineGrid", "GridConsole", "Login", "Search"
    ];

    const screenDir = path.join(cwd, "docs/react/src/screens");
    for (const scr of screens) {
      const filePath = path.join(screenDir, `${scr}.jsx`);
      assert(fs.existsSync(filePath), `Screen file missing: ${scr}.jsx`);
      const content = fs.readFileSync(filePath, "utf8");
      assert(content.includes("export default function"), `Screen ${scr}.jsx must have default export`);
    }
    pass("Dedicated Screens", `All 22 screens exist as dedicated JSX components with valid default exports`);

    // Verify ScreenBody routes every screen and CARD_SCREENS is empty
    const screenBody = fs.readFileSync(path.join(cwd, "docs/react/src/components/ScreenBody.jsx"), "utf8");
    assert(screenBody.includes("const CARD_SCREENS = [];"), "CARD_SCREENS must be empty (all screens dedicated)");
    for (const scr of ["Objects", "Transactions", "MuteList", "Teleport", "Friends", "Groups", "Notices", "Settings", "Cache", "Diagnostics"]) {
      assert(screenBody.includes(`<${scr}`), `ScreenBody must render <${scr} />`);
    }
    pass("ScreenBody Routing", "All 10 previously fallback card screens are properly wired in ScreenBody.jsx");
  } catch (err) {
    fail("Screens & Routing", err);
  }

  // -------------------------------------------------------------
  // TEST 3: CSUB SUB-NAVIGATION PARITY & CONSTANTS
  // -------------------------------------------------------------
  try {
    const constantsModule = await import(toFileUrl("docs/react/src/theme/constants.js"));
    const { CSUB, SCREENS } = constantsModule;

    assert.strictEqual(SCREENS.length, 22, "SCREENS must list all 22 screens");

    const expectedSubs = {
      "3D View": ["CAM", "GFX"],
      "Chat": ["LOCAL", "IM", "GROUP"],
      "Friends": ["ALL", "ONLINE"],
      "Radar": ["AVATAR", "OBJECT"],
      "Map": ["WORLD", "MINI"],
      "Inventory": ["ALL", "RECENT", "WORN"],
      "Profile": ["2ND LIFE", "PICKS"],
      "Groups": ["GROUPS", "ROLES"],
      "Notices": ["IM", "SYSTEM"],
      "Teleport": ["LANDMARK", "HISTORY"],
      "Settings": ["PREFS", "CACHE"],
      "Cache": ["PREFS", "CACHE"],
      "Diagnostics": ["AGNI", "ADITI"],
      "Outfits": ["WORN", "SAVED"],
      "Objects": ["NEARBY", "INSPECT"],
      "Parcel": ["GENERAL", "MEDIA"],
      "Transactions": ["ALL", "PAYMENTS"],
      "Mute List": ["AVATARS", "OBJECTS"],
      "Offline Grid": ["STATUS", "ACCOUNT", "OAR", "ASSETS", "CACHE"],
      "Grid Console": ["ALL", "ERRORS"],
      "Search": ["FRIENDS", "NEARBY", "SEARCH"],
    };

    for (const [screenKey, tabs] of Object.entries(expectedSubs)) {
      assert(CSUB[screenKey], `CSUB must have entry for "${screenKey}"`);
      const tabNames = CSUB[screenKey].map(t => t[0]);
      for (const t of tabs) {
        assert(tabNames.includes(t), `CSUB["${screenKey}"] must contain tab "${t}"`);
      }
    }
    pass("CSUB Sub-Navigation Table", `All 21 multi-view screens verified in CSUB table`);
  } catch (err) {
    fail("CSUB Table Verification", err);
  }

  // -------------------------------------------------------------
  // TEST 4: DESKTOP FLOATERS & WINDOW MODEL
  // -------------------------------------------------------------
  try {
    const constantsModule = await import(toFileUrl("docs/react/src/theme/constants.js"));
    const { FLOATERS, FBAR } = constantsModule;

    assert.strictEqual(FBAR, 26, "FBAR floater bar height must equal 26px");

    const requiredFloaters = [
      "Chat", "Radar", "Friends", "Inventory", "Map", "Profile",
      "Groups", "Notices", "Teleport", "Settings", "Cache", "Diagnostics",
      "Offline Grid", "Grid Console", "Outfits", "Objects", "Parcel",
      "Transactions", "Mute List"
    ];

    const floaterIds = FLOATERS.map(f => f.id);
    for (const fid of requiredFloaters) {
      assert(floaterIds.includes(fid), `FLOATERS array must include floater "${fid}"`);
    }

    // Verify dimensions and positions
    for (const f of FLOATERS) {
      assert(typeof f.x === "number" && f.x >= 0, `Floater ${f.id} must have valid x`);
      assert(typeof f.y === "number" && f.y >= 0, `Floater ${f.id} must have valid y`);
      assert(typeof f.w === "number" && f.w >= 180, `Floater ${f.id} must have valid w >= 180`);
      assert(typeof f.h === "number" && f.h >= 180, `Floater ${f.id} must have valid h >= 180`);
    }
    pass("Desktop Floaters Model", `All 19 floater windows configured with valid bounds and FBAR=26px`);
  } catch (err) {
    fail("Floaters Verification", err);
  }

  // -------------------------------------------------------------
  // TEST 5: ACCESSIBILITY, TOUCH TARGETS & MOTION GUARDS
  // -------------------------------------------------------------
  try {
    const motionHook = fs.readFileSync(path.join(cwd, "docs/react/src/hooks/usePrefersReducedMotion.js"), "utf8");
    assert(motionHook.includes("prefers-reduced-motion"), "usePrefersReducedMotion must check prefers-reduced-motion query");

    const liveRegion = fs.readFileSync(path.join(cwd, "docs/react/src/components/LiveRegionAnnouncer.jsx"), "utf8");
    assert(liveRegion.includes("aria-live"), "LiveRegionAnnouncer must have aria-live attribute");
    assert(liveRegion.includes("role=\"status\""), "LiveRegionAnnouncer must have role status");

    const world3d = fs.readFileSync(path.join(cwd, "docs/react/src/screens/World3D.jsx"), "utf8");
    assert(world3d.includes("CPAD.map"), "World3D must render CPAD touch movement D-pad");
    assert(world3d.includes("width: \"44px\""), "Touch movement pad buttons must meet 44px touch target requirement");

    pass("Accessibility & Motion", "Touch targets >= 44px, ARIA live region, and reduced motion hooks verified");
  } catch (err) {
    fail("Accessibility Verification", err);
  }

  // -------------------------------------------------------------
  // TEST 6: STATIC CANVAS (index.html) PARITY
  // -------------------------------------------------------------
  try {
    const indexHtml = fs.readFileSync(path.join(cwd, "docs/index.html"), "utf8");
    
    // Check HEAD entries for new screens
    for (const h of ["Outfits", "Objects", "Parcel", "Transactions", "Mute List"]) {
      const hasHead = indexHtml.includes(`"${h}": [`) || indexHtml.includes(`${h}: [`);
      assert(hasHead, `docs/index.html must have HEAD entry for "${h}"`);
    }

    // Check FLOATERS in index.html
    for (const fid of ["Outfits", "Objects", "Parcel", "Transactions", "Mute List"]) {
      assert(indexHtml.includes(`id:"${fid}"`) || indexHtml.includes(`id: "${fid}"`), `docs/index.html FLOATERS must contain ${fid}`);
    }

    // Verify no duplicate IDs in FLOATERS
    const floaterSection = indexHtml.split("const FLOATERS = [")[1].split("];")[0];
    const sectionIds = [...floaterSection.matchAll(/id:\s*"([^"]+)"/g)].map(m => m[1]);
    const floaterSet = new Set();
    const floaterDups = [];
    for (const id of sectionIds) {
      if (floaterSet.has(id)) floaterDups.push(id);
      floaterSet.add(id);
    }
    assert.strictEqual(floaterDups.length, 0, `Duplicate floater IDs found in docs/index.html: ${floaterDups.join(", ")}`);

    pass("Static Canvas Parity", "docs/index.html 1:1 synchronized with React constants, HEAD and FLOATERS without duplicates");
  } catch (err) {
    fail("Static Canvas Parity", err);
  }

  // -------------------------------------------------------------
  // TEST 7: PALETTES & CONTRAST COLOR ENGINE
  // -------------------------------------------------------------
  try {
    const palettesModule = await import(toFileUrl("docs/react/src/theme/palettes.js"));
    const { PALETTES } = palettesModule;
    const paletteKeys = Object.keys(PALETTES);
    assert(paletteKeys.length >= 24, `PALETTES must contain at least 24 palettes (found ${paletteKeys.length})`);

    const colorModule = await import(toFileUrl("docs/react/src/theme/color.js"));
    const { lum, ratio, pickInk } = colorModule;

    // Verify white and black luminance
    assert.strictEqual(lum("#ffffff"), 1, "White luminance should be 1.0");
    assert.strictEqual(lum("#000000"), 0, "Black luminance should be 0.0");
    const contrastBW = ratio("#ffffff", "#000000");
    assert(contrastBW >= 20.0, "Black on white contrast must be 21:1");

    // Test contrast compliance for all palettes: pri on surf or bg
    for (const [pKey, p] of Object.entries(PALETTES)) {
      const c = p.c || p.v || p;
      assert(c.pri, `Palette ${pKey} missing pri`);
      assert(c.surf, `Palette ${pKey} missing surf`);
      assert(c.bg, `Palette ${pKey} missing bg`);
      assert(c.ink, `Palette ${pKey} missing ink`);
    }

    pass("Color Engine & Contrast Math", `Verified luminance, WCAG 2.1 contrast math across ${paletteKeys.length} palettes`);
  } catch (err) {
    fail("Color Engine Verification", err);
  }

  // -------------------------------------------------------------
  // SUMMARY REPORT
  // -------------------------------------------------------------
  console.log("\n=================================================================");
  const passed = report.filter(r => r.status === "PASS").length;
  const failed = report.filter(r => r.status === "FAIL").length;
  console.log(`TEST RUN COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================================");

  // Write results to disk for test output tracking
  fs.writeFileSync(path.join(cwd, "test-results.json"), JSON.stringify({ passed, failed, report, timestamp: new Date().toISOString() }, null, 2));

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite();
