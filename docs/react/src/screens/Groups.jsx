import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { subView } from "../theme/constants.js";
import Icon from "../components/Icon.jsx";
import KInteractive from "../components/KInteractive.jsx";

const GROUPS_DATA = [
  {
    id: "grp-1",
    name: "Bay City Builders",
    charter:
      "Collaborative urban architectural collective building the historic Bay City municipal grid and public tramway system.",
    members: 412,
    role: "Officer",
    title: "Chief Surveyor",
    activeTag: true,
    noticesEnabled: true,
    unreadNotices: 4,
    fee: 0,
    roles: [
      {
        name: "Founder / Owner",
        count: 2,
        powers: ["All Abilities", "Manage Roles", "Close Group"],
      },
      {
        name: "Officer",
        count: 18,
        powers: [
          "Send Notices",
          "Moderate Chat",
          "Eject Members",
          "Deed Land",
          "Object Return",
        ],
      },
      {
        name: "Member",
        count: 392,
        powers: ["Group Chat", "Receive Notices", "Rez Objects on Group Land"],
      },
    ],
  },
  {
    id: "grp-2",
    name: "Sansara Cartographers",
    charter:
      "Mapping the highways, waterways, and historic public roads across the Sansara continent.",
    members: 88,
    role: "Member",
    title: "Route Surveyor",
    activeTag: false,
    noticesEnabled: true,
    unreadNotices: 0,
    fee: 0,
    roles: [
      {
        name: "Cartographer Lead",
        count: 3,
        powers: ["All Abilities", "Manage Routes"],
      },
      { name: "Member", count: 85, powers: ["Group Chat", "Receive Notices"] },
    ],
  },
  {
    id: "grp-3",
    name: "Terraform Co-op",
    charter:
      "Landscaping, raw terrain sculpts, and atmospheric windlight presets for mainland parcels.",
    members: 1204,
    role: "Member",
    title: "Landscaper",
    activeTag: false,
    noticesEnabled: false,
    unreadNotices: 12,
    fee: 50,
    roles: [
      { name: "Directors", count: 4, powers: ["All Abilities"] },
      { name: "Member", count: 1200, powers: ["Group Chat", "Muted Notices"] },
    ],
  },
  {
    id: "grp-4",
    name: "Mono Script Guild",
    charter:
      "LSL & Mono optimization, memory efficiency, and event loop performance testing.",
    members: 56,
    role: "Member",
    title: "Script Apprentice",
    activeTag: false,
    noticesEnabled: false,
    unreadNotices: 0,
    fee: 100,
    roles: [
      { name: "Arch-Wizards", count: 2, powers: ["All Abilities"] },
      { name: "Scripters", count: 54, powers: ["Group Chat", "Code Reviews"] },
    ],
  },
];

