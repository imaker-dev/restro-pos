// import {
//   ArrowLeft,
//   ArrowRight,
//   Banknote,
//   BarChart2,
//   CalendarDays,
//   CheckCircle2,
//   ChevronRight,
//   Clock,
//   Download,
//   Eye,
//   Hash,
//   IndianRupee,
//   Layers,
//   Lock,
//   Package,
//   ReceiptIndianRupee,
//   ShoppingBag,
//   Target,
//   TrendingDown,
//   TrendingUp,
//   Truck,
//   Unlock,
//   User,
//   Utensils,
//   Wallet,
//   XCircle,
// } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useQueryParams } from "../../hooks/useQueryParams";
// import LoadingOverlay from "../../components/LoadingOverlay";
// import { fetchShiftHistoryByid } from "../../redux/slices/shiftSlice";
// import { formatNumber, num } from "../../utils/numberFormatter";
// import StatCard from "../../components/StatCard";
// import { useNavigate } from "react-router-dom";
// import {
//   formatDate,
//   formatDurationBetween,
//   formatFileDate,
// } from "../../utils/dateFormatter";
// import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
// import PayRow from "../../partial/report/daily-sales-report/PayRow";
// import SmartTable from "../../components/SmartTable";
// import StatusBadge from "../../layout/StatusBadge";
// import Tabs from "../../components/Tabs";
// import OrderBadge from "../../partial/order/OrderBadge";
// import PageHeader from "../../layout/PageHeader";
// import { handleResponse } from "../../utils/helpers";
// import { exportShiftHistoryDetails } from "../../redux/slices/exportReportSlice";
// import { downloadBlob } from "../../utils/blob";
// import ShiftHistoryDetailsPageSkeleton from "../../partial/report/shift-summary/ShiftHistoryDetailsPageSkeleton";
// import { getOrderTableConfig } from "../../columns/order.columns";
// import { ROUTE_PATHS } from "../../config/paths";

// function FieldRow({
//   label,
//   value,
//   valueClass = "text-slate-800",
//   border = true,
// }) {
//   return (
//     <div
//       className={`flex items-center justify-between gap-6 py-2.5 ${border ? "border-b border-slate-100" : ""}`}
//     >
//       <span className="text-[11.5px] text-slate-500 font-medium whitespace-nowrap">
//         {label}
//       </span>
//       <span
//         className={`text-[12px] font-bold tabular-nums text-right ${valueClass}`}
//       >
//         {value}
//       </span>
//     </div>
//   );
// }

// const ShiftHistoryDetailsPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { shiftId } = useQueryParams();
//   const [activeTab, setActiveTab] = useState("transaction");
//   const { isExportingShiftHistoryDetails } = useSelector(
//     (state) => state.exportReport,
//   );
//   const { shiftHistoryDetails: shift, isFetchingShiftHistoryDetails } =
//     useSelector((state) => state.shift);

//   const { columns: orderColumns, actions: orderActions } =
//     getOrderTableConfig(navigate);

//   const {
//     transactions = [],
//     staffActivity = [],
//     orderStats,
//     paymentBreakdown,
//     paymentSummary,
//     orders,
//     dueCollections,
//   } = shift || {};

//   const isOpen = shift?.status === "open";

//   const maxStaff = Math.max(...staffActivity.map((s) => num(s.totalSales)), 1);

//   useEffect(() => {
//     if (shiftId) {
//       dispatch(fetchShiftHistoryByid(shiftId));
//     }
//   }, [shiftId]);

//   const variance = Number(shift?.cashVariance || 0);

//   const duration = shift
//     ? formatDurationBetween(shift?.openingTime, shift?.closingTime)
//     : null;

//   const kpiTiles = [
//     {
//       label: "Opening Cash",
//       value: formatNumber(shift?.openingCash, true),
//       sub: "Float at start",
//       color: "blue",
//       icon: IndianRupee,
//     },
//     {
//       label: "Closing Cash",
//       value: formatNumber(shift?.closingCash, true),
//       sub: "Cash at end",
//       color: "violet",
//       icon: Wallet,
//     },
//     {
//       label: "Total Orders",
//       value: formatNumber(shift?.totalOrders),
//       sub: shift?.cancelledOrders
//         ? `${formatNumber(shift.cancelledOrders)} cancelled`
//         : "processed",
//       color: "slate",
//       icon: ShoppingBag,
//     },
//     {
//       label: "Cash Variance",
//       value: variance === 0 ? "Balanced" : formatNumber(Math.abs(variance)),
//       sub:
//         variance > 0 ? "Surplus" : variance < 0 ? "Shortage" : "No discrepancy",
//       color: variance > 0 ? "emerald" : variance < 0 ? "rose" : "slate",
//       icon:
//         variance > 0 ? TrendingUp : variance < 0 ? TrendingDown : CheckCircle2,
//     },
//   ];

//   const orderStatsData = [
//     // ── Core Orders ──
//     {
//       label: "Total Orders",
//       value: formatNumber(orderStats?.totalOrders),
//       icon: ShoppingBag,
//       color: "slate",
//     },
//     {
//       label: "Completed Orders",
//       value: formatNumber(orderStats?.completedOrders),
//       icon: CheckCircle2,
//       color: "emerald",
//     },
//     {
//       label: "Cancelled Orders",
//       value: formatNumber(orderStats?.cancelledOrders),
//       icon: XCircle,
//       color: "rose",
//     },

//     // ── Order Types ──
//     {
//       label: "Dine-In",
//       value: formatNumber(orderStats?.dineInOrders),
//       icon: Utensils,
//       color: "blue",
//     },
//     {
//       label: "Takeaway",
//       value: formatNumber(orderStats?.takeawayOrders),
//       icon: Package,
//       color: "amber",
//     },
//     {
//       label: "Delivery",
//       value: formatNumber(orderStats?.deliveryOrders),
//       icon: Truck,
//       color: "cyan",
//     },

