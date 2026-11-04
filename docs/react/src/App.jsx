import { AppProvider } from "./context/AppContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import DeviceFrame from "./components/DeviceFrame.jsx";
import LiveRegionAnnouncer from "./components/LiveRegionAnnouncer.jsx";

export default function App() {
  return (
    <AppProvider>
      <ThemeProvider>
        <LiveRegionAnnouncer />
        <DeviceFrame />
      </ThemeProvider>
    </AppProvider>
  );
}
