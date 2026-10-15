import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { subView } from "../theme/constants.js";
import Icon from "../components/Icon.jsx";
import KInteractive from "../components/KInteractive.jsx";

const INITIAL_FRIENDS = [
  {
    id: "fr-1",
    name: "Nyx Vaher",
    uuid: "4f2a9c11-1920-41ab-8812-701928374611",
    online: true,
    location: "Da Boom <128, 128, 26>",
    status: "Building roof trusses · typing...",
    rights: { seeOnline: true, seeOnMap: true, modifyObjects: true },
  },
  {
    id: "fr-2",
    name: "Kit Sandalwood",
    uuid: "8b71ee02-4412-491a-9901-281920384756",
    online: true,
    location: "Bay City — Hollywood <112, 44, 51>",
    status: "Voice active · inspecting UV alignment",
    rights: { seeOnline: true, seeOnMap: true, modifyObjects: false },
  },
  {
    id: "fr-3",
    name: "Marlowe Quill",
    uuid: "22c4a5de-8819-4029-ba12-119283746501",
    online: true,
    location: "Da Boom <112, 110, 34>",
    status: "Working on security script v2",
    rights: { seeOnline: true, seeOnMap: false, modifyObjects: false },
  },
  {
    id: "fr-4",
    name: "Sable Ashgrove",
    uuid: "661928da-0012-48ac-ba99-882190384729",
    online: false,
    location: "Offline",
    status: "Seen 2 days ago in Sansara",
    rights: { seeOnline: true, seeOnMap: true, modifyObjects: false },
  },
  {
    id: "fr-5",
    name: "Tamsin Reed",
    uuid: "77210398-1192-4412-8801-441293847561",
    online: false,
    location: "Offline",
    status: "Seen 5 days ago in Ahern",
    rights: { seeOnline: true, seeOnMap: false, modifyObjects: false },
  },
  {
    id: "fr-6",
    name: "Oren Fairweather",
    uuid: "99120384-5512-4019-9912-881920384712",
    online: false,
    location: "Offline",
    status: "Seen 1 week ago in Kitely Hub",
    rights: { seeOnline: false, seeOnMap: false, modifyObjects: false },
  },
];

