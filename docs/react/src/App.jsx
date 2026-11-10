import { AppProvider } from "./context/AppContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { FocusStackProvider } from "./context/FocusStackContext.jsx";
import DeviceFrame from "./components/DeviceFrame.jsx";
import LiveRegionAnnouncer from "./components/LiveRegionAnnouncer.jsx";

export default function App() {
  return (
    <AppProvider>
      <FocusStackProvider>
        <ThemeProvider>
          <LiveRegionAnnouncer />
          <DeviceFrame />
        </ThemeProvider>
      </FocusStackProvider>
    </AppProvider>
  );
}
