import { AppProvider } from "./context/AppContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import DeviceFrame from "./components/DeviceFrame.jsx";

export default function App() {
  return (
    <AppProvider>
      <ThemeProvider>
        <DeviceFrame />
      </ThemeProvider>
    </AppProvider>
  );
}
