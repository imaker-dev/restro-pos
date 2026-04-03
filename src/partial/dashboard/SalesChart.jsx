import { BarChart2, LineChart } from "lucide-react";
import React, { useMemo, useState } from "react";
import { formatDate } from "../../utils/dateFormatter";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "../../utils/numberFormatter";
import Shimmer from "../../layout/Shimmer";

const isSameDay = (a, b) => {
  if (!a || !b) return false;
  const d1 = new Date(a),
    d2 = new Date(b);
  return d1.toDateString() === d2.toDateString();
};

const SERIES = [
  { key: "dineIn", name: "Dine In", color: "#6366f1" },
  { key: "pickup", name: "Pickup", color: "#14b8a6" },
  { key: "delivery", name: "Delivery", color: "#f59e0b" },
];

// ─── Chart Toggle Button ──────────────────────────────────────────────────────
const ChartBtn = ({ icon: Icon, active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-300 ${
      active
        ? "bg-slate-900 text-white"
        : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
    }`}
  >
    <Icon size={13} />
    <span className="hidden sm:inline">{label}</span>
  </button>
);

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl px-4 py-3.5 min-w-[165px]">
      <p className="text-xs font-black text-gray-900 mb-2.5 pb-2 border-b border-gray-100">
        {label}
      </p>
      {payload.map((p) => (
        <div
          key={p.dataKey}
          className="flex items-center justify-between gap-5 mb-1.5"
        >
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-[11px] text-gray-500">{p.name}</span>
          </div>
          <span className="text-[11px] font-black text-gray-900 tabular-nums">
            {formatNumber(p.value, true)}
          </span>
        </div>
      ))}
      <div className="border-t border-gray-100 mt-2 pt-2 flex items-center justify-between">
        <span className="text-[11px] font-bold text-gray-400">Total</span>
        <span className="text-xs font-black text-gray-900 tabular-nums">
          {formatNumber(total, true)}
        </span>
      </div>
    </div>
  );
};

  function SalesChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
        <div className="space-y-2">
          <Shimmer width="140px" height="14px" />
          <Shimmer width="220px" height="10px" />
        </div>

        {/* Toggle buttons */}
        <div className="flex items-center bg-gray-100 rounded-md p-1 gap-1">
          <Shimmer width="55px" height="26px" rounded="md" />
          <Shimmer width="55px" height="26px" rounded="md" />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 px-5 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Shimmer width="10px" height="10px" rounded="full" />
            <Shimmer width="60px" height="10px" />
          </div>
        ))}
      </div>

      {/* Chart Area */}
      <div className="px-3 pb-5 pt-3">
        <Shimmer width="100%" height="280px" rounded="lg" />
      </div>
    </div>
  );
}

const SalesChart = ({ chartData, dateRange,loading=false }) => {
  const [chartType, setChartType] = useState("bar");

  // Determine if single day or range
  const isSingleDay = useMemo(() => {
    if (!dateRange?.startDate) return true; // default to hourly
    return isSameDay(dateRange.startDate, dateRange.endDate);
  }, [dateRange]);

  // How many ticks to skip (avoid crowding on many-day ranges)
  const tickCount = chartData.length;
  const tickInterval = tickCount > 20 ? Math.ceil(tickCount / 12) - 1 : 0;

  const yTickFmt = (v) => {
    if (v >= 100000) return `${(v / 100000).toFixed(0)}L`;
    if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
    return v;
  };

  if (loading) {
  return <SalesChartSkeleton />;
}
  return (
    <div>
      {/* ── Chart ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Chart header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-sm font-black text-gray-900">Sales Overview</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {isSingleDay
                ? `Hourly breakdown · ${dateRange?.startDate ? formatDate(dateRange.startDate, "long") : "Today"}`
                : `Daily breakdown · ${formatDate(dateRange?.startDate, "long")} – ${formatDate(dateRange?.endDate, "long")}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-md p-0.5 gap-0.5">
              <ChartBtn
                icon={BarChart2}
                label="Bar"
                active={chartType === "bar"}
                onClick={() => setChartType("bar")}
              />
              <ChartBtn
                icon={LineChart}
                label="Area"
                active={chartType === "area"}
                onClick={() => setChartType("area")}
              />
            </div>
          </div>
        </div>

        {/* Series legend */}
        <div className="flex items-center gap-5 px-5 pt-4">
          {SERIES.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-[11px] font-semibold text-gray-500">
                {s.name}
              </span>
            </div>
          ))}
        </div>

        {/* Chart body */}
        <div className="px-3 pb-5 pt-3" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart data={chartData} barCategoryGap="28%" barGap={2}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
                  tickLine={false}
                  axisLine={false}
                  interval={tickInterval}
                />
                <YAxis
                  tickFormatter={yTickFmt}
                  tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
                  tickLine={false}
                  axisLine={false}
                  width={38}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#f8fafc", radius: 6 }}
                />
                {SERIES.map((s) => (
                  <Bar
                    key={s.key}
                    dataKey={s.key}
                    name={s.name}
                    fill={s.color}
                    radius={[5, 5, 0, 0]}
                    maxBarSize={28}
                  />
                ))}
              </BarChart>
            ) : (
              <AreaChart data={chartData}>
                <defs>
                  {SERIES.map((s) => (
                    <linearGradient
                      key={s.key}
                      id={`g-${s.key}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={s.color}
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
                  tickLine={false}
                  axisLine={false}
                  interval={tickInterval}
                />
                <YAxis
                  tickFormatter={yTickFmt}
                  tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
                  tickLine={false}
                  axisLine={false}
                  width={38}
                />
                <Tooltip content={<CustomTooltip />} />
                {SERIES.map((s) => (
                  <Area
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    name={s.name}
                    stroke={s.color}
                    strokeWidth={2.5}
                    fill={`url(#g-${s.key})`}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                ))}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