//     // ── Order Value Metrics ──
//     {
//       label: "Avg Order Value",
//       value: formatNumber(orderStats?.avgOrderValue, true),
//       icon: IndianRupee,
//       color: "violet",
//     },
//     {
//       label: "Max Order Value",
//       value: formatNumber(orderStats?.maxOrderValue, true),
//       icon: TrendingUp,
//       color: "emerald",
//     },
//     {
//       label: "Min Order Value",
//       value: formatNumber(orderStats?.minOrderValue, true),
//       icon: TrendingDown,
//       color: "rose",
//     },
//   ];

//   const tabs = [
//     {
//       id: "transaction",
//       label: "Transactions",
//       icon: ReceiptIndianRupee,
//       count: transactions.length,
//     },
//     {
//       id: "order",
//       label: "All Orders",
//       icon: Package,
//       count: orders?.length,
//     },
//   ];

//   const transactionColumns = [
//     {
//       key: "type",
//       label: "Type",
//       sortable: true,
//       render: (row) => {
//         const type = row.type?.toLowerCase();

//         const styles = {
//           opening: "bg-green-50 text-green-700",
//           closing: "bg-red-50 text-red-700",
//         };

//         return (
//           <span
//             className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize ${
//               styles[type] || "bg-slate-100 text-slate-700"
//             }`}
//           >
//             {type?.replace("_", " ") || "unknown"}
//           </span>
//         );
//       },
//     },

//     {
//       key: "description",
//       label: "Description",
//       sortable: false,
//       render: (row) => (
//         <div className="leading-tight max-w-[240px]">
//           <div className="text-slate-800 font-medium">
//             {row.description || "—"}
//           </div>

//           {row.notes && (
//             <div
//               className="text-xs text-slate-500 truncate mt-0.5"
//               title={row.notes}
//             >
//               {row.notes}
//             </div>
//           )}
//         </div>
//       ),
//     },

//     {
//       key: "amount",
//       label: "Amount",
//       sortable: true,
//       render: (row) => {
//         const isDebit = row.amount < 0;

//         return (
//           <div className="font-semibold">
//             <span className={isDebit ? "text-red-600" : "text-green-600"}>
//               {isDebit ? "-" : "+"}
//               {formatNumber(Math.abs(row.amount), true)}
//             </span>
//           </div>
//         );
//       },
//     },

//     {
//       key: "balance",
//       label: "Balance",
//       sortable: true,
//       render: (row) => {
//         const increased = row.balanceAfter > row.balanceBefore;

//         return (
//           <div className="flex items-center gap-2 min-w-[140px]">
//             <div className="text-sm text-slate-700">
//               {formatNumber(row.balanceBefore, true)}
//             </div>

//             <ArrowRight
//               size={16}
//               className={increased ? "text-green-600" : "text-red-600"}
//             />

//             <div className="font-semibold text-slate-800">
//               {formatNumber(row.balanceAfter, true)}
//             </div>
//           </div>
//         );
//       },
//     },

//     {
//       key: "user",
//       label: "User",
//       sortable: true,
//       render: (row) => (
//         <div className="leading-tight max-w-[160px]">
//           <div className="text-sm text-slate-700 font-medium truncate">
//             {row.userName || "—"}
//           </div>
//         </div>
//       ),
//     },

//     {
//       key: "createdAt",
//       label: "Time",
//       sortable: true,
//       render: (row) => (
//         <div className="leading-tight">
//           <div className="text-sm text-slate-700">
//             {formatDate(row.createdAt, "longTime")}
//           </div>
//         </div>
//       ),
//     },
//   ];

//   const handleExportShiftSummaryDetailsReport = async () => {
//     if (!shift?.sessionDate) return;

//     const fileName = `Shift-Summary-Report_${formatFileDate(
//       shift.sessionDate,
//     )}`;

//     await handleResponse(
//       dispatch(exportShiftHistoryDetails(shiftId)),
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
//       onClick: () => handleExportShiftSummaryDetailsReport(),
//       loading: isExportingShiftHistoryDetails,
//       loadingText: "Exporting...",
//     },
//   ];

//   if (isFetchingShiftHistoryDetails) {
//     return <ShiftHistoryDetailsPageSkeleton />;
//   }

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title={"Shift History Details"}
//         actions={actions}
//         showBackButton
//       />
//       {/* ── UNIVERSAL SHIFT HERO ── */}
//       <div className="relative rounded-2xl overflow-hidden shadow-lg bg-primary-500">
//         {/* Soft highlight line */}
//         <div
//           className="absolute top-0 left-0 right-0 h-[1px]"
//           style={{
//             background:
//               "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
//           }}
//         />

//         {/* Soft radial glow */}
//         <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />

//         <div className="relative z-10 px-5 py-4 text-white">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
//             {/* Avatar + Identity */}

//             <div className="min-w-0">
//               <div className="flex flex-wrap items-center gap-2 mb-1.5">
//                 <h1 className="text-[20px] font-bold leading-none truncate">
//                   {shift.cashierName}
//                 </h1>

//                 <StatusBadge
//                   value={isOpen}
//                   trueText="Open"
//                   falseText="Closed"
//                   size="sm"
//                 />
//               </div>

//               <div className="flex flex-wrap gap-2">
//                 {shift.floorName && (
//                   <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 border border-white/20 text-[10px] text-white/80">
//                     <Layers size={12} />
//                     {shift.floorName}
//                   </span>
//                 )}
//                 {shift.outletName && (
//                   <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 border border-white/20 text-[10px] text-white/80">
//                     <Hash size={12} />
//                     {shift.outletName}
//                   </span>
//                 )}
//                 <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 border border-white/20 text-[10px] text-white/80">
//                   <CalendarDays size={12} />
//                   {formatDate(shift.sessionDate, "long")}
//                 </span>
//                 <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 border border-white/20 text-[10px] text-white/80">
//                   <Hash size={12} />
//                   Shift #{shift.id}
//                 </span>
//               </div>
//             </div>

//             {/* Total Sales */}
//             <div className="flex-shrink-0 sm:text-right">
//               <p className="text-[9px] font-semibold text-white/70 uppercase tracking-wider">
//                 Total Sales
//               </p>
//               <p className="text-[32px] font-bold tabular-nums leading-none">
//                 {formatNumber(shift.totalSales, true)}
//               </p>
//               <p className="text-[11px] text-white/70 mt-1">
//                 {formatNumber(shift.totalOrders)} orders processed
//               </p>
//             </div>
//           </div>

