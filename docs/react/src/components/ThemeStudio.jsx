import React, { useContext } from "react";
import { ThemeStudio as UnifiedThemeStudio, KthemeContext } from "@ktheme/react";
import { lum, ratio } from "../theme/color.js";

export default function ThemeStudio(props) {
  const ctx = useContext(KthemeContext);
  if (!ctx) return null;
  return (
    <UnifiedThemeStudio
      embedded={false}
      contrastAuditFn={ratio}
      luminanceFn={lum}
      {...props}
    />
  );
}
