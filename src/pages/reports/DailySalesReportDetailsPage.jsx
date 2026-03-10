import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../../hooks/useQueryParams";
import { fetchDailySalesReportByDate } from "../../redux/slices/reportSlice";
import {
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  CheckCircle2,
  Tag,
  BarChart2,
  Wallet,
  CalendarDays,
  Download,
} from "lucide-react";
import { formatDate, formatFileDate } from "../../utils/dateFormatter";
import { formatNumber, num } from "../../utils/numberFormatter";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import PayRow from "../../partial/report/daily-sales-report/PayRow";
import OrderTypeBar from "../../partial/report/daily-sales-report/OrderTypeBar";
import StatCard from "../../components/StatCard";
import SmartTable from "../../components/SmartTable";
import Pagination from "../../components/Pagination";
import { getOrderTableConfig } from "../../columns/order.columns";
import PageHeader from "../../layout/PageHeader";
import { handleResponse } from "../../utils/helpers";
import { exportDailySalesReportDetails } from "../../redux/slices/exportReportSlice";
import { downloadBlob } from "../../utils/blob";
import DailySalesDetailsPageSkeleton from "../../partial/report/daily-sales-report/DailySalesDetailsPageSkeleton";


// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const DailySalesReportDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { date } = useQueryParams();
  const { outletId } = useSelector((s) => s.auth);
  const { isExportingDailySalesReportDetails } = useSelector(
    (s) => s.exportReport,
  );
  const { dailySalesReportDetails, isFetchingDailyReportDetails } = useSelector(
    (s) => s.report,
  );
  const { summary, orders = [], pagination } = dailySalesReportDetails || {};

  const { columns, actions: rowActions } = getOrderTableConfig(navigate);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (date)
      dispatch(
        fetchDailySalesReportByDate({
          outletId,
          date,
          page: currentPage,
          limit: itemsPerPage,
        }),
      );
  }, [outletId, date, currentPage]);

  const totalPay = Object.values(summary?.paymentModeBreakdown || {}).reduce(
    (s, v) => s + num(v),
    0,
  );

  const displayDate = date
    ? new Date(date).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  const kpiStats = [
    {
      label: "Gross Sales",
      value: formatNumber(summary?.grossSales, true),
      sub: "Before discounts",
      icon: IndianRupee,
      color: "slate",
      dark: true,
    },
    {
      label: "Net Sales",
      value: formatNumber(summary?.netSales, true),
      sub: "After discounts",
      icon: TrendingUp,
      color: "green",
    },
    {
      label: "Total Tax",
      value: formatNumber(summary?.totalTax, true),
      sub: "Tax collected",
      icon: Tag,
      color: "orange",
    },
    {
      label: "Total Paid",
      value: formatNumber(summary?.totalPaid, true),
      sub: "Payments received",
      icon: CheckCircle2,
      color: "blue",
    },
  ];

  if (isFetchingDailyReportDetails) {
    return <DailySalesDetailsPageSkeleton />;
  }

  const handleExportDailySalesReportDetails = async () => {
    if (!date) return;

    const fileName = `Daily-Sales-Report_${formatFileDate(date)}`;

    await handleResponse(
      dispatch(exportDailySalesReportDetails({ outletId, date })),
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
      onClick: () => handleExportDailySalesReportDetails(),
      loading: isExportingDailySalesReportDetails,
      loadingText: "Exporting...",
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Daily Sales Report Details - ${formatDate(date, "long")}`}
        actions={actions}
        showBackButton
      />

      {/* ── UNIVERSAL HERO ── */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))",
        }}
      >
        {/* Soft highlight line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          }}
        />

        {/* Soft radial glow */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />

        <div className="relative z-10 px-5 py-4 text-white">
          {/* Top Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/15 border border-white/20 backdrop-blur">
                <CalendarDays size={18} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-semibold text-white/70 uppercase tracking-wider">
                  Daily Sales Report
                </p>

                <h1 className="text-[18px] font-bold leading-tight truncate">
                  {displayDate}
                </h1>

                <p className="text-[11px] text-white/75 mt-1 truncate">
                  {formatNumber(summary?.totalOrders)} orders ·{" "}
                  {formatNumber(summary?.completedOrders)} completed ·{" "}
                  {formatNumber(summary?.activeOrders)} active
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="sm:text-right flex-shrink-0">
              <p className="text-[9px] font-semibold text-white/70 uppercase tracking-wide">
                Net Sales
              </p>

              <p className="text-[28px] font-bold tabular-nums leading-none">
                {formatNumber(summary?.netSales, true)}
              </p>

              <p className="text-[11px] text-white/70 mt-1">
                Gross {formatNumber(summary?.grossSales, true)}
              </p>
            </div>
          </div>

          {/* Metric Strip */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              {
                icon: ShoppingBag,
                label: "Orders",
                value: formatNumber(summary?.totalOrders),
                sub: `${formatNumber(summary?.cancelledOrders)} cancelled`,
              },
              {
                icon: IndianRupee,
                label: "Paid",
                value: formatNumber(summary?.totalPaid, true),
                sub: "Collected",
              },
              {
                icon: TrendingUp,
                label: "Avg",
                value: formatNumber(summary?.averageOrderValue, true),
                sub: "Per order",
              },
            ].map(({ icon: Icon, label, value, sub }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm"
              >
                <Icon size={13} strokeWidth={2} />

                <div className="min-w-0">
                  <p className="text-[9px] font-semibold text-white/70 uppercase tracking-wide">
                    {label}
                  </p>
                  <p className="text-[14px] font-bold tabular-nums leading-none">
                    {value}
                  </p>
                  <p className="text-[9px] text-white/70 truncate">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4 KPI TILES ── */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        style={{ animationDelay: "80ms" }}
      >
        {kpiStats.map((stat, index) => (
          <StatCard
            key={stat.label}
            dark={stat.dark}
            icon={stat.icon}
            title={stat.label}
            value={stat.value}
            subtitle={stat.sub}
            color={stat.color}
            mode={stat.dark ? "solid" : ""}
            variant="v9"
          />
        ))}
      </div>

      {/* ── PAYMENT + ORDER TYPE ── */}
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payment breakdown */}
        <MetricPanel
          icon={Wallet}
          title="Payment Collection"
          right={
            <span className="text-[13px] font-black text-slate-900 tabular-nums">
              {formatNumber(totalPay, true)}
            </span>
          }
        >
          {Object.entries(summary?.paymentModeBreakdown || {})
            .sort((a, b) => num(b[1]) - num(a[1]))
            .map(([mode, amount]) => (
              <PayRow key={mode} type={mode} amount={amount} total={totalPay} />
            ))}

          {Object.keys(summary?.paymentModeBreakdown || {}).length === 0 && (
            <p className="text-[12px] text-slate-400 text-center py-6">
              No payment data
            </p>
          )}
        </MetricPanel>

        {/* Order type breakdown */}
        <MetricPanel
          icon={BarChart2}
          title="Orders by Type"
          right={
            <span className="text-[13px] font-black text-slate-900 tabular-nums">
              {num(summary?.totalOrders)} total
            </span>
          }
        >
          {Object.entries(summary?.orderTypeBreakdown || {})
            .filter(([_, count]) => num(count) > 0)
            .map(([type, count]) => (
              <OrderTypeBar
                key={type}
                type={type}
                value={count}
                total={summary?.totalOrders}
              />
            ))}

          {num(summary?.cancelledOrders) > 0 && (
            <OrderTypeBar
              type="cancelled"
              value={summary?.cancelledOrders}
              total={summary?.totalOrders}
            />
          )}

          {Object.keys(summary?.orderTypeBreakdown || {}).length === 0 && (
            <p className="text-[12px] text-slate-400 text-center py-6">
              No order type data
            </p>
          )}
        </MetricPanel>
      </div>

      <SmartTable
        title="Orders"
        totalcount={pagination?.totalCount}
        data={orders}
        columns={columns}
        loading={isFetchingDailyReportDetails}
        actions={rowActions}
      />

      <Pagination
        totalItems={pagination?.totalCount}
        currentPage={currentPage}
        pageSize={itemsPerPage}
        totalPages={pagination?.totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        maxPageNumbers={5}
        showPageSizeSelector={true}
        onPageSizeChange={(size) => {
          setCurrentPage(1);
          setItemsPerPage(size);
        }}
      />
    </div>
  );
};

export default DailySalesReportDetailsPage;
