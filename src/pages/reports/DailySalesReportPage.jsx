import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDailySalesReport } from "../../redux/slices/reportSlice";
import PageHeader from "../../layout/PageHeader";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import {
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  Users,
  Banknote,
  Smartphone,
  CreditCard,
  BarChart2,
  Eye,
  ChevronRight,
  CalendarDays,
  Wallet,
  Tag,
  Download,
  RotateCcw,
} from "lucide-react";
import { formatNumber, num } from "../../utils/numberFormatter";
import StatCard from "../../components/StatCard";
import DailySalesCard from "../../partial/report/daily-sales-report/DailySalesCard";
import LoadingOverlay from "../../components/LoadingOverlay";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import OrderTypeBar from "../../partial/report/daily-sales-report/OrderTypeBar";
import PayRow from "../../partial/report/daily-sales-report/PayRow";
import NoDataFound from "../../layout/NoDataFound";
import { handleResponse } from "../../utils/helpers";
import { exportDailySalesReport } from "../../redux/slices/exportReportSlice";
import { downloadBlob } from "../../utils/blob";
import { formatDate, formatFileDate } from "../../utils/dateFormatter";
import DailySalesReportSkeleton from "../../partial/report/daily-sales-report/DailySalesReportSkeleton";

const DailySalesReportPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((s) => s.auth);
  const { dailySalesReport, isFetchingDailyReports } = useSelector(
    (s) => s.report,
  );
  const { isExportingDailySalesReport } = useSelector(
    (state) => state.exportReport,
  );
  const [dateRange, setDateRange] = useState();

  const fetchReport = () => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;

    dispatch(fetchDailySalesReport({ outletId, dateRange }));
  };

  useEffect(() => {
    fetchReport();
  }, [dateRange, outletId]);

  const report = dailySalesReport?.data || dailySalesReport || {};
  const { daily = [], summary } = report;

  const totalColl = num(summary?.total_collection);

  const stats = [
    {
      label: "Gross Sales",
      value: formatNumber(summary?.gross_sales, true),
      sub: "Before discounts",
      icon: IndianRupee,
      color: "slate",
      dark: true,
    },
    {
      label: "Net Sales",
      value: formatNumber(summary?.net_sales, true),
      sub: "After discounts",
      icon: TrendingUp,
      color: "green",
    },
    {
      label: "Total Discount",
      value: formatNumber(summary?.discount_amount, true),
      sub: "Savings given",
      icon: Tag,
      color: "orange",
    },
    {
      label: "Total Tax",
      value: formatNumber(summary?.tax_amount, true),
      sub: "Tax collected",
      icon: BarChart2,
      color: "blue",
    },
    {
      label: "Total Orders",
      value: formatNumber(summary?.total_orders),
      sub: formatNumber(summary?.cancelled_orders) + " cancelled",
      icon: ShoppingBag,
      color: "slate",
    },
    {
      label: "Total Guests",
      value: formatNumber(summary?.total_guests),
      sub: "Covers served",
      icon: Users,
      color: "purple",
    },
    {
      label: "Avg Order",
      value: formatNumber(summary?.average_order_value, true),
      sub: "Per order value",
      icon: TrendingUp,
      color: "green",
    },
    {
      label: "Avg Daily",
      value: formatNumber(summary?.average_daily_sales, true),
      sub: "Over " + formatNumber(summary?.total_days) + " days",
      icon: CalendarDays,
      color: "blue",
    },
  ];

  if (isFetchingDailyReports) {
    return <DailySalesReportSkeleton />;
  }

  const handleExportDailySalesReport = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    const fileName = `Daily-Sales-Report_${formatFileDate(
      dateRange.startDate,
    )}_to_${formatFileDate(dateRange.endDate)}`;

    await handleResponse(
      dispatch(exportDailySalesReport({ outletId, dateRange })),
      (res) => {
        downloadBlob({
          data: res.payload,
          fileName,
        });
      },
    );
  };

  const actions = [
    {
      label: "Export",
      type: "export",
      icon: Download,
      onClick: () => handleExportDailySalesReport(),
      loading: isExportingDailySalesReport,
      loadingText: "Exporting...",
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchReport,
      loading: isFetchingDailyReports,
      loadingText: "Refreshing...",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Daily Sales Report"
        description="Performance metrics broken down day by day"
        rightContent={
          <CustomDateRangePicker value={dateRange} onChange={setDateRange} />
        }
        actions={actions}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            icon={stat.icon}
            title={stat.label}
            value={stat.value}
            // subtitle={stat.sub}
            color={stat.color}
            mode={stat.dark ? "solid" : ""}
            variant="v9"
          />
        ))}
      </div>

      {/* ── Collection + Order types ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Collection */}
        <MetricPanel
          icon={Wallet}
          title="Total Collection"
          right={
            <span className="text-[13px] font-black text-slate-900 tabular-nums">
              {formatNumber(summary?.total_collection, true)}
            </span>
          }
        >
          <PayRow
            type="cash"
            amount={summary?.cash_collection}
            total={totalColl}
          />
          <PayRow
            type="card"
            amount={summary?.card_collection}
            total={totalColl}
          />
          <PayRow
            type="upi"
            amount={summary?.upi_collection}
            total={totalColl}
          />
          <PayRow
            type="wallet"
            amount={summary?.wallet_collection}
            total={totalColl}
          />
          <PayRow
            type="credit"
            amount={summary?.credit_collection}
            total={totalColl}
          />
        </MetricPanel>

        <MetricPanel
          icon={ShoppingBag}
          title="Orders by Type"
          right={
            <span className="text-[13px] font-black text-slate-900 tabular-nums">
              {num(summary?.total_orders)} total
            </span>
          }
        >
          <OrderTypeBar
            type="dine_in"
            value={summary?.dine_in_orders}
            total={summary?.total_orders}
          />

          <OrderTypeBar
            type="takeaway"
            value={summary?.takeaway_orders}
            total={summary?.total_orders}
          />

          <OrderTypeBar
            type="delivery"
            value={summary?.delivery_orders}
            total={summary?.total_orders}
          />

          <OrderTypeBar
            type="cancelled"
            value={summary?.cancelled_orders}
            total={summary?.total_orders}
          />
        </MetricPanel>
      </div>

      {/* ── Daily rows ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
              <CalendarDays size={13} className="text-white" strokeWidth={2} />
            </div>
            <h2 className="text-[13px] font-black text-slate-800">
              Daily Breakdown
            </h2>
          </div>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
            {daily?.length} day{daily?.length !== 1 ? "s" : ""}
          </span>
        </div>

        {daily?.length === 0 ? (
          <NoDataFound
            icon={CalendarDays}
            title="No daily data"
            description="No sales found for the selected range"
            className="bg-white rounded-2xl border border-dashed border-slate-200 py-20"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {daily?.map((day, i) => (
              <DailySalesCard key={day.report_date} day={day} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailySalesReportPage;
