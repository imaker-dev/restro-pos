import React from "react";
import Shimmer from "../../../layout/Shimmer";

export default function DailySalesReportSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <Shimmer width="220px" height="26px" />
          <div className="mt-2">
            <Shimmer width="320px" height="12px" />
          </div>
        </div>

        <div className="flex gap-2">
          <Shimmer width="150px" height="36px" rounded="lg" />
          <Shimmer width="110px" height="36px" rounded="lg" />
          <Shimmer width="110px" height="36px" rounded="lg" />
        </div>
      </div>

      {/* Sales Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>

      {/* Metric Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricPanelSkeleton rows={5} />
        <MetricPanelSkeleton rows={4} />
      </div>

      {/* Daily Breakdown Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shimmer width="28px" height="28px" rounded="lg" />
          <Shimmer width="140px" height="14px" />
        </div>

        <Shimmer width="60px" height="20px" rounded="full" />
      </div>

      {/* Daily Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <DailySalesCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────── */
/* Stat Card Skeleton */
/* ───────────────────────────────────────── */

function StatSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="flex justify-between mb-3">
        <Shimmer width="80px" height="10px" />
        <Shimmer width="24px" height="24px" rounded="full" />
      </div>

      <Shimmer width="110px" height="18px" />

      <div className="mt-2">
        <Shimmer width="90px" height="10px" />
      </div>
    </div>
  );
}

/* ───────────────────────────────────────── */
/* Metric Panel Skeleton */
/* ───────────────────────────────────────── */

function MetricPanelSkeleton({ rows }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4">
      <div className="flex justify-between items-center">
        <Shimmer width="140px" height="14px" />
        <Shimmer width="80px" height="14px" />
      </div>

      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <Shimmer width="100px" height="10px" />
          <Shimmer width="120px" height="8px" />
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────────────────────── */
/* Daily Sales Card Skeleton */
/* ───────────────────────────────────────── */

function DailySalesCardSkeleton() {
  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
      style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}
    >
      {/* Accent bar */}
      <div className="h-[3px] bg-slate-200" />

      <div className="flex items-stretch">
        {/* Date column */}
        <div
          className="flex flex-col items-center justify-center gap-1 w-16"
          style={{ background: "linear-gradient(170deg,#0f172a,#1e293b)" }}
        >
          <Shimmer width="28px" height="8px" rounded="full" />
          <Shimmer width="30px" height="22px" rounded="md" />
          <Shimmer width="28px" height="8px" rounded="full" />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2 w-full">
              <Shimmer width="180px" height="14px" />

              <div className="flex gap-2">
                <Shimmer width="70px" height="18px" rounded="full" />
                <Shimmer width="80px" height="18px" rounded="full" />
                <Shimmer width="65px" height="18px" rounded="full" />
              </div>
            </div>

            <Shimmer width="70px" height="28px" rounded="lg" />
          </div>

          <div className="h-px bg-slate-100" />

          {/* Metrics */}
          <div className="grid grid-cols-3 sm:flex gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1 sm:px-4">
                <Shimmer width="60px" height="8px" />
                <Shimmer width="70px" height="14px" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50">
        <div className="flex flex-wrap gap-3">
          <Shimmer width="90px" height="12px" />
          <Shimmer width="80px" height="12px" />
          <Shimmer width="70px" height="12px" />
          <Shimmer width="60px" height="12px" />
        </div>
      </div>
    </div>
  );
}