import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { subView } from "../theme/constants.js";
import Icon from "../components/Icon.jsx";
import KInteractive from "../components/KInteractive.jsx";

const NOTICES_IM = [
  {
    id: "not-grp-1",
    type: "group",
    source: "Bay City Builders",
    title: "Weekly Build Jam Saturday 14:00 SLT",
    body: "Join us at the coastal tram terminal. Landmark attached — please keep prim limits in mind when testing physics sculpts.",
    time: "2 hours ago",
    attachment: { type: "landmark", name: "Landmark: Bay City Jam Site", coords: "<112, 44, 51>" },
    unread: true,
  },
  {
    id: "not-lure-1",
    type: "teleport",
    source: "Kit Sandalwood",
    title: "Teleport Offer",
    body: "Kit Sandalwood offers to teleport you to Bay City — Hollywood <112, 44, 51>: “come inspect the UV alignment in person”",
    time: "4 hours ago",
    attachment: null,
    unread: true,
  },
  {
    id: "not-item-1",
    type: "inventory",
    source: "Sable Ashgrove",
    title: "Inventory Offer",
    body: "Sable Ashgrove sent you “Modular Brick Texture Pack (Bake 4K)”.",
    time: "Yesterday 16:30",
    attachment: { type: "texture", name: "Modular Brick Texture Pack (Bake 4K)", size: "4 items" },
    unread: false,
  },
];

const NOTICES_SYSTEM = [
  {
    id: "not-sys-1",
    type: "maintenance",
    source: "Second Life Grid Operations",
    title: "Agni Main Grid Rolling Restarts",
    body: "Rolling restarts scheduled for Wednesday 06:00–08:00 SLT across mainland simulator channels.",
    time: "Today 10:00 SLT",
    severity: "info",
  },
  {
    id: "not-sys-2",
    type: "region",
    source: "Simulator Server (Da Boom)",
    title: "Region Restart Scheduled",
    body: "Region 'Da Boom' is scheduled for periodic maintenance restart in 1h 45m. Please save in-world builds.",
    time: "Today 12:15 SLT",
    severity: "warning",
  },
  {
    id: "not-sys-3",
    type: "billing",
    source: "LindeX Financial",
    title: "Payment Received: L$ 1,200",
    body: "Marlowe Quill completed purchase of “Roof Kit v2 (Modular Mesh)”. Funds credited to your account.",
    time: "Today 14:32 SLT",
    severity: "success",
  },
];

