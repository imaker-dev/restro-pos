import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const topItemsData = [
  { name: 'Biryani', value: 285, sold: 45 },
  { name: 'Butter Chicken', value: 245, sold: 38 },
  { name: 'Tandoori Chicken', value: 198, sold: 31 },
  { name: 'Paneer Tikka', value: 165, sold: 26 },
  { name: 'Naan & Breads', value: 142, sold: 45 },
];

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#a855f7', '#ef4444'];

export const TopItems = () => {
  const totalSales = topItemsData.reduce((sum, item) => sum + item.value, 0);
  const totalOrders = topItemsData.reduce((sum, item) => sum + item.sold, 0);

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Selling Items</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={topItemsData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
            >
              {topItemsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}
              labelStyle={{ color: '#1f2937' }}
              formatter={(value) => `₹${value}`}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex flex-col justify-between">
          <div className="space-y-3">
            {topItemsData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div>
                    <p className="text-gray-900 font-medium text-sm">{item.name}</p>
                    <p className="text-gray-500 text-xs">{item.sold} orders</p>
                  </div>
                </div>
                <p className="text-gray-900 font-semibold text-sm">₹{item.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-blue-600 text-xs font-medium mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-blue-900">{totalOrders}</p>
              </div>
              <div>
                <p className="text-blue-600 text-xs font-medium mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-900">₹{totalSales.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopItems;