export default function Friends() {
  const { state, actions } = useApp();
  const { V, t, bleed, pad, ink } = useTheme();
  const curSub = subView(state, "Friends") || "ALL";

  const [friends, setFriends] = useState(INITIAL_FRIENDS);
  const [query, setQuery] = useState("");
  const [friendReqDismissed, setFriendReqDismissed] = useState(false);

  const toggleRight = (friendId, rightKey) => {
    setFriends((prev) =>
      prev.map((f) => {
        if (f.id === friendId) {
          const updated = { ...f.rights, [rightKey]: !f.rights[rightKey] };
          actions.notify(`Updated permissions for ${f.name}`);
          return { ...f, rights: updated };
        }
        return f;
      })
    );
  };

  const offerTeleport = (friend) => {
    actions.notify(`Teleport offer sent to ${friend.name}`);
  };

  const startIM = (friend) => {
    actions.setTab("Chat", "IM");
    actions.setChip(friend.name);
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

  const onlineFriends = friends.filter((f) => f.online);
  const displayFriends = friends
    .filter((f) => curSub === "ALL" || f.online)
    .filter((f) => !query.trim() || f.name.toLowerCase().includes(query.toLowerCase()));

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
              <Icon name="users" size={22} />
            </div>
            <div>
              <div style={{ font: "700 15px/1.2 " + t.dfont, color: V.ink }}>Friends List</div>
              <div style={{ font: "400 11px/1.3 " + t.font, color: V.ink2, marginTop: "2px" }}>
                {onlineFriends.length} online · {friends.length} total contacts
              </div>
            </div>
          </div>

          <KInteractive
            as="button"
            onClick={() => {
              actions.setScreen("Search");
              actions.setTab("Search", "FRIENDS");
            }}
            style={actBtn(true)}
            aria-label="Find and add residents"
          >
            <Icon name="user-plus" size={14} />
            <span>ADD FRIEND...</span>
          </KInteractive>
        </div>
      </div>

      {/* Pending Friend Request Banner */}
      {!friendReqDismissed && (
        <div
          style={{
            padding: pad,
            background: V.surf,
            border: "1px solid " + (V.pri || "#3b82f6"),
            borderLeft: "4px solid " + (V.pri || "#3b82f6"),
            borderRadius: bleed ? 0 : V.rp,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <Icon name="user-plus" size={20} style={{ color: V.pri, marginTop: "2px" }} />
              <div>
                <div style={{ font: "700 13.5px/1.2 " + t.dfont, color: V.ink }}>Friend Request: Kit Sandalwood</div>
                <div style={{ font: "400 11.5px/1.3 " + t.font, color: V.ink2, marginTop: "2px" }}>
                  “met you at the Bay City build jam” · offers mutual friendship
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "6px" }}>
              <KInteractive
                as="button"
                onClick={() => {
                  setFriendReqDismissed(true);
                  actions.notify("Accepted friend request from Kit Sandalwood");
                }}
                style={actBtn(true)}
                aria-label="Accept friend request"
              >
                <span>ACCEPT</span>
              </KInteractive>

              <KInteractive
                as="button"
                onClick={() => {
                  setFriendReqDismissed(true);
                  actions.notify("Declined friend request");
                }}
                style={actBtn(false)}
                aria-label="Decline friend request"
              >
                <span>DECLINE</span>
              </KInteractive>
            </div>
          </div>
        </div>
      )}

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
          placeholder="Filter friends by name..."
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
          aria-label="Search friends"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            style={{ background: "transparent", border: "none", color: V.ink2, cursor: "pointer", padding: "4px" }}
            aria-label="Clear filter"
          >
            <Icon name="x" size={14} />
          </button>
        )}
      </div>

      {/* Friends List */}
      <div style={{ display: "flex", flexDirection: "column", gap: bleed ? "4px" : "8px" }}>
        {displayFriends.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: V.ink2, font: "400 13px/1.4 " + t.font }}>
            No friends found matching your criteria.
          </div>
        ) : (
          displayFriends.map((f) => (
            <div
              key={f.id}
              style={{
                padding: pad,
                background: V.surf,
                border: bleed ? "none" : "1px solid " + V.outv,
                borderLeft: f.online ? "4px solid " + (V.ok || "#22c55e") : undefined,
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
                      color: f.online ? (V.ok || "#22c55e") : V.ink2,
                      border: "1px solid " + V.outv,
                      position: "relative",
                    }}
                  >
                    <Icon name="user" size={18} />
                    {f.online && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: "2px",
                          right: "2px",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: V.ok || "#22c55e",
                        }}
                      />
                    )}
                  </div>

                  <div>
                    <div style={{ font: "700 14px/1.2 " + t.dfont, color: V.ink }}>{f.name}</div>
                    <div style={{ font: "400 11.5px/1.3 " + t.font, color: V.ink2, marginTop: "2px" }}>
                      {f.status}
                    </div>
                    {f.online && (
                      <div style={{ font: "600 10.5px/1 " + t.mfont, color: V.pri, marginTop: "3px" }}>
                        📍 {f.location}
                      </div>
                    )}
                  </div>
                </div>

                {/* Second Life Permissions Matrix Badges */}
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <button
                    onClick={() => toggleRight(f.id, "seeOnline")}
                    title={f.rights.seeOnline ? "Can see when you are online" : "Cannot see when you are online"}
                    style={{
                      padding: "6px 8px",
                      borderRadius: V.rs,
                      background: f.rights.seeOnline ? V.surf2 : "transparent",
                      border: "1px solid " + (f.rights.seeOnline ? V.pri : V.outv),
                      color: f.rights.seeOnline ? V.pri : V.ink2,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      font: "600 10px/1 " + t.mfont,
                    }}
                    aria-label="Toggle see online right"
                  >
                    <Icon name="eye" size={12} />
                    <span>ONLINE</span>
                  </button>

                  <button
                    onClick={() => toggleRight(f.id, "seeOnMap")}
                    title={f.rights.seeOnMap ? "Can find you on the map" : "Cannot find you on the map"}
                    style={{
                      padding: "6px 8px",
                      borderRadius: V.rs,
                      background: f.rights.seeOnMap ? V.surf2 : "transparent",
                      border: "1px solid " + (f.rights.seeOnMap ? V.pri : V.outv),
                      color: f.rights.seeOnMap ? V.pri : V.ink2,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      font: "600 10px/1 " + t.mfont,
                    }}
                    aria-label="Toggle see on map right"
                  >
                    <Icon name="map-pin" size={12} />
                    <span>MAP</span>
                  </button>

                  <button
                    onClick={() => toggleRight(f.id, "modifyObjects")}
                    title={f.rights.modifyObjects ? "Can modify your objects" : "Cannot modify your objects"}
                    style={{
                      padding: "6px 8px",
                      borderRadius: V.rs,
                      background: f.rights.modifyObjects ? V.surf2 : "transparent",
                      border: "1px solid " + (f.rights.modifyObjects ? (V.ok || "#22c55e") : V.outv),
                      color: f.rights.modifyObjects ? (V.ok || "#22c55e") : V.ink2,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      font: "600 10px/1 " + t.mfont,
                    }}
                    aria-label="Toggle edit objects right"
                  >
                    <Icon name="edit" size={12} />
                    <span>EDIT</span>
                  </button>
                </div>
              </div>

              {/* Actions Row */}
              <div style={{ display: "flex", gap: "6px", borderTop: "1px solid " + V.outv, paddingTop: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                {f.online && (
                  <KInteractive
                    as="button"
                    onClick={() => startIM(f)}
                    style={actBtn(true)}
                    aria-label={`Instant Message ${f.name}`}
                  >
                    <Icon name="message-square" size={13} />
                    <span>IM</span>
                  </KInteractive>
                )}

                {f.online && (
                  <KInteractive
                    as="button"
                    onClick={() => offerTeleport(f)}
                    style={actBtn(false)}
                    aria-label={`Offer teleport to ${f.name}`}
                  >
                    <Icon name="send" size={13} />
                    <span>OFFER TELEPORT</span>
                  </KInteractive>
                )}

                <KInteractive
                  as="button"
                  onClick={() => {
                    actions.setChip(f.name);
                    actions.setScreen("Profile");
                  }}
                  style={actBtn(false)}
                  aria-label={`View profile for ${f.name}`}
                >
                  <Icon name="user" size={13} />
                  <span>PROFILE</span>
                </KInteractive>

                <KInteractive
                  as="button"
                  onClick={() =>
                    actions.setDialog({
                      icon: "banknote",
                      kind: "PAY RESIDENT",
                      title: `Pay ${f.name}`,
                      body: "Send Linden Dollars directly to this resident:",
                      buttons: [
                        { label: "PAY L$ 50", pick: () => actions.notify(`Paid L$ 50 to ${f.name}`) },
                        { label: "PAY L$ 100", primary: true, pick: () => actions.notify(`Paid L$ 100 to ${f.name}`) },
                        { label: "CANCEL", dim: true },
                      ],
                    })
                  }
                  style={actBtn(false)}
                  aria-label={`Pay ${f.name}`}
                >
                  <Icon name="banknote" size={13} />
                  <span>PAY L$...</span>
                </KInteractive>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
