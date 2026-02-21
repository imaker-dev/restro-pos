import { cn } from "../utils/utils";

/* ---------------- SAFE HELPERS ---------------- */
const safeValue = (val, fallback = 0) =>
  val === null || val === undefined || Number.isNaN(val) ? fallback : val;

const safeTrend = (trend) =>
  trend && typeof trend === "object"
    ? {
        isPositive: Boolean(trend.isPositive),
        value: trend.value ?? "",
      }
    : null;

export const colorStyles = {
  blue: {
    primary: "from-blue-500 to-blue-600",
    secondary: "bg-blue-50 border-blue-200 text-blue-700",
    outlined: "border-blue-300 hover:border-blue-400 text-blue-600",
    minimal: "hover:bg-blue-50/50 text-blue-600",
    iconBg: "bg-blue-500",
    dot: "bg-blue-400",
  },

  green: {
    primary: "from-emerald-500 to-emerald-600",
    secondary: "bg-emerald-50 border-emerald-200 text-emerald-700",
    outlined: "border-emerald-300 hover:border-emerald-400 text-emerald-600",
    minimal: "hover:bg-emerald-50/50 text-emerald-600",
    iconBg: "bg-emerald-500",
    dot: "bg-emerald-400",
  },

  red: {
    primary: "from-red-500 to-red-600",
    secondary: "bg-red-50 border-red-200 text-red-700",
    outlined: "border-red-300 hover:border-red-400 text-red-600",
    minimal: "hover:bg-red-50/50 text-red-600",
    iconBg: "bg-red-500",
    dot: "bg-red-400",
  },

  purple: {
    primary: "from-purple-500 to-purple-600",
    secondary: "bg-purple-50 border-purple-200 text-purple-700",
    outlined: "border-purple-300 hover:border-purple-400 text-purple-600",
    minimal: "hover:bg-purple-50/50 text-purple-600",
    iconBg: "bg-purple-500",
    dot: "bg-purple-400",
  },

  pink: {
    primary: "from-pink-500 to-pink-600",
    secondary: "bg-pink-50 border-pink-200 text-pink-700",
    outlined: "border-pink-300 hover:border-pink-400 text-pink-600",
    minimal: "hover:bg-pink-50/50 text-pink-600",
    iconBg: "bg-pink-500",
    dot: "bg-pink-400",
  },

  orange: {
    primary: "from-orange-500 to-orange-600",
    secondary: "bg-orange-50 border-orange-200 text-orange-700",
    outlined: "border-orange-300 hover:border-orange-400 text-orange-600",
    minimal: "hover:bg-orange-50/50 text-orange-600",
    iconBg: "bg-orange-500",
    dot: "bg-orange-400",
  },

  amber: {
    primary: "from-amber-500 to-amber-600",
    secondary: "bg-amber-50 border-amber-200 text-amber-700",
    outlined: "border-amber-300 hover:border-amber-400 text-amber-600",
    minimal: "hover:bg-amber-50/50 text-amber-600",
    iconBg: "bg-amber-500",
    dot: "bg-amber-400",
  },

  yellow: {
    primary: "from-yellow-400 to-yellow-500",
    secondary: "bg-yellow-50 border-yellow-200 text-yellow-700",
    outlined: "border-yellow-300 hover:border-yellow-400 text-yellow-600",
    minimal: "hover:bg-yellow-50/50 text-yellow-600",
    iconBg: "bg-yellow-500",
    dot: "bg-yellow-400",
  },

  teal: {
    primary: "from-teal-500 to-teal-600",
    secondary: "bg-teal-50 border-teal-200 text-teal-700",
    outlined: "border-teal-300 hover:border-teal-400 text-teal-600",
    minimal: "hover:bg-teal-50/50 text-teal-600",
    iconBg: "bg-teal-500",
    dot: "bg-teal-400",
  },

  cyan: {
    primary: "from-cyan-500 to-cyan-600",
    secondary: "bg-cyan-50 border-cyan-200 text-cyan-700",
    outlined: "border-cyan-300 hover:border-cyan-400 text-cyan-600",
    minimal: "hover:bg-cyan-50/50 text-cyan-600",
    iconBg: "bg-cyan-500",
    dot: "bg-cyan-400",
  },

  indigo: {
    primary: "from-indigo-500 to-indigo-600",
    secondary: "bg-indigo-50 border-indigo-200 text-indigo-700",
    outlined: "border-indigo-300 hover:border-indigo-400 text-indigo-600",
    minimal: "hover:bg-indigo-50/50 text-indigo-600",
    iconBg: "bg-indigo-500",
    dot: "bg-indigo-400",
  },

  slate: {
    primary: "from-slate-600 to-slate-700",
    secondary: "bg-slate-50 border-slate-200 text-slate-700",
    outlined: "border-slate-300 hover:border-slate-400 text-slate-600",
    minimal: "hover:bg-slate-100 text-slate-700",
    iconBg: "bg-slate-600",
    dot: "bg-slate-400",
  },

  gray: {
    primary: "from-gray-600 to-gray-700",
    secondary: "bg-gray-50 border-gray-200 text-gray-700",
    outlined: "border-gray-300 hover:border-gray-400 text-gray-600",
    minimal: "hover:bg-gray-100 text-gray-700",
    iconBg: "bg-gray-600",
    dot: "bg-gray-400",
  },
};

/* ---------------- COMPONENT ---------------- */
export default function StatCard({
  title = "",
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  variant = "primary", // primary | secondary | outlined | minimal
  onClick,
  trend,
}) {
  const styles = colorStyles[color] || colorStyles.blue;
  const displayValue = safeValue(value);
  const safeTrendData = safeTrend(trend);

  /* ---------- PRIMARY ---------- */
  if (variant === "primary") {
    return (
      <div
        onClick={onClick}
        className={cn(
          "rounded-2xl p-6 relative overflow-hidden group transition-all",
          "bg-gradient-to-br text-white hover:shadow-xl",
          styles.primary,
          onClick && "cursor-pointer",
        )}
      >
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-white/20 rounded-full" />
        <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-white/20 rounded-full" />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-white/90">{title}</p>
            <p className="text-4xl font-bold mt-1">{displayValue}</p>
            {subtitle && (
              <p className="text-sm text-white/80 mt-2">{subtitle}</p>
            )}
            {safeTrendData && (
              <span className="inline-block mt-2 text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">
                {safeTrendData.isPositive ? "↑" : "↓"} {safeTrendData.value}
              </span>
            )}
          </div>

          {Icon && (
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ---------- SECONDARY ---------- */
  if (variant === "secondary") {
    return (
      <div
        onClick={onClick}
        className={cn(
          "rounded-xl border px-4 py-4 transition hover:shadow-md relative",
          styles.secondary,
          onClick && "cursor-pointer",
        )}
      >
        <span
          className={cn(
            "absolute top-3 right-3 w-2 h-2 rounded-full",
            styles.dot,
          )}
        />

        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center",
                styles.iconBg,
              )}
            >
              <Icon className="w-4 h-4 text-white" />
            </div>
          )}

          <div>
            <p className="text-xs font-medium opacity-70">{title}</p>
            <p className="text-2xl font-bold leading-none">{displayValue}</p>
            {subtitle && <p className="text-xs opacity-60 mt-1">{subtitle}</p>}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
