/**
 * Custom hook to attach accessible button behaviors (role, tabIndex, aria-label, keydown handlers)
 * to interactive element wrappers or components.
 */
export default function useA11yTrigger(onClickOrOptions, optionsParam = {}) {
  let onClick;
  let options;

  if (typeof onClickOrOptions === "function") {
    onClick = onClickOrOptions;
    options = optionsParam || {};
  } else if (onClickOrOptions && typeof onClickOrOptions === "object") {
    options = onClickOrOptions;
    onClick = options.onClick;
  } else {
    options = optionsParam || {};
  }

  const {
    onKeyDown,
    role = "button",
    tabIndex = 0,
    ariaLabel,
    "aria-label": ariaLabelAttr,
    disabled = false,
  } = options;

  const label = ariaLabelAttr || ariaLabel;

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      if (onClick) {
        onClick(e);
      }
    }

    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const handleClick = (e) => {
    if (disabled) return;
    if (onClick) {
      onClick(e);
    }
  };

  const props = {
    role,
    tabIndex: disabled ? -1 : tabIndex,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  };

  if (label) {
    props["aria-label"] = label;
  }

  return props;
}
