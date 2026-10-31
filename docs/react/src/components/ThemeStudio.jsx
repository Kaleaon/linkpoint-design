import React, { useContext } from "react";
import { ThemeStudio as UnifiedThemeStudio, KthemeContext } from "@ktheme/react";

export default function ThemeStudio() {
  const ctx = useContext(KthemeContext);
  if (!ctx) return null;
  return <UnifiedThemeStudio embedded={false} />;
}
