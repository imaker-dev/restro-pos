// import { use, useEffect, useState } from "react";
// import {
//   ArrowLeft,
//   ShoppingCart,
//   Users,
//   DollarSign,
//   Clock,
//   Phone,
//   MapPin,
//   CheckCircle,
//   AlertCircle,
//   Utensils,
//   Wine,
//   Package,
//   Percent,
//   CreditCard,
//   Banknote,
//   QrCode,
//   Wallet,
//   Eye,
// } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { useQueryParams } from "../../hooks/useQueryParams";
// import { fetchDailySalesReportByDate } from "../../redux/slices/reportSlice";
// import SalesSummary from "../../partial/report/SalesSummary";
// import Pagination from "../../components/Pagination";
// import PageHeader from "../../layout/PageHeader";
// import { formatDate } from "../../utils/dateFormatter";
// import SmartTable from "../../components/SmartTable";
// import { formatNumber } from "../../utils/numberFormatter";
// import DailySalesDetailsPageSkeleton from "../../partial/report/DailySalesDetailsPageSkeleton";
// import OrderBadge from "../../partial/order/OrderBadge";

// export default function DailySalesReportDetailsPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { date } = useQueryParams();

//   const { outletId } = useSelector((state) => state.auth);

//   const { dailySalesReportDetails: data, isFetchingDailyReportDetails } =
//     useSelector((state) => state.report);
//   const { summary, orders, pagination } = data || {};

//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   useEffect(() => {
//     dispatch(
//       fetchDailySalesReportByDate({
//         outletId,
//         date,
//         page: currentPage,
//         limit: itemsPerPage,
//       }),
//     );
//   }, [outletId, date, currentPage, itemsPerPage]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [date]);

//   const columns = [
//     {
//       key: "orderNumber",
//       label: "Order",
//       render: (row) => {
//         const isDineIn = row.orderType === "dine_in";

//         return (
//           <div className="max-w-[220px] space-y-0.5">
//             {/* Order Number */}
//             <p className="font-semibold text-sm text-slate-900 tracking-tight">
//               #{row.orderNumber}
//             </p>

//             {/* Meta */}
//             {isDineIn ? (
//               <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
//                 <span className="bg-slate-100 text-slate-700 px-1.5 py-[1px] rounded font-medium">
//                   {row.floorName || "—"}
//                 </span>

//                 <span className="text-slate-300">•</span>

//                 <span>
//                   {" "}
//                   <span className="font-medium text-slate-700">
//                     {row.tableNumber || "—"}
//                   </span>
//                 </span>
//               </div>
//             ) : (
//               <span className="text-[11px] font-medium text-slate-500">
//                 {row.orderType === "takeaway"
//                   ? "Takeaway"
//                   : row.orderType === "delivery"
//                     ? "Delivery"
//                     : "Unknown"}
//               </span>
//             )}
//           </div>
//         );
//       },
//     },

//     {
//       key: "orderType",
//       label: "Type",
//       render: (row) => (
//         <OrderBadge type="type" value={row.orderType} size="sm" />
//       ),
//     },

//     {
//       key: "status",
//       label: "Status",
//       render: (row) => (
//         <OrderBadge type="status" value={row.status} size="sm" />
//       ),
//     },

//     {
//       key: "paymentStatus",
//       label: "Payment",
//       render: (row) => (
//         <OrderBadge type="payment" value={row.paymentStatus} size="sm" />
//       ),
//     },

//     {
//       key: "items",
//       label: "Items",
//       sortable: false,
//       render: (row) => (
//         <span className="font-semibold text-sm text-slate-800 tabular-nums">
//           {row.items?.totalCount ?? 0}
//         </span>
//       ),
//     },

//     {
//       key: "guests",
//       label: "Guests",
//       render: (row) => (
//         <span className="font-medium text-sm text-slate-700 tabular-nums">
//           {row.guestCount ?? 0}
//         </span>
//       ),
//     },

//     {
//       key: "captain",
//       label: "Captain",
//       render: (row) => (
//         <span className="text-xs text-slate-600 font-medium">
//           {row.captainName || "—"}
//         </span>
//       ),
//     },

//     {
//       key: "amount",
//       label: "Total",
//       render: (row) => (
//         <span className="font-semibold text-sm text-slate-900 tabular-nums">
//           {formatNumber(row.totalAmount ?? 0, true)}
//         </span>
//       ),
//     },

//     {
//       key: "createdAt",
//       label: "Created",
//       render: (row) => (
//         <span className="text-xs text-slate-500 whitespace-nowrap">
//           {formatDate(row.createdAt, "longTime")}
//         </span>
//       ),
//     },
//   ];

//   const rowActions = [
//     {
//       label: "View",
//       icon: Eye,
//       color: "slate",
//       onClick: (row) => navigate(`/orders/details?orderId=${row.orderId}`),
//     },
//   ];

//   if (isFetchingDailyReportDetails) {
//     return <DailySalesDetailsPageSkeleton />;
//   }

//   return (
//     <div className="space-y-6">
//       <PageHeader title={formatDate(date, "long")} showBackButton />

//       <SalesSummary data={summary} />

//       <SmartTable
//         title="Orders"
//         totalcount={pagination?.totalCount}
//         data={orders}
//         columns={columns}
//         loading={isFetchingDailyReportDetails}
//         actions={rowActions}
//       />

