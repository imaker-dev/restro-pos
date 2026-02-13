import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Calendar } from "lucide-react";
import { formatDate } from "../utils/dateFormatter";

const PREDEFINED_RANGES = [
  "Today",
  "Yesterday",
  "Last 7 Days",
  "Last 30 Days",
  "This Month",
  "Last Month",
  "Custom Range",
];

// ---------- Helpers ----------
const startOfDay = (d) => new Date(new Date(d).setHours(0, 0, 0, 0));
const endOfDay = (d) => new Date(new Date(d).setHours(23, 59, 59, 999));

const toISODate = (date) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// ---------- Sidebar ----------
function RangeList({ activeRange, onSelect }) {
  return (
    <div className="space-y-1">
      {PREDEFINED_RANGES.map((range) => (
        <button
          key={range}
          onClick={() => onSelect(range)}
          className={`w-full text-left px-3 py-1.5 text-sm font-medium
            ${
              activeRange === range
                ? "bg-orange-400 text-white shadow-sm"
                : "hover:bg-gray-100 text-gray-700"
            }`}
        >
          {range}
        </button>
      ))}
    </div>
  );
}

export default function CustomDateRangePicker({
  onChange,
  value,
  placeholder = "Select date range",
}) {
  const containerRef = useRef(null);

  const today = useMemo(() => new Date(), []);

  const defaultRange = useMemo(() => {
    const start = new Date(today);
    start.setDate(today.getDate() - 6);
    return {
      startDate: startOfDay(start),
      endDate: endOfDay(today),
      key: "selection",
    };
  }, [today]);

  const [isOpen, setIsOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const [activeRange, setActiveRange] = useState("Last 7 Days");
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const [selectedRange, setSelectedRange] = useState(
    value ? { ...value, key: "selection" } : defaultRange,
  );
  const [tempRange, setTempRange] = useState(selectedRange);

  // Sync external value
  useEffect(() => {
    if (value?.startDate && value?.endDate) {
      const newRange = { ...value, key: "selection" };
      setSelectedRange(newRange);
      setTempRange(newRange);
    }
  }, [value]);

  // Outside click
  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setIsOpen(false);
        setShowCustomPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ESC close
  useEffect(() => {
    const keyHandler = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setShowCustomPicker(false);
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);

  // -------- AUTO FLIP ALIGNMENT --------
  useEffect(() => {
    if (!isOpen) return;

    const rect = containerRef.current.getBoundingClientRect();
    const popWidth = showCustomPicker ? 850 : 240;
    const spaceRight = window.innerWidth - rect.left;

    setAlignRight(spaceRight < popWidth);
  }, [isOpen, showCustomPicker]);

  const formatDisplayValue = useCallback(
    (range = selectedRange) => {
      if (!range?.startDate || !range?.endDate) return placeholder;
      return `${formatDate(range.startDate, "long")} - ${formatDate(
        range.endDate,
        "long",
      )}`;
    },
    [selectedRange, placeholder],
  );

  const getDateRange = useCallback(
    (range) => {
      const t = new Date();
      const yesterday = new Date(t);
      yesterday.setDate(t.getDate() - 1);

      const startOfMonth = new Date(t.getFullYear(), t.getMonth(), 1);
      const endOfMonth = new Date(t.getFullYear(), t.getMonth() + 1, 0);

      const startOfLastMonth = new Date(t.getFullYear(), t.getMonth() - 1, 1);
      const endOfLastMonth = new Date(t.getFullYear(), t.getMonth(), 0);

      switch (range) {
        case "Today":
          return {
            startDate: startOfDay(t),
            endDate: endOfDay(t),
            key: "selection",
          };
        case "Yesterday":
          return {
            startDate: startOfDay(yesterday),
            endDate: endOfDay(yesterday),
            key: "selection",
          };
        case "Last 7 Days": {
          const d = new Date(t);
          d.setDate(t.getDate() - 6);
          return {
            startDate: startOfDay(d),
            endDate: endOfDay(t),
            key: "selection",
          };
        }
        case "Last 30 Days": {
          const d = new Date(t);
          d.setDate(t.getDate() - 29);
          return {
            startDate: startOfDay(d),
            endDate: endOfDay(t),
            key: "selection",
          };
        }
        case "This Month":
          return {
            startDate: startOfDay(startOfMonth),
            endDate: endOfDay(endOfMonth),
            key: "selection",
          };
        case "Last Month":
          return {
            startDate: startOfDay(startOfLastMonth),
            endDate: endOfDay(endOfLastMonth),
            key: "selection",
          };
        default:
          return selectedRange;
      }
    },
    [selectedRange],
  );

  const handleRangeSelect = useCallback(
    (range) => {
      setActiveRange(range);

      if (range === "Custom Range") {
        setShowCustomPicker(true);
        setTempRange(selectedRange);
        return;
      }

      const newRange = getDateRange(range);
      setSelectedRange(newRange);
      setShowCustomPicker(false);
      onChange?.({
        startDate: toISODate(newRange.startDate),
        endDate: toISODate(newRange.endDate),
      });
      setIsOpen(false);
    },
    [getDateRange, onChange, selectedRange],
  );

  const handleApply = useCallback(() => {
    setSelectedRange(tempRange);
    setActiveRange("Custom Range");
    setShowCustomPicker(false);
    onChange?.({
      startDate: toISODate(tempRange.startDate),
      endDate: toISODate(tempRange.endDate),
    });
    setIsOpen(false);
  }, [tempRange, onChange]);

  const handleCancel = useCallback(() => {
    setTempRange(selectedRange);
    setShowCustomPicker(false);
  }, [selectedRange]);

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="form-input flex items-center gap-2"
      >
        <Calendar className="w-4 h-4 text-gray-500" />
        <span>{formatDisplayValue()}</span>
      </button>

      {/* POPOVER */}
      {isOpen && (
        <div
          className={`absolute top-full mt-2 ${
            alignRight ? "right-0" : "left-0"
          } bg-white rounded  border border-gray-200 z-50
          overflow-hidden transition-[width]
          min-w-[240px] max-w-[95vw]
          ${showCustomPicker ? "w-[850px]" : "w-[240px]"}`}
        >
          {!showCustomPicker ? (
            <RangeList activeRange={activeRange} onSelect={handleRangeSelect} />
          ) : (
            <div>
              <div className="flex">
                <div className="border-r border-slate-300">
                  <RangeList
                    activeRange={activeRange}
                    onSelect={handleRangeSelect}
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <DateRange
                    ranges={[tempRange]}
                    onChange={(item) => setTempRange(item.selection)}
                    months={2}
                    direction="horizontal"
                    showDateDisplay={false}
                    rangeColors={["#fb923c"]}
                  />
                </div>
              </div>
              <div className="flex justify-between px-4 py-3 border-t border-slate-300 bg-gray-50">
                <span className="text-sm text-gray-600">
                  {formatDisplayValue(tempRange)}
                </span>
                <div className="flex gap-2">
                  <button onClick={handleCancel} className="btn-sm bg-white">
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    className="btn-sm bg-orange-400 text-white"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
