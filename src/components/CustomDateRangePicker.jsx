import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../css/additional-styles/date-range-picker.css"; // Additional custom styles
import { Calendar, X } from "lucide-react";
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
function RangeList({ activeRange, onSelect, isMobile }) {
  return (
    <div className={`space-y- ${isMobile ? "p-2" : ""}`}>
      {PREDEFINED_RANGES.map((range) => (
        <button
          key={range}
          onClick={() => onSelect(range)}
          className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors
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
  defaultRange = "Last 7 Days", // New prop for prefilled range
  className = "",
}) {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const today = useMemo(() => new Date(), []);

  const getInitialRange = useMemo(() => {
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
  const [activeRange, setActiveRange] = useState(defaultRange);
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const [selectedRange, setSelectedRange] = useState(
    value ? { ...value, key: "selection" } : getInitialRange,
  );
  const [tempRange, setTempRange] = useState(selectedRange);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  // -------- IMPROVED AUTO FLIP ALIGNMENT --------
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const popWidth = showCustomPicker ? (isMobile ? 320 : 850) : 240;
    const spaceRight = window.innerWidth - rect.left;
    const spaceLeft = rect.right;

    // Check if there's enough space on the right
    // If not, and there's more space on the left, align right
    if (spaceRight < popWidth && spaceLeft > spaceRight) {
      setAlignRight(true);
    } else {
      setAlignRight(false);
    }
  }, [isOpen, showCustomPicker, isMobile]);

  const formatDisplayValue = useCallback(
    (range = selectedRange) => {
      if (!range?.startDate || !range?.endDate) return placeholder;
      const startStr = formatDate(range.startDate, isMobile ? "short" : "long");
      const endStr = formatDate(range.endDate, isMobile ? "short" : "long");
      return `${startStr} - ${endStr}`;
    },
    [selectedRange, placeholder, isMobile],
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

  // Initialize with default range on mount
  useEffect(() => {
    if (!value && defaultRange) {
      const initialRange = getDateRange(defaultRange);
      setSelectedRange(initialRange);
      onChange?.({
        startDate: toISODate(initialRange.startDate),
        endDate: toISODate(initialRange.endDate),
      });
    }
  }, []); // Only run on mount

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="form-input flex items-center gap-2 hover:border-orange-400 transition-colors bg-white"
      >
        <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <span className="text-sm text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
          {formatDisplayValue()}
        </span>
      </button>

      {/* POPOVER */}
      {isOpen && (
        <>
          {/* Mobile Overlay */}
          {isMobile && showCustomPicker && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => {
                setIsOpen(false);
                setShowCustomPicker(false);
              }}
            />
          )}

          <div
            className={`
              bg-white rounded-lg shadow-xl border border-gray-200 z-50
              ${
                isMobile && showCustomPicker
                  ? "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-md max-h-[90vh]"
                  : showCustomPicker
                    ? `absolute top-full mt-2 ${alignRight ? "right-0" : "left-0"} w-[840px] max-w-[95vw]`
                    : `absolute top-full mt-2 ${alignRight ? "right-0" : "left-0"} w-[240px]`
              }
              overflow-hidden
            `}
          >
            {!showCustomPicker ? (
              // Simple range list
              <RangeList
                  activeRange={activeRange}
                  onSelect={handleRangeSelect}
                  isMobile={isMobile}
                />
            ) : (
              // Custom date picker with calendar
              <div className="flex flex-col h-full max-h-[90vh]">
                {/* Mobile Header */}
                {isMobile && (
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Select Date Range
                    </h3>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setShowCustomPicker(false);
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                )}

                {/* Main content area */}
                <div
                  className={`flex ${isMobile ? "flex-col" : "flex-row"} flex-1 min-h-0`}
                >
                  {/* Sidebar */}
                  <div
                    className={`${isMobile ? "border-b" : "border-r w-[200px]"} border-gray-200 flex-shrink-0 ${isMobile ? "overflow-y-auto" : ""}`}
                  >
                    <div className="py-2">
                      <RangeList
                        activeRange={activeRange}
                        onSelect={handleRangeSelect}
                        isMobile={isMobile}
                      />
                    </div>
                  </div>

                  {/* Calendar container */}
                  <div className="flex-1 overflow-auto">
                    <div className={isMobile ? "p-2" : "p-0"}>
                      <DateRange
                        ranges={[tempRange]}
                        onChange={(item) => setTempRange(item.selection)}
                        months={isMobile ? 1 : 2}
                        direction={isMobile ? "vertical" : "horizontal"}
                        showDateDisplay={false}
                        rangeColors={["#fb923c"]}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50 gap-4 flex-shrink-0">
                  <span className="text-sm text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap flex-1 min-w-0">
                    {formatDisplayValue(tempRange)}
                  </span>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleApply}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-orange-400 rounded-lg hover:bg-orange-500 transition-colors shadow-sm"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
