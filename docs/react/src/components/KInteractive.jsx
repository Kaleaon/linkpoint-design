import React from "react";

export function KInteractive({
  as: Component = "div",
  onClick,
  onKeyDown,
  children,
  label,
  role = Component === "button" ? undefined : "button",
  tabIndex = 0,
  disabled = false,
  className = "",
  style,
  ...props
}) {
  const handleKeyDown = (e) => {
    if (disabled) return;
    if (onKeyDown) onKeyDown(e);
    if (!e.defaultPrevented && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      if (onClick) onClick(e);
    }
  };

  const handleClick = (e) => {
    if (disabled) return;
    if (onClick) onClick(e);
  };

  const combinedClassName = `k-interactive ${className}`.trim();

  return (
    <Component
      role={role}
      tabIndex={disabled ? -1 : tabIndex}
      aria-label={label}
      aria-disabled={disabled ? true : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={combinedClassName}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
}

export function KButton({ children, ...props }) {
  return (
    <KInteractive as="button" type="button" {...props}>
      {children}
    </KInteractive>
  );
}

export default KInteractive;