//           {/* Bottom Metrics */}
//           <div className="grid grid-cols-3 gap-3 mt-4">
//             {[
//               {
//                 icon: Unlock,
//                 label: "Opened",
//                 primary: formatDate(shift.openingTime, "time"),
//                 secondary: formatDate(shift.openingTime, "long"),
//               },
//               {
//                 icon: Lock,
//                 label: "Closed",
//                 primary: shift.closingTime
//                   ? formatDate(shift.closingTime, "time")
//                   : "In Progress",
//                 secondary: shift.closingTime
//                   ? formatDate(shift.closingTime, "long")
//                   : "—",
//               },
//               {
//                 icon: Clock,
//                 label: "Duration",
//                 primary: duration || "—",
//                 secondary: isOpen ? "Shift active" : "Total session time",
//               },
//             ].map(({ icon: Icon, label, primary, secondary }) => (
//               <div
//                 key={label}
//                 className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm"
//               >
//                 <Icon size={13} strokeWidth={2} />

//                 <div className="min-w-0">
//                   <p className="text-[9px] font-semibold text-white/70 uppercase tracking-wide">
//                     {label}
//                   </p>
//                   <p className="text-[14px] font-bold tabular-nums leading-none truncate">
//                     {primary}
//                   </p>
//                   <p className="text-[9px] text-white/70 truncate">
//                     {secondary}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
//         {kpiTiles.map(({ label, value, sub, color, icon: Icon }) => (
//           <StatCard
//             key={label}
//             title={label}
//             icon={Icon}
//             value={value}
//             subtitle={sub}
//             color={color}
//             variant="v9"
//             mode="solid"
//           />
//         ))}
//       </div>

//       <div
//         className="grid grid-cols-1 lg:grid-cols-3 gap-4"
//         style={{ animationDelay: "120ms" }}
//       >
//         {/* ── LEFT (2 cols) ───────────────────────────────── */}
//         <div className="lg:col-span-2 space-y-4">
//           {/* Cash + Payments row */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Cash Summary */}
//             <MetricPanel
//               icon={Wallet}
//               title="Cash Summary"
//               desc="Opening · Closing · Variance"
//             >
//               <div>
//                 <FieldRow
//                   label="Opening Cash"
//                   value={formatNumber(shift.openingCash, true)}
//                 />
//                 <FieldRow
//                   label="Closing Cash"
//                   value={formatNumber(shift.closingCash, true)}
//                 />
//                 <FieldRow
//                   label="Expected Cash"
//                   value={formatNumber(shift.expectedCash, true)}
//                   valueClass="text-slate-400"
//                   border={false}
//                 />
//               </div>
//             </MetricPanel>

//             {/* Payment breakdown from summary */}
//             <MetricPanel
//               icon={Wallet}
//               title="Payment Collection"
//               desc="Sales by payment type"
//               right={
//                 <span className="text-[13px] font-black text-slate-900 tabular-nums">
//                   {formatNumber(paymentSummary?.total, true)}
//                 </span>
//               }
//             >
//               {Object.entries(paymentSummary || {})
//                 .filter(([key, amount]) => key !== "total" && num(amount) > 0)
//                 .map(([mode, amount]) => (
//                   <PayRow
//                     key={mode}
//                     type={mode}
//                     amount={amount}
//                     total={paymentSummary?.total || 1}
//                   />
//                 ))}

//               {(!paymentSummary || paymentSummary.total === 0) && (
//                 <p className="text-[12px] text-slate-400 text-center py-6">
//                   No payment data
//                 </p>
//               )}
//             </MetricPanel>
//           </div>

//           {/* Order Statistics */}
//           <MetricPanel
//             icon={BarChart2}
//             title="Order Statistics"
//             desc="Performance breakdown for this shift"
//           >
//             <div className="grid grid-cols-2 md:grid-cols-3  gap-3">
//               {orderStatsData?.map((item) => (
//                 <StatCard
//                   key={item.label}
//                   title={item.label}
//                   value={item.value}
//                   icon={item.icon}
//                   color={item.color}
//                   variant="v5"
//                   // mode="solid"
//                 />
//               ))}
//             </div>
//           </MetricPanel>

//           {/* ── DUE COLLECTIONS ── */}
//           {dueCollections?.orders?.length > 0 && (
//             <MetricPanel
//               icon={IndianRupee}
//               title="Due Collections"
//               desc="Payments collected against outstanding dues in this shift"
//               right={
//                 <span className="text-xs font-bold text-slate-700">
//                   {dueCollections.count} collected ·{" "}
//                   {formatNumber(dueCollections.totalCollected, true)}
//                 </span>
//               }
//             >
//               <div className="space-y-2">
//                 {dueCollections.orders.map((due, idx) => (
//                   <button
//                     key={due.paymentId}
//                     onClick={() =>
//                       navigate(
//                         `${ROUTE_PATHS.ORDER_DETAILS}?orderId=${due.orderId}`,
//                       )
//                     }
//                     className="w-full text-left group flex items-center gap-3.5 px-4 py-3.5 rounded-xl border transition-all duration-150 bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm active:scale-[0.99]"
//                   >
//                     {/* Index badge */}
//                     <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center flex-shrink-0 transition-colors">
//                       <span className="text-[10px] font-black text-slate-500">
//                         {String(idx + 1).padStart(2, "0")}
//                       </span>
//                     </div>