//       <Pagination
//         totalItems={pagination?.totalCount}
//         currentPage={currentPage}
//         pageSize={itemsPerPage}
//         totalPages={pagination?.totalPages}
//         onPageChange={(page) => setCurrentPage(page)}
//         maxPageNumbers={5}
//         showPageSizeSelector={true}
//         onPageSizeChange={(size) => {
//           setCurrentPage(1);
//           setItemsPerPage(size);
//         }}
//       />
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../../hooks/useQueryParams";
import { fetchDailySalesReportByDate } from "../../redux/slices/reportSlice";
import {
  ArrowLeft,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  CheckCircle2,
  User,
  Layers,
  MapPin,
  CreditCard,
  Receipt,
  ChevronRight,
  Utensils,
  Tag,
  BarChart2,
  Wallet,
  CalendarDays,
  Banknote,
  Smartphone,
  Package,
  Clock,
  Activity,
  Eye,
} from "lucide-react";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber } from "../../utils/numberFormatter";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import PayRow from "../../partial/report/daily-sales-report/PayRow";
import OrderTypeBar from "../../partial/report/daily-sales-report/OrderTypeBar";
import StatCard from "../../components/StatCard";
import SmartTable from "../../components/SmartTable";
import Pagination from "../../components/Pagination";
import OrderBadge from "../../partial/order/OrderBadge";
import DailySalesDetailsPageSkeleton from "../../partial/report/DailySalesDetailsPageSkeleton";

const num = (v) => Number(v || 0);
const fmt = (v) => formatNumber(v, true);

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const DailySalesReportDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { date } = useQueryParams();
  const { outletId } = useSelector((s) => s.auth);
  const { dailySalesReportDetails, isFetchingDailyReportDetails } = useSelector(
    (s) => s.report,
  );
  const { summary, orders = [], pagination } = dailySalesReportDetails || {};

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

  const columns = [
    {
      key: "orderNumber",
      label: "Order",
      render: (row) => {
        const isDineIn = row.orderType === "dine_in";

        return (
          <div className="max-w-[220px] space-y-0.5">
            {/* Order Number */}
            <p className="font-semibold text-sm text-slate-900 tracking-tight">
              #{row.orderNumber}
            </p>

            {/* Meta */}
            {isDineIn ? (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="bg-slate-100 text-slate-700 px-1.5 py-[1px] rounded font-medium">
                  {row.floorName || "—"}
                </span>

                <span className="text-slate-300">•</span>

                <span>
                  {" "}
                  <span className="font-medium text-slate-700">
                    {row.tableNumber || "—"}
                  </span>
                </span>
              </div>
            ) : (
              <span className="text-[11px] font-medium text-slate-500">
                {row.orderType === "takeaway"
                  ? "Takeaway"
                  : row.orderType === "delivery"
                    ? "Delivery"
                    : "Unknown"}
              </span>
            )}
          </div>
        );
      },
    },

    {
      key: "orderType",
      label: "Type",
      render: (row) => (
        <OrderBadge type="type" value={row.orderType} size="sm" />
      ),
    },

    {
      key: "status",
      label: "Status",
      render: (row) => (
        <OrderBadge type="status" value={row.status} size="sm" />
      ),
    },

    {
      key: "paymentStatus",
      label: "Payment",
      render: (row) => (
        <OrderBadge type="payment" value={row.paymentStatus} size="sm" />
      ),
    },

    {
      key: "items",
      label: "Items",
      sortable: false,
      render: (row) => (
        <span className="font-semibold text-sm text-slate-800 tabular-nums">
          {row.items?.totalCount ?? 0}
        </span>
      ),
    },

    {
      key: "guests",
      label: "Guests",
      render: (row) => (
        <span className="font-medium text-sm text-slate-700 tabular-nums">
          {row.guestCount ?? 0}
        </span>
      ),
    },

    {
      key: "captain",
      label: "Captain",
      render: (row) => (
        <span className="text-xs text-slate-600 font-medium">
          {row.captainName || "—"}
        </span>
      ),
    },

    {
      key: "amount",
      label: "Total",
      render: (row) => (
        <span className="font-semibold text-sm text-slate-900 tabular-nums">
          {formatNumber(row.totalAmount ?? 0, true)}
        </span>
      ),
    },

    {
      key: "createdAt",
      label: "Created",
      render: (row) => (
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {formatDate(row.createdAt, "longTime")}
        </span>
      ),
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      color: "slate",
      onClick: (row) => navigate(`/orders/details?orderId=${row.orderId}`),
    },
  ];

  if (isFetchingDailyReportDetails) {
    return <DailySalesDetailsPageSkeleton />;
  }

  return (
    <div className="space-y-5">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className=" flex items-center gap-2 text-[12px] font-semibold text-slate-500 hover:text-slate-800 transition-colors group"
        style={{ animationDelay: "0ms" }}
      >
        <span className="w-7 h-7 rounded-lg border border-slate-200 bg-white shadow-sm flex items-center justify-center group-hover:border-slate-300 transition-colors">
          <ArrowLeft size={13} className="text-slate-500" strokeWidth={2.5} />
        </span>
        Back to Daily Report
      </button>

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
