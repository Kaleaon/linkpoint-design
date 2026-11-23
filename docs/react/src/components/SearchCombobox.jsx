import React, { useEffect, useRef } from "react";
import FormInput from "./FormInput.jsx";
import { useApp } from "../context/AppContext.jsx";

/**
 * Reusable SearchCombobox component implementing ARIA combobox pattern.
 * WCAG 2.2 SC 4.1.2 (Name, Role, Value): https://www.w3.org/TR/WCAG22/#name-role-value
 * WCAG 2.2 SC 4.1.3 (Status Messages): https://www.w3.org/TR/WCAG22/#status-messages
 */
export default function SearchCombobox({
  id,
  value = "",
  onChange,
  placeholder,
  ariaLabel,
  controlsId,
  resultCount = 0,
  itemLabel = "results",
  style,
  ...props
}) {
  const { actions } = useApp();
  const initialRef = useRef(true);

  useEffect(() => {
    if (initialRef.current) {
      initialRef.current = false;
      return;
    }
    const timer = setTimeout(() => {
      if (value && value.trim().length > 0) {
        const msg =
          resultCount === 0
            ? `No matching ${itemLabel} found`
            : `${resultCount} matching ${itemLabel} found`;
        actions.announce(msg);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [value, resultCount, itemLabel, actions]);

  const targetControlsId = controlsId || props["aria-controls"];
  const targetAriaLabel = ariaLabel || props["aria-label"];

  return (
    <FormInput
      id={id}
      type="search"
      role="combobox"
      aria-autocomplete="list"
      aria-expanded={Boolean(value && resultCount > 0)}
      aria-controls={targetControlsId}
      aria-label={targetAriaLabel}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={style}
      {...props}
    />
  );
}
