import React from "react";

export function KInteractive({
  as: Component = "button",
  onClick,
  onKeyDown,
  children,
  label,
  role,
  tabIndex,
  disabled = false,
  className = "",
  style,
  type,
  ...props
}) {
  const isButton = Component === "button";
  const buttonType = isButton ? (type || "button") : undefined;

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (onKeyDown) onKeyDown(e);
    if (!e.defaultPrevented && !isButton && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      if (onClick) onClick(e);
    }
  };

  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
  };

  const combinedClassName = `k-interactive ${className}`.trim();
  const ariaLabel = label || props["aria-label"];

  return (
    <Component
      type={buttonType}
      role={isButton ? role : (role || "button")}
      tabIndex={isButton ? tabIndex : (disabled ? -1 : (tabIndex ?? 0))}
      disabled={isButton ? disabled : undefined}
      aria-label={ariaLabel}
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

