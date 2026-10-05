import React from "react";
import useA11yTrigger from "../hooks/useA11yTrigger.js";

/**
 * Reusable accessible control component wrapper that converts generic tags (div, span, etc.)
 * into accessible interactive controls with role="button", tabIndex={0}, aria-label, and keypress handling.
 */
export default function A11yControl({
  as: Component = "div",
  children,
  onClick,
  onKeyDown,
  role = "button",
  tabIndex = 0,
  ariaLabel,
  "aria-label": ariaLabelAttr,
  disabled = false,
  ...rest
}) {
  const label = ariaLabelAttr || ariaLabel;
  const triggerProps = useA11yTrigger({
    onClick,
    onKeyDown,
    role,
    tabIndex,
    ariaLabel: label,
    disabled,
  });

  return (
    <Component {...rest} {...triggerProps}>
      {children}
    </Component>
  );
}
