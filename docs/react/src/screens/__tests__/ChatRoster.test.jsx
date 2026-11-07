import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import React, { useEffect } from "react";
import { AppProvider, useApp } from "../../context/AppContext.jsx";
import { ThemeProvider } from "../../context/ThemeContext.jsx";
import Chat from "../Chat.jsx";

// Helper component to configure initial state for Chat tests
function ChatTestWrapper({ tab = "GROUP", chip = "Bay City Builders", device = "desk" }) {
  const { state, actions } = useApp();

  useEffect(() => {
    actions.setTab("Chat", tab);
    actions.setChip(chip);
    actions.setDevice(device);
  }, [tab, chip, device]);

  return <Chat />;
}

describe("Group Chat Participant Roster and Moderation Controls", () => {
  it("does not render participant roster toggle in LOCAL chat tab", () => {
    render(
      <AppProvider>
        <ThemeProvider>
          <ChatTestWrapper tab="LOCAL" />
        </ThemeProvider>
      </AppProvider>
    );

    expect(screen.queryByTestId("toggle-roster-btn")).toBeNull();
    expect(screen.queryByTestId("participant-roster-drawer")).toBeNull();
  });

  it("renders participant roster toggle in GROUP chat tab and toggles drawer", () => {
    render(
      <AppProvider>
        <ThemeProvider>
          <ChatTestWrapper tab="GROUP" chip="Bay City Builders" />
        </ThemeProvider>
      </AppProvider>
    );

    const toggleBtn = screen.getByTestId("toggle-roster-btn");
    expect(toggleBtn).toBeTruthy();
    expect(toggleBtn.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByTestId("participant-roster-drawer")).toBeNull();

    // Click toggle to open drawer
    fireEvent.click(toggleBtn);
    expect(toggleBtn.getAttribute("aria-expanded")).toBe("true");

    const drawer = screen.getByTestId("participant-roster-drawer");
    expect(drawer).toBeTruthy();
    expect(within(drawer).getByText("PARTICIPANTS")).toBeTruthy();

    // Click close button in drawer header
    const closeBtn = screen.getByTestId("close-roster-btn");
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId("participant-roster-drawer")).toBeNull();
  });

  it("displays member lists with correct online status, role tags, and voice indicators", () => {
    render(
      <AppProvider>
        <ThemeProvider>
          <ChatTestWrapper tab="GROUP" chip="Bay City Builders" />
        </ThemeProvider>
      </AppProvider>
    );

    // Open roster drawer
    fireEvent.click(screen.getByTestId("toggle-roster-btn"));
    const drawer = screen.getByTestId("participant-roster-drawer");

    // Check Marlowe Quill
    expect(within(drawer).getByText("Marlowe Quill")).toBeTruthy();
    const marloweRow = screen.getByTestId("member-row-Marlowe-Quill");
    expect(within(marloweRow).getByText("Officer")).toBeTruthy();
    expect(screen.getByTestId("voice-indicator-Marlowe-Quill")).toBeTruthy();

    // Check Kit Sandalwood
    expect(within(drawer).getByText("Kit Sandalwood")).toBeTruthy();
    const kitRow = screen.getByTestId("member-row-Kit-Sandalwood");
    expect(within(kitRow).getByText("Founder / Owner")).toBeTruthy();
    // Kit does not have active voice
    expect(screen.queryByTestId("voice-indicator-Kit-Sandalwood")).toBeNull();

    // Check Sable Ashgrove (Offline member)
    expect(within(drawer).getByText("Sable Ashgrove")).toBeTruthy();
    const sableRow = screen.getByTestId("member-row-Sable-Ashgrove");
    expect(within(sableRow).getByText("Member")).toBeTruthy();
  });

  it("allows group officers to execute mute and kick actions and dispatches intents", () => {
    let busInstance;
    function BusCapture() {
      const { actions } = useApp();
      busInstance = actions.getEventBus();
      return null;
    }

    render(
      <AppProvider>
        <ThemeProvider>
          <BusCapture />
          <ChatTestWrapper tab="GROUP" chip="Bay City Builders" />
        </ThemeProvider>
      </AppProvider>
    );

    // Open roster drawer
    fireEvent.click(screen.getByTestId("toggle-roster-btn"));

    // Click Marlowe Quill to open moderation controls
    fireEvent.click(screen.getByTestId("member-row-Marlowe-Quill"));
    const menu = screen.getByTestId("moderation-menu");
    expect(menu).toBeTruthy();

    // Trigger Mute Member
    const muteBtn = screen.getByTestId("moderation-mute-btn");
    expect(muteBtn.hasAttribute("disabled")).toBe(false);
    fireEvent.click(muteBtn);

    // Verify intent dispatched to event bus
    const logsAfterMute = busInstance.getLogs();
    const muteIntent = logsAfterMute.find(
      (l) => l.type === "GROUP_MODERATION_ACTION" && l.payload.action === "mute"
    );
    expect(muteIntent).toBeTruthy();
    expect(muteIntent.payload.target).toBe("Marlowe Quill");
    expect(muteIntent.payload.group).toBe("Bay City Builders");

    // Reopen menu and trigger Kick Member
    fireEvent.click(screen.getByTestId("member-row-Marlowe-Quill"));
    const kickBtn = screen.getByTestId("moderation-kick-btn");
    expect(kickBtn.hasAttribute("disabled")).toBe(false);
    fireEvent.click(kickBtn);

    const logsAfterKick = busInstance.getLogs();
    const kickIntent = logsAfterKick.find(
      (l) => l.type === "GROUP_MODERATION_ACTION" && l.payload.action === "kick"
    );
    expect(kickIntent).toBeTruthy();
    expect(kickIntent.payload.target).toBe("Marlowe Quill");
    expect(kickIntent.payload.group).toBe("Bay City Builders");
  });

  it("dispatches profile navigation intent when selecting View Profile", () => {
    let busInstance;
    function BusCapture() {
      const { actions } = useApp();
      busInstance = actions.getEventBus();
      return null;
    }

    render(
      <AppProvider>
        <ThemeProvider>
          <BusCapture />
          <ChatTestWrapper tab="GROUP" chip="Bay City Builders" />
        </ThemeProvider>
      </AppProvider>
    );

    fireEvent.click(screen.getByTestId("toggle-roster-btn"));
    fireEvent.click(screen.getByTestId("member-row-Marlowe-Quill"));

    const profileBtn = screen.getByTestId("moderation-profile-btn");
    fireEvent.click(profileBtn);

    const logs = busInstance.getLogs();
    const profileIntent = logs.find((l) => l.type === "NAVIGATE_SCREEN" && l.payload.screen === "Profile");
    expect(profileIntent).toBeTruthy();
    expect(profileIntent.payload.target).toBe("Marlowe Quill");
  });

  it("restricts moderation actions when the user is not an officer", () => {
    render(
      <AppProvider>
        <ThemeProvider>
          {/* Ruthless Roofers: User role is 'Member' without officer permissions */}
          <ChatTestWrapper tab="GROUP" chip="Ruthless Roofers" />
        </ThemeProvider>
      </AppProvider>
    );

    fireEvent.click(screen.getByTestId("toggle-roster-btn"));
    fireEvent.click(screen.getByTestId("member-row-Oren-Fairweather"));

    const muteBtn = screen.getByTestId("moderation-mute-btn");
    const kickBtn = screen.getByTestId("moderation-kick-btn");

    expect(muteBtn.hasAttribute("disabled")).toBe(true);
    expect(kickBtn.hasAttribute("disabled")).toBe(true);
    expect(within(muteBtn).getByText("OFFICER ONLY")).toBeTruthy();

    // View Profile remains accessible
    const profileBtn = screen.getByTestId("moderation-profile-btn");
    expect(profileBtn.hasAttribute("disabled")).toBe(false);
  });

  it("disables moderation actions on oneself", () => {
    render(
      <AppProvider>
        <ThemeProvider>
          <ChatTestWrapper tab="GROUP" chip="Bay City Builders" />
        </ThemeProvider>
      </AppProvider>
    );

    fireEvent.click(screen.getByTestId("toggle-roster-btn"));
    fireEvent.click(screen.getByTestId("member-row-Ruth-Resident"));

    const muteBtn = screen.getByTestId("moderation-mute-btn");
    const kickBtn = screen.getByTestId("moderation-kick-btn");

    expect(muteBtn.hasAttribute("disabled")).toBe(true);
    expect(kickBtn.hasAttribute("disabled")).toBe(true);
  });

  it("renders mobile drawer with backdrop on mobile viewport and closes upon clicking backdrop", () => {
    render(
      <AppProvider>
        <ThemeProvider>
          <ChatTestWrapper tab="GROUP" chip="Bay City Builders" device="ios" />
        </ThemeProvider>
      </AppProvider>
    );

    fireEvent.click(screen.getByTestId("toggle-roster-btn"));
    const backdrop = screen.getByTestId("roster-backdrop");
    expect(backdrop).toBeTruthy();

    // Clicking backdrop dismisses drawer
    fireEvent.click(backdrop);
    expect(screen.queryByTestId("participant-roster-drawer")).toBeNull();
  });
});
