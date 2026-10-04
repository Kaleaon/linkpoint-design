import React from "react";
import FormSwitch from "./FormSwitch.jsx";

// Refactored Toggle component using standard FormSwitch control.
export default function Toggle({ on, onClick, ...props }) {
  return <FormSwitch checked={on} onChange={onClick} {...props} />;
}
