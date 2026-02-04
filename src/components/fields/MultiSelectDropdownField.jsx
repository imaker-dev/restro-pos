import { useState } from "react";
import { X } from "lucide-react";
import { FieldWrapper } from "./FieldWrapper";

export function MultiSelectDropdownField({
  label,
  name,
  id,
  required,
  error,
  helperText,
  options = [], // [{ id, label }]
  value = [], // array of ids
  onChange,
  disabled = false,
  placeholder = "Select option",
}) {
  const inputId = id || name;
  const [selectedId, setSelectedId] = useState("");

  const handleAdd = (e) => {
    const val = e.target.value;
    setSelectedId(val);

    if (!val || disabled) return;

    if (!value.includes(val)) {
      onChange([...value, val]);
    }

    setSelectedId("");
  };

  const remove = (id) => {
    if (disabled) return;
    onChange(value.filter((v) => v !== id));
  };

  const selectedOptions = options.filter((o) => value.includes(o.id));

  return (
    <FieldWrapper
      label={label}
      id={inputId}
      required={required}
      error={error}
      helperText={helperText}
      disabled={disabled}
    >
      <div className="flex flex-col gap-2">
        {/* Dropdown */}
        <select
          id={inputId}
          name={name}
          value={selectedId}
          onChange={handleAdd}
          disabled={disabled}
          className={`
            form-select w-full
            ${disabled ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""}
            ${error ? "border-red-500" : ""}
          `}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => {
            const isSelected = value.includes(o.id);

            return (
              <option
                key={o.id}
                value={o.id}
                disabled={isSelected}
                className={isSelected ? "bg-gray-200 text-gray-500" : ""}
              >
                {o.label} {isSelected ? "✓" : ""}
              </option>
            );
          })}
        </select>

        {/* Selected Tags */}
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((o) => (
            <span
              key={o.id}
              className="bg-gray-200 px-2 py-1 text-xs rounded flex gap-1 items-center"
            >
              {o.label}
              {!disabled && (
                <button type="button" onClick={() => remove(o.id)}>
                  <X size={12} />
                </button>
              )}
            </span>
          ))}
        </div>
      </div>
    </FieldWrapper>
  );
}
