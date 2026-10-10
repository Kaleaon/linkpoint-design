import { useCallback, useEffect, useRef, useState } from "react";
import { EventBus, intentReducer } from "../../../shared/eventBus.js";
import { LAYOUTS } from "../theme/layouts.js";
import { PALETTES } from "../theme/palettes.js";
import { DEVICES, FLOATERS, HUD_DEFAULT, HUDS, CBTN, GRIDS } from "../theme/constants.js";
import { CACHE_ROWS, INVENTORY_SOURCE } from "../data/content.js";
import { decodeSharedTheme, encodeSharedTheme, readSavedTheme, sanitizeTheme, themeFromPalette, THEME_STORAGE_KEY } from "../theme/customTheme.js";

// Ported from the mockup's `state = {...}` initializer and its instance
// methods (flR/flDrag/flFocus/flToggle/flClose, hudDrag/toggleHud, T/D/navMode,
// set/setTab/dismiss/toggleSetting/pin/cycle, cf/cTap/cHold/cPress, and the
// tick interval in componentDidMount). This hook is the state + actions layer;
// theme/viewModel.js is the "renderVals()" computation layer that consumes it.
export function useAppState() {
  const [layout, setLayout] = useState("terminal");
  const [palette, setPalette] = useState("ink");
  const [customTheme, setCustomTheme] = useState(() => {
    const shared = decodeSharedTheme(new URLSearchParams(window.location.search).get("theme") || "");
    return shared || readSavedTheme() || themeFromPalette(PALETTES.ink);
  });
  const deviceForViewport = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 1280) return "desk";
    if (width >= 900) return "tab";
    if (width >= 600) return "fold";
    return width >= 400 ? "and" : "ios";
  }, []);
  const [device, setDevice] = useState(deviceForViewport);
  const [screen, setScreen] = useState("Chat");
  const [dialog, setDialog] = useState(null);
  const [dense, setDense] = useState(false);
  const [tabs, setTabs] = useState({ Chat: "LOCAL", Friends: "ALL", Diagnostics: "AGNI" });
  const [chip, setChip] = useState("Nyx Vaher");
  const [tileOk, setTileOk] = useState(true);
  const [invOpen, setInvOpen] = useState({ Objects: true });
  const [invSelectMode, setInvSelectMode] = useState(false);
  const [invSelected, setInvSelected] = useState([]);
  const [invMoveModal, setInvMoveModal] = useState(false);
  const [invItems, setInvItems] = useState(() =>
    INVENTORY_SOURCE.map(([name, icon, depth, parent, ver, tags]) => ({
      name, icon, depth, parent, ver, tags: tags || []
    }))
  );
  const [dismissed, setDismissed] = useState({});
  const [pinned, setPinned] = useState({});
  const [lureState, setLureState] = useState({});
  const [toggles, setToggles] = useState({
    largeType: false, push: true, voice: true, chatCmds: true, autoresponse: true,
    rlv: false, shadows: false, battery: true, timestamps: true, imLogs: true, mediaAuto: false,
    showOnline: true, typingSent: true, cacheOnExit: false,
  });
  // Everything the preferences screens expose as a <select>: one flat bag so a
  // new preference is one entry here plus one card, not a new state key each time.
  const [prefs, setPrefs] = useState(() => {
    let savedVerbosity = "simple";
    try {
      const val = localStorage.getItem("telemetryVerbosity");
      if (val === "simple" || val === "advanced") {
        savedVerbosity = val;
      }
    } catch {}
    return {
      draw: "96 m", quality: "Balanced", fps: "60 fps", complexity: "80 000",
      volume: "70%", translate: "Off", maturity: "Moderate", bandwidth: "1 500 kbps",
      cacheLimit: 512, cacheLoc: "Internal storage",
      telemetryVerbosity: savedVerbosity,
    };
  });
  const [cacheCleared, setCacheCleared] = useState({});
  const [camPreset, setCamPreset] = useState("ORBIT");
  const [cond, setCond] = useState("normal");
  const [hudOn, setHudOn] = useState({ ...HUD_DEFAULT });
  const [hudPos, setHudPos] = useState({});
  const [hudPicker, setHudPicker] = useState(false);
  const [target, setTarget] = useState(null);
  const [targetPicker, setTargetPicker] = useState(false);
  const [navPeek, setNavPeek] = useState(false);
  const [cPad, setCPad] = useState(true);
  const [cHeld, setCHeld] = useState("");
  const [cRun, setCRun] = useState(false);
  const [cCam, setCCam] = useState("ORBIT");
  const [cHdg, setCHdg] = useState(214);
  const [cPitch, setCPitch] = useState(0);
  const [cDrag, setCDrag] = useState(false);
  const [cEdit, setCEdit] = useState(false);
  const [cFlash, setCFlash] = useState("");
  const [cReason, setCReason] = useState("");
  const [cTog, setCTog] = useState({});
  const [rMode, setRMode] = useState("AV");
  const [rOpen, setROpen] = useState(null);
  const [rMenu, setRMenu] = useState(null);
  const [cDock, setCDock] = useState(["fly", "sit", "snap", "mini", "inv", "home", "ao", "sun"]);
  const [flOpen, setFlOpen] = useState({ Chat: true, Radar: true, Friends: true, Inventory: true, Map: true });
  const [flMin, setFlMin] = useState({});
  const [flRect, setFlRect] = useState({});
  const [flZ, setFlZ] = useState(["Map", "Inventory", "Friends", "Radar", "Chat"]);
  const [menu, setMenu] = useState(null);
  const [tick, setTick] = useState(0);
  const [loginMode, setLoginModeState] = useState("grid");
  const [loginGrid, setLoginGrid] = useState("agni");
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [customGrids, setCustomGrids] = useState([]);
  const [addGrid, setAddGrid] = useState(false);
  const [addGridName, setAddGridName] = useState("");
  const [addGridHost, setAddGridHost] = useState("");
  const [searchFrom, setSearchFrom] = useState("Friends");
  const [offlineRunning, setOfflineRunning] = useState(true);
  const [offlineUser, setOfflineUser] = useState({ firstName: "Jane", lastName: "Doe" });
  const [offlineAccountModal, setOfflineAccountModal] = useState(false);
  const [offlineAccountFirstName, setOfflineAccountFirstName] = useState("Jane");
  const [offlineAccountLastName, setOfflineAccountLastName] = useState("Doe");
  const [offlineAccountPassword, setOfflineAccountPassword] = useState("");
  const [oarFile] = useState("A1_Grid_Region_v2.oar");
  const [oarRegionName] = useState("Welcome Island");
  const [oarCoords] = useState("1000, 1000");
  const [oarPrims] = useState(1420);
  const [assetName, setAssetName] = useState("Grass Texture");
  const [assetType, setAssetType] = useState("Texture");
  const [localAssets, setLocalAssets] = useState([
    { id: "ast-1", name: "Grass Texture 1024", type: "Texture", size: "2.1 MB", uuid: "e84d72a9-1102-4211-9a99-0a8811f3d82a" },
    { id: "ast-2", name: "Ambient Forest Sound", type: "Sound", size: "512 KB", uuid: "f32a0018-912c-491a-b118-2993881023a1" }
  ]);
  const [offlineCacheSize, setOfflineCacheSize] = useState(1024);
  const [consoleLevel, setConsoleLevel] = useState("ALL");
  const [consoleQuery, setConsoleQuery] = useState("");
  const [consoleAutoscroll, setConsoleAutoscroll] = useState(true);
  const [consoleLogs, setConsoleLogs] = useState([
    { ts: "16:30:33,123", level: "INFO", tag: "[LOGIN SERVICE]", msg: "User Jane Doe authenticated via XML-RPC." },
    { ts: "16:30:35,456", level: "INFO", tag: "[SCENE]", msg: "Region Welcome Island loaded 1420 prims from OAR archive." },
    { ts: "16:31:02,890", level: "WARN", tag: "[ASSET SERVICE]", msg: "Texture 89a2f1... fetch took > 1500ms." },
    { ts: "16:32:10,012", level: "ERROR", tag: "[HYPERGRID]", msg: "Unable to resolve remote grid link test.osgrid.org:8002." },
    { ts: "16:33:01,500", level: "INFO", tag: "[LOCAL GRID]", msg: "Grid listener active on 127.0.0.1:9000." }
  ]);
  const [searchTab, setSearchTab] = useState("FRIENDS");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchState, setSearchState] = useState({});
  const [reconnecting, setReconnecting] = useState(false);
  const [toast, setToast] = useState("");
  const [lindenBalance, setLindenBalance] = useState(4250);
  const [exchangeRate, setExchangeRate] = useState(248.5);
  const [lastSyncedAt, setLastSyncedAt] = useState(() => new Date());

  // ---- Centralized Recovery State Machine & Async Queries ----------------
  const [recoveryState, setRecoveryState] = useState("idle"); // "idle" | "detecting" | "reconnecting" | "recovered" | "failed"
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [nextRetryDelay, setNextRetryDelay] = useState(1000);
  const [asyncQueryState, setAsyncQueryState] = useState({
    search: { status: "idle", loading: false, error: null },
    inventory: { status: "idle", loading: false, error: null },
  });

  const recoverySubscribersRef = useRef(new Set());
  const recoveryTimerRef = useRef(null);
  const healthCheckTimerRef = useRef(null);
  const offlineRunningRef = useRef(offlineRunning);

  useEffect(() => {
    offlineRunningRef.current = offlineRunning;
  }, [offlineRunning]);

  const emitRecoveryEvent = useCallback((event) => {
    const payload = { ...event, timestamp: new Date() };
    recoverySubscribersRef.current.forEach((cb) => {
      try {
        cb(payload);
      } catch (err) {
        console.error("Error in recovery event subscriber:", err);
      }
    });
  }, []);

  const subscribeRecoveryEvent = useCallback((cb) => {
    recoverySubscribersRef.current.add(cb);
    return () => {
      recoverySubscribersRef.current.delete(cb);
    };
  }, []);

  const addDiagnosticLog = useCallback((level, tag, msg) => {
    const ts = new Date().toLocaleTimeString() + "," + String(Math.floor(Math.random() * 899 + 100));
    setConsoleLogs((prev) => [...prev, { ts, level, tag, msg }]);
  }, []);

  // ---- tick clock (componentDidMount's setInterval) ---------------------
  useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  // Form factor is an implementation concern in the real app. The design
  // canvas exposes a manual device picker, but the React port follows its host
  // viewport and changes navigation/layout at the same breakpoints instead.
  useEffect(() => {
    const syncDevice = () => setDevice(deviceForViewport());
    window.addEventListener("resize", syncDevice);
    return () => window.removeEventListener("resize", syncDevice);
  }, [deviceForViewport]);

  // ---- timers / drag refs (were plain `this.x` fields on the class) -----
  const eventBusRef = useRef(new EventBus());
  const cflRef = useRef(null); // console-nav tap flash timeout
  const clpRef = useRef(null); // console dock long-press-to-edit timeout
  const rlpRef = useRef(null); // radar row long-press timeout
  const lpFiredRef = useRef(false);
  const lxRef = useRef(0);
  const lyRef = useRef(0);
  const loginTimerRef = useRef(null);
  const searchTimerRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const toastTimerRef = useRef(null);
  const pollTimerRef = useRef(null);

  useEffect(
    () => () => {
      clearTimeout(cflRef.current);
      clearTimeout(clpRef.current);
      clearTimeout(rlpRef.current);
      clearTimeout(loginTimerRef.current);
      clearTimeout(searchTimerRef.current);
      clearTimeout(reconnectTimerRef.current);
      clearTimeout(toastTimerRef.current);
      clearTimeout(recoveryTimerRef.current);
      clearInterval(pollTimerRef.current);
      clearInterval(healthCheckTimerRef.current);
    },
    []
  );

  // ---- background 30-second balance polling & sync -----------------------
  useEffect(() => {
    const pollInterval = setInterval(() => {
      setLastSyncedAt(new Date());
    }, 30000);
    pollTimerRef.current = pollInterval;
    return () => clearInterval(pollInterval);
  }, []);

  // ---- transient acknowledgement toast (notify) --------------------------
  // Ported from the mockup's `notify(msg)` — the shared feedback channel for
  // actions that don't have a more specific effect (dialog buttons, header
  // icons, map/profile/inventory taps, …).
  const notify = useCallback((msg) => {
    clearTimeout(toastTimerRef.current);
    setToast(msg);
    toastTimerRef.current = setTimeout(() => setToast(""), 2200);
  }, []);

  const getBackoffDelay = useCallback((attempt) => {
    return Math.min(1000 * Math.pow(2, Math.max(0, attempt - 1)), 16000);
  }, []);

  const cancelRecovery = useCallback(() => {
    clearTimeout(recoveryTimerRef.current);
    setRecoveryState("idle");
    setReconnectAttempts(0);
    addDiagnosticLog("INFO", "[RECOVERY SERVICE]", "Recovery sequence cancelled by resident.");
    notify("[Recovery] Auto-reconnection cancelled.");
    emitRecoveryEvent({ type: "RECOVERY_CANCELLED" });
  }, [addDiagnosticLog, notify, emitRecoveryEvent]);

  const resetRecovery = useCallback(() => {
    clearTimeout(recoveryTimerRef.current);
    setRecoveryState("idle");
    setReconnectAttempts(0);
    setNextRetryDelay(1000);
    emitRecoveryEvent({ type: "RECOVERY_RESET" });
  }, [emitRecoveryEvent]);

  const attemptReconnection = useCallback((attemptNum) => {
    setReconnectAttempts(attemptNum);
    setRecoveryState("reconnecting");
    const delay = getBackoffDelay(attemptNum);
    setNextRetryDelay(delay);

    addDiagnosticLog(
      "INFO",
      "[RECOVERY SERVICE]",
      "Auto-reconnect attempt #" + attemptNum + " pinging 127.0.0.1:9000..."
    );
    emitRecoveryEvent({ type: "RECONNECT_ATTEMPT", attempt: attemptNum, delay });

    const isOnline = offlineRunningRef.current;

    if (isOnline) {
      setRecoveryState("recovered");
      setReconnectAttempts(0);
      addDiagnosticLog(
        "INFO",
        "[RECOVERY SERVICE]",
        "Reconnection successful on attempt #" + attemptNum + ". Server 127.0.0.1:9000 reachable."
      );
      notify("[Recovery] Reconnected to OpenSim local grid.");
      emitRecoveryEvent({ type: "RECOVERY_SUCCESS", attempt: attemptNum });

      setTimeout(() => {
        setRecoveryState("idle");
      }, 2000);
    } else {
      if (attemptNum < 5) {
        addDiagnosticLog(
          "WARN",
          "[RECOVERY SERVICE]",
          "Attempt #" + attemptNum + " failed (connection refused). Next retry in " + delay / 1000 + "s."
        );
        notify("[Recovery] Attempt #" + attemptNum + " failed. Retrying in " + delay / 1000 + "s...");

        recoveryTimerRef.current = setTimeout(() => {
          attemptReconnection(attemptNum + 1);
        }, delay);
      } else {
        setRecoveryState("failed");
        addDiagnosticLog(
          "ERROR",
          "[RECOVERY SERVICE]",
          "Max reconnection attempts (" + attemptNum + ") reached. Local server offline."
        );
        notify("[Recovery Error] Server reconnect failed after " + attemptNum + " attempts.");
        emitRecoveryEvent({ type: "RECOVERY_FAILED", attempt: attemptNum });
      }
    }
  }, [getBackoffDelay, addDiagnosticLog, notify, emitRecoveryEvent]);

  const triggerRecovery = useCallback((reason = "Server disconnect detected") => {
    clearTimeout(recoveryTimerRef.current);
    setRecoveryState("detecting");
    addDiagnosticLog("WARN", "[RECOVERY SERVICE]", reason + " - Initiating exponential backoff recovery.");
    notify("[Recovery] " + reason + ". Reconnecting...");
    emitRecoveryEvent({ type: "RECOVERY_STARTED", reason });

    recoveryTimerRef.current = setTimeout(() => {
      attemptReconnection(1);
    }, 500);
  }, [addDiagnosticLog, notify, emitRecoveryEvent, attemptReconnection]);

  // ---- background health check poller (Requirement 2) -------------------
  useEffect(() => {
    const healthPoller = setInterval(() => {
      const isOnline = offlineRunningRef.current;
      if (!isOnline && recoveryState === "idle") {
        triggerRecovery("OpenSim endpoint unreachable");
      }
    }, 3000);
    healthCheckTimerRef.current = healthPoller;
    return () => clearInterval(healthPoller);
  }, [recoveryState, triggerRecovery]);

  // ---- Centralized Async Query Manager (Requirement 4) ------------------
  const runAsyncQuery = useCallback((queryKey, queryFn, timeoutMs = 2500) => {
    setAsyncQueryState((prev) => ({
      ...prev,
      [queryKey]: { status: "loading", loading: true, error: null }
    }));
    emitRecoveryEvent({ type: "ASYNC_QUERY_STARTED", queryKey });

    return new Promise((resolve, reject) => {
      let isSettled = false;

      const timer = setTimeout(() => {
        if (isSettled) return;
        isSettled = true;
        setAsyncQueryState((prev) => ({
          ...prev,
          [queryKey]: { status: "timeout", loading: false, error: "Query timed out after " + timeoutMs + "ms" }
        }));
        addDiagnosticLog("WARN", "[ASYNC QUERY]", queryKey + " query timed out (" + timeoutMs + "ms). Recovery state injected.");
        notify("[Query Timeout] " + queryKey + " query timed out. Injected recovery fallback.");
        emitRecoveryEvent({ type: "ASYNC_QUERY_TIMEOUT", queryKey });
        reject(new Error("Query timed out"));
      }, timeoutMs);

      try {
        const resultPromise = typeof queryFn === "function" ? queryFn() : Promise.resolve(queryFn);
        Promise.resolve(resultPromise)
          .then((res) => {
            if (isSettled) return;
            isSettled = true;
            clearTimeout(timer);
            setAsyncQueryState((prev) => ({
              ...prev,
              [queryKey]: { status: "success", loading: false, error: null, data: res }
            }));
            emitRecoveryEvent({ type: "ASYNC_QUERY_SUCCESS", queryKey });
            resolve(res);
          })
          .catch((err) => {
            if (isSettled) return;
            isSettled = true;
            clearTimeout(timer);
            const errStr = err?.message || "Async query error";
            setAsyncQueryState((prev) => ({
              ...prev,
              [queryKey]: { status: "error", loading: false, error: errStr }
            }));
            addDiagnosticLog("ERROR", "[ASYNC QUERY]", queryKey + " query failed: " + errStr);
            notify("[Query Error] " + queryKey + ": " + errStr);
            emitRecoveryEvent({ type: "ASYNC_QUERY_ERROR", queryKey, error: errStr });
            reject(err);
          });
      } catch (err) {
        if (isSettled) return;
        isSettled = true;
        clearTimeout(timer);
        const errStr = err?.message || "Execution exception";
        setAsyncQueryState((prev) => ({
          ...prev,
          [queryKey]: { status: "error", loading: false, error: errStr }
        }));
        emitRecoveryEvent({ type: "ASYNC_QUERY_ERROR", queryKey, error: errStr });
        reject(err);
      }
    });
  }, [addDiagnosticLog, notify, emitRecoveryEvent]);

  const retryAsyncQuery = useCallback((queryKey, queryFn, timeoutMs) => {
    return runAsyncQuery(queryKey, queryFn, timeoutMs);
  }, [runAsyncQuery]);

  const setThemeColor = useCallback((key, value) => setCustomTheme((theme) => ({ ...theme, active: true, colors: { ...theme.colors, [key]: value } })), []);
  const renameTheme = useCallback((name) => setCustomTheme((theme) => ({ ...theme, active: true, name })), []);
  const selectPalette = useCallback((key) => { setPalette(key); setCustomTheme(themeFromPalette(PALETTES[key])); }, []);
  const saveTheme = useCallback(() => { localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(customTheme)); notify("Theme saved to this device."); }, [customTheme, notify]);
  const resetTheme = useCallback(() => { setCustomTheme(themeFromPalette(PALETTES[palette])); localStorage.removeItem(THEME_STORAGE_KEY); notify("Theme reset to the selected colour pack."); }, [palette, notify]);
  const importTheme = useCallback(async (json) => {
    try { const imported = sanitizeTheme(JSON.parse(json)); if (!imported) throw new Error(); setCustomTheme(imported); notify(`Imported “${imported.name}”.`); return true; }
    catch { notify("That file is not a valid Linkpoint theme."); return false; }
  }, [notify]);
  const downloadTheme = useCallback(() => {
    const blob = new Blob([JSON.stringify(customTheme, null, 2)], { type: "application/json" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `${customTheme.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "linkpoint-theme"}.json`; link.click(); URL.revokeObjectURL(link.href);
    notify("Theme JSON exported.");
  }, [customTheme, notify]);
  const shareTheme = useCallback(async () => {
    const url = new URL(window.location.href); url.searchParams.set("theme", encodeSharedTheme(customTheme));
    try { await navigator.clipboard.writeText(url.toString()); notify("Share link copied."); }
    catch { window.prompt("Copy this theme link", url.toString()); }
  }, [customTheme, notify]);

  // ---- derived lookups (T()/D()/navMode()) -------------------------------
  const T = useCallback(() => {
    const L = LAYOUTS[layout],
      P = PALETTES[palette];
    return {
      name: L.name + " / " + P.name,
      nav: L.nav,
      font: L.font,
      dfont: L.dfont,
      note: L.note + "   Colour pack: " + P.note + ".",
      v: { ...P.c, ...L.s },
    };
  }, [layout, palette]);

  const D = useCallback(() => DEVICES[device], [device]);

  const navMode = useCallback(() => {
    const t = T(),
      d = D();
    if (d.desk) return "floaters";
    if (t.nav === "SWEEP") return "sweep";
    if (d.split) return "rail";
    return t.nav === "TILES" ? "tiles" : t.nav === "RAIL" && d.w > 700 ? "rail" : "tabs";
  }, [T, D]);

  // ---- simple setters (set/setTab/dismiss/toggleSetting/pin/cycle) ------
  const setTab = useCallback((scr, v) => setTabs((s) => ({ ...s, [scr]: v })), []);
  const dismiss = useCallback((key) => setDismissed((s) => ({ ...s, [key]: true })), []);
  const toggleSetting = useCallback((key) => setToggles((s) => ({ ...s, [key]: !s[key] })), []);
  const setTelemetryVerbosity = useCallback((mode) => {
    const validMode = mode === "advanced" ? "advanced" : "simple";
    setPrefs((s) => ({ ...s, telemetryVerbosity: validMode }));
    try {
      localStorage.setItem("telemetryVerbosity", validMode);
    } catch {}
  }, []);
  const setPref = useCallback((key, v) => {
    if (key === "telemetryVerbosity") {
      setTelemetryVerbosity(v);
    } else {
      setPrefs((s) => ({ ...s, [key]: v }));
    }
  }, [setTelemetryVerbosity]);
  const pin = useCallback((key) => setPinned((s) => ({ ...s, [key]: !s[key] })), []);
  const respondLure = useCallback((lureId, response, regionName, coords) => {
    setLureState((s) => ({ ...s, [lureId]: response }));
    if (response === "accepted") {
      if (loginMode === "offline") {
        notify("Cannot accept teleport lure while offline");
      } else {
        notify(`Teleporting to ${regionName || "destination"} ${coords || ""}…`);
        setScreen("Map");
      }
    } else {
      notify("Teleport lure declined");
    }
  }, [loginMode, notify]);
  const teleportToRegion = useCallback((regionName, coords) => {
    if (loginMode === "offline") {
      notify("Cannot teleport while offline");
      return;
    }
    notify(`Teleporting to ${regionName || "region"} ${coords || ""}…`);
    setScreen("Map");
  }, [loginMode, notify]);
  const saveLandmark = useCallback((name) => {
    const k = name.toLowerCase().replace(/[^a-z0-9]+/g, "");
    setPinned((s) => {
      const isPinned = !s[k];
      notify(isPinned ? `Landmark saved to Inventory: ${name}` : `Landmark removed: ${name}`);
      return { ...s, [k]: isPinned };
    });
  }, [notify]);
  const cycleLayout = useCallback(() => {
    const ks = Object.keys(LAYOUTS);
    setLayout((cur) => ks[(ks.indexOf(cur) + 1) % ks.length]);
  }, []);
  const cyclePalette = useCallback(() => {
    const ks = Object.keys(PALETTES);
    const next = ks[(ks.indexOf(palette) + 1) % ks.length];
    setPalette(next);
    setCustomTheme(themeFromPalette(PALETTES[next]));
  }, [palette]);

  // ---- login (setLoginMode/setLoginGrid/connectLogin) --------------------
  // All known grids: the built-in Second Life / OpenSim presets plus
  // whatever the resident has added themselves this session.
  const allGrids = useCallback(() => GRIDS.concat(customGrids), [customGrids]);
  const setLoginMode = useCallback((m) => {
    setLoginModeState(m);
    setLoginError(null);
  }, []);
  const connectLogin = useCallback(() => {
    setLoginBusy((busy) => {
      if (busy) return busy;
      clearTimeout(loginTimerRef.current);
      loginTimerRef.current = setTimeout(() => {
        setLoginBusy(false);
        setLoginError(loginMode === "grid" ? "Unable to reach " + (allGrids().find((g) => g.key === loginGrid) || GRIDS[0]).host + " — check your connection and try again." : null);
      }, 900);
      return true;
    });
    setLoginError(null);
  }, [loginMode, loginGrid, allGrids]);

  // ---- login: add a custom grid ------------------------------------------
  // A resident can point the viewer at any OpenSim grid, not just the
  // built-in presets — this is the mockup's "add custom grid URI" flow.
  const openAddGrid = useCallback(() => {
    setAddGrid(true);
    setAddGridName("");
    setAddGridHost("");
  }, []);
  const cancelAddGrid = useCallback(() => setAddGrid(false), []);
  const saveCustomGrid = useCallback(() => {
    const name = addGridName.trim(),
      host = addGridHost.trim();
    if (!name || !host) {
      notify("Grid name and login URI are both required");
      return;
    }
    const key =
      "custom-" +
      name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 24) +
      "-" +
      (customGrids.length + 1);
    setCustomGrids((g) => g.concat([{ key, label: name, host }]));
    setLoginGrid(key);
    setAddGrid(false);
    notify("Added grid — " + name);
  }, [addGridName, addGridHost, customGrids]);

  // ---- resident search (openSearch/searchAdd) -----------------------------
  // `tab` picks which of the picker's three panes opens first: FRIENDS (the
  // contacts list, default — matches a real SL viewer's "start a conversation"
  // flow), NEARBY (radar-range residents), or SEARCH (grid-wide name lookup).
  const openSearch = useCallback((from, tab = "FRIENDS") => {
    setSearchFrom(from);
    setSearchTab(tab);
    setSearchQuery("");
    setScreen("Search");
  }, []);
  const searchAdd = useCallback((name) => {
    setSearchState((s) => ({ ...s, [name]: "sending" }));
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => setSearchState((s) => ({ ...s, [name]: "sent" })), 700);
  }, []);
  // Start (or resume) an IM thread with a resident picked from Friends/Nearby.
  const startIm = useCallback((name) => {
    setTabs((s) => ({ ...s, Chat: "IM" }));
    setChip(name);
    setScreen("Chat");
  }, []);

  // ---- cache management ---------------------------------------------------
  const clearCache = useCallback(
    (key, name) => {
      setCacheCleared((c) => ({ ...c, [key]: true }));
      notify(name + " cleared \u2014 assets refetch on demand");
    },
    [notify]
  );
  const clearAllCache = useCallback(() => {
    setCacheCleared(Object.fromEntries(CACHE_ROWS.map((r) => [r.key, true])));
    notify("All caches cleared \u2014 assets refetch on demand");
  }, [notify]);

  // ---- settings: reconnect to grid ---------------------------------------
  const reconnect = useCallback(() => {
    setReconnecting(true);
    clearTimeout(reconnectTimerRef.current);
    reconnectTimerRef.current = setTimeout(() => setReconnecting(false), 1200);
  }, []);

  // ---- desktop floater window model (flR/flDrag/flFocus/flToggle/flClose) --
  const flR = useCallback(
    (id) => {
      const f = FLOATERS.find((x) => x.id === id) || { x: 24, y: 24, w: 320, h: 240 };
      return { ...f, ...(flRect[id] || {}) };
    },
    [flRect]
  );

  // Focusing a window has to open it as well: only five floaters start open, so
  // navigating to Preferences/Groups/Notices/Teleport/Profile/Statistics on Desktop
  // used to raise and un-minimise a window that was never opened — the screen
  // simply did not change.
  const flFocus = useCallback((id) => {
    if (id !== "Inventory") {
      setInvSelectMode(false);
      setInvSelected([]);
      setInvMoveModal(false);
    }
    setFlOpen((o) => (o[id] ? o : { ...o, [id]: true }));
    setFlZ((z) => z.filter((x) => x !== id).concat(id));
    setScreen(id);
    setFlMin((m) => ({ ...m, [id]: false }));
    setMenu(null);
  }, []);

  const flDrag = useCallback(
    (id, e, mode) => {
      e.preventDefault();
      e.stopPropagation();
      const r = flR(id),
        sx = e.clientX,
        sy = e.clientY;
      const move = (ev) => {
        const dx = ev.clientX - sx,
          dy = ev.clientY - sy;
        const n =
          mode === "size"
            ? { x: r.x, y: r.y, w: Math.max(216, r.w + dx), h: Math.max(96, r.h + dy) }
            : { x: Math.max(0, r.x + dx), y: Math.max(0, r.y + dy), w: r.w, h: r.h };
        setFlRect((st) => ({ ...st, [id]: n }));
      };
      const up = () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
      flFocus(id);
    },
    [flR, flFocus]
  );

  const flToggle = useCallback(
    (id) => {
      setFlOpen((open) => {
        const isMin = flMin[id];
        if (open[id] && !isMin) {
          setFlMin((m) => ({ ...m, [id]: true }));
          setMenu(null);
          return open;
        }
        setFlMin((m) => ({ ...m, [id]: false }));
        setFlZ((z) => z.filter((x) => x !== id).concat(id));
        setScreen(id);
        setMenu(null);
        return { ...open, [id]: true };
      });
    },
    [flMin]
  );

  const flClose = useCallback((id) => {
    setFlOpen((o) => ({ ...o, [id]: false }));
    setMenu(null);
  }, []);

  // ---- worn HUDs (hudDrag/toggleHud) -------------------------------------
  const hudDrag = useCallback(
    (id, e) => {
      const start = hudPos[id] || { x: (HUDS.find((h) => h.id === id) || {}).x || 12, y: (HUDS.find((h) => h.id === id) || {}).y || 90 };
      const sx = e.clientX,
        sy = e.clientY;
      const move = (ev) => setHudPos((s) => ({ ...s, [id]: { x: start.x + (ev.clientX - sx), y: start.y + (ev.clientY - sy) } }));
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      e.preventDefault();
    },
    [hudPos]
  );
  const toggleHud = useCallback((id) => setHudOn((s) => ({ ...s, [id]: !s[id] })), []);

  // ---- console frame geometry (cf()) -------------------------------------
  const cf = useCallback(() => {
    const d = D(),
      wide = !!d.split && !d.desk;
    const gap = 4,
      cur = wide ? 64 : 40;
    return { gap, cur, rad: cur - gap, rail: wide ? 132 : 84, bar: wide ? 104 : 70, dock: wide ? 58 : 52, foot: wide ? 36 : 30, wide };
  }, [D]);

  const cTap = useCallback((id) => {
    clearTimeout(cflRef.current);
    setScreen(id);
    setCFlash(id);
    cflRef.current = setTimeout(() => setCFlash(""), 200);
  }, []);

  const cHold = useCallback((k) => {
    if (k === "run") setCRun((r) => !r);
    else if (k === "cam") setCCam((c) => (c === "ORBIT" ? "MOUSELOOK" : "ORBIT"));
    else setCHeld(k);
  }, []);

  const cPress = useCallback((k) => {
    const b = CBTN[k];
    if (b.off) {
      setCReason("DENIED — " + b.off);
      return;
    }
    if (b.tog) {
      setCTog((s) => ({ ...s, [k]: !s[k] }));
      setCReason("");
    } else setCReason(b.label + " — ACKNOWLEDGED");
  }, []);

  // ---- console scene drag (sceneDown/sceneMove/sceneUp) ------------------
  const sceneDown = useCallback((e) => {
    lxRef.current = e.clientX;
    lyRef.current = e.clientY;
    setCDrag(true);
  }, []);
  const sceneMove = useCallback(
    (e) => {
      if (!cDrag) return;
      const dx = e.clientX - lxRef.current,
        dy = e.clientY - lyRef.current;
      lxRef.current = e.clientX;
      lyRef.current = e.clientY;
      setCHdg((h) => h + dx * 0.35);
      setCPitch((p) => Math.max(-70, Math.min(70, p + dy * 0.5)));
    },
    [cDrag]
  );
  const sceneUp = useCallback(() => setCDrag((d) => (d ? false : d)), []);

  // ---- console dock hold-to-edit / radar long-press ----------------------
  const holdStart = useCallback(() => {
    clpRef.current = setTimeout(() => setCEdit(true), 480);
  }, []);
  const holdEnd = useCallback(() => clearTimeout(clpRef.current), []);
  const endEdit = useCallback(() => setCEdit(false), []);
  const togglePad = useCallback(() => setCPad((p) => !p), []);
  const toggleRun = useCallback(() => setCRun((r) => !r), []);
  const flyUpDown = useCallback(() => setCHeld("up"), []);
  const flyDnDown = useCallback(() => setCHeld("dn"), []);
  const flyRelease = useCallback(() => setCHeld(""), []);
  const addSlot = useCallback(() => {
    setCDock((dock) => {
      const miss = Object.keys(CBTN).filter((k) => dock.indexOf(k) < 0);
      if (!miss.length) {
        setCReason("PALETTE EMPTY");
        return dock;
      }
      return dock.concat(miss[0]);
    });
  }, []);
  const removeDockSlot = useCallback((k) => setCDock((d) => d.filter((x) => x !== k)), []);

  const radarTap = useCallback((id) => {
    if (lpFiredRef.current) {
      lpFiredRef.current = false;
      return;
    }
    setROpen((cur) => (cur === id ? null : id));
    setRMenu(null);
  }, []);
  const radarHold = useCallback((id) => {
    rlpRef.current = setTimeout(() => {
      lpFiredRef.current = true;
      setRMenu(id);
      setROpen(null);
    }, 460);
  }, []);
  const radarRelease = useCallback(() => clearTimeout(rlpRef.current), []);
  const radarBlipPick = useCallback((name) => {
    setROpen((cur) => (cur === name ? null : name));
    setRMenu(null);
  }, []);

  const toggleInvFolder = useCallback((name) => {
    setInvOpen((st) => ({ ...st, [name]: !(st[name] !== false) }));
  }, []);

  const toggleInvSelectMode = useCallback(() => {
    setInvSelectMode((mode) => {
      if (mode) {
        setInvSelected([]);
        setInvMoveModal(false);
      }
      return !mode;
    });
  }, []);

  const toggleInvSelectedItem = useCallback((itemName) => {
    setInvSelectMode(true);
    setInvSelected((prev) =>
      prev.includes(itemName)
        ? prev.filter((i) => i !== itemName)
        : [...prev, itemName]
    );
  }, []);

  const invLongPressItem = useCallback((itemName) => {
    setInvSelectMode(true);
    setInvSelected((prev) => (prev.includes(itemName) ? prev : [...prev, itemName]));
  }, []);

  const invWearSelected = useCallback(() => {
    setInvSelected((sel) => {
      const count = sel.length;
      if (count > 0) {
        notify("Equipped " + count + " selected item" + (count > 1 ? "s" : ""));
      }
      return [];
    });
    setInvSelectMode(false);
  }, [notify]);

  const invOpenMoveModal = useCallback(() => {
    setInvMoveModal(true);
  }, []);

  const invCloseMoveModal = useCallback(() => {
    setInvMoveModal(false);
  }, []);

  const invMoveSelected = useCallback((targetFolder) => {
    setInvSelected((sel) => {
      const count = sel.length;
      if (count > 0) {
        setInvItems((items) =>
          items.map((item) =>
            sel.includes(item.name)
              ? { ...item, parent: targetFolder, depth: 2 }
              : item
          )
        );
        notify("Moved " + count + " item" + (count > 1 ? "s" : "") + " to " + targetFolder);
      }
      return [];
    });
    setInvMoveModal(false);
    setInvSelectMode(false);
  }, [notify]);

  const invDeleteSelected = useCallback(() => {
    setInvSelected((sel) => {
      const count = sel.length;
      if (count > 0) {
        setInvItems((items) =>
          items.map((item) =>
            sel.includes(item.name)
              ? { ...item, parent: "Trash", depth: 2 }
              : item
          )
        );
        notify("Moved " + count + " item" + (count > 1 ? "s" : "") + " to Trash");
      }
      return [];
    });
    setInvSelectMode(false);
  }, [notify]);

    const toggleOfflineGrid = useCallback(() => {
    setOfflineRunning((r) => {
      const next = !r;
      notify(next ? "Local OpenSim Grid STARTED (127.0.0.1:9000)" : "Local OpenSim Grid SHUTDOWN");
      return next;
    });
  }, [notify]);

  const saveOfflineAccount = useCallback(() => {
    setOfflineUser({ firstName: offlineAccountFirstName || "Jane", lastName: offlineAccountLastName || "Resident" });
    setOfflineAccountModal(false);
    notify("Local Account Saved: " + (offlineAccountFirstName || "Jane") + " " + (offlineAccountLastName || "Resident"));
  }, [offlineAccountFirstName, offlineAccountLastName, notify]);

  const importOarBackup = useCallback(() => {
    notify("Importing OAR backup " + oarFile + "...");
  }, [oarFile, notify]);

  const addLocalAsset = useCallback(() => {
    const name = assetName || "New Asset";
    const type = assetType || "Texture";
    const newAst = { id: "ast-" + Date.now(), name, type, size: "1.4 MB", uuid: "a" + Math.random().toString(16).substr(2, 8) + "-4000-8000-100000000000" };
    setLocalAssets((ast) => [newAst, ...ast]);
    setAssetName("");
    notify("Local Asset Created: " + name);
  }, [assetName, assetType, notify]);

  const clearOfflineCache = useCallback(() => {
    setOfflineCacheSize(256);
    notify("Offline Asset & Region Cache Cleared.");
  }, [notify]);

  const clearConsoleLogs = useCallback(() => {
    setConsoleLogs([]);
    notify("Grid Console Logs Cleared.");
  }, [notify]);

  const copyConsoleLogs = useCallback(() => {
    notify("Console Logs copied to clipboard.");
  }, [notify]);

  const downloadConsoleLogs = useCallback(() => {
    notify("Downloading opensim-grid-log.txt...");
  }, [notify]);

  // ---- balance refresh & sync ---------------------------------------------
  const refreshBalance = useCallback(() => {
    const now = new Date();
    setLastSyncedAt(now);
    const usd = (lindenBalance / exchangeRate).toFixed(2);
    notify("Balance synced: L$ " + lindenBalance.toLocaleString("en-US") + " (~$" + usd + " USD)");
    return { lindenBalance, exchangeRate, lastSyncedAt: now };
  }, [lindenBalance, exchangeRate, notify]);

  const screenPick = useCallback(
    (id) => {
      if (id !== "Inventory") {
        setInvSelectMode(false);
        setInvSelected([]);
        setInvMoveModal(false);
      }
      if (navMode() === "floaters" && FLOATERS.some((f) => f.id === id)) {
        flFocus(id);
        setDialog(null);
        return;
      }
      setScreen(id);
      setDialog(null);
    },
    [navMode, flFocus]
  );

  const getEventBus = useCallback(() => eventBusRef.current, []);

  const dispatchIntent = useCallback(
    (type, payload = {}) => {
      const bus = eventBusRef.current;
      const intentEvent = bus.dispatch({ type, payload });

      if (type === "DIALOG_ACTION" || type === "DIALOG_BUTTON_CLICK") {
        setDialog(null);
        const buttonLabel = payload.label || payload.actionId || "";
        const dlgTitle = payload.title || "";
        if (dlgTitle && buttonLabel) {
          notify(dlgTitle.split(" ").slice(0, 4).join(" ") + " — " + buttonLabel);
        } else if (buttonLabel) {
          notify(buttonLabel);
        }
      } else if (type === "DIALOG_CLOSE" || type === "DIALOG_DISMISS") {
        setDialog(null);
      } else if (type === "FLOATER_MINIMIZE" || type === "FLOATER_TOGGLE") {
        if (payload.id) flToggle(payload.id);
      } else if (type === "FLOATER_CLOSE") {
        if (payload.id) flClose(payload.id);
      } else if (type === "NAVIGATE_SCREEN") {
        if (payload.screen) screenPick(payload.screen);
      } else if (type === "QUICK_CHAT_SUBMIT") {
        if (payload.message) notify("Local Chat (" + payload.message + ")");
      }

      return intentEvent;
    },
    [flToggle, flClose, notify, screenPick]
  );

  return {
    state: {
      layout, palette, customTheme, device, screen, dialog, dense, tabs, chip, tileOk, invOpen, invSelectMode, invSelected, invMoveModal, invItems, dismissed, pinned, lureState,
      toggles, cond, hudOn, hudPos, hudPicker, target, targetPicker, navPeek,
      cPad, cHeld, cRun, cCam, cHdg, cPitch, cDrag, cEdit, cFlash, cReason, cTog,
      rMode, rOpen, rMenu, cDock, flOpen, flMin, flRect, flZ, menu, tick,
      loginMode, loginGrid, loginBusy, loginError, customGrids, addGrid, addGridName, addGridHost,
      searchFrom, searchTab, searchQuery, searchState, reconnecting, toast, offlineRunning, offlineUser, offlineAccountModal, offlineAccountFirstName, offlineAccountLastName, offlineAccountPassword, oarFile, oarRegionName, oarCoords, oarPrims, assetName, assetType, localAssets, offlineCacheSize, consoleLevel, consoleQuery, consoleAutoscroll, consoleLogs,
      prefs, cacheCleared, camPreset, lindenBalance, exchangeRate, lastSyncedAt,
      recoveryState, reconnectAttempts, nextRetryDelay, asyncQueryState,
    },
    actions: {
      setLayout, setPalette: selectPalette, setThemeColor, renameTheme, saveTheme, resetTheme, importTheme, downloadTheme, shareTheme, setDevice, setScreen: screenPick, setDialog, setDense,
      allGrids, openAddGrid, cancelAddGrid, saveCustomGrid, setAddGridName, setAddGridHost,
      setTab, setChip, setTileOk, toggleInvFolder, toggleInvSelectMode, toggleInvSelectedItem, invLongPressItem, invWearSelected, invOpenMoveModal, invCloseMoveModal, invMoveSelected, invDeleteSelected, dismiss, toggleSetting, pin, respondLure, teleportToRegion, saveLandmark,
      cycleLayout, cyclePalette, setCond, setMenu,
      flR, flDrag, flFocus, flToggle, flClose,
      hudDrag, toggleHud, setHudPicker, setTarget, setTargetPicker, setNavPeek,
      cf, cTap, cHold, cPress, sceneDown, sceneMove, sceneUp,
      holdStart, holdEnd, endEdit, togglePad, toggleRun, flyUpDown, flyDnDown, flyRelease, addSlot, removeDockSlot,
      radarTap, radarHold, radarRelease, radarBlipPick,
      setRMode,
      setLoginMode, setLoginGrid, connectLogin, openSearch, setSearchTab, setSearchQuery, searchAdd, startIm, reconnect, notify,
      setPref, setTelemetryVerbosity, clearCache, clearAllCache, setCamPreset, toggleOfflineGrid, setOfflineAccountModal, setOfflineAccountFirstName, setOfflineAccountLastName, setOfflineAccountPassword, saveOfflineAccount, importOarBackup, setAssetName, setAssetType, addLocalAsset, setOfflineCacheSize, clearOfflineCache, setConsoleLevel, setConsoleQuery, setConsoleAutoscroll, clearConsoleLogs, copyConsoleLogs, downloadConsoleLogs,
      refreshBalance, setLindenBalance, setExchangeRate,
      dispatchIntent, getEventBus,
      triggerRecovery, attemptReconnection, cancelRecovery, resetRecovery, runAsyncQuery, retryAsyncQuery, addDiagnosticLog, emitRecoveryEvent, subscribeRecoveryEvent,
    },
    T, D, navMode,
  };
}