export default function Notices() {
  const { state, actions } = useApp();
  const { V, t, bleed, pad, ink } = useTheme();
  const curSub = subView(state, "Notices") || "IM";

  const [imNotices, setImNotices] = useState(NOTICES_IM);
  const [sysNotices, setSysNotices] = useState(NOTICES_SYSTEM);

  const markAllRead = () => {
    setImNotices((prev) => prev.map((n) => ({ ...n, unread: false })));
    actions.notify("All notifications marked as read");
  };

  const dismissNotice = (id) => {
    setImNotices((prev) => prev.filter((n) => n.id !== id));
    actions.notify("Notification dismissed");
  };

  const actBtn = (primary = false) => ({
    minHeight: "44px",
    padding: "0 12px",
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
    letterSpacing: ".1em",
    whiteSpace: "nowrap",
  });

  const unreadCount = imNotices.filter((n) => n.unread).length;

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
          borderLeft: bleed ? "4px solid " + V.pri : undefined,
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
                color: V.pri,
                border: "1px solid " + V.outv,
                flexShrink: 0,
              }}
            >
              <Icon name="bell" size={22} />
            </div>
            <div>
              <div style={{ font: "700 15px/1.2 " + t.dfont, color: V.ink }}>Notifications Hub</div>
              <div style={{ font: "400 11px/1.3 " + t.font, color: V.ink2, marginTop: "2px" }}>
                {unreadCount} unread incoming notices · {imNotices.length + sysNotices.length} total alerts
              </div>
            </div>
          </div>

          <KInteractive
            as="button"
            onClick={markAllRead}
            style={actBtn(false)}
            aria-label="Mark all notifications as read"
          >
            <Icon name="check-check" size={14} />
            <span>MARK ALL READ</span>
          </KInteractive>
        </div>
      </div>

      {/* IM / OFFERS SUB-VIEW */}
      {curSub === "IM" && (
        <div style={{ display: "flex", flexDirection: "column", gap: bleed ? "4px" : "8px" }}>
          {imNotices.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: V.ink2, font: "400 13px/1.4 " + t.font }}>
              No incoming messages or group notices.
            </div>
          ) : (
            imNotices.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: pad,
                  background: V.surf,
                  border: bleed ? "none" : "1px solid " + V.outv,
                  borderLeft: n.unread ? "4px solid " + V.pri : undefined,
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
                        color: V.pri,
                        border: "1px solid " + V.outv,
                      }}
                    >
                      <Icon
                        name={n.type === "teleport" ? "zap" : n.type === "inventory" ? "package" : "megaphone"}
                        size={18}
                      />
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ font: "700 14px/1.2 " + t.dfont, color: V.ink }}>{n.title}</span>
                        {n.unread && (
                          <span style={{ font: "700 9px/1 " + t.mfont, padding: "2px 5px", borderRadius: "3px", background: V.pri, color: ink(V.pri, [V.bg, V.onpri, V.ink]) }}>
                            NEW
                          </span>
                        )}
                      </div>
                      <div style={{ font: "600 11px/1.3 " + t.font, color: V.ink2, marginTop: "2px" }}>
                        From: <span style={{ color: V.ink }}>{n.source}</span> · {n.time}
                      </div>
                      <div style={{ font: "400 12px/1.4 " + t.font, color: V.ink, marginTop: "4px" }}>
                        {n.body}
                      </div>

                      {/* Attachment Card */}
                      {n.attachment && (
                        <div
                          style={{
                            marginTop: "8px",
                            padding: "6px 10px",
                            background: V.surf2,
                            borderRadius: V.rs,
                            border: "1px solid " + V.outv,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Icon name={n.attachment.type === "landmark" ? "map-pin" : "image"} size={14} style={{ color: V.pri }} />
                          <span style={{ font: "600 11.5px/1 " + t.font, color: V.ink }}>{n.attachment.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "6px", borderTop: "1px solid " + V.outv, paddingTop: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {n.attachment?.type === "landmark" && (
                    <KInteractive
                      as="button"
                      onClick={() => {
                        actions.notify(`Teleporting via notice to ${n.attachment.coords}...`);
                        actions.setScreen("Map");
                      }}
                      style={actBtn(true)}
                      aria-label="Teleport via landmark"
                    >
                      <Icon name="zap" size={13} />
                      <span>TELEPORT NOW</span>
                    </KInteractive>
                  )}

                  {n.type === "group" && (
                    <KInteractive
                      as="button"
                      onClick={() => {
                        actions.setTab("Chat", "GROUP");
                        actions.setChip(n.source);
                        actions.setScreen("Chat");
                      }}
                      style={actBtn(true)}
                      aria-label={`Open chat for ${n.source}`}
                    >
                      <Icon name="message-square" size={13} />
                      <span>OPEN GROUP CHAT</span>
                    </KInteractive>
                  )}

                  {n.type === "teleport" && (
                    <KInteractive
                      as="button"
                      onClick={() => {
                        actions.notify("Teleport offer accepted");
                        actions.setScreen("Map");
                      }}
                      style={actBtn(true)}
                      aria-label="Accept teleport offer"
                    >
                      <Icon name="zap" size={13} />
                      <span>ACCEPT TELEPORT</span>
                    </KInteractive>
                  )}

                  {n.type === "inventory" && (
                    <KInteractive
                      as="button"
                      onClick={() => {
                        actions.notify(`Accepted “${n.attachment.name}” into Inventory`);
                        dismissNotice(n.id);
                      }}
                      style={actBtn(true)}
                      aria-label="Accept inventory item"
                    >
                      <Icon name="package-check" size={13} />
                      <span>ACCEPT ITEM</span>
                    </KInteractive>
                  )}

                  <KInteractive
                    as="button"
                    onClick={() => dismissNotice(n.id)}
                    style={actBtn(false)}
                    aria-label="Dismiss notice"
                  >
                    <span>DISMISS</span>
                  </KInteractive>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SYSTEM SUB-VIEW */}
      {curSub === "SYSTEM" && (
        <div style={{ display: "flex", flexDirection: "column", gap: bleed ? "4px" : "8px" }}>
          {sysNotices.map((sn) => {
            const isWarn = sn.severity === "warning";
            const isSuccess = sn.severity === "success";
            return (
              <div
                key={sn.id}
                style={{
                  padding: pad,
                  background: V.surf,
                  border: bleed ? "none" : "1px solid " + V.outv,
                  borderLeft: isWarn
                    ? "4px solid " + (V.warn || "#f59e0b")
                    : isSuccess
                    ? "4px solid " + (V.ok || "#22c55e")
                    : "4px solid " + V.pri,
                  borderRadius: bleed ? 0 : V.rp,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
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
                      color: isWarn ? (V.warn || "#f59e0b") : isSuccess ? (V.ok || "#22c55e") : V.pri,
                      border: "1px solid " + V.outv,
                    }}
                  >
                    <Icon name={isWarn ? "alert-triangle" : isSuccess ? "check-circle" : "info"} size={18} />
                  </div>
                  <div>
                    <div style={{ font: "700 14px/1.2 " + t.dfont, color: V.ink }}>{sn.title}</div>
                    <div style={{ font: "600 11px/1.3 " + t.font, color: V.ink2, marginTop: "2px" }}>
                      Source: {sn.source} · {sn.time}
                    </div>
                    <div style={{ font: "400 12px/1.4 " + t.font, color: V.ink, marginTop: "4px" }}>
                      {sn.body}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
