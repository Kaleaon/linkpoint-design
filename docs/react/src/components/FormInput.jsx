import React, { forwardRef, useContext } from "react";
import { FormFieldContext } from "./FormField.jsx";

const FormInput = forwardRef(function FormInput(
  {
    id: idProp,
    "aria-describedby": ariaDescribedByProp,
    "aria-invalid": ariaInvalidProp,
    "aria-errormessage": ariaErrorMessageProp,
    style,
    className = "",
    ...props
  },
  ref
) {
  const context = useContext(FormFieldContext);

  const id = idProp || context?.id;
  const ariaDescribedBy = ariaDescribedByProp || context?.ariaDescribedBy;
  const ariaInvalid = ariaInvalidProp !== undefined ? ariaInvalidProp : context?.ariaInvalid;
  const ariaErrorMessage = ariaErrorMessageProp || context?.ariaErrorMessage;

  return (
    <input
      ref={ref}
      id={id}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
      aria-errormessage={ariaErrorMessage}
      className={`form-input ${className}`}
      style={style}
      {...props}
    />
  );
});

export default FormInput;
