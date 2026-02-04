import { FieldWrapper } from "./FieldWrapper";

export function SelectField({
  label,
  name,
  id,
  required,
  error,
  helperText,
  options = [],
  value,
  onChange,
  onBlur,
  disabled = false,
}) {
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
      <select
        id={inputId}
        name={name}
        value={value || ""}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`
          form-select w-full
          ${disabled ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""}
          ${error ? "border-red-500" : ""}
        `}
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
