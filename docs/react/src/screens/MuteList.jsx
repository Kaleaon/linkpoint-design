import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { subView } from "../theme/constants.js";
import Icon from "../components/Icon.jsx";
import KInteractive from "../components/KInteractive.jsx";

const INITIAL_MUTED_AVATARS = [
  {
    id: "av-block-1",
    name: "Griefing Spambot 9000",
    uuid: "4f2a9c11-9921-48ac-ba12-001928374610",
    date: "Sep 14, 2026",
    flags: { chat: true, voice: true, particles: true, offers: true },
  },
  {
    id: "av-block-2",
    name: "Rezday Confetti Bot",
    uuid: "11928301-8172-4029-bb12-901827364512",
    date: "Sep 09, 2026",
    flags: { chat: true, voice: false, particles: true, offers: false },
  },
  {
    id: "av-block-3",
    name: "Marrow Ashdown",
    uuid: "88210391-2219-4812-9901-192837465019",
    date: "Aug 28, 2026",
    flags: { chat: false, voice: true, particles: false, offers: false },
  },
];

const INITIAL_MUTED_OBJECTS = [
  {
    id: "obj-block-1",
    name: "Noisy Emitter Prim",
    uuid: "48fa9102-1200-41ab-8812-701920daeb41",
    owner: "Unknown Resident",
    reason: "Muted looping object sounds",
    date: "Sep 11, 2026",
  },
  {
    id: "obj-block-2",
    name: "Annoying Vendor Script",
    uuid: "99120481-2219-48ac-0012-771920182930",
    owner: "Commercial Promo Corp",
    reason: "Muted repetitive channel 0 local chat spam",
    date: "Sep 02, 2026",
  },
  {
    id: "obj-block-3",
    name: "Roadside Ad Board",
    uuid: "771920da-1102-4112-9901-881920192837",
    owner: "Mainland Ads Ltd",
    reason: "Muted popup offers & particle beams",
    date: "Aug 30, 2026",
  },
];

const INITIAL_MUTED_SOUNDS = [
  {
    id: "snd-block-1",
    uuid: "d8102938-4412-4091-8812-771920da0192",
    name: "High Pitch Horn Loop",
    date: "Sep 10, 2026",
  },
  {
    id: "snd-block-2",
    uuid: "bb291029-1928-4412-ba01-112938475610",
    name: "Ear Exploder Scream",
    date: "Aug 24, 2026",
  },
];

