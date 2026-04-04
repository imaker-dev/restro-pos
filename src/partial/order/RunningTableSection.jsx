import NoDataFound from "../../layout/NoDataFound";
import { formatNumber } from "../../utils/numberFormatter";
import LiveOperationSummaryBanner from "./LiveOperationSummaryBanner";
import RunningTableCard from "./RunningTableCard";

const STATUS_CFG = {
  pending: {
    label: "Pending",
    bar: "bg-amber-400",
    pill: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-400",
  },
  ordered: {
    label: "Ordered",
    bar: "bg-sky-400",
    pill: "bg-sky-50 text-sky-700 border border-sky-200",
    dot: "bg-sky-400",
  },
  billed: {
    label: "Billed",
    bar: "bg-emerald-400",
    pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-400",
  },
  unknown: {
    label: "Unknown",
    bar: "bg-slate-300",
    pill: "bg-slate-100 text-slate-600 border border-slate-200",
    dot: "bg-slate-400",
  },
};

function RunningTableSection({ summary, tables }) {
  return (
    <div className="space-y-3 sm:space-y-5">
      {/* Summary */}
      <LiveOperationSummaryBanner
        colorCls="bg-emerald-50/70 border border-emerald-100"
        items={[
          { label: "Tables", value: summary?.totalTables },
          { label: "Guests", value: summary?.totalGuests },
          { label: "Revenue", value: formatNumber(summary?.totalAmount, true) },
        ]}
      />

      {/* Legend row */}
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
        {Object.values(STATUS_CFG).map((cfg) => (
          <div key={cfg.label} className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            <span className="text-[10px] font-medium text-slate-500">
              {cfg.label}
            </span>
          </div>
        ))}
      </div>

      {/* Grid — 2 cols on mobile, 3 on sm, 5 on lg */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        {tables?.length ? (
          tables.map((t) => (
            <RunningTableCard key={t.id} table={t} STATUS_CFG={STATUS_CFG} />
          ))
        ) : (
          <div className="col-span-full bg-white text-center text-xs sm:text-sm text-slate-400 py-4 border border-dashed rounded-lg">
            <NoDataFound title="No active tables available" description="" />
          </div>
        )}
      </div>
    </div>
  );
}
export default RunningTableSection;
