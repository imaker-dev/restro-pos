// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchDailySalesReport } from "../../redux/slices/reportSlice";
// import PageHeader from "../../layout/PageHeader";
// import CustomDateRangePicker from "../../components/CustomDateRangePicker";
// import { CalendarDays, Download, RotateCcw } from "lucide-react";
// import DailySalesCard from "../../partial/report/daily-sales-report/DailySalesCard";
// import NoDataFound from "../../layout/NoDataFound";
// import { handleResponse } from "../../utils/helpers";
// import { exportDailySalesReport } from "../../redux/slices/exportReportSlice";
// import { downloadBlob } from "../../utils/blob";
// import { formatFileDate } from "../../utils/dateFormatter";
// import CollectionBreakup from "../../partial/report/CollectionBreakup";
// import DailySalesCardSkeleton from "../../partial/report/daily-sales-report/DailySalesCardSkeleton";

// const DailySalesReportPage = () => {
//   const dispatch = useDispatch();

//   const { outletId } = useSelector((s) => s.auth);
//   const { dailySalesReport, isFetchingDailyReports } = useSelector(
//     (s) => s.report,
//   );
//   const { isExportingDailySalesReport } = useSelector(
//     (state) => state.exportReport,
//   );
//   const [dateRange, setDateRange] = useState();

//   const fetchReport = () => {
//     if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;

//     dispatch(fetchDailySalesReport({ outletId, dateRange }));
//   };

//   useEffect(() => {
//     fetchReport();
//   }, [dateRange, outletId]);

//   const report = dailySalesReport?.data || dailySalesReport || {};
//   const { daily = [], summary } = report;

//   const handleExportDailySalesReport = async () => {
//     if (!dateRange?.startDate || !dateRange?.endDate) return;

//     const fileName = `Daily-Sales-Report_${formatFileDate(
//       dateRange.startDate,
//     )}_to_${formatFileDate(dateRange.endDate)}`;

//     await handleResponse(
//       dispatch(exportDailySalesReport({ outletId, dateRange })),
//       (res) => {
//         downloadBlob({
//           data: res.payload,
//           fileName,
//         });
//       },
//     );
//   };

//   const actions = [
//     {
//       label: "Export",
//       type: "export",
//       icon: Download,
//       onClick: () => handleExportDailySalesReport(),
//       loading: isExportingDailySalesReport,
//       loadingText: "Exporting...",
//     },
//     {
//       label: "Refresh",
//       type: "refresh",
//       icon: RotateCcw,
//       onClick: fetchReport,
//       loading: isFetchingDailyReports,
//       loadingText: "Refreshing...",
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <PageHeader
//         title="Daily Sales Report"
//         // description="Performance metrics broken down day by day"
//         rightContent={
//           <CustomDateRangePicker value={dateRange} onChange={setDateRange} />
//         }
//         actions={actions}
//         showBackButton
//       />

//       <CollectionBreakup
//         collection={summary?.collection}
//         loading={isFetchingDailyReports}
//       />

//       {/* ── Daily rows ── */}
//       <div>
//         <div className="flex items-center justify-between mb-3">
//           <div className="flex items-center gap-2.5">
//             <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
//               <CalendarDays size={13} className="text-white" strokeWidth={2} />
//             </div>
//             <h2 className="text-[13px] font-black text-slate-800">
//               Daily Breakdown
//             </h2>
//           </div>
//           <span className="text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
//             {daily?.length} day{daily?.length !== 1 ? "s" : ""}
//           </span>
//         </div>

