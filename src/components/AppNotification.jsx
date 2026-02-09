import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const accentMap = {
  success: "bg-green-100 text-green-600",
  error: "bg-red-100 text-red-600",
  warning: "bg-yellow-100 text-yellow-600",
  info: "bg-blue-100 text-blue-600",
};

export default function AppNotification({
  t,
  title,
  message,
  type = "info",
  actionLabel,
  onAction,
}) {
  const Icon = iconMap[type];

  return (
    <div
      className={`
        w-[360px] max-w-full rounded bg-white border border-gray-200
        shadow-xl p-4 flex gap-3
        transition-all duration-300 ease-out
        ${t.visible ? "animate-enter" : "animate-leave"}
      `}
    >
      {/* ICON CIRCLE */}
      <div
        className={`
          w-10 h-10 rounded-full flex items-center justify-center
          ${accentMap[type]}
        `}
      >
        <Icon size={18} />
      </div>

      {/* CONTENT */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 truncate">
          {title}
        </h4>

        {message && (
          <p className="text-sm text-gray-600 mt-0.5 leading-snug">
            {message}
          </p>
        )}

        {actionLabel && (
          <button
            onClick={() => {
              onAction?.();
              toast.dismiss(t.id);
            }}
            className="mt-2 text-xs font-semibold text-primary-600 hover:underline"
          >
            {actionLabel}
          </button>
        )}
      </div>

      {/* CLOSE BUTTON */}
      <button
        onClick={() => toast.dismiss(t.id)}
        className="
          text-gray-400 hover:text-gray-700
          transition rounded-md p-1
        "
      >
        <X size={16} />
      </button>
    </div>
  );
}
