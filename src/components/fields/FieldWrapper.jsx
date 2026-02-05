export function FieldWrapper({
  label,
  id,
  required,
  error,
  helperText,
  disabled,
  children,
}) {
  return (
    <div className={`space-y-1 w-full ${disabled ? "opacity-70" : ""}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-900">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {children}

      {error && <p className="text-xs text-red-500">{error}</p>}
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}
