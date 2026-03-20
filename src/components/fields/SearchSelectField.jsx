import React, { useEffect, useRef, useState } from "react";
import { Search, X, CheckCircle2 } from "lucide-react";
import { FieldWrapper } from "./FieldWrapper";

export function SearchSelectField({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = "Search...",
  error,
  required,
  disabled,
  loading,
  onSearch,
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const ref = useRef(null);

  // ✅ sync selected option
  useEffect(() => {
    if (!value) {
      setSelectedOption(null);
      return;
    }

    const found = options.find(
      (o) => String(o.value) === String(value)
    );

    if (found) {
      setSelectedOption(found);
    }
  }, [value, options]);

  const selected = selectedOption;

  // ✅ filtering
  const filtered = onSearch
    ? options
    : query
    ? options.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase())
      )
    : options;

  // ✅ close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ✅ debounce search
  useEffect(() => {
    if (!onSearch) return;

    const t = setTimeout(() => {
      onSearch(query);
    }, 400);

    return () => clearTimeout(t);
  }, [query, onSearch]);

  // ✅ clear query when dropdown closes
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  return (
    <FieldWrapper label={label} required={required} error={error}>
      <div ref={ref} className="relative">
        {/* TRIGGER */}
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          onBlur={onBlur}
          disabled={disabled}
          className={`
            w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border bg-white text-sm
            transition-all duration-150
            ${error ? "border-red-400" : ""}
            ${
              open
                ? "border-primary-400 ring-2 ring-primary-100"
                : "border-slate-200 hover:border-slate-300"
            }
            ${disabled ? "bg-slate-100 cursor-not-allowed" : ""}
          `}
        >
          <span
            className={`truncate ${
              selected ? "text-slate-800 font-medium" : "text-slate-400"
            }`}
          >
            {selected ? selected.label : placeholder}
          </span>

          <div className="flex items-center gap-1.5">
            {selected && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                  setSelectedOption(null); // ✅ FIX
                  setQuery("");
                }}
                className="p-1 rounded hover:bg-slate-100"
              >
                <X size={14} className="text-slate-400" />
              </button>
            )}
            <Search size={15} className="text-slate-400" />
          </div>
        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
            {/* SEARCH */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-100 bg-slate-50">
              <Search size={14} className="text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full text-sm bg-transparent outline-none placeholder:text-slate-400"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 rounded hover:bg-slate-200"
                >
                  <X size={13} className="text-slate-500" />
                </button>
              )}
            </div>

            {/* LIST */}
            <div className="max-h-56 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-sm text-slate-400 text-center">
                  Loading...
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-4 text-sm text-slate-400 text-center">
                  No results found
                </div>
              ) : (
                filtered.map((item) => {
                  const isSelected =
                    String(value) === String(item.value);

                  return (
                    <div
                      key={item.value}
                      onClick={() => {
                        onChange(item.value);
                        setSelectedOption(item);
                        setOpen(false);
                      }}
                      className={`
                        flex items-center justify-between px-3.5 py-2.5 text-sm cursor-pointer transition
                        ${
                          isSelected
                            ? "bg-primary-50 text-primary-700"
                            : "hover:bg-slate-50"
                        }
                      `}
                    >
                      <span className="truncate">{item.label}</span>

                      {isSelected && (
                        <CheckCircle2
                          size={15}
                          className="text-primary-600"
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}