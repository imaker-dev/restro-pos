import React from "react";
import Shimmer from "../../../layout/Shimmer";

export default function ShiftHistoryDetailsPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shimmer width="36px" height="36px" rounded="lg" />
          <Shimmer width="220px" height="20px" />
        </div>

        <Shimmer width="120px" height="36px" rounded="lg" />
      </div>

      {/* HERO */}
      <div className="rounded-2xl bg-slate-200 p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shimmer width="48px" height="48px" rounded="lg" />

            <div className="space-y-2">
              <Shimmer width="160px" height="16px" />
              <Shimmer width="220px" height="10px" />
            </div>
          </div>

          <div className="space-y-2 text-right">
            <Shimmer width="90px" height="10px" />
            <Shimmer width="120px" height="26px" />
            <Shimmer width="100px" height="10px" />
          </div>
        </div>

        {/* Hero metrics */}
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white/40 rounded-lg p-3"
            >
              <Shimmer width="20px" height="20px" rounded="full" />
              <div className="space-y-1">
                <Shimmer width="60px" height="8px" />
                <Shimmer width="80px" height="12px" />
                <Shimmer width="70px" height="8px" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricPanelSkeleton rows={3} />
            <MetricPanelSkeleton rows={4} />
          </div>

          <MetricPanelSkeleton rows={6} />
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-4">
          <MetricPanelSkeleton rows={4} />
          <MetricPanelSkeleton rows={3} />
          <MetricPanelSkeleton rows={2} />
        </div>
      </div>
    </div>
  );
}

/* KPI Skeleton */

function StatSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="flex justify-between mb-3">
        <Shimmer width="80px" height="10px" />
        <Shimmer width="24px" height="24px" rounded="full" />
      </div>

      <Shimmer width="100px" height="18px" />

      <div className="mt-2">
        <Shimmer width="90px" height="10px" />
      </div>
    </div>
  );
}

/* Metric Panel Skeleton */

function MetricPanelSkeleton({ rows }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
      <Shimmer width="150px" height="14px" />

      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex justify-between">
          <Shimmer width="120px" height="10px" />
          <Shimmer width="80px" height="10px" />
        </div>
      ))}
    </div>
  );
}
