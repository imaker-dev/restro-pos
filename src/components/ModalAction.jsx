import React, { useRef, useEffect } from "react";
import Transition from "../utils/Transition";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

function ModalAction({
  id,
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  theme = "success", // success | danger
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
}) {
  const modalContent = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!isOpen || modalContent.current.contains(target)) return;
      onClose();
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [isOpen, onClose]);

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!isOpen || keyCode !== 27) return;
      onClose();
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [isOpen, onClose]);

const themeConfig = {
  success: {
    icon: CheckCircle,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    borderColor: "border-emerald-100",
    confirmBtn:
      "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500",
    accent: "text-emerald-700",
    ring: "ring-emerald-200",
  },

  danger: {
    icon: AlertTriangle,
    iconColor: "text-rose-600",
    iconBg: "bg-rose-50",
    borderColor: "border-rose-100",
    confirmBtn: "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500",
    accent: "text-rose-700",
    ring: "ring-rose-200",
  },

  warning: {
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    borderColor: "border-amber-100",
    confirmBtn: "bg-amber-500 hover:bg-amber-600 focus:ring-amber-400",
    accent: "text-amber-700",
    ring: "ring-amber-200",
  },

  info: {
    icon: Info,
    iconColor: "text-sky-600",
    iconBg: "bg-sky-50",
    borderColor: "border-sky-100",
    confirmBtn: "bg-sky-600 hover:bg-sky-700 focus:ring-sky-500",
    accent: "text-sky-700",
    ring: "ring-sky-200",
  },
};


  const config = themeConfig[theme];
  const IconComponent = config.icon;

  return (
    <>
      {/* Backdrop */}
      <Transition
        className="fixed inset-0 bg-slate-900/30 z-50 transition-opacity"
        show={isOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      />

      {/* Dialog */}
      <Transition
        id={id}
        className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center px-4"
        role="dialog"
        aria-modal="true"
        show={isOpen}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <div
          ref={modalContent}
          className="bg-white rounded shadow-lg max-w-md w-full"
        >
          {/* Content Area */}
          <div className="p-4 sm:p-6">
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div
                className={`p-4 rounded-full ${config.iconBg} ${config.borderColor} border`}
              >
                <IconComponent className={`w-8 h-8 ${config.iconColor}`} />
              </div>
            </div>

            {/* Title */}
            <h2
              id={`${id}-title`}
              className={`text-center text-xl font-semibold text-slate-900 mb-3 ${config.accent}`}
            >
              {title}
            </h2>

            {/* Description */}
            <p
              id={`${id}-description`}
              className="text-center text-slate-600 mb-8 text-[15px] leading-relaxed"
            >
              {description}
            </p>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="btn w-full text-slate-700 bg-white border border-slate-300 
               hover:bg-slate-50 hover:border-slate-400
               transition-all duration-150
               disabled:opacity-50 disabled:cursor-not-allowed
               active:scale-[0.98]"
              >
                {cancelText}
              </button>

              <button
                onClick={() => !loading && onConfirm()}
                disabled={loading}
                className={`btn w-full text-white 
                transition-all duration-150 shadow-sm
                active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed
                ${config.confirmBtn}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
}

export default ModalAction;
