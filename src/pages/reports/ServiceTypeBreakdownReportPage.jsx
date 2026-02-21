import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchServiceTypeBreakdownReport } from "../../redux/slices/reportSlice";
import PageHeader from "../../layout/PageHeader";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import { Utensils, Wine, Layers, BarChart3 } from "lucide-react";
import { formatNumber } from "../../utils/numberFormatter";
import ServiceTypeBreakdownReportSkeleton from "../../partial/report/ServiceTypeBreakdownReportSkeleton";

/* ---------------- Color Mapping (Safe for Tailwind) ---------------- */
const colorMap = {
  emerald: {
    bg: "bg-emerald-500",
    light: "bg-emerald-50",
    text: "text-emerald-600",
  },
  purple: {
    bg: "bg-purple-500",
    light: "bg-purple-50",
    text: "text-purple-600",
  },
  indigo: {
    bg: "bg-indigo-500",
    light: "bg-indigo-50",
    text: "text-indigo-600",
  },
};

/* ---------------- Breakdown Card ---------------- */
const BreakdownCard = ({ title, data, icon: Icon, color }) => {
  const styles = colorMap[color];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold mt-1">
            {formatNumber(data.gross_revenue, true)}
          </p>
        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${styles.bg}`}
        >
          <Icon className="text-white w-5 h-5" />
        </div>
      </div>

      {/* Percentage Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Contribution</span>
          <span className={styles.text}>{data.percentage}%</span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`${styles.bg} h-2 rounded-full transition-all duration-700`}
            style={{ width: `${data.percentage}%` }}
          />
        </div>
      </div>

      {/* Premium Stats Section */}
      <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
        <StatRow label="Quantity Sold" value={data.quantity} />
        <StatRow label="Orders" value={data.order_count} />
        <StatRow label="Unique Items" value={data.unique_items} />
        <StatRow label="Tax Collected" value={formatNumber(data.tax, true)} />
      </div>
    </div>
  );
};

/* ---------------- Small Stat Block ---------------- */
const StatRow = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between text-sm">
      <p className="text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
};
/* ---------------- Summary Card ---------------- */
const SummaryCard = ({ title, value, icon: Icon, gradient }) => (
  <div
    className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-md bg-gradient-to-br ${gradient}`}
  >
    <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full" />
    <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-white/10 rounded-full" />

    <div className="relative flex items-center justify-between">
      <div>
        <p className="text-xs opacity-80">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>

      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  </div>
);

/* ---------------- MAIN PAGE ---------------- */
const ServiceTypeBreakdownReportPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { serviceTypeBreakdownReport,isFetchingServiceTypeBreakdownReport } = useSelector((state) => state.report);
  const [dateRange, setDateRange] = useState();

  useEffect(() => {
    if (outletId) {
      dispatch(fetchServiceTypeBreakdownReport({ outletId,dateRange }));
    }
  }, [outletId,dateRange]);

  const summary = serviceTypeBreakdownReport?.summary;
  const breakdown = serviceTypeBreakdownReport?.breakdown;

  if (isFetchingServiceTypeBreakdownReport) {
  return <ServiceTypeBreakdownReportSkeleton />;
}

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <PageHeader title="Service Type Breakdown" />
        <CustomDateRangePicker
          value={dateRange}
          onChange={(newRange) => setDateRange(newRange)}
        />
      </div>

      {/* ---------------- SUMMARY SECTION ---------------- */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <SummaryCard
            title="Total Revenue"
            value={formatNumber(summary.total_revenue, true)}
            icon={BarChart3}
            gradient="from-indigo-500 to-indigo-600"
          />

          <SummaryCard
            title="Total Quantity"
            value={summary.total_quantity}
            icon={Layers}
            gradient="from-emerald-500 to-emerald-600"
          />

          <SummaryCard
            title="Restaurant Revenue"
            value={formatNumber(summary.restaurant_revenue, true)}
            icon={Utensils}
            gradient="from-blue-500 to-blue-600"
          />

          <SummaryCard
            title="Bar Revenue"
            value={formatNumber(summary.bar_revenue, true)}
            icon={Wine}
            gradient="from-purple-500 to-purple-600"
          />

          <SummaryCard
            title="Shared Revenue"
            value={formatNumber(summary.shared_revenue, true)}
            icon={Layers}
            gradient="from-amber-500 to-amber-600"
          />
        </div>
      )}

      {/* ---------------- BREAKDOWN SECTION ---------------- */}
      {breakdown && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <BreakdownCard
            title="Restaurant"
            data={breakdown.restaurant}
            icon={Utensils}
            color="emerald"
          />

          <BreakdownCard
            title="Bar"
            data={breakdown.bar}
            icon={Wine}
            color="purple"
          />

          <BreakdownCard
            title="Shared Orders"
            data={breakdown.both}
            icon={Layers}
            color="indigo"
          />
        </div>
      )}
    </div>
  );
};

export default ServiceTypeBreakdownReportPage;
