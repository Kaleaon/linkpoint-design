import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import {
  LOCAL_MSGS,
  IM_THREADS,
  GROUP_THREADS,
  IM_CHIPS,
  GROUP_CHIPS,
  GROUPS_DATA,
  GROUP_PARTICIPANTS,
  parseSlurl,
} from "../data/content.js";
import Icon from "../components/Icon.jsx";
import VoiceChatBar from "../components/VoiceChatBar.jsx";

function LandmarkCard({ slurlData, state, actions, V, t }) {
  const [imgFailed, setImgFailed] = useState(false);
  const regionKey = slurlData.regionName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
  const isSaved = !!state.pinned[regionKey];
  const isOffline = state.loginMode === "offline";

  return (
    <div
      style={{
        marginTop: "8px",
        maxHeight: "140px",
        height: "128px",
        border: "1px solid " + V.outv,
        borderRadius: V.rs,
        overflow: "hidden",
        background: V.bg,
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div
        style={{
          width: "96px",
          height: "100%",
          flex: "none",
          position: "relative",
          background:
            "repeating-linear-gradient(135deg," +
            V.surf2 +
            " 0 8px, transparent 8px 16px)",
          borderRight: "1px solid " + V.outv,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {!imgFailed && slurlData.img ? (
          <img
            src={slurlData.img}
            alt={slurlData.regionName}
            onError={() => setImgFailed(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              color: V.pri,
              opacity: 0.9,
            }}
          >
            <Icon name="map-pin" size={22} />
            <span
              style={{
                font: "700 9px/1 " + t.dfont,
                letterSpacing: ".08em",
                textTransform: "uppercase",
              }}
            >
              {slurlData.rating}
            </span>
          </div>
        )}
      </div>

      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: "8px 10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              font: "600 12px/1.2 " + t.font,
              color: V.ink,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {slurlData.regionName}
          </div>
          <div
            style={{
              font: "400 10px/1.3 " + t.font,
              color: V.ink2,
              marginTop: "2px",
            }}
          >
            {slurlData.coords} ·{" "}
            <span style={{ color: V.sec2 }}>{slurlData.avatars}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <button
            onClick={() =>
              actions.teleportToRegion(slurlData.regionName, slurlData.coords)
            }
            style={{
              flex: "none",
              padding: "4px 8px",
              borderRadius: V.rs,
              border: "none",
              background: isOffline ? V.surf2 : V.pri,
              color: isOffline ? V.ink2 : V.onpri,
              font: "600 10px/1 " + t.dfont,
              letterSpacing: ".06em",
              cursor: isOffline ? "not-allowed" : "pointer",
              opacity: isOffline ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Icon name="zap" size={11} />
            TELEPORT
          </button>

          <button
            onClick={() => {
              actions.notify("Viewing " + slurlData.regionName + " on Map");
              actions.setScreen("Map");
            }}
            style={{
              flex: "none",
              padding: "4px 8px",
              borderRadius: V.rs,
              border: "1px solid " + V.outv,
              background: "transparent",
              color: V.ink,
              font: "500 10px/1 " + t.font,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Icon name="map" size={11} />
            VIEW ON MAP
          </button>

          <button
            onClick={() => actions.saveLandmark(slurlData.regionName)}
            style={{
              flex: "none",
              padding: "4px 8px",
              borderRadius: V.rs,
              border: "1px solid " + (isSaved ? V.pri : V.outv),
              background: isSaved ? V.priC : "transparent",
              color: isSaved ? V.pri : V.ink,
              font: "500 10px/1 " + t.font,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Icon name={isSaved ? "check" : "bookmark"} size={11} />
            {isSaved ? "SAVED" : "SAVE LANDMARK"}
          </button>
        </div>
      </div>
    </div>
  );
}

function LureCard({ msg, state, actions, V, t }) {
  const response = state.lureState[msg.id || msg.ts];
  const isOffline = state.loginMode === "offline";

  return (
    <div
      style={{
        marginTop: "8px",
        maxHeight: "140px",
        padding: "8px 10px",
        border:
          "1px solid " +
          (response === "accepted"
            ? V.pri
            : response === "declined"
              ? V.outv
              : V.sec2),
        borderRadius: V.rs,
        background: V.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "6px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <Icon name="zap" size={14} style={{ color: V.sec2 }} />
        <span
          style={{
            font: "600 11px/1.2 " + t.dfont,
            color: V.sec2,
            letterSpacing: ".06em",
          }}
        >
          TELEPORT OFFER
        </span>
        {response && (
          <span
            style={{
              marginLeft: "auto",
              font: "700 9px/1 " + t.dfont,
              padding: "2px 6px",
              borderRadius: V.rs,
              background: response === "accepted" ? V.pri : V.surf2,
              color: response === "accepted" ? V.onpri : V.ink2,
            }}
          >
            {response === "accepted" ? "✓ ACCEPTED" : "✗ DECLINED"}
          </span>
        )}
      </div>

      <div style={{ font: "400 11px/1.3 " + t.font, color: V.ink }}>
        “{msg.lureMsg || "Come teleport to my location"}”
      </div>

      <div style={{ font: "400 10px/1.2 " + t.font, color: V.ink2 }}>
        Destination: {msg.lureRegion} {msg.lureCoords}
      </div>

      {!response ? (
        <div style={{ display: "flex", gap: "8px", marginTop: "2px" }}>
          <button
            onClick={() =>
              actions.respondLure(
                msg.id || msg.ts,
                "accepted",
                msg.lureRegion,
                msg.lureCoords,
              )
            }
            style={{
              padding: "5px 10px",
              borderRadius: V.rs,
              border: "none",
              background: isOffline ? V.surf2 : V.pri,
              color: isOffline ? V.ink2 : V.onpri,
              font: "600 10px/1 " + t.dfont,
              letterSpacing: ".06em",
              cursor: isOffline ? "not-allowed" : "pointer",
              opacity: isOffline ? 0.7 : 1,
            }}
          >
            ACCEPT LURE
          </button>
          <button
            onClick={() =>
              actions.respondLure(
                msg.id || msg.ts,
                "declined",
                msg.lureRegion,
                msg.lureCoords,
              )
            }
            style={{
              padding: "5px 10px",
              borderRadius: V.rs,
              border: "1px solid " + V.outv,
              background: "transparent",
              color: V.ink2,
              font: "500 10px/1 " + t.font,
              cursor: "pointer",
            }}
          >
            DECLINE
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function Chat() {
  const { state, actions } = useApp();
  const { V, t, bleed, pad, C, nav, d } = useTheme();

  const [rosterOpen, setRosterOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const curTab = state.tabs.Chat;
  const chipList =
    curTab === "GROUP" ? GROUP_CHIPS : curTab === "IM" ? IM_CHIPS : [];
  const activeChip = chipList.includes(state.chip) ? state.chip : chipList[0];
  const source =
    curTab === "IM"
      ? IM_THREADS[activeChip]
      : curTab === "GROUP"
        ? GROUP_THREADS[activeChip]
        : LOCAL_MSGS;

  const activeGroup = GROUPS_DATA.find((g) => g.name === activeChip) || {
    name: activeChip,
    role: "Member",
    roles: [],
  };

  const isOfficer =
    activeGroup.role === "Officer" ||
    activeGroup.role === "Founder / Owner" ||
    activeGroup.roles?.some(
      (r) =>
        r.name.toLowerCase().includes(activeGroup.role?.toLowerCase() || "") &&
        (r.powers.includes("Moderate Chat") ||
          r.powers.includes("Eject Members") ||
          r.powers.includes("All Abilities")),
    );

  const participants = GROUP_PARTICIPANTS[activeChip] || [
    {
      id: "p-self",
      name: "Ruth Resident",
      role: activeGroup.role || "Member",
      online: true,
      voice: true,
      isSelf: true,
    },
    {
      id: "p-other",
      name: "Marlowe Quill",
      role: "Member",
      online: true,
      voice: false,
    },
  ];

  const onlineCount = participants.filter((p) => p.online).length;
  const isMobile = !d?.desk && !d?.split && (d?.w ? d.w < 600 : true);

  const wrapBase = {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
  };
  const bubBase = {
    maxWidth: "88%",
    padding: "8px 10px",
    border: "1px solid " + V.outv,
    borderRadius: V.rp,
    background: V.surf,
  };
  const headBase = {
    font: "400 10px/1.3 " + t.font,
    color: V.pri,
    marginBottom: "3px",
  };
  const textBase = { font: "400 13px/1.45 " + t.font, color: V.ink };

  const chatBodyStyle = bleed
    ? {
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: C.gap + "px",
        padding: 0,
        background: V.bg,
      }
    : {
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        padding: "8px 12px",
      };

  const composerStyle = {
    flex: "none",
    display: "flex",
    gap: "8px",
    borderTop: "1px solid " + V.outv,
    background: V.surf,
    padding: nav === "sweep" ? "12px 12px 12px 0" : "12px",
    borderTopLeftRadius: nav === "sweep" ? V.rl : "0",
    borderTopRightRadius: nav === "sweep" ? V.rl : "0",
  };
  const composerFieldStyle = {
    flex: 1,
    minWidth: 0,
    minHeight: "44px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "0 12px",
    border: "1px solid " + V.outv,
    background: V.bg,
    borderRadius: nav === "sweep" ? "0 " + V.rs + " " + V.rs + " 0" : V.rs,
  };

  const voiceChannel =
    curTab === "IM"
      ? `Direct Voice · ${activeChip}`
      : curTab === "GROUP"
        ? `Group Voice · ${activeChip}`
        : "Spatial Voice · Heliotrope";

  return (
    <>
      <div
        style={{
          flex: "none",
          padding: bleed ? "4px 10px 4px" : "4px 12px 6px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <VoiceChatBar channelName={voiceChannel} />
        </div>
        {curTab === "GROUP" && (
          <button
            type="button"
            data-testid="toggle-roster-btn"
            onClick={() => setRosterOpen((prev) => !prev)}
            aria-label={
              rosterOpen
                ? "Close participant roster drawer"
                : "Open participant roster drawer"
            }
            aria-expanded={rosterOpen}
            style={{
              flex: "none",
              height: "36px",
              padding: "0 10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              borderRadius: V.rs,
              border: "1px solid " + (rosterOpen ? V.pri : V.outv),
              background: rosterOpen ? V.priC : V.surf,
              color: rosterOpen ? V.pri : V.ink,
              cursor: "pointer",
              font: "700 10.5px/1 " + t.dfont,
              letterSpacing: ".06em",
            }}
          >
            <Icon name="users" size={14} />
            <span>ROSTER</span>
            <span
              style={{
                font: "600 9px/1 " + t.mfont,
                padding: "2px 5px",
                borderRadius: "999px",
                background: rosterOpen ? V.pri : V.surf2,
                color: rosterOpen ? V.onpri : V.ink2,
              }}
            >
              {onlineCount}
            </span>
          </button>
        )}
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
        }}
      >
        <div style={chatBodyStyle}>
          {source.map((m, i) => {
            const acc = m.sys ? V.info : m.me ? V.pri : V.sec2;
            const align = bleed
              ? { display: "flex", width: "100%" }
              : {
                  ...wrapBase,
                  ...(m.me ? { justifyContent: "flex-end" } : null),
                };
            const bubble = bleed
              ? {
                  flex: 1,
                  minWidth: 0,
                  background: V.surf,
                  borderLeft: "4px solid " + acc,
                  overflow: "hidden",
                  padding: pad + " 12px " + pad + " 10px",
                }
              : {
                  ...bubBase,
                  ...(m.me
                    ? { background: V.priC, borderColor: V.pri }
                    : m.sys
                      ? {
                          background: "transparent",
                          borderStyle: "dashed",
                          borderColor: V.info,
                        }
                      : null),
                };
            const headStyle = bleed
              ? {
                  font: "400 10px/1.3 " + t.font,
                  color: acc,
                  letterSpacing: ".06em",
                  marginBottom: "3px",
                }
              : {
                  ...headBase,
                  ...(m.sys
                    ? { color: V.info }
                    : m.me
                      ? { color: V.onpriC }
                      : null),
                };
            const textStyle = bleed
              ? { ...textBase, ...(m.sys ? { color: V.info } : null) }
              : {
                  ...textBase,
                  ...(m.sys
                    ? { color: V.info }
                    : m.me
                      ? { color: V.onpriC }
                      : null),
                };

            const slurlData = parseSlurl(m.text, m.linkUrl, m.linkTitle);

            return (
              <div key={i} style={align}>
                <div style={bubble}>
                  <div style={headStyle}>
                    [{m.ts}] {m.sender}
                  </div>
                  <div style={textStyle}>{m.text}</div>

                  {m.isLure ? (
                    <LureCard
                      msg={m}
                      state={state}
                      actions={actions}
                      V={V}
                      t={t}
                    />
                  ) : slurlData ? (
                    <LandmarkCard
                      slurlData={slurlData}
                      state={state}
                      actions={actions}
                      V={V}
                      t={t}
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
          <div
            style={{
              font: "400 12px/1.4 " + t.font,
              color: V.ink2,
              padding: bleed ? "6px 10px" : "4px 2px",
            }}
          >
            &gt; Nyx is typing
            <span style={{ animation: "blink 1s steps(1) infinite" }}>_</span>
          </div>
        </div>

        {curTab === "GROUP" && rosterOpen && (
          <>
            {isMobile && (
              <div
                data-testid="roster-backdrop"
                onClick={() => {
                  setRosterOpen(false);
                  setSelectedMember(null);
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.5)",
                  zIndex: 20,
                }}
                aria-hidden="true"
              />
            )}
            <aside
              data-testid="participant-roster-drawer"
              aria-label="Group participant roster"
              style={
                isMobile
                  ? {
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: "82%",
                      maxWidth: "300px",
                      background: V.surf,
                      borderLeft: "1px solid " + V.outv,
                      zIndex: 25,
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "-4px 0 20px rgba(0,0,0,0.5)",
                    }
                  : {
                      width: "240px",
                      flex: "none",
                      background: V.surf,
                      borderLeft: "1px solid " + V.outv,
                      display: "flex",
                      flexDirection: "column",
                      zIndex: 5,
                    }
              }
            >
              {/* Drawer Header */}
              <div
                style={{
                  flex: "none",
                  padding: "10px 12px",
                  borderBottom: "1px solid " + V.outv,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                  background: V.bg,
                }}
              >
                <div>
                  <div
                    style={{
                      font: "700 11px/1 " + t.dfont,
                      color: V.ink,
                      letterSpacing: ".08em",
                    }}
                  >
                    PARTICIPANTS
                  </div>
                  <div
                    style={{
                      font: "500 9.5px/1 " + t.font,
                      color: V.ink2,
                      marginTop: "2px",
                    }}
                  >
                    {onlineCount} online · {participants.length} total
                  </div>
                </div>

                <button
                  type="button"
                  data-testid="close-roster-btn"
                  onClick={() => {
                    setRosterOpen(false);
                    setSelectedMember(null);
                  }}
                  aria-label="Close participants drawer"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: V.ink2,
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: V.rs,
                  }}
                >
                  <Icon name="x" size={15} />
                </button>
              </div>

              {/* Participant List */}
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  padding: "6px",
                }}
              >
                {participants.map((member) => {
                  const isSelected = selectedMember?.id === member.id;
                  return (
                    <div
                      key={member.id}
                      style={{
                        position: "relative",
                        borderRadius: V.rs,
                        background: isSelected ? V.surf2 : "transparent",
                        border:
                          "1px solid " + (isSelected ? V.pri : "transparent"),
                      }}
                    >
                      <button
                        type="button"
                        data-testid={`member-row-${member.name.replace(
                          /\s+/g,
                          "-",
                        )}`}
                        onClick={() =>
                          setSelectedMember(isSelected ? null : member)
                        }
                        aria-expanded={isSelected}
                        aria-label={`${member.name}, ${member.role}, ${
                          member.online ? "Online" : "Offline"
                        }${member.voice ? ", Voice active" : ""}`}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          color: V.ink,
                        }}
                      >
                        {/* Online Indicator */}
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            flex: "none",
                            background: member.online
                              ? V.ok || "#22c55e"
                              : V.outv || "#64748b",
                          }}
                          title={member.online ? "Online" : "Offline"}
                        />

                        {/* Name and Role */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              font: "600 11.5px/1.2 " + t.font,
                              color: V.ink,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <span>{member.name}</span>
                            {member.isSelf && (
                              <span
                                style={{
                                  font: "400 9px/1 " + t.font,
                                  color: V.ink2,
                                }}
                              >
                                (You)
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              marginTop: "3px",
                            }}
                          >
                            <span
                              style={{
                                font: "700 8.5px/1 " + t.dfont,
                                letterSpacing: ".06em",
                                padding: "2px 5px",
                                borderRadius: V.rs,
                                background:
                                  member.role === "Founder / Owner"
                                    ? V.priC
                                    : V.surf2,
                                color:
                                  member.role === "Founder / Owner"
                                    ? V.pri
                                    : V.ink2,
                                textTransform: "uppercase",
                              }}
                            >
                              {member.role}
                            </span>
                          </div>
                        </div>

                        {/* Active Voice Indicator */}
                        {member.voice && (
                          <span
                            title="Active Voice"
                            data-testid={`voice-indicator-${member.name.replace(
                              /\s+/g,
                              "-",
                            )}`}
                            style={{
                              color: V.ok || "#22c55e",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "3px",
                              borderRadius: "50%",
                              background: "rgba(34, 197, 94, 0.15)",
                            }}
                          >
                            <Icon name="mic" size={12} />
                          </span>
                        )}

                        <Icon
                          name={isSelected ? "chevron-up" : "more-vertical"}
                          size={13}
                          style={{ color: V.ink2, flex: "none" }}
                        />
                      </button>

                      {/* Inline Moderation Actions Menu */}
                      {isSelected && (
                        <div
                          role="menu"
                          data-testid="moderation-menu"
                          style={{
                            margin: "4px 8px 8px",
                            padding: "6px",
                            borderRadius: V.rs,
                            background: V.bg,
                            border: "1px solid " + V.outv,
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                          }}
                        >
                          <div
                            style={{
                              font: "700 9px/1 " + t.dfont,
                              color: V.ink2,
                              letterSpacing: ".08em",
                              padding: "4px 6px",
                              borderBottom: "1px solid " + V.outv,
                              marginBottom: "2px",
                            }}
                          >
                            MODERATION CONTROLS
                          </div>

                          {/* Mute action */}
                          <button
                            type="button"
                            role="menuitem"
                            data-testid="moderation-mute-btn"
                            disabled={!isOfficer || member.isSelf}
                            onClick={() => {
                              actions.dispatchIntent(
                                "GROUP_MODERATION_ACTION",
                                {
                                  action: "mute",
                                  target: member.name,
                                  group: activeChip,
                                },
                              );
                              actions.notify(
                                `Muted ${member.name} in ${activeChip}`,
                              );
                              setSelectedMember(null);
                            }}
                            aria-label={`Mute ${member.name}`}
                            style={{
                              padding: "6px 8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "6px",
                              borderRadius: V.rs,
                              border: "none",
                              background:
                                isOfficer && !member.isSelf
                                  ? V.surf2
                                  : "transparent",
                              color:
                                isOfficer && !member.isSelf ? V.ink : V.ink2,
                              cursor:
                                isOfficer && !member.isSelf
                                  ? "pointer"
                                  : "not-allowed",
                              opacity: isOfficer && !member.isSelf ? 1 : 0.5,
                              font: "600 10.5px/1 " + t.font,
                              textAlign: "left",
                            }}
                          >
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <Icon name="volume-x" size={13} />
                              <span>Mute Member</span>
                            </span>
                            {!isOfficer && (
                              <span
                                style={{
                                  font: "400 8.5px/1 " + t.dfont,
                                  color: V.err || "#ef4444",
                                }}
                              >
                                OFFICER ONLY
                              </span>
                            )}
                          </button>

                          {/* Kick / Eject action */}
                          <button
                            type="button"
                            role="menuitem"
                            data-testid="moderation-kick-btn"
                            disabled={!isOfficer || member.isSelf}
                            onClick={() => {
                              actions.dispatchIntent(
                                "GROUP_MODERATION_ACTION",
                                {
                                  action: "kick",
                                  target: member.name,
                                  group: activeChip,
                                },
                              );
                              actions.notify(
                                `Ejected ${member.name} from ${activeChip}`,
                              );
                              setSelectedMember(null);
                            }}
                            aria-label={`Kick ${member.name}`}
                            style={{
                              padding: "6px 8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "6px",
                              borderRadius: V.rs,
                              border: "none",
                              background:
                                isOfficer && !member.isSelf
                                  ? V.surf2
                                  : "transparent",
                              color:
                                isOfficer && !member.isSelf
                                  ? V.err || "#ef4444"
                                  : V.ink2,
                              cursor:
                                isOfficer && !member.isSelf
                                  ? "pointer"
                                  : "not-allowed",
                              opacity: isOfficer && !member.isSelf ? 1 : 0.5,
                              font: "600 10.5px/1 " + t.font,
                              textAlign: "left",
                            }}
                          >
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <Icon name="user-x" size={13} />
                              <span>Kick Member</span>
                            </span>
                            {!isOfficer && (
                              <span
                                style={{
                                  font: "400 8.5px/1 " + t.dfont,
                                  color: V.err || "#ef4444",
                                }}
                              >
                                OFFICER ONLY
                              </span>
                            )}
                          </button>

                          {/* View Profile action */}
                          <button
                            type="button"
                            role="menuitem"
                            data-testid="moderation-profile-btn"
                            onClick={() => {
                              actions.dispatchIntent("NAVIGATE_SCREEN", {
                                screen: "Profile",
                                target: member.name,
                              });
                              actions.setScreen("Profile");
                              actions.notify(`Viewing profile: ${member.name}`);
                              setSelectedMember(null);
                            }}
                            aria-label={`View profile for ${member.name}`}
                            style={{
                              padding: "6px 8px",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              borderRadius: V.rs,
                              border: "none",
                              background: V.surf2,
                              color: V.ink,
                              cursor: "pointer",
                              font: "600 10.5px/1 " + t.font,
                              textAlign: "left",
                            }}
                          >
                            <Icon name="user" size={13} />
                            <span>View Profile</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </aside>
          </>
        )}
      </div>

      <div style={composerStyle}>
        <div style={composerFieldStyle}>
          <Icon name="smile" size={16} style={{ opacity: 0.55 }} />
          <span style={{ font: "400 13px/1 " + t.font, color: V.ink2 }}>
            say to local…
          </span>
          <span
            style={{
              marginLeft: "auto",
              font: "600 10px/1 " + t.font,
              color: V.ink2,
              letterSpacing: ".1em",
            }}
          >
            /1
          </span>
        </div>
        <div
          style={{
            width: "48px",
            height: "44px",
            flex: "none",
            borderRadius: V.rs,
            background: V.pri,
            color: V.onpri,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Icon name="send" size={19} />
        </div>
      </div>
    </>
  );
}
