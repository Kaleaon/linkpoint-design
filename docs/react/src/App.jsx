import { AppProvider } from "./context/AppContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { KthemeProvider } from "@ktheme/react";
import DeviceFrame from "./components/DeviceFrame.jsx";

export default function App() {
  return (
    <AppProvider>
      <KthemeProvider themeId="navy-gold">
        <ThemeProvider>
          <DeviceFrame />
        </ThemeProvider>
      </KthemeProvider>
    </AppProvider>
  );
}
