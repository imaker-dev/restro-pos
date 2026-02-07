import React from "react";
import Shimmer from "../../layout/Shimmer";

const KotOrderCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-3">
        <Shimmer width="40px" height="40px" rounded="full" />
        <div className="flex-1 space-y-2">
          <Shimmer width="120px" height="14px" />
          <Shimmer width="180px" height="12px" />
        </div>
      </div>

      {/* Items */}
      <div className="p-4 space-y-3 min-h-[150px]">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex items-center gap-2 flex-1">
              <Shimmer width="14px" height="14px" rounded="full" />
              <Shimmer width="120px" height="12px" />
            </div>
            <Shimmer width="30px" height="12px" />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <Shimmer width="70px" height="14px" />
        <Shimmer width="110px" height="32px" rounded="lg" />
      </div>
    </div>
  );
};

export default KotOrderCardSkeleton;
