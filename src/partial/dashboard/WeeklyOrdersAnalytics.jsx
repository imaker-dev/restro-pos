import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const rawData = [
  { day: "Mon", orders: 120 },
  { day: "Tue", orders: 145 },
  { day: "Wed", orders: 98 },
  { day: "Thu", orders: 160 },
  { day: "Fri", orders: 210 },
  { day: "Sat", orders: 265 },
  { day: "Sun", orders: 230 },
];

export default function WeeklyOrdersAnalytics() {
  // Memo prevents re-renders if parent updates
  const weeklyOrderData = useMemo(() => rawData, []);

  const totalOrders = weeklyOrderData.reduce(
    (sum, item) => sum + item.orders,
    0,
  );

  const bestDay = weeklyOrderData.reduce((max, curr) =>
    curr.orders > max.orders ? curr : max,
  );

  const avgOrders = Math.round(totalOrders / weeklyOrderData.length);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-gray-200
      bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition"
    >
      {/* Accent Glow */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-blue-200/20 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <div className="relative  p-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900">
          Weekly Order Count
        </h2>
        {/* Insight Line */}
        <p className="text-sm text-gray-600 mt-1">
          {totalOrders} total orders • Avg {avgOrders}/day •
          <span className="font-semibold text-blue-600 ml-1">
            Peak: {bestDay.day}
          </span>
        </p>
      </div>

      {/* Chart */}
      <div className="p-5">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={weeklyOrderData}
            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#e5e7eb"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              stroke="#9ca3af"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "12px" }}
            />

            <YAxis
              stroke="#9ca3af"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "12px" }}
            />

            <Tooltip
              cursor={{ fill: "rgba(229,231,235,0.3)" }}
              contentStyle={{
                backgroundColor: "rgba(17,24,39,0.95)",
                border: "none",
                borderRadius: "12px",
                fontSize: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                backdropFilter: "blur(6px)",
              }}
              labelStyle={{ color: "#9ca3af" }}
              itemStyle={{ color: "#ffffff" }}
              formatter={(value) => [value, "Orders"]}
            />

            <Bar
              dataKey="orders"
              radius={[10, 10, 4, 4]}
              animationDuration={700}
            >
              {weeklyOrderData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    index >= 5
                      ? "#111827" // Weekend highlight
                      : "#3b82f6" // Weekdays
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
