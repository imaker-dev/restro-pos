import React from "react";

function MetricPanel({
  icon: Icon,
  title,
  right,
  desc,
  children,
  noPad = false, // ✅ NEW PROP
}) {
  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
            <Icon size={13} className="text-white" strokeWidth={2} />
          </div>

          <div>
            <p className="text-[12.5px] font-black text-slate-800 leading-none">
              {title}
            </p>

            {desc && (
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {desc}
              </p>
            )}
          </div>
        </div>

        {right}
      </div>

      {/* Body */}
      <div className={noPad ? "" : "px-5 py-3"}>
        {children}
      </div>
    </div>
  );
}

export default MetricPanel;