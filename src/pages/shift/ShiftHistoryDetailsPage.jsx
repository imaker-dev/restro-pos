import {
  ArrowLeft,
  ArrowRight,
  BarChart2,
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  Hash,
  IndianRupee,
  Layers,
  Lock,
  Package,
  ReceiptIndianRupee,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Truck,
  Unlock,
  User,
  Utensils,
  Wallet,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "../../hooks/useQueryParams";
import LoadingOverlay from "../../components/LoadingOverlay";
import { fetchShiftHistoryByid } from "../../redux/slices/shiftSlice";
import { formatNumber, num } from "../../utils/numberFormatter";
import StatCard from "../../components/StatCard";
import { useNavigate } from "react-router-dom";
import { formatDate, formatDurationBetween } from "../../utils/dateFormatter";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import PayRow from "../../partial/report/daily-sales-report/PayRow";
import SmartTable from "../../components/SmartTable";
import StatusBadge from "../../layout/StatusBadge";
import Tabs from "../../components/Tabs";
import OrderBadge from "../../partial/order/OrderBadge";

function FieldRow({
  label,
  value,
  valueClass = "text-slate-800",
  border = true,
}) {
  return (
    <div
      className={`flex items-center justify-between gap-6 py-2.5 ${border ? "border-b border-slate-100" : ""}`}
    >
      <span className="text-[11.5px] text-slate-500 font-medium whitespace-nowrap">
        {label}
      </span>
      <span
        className={`text-[12px] font-bold tabular-nums text-right ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}

const ShiftHistoryDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shiftId } = useQueryParams();

  const [activeTab, setActiveTab] = useState("transaction");
  const { shiftHistoryDetails: shift, isFetchingShiftHistoryDetails } =
    useSelector((state) => state.shift);

  const {
    transactions = [],
    staffActivity = [],
    orderStats,
    paymentBreakdown,
    paymentSummary,
    orders,
  } = shift || {};

  const isOpen = shift?.status === "open";

  const maxStaff = Math.max(...staffActivity.map((s) => num(s.totalSales)), 1);

  useEffect(() => {
    if (shiftId) {
      dispatch(fetchShiftHistoryByid(shiftId));
    }
  }, [shiftId]);

  if (isFetchingShiftHistoryDetails) {
    return <LoadingOverlay text="Getching shift history..." />;
  }

  const variance = Number(shift?.cashVariance || 0);

  const duration = shift
    ? formatDurationBetween(shift?.openingTime, shift?.closingTime)
    : null;

  const kpiTiles = [
    {
      label: "Opening Cash",
      value: formatNumber(shift?.openingCash, true),
      sub: "Float at start",
      color: "blue",
      icon: IndianRupee,
    },
    {
      label: "Closing Cash",
      value: formatNumber(shift?.closingCash, true),
      sub: "Cash at end",
      color: "violet",
      icon: Wallet,
    },
    {
      label: "Total Orders",
      value: formatNumber(shift?.totalOrders),
      sub: shift?.cancelledOrders
        ? `${formatNumber(shift.cancelledOrders)} cancelled`
        : "processed",
      color: "slate",
      icon: ShoppingBag,
    },
    {
      label: "Cash Variance",
      value: variance === 0 ? "Balanced" : formatNumber(Math.abs(variance)),
      sub:
        variance > 0 ? "Surplus" : variance < 0 ? "Shortage" : "No discrepancy",
      color: variance > 0 ? "emerald" : variance < 0 ? "rose" : "slate",
      icon:
        variance > 0 ? TrendingUp : variance < 0 ? TrendingDown : CheckCircle2,
    },
  ];

  const orderStatsData = [
    // ── Core Orders ──
    {
      label: "Total Orders",
      value: formatNumber(orderStats?.totalOrders),
      icon: ShoppingBag,
      color: "slate",
    },
    {
      label: "Completed Orders",
      value: formatNumber(orderStats?.completedOrders),
      icon: CheckCircle2,
      color: "emerald",
    },
    {
      label: "Cancelled Orders",
      value: formatNumber(orderStats?.cancelledOrders),
      icon: XCircle,
      color: "rose",
    },

    // ── Order Types ──
    {
      label: "Dine-In",
      value: formatNumber(orderStats?.dineInOrders),
      icon: Utensils,
      color: "blue",
    },
    {
      label: "Takeaway",
      value: formatNumber(orderStats?.takeawayOrders),
      icon: Package,
      color: "amber",
    },
    {
      label: "Delivery",
      value: formatNumber(orderStats?.deliveryOrders),
      icon: Truck,
      color: "cyan",
    },

    // ── Order Value Metrics ──
    {
      label: "Avg Order Value",
      value: formatNumber(orderStats?.avgOrderValue, true),
      icon: IndianRupee,
      color: "violet",
    },
    {
      label: "Max Order Value",
      value: formatNumber(orderStats?.maxOrderValue, true),
      icon: TrendingUp,
      color: "emerald",
    },
    {
      label: "Min Order Value",
      value: formatNumber(orderStats?.minOrderValue, true),
      icon: TrendingDown,
      color: "rose",
    },
  ];

  const tabs = [
    {
      id: "transaction",
      label: "Transactions",
      icon: ReceiptIndianRupee,
      count: transactions.length,
    },
    {
      id: "order",
      label: "All Orders",
      icon: Package,
      count: orders?.length,
    },
  ];

  const transactionColumns = [
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (row) => {
        const type = row.type?.toLowerCase();

        const styles = {
          opening: "bg-green-50 text-green-700",
          closing: "bg-red-50 text-red-700",
        };

        return (
          <span
            className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize ${
              styles[type] || "bg-slate-100 text-slate-700"
            }`}
          >
            {type?.replace("_", " ") || "unknown"}
          </span>
        );
      },
    },

    {
      key: "description",
      label: "Description",
      sortable: false,
      render: (row) => (
        <div className="leading-tight max-w-[240px]">
          <div className="text-slate-800 font-medium">
            {row.description || "—"}
          </div>

          {row.notes && (
            <div
              className="text-xs text-slate-500 truncate mt-0.5"
              title={row.notes}
            >
              {row.notes}
            </div>
          )}
        </div>
      ),
    },

    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (row) => {
        const isDebit = row.amount < 0;

        return (
          <div className="font-semibold">
            <span className={isDebit ? "text-red-600" : "text-green-600"}>
              {isDebit ? "-" : "+"}
              {formatNumber(Math.abs(row.amount), true)}
            </span>
          </div>
        );
      },
    },

    {
      key: "balance",
      label: "Balance",
      sortable: true,
      render: (row) => {
        const increased = row.balanceAfter > row.balanceBefore;

        return (
          <div className="flex items-center gap-2 min-w-[140px]">
            <div className="text-sm text-slate-700">
              {formatNumber(row.balanceBefore, true)}
            </div>

            <ArrowRight
              size={16}
              className={increased ? "text-green-600" : "text-red-600"}
            />

            <div className="font-semibold text-slate-800">
              {formatNumber(row.balanceAfter, true)}
            </div>
          </div>
        );
      },
    },

    {
      key: "user",
      label: "User",
      sortable: true,
      render: (row) => (
        <div className="leading-tight max-w-[160px]">
          <div className="text-sm text-slate-700 font-medium truncate">
            {row.userName || "—"}
          </div>
        </div>
      ),
    },

    {
      key: "createdAt",
      label: "Time",
      sortable: true,
      render: (row) => (
        <div className="leading-tight">
          <div className="text-sm text-slate-700">
            {formatDate(row.createdAt, "longTime")}
          </div>
        </div>
      ),
    },
  ];

  const orderColumns = [
    {
      key: "orderNumber",
      label: "Order",
      sortable: true,
      sortKey: "createdAt",
      render: (row) => (
        <div className="leading-tight max-w-[160px]">
          <div
            className="font-semibold text-slate-800 truncate"
            title={row.orderNumber}
          >
            {row.orderNumber}
          </div>

          <div className="text-xs text-slate-500">
            {formatDate(row.createdAt, "longTime")}
          </div>
        </div>
      ),
    },

    {
      key: "orderType",
      label: "Type",
      sortable: true,
      render: (row) => <OrderBadge type="type" value={row.orderType} />,
    },

    {
      key: "table",
      label: "Table",
      sortable: true,
      render: (row) => (
        <div className="leading-tight max-w-[120px]">
          <div className="font-medium text-slate-700">
            {row.tableNumber || "—"}
          </div>

          <div className="text-xs text-slate-500">
            {row.tableName || "No Table"}
          </div>
        </div>
      ),
    },

    {
      key: "items",
      label: "Items",
      sortable: false,
      render: (row) => (
        <div className="leading-tight max-w-[220px]">
          <div className="text-sm text-slate-700 font-medium">
            {row.items?.length || 0} items
          </div>

          <div
            className="text-xs text-slate-500 truncate"
            title={row.items?.map((i) => i.itemName).join(", ")}
          >
            {row.items
              ?.slice(0, 2)
              .map((i) => i.itemName)
              .join(", ")}
            {row.items?.length > 2 && " ..."}
          </div>
        </div>
      ),
    },

    {
      key: "status",
      label: "Order Status",
      sortable: true,
      render: (row) => <OrderBadge type="status" value={row.status} />,
    },

    {
      key: "paymentStatus",
      label: "Payment",
      sortable: true,
      render: (row) => (
        <div className="leading-tight">
          <OrderBadge type="payment" value={row.paymentStatus} />

          <div className="text-xs text-slate-500 mt-1">
            {row.paymentMode || "—"}
          </div>
        </div>
      ),
    },

    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (row) => {
        const due = row.totalAmount - row.paidAmount;

        return (
          <div className="leading-tight min-w-[120px]">
            <div className="font-semibold text-slate-800">
              {formatNumber(row.totalAmount, true)}
            </div>

            <div className="text-xs text-green-600">
              Paid {formatNumber(row.paidAmount, true)}
            </div>

            {due > 0 && (
              <div className="text-xs text-red-500">
                Due {formatNumber(due, true)}
              </div>
            )}
          </div>
        );
      },
    },

    {
      key: "staff",
      label: "Staff",
      sortable: true,
      render: (row) => (
        <div className="text-sm text-slate-700 max-w-[140px] truncate">
          {row.createdByName || "—"}
        </div>
      ),
    },
  ];

  const orderActions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) => navigate(`/orders/details?orderId=${row.id}`),
    },
  ];

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[12px] font-semibold text-slate-500 hover:text-slate-800 transition-colors group"
      >
        <span className="w-7 h-7 rounded-lg border border-slate-200 bg-white shadow-sm flex items-center justify-center group-hover:border-slate-300 transition-colors">
          <ArrowLeft size={13} className="text-slate-500" strokeWidth={2.5} />
        </span>
        Back to Shift History
      </button>

      {/* ── UNIVERSAL SHIFT HERO ── */}
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            {/* Avatar + Identity */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/15 border border-white/20 backdrop-blur">
                <User size={22} strokeWidth={1.7} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h1 className="text-[20px] font-bold leading-none truncate">
                    {shift.cashierName}
                  </h1>

                  <StatusBadge
                    value={isOpen}
                    trueText="Open"
                    falseText="Closed"
                    size="sm"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {shift.floorName && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 border border-white/20 text-[10px] text-white/80">
                      <Layers size={12} />
                      {shift.floorName}
                    </span>
                  )}
                  {shift.outletName && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 border border-white/20 text-[10px] text-white/80">
                      <Hash size={12} />
                      {shift.outletName}
                    </span>
                  )}
                  <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 border border-white/20 text-[10px] text-white/80">
                    <CalendarDays size={12} />
                    {formatDate(shift.sessionDate, "long")}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 border border-white/20 text-[10px] text-white/80">
                    <Hash size={12} />
                    Shift #{shift.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Sales */}
            <div className="flex-shrink-0 sm:text-right">
              <p className="text-[9px] font-semibold text-white/70 uppercase tracking-wider">
                Total Sales
              </p>
              <p className="text-[32px] font-bold tabular-nums leading-none">
                {formatNumber(shift.totalSales, true)}
              </p>
              <p className="text-[11px] text-white/70 mt-1">
                {formatNumber(shift.totalOrders)} orders processed
              </p>
            </div>
          </div>

          {/* Bottom Metrics */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              {
                icon: Unlock,
                label: "Opened",
                primary: formatDate(shift.openingTime, "time"),
                secondary: formatDate(shift.openingTime, "long"),
              },
              {
                icon: Lock,
                label: "Closed",
                primary: shift.closingTime
                  ? formatDate(shift.closingTime, "time")
                  : "In Progress",
                secondary: shift.closingTime
                  ? formatDate(shift.closingTime, "long")
                  : "—",
              },
              {
                icon: Clock,
                label: "Duration",
                primary: duration || "—",
                secondary: isOpen ? "Shift active" : "Total session time",
              },
            ].map(({ icon: Icon, label, primary, secondary }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm"
              >
                <Icon size={13} strokeWidth={2} />

                <div className="min-w-0">
                  <p className="text-[9px] font-semibold text-white/70 uppercase tracking-wide">
                    {label}
                  </p>
                  <p className="text-[14px] font-bold tabular-nums leading-none truncate">
                    {primary}
                  </p>
                  <p className="text-[9px] text-white/70 truncate">
                    {secondary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpiTiles.map(({ label, value, sub, color, icon: Icon }) => (
          <StatCard
            key={label}
            title={label}
            icon={Icon}
            value={value}
            subtitle={sub}
            color={color}
            variant="v9"
            mode="solid"
          />
        ))}
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        style={{ animationDelay: "120ms" }}
      >
        {/* ── LEFT (2 cols) ───────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Cash + Payments row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cash Summary */}
            <MetricPanel
              icon={Wallet}
              title="Cash Summary"
              desc="Opening · Closing · Variance"
            >
              <div>
                <FieldRow
                  label="Opening Cash"
                  value={formatNumber(shift.openingCash, true)}
                />
                <FieldRow
                  label="Closing Cash"
                  value={formatNumber(shift.closingCash, true)}
                />
                <FieldRow
                  label="Expected Cash"
                  value={formatNumber(shift.expectedCash, true)}
                  valueClass="text-slate-400"
                  border={false}
                />
              </div>
            </MetricPanel>

            {/* Payment breakdown from summary */}
            <MetricPanel
              icon={Wallet}
              title="Payment Collection"
              desc="Sales by payment type"
              right={
                <span className="text-[13px] font-black text-slate-900 tabular-nums">
                  {formatNumber(paymentSummary?.total, true)}
                </span>
              }
            >
              {Object.entries(paymentSummary || {})
                .filter(([key, amount]) => key !== "total" && num(amount) > 0)
                .map(([mode, amount]) => (
                  <PayRow
                    key={mode}
                    type={mode}
                    amount={amount}
                    total={paymentSummary?.total || 1}
                  />
                ))}

              {(!paymentSummary || paymentSummary.total === 0) && (
                <p className="text-[12px] text-slate-400 text-center py-6">
                  No payment data
                </p>
              )}
            </MetricPanel>
          </div>

          {/* Order Statistics */}
          <MetricPanel
            icon={BarChart2}
            title="Order Statistics"
            desc="Performance breakdown for this shift"
          >
            <div className="grid grid-cols-2 md:grid-cols-3  gap-3">
              {orderStatsData?.map((item) => (
                <StatCard
                  key={item.label}
                  title={item.label}
                  value={item.value}
                  icon={item.icon}
                  color={item.color}
                  variant="v5"
                  // mode="solid"
                />
              ))}
            </div>
          </MetricPanel>
        </div>

        {/* ── RIGHT SIDEBAR ───────────────────────────────── */}
        <div className="space-y-4">
          {/* Shift Details */}
          <MetricPanel icon={CalendarDays} title="Shift Details">
            <FieldRow
              label="Session Date"
              value={formatDate(shift.sessionDate, "long")}
            />
            <FieldRow
              label="Opened At"
              value={formatDate(shift.openingTime, "time")}
            />
            <FieldRow
              label="Closed At"
              value={
                shift.closingTime ? formatDate(shift.closingTime, "time") : "—"
              }
            />
            <FieldRow label="Duration" value={duration || "—"} border={false} />
          </MetricPanel>

          {/* Staff Activity */}
          {staffActivity.length > 0 && (
            <MetricPanel
              icon={User}
              title="Staff Activity"
              desc="Per cashier performance"
            >
              <div className="space-y-4">
                {[...staffActivity]
                  .sort((a, b) => num(b.totalSales) - num(a.totalSales))
                  .map((s) => (
                    <div key={s.userId}>
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                          <User
                            size={13}
                            className="text-white"
                            strokeWidth={2}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-black text-slate-800 truncate leading-tight">
                            {s.userName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {s.ordersHandled} orders ·{" "}
                            {formatNumber(s.totalSales, true)}
                          </p>
                        </div>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-slate-700 transition-all duration-700"
                          style={{
                            width: `${(num(s.totalSales) / maxStaff) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </MetricPanel>
          )}

          {/* Session Activity */}
          {(shift.openedByName || shift.closedByName) && (
            <MetricPanel icon={User} title="Staff Activity">
              <div className="space-y-2.5">
                {shift.openedByName && (
                  <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                      <Unlock
                        size={12}
                        className="text-emerald-600"
                        strokeWidth={2.5}
                      />
                    </div>
                    <div>
                      <p className="text-[8.5px] font-black text-emerald-500 uppercase tracking-wider">
                        Opened by
                      </p>
                      <p className="text-[12.5px] font-black text-slate-800">
                        {shift.openedByName}
                      </p>
                    </div>
                  </div>
                )}
                {shift.closedByName && (
                  <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-slate-100 border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-slate-200 border border-slate-300 flex items-center justify-center flex-shrink-0">
                      <Lock
                        size={12}
                        className="text-slate-600"
                        strokeWidth={2.5}
                      />
                    </div>
                    <div>
                      <p className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider">
                        Closed by
                      </p>
                      <p className="text-[12.5px] font-black text-slate-800">
                        {shift.closedByName}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </MetricPanel>
          )}
        </div>
      </div>

      {/* ── Tab switcher ── */}
      <Tabs
        tabs={tabs}
        active={activeTab}
        onChange={setActiveTab}
        variant="v2"
      />

      {activeTab === "transaction" && (
        <SmartTable
          title={"Transactions"}
          totalcount={transactions?.length}
          data={transactions}
          columns={transactionColumns}
          loading={isFetchingShiftHistoryDetails}
          //   actions={rowActions}
        />
      )}

      {activeTab === "order" && (
        <SmartTable
          title={"Orders"}
          totalcount={orders?.length}
          data={orders}
          columns={orderColumns}
          loading={isFetchingShiftHistoryDetails}
          actions={orderActions}
        />
      )}
    </div>
  );
};

export default ShiftHistoryDetailsPage;
