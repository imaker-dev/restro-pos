import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";

const rawData = [
  { time: "8am", orders: 8, revenue: 3200 },
  { time: "9am", orders: 12, revenue: 4800 },
  { time: "10am", orders: 18, revenue: 7200 },
  { time: "11am", orders: 35, revenue: 14000 },
  { time: "12pm", orders: 52, revenue: 20800 },
  { time: "1pm", orders: 48, revenue: 19200 },
  { time: "2pm", orders: 28, revenue: 11200 },
  { time: "6pm", orders: 22, revenue: 8800 },
  { time: "7pm", orders: 45, revenue: 18000 },
  { time: "8pm", orders: 58, revenue: 23200 },
  { time: "9pm", orders: 42, revenue: 16800 },
  { time: "10pm", orders: 18, revenue: 7200 },
];

export default function PeakHours() {
  const peakData = useMemo(() => rawData, []);

  const peakTime = peakData.reduce((max, current) =>
    current.revenue > max.revenue ? current : max,
  );

  const avgOrders = Math.round(
    peakData.reduce((sum, item) => sum + item.orders, 0) / peakData.length,
  );

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-gray-200
      bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition"
    >
      {/* Header */}
      <div className="relative p-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Orders & Revenue Trends
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Peak time:{" "}
          <span className="font-semibold text-emerald-600">
            {peakTime.time}
          </span>{" "}
          • Avg: {avgOrders} orders/hour
        </p>
      </div>

      {/* Chart */}
      <div className="p-5">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={peakData}
            margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#e5e7eb"
              vertical={false}
            />

            <XAxis
              dataKey="time"
              stroke="#9ca3af"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "12px" }}
            />

            {/* Orders Axis */}
            <YAxis
              yAxisId="left"
              stroke="#3b82f6"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "12px" }}
            />

            {/* Revenue Axis */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#10b981"
              tickFormatter={(v) => `₹${v / 1000}k`}
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "12px" }}
            />

            <Tooltip
              cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }}
              contentStyle={{
                backgroundColor: "rgba(17,24,39,0.95)",
                border: "none",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                backdropFilter: "blur(6px)",
              }}
              labelStyle={{ color: "#9ca3af" }}
              formatter={(value, name) =>
                name === "Orders"
                  ? [`${value}`, "Orders"]
                  : [`₹${value.toLocaleString()}`, "Revenue"]
              }
            />

            {/* Orders Area */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="orders"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#ordersGrad)"
              name="Orders"
              animationDuration={700}
            />

            {/* Revenue Area */}
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#revenueGrad)"
              name="Revenue"
              animationDuration={700}
            />

            {/* Peak Dot */}
            <ReferenceDot
              yAxisId="right"
              x={peakTime.time}
              y={peakTime.revenue}
              r={6}
              fill="#10b981"
              stroke="white"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
