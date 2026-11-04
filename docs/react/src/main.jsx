import React from "react";
import ReactDOM from "react-dom/client";
import { KthemeProvider } from "@ktheme/react";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <KthemeProvider themeId="navy-gold">
      <App />
    </KthemeProvider>
  </React.StrictMode>
);
