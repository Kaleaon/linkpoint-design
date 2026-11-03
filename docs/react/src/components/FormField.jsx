import React, { createContext, useId, useState } from "react";
import { useTheme } from "../context/ThemeContext.jsx";

export const FormFieldContext = createContext(null);

let fallbackIdCounter = 0;

export function FormField({
  id: explicitId,
  label,
  description,
  helperText,
  error,
  required = false,
  children,
  style,
  className = "",
  labelStyle,
  ...props
}) {
  let V = {};
  let t = {};
  try {
    const themeContext = useTheme();
    if (themeContext) {
      V = themeContext.V || {};
      t = themeContext.t || {};
    }
  } catch (e) {
    // Fallback if rendered outside ThemeProvider
  }

  const reactId = typeof useId === "function" ? useId() : null;
  const [fallbackId] = useState(() => {
    fallbackIdCounter += 1;
    return `form-field-${fallbackIdCounter}`;
  });

  const inputId = explicitId || (reactId ? `field-${reactId.replace(/:/g, "")}` : fallbackId);
  const descText = description || helperText;

  const labelId = `${inputId}-label`;
  const descId = descText ? `${inputId}-desc` : null;
  const errorId = error ? `${inputId}-error` : null;

  const describedByParts = [];
  if (descId) describedByParts.push(descId);
  if (errorId) describedByParts.push(errorId);
  const ariaDescribedBy = describedByParts.length > 0 ? describedByParts.join(" ") : undefined;

  const contextValue = {
    id: inputId,
    labelId,
    descId,
    errorId,
    ariaDescribedBy,
    ariaInvalid: Boolean(error),
    ariaErrorMessage: errorId || undefined,
  };

  const renderedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child, {
      id: child.props.id || inputId,
      "aria-describedby": child.props["aria-describedby"] || ariaDescribedBy,
      "aria-invalid": child.props["aria-invalid"] !== undefined ? child.props["aria-invalid"] : (error ? true : undefined),
      "aria-errormessage": child.props["aria-errormessage"] || (error ? errorId : undefined),
    });
  });

  return (
    <FormFieldContext.Provider value={contextValue}>
      <div
        className={`form-field ${className}`}
        style={{ display: "flex", flexDirection: "column", gap: "2px", ...style }}
        {...props}
      >
        {label && (
          <label
            id={labelId}
            htmlFor={inputId}
            style={{
              font: "400 10px/1 " + (t.font || "sans-serif"),
              letterSpacing: ".2em",
              color: V.pri || "#6CFF9A",
              margin: "4px 0 2px",
              cursor: "pointer",
              ...labelStyle,
            }}
          >
            {label}
            {required && <span aria-hidden="true" style={{ color: V.err || "#CF6679", marginLeft: "2px" }}> *</span>}
          </label>
        )}

        {renderedChildren}

        {descText && (
          <div
            id={descId}
            style={{
              font: "400 10px/1.3 " + (t.font || "sans-serif"),
              color: V.ink2 || "#A7C8BC",
              marginTop: "2px",
            }}
          >
            {descText}
          </div>
        )}

        {error && (
          <div
            id={errorId}
            style={{
              font: "400 10px/1.3 " + (t.font || "sans-serif"),
              color: V.err || "#CF6679",
              marginTop: "2px",
            }}
          >
            &gt; {error}
          </div>
        )}
      </div>
    </FormFieldContext.Provider>
  );
}

export default FormField;
