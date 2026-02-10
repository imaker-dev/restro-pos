import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const peakHoursData = [
  { time: '8am', orders: 8, revenue: 3200 },
  { time: '9am', orders: 12, revenue: 4800 },
  { time: '10am', orders: 18, revenue: 7200 },
  { time: '11am', orders: 35, revenue: 14000 },
  { time: '12pm', orders: 52, revenue: 20800 },
  { time: '1pm', orders: 48, revenue: 19200 },
  { time: '2pm', orders: 28, revenue: 11200 },
  { time: '6pm', orders: 22, revenue: 8800 },
  { time: '7pm', orders: 45, revenue: 18000 },
  { time: '8pm', orders: 58, revenue: 23200 },
  { time: '9pm', orders: 42, revenue: 16800 },
  { time: '10pm', orders: 18, revenue: 7200 },
];

export const PeakHours = () => {
  const peakTime = peakHoursData.reduce((max, current) => 
    current.revenue > max.revenue ? current : max
  );
  const avgOrders = Math.round(peakHoursData.reduce((sum, item) => sum + item.orders, 0) / peakHoursData.length);

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Orders & Revenue Trends</h2>
          <p className="text-sm text-gray-600 mt-1">Peak time: <span className="font-semibold text-blue-600">{peakTime.time}</span> • Avg: {avgOrders} orders/hour</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={peakHoursData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            formatter={(value, name) => {
              if (name === 'Orders') return [value, 'Orders'];
              return [`₹${value.toLocaleString()}`, 'Revenue'];
            }}
            labelStyle={{ color: '#1f2937' }}
          />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorOrders)"
            name="Orders"
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorRevenue)"
            name="Revenue"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PeakHours;
