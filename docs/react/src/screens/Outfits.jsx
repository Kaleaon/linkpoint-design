import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { subView } from "../theme/constants.js";
import Icon from "../components/Icon.jsx";
import KInteractive from "../components/KInteractive.jsx";

const DEFAULT_WORN = {
  body: [
    { id: "w-shape", slot: "Shape", name: "Ruth Classic Shape v4", icon: "user", meta: "Body geometry" },
    { id: "w-skin", slot: "Skin", name: "Fair Toned Mesh Skin (Natural)", icon: "palette", meta: "Bakes-on-Mesh layer" },
    { id: "w-eyes", slot: "Eyes", name: "Deep Hazel Mesh Eyes", icon: "eye", meta: "Rigged mesh eyes" },
    { id: "w-hair", slot: "Hair", name: "Messy Shag Hair (Espresso)", icon: "scissors", meta: "Fitted mesh hair" },
    { id: "w-phys", slot: "Physics", name: "Subtle Mesh Body Physics", icon: "activity", meta: "Avatar physics" },
  ],
  clothing: [
    { id: "w-jkt", slot: "Jacket", name: "Distressed Leather Biker Jacket", icon: "shirt", meta: "Rigged mesh outerwear" },
    { id: "w-top", slot: "Shirt", name: "Vintage Band Tee (Black)", icon: "shirt", meta: "Upper body clothing" },
    { id: "w-pnt", slot: "Pants", name: "Slim-fit Selvedge Denim Jeans", icon: "scissors", meta: "Lower body clothing" },
    { id: "w-sho", slot: "Shoes", name: "Combat Lace-up Leather Boots", icon: "footprints", meta: "Footwear attachment" },
    { id: "w-und", slot: "Underwear", name: "Seamless Cotton Basics", icon: "shield", meta: "BOM underwear layer" },
  ],
  attachments: [
    { id: "w-att1", slot: "Nose", name: "Aviator Metal Sunglasses", icon: "glasses", meta: "Attachment point: Nose" },
    { id: "w-att2", slot: "R Wrist", name: "Silver Link Bracelet", icon: "watch", meta: "Attachment point: Right Wrist" },
    { id: "w-hud1", slot: "Center 2", name: "Firestorm AO HUD v4.2", icon: "person-standing", meta: "Screen HUD · 14 animations", hud: true },
    { id: "w-hud2", slot: "Top Right", name: "Mesh Body Master Controller", icon: "layers", meta: "Screen HUD · Alpha & tint", hud: true },
    { id: "w-hud3", slot: "Bottom Left", name: "Radar Proximity HUD", icon: "radar", meta: "Screen HUD · Scanner blips", hud: true },
  ],
};

const SAVED_OUTFITS = [
  { id: "out-1", name: "Urban Casual v2", active: true, items: 12, summary: "Mesh body, biker jacket, jeans, combat boots", updated: "Today 14:10" },
  { id: "out-2", name: "Cyberpunk Tactical", active: false, items: 15, summary: "Carbon exo-suit, neon visor, tactical harness", updated: "Sep 12" },
  { id: "out-3", name: "Formal Eveningwear", active: false, items: 8, summary: "Midnight tuxedo, dress shoes, chronometer", updated: "Sep 08" },
  { id: "out-4", name: "Beach & Swimwear", active: false, items: 5, summary: "Boardshorts, mirrored sunglasses, sandals", updated: "Aug 29" },
  { id: "out-5", name: "Steampunk Airship Pilot", active: false, items: 14, summary: "Leather trench, brass goggles, pocket watch", updated: "Aug 15" },
];

