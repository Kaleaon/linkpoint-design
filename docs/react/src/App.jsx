import { AppProvider, useApp } from "./context/AppContext.jsx";
import { ThemeProvider, useTheme } from "./context/ThemeContext.jsx";
import ControlPanels from "./components/ControlPanels.jsx";
import DeviceFrame from "./components/DeviceFrame.jsx";

// Top-level layout: ported from the "1a" option in index.html —
// the picker column on the left, the live device mockup on the right, and
// the skin note underneath it (`t.note`, the layout+colour pack blurb).
function Prototype() {
  const { t } = useTheme();
  return (
    <div className="app-body">
      <ControlPanels />
      <div className="stage">
        <DeviceFrame />
        <div className="app-note">{t.note}</div>
      </div>
    </div>
  );
}

function AppShell() {
  return (
    <div className="app-shell">
      <div className="app-title">
        <span className="app-tid">1</span>
        <span className="app-tname">Linkpoint mobile — themed shell, 13 screens, 6 layout packs × 24 colour packs, 4 form factors</span>
      </div>
      <ThemeProvider>
        <Prototype />
      </ThemeProvider>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
