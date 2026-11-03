import React from "react";
import { ThemeStudio as UnifiedThemeStudio } from "@ktheme/react/studio";
import { lum, ratio } from "../theme/color.js";

export default function ThemeStudio(props) {
  return (
    <UnifiedThemeStudio
      embedded={false}
      contrastAuditFn={ratio}
      luminanceFn={lum}
      {...props}
    />
  );
}
