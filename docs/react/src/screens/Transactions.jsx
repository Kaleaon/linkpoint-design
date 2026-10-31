import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { subView } from "../theme/constants.js";
import { panelLook } from "../theme/look.js";
import Icon from "../components/Icon.jsx";
import KInteractive from "../components/KInteractive.jsx";
import BlockKeypad from "../components/BlockKeypad.jsx";

const TRANSACTIONS_DATA = [
  {
    id: "tx-84920412",
    type: "credit",
    category: "Object Sale",
    counterpart: "Marlowe Quill",
    description: "Purchased “Roof Kit v2 (Modular Mesh)”",
    amount: 1200,
    timestamp: "Today 14:32 SLT",
    date: "2026-10-15 14:32 SLT",
    usd: "$4.83",
    status: "Settled",
    region: "Da Boom <128, 128, 26>",
  },
  {
    id: "tx-84918230",
    type: "debit",
    category: "Land Tier / Rent",
    counterpart: "Bay City Land Co.",
    description: "Weekly Parcel Rent — Hollywood Boardwalk Parcel 4B",
    amount: 350,
    timestamp: "Yesterday 11:15 SLT",
    date: "2026-10-14 11:15 SLT",
    usd: "$1.41",
    status: "Settled",
    region: "Bay City — Hollywood",
  },
  {
    id: "tx-84890123",
    type: "debit",
    category: "Direct Payment",
    counterpart: "Kit Sandalwood",
    description: "Commission for Sculpted Light Rig and UV remapping",
    amount: 500,
    timestamp: "Sep 12 16:40 SLT",
    date: "2026-09-12 16:40 SLT",
    usd: "$2.01",
    status: "Settled",
    region: "Da Boom <110, 142, 28>",
  },
  {
    id: "tx-84872391",
    type: "credit",
    category: "Event Prize",
    counterpart: "Linden Lab Community",
    description: "First Place Prize — Sansara Community Build Jam",
    amount: 2500,
    timestamp: "Sep 10 18:00 SLT",
    date: "2026-09-10 18:00 SLT",
    usd: "$10.06",
    status: "Settled",
    region: "Ahern Welcome Hub",
  },
  {
    id: "tx-84851204",
    type: "debit",
    category: "Group Enrollment",
    counterpart: "Aurora Dance Crew",
    description: "Group Join Fee & Access Pass",
    amount: 99,
    timestamp: "Sep 08 09:20 SLT",
    date: "2026-09-08 09:20 SLT",
    usd: "$0.40",
    status: "Settled",
    region: "Sansara Ridge",
  },
  {
    id: "tx-84831092",
    type: "debit",
    category: "Texture Upload",
    counterpart: "Second Life Grid Asset Server",
    description: "Mesh and Texture Asset Upload Fee (4 textures)",
    amount: 40,
    timestamp: "Sep 05 15:10 SLT",
    date: "2026-09-05 15:10 SLT",
    usd: "$0.16",
    status: "Settled",
    region: "Da Boom",
  },
];