//                     {/* Order + customer */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-0.5 flex-wrap">
//                         <span className="font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md leading-none">
//                           {due.orderNumber}
//                         </span>
//                         {due.customerName && (
//                           <span className="text-[12px] font-semibold text-slate-700 truncate leading-none">
//                             {due.customerName}
//                           </span>
//                         )}
//                       </div>
//                       <div className="flex items-center gap-3 mt-1">
//                         <span className="text-[10px] text-slate-400">
//                           Bill:{" "}
//                           <span className="font-semibold text-slate-600">
//                             {formatNumber(due.orderTotal, true)}
//                           </span>
//                         </span>
//                         <span className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
//                         <span className="text-[10px] text-slate-400">
//                           {formatDate(due.createdAt, "longTime")}
//                         </span>
//                         <span className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
//                         <span className="text-[10px] text-slate-400">
//                           {due.paymentMode}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Payment mode + amount */}
//                     <div className="flex items-center gap-3 flex-shrink-0">
//                       <div className="text-right">
//                         <p className="text-[14px] font-extrabold text-emerald-600 tabular-nums leading-none">
//                           +{formatNumber(due.collectedAmount, true)}
//                         </p>
//                       </div>
//                       <ChevronRight
//                         size={15}
//                         className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all"
//                       />
//                     </div>
//                   </button>
//                 ))}
//               </div>

//               {/* Footer total strip */}
//               <div className="mt-3 flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100">
//                 <span className="text-[11px] font-bold text-emerald-700">
//                   Total Due Recovered
//                 </span>
//                 <span className="text-[14px] font-extrabold text-emerald-700 tabular-nums">
//                   {formatNumber(dueCollections.totalCollected, true)}
//                 </span>
//               </div>
//             </MetricPanel>
//           )}
//         </div>

//         {/* ── RIGHT SIDEBAR ───────────────────────────────── */}
//         <div className="space-y-4">
//           {/* Shift Details */}
//           <MetricPanel icon={CalendarDays} title="Shift Details">
//             <FieldRow
//               label="Session Date"
//               value={formatDate(shift.sessionDate, "long")}
//             />
//             <FieldRow
//               label="Opened At"
//               value={formatDate(shift.openingTime, "time")}
//             />
//             <FieldRow
//               label="Closed At"
//               value={
//                 shift.closingTime ? formatDate(shift.closingTime, "time") : "—"
//               }
//             />
//             <FieldRow label="Duration" value={duration || "—"} border={false} />
//           </MetricPanel>

//           {/* Staff Activity */}
//           {staffActivity.length > 0 && (
//             <MetricPanel
//               icon={User}
//               title="Staff Activity"
//               desc="Per cashier performance"
//             >
//               <div className="space-y-4">
//                 {[...staffActivity]
//                   .sort((a, b) => num(b.totalSales) - num(a.totalSales))
//                   .map((s) => (
//                     <div key={s.userId}>
//                       <div className="flex items-center gap-2.5 mb-2">
//                         <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
//                           <User
//                             size={13}
//                             className="text-white"
//                             strokeWidth={2}
//                           />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-[12px] font-black text-slate-800 truncate leading-tight">
//                             {s.userName}
//                           </p>
//                           <p className="text-[10px] text-slate-400 font-medium">
//                             {s.ordersHandled} orders ·{" "}
//                             {formatNumber(s.totalSales, true)}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
//                         <div
//                           className="h-full rounded-full bg-slate-700 transition-all duration-700"
//                           style={{
//                             width: `${(num(s.totalSales) / maxStaff) * 100}%`,
//                           }}
//                         />
//                       </div>
//                     </div>
//                   ))}
//               </div>
//             </MetricPanel>
//           )}

//           {/* Session Activity */}
//           {(shift.openedByName || shift.closedByName) && (
//             <MetricPanel icon={User} title="Staff Activity">
//               <div className="space-y-2.5">
//                 {shift.openedByName && (
//                   <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
//                     <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0">
//                       <Unlock
//                         size={12}
//                         className="text-emerald-600"
//                         strokeWidth={2.5}
//                       />
//                     </div>
//                     <div>
//                       <p className="text-[8.5px] font-black text-emerald-500 uppercase tracking-wider">
//                         Opened by
//                       </p>
//                       <p className="text-[12.5px] font-black text-slate-800">
//                         {shift.openedByName}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//                 {shift.closedByName && (
//                   <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-slate-100 border border-slate-200">
//                     <div className="w-7 h-7 rounded-lg bg-slate-200 border border-slate-300 flex items-center justify-center flex-shrink-0">
//                       <Lock
//                         size={12}
//                         className="text-slate-600"
//                         strokeWidth={2.5}
//                       />
//                     </div>
//                     <div>
//                       <p className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider">
//                         Closed by
//                       </p>
//                       <p className="text-[12.5px] font-black text-slate-800">
//                         {shift.closedByName}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </MetricPanel>
//           )}

//           {/* Quick stats from orderStats */}
//           {orderStats && (
//             <MetricPanel
//               icon={BarChart2}
//               title="Order Performance"
//               desc="Key metrics from orderStats"
//             >
//               <FieldRow
//                 label="Adjustments Made"
//                 value={formatNumber(orderStats.adjustmentCount)}
//               />
//               <FieldRow
//                 label="Adjustment Amount"
//                 value={formatNumber(orderStats.adjustmentAmount, true)}
//                 valueClass="text-red-600"
//               />
//               <FieldRow
//                 label="NC Orders"
//                 value={formatNumber(orderStats.ncOrders)}
//               />
//               <FieldRow
//                 label="NC Amount Waived"
//                 value={formatNumber(orderStats.ncAmount, true)}
//                 valueClass="text-amber-600"
//               />
//               <FieldRow
//                 label="Total Due Amount"
//                 value={formatNumber(orderStats.totalDueAmount, true)}
//                 valueClass="text-slate-800"
//                 border={false}
//               />
//             </MetricPanel>
//           )}
//         </div>
//       </div>

//       {/* ── Tab switcher ── */}
//       <Tabs
//         tabs={tabs}
//         active={activeTab}
//         onChange={setActiveTab}
//         variant="v2"
//       />

//       {activeTab === "transaction" && (
//         <SmartTable
//           title={"Transactions"}
//           totalcount={transactions?.length}
//           data={transactions}
//           columns={transactionColumns}
//           loading={isFetchingShiftHistoryDetails}
//           //   actions={rowActions}
//         />
//       )}

