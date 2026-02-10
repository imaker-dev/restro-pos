import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { day: 'Mon', ground: 12500, first: 18900, rooftop: 8200, bar: 5400 },
  { day: 'Tue', ground: 14200, first: 20100, rooftop: 9100, bar: 6200 },
  { day: 'Wed', ground: 11800, first: 17500, rooftop: 7800, bar: 4900 },
  { day: 'Thu', ground: 16300, first: 22400, rooftop: 10500, bar: 7100 },
  { day: 'Fri', ground: 19200, first: 28900, rooftop: 14200, bar: 11300 },
  { day: 'Sat', ground: 22100, first: 31500, rooftop: 18900, bar: 14200 },
  { day: 'Sun', ground: 18900, first: 26700, rooftop: 15600, bar: 12100 },
];

export const RevenueChart = () => {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Weekly Revenue by Floor</h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            labelStyle={{ color: '#1f2937' }}
            formatter={(value) => `₹${(value).toLocaleString()}`}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Line
            type="monotone"
            dataKey="ground"
            stroke="#3b82f6"
            name="Ground Floor"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="first"
            stroke="#f59e0b"
            name="First Floor"
            strokeWidth={2}
            dot={{ fill: '#f59e0b', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="rooftop"
            stroke="#10b981"
            name="Rooftop"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="bar"
            stroke="#a855f7"
            name="Bar"
            strokeWidth={2}
            dot={{ fill: '#a855f7', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
