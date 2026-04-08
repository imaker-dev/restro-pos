import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDailyEndSummary } from "../../redux/slices/dashboardSlice";
import { formatDate, formatFileDate } from "../../utils/dateFormatter";
import { handleResponse } from "../../utils/helpers";
import { exportDayEndSummary } from "../../redux/slices/exportReportSlice";
import { downloadBlob } from "../../utils/blob";
import {
  Download,
  RotateCcw,
  TrendingUp,
  Users,
  AlertCircle,
  UtensilsCrossed,
  ShoppingBag,
  Bike,
  ArrowUpRight,
  Receipt,
  Calendar,
} from "lucide-react";
import PageHeader from "../../layout/PageHeader";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import StatCard from "../../components/StatCard";
import DayEndCard from "../../partial/report/day-end-summary-report/DayEndCard";
import DayEndCollectionSummaryCard from "../../partial/report/day-end-summary-report/DayEndCollectionSummaryCard";

/* ─── helpers ─── */
const fmt = (n) =>
  "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
const fmtN = (n) => Number(n || 0).toLocaleString("en-IN");

/* ─── sub-components ─── */

function OrderTypePill({ icon: Icon, label, count, color }) {
  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl ${color}`}
    >
      <Icon size={11} />
      <span className="text-xs font-medium">{label}</span>
      <span className="text-xs font-bold">{count}</span>
    </div>
  );
}

/* ─── main page ─── */
const DayEndSummaryPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { isExportingDayEndSummary } = useSelector(
    (state) => state.exportReport,
  );
  const { dailyEndSummary, isFetchingDailyEndSummary } = useSelector(
    (state) => state.dashboard,
  );
  const { grandTotal, days, dateRange, dayCount } = dailyEndSummary || {};

  const [dateRangeState, setDateRangeState] = useState(null);

  const fetchReport = () => {
    dispatch(fetchDailyEndSummary({ outletId, dateRange: dateRangeState }));
  };

  useEffect(() => {
    if (!outletId || !dateRangeState?.startDate || !dateRangeState?.endDate)
      return;
    fetchReport();
  }, [dateRangeState, outletId]);

  const handleExport = async () => {
    if (!dateRangeState?.startDate || !dateRangeState?.endDate) return;
    const fileName = `Day-End-Summary-Report_${formatFileDate(dateRangeState.startDate)}_to_${formatFileDate(dateRangeState.endDate)}`;
    await handleResponse(
      dispatch(exportDayEndSummary({ outletId, dateRange: dateRangeState })),
      (res) => downloadBlob({ data: res.payload, fileName }),
    );
  };

  const actions = [
    // {
    //   label: "Export",
    //   icon: Download,
    //   onClick: handleExport,
    //   loading: isExportingDayEndSummary,
    //   loadingText: "Exporting...",
    // },
    {
      label: "Refresh",
      icon: RotateCcw,
      onClick: fetchReport,
      loading: isFetchingDailyEndSummary,
      loadingText: "Refreshing...",
    },
  ];

  const stats = [
    {
      icon: TrendingUp,
      label: "Total sales",
      value: fmt(grandTotal?.total_sale),
      sub: `avg ${fmt(grandTotal?.average_order_value)} / order`,
      accent: "green",
    },
    {
      icon: Receipt,
      label: "Total orders",
      value: fmtN(grandTotal?.total_orders),
      sub: `${dayCount} days`,
      accent: "blue",
    },
    {
      icon: Users,
      label: "Total guests",
      value: fmtN(grandTotal?.total_guests),
      accent: "violet",
    },
    {
      icon: ArrowUpRight,
      label: "Avg/day",
      value: fmt(grandTotal?.total_sale / (dayCount || 1)),
      sub: "daily average",
      accent: "amber",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Day End Summary"
        description={
          dateRange
            ? `${formatDate(dateRange.start, "long")} — ${formatDate(dateRange.end, "long")} (${dayCount} days)`
            : "Select a date range to view summary"
        }
        rightContent={
          <CustomDateRangePicker
            value={dateRangeState}
            onChange={setDateRangeState}
          />
        }
        actions={actions}
      />

      {/* Body */}
      {!dailyEndSummary && !isFetchingDailyEndSummary ? (
        /* empty state */
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Calendar size={20} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-500">
            Select a date range to get started
          </p>
          <p className="text-xs text-gray-400">
            Your day end summary will appear here
          </p>
        </div>
      ) : isFetchingDailyEndSummary ? (
        /* skeleton */
        <div className="px-4 md:px-6 py-6 space-y-4 max-w-5xl mx-auto">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-white border border-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* ── Grand Total stats ── */}
          {grandTotal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stats?.map((stat, index) => (
                  <StatCard
                    key={index}
                    icon={stat.icon}
                    title={stat.label}
                    value={stat.value}
                    subtitle={stat.sub}
                    color={stat.accent}
                    variant="v9"
                  />
                ))}
              </div>

              {/* order type strip */}
              <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3.5 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-gray-400 mr-1">
                  Order types
                </span>
                <OrderTypePill
                  icon={UtensilsCrossed}
                  label="Dine-in"
                  count={grandTotal.ordersByType.dine_in}
                  color="bg-blue-50 text-blue-600"
                />
                <OrderTypePill
                  icon={ShoppingBag}
                  label="Takeaway"
                  count={grandTotal.ordersByType.takeaway}
                  color="bg-violet-50 text-violet-600"
                />
                <OrderTypePill
                  icon={Bike}
                  label="Delivery"
                  count={grandTotal.ordersByType.delivery}
                  color="bg-orange-50 text-orange-500"
                />
                {grandTotal.nc_orders > 0 && (
                  <OrderTypePill
                    icon={AlertCircle}
                    label="NC"
                    count={grandTotal.nc_orders}
                    color="bg-amber-50 text-amber-500"
                  />
                )}
              </div>

              {/* price breakup accordion */}
              <DayEndCollectionSummaryCard grandTotal={grandTotal} />
            </div>
          )}

          {/* ── Day-wise breakdown ── */}
          {days && days.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-0.5">
                <Calendar size={13} className="text-gray-400" />
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Day-wise breakdown
                </p>
              </div>
              <div className="space-y-2">
                {[...days]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((day) => (
                    <DayEndCard key={day.date} day={day} />
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DayEndSummaryPage;
