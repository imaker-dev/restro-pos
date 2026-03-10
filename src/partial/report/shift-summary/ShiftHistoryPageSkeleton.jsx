import React from "react";
import Shimmer from "../../../layout/Shimmer";

export default function ShiftHistoryPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <Shimmer width="200px" height="22px" />
        <div className="flex gap-2">
          <Shimmer width="150px" height="36px" rounded="lg" />
          <Shimmer width="120px" height="36px" rounded="lg" />
        </div>
      </div>

      {/* Date Groups */}
      <div className="space-y-8">
        {Array.from({ length: 2 }).map((_, groupIndex) => (
          <DateGroupSkeleton key={groupIndex} />
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────── */
/* Date Group Skeleton */
/* ───────────────────────────────────────── */

function DateGroupSkeleton() {
  return (
    <div className="space-y-3">
      {/* Date header row */}
      <div className="flex items-center gap-3 flex-wrap">
        <Shimmer width="170px" height="30px" rounded="lg" />
        <Shimmer width="80px" height="22px" rounded="lg" />
        <Shimmer width="120px" height="22px" rounded="lg" />
        <div className="flex-1 h-px bg-slate-200 hidden sm:block" />
      </div>

      {/* Shift cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <ShiftCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────── */
/* Shift Card Skeleton */
/* ───────────────────────────────────────── */

function ShiftCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-5 space-y-4">
      {/* Top bar */}
      <div className="h-1 bg-slate-200 rounded" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shimmer width="40px" height="40px" rounded="lg" />

          <div className="space-y-2">
            <Shimmer width="120px" height="12px" />
            <Shimmer width="90px" height="10px" />
          </div>
        </div>

        <Shimmer width="70px" height="20px" rounded="lg" />
      </div>

      {/* Time blocks */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-slate-100 p-3 space-y-2">
          <Shimmer width="50px" height="8px" />
          <Shimmer width="80px" height="14px" />
          <Shimmer width="100px" height="8px" />
        </div>

        <div className="rounded-xl bg-slate-100 p-3 space-y-2">
          <Shimmer width="50px" height="8px" />
          <Shimmer width="80px" height="14px" />
          <Shimmer width="100px" height="8px" />
        </div>
      </div>

      {/* Chips */}
      <div className="flex gap-2">
        <Shimmer width="80px" height="22px" rounded="lg" />
        <Shimmer width="100px" height="22px" rounded="lg" />
        <Shimmer width="90px" height="22px" rounded="lg" />
      </div>

      {/* Cash summary */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-2 border-b border-slate-200">
          <Shimmer width="110px" height="10px" />
        </div>

        <div className="p-3 space-y-2">
          <Shimmer width="100%" height="10px" />
          <Shimmer width="100%" height="10px" />
          <Shimmer width="100%" height="10px" />
        </div>
      </div>

      {/* Total sales */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Shimmer width="70px" height="8px" />
          <Shimmer width="110px" height="18px" />
        </div>

        <Shimmer width="90px" height="26px" rounded="lg" />
      </div>

      {/* Closed by */}
      <Shimmer width="150px" height="10px" />
    </div>
  );
}