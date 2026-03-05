import React, { useEffect } from "react";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../layout/PageHeader";
import { fetchCustomerById } from "../../redux/slices/customerSlice";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  BadgeCheck,
  Hash,
  ReceiptText,
  CreditCard,
  Tag,
  Activity,
  ChevronRight,
  BarChart3,
  CalendarDays,
} from "lucide-react";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber, num } from "../../utils/numberFormatter";
import StatCard from "../../components/StatCard";
import OrderBadge from "../../partial/order/OrderBadge";
import LoadingOverlay from "../../components/LoadingOverlay";

// ─── Card ──────────────────────────────────────────────────
function Card({ children, className = "", noPad = false }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 overflow-hidden ${className}`}
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {noPad ? children : <div className="p-5">{children}</div>}
    </div>
  );
}

function CardHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
      <div className="w-8 h-8 rounded-xl bg-primary-500 flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-white" strokeWidth={2} />
      </div>
      <div>
        <p className="text-[13px] font-black text-slate-800 leading-none">
          {title}
        </p>
        {subtitle && (
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Info row ──────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, last = false, mono = false }) {
  if (!value && value !== 0) return null;
  return (
    <div
      className={`flex items-center gap-3 py-3 ${!last ? "border-b border-slate-100" : ""}`}
    >
      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Icon size={12} className="text-slate-500" strokeWidth={2} />
      </div>
      <span className="text-[11.5px] text-slate-500 font-medium flex-1">
        {label}
      </span>
      <span
        className={`text-[12px] font-bold text-slate-800 text-right ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Stat tile ─────────────────────────────────────────────
function StatTile({ icon: Icon, label, value, sub, dark = false }) {
  if (dark)
    return (
      <div
        className="relative bg-slate-900 rounded-2xl p-4 overflow-hidden"
        style={{ boxShadow: "0 4px 16px rgba(15,23,42,0.28)" }}
      >
        <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-white/6 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-1 mb-3">
            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.13em]">
              {label}
            </p>
            <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
              <Icon size={12} className="text-white/60" strokeWidth={2} />
            </div>
          </div>
          <p className="text-[22px] font-black text-white tabular-nums leading-none">
            {value}
          </p>
          {sub && (
            <p className="text-[9.5px] text-white/35 font-medium mt-1.5">
              {sub}
            </p>
          )}
        </div>
      </div>
    );

  return (
    <Card>
      <div className="flex items-start justify-between gap-1 mb-3">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.13em]">
          {label}
        </p>
        <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
          <Icon size={12} className="text-slate-500" strokeWidth={2} />
        </div>
      </div>
      <p className="text-[22px] font-black text-slate-900 tabular-nums leading-none">
        {value}
      </p>
      {sub && (
        <p className="text-[9.5px] text-slate-400 font-medium mt-1.5">{sub}</p>
      )}
    </Card>
  );
}

// ─── Order history row ─────────────────────────────────────
function OrderRow({ order, isLast }) {
  return (
    <div
      className={`flex items-center gap-4 py-3.5 ${!isLast ? "border-b border-slate-100" : ""} hover:bg-slate-50/60 transition-colors duration-100 px-5`}
    >
      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
        <ShoppingBag size={13} className="text-slate-500" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-[12px] font-black text-slate-800 font-mono">
            {order?.orderNumber || order?.order_number}
          </p>

          <OrderBadge value={order?.status} />
        </div>
        <p className="text-[10px] text-slate-400 font-medium">
          {formatDate(order?.createdAt || order?.created_at, "long")}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[13px] font-black text-slate-800 tabular-nums">
          {formatNumber(order?.totalAmount || order?.total_amount, true)}
        </p>
        <p className="text-[9px] text-slate-400 font-medium capitalize mt-0.5">
          {order?.orderType || order?.order_type}
        </p>
      </div>
      <ChevronRight
        size={14}
        className="text-slate-300 flex-shrink-0"
        strokeWidth={2}
      />
    </div>
  );
}

