import { AlertTriangle } from "lucide-react";
import { formatNumber } from "../../../utils/numberFormatter";

// ─── Reason breakdown card ────────────────────────────────────────────────────
export default function ReasonCard({ reason, count, amount, maxAmount }) {
  const pct = maxAmount > 0 ? (parseFloat(amount) / maxAmount) * 100 : 0;
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 transition-all duration-200 hover:shadow-md group">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertTriangle
              size={13}
              className="text-rose-500"
              strokeWidth={2}
            />
          </div>
          <p className="text-[12px] font-black text-slate-800 leading-tight">
            {reason || "No reason"}
          </p>
        </div>
        <span className="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex-shrink-0">
          {count}×
        </span>
      </div>
      <div className="mb-2">
        <div className="flex justify-between mb-1">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
            Loss
          </span>
          <span className="text-[10px] font-black text-rose-600 tabular-nums">
            {pct.toFixed(0)}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <p className="text-[15px] font-black text-slate-900 tabular-nums">
        {formatNumber(amount, true)}
      </p>
    </div>
  );
}
