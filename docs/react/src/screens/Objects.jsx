import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { subView } from "../theme/constants.js";
import { panelLook } from "../theme/look.js";
import Icon from "../components/Icon.jsx";
import KInteractive from "../components/KInteractive.jsx";
import SegmentedMeter from "../components/SegmentedMeter.jsx";

const NEARBY_OBJECTS = [
  {
    id: "obj-lamp",
    uuid: "7c9a128e-f542-4b21-9963-8a0df4729c11",
    name: "Sunset Lamp v3",
    prims: 4,
    landImpact: 3.2,
    distance: 6,
    bearing: "NE · 45°",
    zDelta: "+0m",
    owner: "Kit Sandalwood",
    creator: "Kit Sandalwood",
    group: "Da Boom Artisans",
    pos: "<128.42, 128.10, 26.50>",
    rot: "<0.0°, 0.0°, 41.2°>",
    scale: "<0.40m, 0.40m, 1.20m>",
    scripted: true,
    scriptsCount: 1,
    cpuTime: "0.021 ms",
    memory: "64 KB",
    channel: "-142",
    perms: { mod: true, copy: true, trans: false },
    nextPerms: { mod: true, copy: true, trans: false },
    physical: false,
    phantom: false,
    temporary: false,
    icon: "box",
  },
  {
    id: "obj-door",
    uuid: "a18ef402-39bd-49e0-8110-39401bf57aa2",
    name: "Roof Access Door",
    prims: 12,
    landImpact: 8.5,
    distance: 12,
    bearing: "N · 5°",
    zDelta: "+12m",
    owner: "Da Boom Parcel",
    creator: "Governor Linden",
    group: "Linden Public Works",
    pos: "<128.00, 140.00, 38.50>",
    rot: "<0.0°, 0.0°, 0.0°>",
    scale: "<1.20m, 0.15m, 2.40m>",
    scripted: true,
    scriptsCount: 1,
    cpuTime: "0.038 ms",
    memory: "64 KB",
    channel: "0",
    perms: { mod: false, copy: true, trans: false },
    nextPerms: { mod: false, copy: true, trans: false },
    physical: false,
    phantom: false,
    temporary: false,
    icon: "door-closed",
  },
  {
    id: "obj-fountain",
    uuid: "20948bdf-1082-41ce-8381-19ab7401df39",
    name: "Linden Public Particle Fountain",
    prims: 1,
    landImpact: 1.0,
    distance: 14,
    bearing: "ESE · 115°",
    zDelta: "-2m",
    owner: "Linden Department of Public Works",
    creator: "Michael Linden",
    group: "Linden Public Works",
    pos: "<142.10, 118.40, 24.00>",
    rot: "<0.0°, 0.0°, 90.0°>",
    scale: "<2.50m, 2.50m, 0.80m>",
    scripted: true,
    scriptsCount: 1,
    cpuTime: "0.185 ms",
    memory: "64 KB",
    channel: "None",
    perms: { mod: false, copy: false, trans: false },
    nextPerms: { mod: false, copy: false, trans: false },
    physical: false,
    phantom: true,
    temporary: false,
    icon: "sparkles",
  },
  {
    id: "obj-orb",
    uuid: "e4920412-9921-42ab-ba01-729019dfaa55",
    name: "Parcel Security Orb v2",
    prims: 2,
    landImpact: 2.0,
    distance: 22,
    bearing: "SW · 220°",
    zDelta: "+8m",
    owner: "Marlowe Quill",
    creator: "Marlowe Quill",
    group: "Bay City Builders",
    pos: "<112.50, 110.20, 34.00>",
    rot: "<0.0°, 0.0°, 180.0°>",
    scale: "<0.30m, 0.30m, 0.30m>",
    scripted: true,
    scriptsCount: 2,
    cpuTime: "0.142 ms",
    memory: "128 KB",
    channel: "-9901",
    perms: { mod: true, copy: false, trans: false },
    nextPerms: { mod: false, copy: false, trans: false },
    physical: false,
    phantom: true,
    temporary: false,
    icon: "shield-alert",
  },
  {
    id: "obj-chair",
    uuid: "45f920da-7714-469b-8f3a-128472901baa",
    name: "Lounge Chair Deluxe (Mesh)",
    prims: 8,
    landImpact: 4.8,
    distance: 31,
    bearing: "SSW · 195°",
    zDelta: "+1m",
    owner: "Nyx Vaher",
    creator: "Nyx Vaher",
    group: "None",
    pos: "<120.00, 102.50, 27.20>",
    rot: "<0.0°, 0.0°, 30.0°>",
    scale: "<0.90m, 1.40m, 0.85m>",
    scripted: true,
    scriptsCount: 1,
    cpuTime: "0.012 ms",
    memory: "64 KB",
    channel: "-12",
    perms: { mod: true, copy: true, trans: false },
    nextPerms: { mod: true, copy: true, trans: false },
    physical: false,
    phantom: false,
    temporary: false,
    icon: "armchair",
  },
  {
    id: "obj-plat",
    uuid: "b218490a-1142-49da-a213-9038174aa912",
    name: "Rezzing Platform 64m",
    prims: 128,
    landImpact: 128.0,
    distance: 58,
    bearing: "WNW · 295°",
    zDelta: "+45m",
    owner: "Ruth Resident",
    creator: "Ruth Resident",
    group: "Bay City Builders",
    pos: "<70.00, 160.00, 71.00>",
    rot: "<0.0°, 0.0°, 0.0°>",
    scale: "<64.00m, 64.00m, 0.50m>",
    scripted: false,
    scriptsCount: 0,
    cpuTime: "0.000 ms",
    memory: "0 KB",
    channel: "None",
    perms: { mod: true, copy: true, trans: true },
    nextPerms: { mod: true, copy: true, trans: true },
    physical: false,
    phantom: false,
    temporary: false,
    icon: "layers",
  },
  {
    id: "obj-temp",
    uuid: "98fa1092-4912-411a-8812-781920daeb41",
    name: "Temp Build Alignment Guide",
    prims: 1,
    landImpact: 1.0,
    distance: 64,
    bearing: "NW · 315°",
    zDelta: "+46m",
    owner: "Ruth Resident",
    creator: "Ruth Resident",
    group: "None",
    pos: "<68.00, 164.00, 72.00>",
    rot: "<0.0°, 0.0°, 0.0°>",
    scale: "<1.00m, 1.00m, 1.00m>",
    scripted: false,
    scriptsCount: 0,
    cpuTime: "0.000 ms",
    memory: "0 KB",
    channel: "None",
    perms: { mod: true, copy: true, trans: true },
    nextPerms: { mod: true, copy: true, trans: true },
    physical: false,
    phantom: true,
    temporary: true,
    icon: "trash-2",
  },
];