export default function Transactions() {
  const { state, actions } = useApp();
  const { V, t, LK, bleed, pad, ink } = useTheme();
  const curSub = subView(state, "Transactions") || "ALL";
  const cardStyle = (accent) => panelLook(V, LK, pad, accent);

  const [query, setQuery] = useState("");
  const [balance, setBalance] = useState(4250);
  const [keypadConfig, setKeypadConfig] = useState(null);

  const filteredTx = TRANSACTIONS_DATA.filter((tx) => {
    if (curSub === "PAYMENTS" && tx.type !== "debit") return false;
    if (curSub === "RECEIPTS" && tx.type !== "credit") return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        tx.counterpart.toLowerCase().includes(q) ||
        tx.description.toLowerCase().includes(q) ||
        tx.id.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const actBtn = (primary = false) => ({
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
    letterSpacing: ".1em",
    whiteSpace: "nowrap",
  });

  const openReceipt = (tx) => {
    actions.setDialog({
      icon: "receipt",
      kind: "ITEMIZED RECEIPT",
      title: `${
        tx.type === "credit" ? "Received" : "Paid"
      } L$ ${tx.amount.toLocaleString()}`,
      body: `${tx.category}: ${tx.description}`,
      meta: `Transaction ID: ${tx.id.toUpperCase()} · Counterpart: ${
        tx.counterpart
      } · Date: ${tx.date} · Rate: ~${tx.usd} USD · Status: ${tx.status}`,
      buttons: [
        {
          label: "VIEW PROFILE",
          pick: () => {
            actions.setChip(tx.counterpart);
            actions.setScreen("Profile");
          },
        },
        { label: "CLOSE", primary: true },
      ],
    });
  };

  const openBuyKeypad = () => {
    setKeypadConfig({
      title: "BUY LINDEN DOLLARS",
      subtitle:
        "Enter exact custom amount to purchase via LindeX (Rate: ~248.5 L$/USD)",
      systemCode: "FIN-01-BUY",
      initialValue: 1000,
      presets: [500, 1000, 2500, 5000],
      onConfirm: (amt) => {
        setBalance((b) => b + amt);
        actions.notify(`Purchased L$ ${amt.toLocaleString()} via LindeX`);
        setKeypadConfig(null);
      },
      onCancel: () => setKeypadConfig(null),
    });
  };

  const openSendKeypad = () => {
    setKeypadConfig({
      title: "SEND LINDEN DOLLARS",
      subtitle: `Available Balance: L$ ${balance.toLocaleString()}`,
      systemCode: "FIN-01-SEND",
      initialValue: 100,
      presets: [50, 100, 250, 500],
      max: balance,
      onConfirm: (amt) => {
        if (balance >= amt) {
          setBalance((b) => b - amt);
          actions.notify(`Sent L$ ${amt.toLocaleString()} to recipient`);
          setKeypadConfig(null);
        } else {
          actions.notify("Insufficient L$ balance");
        }
      },
      onCancel: () => setKeypadConfig(null),
    });
  };

  const buyLindenDollars = () => {
    actions.setDialog({
      icon: "banknote",
      kind: "LINDEX EXCHANGE",
      title: "Buy Linden Dollars (L$)",
      body: "Choose a package or enter a custom amount via keypad:",
      meta: "LindeX Exchange Rate: ~248.5 L$/USD · Billing on file: Visa (...4412)",
      buttons: [
        {
          label: "L$ 1,000 ($4.02)",
          pick: () => {
            setBalance((b) => b + 1000);
            actions.notify("Purchased L$ 1,000 via LindeX");
          },
        },
        {
          label: "L$ 2,500 ($10.06)",
          primary: true,
          pick: () => {
            setBalance((b) => b + 2500);
            actions.notify("Purchased L$ 2,500 via LindeX");
          },
        },
        {
          label: "CUSTOM AMOUNT (KEYPAD)...",
          pick: () => openBuyKeypad(),
        },
        { label: "CANCEL", dim: true },
      ],
    });
  };

  const sendLindenDollars = () => {
    actions.setDialog({
      icon: "send",
      kind: "TRANSFER FUNDS",
      title: "Send Linden Dollars",
      body: "Send money to a resident currently in region or choose custom amount:",
      meta: "Current Balance: L$ " + balance.toLocaleString(),
      buttons: [
        {
          label: "PAY NYX VAHER (L$ 100)",
          primary: true,
          pick: () => {
            if (balance >= 100) {
              setBalance((b) => b - 100);
              actions.notify("Sent L$ 100 to Nyx Vaher");
            } else {
              actions.notify("Insufficient L$ balance");
            }
          },
        },
        {
          label: "PAY KIT SANDALWOOD (L$ 250)",
          pick: () => {
            if (balance >= 250) {
              setBalance((b) => b - 250);
              actions.notify("Sent L$ 250 to Kit Sandalwood");
            } else {
              actions.notify("Insufficient L$ balance");
            }
          },
        },
        {
          label: "CUSTOM AMOUNT (KEYPAD)...",
          pick: () => openSendKeypad(),
        },
        { label: "CANCEL", dim: true },
      ],
    });
  };

  const totalCredit = TRANSACTIONS_DATA.filter(
    (tx) => tx.type === "credit"
  ).reduce((a, b) => a + b.amount, 0);
  const totalDebit = TRANSACTIONS_DATA.filter(
    (tx) => tx.type === "debit"
  ).reduce((a, b) => a + b.amount, 0);

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
      {/* Balance Summary Hero Banner */}
      <div
        style={{
          ...cardStyle(V.ok || "#22c55e"),
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
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
                color: V.ok || "#22c55e",
                border: "1px solid " + V.outv,
                flexShrink: 0,
              }}
            >
              <Icon name="banknote" size={24} />
            </div>
            <div>
              <div
                style={{
                  font: "700 9px/1 " + t.dfont,
                  letterSpacing: ".18em",
                  color: V.sec2 || V.pri,
                }}
              >
                [FIN-01-3829] CURRENT L$ BALANCE &amp; LINDEX
              </div>
              <div
                style={{
                  font: "700 24px/1.1 " + t.dfont,
                  color: V.ink,
                  marginTop: "2px",
                }}
              >
                L$ {balance.toLocaleString()}
              </div>
              <div
                style={{
                  font: "400 11.5px/1.3 " + t.font,
                  color: V.ink2,
                  marginTop: "2px",
                }}
              >
                ≈ ${(balance / 248.5).toFixed(2)} USD (LindeX benchmark ~248.5
                L$/USD)
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <KInteractive
              as="button"
              onClick={buyLindenDollars}
              style={actBtn(true)}
              aria-label="Buy Linden Dollars"
            >
              <Icon name="plus" size={14} />
              <span>BUY L$...</span>
            </KInteractive>

            <KInteractive
              as="button"
              onClick={sendLindenDollars}
              style={actBtn(false)}
              aria-label="Send Linden Dollars"
            >
              <Icon name="send" size={14} />
              <span>SEND L$...</span>
            </KInteractive>

            <KInteractive
              as="button"
              onClick={() =>
                actions.notify("Transaction history exported to CSV")
              }
              style={actBtn(false)}
              aria-label="Export transaction ledger"
            >
              <Icon name="download" size={14} />
              <span>EXPORT CSV</span>
            </KInteractive>
          </div>
        </div>

        {/* 30-Day Metrics Strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "8px",
            borderTop: "1px solid " + V.outv,
            paddingTop: "10px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div
              style={{
                font: "700 8.5px/1 " + t.dfont,
                letterSpacing: ".14em",
                color: V.sec2 || V.pri,
              }}
            >
              [FIN-01-30D1]
            </div>
            <span
              style={{
                font: "600 10.5px/1 " + t.dfont,
                color: V.ink2,
                letterSpacing: ".08em",
              }}
            >
              30D EARNED
            </span>
            <span
              style={{
                font: "700 13px/1.2 " + (t.mfont || t.font),
                color: V.ok || "#22c55e",
              }}
            >
              +L$ {totalCredit.toLocaleString()}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div
              style={{
                font: "700 8.5px/1 " + t.dfont,
                letterSpacing: ".14em",
                color: V.sec2 || V.pri,
              }}
            >
              [FIN-01-30D2]
            </div>
            <span
              style={{
                font: "600 10.5px/1 " + t.dfont,
                color: V.ink2,
                letterSpacing: ".08em",
              }}
            >
              30D SPENT
            </span>
            <span
              style={{
                font: "700 13px/1.2 " + (t.mfont || t.font),
                color: V.warn || "#f59e0b",
              }}
            >
              -L$ {totalDebit.toLocaleString()}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div
              style={{
                font: "700 8.5px/1 " + t.dfont,
                letterSpacing: ".14em",
                color: V.sec2 || V.pri,
              }}
            >
              [FIN-01-FLOW]
            </div>
            <span
              style={{
                font: "600 10.5px/1 " + t.dfont,
                color: V.ink2,
                letterSpacing: ".08em",
              }}
            >
              NET CASH FLOW
            </span>
            <span
              style={{
                font: "700 13px/1.2 " + (t.mfont || t.font),
                color:
                  totalCredit >= totalDebit
                    ? V.ok || "#22c55e"
                    : V.err || "#dc2626",
              }}
            >
              {totalCredit >= totalDebit ? "+" : ""}L${" "}
              {(totalCredit - totalDebit).toLocaleString()}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div
              style={{
                font: "700 8.5px/1 " + t.dfont,
                letterSpacing: ".14em",
                color: V.sec2 || V.pri,
              }}
            >
              [FIN-01-CENS]
            </div>
            <span
              style={{
                font: "600 10.5px/1 " + t.dfont,
                color: V.ink2,
                letterSpacing: ".08em",
              }}
            >
              TRANSACTIONS
            </span>
            <span
              style={{
                font: "700 13px/1.2 " + (t.mfont || t.font),
                color: V.ink,
              }}
            >
              {TRANSACTIONS_DATA.length} records
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          ...cardStyle(),
          display: "flex",
          alignItems: "center",
          gap: "8px",
          minHeight: "44px",
          padding: "6px 12px",
        }}
      >
        <Icon name="search" size={16} style={{ color: V.ink2 }} />
        <input
          type="text"
          placeholder="Search by counterpart, description, or TX ID..."
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
          aria-label="Search transactions"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            style={{
              background: "transparent",
              border: "none",
              color: V.ink2,
              cursor: "pointer",
              padding: "4px",
            }}
            aria-label="Clear search"
          >
            <Icon name="x" size={14} />
          </button>
        )}
      </div>

      {/* Itemized Transactions List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: bleed ? "4px" : "8px",
        }}
      >
        {filteredTx.length === 0 ? (
          <div
            style={{
              padding: "32px",
              textAlign: "center",
              color: V.ink2,
              font: "400 13px/1.4 " + t.font,
            }}
          >
            No transaction records match your criteria.
          </div>
        ) : (
          filteredTx.map((tx) => {
            const isCredit = tx.type === "credit";
            return (
              <div
                key={tx.id}
                style={{
                  ...cardStyle(
                    isCredit ? V.ok || "#22c55e" : V.sec || "#f59e0b"
                  ),
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
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
                        width: "36px",
                        height: "36px",
                        borderRadius: V.rs,
                        background: V.surf2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: isCredit
                          ? V.ok || "#22c55e"
                          : V.sec || "#f59e0b",
                        border: "1px solid " + V.outv,
                      }}
                    >
                      <Icon
                        name={isCredit ? "arrow-down-left" : "arrow-up-right"}
                        size={18}
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          font: "700 8.5px/1 " + t.dfont,
                          letterSpacing: ".14em",
                          color: V.sec2 || V.pri,
                        }}
                      >
                        [TXN-{tx.id.replace("tx-", "").slice(0, 6)}]
                      </div>
                      <div
                        style={{
                          font: "700 13.5px/1.2 " + t.dfont,
                          color: V.ink,
                          marginTop: "1px",
                        }}
                      >
                        {isCredit ? "Received" : "Paid"} L${" "}
                        {tx.amount.toLocaleString()}
                      </div>
                      <div
                        style={{
                          font: "400 11.5px/1.3 " + t.font,
                          color: V.ink2,
                          marginTop: "2px",
                        }}
                      >
                        {isCredit ? "From" : "To"}:{" "}
                        <span style={{ fontWeight: 600, color: V.ink }}>
                          {tx.counterpart}
                        </span>{" "}
                        · {tx.description}
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
                            font: "600 10px/1 " + (t.mfont || t.font),
                            padding: "2px 6px",
                            borderRadius: "3px",
                            background: V.surf2,
                            color: V.ink2,
                            border: "1px solid " + V.outv,
                          }}
                        >
                          {tx.category}
                        </span>
                        <span
                          style={{
                            font: "600 10px/1 " + (t.mfont || t.font),
                            padding: "2px 6px",
                            borderRadius: "3px",
                            background: V.surf2,
                            color: V.ink2,
                            border: "1px solid " + V.outv,
                          }}
                        >
                          {tx.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amount Badge */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div
                      style={{
                        font: "700 14px/1.2 " + (t.mfont || t.font),
                        color: isCredit
                          ? V.ok || "#22c55e"
                          : V.sec || "#f59e0b",
                      }}
                    >
                      {isCredit ? "+" : "-"}L$ {tx.amount.toLocaleString()}
                    </div>
                    <div
                      style={{
                        font: "400 10.5px/1.2 " + t.font,
                        color: V.ink2,
                        marginTop: "2px",
                      }}
                    >
                      ≈ {tx.usd} USD
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    borderTop: "1px solid " + V.outv,
                    paddingTop: "8px",
                    justifyContent: "flex-end",
                  }}
                >
                  <KInteractive
                    as="button"
                    onClick={() => openReceipt(tx)}
                    style={actBtn(true)}
                    aria-label={`View receipt for ${tx.id}`}
                  >
                    <Icon name="receipt" size={13} />
                    <span>VIEW RECEIPT</span>
                  </KInteractive>

                  <KInteractive
                    as="button"
                    onClick={() => {
                      actions.setChip(tx.counterpart);
                      actions.setScreen("Profile");
                    }}
                    style={actBtn(false)}
                    aria-label={`View profile of ${tx.counterpart}`}
                  >
                    <Icon name="user" size={13} />
                    <span>PROFILE</span>
                  </KInteractive>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Block-Matrix Numeric Keypad Modal */}
      {keypadConfig && <BlockKeypad {...keypadConfig} />}
    </div>
  );
}