//       {activeTab === "order" && (
//         <SmartTable
//           title={"Orders"}
//           totalcount={orders?.length}
//           data={orders}
//           columns={orderColumns}
//           loading={isFetchingShiftHistoryDetails}
//           actions={orderActions}
//         />
//       )}
//     </div>
//   );
// };

// export default ShiftHistoryDetailsPage;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "../../hooks/useQueryParams";
import { fetchShiftHistoryByid } from "../../redux/slices/shiftSlice";
import {
  Clock,
  User,
  Building2,
  Layers,
  Banknote,
  CreditCard,
  Wallet,
  TrendingUp,
  Receipt,
  Users,
  AlertCircle,
  SlidersHorizontal,
  Tag,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRightLeft,
  ShoppingBag,
  UtensilsCrossed,
  Bike,
  ArrowDownLeft,
  ArrowUpRight,
  Package,
  ChevronRight,
  BadgeCheck,
  Ban,
  TriangleAlert,
  ExternalLink,
} from "lucide-react";
import PageHeader from "../../layout/PageHeader";
import OrderBadge from "../../partial/order/OrderBadge";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../config/paths";

/* ── helpers ── */
const fmt = (n) =>
  "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
const fmtN = (n) => Number(n || 0).toLocaleString("en-IN");
const fmtTime = (s) =>
  s
    ? new Date(s).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "—";
const fmtDateTime = (s) =>
  s
    ? new Date(s).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "—";
const fmtDate = (s) =>
  s
    ? new Date(s).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const roleColor = (role) =>
  ({
    cashier: "bg-blue-50 text-blue-600 border-blue-100",
    captain: "bg-violet-50 text-violet-600 border-violet-100",
  })[role] || "bg-gray-100 text-gray-500";

