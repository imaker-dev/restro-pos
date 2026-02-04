import React from "react";
import { Calendar, Clock } from "lucide-react";
import { FieldWrapper } from "./FieldWrapper";

export function InputField({
  label,
  name,
  id,
  required,
  error,
  helperText,
  type = "text",
  placeholder = "Placeholder",
  value,
  onChange,
  onBlur,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
}) {
  const rightDefaultIcon =
    type === "date" ? Calendar :
    type === "time" ? Clock :
    null;

  const FinalRightIcon = iconPosition === "right" ? Icon : null;
  const FinalLeftIcon = iconPosition === "left" ? Icon : null;

  const inputId = id || name;

  return (
    <FieldWrapper
      label={label}
      id={inputId}
      required={required}
      error={error}
      helperText={helperText}
      disabled={disabled}
    >
      <div className="relative">
        {FinalLeftIcon && (
          <FinalLeftIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`
            form-input w-full
            ${FinalLeftIcon ? "pl-9" : ""}
            ${FinalRightIcon || rightDefaultIcon ? "pr-9" : ""}
            ${error ? "border-red-500" : ""}
            ${disabled ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""}
          `}
        />

        {(FinalRightIcon || rightDefaultIcon) && (
          <div className="absolute right-3 top-2.5 text-gray-400">
            {FinalRightIcon
              ? <FinalRightIcon size={18} />
              : rightDefaultIcon && React.createElement(rightDefaultIcon, { size: 18 })}
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}
