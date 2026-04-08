import React from "react";
import Shimmer from "../../../layout/Shimmer";

export default function DailySalesCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Top accent bar */}
      <Shimmer height="3px" />

      <div className="flex items-stretch">
        {/* Date column */}
        <div className="flex flex-col items-center justify-center gap-1 w-16 px-2 bg-slate-100">
          <Shimmer width="24px" height="6px" />
          <Shimmer width="32px" height="24px" />
          <Shimmer width="24px" height="6px" />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col gap-3">
          {/* Row 1 */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <Shimmer width="70%" height="12px" />

              {/* Pills */}
              <div className="flex flex-wrap gap-2 mt-2">
                <Shimmer width="60px" height="20px" rounded="full" />
                <Shimmer width="50px" height="20px" rounded="full" />
                <Shimmer width="70px" height="20px" rounded="full" />
              </div>
            </div>

            {/* Details button */}
            <Shimmer width="80px" height="32px" rounded="lg" />
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100" />

          {/* Row 2 */}
          <div className="grid grid-cols-3 sm:flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-1">
                <Shimmer width="50px" height="8px" />
                <Shimmer width="70px" height="16px" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
        <div className="flex flex-wrap gap-4">
          <Shimmer width="90px" height="12px" />
          <Shimmer width="70px" height="12px" />
          <Shimmer width="60px" height="12px" />
        </div>
      </div>
    </div>
  );
}