export default function Groups() {
  const { state, actions } = useApp();
  const { V, t, bleed, pad, ink } = useTheme();
  const curSub = subView(state, "Groups") || "GROUPS";

  const [groups, setGroups] = useState(GROUPS_DATA);
  const [selectedGroupId, setSelectedGroupId] = useState(GROUPS_DATA[0].id);

  const selectedGroup =
    groups.find((g) => g.id === selectedGroupId) || groups[0];

  const setActiveTag = (groupId) => {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        activeTag: g.id === groupId,
      }))
    );
    const g = groups.find((grp) => grp.id === groupId);
    actions.notify(`Active group title set to: [${g?.title} · ${g?.name}]`);
  };

  const toggleNotices = (groupId) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, noticesEnabled: !g.noticesEnabled } : g
      )
    );
  };

  const openGroupChat = (group) => {
    actions.setTab("Chat", "GROUP");
    actions.setChip(group.name);
    actions.setScreen("Chat");
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

  const activeGroup = groups.find((g) => g.activeTag);

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
      {/* Active Group Title Header */}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
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
              <Icon name="shield" size={22} />
            </div>
            <div>
              <div
                style={{
                  font: "700 11px/1 " + t.dfont,
                  color: V.ink2,
                  letterSpacing: ".1em",
                }}
              >
                ACTIVE GROUP TITLE TAG
              </div>
              <div
                style={{
                  font: "700 15px/1.2 " + t.dfont,
                  color: V.ink,
                  marginTop: "2px",
                }}
              >
                {activeGroup
                  ? `${activeGroup.title} · ${activeGroup.name}`
                  : "None (No Tag Displayed)"}
              </div>
            </div>
          </div>

          <KInteractive
            as="button"
            onClick={() => actions.notify("Opened Create Group dialog")}
            style={actBtn(true)}
            aria-label="Create new group"
          >
            <Icon name="plus" size={14} />
            <span>CREATE GROUP (L$ 100)</span>
          </KInteractive>
        </div>
      </div>

      {/* GROUPS SUB-VIEW */}
      {curSub === "GROUPS" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: bleed ? "4px" : "8px",
          }}
        >
          {groups.map((group) => {
            const isActiveTag = group.activeTag;
            return (
              <div
                key={group.id}
                style={{
                  padding: pad,
                  background: V.surf,
                  border: bleed
                    ? "none"
                    : "1px solid " + (isActiveTag ? V.pri : V.outv),
                  borderLeft: isActiveTag ? "4px solid " + V.pri : undefined,
                  borderRadius: bleed ? 0 : V.rp,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
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
                      <Icon name="users" size={20} />
                    </div>
                    <div>
                      <div
                        style={{
                          font: "700 14px/1.2 " + t.dfont,
                          color: V.ink,
                        }}
                      >
                        {group.name}
                      </div>
                      <div
                        style={{
                          font: "400 11.5px/1.3 " + t.font,
                          color: V.ink2,
                          marginTop: "2px",
                        }}
                      >
                        {group.charter}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          alignItems: "center",
                          marginTop: "4px",
                        }}
                      >
                        <span
                          style={{
                            font: "600 10px/1 " + t.mfont,
                            padding: "2px 6px",
                            borderRadius: "3px",
                            background: V.surf2,
                            color: V.pri,
                            border: "1px solid " + V.outv,
                          }}
                        >
                          Role: {group.role} ({group.title})
                        </span>
                        <span
                          style={{
                            font: "600 10px/1 " + t.mfont,
                            padding: "2px 6px",
                            borderRadius: "3px",
                            background: V.surf2,
                            color: V.ink2,
                            border: "1px solid " + V.outv,
                          }}
                        >
                          👥 {group.members} members
                        </span>
                        {group.unreadNotices > 0 && (
                          <span
                            style={{
                              font: "700 10px/1 " + t.mfont,
                              padding: "2px 6px",
                              borderRadius: "3px",
                              background: V.pri,
                              color: ink(V.pri, [V.bg, V.onpri, V.ink]),
                            }}
                          >
                            🔔 {group.unreadNotices} Notices
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions row */}
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    borderTop: "1px solid " + V.outv,
                    paddingTop: "8px",
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                  }}
                >
                  <KInteractive
                    as="button"
                    onClick={() => openGroupChat(group)}
                    style={actBtn(true)}
                    aria-label={`Open chat for ${group.name}`}
                  >
                    <Icon name="message-square" size={13} />
                    <span>GROUP CHAT</span>
                  </KInteractive>

                  <KInteractive
                    as="button"
                    onClick={() => setActiveTag(group.id)}
                    style={actBtn(isActiveTag)}
                    aria-label="Activate group title tag"
                  >
                    <Icon name="shield" size={13} />
                    <span>
                      {isActiveTag ? "ACTIVE TITLE" : "ACTIVATE TITLE"}
                    </span>
                  </KInteractive>

                  <KInteractive
                    as="button"
                    onClick={() => {
                      setSelectedGroupId(group.id);
                      actions.setTab("Groups", "ROLES");
                    }}
                    style={actBtn(false)}
                    aria-label={`View roles for ${group.name}`}
                  >
                    <Icon name="award" size={13} />
                    <span>ROLES & ABILITIES</span>
                  </KInteractive>

                  <KInteractive
                    as="button"
                    onClick={() => toggleNotices(group.id)}
                    style={actBtn(false)}
                    aria-label="Toggle group notices"
                  >
                    <Icon
                      name={group.noticesEnabled ? "bell" : "bell-off"}
                      size={13}
                    />
                    <span>
                      {group.noticesEnabled ? "NOTICES ON" : "NOTICES MUTED"}
                    </span>
                  </KInteractive>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ROLES SUB-VIEW */}
      {curSub === "ROLES" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: bleed ? "6px" : "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <KInteractive
              as="button"
              onClick={() => actions.setTab("Groups", "GROUPS")}
              style={actBtn(false)}
              aria-label="Back to groups"
            >
              <Icon name="arrow-left" size={14} />
              <span>BACK TO GROUPS</span>
            </KInteractive>

            <span style={{ font: "700 13px/1 " + t.dfont, color: V.ink }}>
              {selectedGroup.name} — Roles & Powers
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: bleed ? "4px" : "8px",
            }}
          >
            {selectedGroup.roles.map((r, i) => (
              <div
                key={i}
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{ font: "700 14px/1.2 " + t.dfont, color: V.ink }}
                  >
                    {r.name}
                  </div>
                  <span style={{ font: "600 11px/1 " + t.mfont, color: V.pri }}>
                    {r.count} assigned
                  </span>
                </div>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {r.powers.map((p, pi) => (
                    <span
                      key={pi}
                      style={{
                        font: "500 11px/1.2 " + t.font,
                        padding: "4px 8px",
                        borderRadius: V.rs,
                        background: V.surf2,
                        color: V.ink,
                        border: "1px solid " + V.outv,
                      }}
                    >
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
