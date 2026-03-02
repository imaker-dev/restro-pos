import {
  CheckCircle2,
  ChefHat,
  Clock,
  Package,
  XCircle,
  Zap,
} from "lucide-react";
import MetaPill from "../../../components/MetaPill";

// ─── Station card ─────────────────────────────────────────────────────────────
export default function StationCard({
  station,
  rank,
  maxTickets,
  isBusiest,
}) {
  const safeMaxTickets = Number(maxTickets) || 0;
  const ticketCount = Number(station.ticketCount) || 0;
  const itemCount = Number(station.itemCount) || 0;
  const servedCount = Number(station.servedCount) || 0;

  const ticketShare =
    safeMaxTickets > 0 ? (ticketCount / safeMaxTickets) * 100 : 0;

  const serveRate = itemCount > 0 ? (servedCount / itemCount) * 100 : 0;

  const prepTime = parseFloat(station.avgPrepTimeMins || 0);

  // serve-rate color
  const srColor =
    serveRate >= 90 ? "#10b981" : serveRate >= 60 ? "#f59e0b" : "#f43f5e";

  return (
    <div
      className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300
  hover:-translate-y-1 hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.13)] group
  ${
    isBusiest
      ? "border border-primary-300 shadow-lg"
      : "border border-slate-200 shadow-sm"
  }`}
    >
      {/* Top stripe */}
      <div className="h-[3px] bg-primary-500" />

      {/* Ambient glow */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity duration-300 bg-primary-500/20" />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* rank + icon bubble */}
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 bg-primary-500 text-white">
                <ChefHat size={20} className="text-white" strokeWidth={1.8} />
              </div>
              {/* rank dot */}
              <div
                className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border-2 border-white ${rank === 1 ? "bg-emerald-600 text-white" : "bg-gray-300"}`}
              >
                {rank}
              </div>
            </div>

            <div className="min-w-0">
              <p className="text-[15px] font-black text-slate-900 leading-tight truncate">
                {station.stationName}
              </p>
            </div>
          </div>

          {/* busiest badge */}
          {isBusiest && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[8px] font-black flex-shrink-0 bg-emerald-600 text-white">
              <Zap size={8} strokeWidth={2.5} fill="currentColor" />
              BUSIEST
            </div>
          )}
        </div>

        {/* Ticket volume bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
              Ticket Volume
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[18px] font-black tabular-nums leading-none">
                {station.ticketCount}
              </span>
              <span className="text-[10px] font-black text-slate-400">
                / {maxTickets}
              </span>
            </div>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-slate-100">
            <div
              className="h-full rounded-full transition-all duration-700 bg-primary-500 shadow-sm"
              style={{ width: `${ticketShare}%` }}
            />
          </div>

          <p className="text-[9px] text-slate-400 font-medium mt-1 text-right">
            {ticketShare.toFixed(0)}% of busiest
          </p>
        </div>

        {/* 4-stat grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <MetaPill
            icon={Package}
            label="Items"
            value={station.itemCount}
            highlight
          />
          <MetaPill
            icon={CheckCircle2}
            label="Served"
            value={station.servedCount}
          />
          <MetaPill
            icon={XCircle}
            label="Cancelled"
            value={station.cancelledCount}
          />
          <MetaPill
            icon={Clock}
            label="Avg Prep"
            value={`${prepTime.toFixed(1)}m`}
          />
        </div>

        {/* Serve rate bar */}
        <div
          className="rounded-xl px-3 py-2.5"
          style={{ background: "#f8fafc", border: "1px solid #e8eaed" }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
              Serve Rate
            </span>
            <span
              className="text-[11px] font-black tabular-nums"
              style={{ color: srColor }}
            >
              {serveRate.toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden bg-slate-100">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${serveRate}%`,
                background: `linear-gradient(90deg,${srColor},${srColor}cc)`,
                boxShadow: `0 0 6px ${srColor}55`,
              }}
            />
          </div>
          <p className="text-[8px] text-slate-400 font-medium mt-1">
            {station.servedCount} served of {station.itemCount} items
          </p>
        </div>
      </div>
    </div>
  );
}
