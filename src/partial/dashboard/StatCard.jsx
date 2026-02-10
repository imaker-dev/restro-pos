import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';


export const StatCard = ({
  title,
  value,
  description,
  icon,
  trend,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-3">{title}</p>
          <div className="flex items-end gap-2 mb-2">
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            {trend && (
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${
                trend.direction === 'up' 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {trend.direction === 'up' ? (
                  <ArrowUp size={14} />
                ) : (
                  <ArrowDown size={14} />
                )}
                {Math.abs(trend.value)}%
              </div>
            )}
          </div>
          {description && <p className="text-gray-500 text-xs">{description}</p>}
        </div>
        {icon && <div className="text-blue-600 text-3xl ml-4">{icon}</div>}
      </div>
    </div>
  );
};

export default StatCard;
