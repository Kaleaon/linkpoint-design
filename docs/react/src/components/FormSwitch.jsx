import React, { forwardRef, useContext } from "react";
import { FormFieldContext } from "./FormField.jsx";
import { useThemeTokens } from "../context/ThemeContext.jsx";

const FormSwitch = forwardRef(function FormSwitch(
  {
    checked,
    on,
    onChange,
    onClick,
    disabled = false,
    id: idProp,
    "aria-describedby": ariaDescribedByProp,
    "aria-invalid": ariaInvalidProp,
    "aria-errormessage": ariaErrorMessageProp,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    style,
    className = "",
    ...props
  },
  ref
) {
  const context = useContext(FormFieldContext);

  let V = {};
  try {
    const themeContext = useThemeTokens();
    if (themeContext) {
      V = themeContext.V || {};
    }
  } catch (e) {
    // Fallback if rendered outside ThemeProvider
  }

  const isOn = checked !== undefined ? checked : on;
  const handleChange = () => {
    if (disabled) return;
    if (onChange) onChange(!isOn);
    else if (onClick) onClick();
  };

  const id = idProp || context?.id;
  const ariaDescribedBy = ariaDescribedByProp || context?.ariaDescribedBy;
  const ariaInvalid = ariaInvalidProp !== undefined ? ariaInvalidProp : context?.ariaInvalid;
  const ariaErrorMessage = ariaErrorMessageProp || context?.ariaErrorMessage;

  const defaultTrackBg = isOn === false ? (V.surf2 || "#1B2A2D") : (V.priC || "#1F6640");
  const defaultKnobBg = isOn === false ? (V.ink2 || "#A7C8BC") : (V.pri || "#6CFF9A");

  return (
    <span
      ref={ref}
      id={id}
      role="switch"
      aria-checked={Boolean(isOn)}
      tabIndex={disabled ? -1 : 0}
      onClick={handleChange}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleChange();
        }
      }}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
      aria-errormessage={ariaErrorMessage}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy || context?.labelId}
      className={`form-switch ${className}`}
      style={{
        width: "42px",
        height: "24px",
        borderRadius: "12px",
        position: "relative",
        display: "inline-block",
        flex: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        background: defaultTrackBg,
        transition: "background-color .18s ease",
        ...style,
      }}
      {...props}
    >
      <span
        style={{
          position: "absolute",
          top: "3px",
          width: "18px",
          height: "18px",
          borderRadius: "9px",
          left: isOn === false ? "3px" : "21px",
          background: defaultKnobBg,
          transition: "left .18s ease",
        }}
      />
    </span>
  );
});

export default FormSwitch;
