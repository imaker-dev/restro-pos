import { Clock, Eye, MapPin, Users } from "lucide-react";
import { formatNumber } from "../../utils/numberFormatter";
import OrderBadge from "./OrderBadge";

function RunningTableCard({ table, STATUS_CFG,onView }) {
  const cfg = STATUS_CFG[table?.orderStatus] || STATUS_CFG.unknown;

  function elapsed(d) {
    return Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  }

  const min = elapsed(table.startedAt);

  const isCrit = min >= 45;
  const isWarn = min >= 30 && !isCrit;

  const timeText = isCrit
    ? "text-rose-600"
    : isWarn
      ? "text-amber-600"
      : "text-slate-500";
  const timeBg = isCrit ? "bg-rose-50" : isWarn ? "bg-amber-50" : "bg-slate-50";
  const timeIcon = isCrit
    ? "text-rose-500"
    : isWarn
      ? "text-amber-500"
      : "text-slate-400";

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className={`h-1 w-full ${cfg?.bar}`} />
      <div className="p-3 sm:p-3.5">
        {/* ID + Status */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm sm:text-base font-black text-slate-900 font-mono">
            {table?.tableNumber}
          </span>
          <OrderBadge type="status" value={table?.orderStatus} size="sm" />
        </div>

        {/* Area */}
        <div className="flex items-center gap-1 mb-2.5">
          <MapPin size={9} className="text-slate-400 flex-shrink-0" />
          <p className="text-[10px] text-slate-400 font-medium truncate">
            {table?.floorName}
          </p>
        </div>

        {/* Amount */}
        <p className="text-base sm:text-lg font-black text-slate-900 font-mono leading-none mb-2.5">
          {formatNumber(table?.orderAmount, true)}
        </p>

        {/* Divider */}
        <div className="h-px bg-slate-100 mb-2" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-md bg-slate-50 flex items-center justify-center">
              <Users size={10} className="text-slate-400" />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-600">
              {table?.guestCount} Guests
            </span>
          </div>
          <div className={`flex items-center gap-1 ${timeText}`}>
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center ${timeBg}`}
            >
              <Clock size={10} className={timeIcon} />
            </div>
            <span className="text-[10px] sm:text-xs font-bold">{min}m</span>
          </div>
        </div>
        <button
            onClick={(e) => {
              e.stopPropagation();
              onView(table);
            }}
            className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-primary-500 text-white text-[10px] font-bold hover:bg-primary-600"
          >
            <Eye size={10} />
            View Order
          </button>
      </div>
    </div>
  );
}

export default RunningTableCard;
