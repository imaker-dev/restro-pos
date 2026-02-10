import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const floorData = [
  { time: '10am', ground: 25, first: 38, rooftop: 12, bar: 8 },
  { time: '11am', ground: 32, first: 45, rooftop: 18, bar: 12 },
  { time: '12pm', ground: 42, first: 58, rooftop: 28, bar: 18 },
  { time: '1pm', ground: 38, first: 52, rooftop: 25, bar: 16 },
  { time: '2pm', ground: 28, first: 38, rooftop: 18, bar: 12 },
  { time: '6pm', ground: 45, first: 62, rooftop: 35, bar: 22 },
  { time: '7pm', ground: 58, first: 75, rooftop: 48, bar: 35 },
  { time: '8pm', ground: 65, first: 82, rooftop: 55, bar: 42 },
  { time: '9pm', ground: 52, first: 68, rooftop: 42, bar: 35 },
];

export const FloorAnalytics = () => {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Active Tables by Floor & Time</h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={floorData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
            labelStyle={{ color: '#1f2937' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="ground" fill="#3b82f6" name="Ground Floor" radius={[6, 6, 0, 0]} />
          <Bar dataKey="first" fill="#f59e0b" name="First Floor" radius={[6, 6, 0, 0]} />
          <Bar dataKey="rooftop" fill="#10b981" name="Rooftop" radius={[6, 6, 0, 0]} />
          <Bar dataKey="bar" fill="#a855f7" name="Bar" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FloorAnalytics;