export default function Objects() {
  const { state, actions } = useApp();
  const { V, t, LK, bleed, pad, ink } = useTheme();
  const curSub = subView(state, "Objects") || "NEARBY";
  const cardStyle = (accent) => panelLook(V, LK, pad, accent);

  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(NEARBY_OBJECTS[0].id);
  const [trackedId, setTrackedId] = useState(null);

  const selectedObj = NEARBY_OBJECTS.find((o) => o.id === selectedId) || NEARBY_OBJECTS[0];

  const filteredObjects = NEARBY_OBJECTS.filter((obj) => {
    if (query.trim()) {
      const q = query.toLowerCase();
      if (!obj.name.toLowerCase().includes(q) && !obj.owner.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (filter === "SCRIPTED") return obj.scripted;
    if (filter === "PHYSICAL") return obj.physical;
    if (filter === "PHANTOM") return obj.phantom;
    if (filter === "TEMP") return obj.temporary;
    if (filter === "MINE") return obj.owner === "Ruth Resident";
    return true;
  });

  const actBtn = (primary = false, danger = false) => ({
    minHeight: "44px",
    padding: "0 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    cursor: "pointer",
    background: primary ? V.pri : danger ? (V.err || "#dc2626") : V.surf2,
    color: primary
      ? ink(V.pri, [V.bg, V.onpri, V.ink])
      : danger
      ? "#fff"
      : V.ink,
    border: "1px solid " + (primary ? V.pri : danger ? (V.err || "#dc2626") : V.outv),
    borderRadius: V.rs,
    font: "700 10.5px/1 " + t.dfont,
    letterSpacing: ".1em",
    whiteSpace: "nowrap",
  });

  const inspectObject = (obj) => {
    setSelectedId(obj.id);
    actions.setTab("Objects", "INSPECT");
  };

  const toggleTrack = (id, name) => {
    if (trackedId === id) {
      setTrackedId(null);
      actions.notify(`Stopped tracking ${name}`);
    } else {
      setTrackedId(id);
      actions.notify(`Beacon active: Tracking ${name} in-world`);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: bleed ? "6px" : "10px",
        padding: bleed ? "8px 0 16px" : "8px 16px 16px",
      }}
    >
      {curSub === "NEARBY" && (
        <>
          {/* Summary / Search Header */}
          <div style={{ ...cardStyle(V.pri), display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Icon name="box" size={20} style={{ color: V.pri }} />
                <div>
                  <div style={{ font: "700 9px/1 " + t.dfont, letterSpacing: ".18em", color: V.sec2 || V.pri }}>
                    [OPS-04-8921] OBJECT REGISTRATION DIRECTORY
                  </div>
                  <div style={{ font: "700 15px/1.2 " + t.dfont, color: V.ink, marginTop: "2px" }}>Nearby Objects</div>
                  <div style={{ font: "400 11px/1.3 " + t.font, color: V.ink2, marginTop: "2px" }}>
                    {NEARBY_OBJECTS.length} objects in draw distance (96m) · {NEARBY_OBJECTS.reduce((acc, o) => acc + o.prims, 0)} total prims
                  </div>
                </div>
              </div>

              {/* Search Box */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", background: V.surf2, border: "1px solid " + V.outv, borderRadius: V.rs, padding: "0 10px", minHeight: "44px" }}>
                <Icon name="search" size={15} style={{ color: V.ink2 }} />
                <input
                  type="text"
                  placeholder="Filter by name or owner..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: V.ink,
                    font: "400 12px/1.4 " + t.font,
                    width: "150px",
                  }}
                  aria-label="Filter objects"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    style={{ background: "transparent", border: "none", color: V.ink2, cursor: "pointer", padding: "4px" }}
                    aria-label="Clear filter"
                  >
                    <Icon name="x" size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Chips */}
            <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "2px" }}>
              {["ALL", "SCRIPTED", "MINE", "PHYSICAL", "PHANTOM", "TEMP"].map((f) => {
                const active = filter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      minHeight: "36px",
                      padding: "0 10px",
                      borderRadius: V.rs,
                      background: active ? V.pri : V.surf2,
                      color: active ? ink(V.pri, [V.bg, V.onpri, V.ink]) : V.ink2,
                      border: "1px solid " + (active ? V.pri : V.outv),
                      font: "700 10px/1 " + t.dfont,
                      letterSpacing: ".08em",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Objects List */}
          <div style={{ display: "flex", flexDirection: "column", gap: bleed ? "4px" : "8px" }}>
            {filteredObjects.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: V.ink2, font: "400 13px/1.4 " + t.font }}>
                No nearby objects match your filter.
              </div>
            ) : (
              filteredObjects.map((obj) => {
                const isTracked = trackedId === obj.id;
                return (
                  <div
                    key={obj.id}
                    style={{
                      ...cardStyle(isTracked ? V.pri : undefined),
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: V.rs,
                            background: V.surf2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            color: obj.scripted ? V.pri : V.ink2,
                            border: "1px solid " + V.outv,
                          }}
                        >
                          <Icon name={obj.icon || "box"} size={18} />
                        </div>
                        <div>
                          <div style={{ font: "700 8.5px/1 " + t.dfont, letterSpacing: ".14em", color: V.sec2 || V.pri }}>
                            [OBJ-{obj.id.replace("obj-", "").slice(0, 4).toUpperCase()}]
                          </div>
                          <div style={{ font: "700 13.5px/1.2 " + t.dfont, color: V.ink, marginTop: "1px" }}>{obj.name}</div>
                          <div style={{ font: "400 11px/1.3 " + t.font, color: V.ink2, marginTop: "2px" }}>
                            Owner: <span style={{ color: V.ink }}>{obj.owner}</span> · {obj.prims} prims ({obj.landImpact} LI)
                          </div>
                          <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "4px", flexWrap: "wrap" }}>
                            <span style={{ font: "600 10px/1 " + t.mfont, padding: "2px 6px", borderRadius: "3px", background: V.surf2, color: V.ink2, border: "1px solid " + V.outv }}>
                              {obj.distance}m · {obj.bearing} · {obj.zDelta}
                            </span>
                            {obj.scripted && (
                              <span style={{ font: "600 10px/1 " + t.mfont, padding: "2px 6px", borderRadius: "3px", background: V.surf2, color: V.pri, border: "1px solid " + V.outv }}>
                                ⚡ {obj.cpuTime}
                              </span>
                            )}
                            {obj.temporary && (
                              <span style={{ font: "600 10px/1 " + t.mfont, padding: "2px 6px", borderRadius: "3px", background: V.surf2, color: V.warn || "#f59e0b", border: "1px solid " + V.outv }}>
                                TEMP
                              </span>
                            )}
                            {obj.phantom && (
                              <span style={{ font: "600 10px/1 " + t.mfont, padding: "2px 6px", borderRadius: "3px", background: V.surf2, color: V.ink2, border: "1px solid " + V.outv }}>
                                PHANTOM
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Distance pill badge */}
                      <span
                        style={{
                          font: "700 11px/1 " + t.mfont,
                          color: V.pri,
                          padding: "4px 8px",
                          borderRadius: V.rs,
                          background: V.surf2,
                          border: "1px solid " + V.outv,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {obj.distance}m
                      </span>
                    </div>

                    {/* Action buttons row */}
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", borderTop: "1px solid " + V.outv, paddingTop: "8px" }}>
                      <KInteractive
                        as="button"
                        onClick={() => actions.notify(`Touched ${obj.name}`)}
                        style={actBtn(true)}
                        aria-label={`Touch ${obj.name}`}
                      >
                        <Icon name="hand" size={13} />
                        <span>TOUCH</span>
                      </KInteractive>

                      <KInteractive
                        as="button"
                        onClick={() => actions.notify(`Sitting on ${obj.name}`)}
                        style={actBtn(false)}
                        aria-label={`Sit on ${obj.name}`}
                      >
                        <Icon name="armchair" size={13} />
                        <span>SIT</span>
                      </KInteractive>

                      <KInteractive
                        as="button"
                        onClick={() => inspectObject(obj)}
                        style={actBtn(false)}
                        aria-label={`Inspect ${obj.name}`}
                      >
                        <Icon name="info" size={13} />
                        <span>INSPECT</span>
                      </KInteractive>

                      <KInteractive
                        as="button"
                        onClick={() => toggleTrack(obj.id, obj.name)}
                        style={actBtn(isTracked)}
                        aria-label={`Track ${obj.name}`}
                      >
                        <Icon name="radar" size={13} />
                        <span>{isTracked ? "TRACKING" : "TRACK"}</span>
                      </KInteractive>

                      <KInteractive
                        as="button"
                        onClick={() => actions.notify(`Took ${obj.name} to Inventory`)}
                        style={actBtn(false)}
                        aria-label={`Take ${obj.name}`}
                      >
                        <Icon name="archive" size={13} />
                        <span>TAKE</span>
                      </KInteractive>

                      {obj.owner === "Ruth Resident" && (
                        <KInteractive
                          as="button"
                          onClick={() => actions.notify(`Derezzed ${obj.name}`)}
                          style={actBtn(false, true)}
                          aria-label={`Derez ${obj.name}`}
                        >
                          <Icon name="trash-2" size={13} />
                          <span>DEREZ</span>
                        </KInteractive>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {curSub === "INSPECT" && (
        <>
          {/* Back button and quick switcher */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
            <KInteractive
              as="button"
              onClick={() => actions.setTab("Objects", "NEARBY")}
              style={actBtn(false)}
              aria-label="Back to nearby objects"
            >
              <Icon name="arrow-left" size={14} />
              <span>BACK TO NEARBY</span>
            </KInteractive>

            <span style={{ font: "400 11px/1 " + t.font, color: V.ink2 }}>
              Inspecting {selectedObj.name}
            </span>
          </div>

          {/* Object Header Card */}
          <div style={{ ...cardStyle(V.pri), display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: V.rs,
                  background: V.surf2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: V.pri,
                  border: "1px solid " + V.outv,
                  flexShrink: 0,
                }}
              >
                <Icon name="box" size={24} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "700 9px/1 " + t.dfont, letterSpacing: ".18em", color: V.sec2 || V.pri }}>
                  [ENG-02-3104] PRIM ARCHITECTURE INSPECTOR
                </div>
                <div style={{ font: "700 16px/1.2 " + t.dfont, color: V.ink, marginTop: "2px" }}>{selectedObj.name}</div>
                <div style={{ font: "400 11px/1.3 " + (t.mfont || t.font), color: V.ink2, marginTop: "2px", wordBreak: "break-all" }}>
                  UUID: {selectedObj.uuid}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", borderTop: "1px solid " + V.outv, paddingTop: "8px" }}>
              <KInteractive
                as="button"
                onClick={() => actions.notify(`Touched ${selectedObj.name}`)}
                style={actBtn(true)}
                aria-label={`Touch ${selectedObj.name}`}
              >
                <Icon name="hand" size={13} />
                <span>TOUCH OBJECT</span>
              </KInteractive>

              <KInteractive
                as="button"
                onClick={() =>
                  actions.setDialog({
                    icon: "banknote",
                    kind: "PAY OBJECT",
                    title: `Pay ${selectedObj.name}`,
                    body: `Select an amount to pay to ${selectedObj.owner}:`,
                    meta: `Object UUID: ${selectedObj.uuid}`,
                    buttons: [
                      { label: "PAY L$ 10", pick: () => actions.notify(`Paid L$ 10 to ${selectedObj.owner}`) },
                      { label: "PAY L$ 50", primary: true, pick: () => actions.notify(`Paid L$ 50 to ${selectedObj.owner}`) },
                      { label: "CANCEL", dim: true },
                    ],
                  })
                }
                style={actBtn(false)}
                aria-label={`Pay ${selectedObj.name}`}
              >
                <Icon name="banknote" size={13} />
                <span>PAY L$...</span>
              </KInteractive>

              <KInteractive
                as="button"
                onClick={() => actions.notify(`${selectedObj.name} — scripts reset`)}
                style={actBtn(false)}
                aria-label={`Reset scripts of ${selectedObj.name}`}
              >
                <Icon name="refresh-cw" size={13} />
                <span>RESET SCRIPTS</span>
              </KInteractive>

              <KInteractive
                as="button"
                onClick={() => actions.notify(`Derendered ${selectedObj.name}`)}
                style={actBtn(false)}
                aria-label={`Derender ${selectedObj.name}`}
              >
                <Icon name="eye-off" size={13} />
                <span>DERENDER</span>
              </KInteractive>
            </div>
          </div>

          {/* Details Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: bleed ? "6px" : "10px" }}>
            {/* Ownership Card */}
            <div style={{ ...cardStyle(), display: "flex", flexDirection: "column", gap: "8px" }}>
              <div>
                <div style={{ font: "700 8.5px/1 " + t.dfont, letterSpacing: ".14em", color: V.sec2 || V.pri }}>[ENG-02-OWNR]</div>
                <div style={{ font: "700 11px/1 " + t.dfont, color: V.ink2, letterSpacing: ".1em", marginTop: "2px" }}>OWNERSHIP &amp; CREATION</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", font: "400 12px/1.4 " + t.font }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: V.ink2 }}>Owner:</span>
                  <span style={{ fontWeight: 600, color: V.ink }}>{selectedObj.owner}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: V.ink2 }}>Creator:</span>
                  <span style={{ fontWeight: 600, color: V.ink }}>{selectedObj.creator}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: V.ink2 }}>Group:</span>
                  <span style={{ fontWeight: 600, color: V.ink }}>{selectedObj.group}</span>
                </div>
              </div>
            </div>

            {/* Transform & Spatial Card */}
            <div style={{ ...cardStyle(), display: "flex", flexDirection: "column", gap: "8px" }}>
              <div>
                <div style={{ font: "700 8.5px/1 " + t.dfont, letterSpacing: ".14em", color: V.sec2 || V.pri }}>[ENG-02-XFRM]</div>
                <div style={{ font: "700 11px/1 " + t.dfont, color: V.ink2, letterSpacing: ".1em", marginTop: "2px" }}>TRANSFORM &amp; GEOMETRY</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", font: "400 12px/1.4 " + t.font }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: V.ink2 }}>Position:</span>
                  <span style={{ fontFamily: t.mfont || t.font, color: V.ink }}>{selectedObj.pos}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: V.ink2 }}>Rotation:</span>
                  <span style={{ fontFamily: t.mfont || t.font, color: V.ink }}>{selectedObj.rot}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: V.ink2 }}>Scale:</span>
                  <span style={{ fontFamily: t.mfont || t.font, color: V.ink }}>{selectedObj.scale}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: V.ink2 }}>Prims / Land Impact:</span>
                  <span style={{ fontWeight: 600, color: V.ink }}>{selectedObj.prims} prims · {selectedObj.landImpact} LI</span>
                </div>
              </div>
            </div>

            {/* Permissions Matrix */}
            <div style={{ ...cardStyle(), display: "flex", flexDirection: "column", gap: "8px" }}>
              <div>
                <div style={{ font: "700 8.5px/1 " + t.dfont, letterSpacing: ".14em", color: V.sec2 || V.pri }}>[ENG-02-PERM]</div>
                <div style={{ font: "700 11px/1 " + t.dfont, color: V.ink2, letterSpacing: ".1em", marginTop: "2px" }}>PERMISSIONS MATRIX</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", font: "400 12px/1.4 " + t.font }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: V.ink2 }}>Your Rights:</span>
                  <div style={{ display: "flex", gap: "6px", fontFamily: t.mfont || t.font, fontSize: "11px" }}>
                    <span style={{ color: selectedObj.perms.mod ? V.ok || "#22c55e" : V.ink2 }}>MOD</span>
                    <span style={{ color: selectedObj.perms.copy ? V.ok || "#22c55e" : V.ink2 }}>COPY</span>
                    <span style={{ color: selectedObj.perms.trans ? V.ok || "#22c55e" : V.ink2 }}>TRANS</span>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: V.ink2 }}>Next Owner:</span>
                  <div style={{ display: "flex", gap: "6px", fontFamily: t.mfont || t.font, fontSize: "11px" }}>
                    <span style={{ color: selectedObj.nextPerms.mod ? V.ok || "#22c55e" : V.ink2 }}>MOD</span>
                    <span style={{ color: selectedObj.nextPerms.copy ? V.ok || "#22c55e" : V.ink2 }}>COPY</span>
                    <span style={{ color: selectedObj.nextPerms.trans ? V.ok || "#22c55e" : V.ink2 }}>TRANS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Script Telemetry Card */}
            <div style={{ ...cardStyle(), display: "flex", flexDirection: "column", gap: "8px" }}>
              <div>
                <div style={{ font: "700 8.5px/1 " + t.dfont, letterSpacing: ".14em", color: V.sec2 || V.pri }}>[ENG-02-LSL]</div>
                <div style={{ font: "700 11px/1 " + t.dfont, color: V.ink2, letterSpacing: ".1em", marginTop: "2px" }}>SCRIPT ENGINE &amp; RUNTIME</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", font: "400 12px/1.4 " + t.font }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: V.ink2 }}>Active Scripts:</span>
                  <span style={{ fontWeight: 600, color: V.ink }}>{selectedObj.scriptsCount} running</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: V.ink2 }}>CPU Frame Time:</span>
                    <span style={{ fontFamily: t.mfont || t.font, color: V.pri }}>{selectedObj.cpuTime}</span>
                  </div>
                  <SegmentedMeter
                    value={Math.round((parseFloat(selectedObj.cpuTime) || 0.05) * 1000)}
                    max={250}
                    segments={16}
                    height={6}
                    gap={2}
                    label="Script CPU Frame Time"
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: V.ink2 }}>Script Memory:</span>
                  <span style={{ fontFamily: t.mfont || t.font, color: V.ink }}>{selectedObj.memory}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: V.ink2 }}>Listen Channel:</span>
                  <span style={{ fontFamily: t.mfont || t.font, color: V.ink }}>{selectedObj.channel}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
