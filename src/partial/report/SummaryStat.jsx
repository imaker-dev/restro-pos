'use client';

const colorStyles = {
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  green: 'bg-green-500/10 text-green-400 border-green-500/30',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  red: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const trendColors = {
  up: 'text-green-400',
  down: 'text-red-400',
  neutral: 'text-gray-400',
};

export function SummaryStat({
  label,
  value,
  subtext,
  icon: Icon,
  color,
  trend,
  trendValue,
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-6 transition-all duration-300 hover:border-gray-600 hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative z-10">
        {/* Icon */}
        <div className={`mb-4 inline-flex rounded-lg border p-3 ${colorStyles[color]}`}>
          <Icon size={24} />
        </div>

        {/* Label */}
        <p className="text-sm font-medium text-gray-400">{label}</p>

        {/* Main value */}
        <p className="mt-2 text-3xl font-bold text-white">
          {value}
        </p>

        {/* Subtext and trend */}
        <div className="mt-3 flex items-center justify-between">
          {subtext && (
            <p className="text-xs text-gray-500">{subtext}</p>
          )}
          {trend && trendValue && (
            <div className={`text-xs font-semibold ${trendColors[trend]}`}>
              {trend === 'up' && '↑'} {trend === 'down' && '↓'} {trendValue}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
