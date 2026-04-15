import {
  Clock,
  ChevronRight,
  Banknote,
  CreditCard,
  Smartphone,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "../../utils/numberFormatter";
import Shimmer from "../../layout/Shimmer";
import { formatDate } from "../../utils/dateFormatter";
import StatusBadge from "../../layout/StatusBadge";

// ─── Skeleton ────────────────────────────────────────────────────────────────
function ShiftSummarySkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <Shimmer width="100px" height="12px" />
          <Shimmer width="70px" height="9px" className="mt-1" />
        </div>
        <Shimmer width="50px" height="22px" rounded="lg" />
      </div>
      <div className="p-4 space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="space-y-2.5 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-2">
              <Shimmer width="70px" height="12px" />
              <Shimmer width="35px" height="9px" />
              <Shimmer width="50px" height="9px" />
              <Shimmer
                width="35px"
                height="16px"
                rounded="full"
                className="ml-auto"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Shimmer width="100%" height="42px" rounded="lg" />
              <Shimmer width="100%" height="42px" rounded="lg" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[1, 2, 3].map((j) => (
                <Shimmer key={j} width="100%" height="24px" rounded="lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Date Range Banner ────────────────────────────────────────────────────────
function DateRangeBanner({ shifts, dateRange }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Calendar size={13} className="text-green-600" strokeWidth={1.75} />
          <span className="text-[11px] font-semibold text-gray-600">
            {formatDate(dateRange?.startDate, "long")} –{" "}
            {formatDate(dateRange?.endDate, "long")}
          </span>
        </div>
        <p className="text-2xl font-black text-gray-900 mb-0.5">
          {shifts.length}
        </p>
        <p className="text-[10px] font-medium text-gray-500">Total Shifts</p>
      </div>

      <button
        onClick={() => navigate("/shift-history", { state: { dateRange } })}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg transition-all group"
      >
        <span className="text-xs font-bold text-white">View Shift History</span>
        <ArrowRight
          size={13}
          className="text-white group-hover:translate-x-0.5 transition-transform"
          strokeWidth={2}
        />
      </button>
    </div>
  );
}

// ─── Single Shift Row ─────────────────────────────────────────────────────────
function ShiftRow({ shift }) {
  if (!shift) return null;

  const isOpen = shift.status === "open";
  const { orderStats, collection } = shift;

  return (
    <div className="space-y-2.5 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
      {/* Shift Header */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <p className="text-[13px] font-black text-gray-900">
            {shift.floorName}
          </p>
          <span className="text-[10px] font-medium text-gray-400">
            #{shift.id}
          </span>
          <span className="text-[10px] font-medium text-gray-400">
            · {shift.cashierName}
          </span>
        </div>
        <StatusBadge
          value={isOpen}
          trueText="OPEN"
          falseText="CLOSED"
          size="sm"
        />
      </div>

      {/* Stats Grid - 2 columns */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-50 rounded-lg p-2.5">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
            Sales
          </p>
          <p className="text-sm font-black text-gray-900 truncate">
            {formatNumber(shift.totalSales, true)}
          </p>
          <p className="text-[9px] font-medium text-gray-400 mt-0.5">
            {orderStats?.completedOrders || 0} orders
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2.5">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
            Adjustments
          </p>
          <p className="text-sm font-black text-gray-900 truncate">
            {formatNumber(collection?.totalAdjustment || 0, true)}
          </p>
          <p className="text-[9px] font-medium text-gray-400 mt-0.5">
            {collection?.adjustmentCount || 0} adj
          </p>
        </div>
      </div>

      {/* Payment Row - Stack on mobile, grid on desktop */}
      <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2">
        {/* Cash */}
        <div className="flex items-center justify-between bg-amber-50 rounded-md px-2.5 py-1.5 border border-amber-100/50">
          <span className="text-[11px] font-semibold text-gray-600 flex items-center gap-1.5">
            <Banknote
              size={12}
              className="text-amber-600 shrink-0"
              strokeWidth={1.75}
            />
            Cash
          </span>
          <span className="text-[11px] font-black text-gray-900">
            {formatNumber(collection?.paymentBreakdown?.cash || 0, true)}
          </span>
        </div>
        {/* Card */}
        <div className="flex items-center justify-between bg-teal-50 rounded-md px-2.5 py-1.5 border border-teal-100/50">
          <span className="text-[11px] font-semibold text-gray-600 flex items-center gap-1.5">
            <CreditCard
              size={12}
              className="text-teal-600 shrink-0"
              strokeWidth={1.75}
            />
            Card
          </span>
          <span className="text-[11px] font-black text-gray-900">
            {formatNumber(collection?.paymentBreakdown?.card || 0, true)}
          </span>
        </div>
        {/* UPI */}
        <div className="flex items-center justify-between bg-indigo-50 rounded-md px-2.5 py-1.5 border border-indigo-100/50">
          <span className="text-[11px] font-semibold text-gray-600 flex items-center gap-1.5">
            <Smartphone
              size={12}
              className="text-indigo-600 shrink-0"
              strokeWidth={1.75}
            />
            UPI
          </span>
          <span className="text-[11px] font-black text-gray-900">
            {formatNumber(collection?.paymentBreakdown?.upi || 0, true)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ShiftSummary({
  shifts = [],
  loading = false,
  dateRange,
}) {
  const navigate = useNavigate();

  const isRangeView = useMemo(() => {
    if (!shifts?.length) return false;
    const dates = shifts.map((s) => s.sessionDate);
    return new Set(dates).size > 1;
  }, [shifts]);

  if (loading) return <ShiftSummarySkeleton />;
  if (!shifts?.length) return null;


  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-gray-100">
        <div>
          <p className="text-[13px] font-black text-gray-900">Shift Summary</p>
          {!isRangeView && shifts[0]?.sessionDate && (
            <p className="text-[10px] font-medium text-gray-400 mt-0.5">
              {formatDate(shifts[0].sessionDate, "long")}
            </p>
          )}
          {isRangeView && (
            <p className="text-[10px] font-medium text-gray-400 mt-0.5">
              Multiple shifts
            </p>
          )}
        </div>
        {!isRangeView && (
          <button
            onClick={() => navigate("/shift-history")}
            className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 hover:bg-green-100 transition-all px-2.5 py-1 rounded-md shrink-0"
          >
            History
            <ChevronRight size={10} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {isRangeView ? (
          <DateRangeBanner shifts={shifts} dateRange={dateRange} />
        ) : (
          <div className="space-y-3">
            {shifts.map((shift) => (
              <ShiftRow key={shift.id} shift={shift} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