//         {isFetchingDailyReports ? (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//             {Array.from({ length: 4 }).map((_, i) => (
//               <DailySalesCardSkeleton key={i} />
//             ))}
//           </div>
//         ) : daily && daily.length > 0 ? (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//             {daily.map((day) => (
//               <DailySalesCard key={day.report_date} day={day} />
//             ))}
//           </div>
//         ) : (
//           <NoDataFound
//             icon={CalendarDays}
//             title="No daily data"
//             description="No sales found for the selected range"
//             className="bg-white rounded-2xl border border-dashed border-slate-200 py-20"
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default DailySalesReportPage;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDailySalesReport } from "../../redux/slices/reportSlice";
import PageHeader from "../../layout/PageHeader";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import {
  Download,
  RotateCcw,
  TrendingUp,
  Receipt,
  Users,
  ArrowUpRight,
  UtensilsCrossed,
  ShoppingBag,
  Bike,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { formatDate, formatFileDate } from "../../utils/dateFormatter";
import { handleResponse } from "../../utils/helpers";
import { exportDailySalesReport } from "../../redux/slices/exportReportSlice";
import { downloadBlob } from "../../utils/blob";
import { formatNumber } from "../../utils/numberFormatter";
import StatCard from "../../components/StatCard";
import DailySalesSummaryBreakup from "../../partial/report/daily-sales-report/DailySalesSummaryBreakup";
import DailySalesSummaryCard from "../../partial/report/daily-sales-report/DailySalesSummaryCard";

/* ── helpers ── */
const fmt = (n) => formatNumber(n, true);
const fmtN = (n) => Number(n || 0).toLocaleString("en-IN");

/* ── OrderTypePill ── */
function Pill({ icon: Icon, label, count, color }) {
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

/* ── PaymentStatusRow ── */
function PayStatusRow({ icon: Icon, label, count, color }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${color}`}>
      <Icon size={12} className="shrink-0" />
      <span className="text-xs font-medium flex-1">{label}</span>
      <span className="text-xs font-bold">{fmtN(count)}</span>
    </div>
  );
}

/* ── Main Page ── */
const DailySalesReportPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((s) => s.auth);
  const { dailySalesReport, isFetchingDailyReports } = useSelector(
    (s) => s.report,
  );
  const { isExportingDailySalesReport } = useSelector((s) => s.exportReport);
  const [dateRange, setDateRange] = useState();

  const fetchReport = () => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;
    dispatch(fetchDailySalesReport({ outletId, dateRange }));
  };

  useEffect(() => {
    fetchReport();
  }, [dateRange, outletId]);

  const handleExport = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;
    const fileName = `Daily-Sales-Report_${formatFileDate(dateRange.startDate)}_to_${formatFileDate(dateRange.endDate)}`;
    await handleResponse(
      dispatch(exportDailySalesReport({ outletId, dateRange })),
      (res) => downloadBlob({ data: res.payload, fileName }),
    );
  };

  const actions = [
    // {
    //   label: "Export",
    //   type: "export",
    //   icon: Download,
    //   onClick: handleExport,
    //   loading: isExportingDailySalesReport,
    //   loadingText: "Exporting...",
    // },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchReport,
      loading: isFetchingDailyReports,
      loadingText: "Refreshing...",
    },
  ];

  const {
    summary,
    daily,
    dateRange: dr,
    orders,
    crossVerification,
  } = dailySalesReport || {};

  const dayCount = daily?.length || 0;

  const stats = [
    {
      icon: TrendingUp,
      label: "Total sales",
      value: fmt(summary?.total_sale),
      sub: `avg ${fmt(summary?.average_order_value)} / order`,
      accent: "green",
    },
    {
      icon: Receipt,
      label: "Total orders",
      value: fmtN(summary?.total_orders),
      sub: `${dayCount} days`,
      accent: "blue",
    },
    {
      icon: Users,
      label: "Total guests",
      value: fmtN(summary?.total_guests),
      accent: "violet",
    },
    {
      icon: ArrowUpRight,
      label: "Avg / day",
      value: fmt(summary?.total_sale / (dayCount || 1)),
      sub: "daily average",
      accent: "amber",
    },
  ];

  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Sales Report"
        description={
          dr
            ? `${formatDate(dr.start, "long")} — ${formatDate(dr.end, "long")} · ${dayCount} day${dayCount !== 1 ? "s" : ""}`
            : "Select a date range to view report"
        }
        rightContent={
          <CustomDateRangePicker value={dateRange} onChange={setDateRange} />
        }
        actions={actions}
        showBackButton
      />

      {/* body */}
      {!dailySalesReport && !isFetchingDailyReports ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Calendar size={20} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-500">
            Select a date range to get started
          </p>
          <p className="text-xs text-gray-400">
            Your daily sales report will appear here
          </p>
        </div>
      ) : isFetchingDailyReports ? (
        <div className="px-4 md:px-6 py-6 space-y-4 max-w-5xl mx-auto">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-white border border-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* ── Summary stats ── */}
          {summary && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stats?.map((stat, index) => (
                  <StatCard
                    key={index}
                    icon={stat?.icon}
                    title={stat?.label}
                    value={stat?.value}
                    subtitle={stat?.sub}
                    color={stat?.accent}
                    variant="v9"
                  />
                ))}
              </div>

              {/* order types strip */}
              <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3.5 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-gray-400 mr-1">
                  Order types
                </span>
                <Pill
                  icon={UtensilsCrossed}
                  label="Dine-in"
                  count={summary.dine_in_orders}
                  color="bg-blue-50 text-blue-600"
                />
                <Pill
                  icon={ShoppingBag}
                  label="Takeaway"
                  count={summary.takeaway_orders}
                  color="bg-violet-50 text-violet-600"
                />
                {summary.delivery_orders > 0 && (
                  <Pill
                    icon={Bike}
                    label="Delivery"
                    count={summary.delivery_orders}
                    color="bg-orange-50 text-orange-500"
                  />
                )}
                <div className="ml-auto flex items-center gap-2">
                  <PayStatusRow
                    icon={CheckCircle}
                    label="Paid"
                    count={summary.fully_paid_orders}
                    color="bg-emerald-50 text-emerald-600"
                  />
                  <PayStatusRow
                    icon={Clock}
                    label="Partial"
                    count={summary.partial_paid_orders}
                    color="bg-amber-50 text-amber-600"
                  />
                  {summary.unpaid_orders > 0 && (
                    <PayStatusRow
                      icon={XCircle}
                      label="Unpaid"
                      count={summary.unpaid_orders}
                      color="bg-red-50 text-red-500"
                    />
                  )}
                </div>
              </div>

              {/* price breakup accordion */}
              <DailySalesSummaryBreakup summary={summary} />
            </div>
          )}

          {/* ── Day-wise ── */}
          {daily && daily.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-0.5">
                <Calendar size={13} className="text-gray-400" />
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Day-wise breakdown
                </p>
              </div>
              <div className="space-y-2">
                {[...daily]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((day) => (
                    <DailySalesSummaryCard key={day.date} day={day} />
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DailySalesReportPage;