export default function Outfits() {
  const { state, actions } = useApp();
  const { V, t, bleed, pad, ink } = useTheme();
  const curSub = subView(state, "Outfits") || "WORN";
  const [worn, setWorn] = useState(DEFAULT_WORN);
  const [outfits, setOutfits] = useState(SAVED_OUTFITS);

  const removeItem = (cat, id, name) => {
    setWorn((prev) => ({
      ...prev,
      [cat]: prev[cat].filter((item) => item.id !== id),
    }));
    actions.notify(`Detached: ${name}`);
  };

  const wearOutfit = (outfit) => {
    setOutfits((prev) =>
      prev.map((o) => ({
        ...o,
        active: o.id === outfit.id,
      }))
    );
    actions.notify(`Worn outfit: ${outfit.name}`);
  };

  const addOutfit = (outfit) => {
    actions.notify(`Added items from ${outfit.name} to current look`);
  };

  const totalWornCount = worn.body.length + worn.clothing.length + worn.attachments.length;
  const activeOutfit = outfits.find((o) => o.active) || outfits[0];

  const chipBtn = (primary = false) => ({
    minHeight: "44px",
    padding: "0 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    cursor: "pointer",
    background: primary ? V.pri : V.surf2,
    color: primary ? ink(V.pri, [V.bg, V.onpri, V.ink]) : V.ink,
    border: "1px solid " + (primary ? V.pri : V.outv),
    borderRadius: V.rs,
    font: "700 10.5px/1 " + t.dfont,
    letterSpacing: ".12em",
    whiteSpace: "nowrap",
  });

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: bleed ? "6px" : "10px", padding: bleed ? "8px 0 16px" : "8px 16px 16px" }}>
      {/* Active Outfit Header Card */}
      <div
        style={{
          padding: pad,
          background: V.surf,
          border: bleed ? "none" : "1px solid " + V.outv,
          borderLeft: bleed ? "4px solid " + V.pri : undefined,
          borderRadius: bleed ? 0 : V.rp,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Icon name="shirt" size={20} style={{ color: V.pri }} />
            <div>
              <div style={{ font: "700 15px/1.2 " + t.dfont, color: V.ink }}>{activeOutfit.name}</div>
              <div style={{ font: "400 11px/1.3 " + t.font, color: V.ink2, marginTop: "2px" }}>
                Active Outfit · {totalWornCount} worn items · 4 HUD attachments
              </div>
            </div>
          </div>
          <span
            style={{
              padding: "4px 8px",
              background: V.priC,
              color: V.onpriC,
              borderRadius: V.rs,
              font: "700 10px/1 " + t.font,
              letterSpacing: ".1em",
              flex: "none",
            }}
          >
            ACTIVE
          </span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
          <KInteractive label="Save outfit as new" onClick={() => actions.notify("Saved current appearance as new Outfit")} style={chipBtn(true)}>
            <Icon name="save" size={14} />
            SAVE AS NEW
          </KInteractive>
          <KInteractive
            label="Take off all attachments"
            onClick={() => {
              setWorn((w) => ({ ...w, attachments: [] }));
              actions.notify("Detached all accessories & HUDs");
            }}
            style={chipBtn(false)}
          >
            <Icon name="trash-2" size={14} />
            DETACH ALL
          </KInteractive>
          <KInteractive label="Reset avatar skeleton" onClick={() => actions.notify("Avatar skeleton & mesh morphs reset")} style={chipBtn(false)}>
            <Icon name="refresh-cw" size={14} />
            RESET SKELETON
          </KInteractive>
        </div>
      </div>

      {/* Sub-view: WORN items */}
      {curSub === "WORN" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            { key: "body", title: "BODY & SHAPE", list: worn.body },
            { key: "clothing", title: "CLOTHING & LAYERS", list: worn.clothing },
            { key: "attachments", title: "ATTACHMENTS & WORN HUDS", list: worn.attachments },
          ].map((sec) => (
            <div
              key={sec.key}
              style={{
                background: V.surf,
                border: bleed ? "none" : "1px solid " + V.outv,
                borderRadius: bleed ? 0 : V.rp,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "10px 14px",
                  background: V.surf2,
                  borderBottom: "1px solid " + V.outv,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ font: "700 10.5px/1 " + t.dfont, letterSpacing: ".18em", color: V.pri }}>{sec.title}</span>
                <span style={{ font: "500 10px/1 " + t.font, color: V.ink2 }}>{sec.list.length} items</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {sec.list.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      minHeight: "46px",
                      padding: "8px 14px",
                      borderBottom: idx < sec.list.length - 1 ? "1px solid " + V.outv : "none",
                    }}
                  >
                    <Icon name={item.icon} size={18} style={{ color: item.hud ? V.sec : V.pri, flex: "none" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ font: "500 13px/1.2 " + t.font, color: V.ink }}>{item.name}</span>
                        {item.hud && (
                          <span style={{ padding: "2px 5px", background: V.sec2, color: V.onsec, borderRadius: "2px", font: "700 8.5px/1 " + t.dfont }}>
                            HUD
                          </span>
                        )}
                      </div>
                      <div style={{ font: "400 10.5px/1.3 " + t.font, color: V.ink2, marginTop: "2px" }}>
                        {item.slot} · {item.meta}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: "none" }}>
                      {item.hud && (
                        <KInteractive
                          label={`Touch ${item.name}`}
                          onClick={() => actions.notify(`Touched HUD: ${item.name}`)}
                          style={{
                            minHeight: "44px",
                            padding: "0 10px",
                            border: "1px solid " + V.outv,
                            borderRadius: V.rs,
                            background: "transparent",
                            color: V.ink,
                            font: "600 10px/1 " + t.dfont,
                            letterSpacing: ".08em",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          TOUCH
                        </KInteractive>
                      )}
                      <KInteractive
                        label={`Take off ${item.name}`}
                        onClick={() => removeItem(sec.key, item.id, item.name)}
                        style={{
                          minHeight: "44px",
                          padding: "0 10px",
                          border: "1px solid " + V.outv,
                          borderRadius: V.rs,
                          background: "transparent",
                          color: V.err || V.ink2,
                          font: "600 10px/1 " + t.dfont,
                          letterSpacing: ".08em",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {item.hud ? "DETACH" : "TAKE OFF"}
                      </KInteractive>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-view: SAVED Outfits */}
      {curSub === "SAVED" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {outfits.map((o) => (
            <div
              key={o.id}
              style={{
                padding: pad,
                background: V.surf,
                border: bleed ? "none" : "1px solid " + (o.active ? V.pri : V.outv),
                borderLeft: bleed ? "4px solid " + (o.active ? V.pri : "transparent") : undefined,
                borderRadius: bleed ? 0 : V.rp,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Icon name="folder-heart" size={20} style={{ color: o.active ? V.pri : V.ink2 }} />
                  <div>
                    <div style={{ font: "600 14px/1.2 " + t.dfont, color: V.ink }}>{o.name}</div>
                    <div style={{ font: "400 11px/1.3 " + t.font, color: V.ink2, marginTop: "2px" }}>
                      {o.items} items · {o.summary}
                    </div>
                  </div>
                </div>
                <span style={{ font: "400 10px/1 " + t.font, color: V.ink2, flex: "none" }}>{o.updated}</span>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                <KInteractive
                  label={o.active ? "Currently wearing" : `Wear ${o.name}`}
                  onClick={() => wearOutfit(o)}
                  style={{
                    minHeight: "44px",
                    padding: "0 12px",
                    background: o.active ? V.priC : V.pri,
                    color: o.active ? V.onpriC : ink(V.pri, [V.bg, V.onpri, V.ink]),
                    border: "1px solid " + (o.active ? V.priC : V.pri),
                    borderRadius: V.rs,
                    font: "700 10.5px/1 " + t.dfont,
                    letterSpacing: ".12em",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Icon name={o.active ? "check" : "shirt"} size={13} />
                  {o.active ? "CURRENT" : "WEAR (REPLACE)"}
                </KInteractive>
                <KInteractive
                  label={`Add ${o.name} to current look`}
                  onClick={() => addOutfit(o)}
                  style={{
                    minHeight: "44px",
                    padding: "0 12px",
                    background: V.surf2,
                    color: V.ink,
                    border: "1px solid " + V.outv,
                    borderRadius: V.rs,
                    font: "600 10.5px/1 " + t.dfont,
                    letterSpacing: ".1em",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Icon name="plus" size={13} />
                  ADD TO LOOK
                </KInteractive>
                <KInteractive
                  label={`Rename ${o.name}`}
                  onClick={() => actions.notify(`Rename outfit dialog: ${o.name}`)}
                  style={{
                    minHeight: "44px",
                    padding: "0 12px",
                    background: "transparent",
                    color: V.ink2,
                    border: "1px solid " + V.outv,
                    borderRadius: V.rs,
                    font: "600 10.5px/1 " + t.dfont,
                    letterSpacing: ".08em",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  RENAME
                </KInteractive>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