// ─── Breakdown bar ─────────────────────────────────────────
function BreakdownBar({ label, count, total, color }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
      <span className="text-[11px] text-slate-600 font-medium w-24 flex-shrink-0 capitalize">
        {label}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-[11px] font-black text-slate-700 tabular-nums w-6 text-right">
        {count}
      </span>
      <span className="text-[9px] text-slate-400 w-8 text-right tabular-nums">
        {pct.toFixed(0)}%
      </span>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────
const CustomerDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customerId } = useQueryParams();
  const { outletId } = useSelector((s) => s.auth);
  const { customerDetails, isfetchingCustomerDetails } = useSelector(
    (s) => s.customer,
  );

  useEffect(() => {
    if (customerId) dispatch(fetchCustomerById({ customerId, outletId }));
  }, [customerId, outletId]);

  const {
    customer,
    historyStats: hs,
    historyBreakdown: hb,
    orderHistory = [],
  } = customerDetails || {};

  const totalBreakdown = (hb?.byOrderType || []).reduce(
    (s, t) => s + num(t.count),
    0,
  );
  const totalPay = (hb?.byPaymentStatus || []).reduce(
    (s, t) => s + num(t.count),
    0,
  );

  const orderStats = [
    {
      label: "Total Orders",
      value: formatNumber(hs?.totalOrders),
      sub: "All time",
      icon: ShoppingBag,
      color: "slate",
    },
    {
      label: "Paid Orders",
      value: formatNumber(hs?.fullyPaidOrders),
      sub: "Fully settled",
      icon: CheckCircle2,
      color: "green",
    },
    {
      label: "Cancelled",
      value: formatNumber(hs?.cancelledOrders),
      sub: "Orders voided",
      icon: XCircle,
      color: "red",
    },
    {
      label: "Active Orders",
      value: formatNumber(hs?.activeOrders),
      sub: "Currently open",
      icon: Activity,
      color: "blue",
    },
  ];

  if (isfetchingCustomerDetails) {
    return <LoadingOverlay text="Loading Customer Details..." />;
  }
  return (
    <div className="space-y-5">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[12px] font-semibold text-slate-500 hover:text-slate-800 transition-colors group"
        style={{ animationDelay: "0ms" }}
      >
        <span className="w-7 h-7 rounded-lg border border-slate-200 bg-white shadow-sm flex items-center justify-center group-hover:border-slate-300">
          <ArrowLeft size={13} className="text-slate-500" strokeWidth={2.5} />
        </span>
        Back to Customers
      </button>

      {/* ── CUSTOMER HERO (UNIVERSAL STYLE) ── */}
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
            {/* Left Section */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/15 border border-white/20 backdrop-blur text-[18px] font-black select-none">
                {(customer?.name || "C").charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-semibold text-white/70 uppercase tracking-wider">
                  Customer Profile
                </p>

                <h1 className="text-[18px] font-bold leading-tight truncate">
                  {customer?.name}
                </h1>

                <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-white/75">
                  {customer?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone size={10} className="text-white/50" />
                      {customer?.phone}
                    </span>
                  )}

                  {customer?.email && (
                    <span className="flex items-center gap-1">
                      <Mail size={10} className="text-white/50" />
                      {customer?.email}
                    </span>
                  )}

                  <span className="flex items-center gap-1">
                    <Hash size={10} className="text-white/50" />
                    ID #{customer?.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="sm:text-right flex-shrink-0">
              <p className="text-[9px] font-semibold text-white/70 uppercase tracking-wide">
                Total Spent
              </p>

              <p className="text-[28px] font-bold tabular-nums leading-none">
                {formatNumber(customer?.totalSpent, true)}
              </p>

              <p className="text-[11px] text-white/70 mt-1">
                {num(customer?.totalOrders)} lifetime orders
              </p>
            </div>
          </div>

          {/* Metric Strip */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              {
                icon: Calendar,
                label: "Customer Since",
                value: customer?.createdAt
                  ? formatDate(customer?.createdAt, "long")
                  : "—",
              },
              {
                icon: Clock,
                label: "Last Order",
                value: customer?.lastOrderAt
                  ? formatDate(customer?.lastOrderAt, "long")
                  : "No orders",
              },
              {
                icon: TrendingUp,
                label: "Avg Order",
                value: formatNumber(customer?.avgOrderValue, true),
              },
            ].map(({ icon: Icon, label, value }) => (
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
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ 4 STAT TILES ══════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {orderStats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            title={stat.label}
            value={stat.value}
            color={stat.color}
            variant="v9"
          />
        ))}
      </div>

      {/* ══ MAIN GRID ═════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Customer profile */}
          <Card noPad>
            <CardHeader
              icon={User}
              title="Customer Profile"
              subtitle="Contact and account information"
            />
            <div className="px-5 py-1 pb-3">
              <InfoRow icon={User} label="Full Name" value={customer?.name} />
              <InfoRow
                icon={Phone}
                label="Phone"
                value={customer?.phone}
                mono
              />
              <InfoRow
                icon={Mail}
                label="Email"
                value={customer?.email || "—"}
              />
              <InfoRow
                icon={MapPin}
                label="Address"
                value={customer?.address || "—"}
              />
              <InfoRow
                icon={Hash}
                label="Customer ID"
                value={`#${customer?.id}`}
                mono
              />
              <InfoRow
                icon={Calendar}
                label="Joined"
                value={
                  customer?.createdAt
                    ? formatDate(customer?.createdAt, "long")
                    : "—"
                }
                last
              />
            </div>
          </Card>

          {/* GST info — only if GST customer */}
          {customer?.isGstCustomer && (
            <Card noPad>
              <CardHeader
                icon={BadgeCheck}
                title="GST Details"
                subtitle="Business and tax information"
              />
              <div className="px-5 py-1 pb-3">
                <InfoRow
                  icon={Building2}
                  label="Company"
                  value={customer?.companyName || "—"}
                />
                <InfoRow
                  icon={Hash}
                  label="GSTIN"
                  value={customer?.gstin || "—"}
                  mono
                />
                <InfoRow
                  icon={MapPin}
                  label="GST State"
                  value={
                    customer?.gstState
                      ? `${customer?.gstState} (${customer?.gstStateCode})`
                      : "—"
                  }
                />
                <InfoRow
                  icon={Phone}
                  label="Company Ph."
                  value={customer?.companyPhone || "—"}
                  mono
                />
                <InfoRow
                  icon={MapPin}
                  label="Company Addr"
                  value={customer?.companyAddress || "—"}
                  last
                />
              </div>
            </Card>
          )}

          {/* Order history */}
          <Card noPad>
            <CardHeader
              icon={ReceiptText}
              title="Order History"
              subtitle={`${num(hs?.totalOrders)} total orders`}
            />
            {orderHistory.length > 0 ? (
              <div className="divide-y-0">
                {orderHistory.map((order, i) => (
                  <OrderRow
                    key={order.id || i}
                    order={order}
                    isLast={i === orderHistory.length - 1}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-5">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                  <ShoppingBag
                    size={20}
                    className="text-slate-300"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-[13px] font-bold text-slate-400">
                  No orders yet
                </p>
                <p className="text-[11px] text-slate-300 font-medium mt-1">
                  This customer hasn't placed any orders
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* RIGHT sidebar */}
        <div className="space-y-4">
          {/* Stats summary */}
          <Card noPad>
            <CardHeader icon={TrendingUp} title="Spending Summary" />
            <div className="px-5 py-1 pb-3">
              {[
                {
                  label: "Total Spent",
                  v: formatNumber(hs?.totalSpent, true),
                  mono: false,
                },
                {
                  label: "Avg Order Value",
                  v: formatNumber(hs?.avgOrderValue, true),
                  mono: false,
                },
                {
                  label: "First Order",
                  v: hs?.firstOrderAt
                    ? formatDate(hs.firstOrderAt, "long")
                    : "—",
                  mono: false,
                },
                {
                  label: "Last Order",
                  v: hs?.lastOrderAt ? formatDate(hs.lastOrderAt, "long") : "—",
                  mono: false,
                },
              ].map(({ label, v, mono }, i, arr) => (
                <div
                  key={label}
                  className={`flex items-center justify-between gap-4 py-3 ${i < arr.length - 1 ? "border-b border-slate-100" : ""}`}
                >
                  <span className="text-[11.5px] text-slate-500 font-medium">
                    {label}
                  </span>
                  <span
                    className={`text-[12px] font-bold text-slate-800 tabular-nums ${mono ? "font-mono" : ""}`}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Order type breakdown */}
          {(hb?.byOrderType || []).length > 0 && (
            <Card noPad>
              <CardHeader icon={Tag} title="By Order Type" />
              <div className="px-5 py-3">
                {hb.byOrderType.map((t) => (
                  <BreakdownBar
                    key={t.type}
                    label={t.orderType}
                    count={num(t.count)}
                    total={totalBreakdown}
                    color="#6366f1"
                  />
                ))}
              </div>
            </Card>
          )}

          {/* Payment status breakdown */}
          {(hb?.byPaymentStatus || []).length > 0 && (
            <Card noPad>
              <CardHeader icon={CreditCard} title="By Payment Status" />
              <div className="px-5 py-3">
                {hb.byPaymentStatus.map((t) => {
                  const colors = {
                    paid: "#10b981",
                    pending: "#f59e0b",
                    partial: "#6366f1",
                    failed: "#f43f5e",
                  };
                  return (
                    <BreakdownBar
                      key={t.status}
                      label={t.paymentStatus}
                      count={num(t.count)}
                      total={totalPay}
                      color={colors[t.status] || "#64748b"}
                    />
                  );
                })}
              </div>
            </Card>
          )}

          {/* Notes */}
          {customer?.notes && (
            <Card noPad>
              <CardHeader icon={Star} title="Notes" />
              <div className="px-5 py-4">
                <p className="text-[12px] text-slate-600 leading-relaxed">
                  {customer?.notes}
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsPage;