const avatarColor = (i) =>
  [
    "bg-blue-100 text-blue-700",
    "bg-violet-100 text-violet-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ][i % 5];

/* ── tiny reusable atoms ── */
const Label = ({ children }) => (
  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
    {children}
  </p>
);

const InfoRow = ({ label, value, valueClass = "text-gray-800" }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
    <span className="text-xs text-gray-400">{label}</span>
    <span className={`text-xs font-medium ${valueClass}`}>{value}</span>
  </div>
);

const StatChip = ({ label, value, accent = "gray" }) => {
  const map = {
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-500",
    violet: "bg-violet-50 text-violet-700",
    gray: "bg-gray-100 text-gray-600",
  };
  return (
    <div className={`rounded-xl px-3 py-2.5 ${map[accent]}`}>
      <p className="text-[10px] font-medium opacity-70 mb-0.5">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
};

const PayBar = ({
  icon: Icon,
  label,
  amount,
  count,
  total,
  barColor,
  iconBg,
  iconColor,
}) => {
  const ratio = total ? Math.round((amount / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div
        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
      >
        <Icon size={12} className={iconColor} />
      </div>
      <span className="text-xs text-gray-600 w-8 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${ratio}%` }}
        />
      </div>
      <span className="text-[10px] text-gray-400 w-6 text-right shrink-0">
        {ratio}%
      </span>
      <span className="text-xs text-gray-400 shrink-0">({count})</span>
      <span className="text-xs font-semibold text-gray-800 w-[68px] text-right shrink-0">
        {fmt(amount)}
      </span>
    </div>
  );
};

/* ── Accordion wrapper ── */
function Accordion({
  title,
  subtitle,
  icon: Icon,
  iconBg = "bg-gray-100",
  iconColor = "text-gray-500",
  badge,
  defaultOpen = false,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center border ${iconBg}`}
          >
            <Icon size={14} className={iconColor} />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">{title}</p>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-xs font-semibold text-gray-500">{badge}</span>
          )}
          <ChevronDown
            size={14}
            className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      {open && (
        <div className="border-t border-gray-100 px-4 py-4">{children}</div>
      )}
    </div>
  );
}

/* ── Order card ── */
function OrderCard({ order }) {
  const [open, setOpen] = useState(false);
  const {
    id,
    orderNumber,
    orderType,
    status,
    paymentStatus,
    tableName,
    customerName,
    customerPhone,
    subtotal,
    taxAmount,
    discountAmount,
    totalAmount,
    isNC,
    ncAmount,
    ncReason,
    paidAmount,
    dueAmount,
    isAdjustment,
    adjustmentAmount,
    paymentMode,
    createdByName,
    createdAt,
    items,
  } = order;

  const navigate = useNavigate();

  const modeIcon =
    { cash: Banknote, card: CreditCard, upi: Layers }[paymentMode] || Banknote;
  const ModeIcon = modeIcon;

  return (
    // <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
    <div
      className={`border  rounded-2xl overflow-hidden transition-colors ${
        status === "cancelled"
          ? " bg-red-50/50 border-red-200"
          : "bg-white border-gray-200"
      }`}
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center shrink-0">
            {orderType === "dine_in" ? (
              <UtensilsCrossed size={13} className="text-gray-500" />
            ) : orderType === "takeaway" ? (
              <ShoppingBag size={13} className="text-gray-500" />
            ) : (
              <Bike size={13} className="text-gray-500" />
            )}
            {tableName && (
              <span className="text-[8px] text-gray-400 leading-none mt-0.5 font-medium">
                {tableName}
              </span>
            )}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-gray-800">
                {orderNumber}
              </p>
              {isNC && (
                <span className="text-[9px] bg-amber-50 text-amber-500 border border-amber-100 px-1.5 py-0.5 rounded-full font-medium">
                  NC
                </span>
              )}
              {isAdjustment && (
                <span className="text-[9px] bg-blue-50 text-blue-500 border border-blue-100 px-1.5 py-0.5 rounded-full font-medium">
                  Adj
                </span>
              )}
              {dueAmount > 0 && (
                <span className="text-[9px] bg-red-50 text-red-500 border border-red-100 px-1.5 py-0.5 rounded-full font-medium">
                  Due
                </span>
              )}
              {discountAmount > 0 && (
                <span className="text-[9px] bg-emerald-50 text-emerald-500 border border-emerald-100 px-1.5 py-0.5 rounded-full font-medium">
                  Discount
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {customerName || "Walk-in"} · {fmtTime(createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">
              {fmt(totalAmount)}
            </p>
            <div className="flex items-center justify-end gap-1 mt-0.5">
              <ModeIcon size={10} className="text-gray-400" />
              <span className="text-[10px] text-gray-400 capitalize">
                {paymentMode}
              </span>
            </div>
          </div>
          <ChevronDown
            size={13}
            className={`text-gray-300 transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-50 px-4 py-3 space-y-3">
          {/* status badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <OrderBadge type="status" value={status} size="sm" />
            <OrderBadge type="payment" value={paymentStatus} size="sm" />
            <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              by {createdByName}
            </span>
          </div>

          {/* items */}
          {items?.length > 0 && (
            <div className="bg-gray-50 rounded-xl px-3 py-2">
              <Label>Items</Label>
              {items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Package size={11} className="text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-700 truncate">
                      {item.itemName}
                      {item.variantName ? ` · ${item.variantName}` : ""}
                    </span>
                    <span className="text-[10px] text-gray-400 shrink-0">
                      ×{parseFloat(item.quantity)}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-800 shrink-0 ml-3">
                    {fmt(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* bill breakdown */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Subtotal", value: fmt(subtotal), cls: "text-gray-700" },
              { label: "Tax", value: fmt(taxAmount), cls: "text-gray-700" },
              ...(discountAmount > 0
                ? [
                    {
                      label: "Discount",
                      value: `− ${fmt(discountAmount)}`,
                      cls: "text-red-500",
                    },
                  ]
                : []),
              ...(isNC && ncAmount > 0
                ? [
                    {
                      label: "NC",
                      value: `− ${fmt(ncAmount)}`,
                      cls: "text-amber-500",
                    },
                  ]
                : []),
              ...(isAdjustment && adjustmentAmount > 0
                ? [
                    {
                      label: "Adjustment",
                      value: `− ${fmt(adjustmentAmount)}`,
                      cls: "text-blue-500",
                    },
                  ]
                : []),
              {
                label: "Paid",
                value: fmt(paidAmount),
                cls: "text-emerald-600",
              },
              ...(dueAmount > 0
                ? [{ label: "Due", value: fmt(dueAmount), cls: "text-red-500" }]
                : []),
            ].map(({ label, value, cls }) => (
              <div
                key={label}
                className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2"
              >
                <span className="text-[10px] text-gray-500">{label}</span>
                <span className={`text-[11px] font-semibold ${cls}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* view details */}
          <button
            onClick={() =>
              navigate(`${ROUTE_PATHS.ORDER_DETAILS}?orderId=${id}`)
            }
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors group"
          >
            <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
              View order details
            </span>
            <ExternalLink
              size={11}
              className="text-gray-400 group-hover:text-gray-600 transition-colors"
            />
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Tab button ── */
const Tab = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${active ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
  >
    {label}
  </button>
);

/* ── Main Page ── */
const ShiftHistoryDetailsPage = () => {
  const dispatch = useDispatch();
  const { shiftId } = useQueryParams();
  const [activeTab, setActiveTab] = useState("overview");
  const { shiftHistoryDetails: d, isFetchingShiftHistoryDetails } = useSelector(
    (s) => s.shift,
  );

  useEffect(() => {
    if (shiftId) dispatch(fetchShiftHistoryByid(shiftId));
  }, [shiftId]);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "collection", label: "Collection" },
    { id: "orders", label: `Orders (${d?.orderStats?.completedOrders || 0})` },
    {
      id: "staff",
      label: `Staff (${d?.staffActivity?.filter((s) => s.ordersCreated > 0 || s.ordersHandled > 0).length || 0})`,
    },
    { id: "dues", label: "Due collections" },
    { id: "transactions", label: "Transactions" },
  ];

  if (isFetchingShiftHistoryDetails) {
    return (
      <div className="px-4 md:px-6 py-6 space-y-3 max-w-4xl mx-auto">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-white border border-gray-100 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!d) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
          <Clock size={20} className="text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-500">No shift data found</p>
      </div>
    );
  }

  const {
    orderStats,
    collection,
    paymentBreakdown,
    staffActivity,
    dueCollections,
    transactions,
    orders,
    cashierBreakdown,
  } = d;

  return (
    <div className="space-y-5">
      <PageHeader onlyBack backLabel="back" />

      <div>
        {/* ── Hero header ── */}
        <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-5">
          <div>
            {/* top row */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${d.status === "closed" ? "bg-red-50 text-red-500 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}
                  >
                    {d.status === "closed" ? "Closed" : "Active"}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Shift #{d.id}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  {d.outletName}
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  {d.floorName} · {fmtDate(d.sessionDate)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-bold text-gray-900">
                  {fmt(d.totalSales)}
                </p>
                <p className="text-xs text-gray-400">total sales</p>
              </div>
            </div>

            {/* cashier + time row */}
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                  {initials(d.cashierName)}
                </div>
                <span className="text-xs text-gray-700 font-medium">
                  {d.cashierName}
                </span>
                <span className="text-[10px] text-gray-400">Cashier</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock size={12} className="text-gray-400" />
                <span>{fmtTime(d.openingTime)}</span>
                <span className="text-gray-300">→</span>
                <span>{fmtTime(d.closingTime)}</span>
              </div>
            </div>

            {/* quick stat chips */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <StatChip
                label="Orders"
                value={fmtN(d.totalOrders)}
                accent="blue"
              />
              <StatChip
                label="Guests"
                value={fmtN(orderStats?.totalOrders || d.totalOrders)}
                accent="violet"
              />
              <StatChip
                label="Cancelled"
                value={fmtN(orderStats?.cancelledOrders || 0)}
                accent="red"
              />
              <StatChip
                label="NC orders"
                value={fmtN(orderStats?.ncOrders || 0)}
                accent="amber"
              />
              <StatChip
                label="Avg order"
                value={fmt(orderStats?.avgOrderValue || 0)}
                accent="green"
              />
              <StatChip
                label="Due"
                value={fmt(orderStats?.totalDueAmount || 0)}
                accent={orderStats?.totalDueAmount > 0 ? "red" : "gray"}
              />
            </div>
          </div>
        </div>

        {/* ── Tab strip ── */}
        <div className="bg-white border-b border-gray-100 px-4 md:px-6 mb-6">
          <div>
            <div className="flex items-center gap-1 py-2.5 overflow-x-auto scrollbar-hide">
              {tabs.map((t) => (
                <Tab
                  key={t.id}
                  label={t.label}
                  active={activeTab === t.id}
                  onClick={() => setActiveTab(t.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="space-y-3">
        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <>
            {/* shift info */}
            <Accordion
              title="Shift info"
              subtitle="Session details & timing"
              icon={Clock}
              iconBg="bg-blue-50 border-blue-100"
              iconColor="text-blue-600"
              defaultOpen
            >
              <InfoRow label="Outlet" value={d.outletName} />
              <InfoRow label="Floor" value={d.floorName} />
              <InfoRow label="Cashier" value={d.cashierName} />
              <InfoRow label="Opened by" value={d.openedByName} />
              <InfoRow label="Closed by" value={d.closedByName} />
              <InfoRow label="Session date" value={fmtDate(d.sessionDate)} />
              <InfoRow
                label="Opening time"
                value={fmtDateTime(d.openingTime)}
              />
              <InfoRow
                label="Closing time"
                value={fmtDateTime(d.closingTime)}
              />
              <InfoRow
                label="Status"
                value={d.status === "closed" ? "Closed" : "Active"}
                valueClass={
                  d.status === "closed" ? "text-red-500" : "text-emerald-600"
                }
              />
            </Accordion>

            {/* cash summary */}
            <Accordion
              title="Cash summary"
              subtitle="Opening, closing & variance"
              icon={Banknote}
              iconBg="bg-emerald-50 border-emerald-100"
              iconColor="text-emerald-600"
              defaultOpen
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                <StatChip
                  label="Opening cash"
                  value={fmt(d.openingCash)}
                  accent="gray"
                />
                <StatChip
                  label="Closing cash"
                  value={fmt(d.closingCash)}
                  accent="green"
                />
                <StatChip
                  label="Expected cash"
                  value={fmt(d.expectedCash)}
                  accent="blue"
                />
                <StatChip
                  label="Variance"
                  value={fmt(d.cashVariance)}
                  accent={
                    d.cashVariance > 0
                      ? "green"
                      : d.cashVariance < 0
                        ? "red"
                        : "gray"
                  }
                />
              </div>
              {d.varianceNotes && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 text-xs text-amber-700">
                  {d.varianceNotes}
                </div>
              )}
            </Accordion>

            {/* order stats */}
            <Accordion
              title="Order stats"
              subtitle="Type breakdown & performance"
              icon={Receipt}
              iconBg="bg-violet-50 border-violet-100"
              iconColor="text-violet-600"
              defaultOpen
            >
              <div className="grid grid-cols-3 gap-2 mb-3">
                <StatChip
                  label="Total"
                  value={fmtN(orderStats?.totalOrders)}
                  accent="blue"
                />
                <StatChip
                  label="Completed"
                  value={fmtN(orderStats?.completedOrders)}
                  accent="green"
                />
                <StatChip
                  label="Cancelled"
                  value={fmtN(orderStats?.cancelledOrders)}
                  accent="red"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <StatChip
                  label="Dine-in"
                  value={fmtN(orderStats?.dineInOrders)}
                  accent="blue"
                />
                <StatChip
                  label="Takeaway"
                  value={fmtN(orderStats?.takeawayOrders)}
                  accent="violet"
                />
                <StatChip
                  label="Delivery"
                  value={fmtN(orderStats?.deliveryOrders)}
                  accent="amber"
                />
              </div>
              <InfoRow
                label="Avg order value"
                value={fmt(orderStats?.avgOrderValue)}
              />
              <InfoRow
                label="Max order value"
                value={fmt(orderStats?.maxOrderValue)}
              />
              <InfoRow
                label="Min order value"
                value={fmt(orderStats?.minOrderValue)}
              />
              <InfoRow
                label="NC orders"
                value={`${orderStats?.ncOrders} · ${fmt(orderStats?.ncAmount)}`}
                valueClass="text-amber-500"
              />
              <InfoRow
                label="Adjustments"
                value={`${orderStats?.adjustmentCount} · ${fmt(orderStats?.adjustmentAmount)}`}
                valueClass="text-blue-500"
              />
              <InfoRow
                label="Total due"
                value={fmt(orderStats?.totalDueAmount)}
                valueClass={
                  orderStats?.totalDueAmount > 0
                    ? "text-red-500"
                    : "text-gray-800"
                }
              />
            </Accordion>
          </>
        )}

        {/* ── COLLECTION ── */}
        {activeTab === "collection" && (
          <>
            {/* totals */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4">
              <Label>Collection summary</Label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <StatChip
                  label="Total"
                  value={fmt(collection.totalMoneyReceived)}
                  accent="green"
                />
                <StatChip
                  label="Fresh"
                  value={fmt(d.cashierBreakdown?.[0]?.freshCollection || 0)}
                  accent="blue"
                />
                <StatChip
                  label="From dues"
                  value={fmt(collection.dueCollection)}
                  accent="violet"
                />
              </div>
              <Label>Payment modes</Label>
              {paymentBreakdown?.map((p) => {
                const icons = {
                  cash: {
                    icon: Banknote,
                    bar: "bg-emerald-400",
                    bg: "bg-emerald-50",
                    col: "text-emerald-600",
                  },
                  card: {
                    icon: CreditCard,
                    bar: "bg-blue-400",
                    bg: "bg-blue-50",
                    col: "text-blue-600",
                  },
                  upi: {
                    icon: Layers,
                    bar: "bg-violet-400",
                    bg: "bg-violet-50",
                    col: "text-violet-600",
                  },
                };
                const s = icons[p.mode] || icons.cash;
                return (
                  <PayBar
                    key={p.mode}
                    icon={s.icon}
                    label={p.mode.charAt(0).toUpperCase() + p.mode.slice(1)}
                    amount={p.total}
                    count={p.count}
                    total={collection.totalMoneyReceived}
                    barColor={s.bar}
                    iconBg={s.bg}
                    iconColor={s.col}
                  />
                );
              })}
            </div>

            {/* deductions */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4">
              <Label>Deductions & exceptions</Label>
              {[
                {
                  icon: Tag,
                  label: "Discount",
                  value: `− ${fmt(d.totalDiscounts)}`,
                  cls: "text-red-500",
                  sub: null,
                },
                {
                  icon: AlertCircle,
                  label: "NC amount",
                  value: `− ${fmt(collection.totalNC)}`,
                  cls: "text-amber-500",
                  sub: `${collection.ncOrderCount} orders`,
                },
                {
                  icon: SlidersHorizontal,
                  label: "Adjustments",
                  value: `− ${fmt(collection.totalAdjustment)}`,
                  cls: "text-blue-500",
                  sub: `${collection.adjustmentCount} entries`,
                },
              ].map(({ icon: Icon, label, value, cls, sub }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <Icon size={13} className="text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-600">{label}</span>
                    {sub && (
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                        {sub}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs font-semibold ${cls}`}>
                    {value}
                  </span>
                </div>
              ))}
              {collection.totalDue > 0 && (
                <div className="mt-3 flex items-center justify-between rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      size={13}
                      className="text-red-400 shrink-0"
                    />
                    <span className="text-xs text-red-500 font-medium">
                      Pending due
                    </span>
                  </div>
                  <span className="text-xs font-bold text-red-600">
                    {fmt(collection.totalDue)}
                  </span>
                </div>
              )}
            </div>

            {/* cashier breakdown */}
            {cashierBreakdown?.map((c, i) => (
              <div
                key={c.cashierId}
                className="bg-white border border-gray-100 rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${avatarColor(i)}`}
                  >
                    {initials(c.cashierName)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      {c.cashierName}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {c.orderCount} orders
                    </p>
                  </div>
                  <p className="ml-auto text-sm font-bold text-gray-900">
                    {fmt(c.totalCollection)}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <StatChip
                    label="Fresh"
                    value={fmt(c.freshCollection)}
                    accent="green"
                  />
                  <StatChip
                    label="From due"
                    value={fmt(c.dueCollection)}
                    accent="violet"
                  />
                  <StatChip
                    label="Total"
                    value={fmt(c.totalCollection)}
                    accent="blue"
                  />
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── ORDERS ── */}
        {activeTab === "orders" && (
          <div className="space-y-2">
            {orders?.length > 0 ? (
              [...orders]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((o) => <OrderCard key={o.id} order={o} />)
            ) : (
              <div className="flex flex-col items-center py-16 gap-2">
                <Receipt size={24} className="text-gray-300" />
                <p className="text-sm text-gray-400">No orders found</p>
              </div>
            )}
          </div>
        )}

        {/* ── STAFF ── */}
        {activeTab === "staff" && (
          <div className="space-y-2">
            {staffActivity
              ?.filter(
                (s) =>
                  s.ordersCreated > 0 ||
                  s.ordersHandled > 0 ||
                  s.amountCollected > 0,
              )
              .map((s, i) => (
                <div
                  key={s.userId}
                  className="bg-white border border-gray-100 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor(i)}`}
                    >
                      {initials(s.userName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800">
                          {s.userName}
                        </p>
                        <span
                          className={`text-[9px] font-medium capitalize border px-1.5 py-0.5 rounded-full ${roleColor(s.role)}`}
                        >
                          {s.role}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {s.ordersCreated} created · {s.ordersCancelled}{" "}
                        cancelled
                      </p>
                    </div>
                    {s.amountCollected > 0 && (
                      <p className="text-sm font-bold text-gray-900 shrink-0">
                        {fmt(s.amountCollected)}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <StatChip
                      label="Handled"
                      value={fmtN(s.ordersHandled)}
                      accent="blue"
                    />
                    <StatChip
                      label="Sales"
                      value={fmt(s.orderSales)}
                      accent="green"
                    />
                    {s.dueCollected > 0 && (
                      <StatChip
                        label="Due collected"
                        value={fmt(s.dueCollected)}
                        accent="violet"
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* ── DUE COLLECTIONS ── */}
        {activeTab === "dues" && (
          <>
            <div className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <Label>Due collections</Label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400">
                    {dueCollections?.count} orders
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    {fmt(dueCollections?.totalCollected)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {dueCollections?.orders?.length ? (
                  dueCollections.orders.map((o) => (
                    <div
                      key={o.paymentId}
                      className="bg-gray-50 rounded-xl px-3 py-3"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="text-xs font-semibold text-gray-800">
                            {o.orderNumber}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {o.customerName} · {o.customerPhone}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-emerald-600">
                            {fmt(o.collectedAmount)}
                          </p>
                          <p className="text-[10px] text-gray-400 capitalize">
                            {o.paymentMode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">
                          Order total: {fmt(o.orderTotal)}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          by {o.collectedByName} · {fmtTime(o.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-400 text-xs">
                    No collections recorded
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── TRANSACTIONS ── */}
        {activeTab === "transactions" && (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
              <Label>All transactions</Label>
            </div>
            {transactions?.map((t, i) => {
              const isCredit = t.amount > 0;
              const Icon =
                t.type === "opening"
                  ? ArrowDownLeft
                  : t.type === "closing"
                    ? ArrowUpRight
                    : ArrowRightLeft;
              return (
                <div
                  key={t.id}
                  className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${isCredit ? "bg-emerald-50" : "bg-red-50"}`}
                  >
                    <Icon
                      size={13}
                      className={isCredit ? "text-emerald-600" : "text-red-500"}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800">
                      {t.description}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {t.userName} · {fmtDateTime(t.createdAt)}
                    </p>
                    {t.notes && (
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {t.notes}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`text-sm font-bold ${isCredit ? "text-emerald-600" : "text-red-500"}`}
                    >
                      {isCredit ? "+" : ""}
                      {fmt(t.amount)}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      bal {fmt(t.balanceAfter)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftHistoryDetailsPage;