export default function MuteList() {
  const { state, actions } = useApp();
  const { V, t, bleed, pad, ink } = useTheme();
  const curSub = subView(state, "Mute List") || "AVATARS";

  const [avatars, setAvatars] = useState(INITIAL_MUTED_AVATARS);
  const [objects, setObjects] = useState(INITIAL_MUTED_OBJECTS);
  const [sounds, setSounds] = useState(INITIAL_MUTED_SOUNDS);
  const [query, setQuery] = useState("");

  const unblockAvatar = (id, name) => {
    setAvatars((prev) => prev.filter((a) => a.id !== id));
    actions.notify(`Unmuted resident: ${name}`);
  };

  const unblockObject = (id, name) => {
    setObjects((prev) => prev.filter((o) => o.id !== id));
    actions.notify(`Unmuted object: ${name}`);
  };

  const unblockSound = (id, name) => {
    setSounds((prev) => prev.filter((s) => s.id !== id));
    actions.notify(`Unmuted sound UUID: ${name}`);
  };

  const toggleFlag = (avId, flagKey) => {
    setAvatars((prev) =>
      prev.map((a) => {
        if (a.id === avId) {
          const updatedFlags = { ...a.flags, [flagKey]: !a.flags[flagKey] };
          return { ...a, flags: updatedFlags };
        }
        return a;
      })
    );
  };

  const openAddBlockModal = (type) => {
    actions.setDialog({
      icon: "shield-alert",
      kind: "BLOCK ENTITY",
      title: `Block New ${type === "AVATARS" ? "Resident" : type === "OBJECTS" ? "Object" : "Sound"}`,
      body: `Enter resident name or target UUID to immediately suppress all communications:`,
      meta: `Type: ${type} · Privacy Policy: Client-Side Block List`,
      buttons: [
        {
          label: "BLOCK BY NAME...",
          primary: true,
          pick: () => actions.notify(`Added new block rule`),
        },
        { label: "CANCEL", dim: true },
      ],
    });
  };

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

  const totalBlocked = avatars.length + objects.length + sounds.length;

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
      {/* Header Banner */}
      <div
        style={{
          padding: pad,
          background: V.surf,
          border: bleed ? "none" : "1px solid " + V.outv,
          borderLeft: bleed ? "4px solid " + (V.warn || "#f59e0b") : undefined,
          borderRadius: bleed ? 0 : V.rp,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: V.rs,
                background: V.surf2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: V.warn || "#f59e0b",
                border: "1px solid " + V.outv,
                flexShrink: 0,
              }}
            >
              <Icon name="volume-x" size={22} />
            </div>
            <div>
              <div style={{ font: "700 15px/1.2 " + t.dfont, color: V.ink }}>Block & Mute Manager</div>
              <div style={{ font: "400 11px/1.3 " + t.font, color: V.ink2, marginTop: "2px" }}>
                {totalBlocked} total entries · {avatars.length} residents · {objects.length} objects · {sounds.length} sounds
              </div>
            </div>
          </div>

          <KInteractive
            as="button"
            onClick={() => openAddBlockModal(curSub)}
            style={actBtn(true)}
            aria-label="Add new block rule"
          >
            <Icon name="plus" size={14} />
            <span>BLOCK {curSub === "AVATARS" ? "RESIDENT..." : curSub === "OBJECTS" ? "OBJECT..." : "SOUND..."}</span>
          </KInteractive>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: V.surf,
          padding: "6px 12px",
          border: bleed ? "none" : "1px solid " + V.outv,
          borderRadius: bleed ? 0 : V.rp,
          minHeight: "44px",
        }}
      >
        <Icon name="search" size={16} style={{ color: V.ink2 }} />
        <input
          type="text"
          placeholder="Search blocked entities by name or UUID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: V.ink,
            font: "400 12.5px/1.4 " + t.font,
          }}
          aria-label="Search blocked entities"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            style={{ background: "transparent", border: "none", color: V.ink2, cursor: "pointer", padding: "4px" }}
            aria-label="Clear search"
          >
            <Icon name="x" size={14} />
          </button>
        )}
      </div>

      {/* AVATARS SUB-VIEW */}
      {curSub === "AVATARS" && (
        <div style={{ display: "flex", flexDirection: "column", gap: bleed ? "4px" : "8px" }}>
          {avatars.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: V.ink2, font: "400 13px/1.4 " + t.font }}>
              No residents are currently blocked.
            </div>
          ) : (
            avatars
              .filter((a) => !query.trim() || a.name.toLowerCase().includes(query.toLowerCase()) || a.uuid.includes(query))
              .map((av) => (
                <div
                  key={av.id}
                  style={{
                    padding: pad,
                    background: V.surf,
                    border: bleed ? "none" : "1px solid " + V.outv,
                    borderRadius: bleed ? 0 : V.rp,
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
                          color: V.warn || "#f59e0b",
                          border: "1px solid " + V.outv,
                        }}
                      >
                        <Icon name="user-x" size={18} />
                      </div>
                      <div>
                        <div style={{ font: "700 13.5px/1.2 " + t.dfont, color: V.ink }}>{av.name}</div>
                        <div style={{ font: "400 10.5px/1.3 " + t.mfont, color: V.ink2, marginTop: "2px" }}>
                          {av.uuid}
                        </div>
                        <div style={{ font: "400 11px/1.3 " + t.font, color: V.ink2, marginTop: "2px" }}>
                          Blocked on: {av.date}
                        </div>
                      </div>
                    </div>

                    <KInteractive
                      as="button"
                      onClick={() => unblockAvatar(av.id, av.name)}
                      style={actBtn(false, false)}
                      aria-label={`Unmute ${av.name}`}
                    >
                      <Icon name="volume-2" size={13} />
                      <span>UNMUTE</span>
                    </KInteractive>
                  </div>

                  {/* Granular Block Flags */}
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                      borderTop: "1px solid " + V.outv,
                      paddingTop: "8px",
                      font: "500 11px/1 " + t.font,
                      color: V.ink,
                    }}
                  >
                    {[
                      { key: "chat", label: "Text Chat" },
                      { key: "voice", label: "Voice" },
                      { key: "particles", label: "Particles" },
                      { key: "offers", label: "Inventory Offers" },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={av.flags[key]}
                          onChange={() => toggleFlag(av.id, key)}
                          style={{ accentColor: V.pri, cursor: "pointer" }}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* OBJECTS SUB-VIEW */}
      {curSub === "OBJECTS" && (
        <div style={{ display: "flex", flexDirection: "column", gap: bleed ? "4px" : "8px" }}>
          {objects.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: V.ink2, font: "400 13px/1.4 " + t.font }}>
              No objects are currently blocked.
            </div>
          ) : (
            objects
              .filter((o) => !query.trim() || o.name.toLowerCase().includes(query.toLowerCase()) || o.uuid.includes(query))
              .map((obj) => (
                <div
                  key={obj.id}
                  style={{
                    padding: pad,
                    background: V.surf,
                    border: bleed ? "none" : "1px solid " + V.outv,
                    borderRadius: bleed ? 0 : V.rp,
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
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
                          color: V.ink2,
                          border: "1px solid " + V.outv,
                        }}
                      >
                        <Icon name="box" size={18} />
                      </div>
                      <div>
                        <div style={{ font: "700 13.5px/1.2 " + t.dfont, color: V.ink }}>{obj.name}</div>
                        <div style={{ font: "400 10.5px/1.3 " + t.mfont, color: V.ink2, marginTop: "2px" }}>
                          UUID: {obj.uuid}
                        </div>
                        <div style={{ font: "400 11px/1.3 " + t.font, color: V.ink2, marginTop: "2px" }}>
                          Owner: {obj.owner} · {obj.reason}
                        </div>
                      </div>
                    </div>

                    <KInteractive
                      as="button"
                      onClick={() => unblockObject(obj.id, obj.name)}
                      style={actBtn(false, false)}
                      aria-label={`Unblock ${obj.name}`}
                    >
                      <Icon name="check" size={13} />
                      <span>UNBLOCK</span>
                    </KInteractive>
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* SOUNDS SUB-VIEW */}
      {curSub === "SOUNDS" && (
        <div style={{ display: "flex", flexDirection: "column", gap: bleed ? "4px" : "8px" }}>
          {sounds.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: V.ink2, font: "400 13px/1.4 " + t.font }}>
              No audio sounds are currently muted.
            </div>
          ) : (
            sounds
              .filter((s) => !query.trim() || s.name.toLowerCase().includes(query.toLowerCase()) || s.uuid.includes(query))
              .map((snd) => (
                <div
                  key={snd.id}
                  style={{
                    padding: pad,
                    background: V.surf,
                    border: bleed ? "none" : "1px solid " + V.outv,
                    borderRadius: bleed ? 0 : V.rp,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                        color: V.ink2,
                        border: "1px solid " + V.outv,
                      }}
                    >
                      <Icon name="volume-x" size={18} />
                    </div>
                    <div>
                      <div style={{ font: "700 13.5px/1.2 " + t.dfont, color: V.ink }}>{snd.name}</div>
                      <div style={{ font: "400 10.5px/1.3 " + t.mfont, color: V.ink2, marginTop: "2px" }}>
                        UUID: {snd.uuid}
                      </div>
                    </div>
                  </div>

                  <KInteractive
                    as="button"
                    onClick={() => unblockSound(snd.id, snd.name)}
                    style={actBtn(false, false)}
                    aria-label={`Unmute sound ${snd.name}`}
                  >
                    <Icon name="volume-2" size={13} />
                    <span>UNMUTE</span>
                  </KInteractive>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
}
