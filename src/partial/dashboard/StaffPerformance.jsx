import React from 'react';
import { Star, TrendingUp } from 'lucide-react';


const staffData = [
  { id: 1, name: 'Rajesh Kumar', role: 'Waiter', orders: 28, rating: 4.8, revenue: 18900 },
  { id: 2, name: 'Priya Singh', role: 'Server', orders: 26, rating: 4.6, revenue: 17200 },
  { id: 3, name: 'Amit Patel', role: 'Waiter', orders: 24, rating: 4.5, revenue: 15800 },
  { id: 4, name: 'Sneha Verma', role: 'Bartender', orders: 18, rating: 4.9, revenue: 12300 },
];

export const StaffPerformance = () => {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Staff Performance</h2>
      <div className="space-y-4">
        {staffData.map((staff) => (
          <div key={staff.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-gray-900">{staff.name}</p>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">{staff.role}</span>
              </div>
              <p className="text-xs text-gray-600">{staff.orders} orders • ₹{staff.revenue.toLocaleString()} today</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-gray-900">{staff.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffPerformance;
