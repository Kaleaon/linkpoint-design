import { AppProvider } from "./context/AppContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { FocusStackProvider } from "./context/FocusStackContext.jsx";
import { KthemeProvider } from "@ktheme/react";
import DeviceFrame from "./components/DeviceFrame.jsx";
import LiveRegionAnnouncer from "./components/LiveRegionAnnouncer.jsx";

export default function App() {
  return (
    <AppProvider>
      <FocusStackProvider>
        <KthemeProvider themeId="navy-gold">
          <ThemeProvider>
            <LiveRegionAnnouncer />
            <DeviceFrame />
          </ThemeProvider>
        </KthemeProvider>
      </FocusStackProvider>
    </AppProvider>
  );
}
