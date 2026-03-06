import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  TrendingUp,
  Users,
  ReceiptText,
  CreditCard,
  Wallet,
  Smartphone,
  Tag,
  AlertTriangle,
  Star,
  BarChart2,
  Utensils,
  UserCheck,
  BadgePercent,
  ArrowUpRight,
  CircleDollarSign,
  Activity,
  Store,
  Bike,
  Ban,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  ShoppingBag,
  TrendingDown,
  Info,
  Hash,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "../../hooks/useQueryParams";
import { fetchDailyEndSummaryDetails } from "../../redux/slices/dashboardSlice";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../layout/PageHeader";
import { formatDate } from "../../utils/dateFormatter";
import StatCard from "../../components/StatCard";
import { formatNumber } from "../../utils/numberFormatter";

// ─── Utils ────────────────────────────────────────────────────────────────────
const pct = (a, b) => (b ? +((a / b) * 100).toFixed(1) : 0);

const STATUS_CFG = {
  completed: {
    label: "Completed",
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-400",
    Icon: CheckCircle2,
  },
  confirmed: {
    label: "Confirmed",
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-400",
    Icon: Clock,
  },
  billed: {
    label: "Billed",
    badge: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
    dot: "bg-sky-400",
    Icon: ReceiptText,
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-red-50 text-red-700 ring-1 ring-red-200",
    dot: "bg-red-400",
    Icon: XCircle,
  },
};

const BAR_COLORS = [
  "bg-violet-400",
  "bg-rose-400",
  "bg-amber-400",
  "bg-sky-400",
  "bg-emerald-400",
  "bg-orange-400",
  "bg-teal-400",
  "bg-pink-400",
];

const BADGE_STYLES = [
  "bg-violet-50 text-violet-600 ring-1 ring-violet-100",
  "bg-rose-50 text-rose-600 ring-1 ring-rose-100",
  "bg-amber-50 text-amber-600 ring-1 ring-amber-100",
  "bg-sky-50 text-sky-600 ring-1 ring-sky-100",
  "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100",
  "bg-orange-50 text-orange-600 ring-1 ring-orange-100",
];

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ to, prefix = "" }) {
  const [v, setV] = useState(0);
  const r = useRef();
  useEffect(() => {
    if (!to) return;
    const t0 = performance.now();
    const run = (t) => {
      const p = Math.min((t - t0) / 1000, 1);
      setV(to * (1 - Math.pow(1 - p, 4)));
      if (p < 1) r.current = requestAnimationFrame(run);
      else setV(to);
    };
    r.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(r.current);
  }, [to]);
  return (
    <>
      {prefix}
      {Math.floor(v).toLocaleString("en-IN")}
    </>
  );
}

// ─── Animated Bar ─────────────────────────────────────────────────────────────
function Bar({ value, max, colorClass, h = "h-1.5" }) {
  const [w, setW] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setW(pct(value, max)), 300);
    return () => clearTimeout(t);
  }, [value, max]);

  return (
    <div className={`w-full bg-slate-100 rounded-full ${h} overflow-hidden`}>
      <div
        className={`${h} rounded-full ${colorClass} transition-all duration-1000 ease-out`}
        style={{ width: `${w}%` }}
      />
    </div>
  );
}

// ─── Radial Ring (FIXED) ──────────────────────────────────────────────────────
function Ring({
  value = 0,
  max = 1,
  size = 86,
  sw = 7,
  stroke,
  label,
  sub,
  textColor = "text-slate-900",
}) {
  const radius = (size - sw * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const [dashOffset, setDashOffset] = useState(circumference); // start fully hidden

  useEffect(() => {
    // reset first so animation re-triggers if value changes
    setDashOffset(circumference);
    const t = setTimeout(() => {
      const filled = Math.min(pct(value, max), 100) / 100;
      setDashOffset(circumference * (1 - filled));
    }, 300);
    return () => clearTimeout(t);
  }, [value, max, circumference]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={sw}
          />
          {/* Fill */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </svg>
        {/* Centre label — no rotation needed since we rotate SVG not the container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p
            className={`text-xl font-extrabold leading-none tabular-nums ${textColor}`}
          >
            {value}
          </p>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-bold text-slate-700">{label}</p>
        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

// ─── View All Button (Navigation Style) ───────────────────────────────────────
function ShowMoreBtn({ total, showing, onClick }) {
  return (
    <button
      onClick={onClick}
      className="mt-4 w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all group"
    >
      <div className="flex flex-col items-start">
        <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">
          View All Items
        </span>
        <span className="text-xs text-slate-400">
          {showing} shown of {total}
        </span>
      </div>

      <ArrowRight
        size={16}
        className="text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-1"
        strokeWidth={2.5}
      />
    </button>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function Empty({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
        <Icon size={22} className="text-slate-300" strokeWidth={1.5} />
      </div>
      <p className="text-xs font-semibold text-slate-300">{message}</p>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SHead({ icon: Icon, label, count }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-white" strokeWidth={2.5} />
      </div>
      <span className="text-sm font-extrabold text-slate-900 tracking-tight">
        {label}
      </span>
      {count !== undefined && (
        <span className="ml-auto text-[11px] font-bold text-slate-400 bg-slate-100 rounded-full px-2.5 py-0.5 tabular-nums">
          {count}
        </span>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function DayEndSummaryDetailsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { date } = useQueryParams();
  const { outletId } = useSelector((state) => state.auth);
  const { dailyEndSummaryDetails: d, isFetchingDailyEndSummaryDetails } =
    useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDailyEndSummaryDetails({ outletId, date }));
  }, [outletId, date]);

  // Show-more states
  const [showAllCats, setShowAllCats] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [showAllStaff, setShowAllStaff] = useState(false);

  const CAT_LIMIT = 6;
  const ITEM_LIMIT = 6;
  const ORDER_LIMIT = 8;
  const STAFF_LIMIT = 2;

  if (isFetchingDailyEndSummaryDetails) return <LoadingOverlay />;

  const s = d?.summary;
  const totalCollected =
    (d?.paymentBreakdown?.cash?.amount ?? 0) +
    (d?.paymentBreakdown?.card?.amount ?? 0) +
    (d?.paymentBreakdown?.upi?.amount ?? 0);
  const maxCat = d?.categoryBreakdown?.length
    ? Math.max(...d.categoryBreakdown.map((c) => c.totalSales))
    : 1;
  const maxItem = d?.topSellingItems?.length
    ? Math.max(...d.topSellingItems.map((i) => i.totalSales))
    : 1;
  const billedCount =
    d?.orders?.filter((o) => o.status === "billed").length ?? 0;

  const visibleCats = showAllCats
    ? d?.categoryBreakdown
    : d?.categoryBreakdown?.slice(0, CAT_LIMIT);
  const visibleItems = showAllItems
    ? d?.topSellingItems
    : d?.topSellingItems?.slice(0, ITEM_LIMIT);
  const visibleOrders = showAllOrders
    ? d?.orders
    : d?.orders?.slice(0, ORDER_LIMIT);
  const visibleStaff = showAllStaff
    ? d?.staffPerformance
    : d?.staffPerformance?.slice(0, STAFF_LIMIT);

  return (
    <div className="space-y-5 pb-10">
      <PageHeader title={formatDate(d?.date, "long")} showBackButton />

      {/* ── ROW 1: Hero + Order Distribution ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Hero */}
        <div className="lg:col-span-8 rounded-3xl bg-slate-900 overflow-hidden shadow-xl shadow-slate-900/10">
          <div className="h-1 bg-gradient-to-r from-violet-500 via-emerald-400 to-amber-400" />
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-[0.14em] mb-2">
                  Today's Net Revenue
                </p>
                <p className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-none tabular-nums">
                  <Counter to={s?.netSales ?? 0} prefix={"\u20B9"} />
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <div className="flex items-center gap-1 bg-emerald-500/15 rounded-full px-2.5 py-1">
                    <CheckCircle2
                      size={10}
                      className="text-emerald-400"
                      strokeWidth={2.5}
                    />
                    <span className="text-[10px] font-bold text-emerald-400">
                      {s?.completedOrders ?? 0} completed
                    </span>
                  </div>
                  {(s?.cancelledOrders ?? 0) > 0 && (
                    <div className="flex items-center gap-1 bg-red-500/15 rounded-full px-2.5 py-1">
                      <XCircle
                        size={10}
                        className="text-red-400"
                        strokeWidth={2.5}
                      />
                      <span className="text-[10px] font-bold text-red-400">
                        {s.cancelledOrders} cancelled
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 bg-amber-500/15 rounded-full px-2.5 py-1">
                    <Users
                      size={10}
                      className="text-amber-400"
                      strokeWidth={2.5}
                    />
                    <span className="text-[10px] font-bold text-amber-400">
                      {s?.totalGuests ?? 0} guests
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                <TrendingUp
                  size={24}
                  className="text-emerald-400"
                  strokeWidth={2}
                />
              </div>
            </div>

            {/* KPI tiles */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[
                {
                  label: "Total Orders",
                  val: s?.totalOrders,
                  Icon: ReceiptText,
                  prefix: "",
                },
                {
                  label: "Total Guests",
                  val: s?.totalGuests,
                  Icon: Users,
                  prefix: "",
                },
                {
                  label: "Avg Order",
                  val: Math.round(s?.avgOrderValue ?? 0),
                  Icon: CircleDollarSign,
                  prefix: "\u20B9",
                },
                {
                  label: "Max Bill",
                  val: s?.maxOrderValue,
                  Icon: ArrowUpRight,
                  prefix: "\u20B9",
                },
                {
                  label: "Min Bill",
                  val: s?.minOrderValue,
                  Icon: TrendingDown,
                  prefix: "\u20B9",
                },
              ].map(({ label, val, Icon, prefix }) => (
                <div
                  key={label}
                  className="bg-white/5 rounded-2xl px-2 sm:px-3 py-3 sm:py-3.5 text-center"
                >
                  <Icon
                    size={13}
                    className="text-slate-500 mx-auto mb-1.5 sm:mb-2"
                    strokeWidth={2}
                  />
                  <p className="text-base sm:text-lg font-extrabold text-white leading-none tabular-nums">
                    {prefix}
                    {typeof val === "number"
                      ? val.toLocaleString("en-IN")
                      : (val ?? "—")}
                  </p>
                  <p className="text-[9px] text-slate-500 font-semibold mt-1 tracking-wide">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Distribution */}
        <Card className="lg:col-span-4 p-5">
          <SHead icon={Activity} label="Order Distribution" />
          <div className="flex justify-around items-center mb-5">
            {[
              {
                label: "Completed",
                count: s?.completedOrders ?? 0,
                stroke: "#10b981",
                textColor: "text-emerald-600",
              },
              {
                label: "Dine-In",
                count: s?.ordersByType?.dineIn ?? 0,
                stroke: "#6366f1",
                textColor: "text-indigo-600",
              },
              {
                label: "Takeaway",
                count: s?.ordersByType?.takeaway ?? 0,
                stroke: "#f97316",
                textColor: "text-orange-600",
              },
            ].map((ring) => (
              <Ring
                key={ring.label}
                value={ring.count}
                max={s?.totalOrders ?? 1}
                size={86}
                sw={7}
                stroke={ring.stroke}
                label={ring.label}
                sub={`${pct(ring.count, s?.totalOrders ?? 1)}%`}
                textColor={ring.textColor}
              />
            ))}
          </div>
          <div className="space-y-2.5 pt-4 border-t border-slate-50">
            {[
              {
                label: "Total Orders",
                val: s?.totalOrders ?? 0,
                dot: "bg-slate-400",
              },
              {
                label: "Delivery Orders",
                val: s?.ordersByType?.delivery ?? 0,
                dot: "bg-teal-400",
              },
              {
                label: "Cancelled",
                val: s?.cancelledOrders ?? 0,
                dot: "bg-red-400",
              },
            ].map(({ label, val, dot }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`}
                  />
                  <span className="text-xs text-slate-500 font-medium">
                    {label}
                  </span>
                </div>
                <span className="text-xs font-extrabold text-slate-800 tabular-nums">
                  {val}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── ROW 2: Sales + Payments + Floor & Discounts ──────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        {/* Sales Breakdown */}
        <Card className="md:col-span-1 lg:col-span-4 p-5">
          <SHead icon={BarChart2} label="Sales Breakdown" />
          <div>
            {[
              {
                label: "Gross Sales",
                val: s?.grossSales,
                note: "before deductions",
                type: "pos",
              },
              {
                label: "Total Discounts",
                val: s?.totalDiscount,
                note: "applied today",
                type: "neg",
              },
              {
                label: "Tax Collected",
                val: s?.totalTax,
                note: "GST / service tax",
                type: "neu",
              },
              {
                label: "Service Charge",
                val: s?.totalServiceCharge ?? 0,
                note: "on orders",
                type: "neu",
              },
            ].map(({ label, val, note, type }) => (
              <div
                key={label}
                className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {label}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {note}
                  </p>
                </div>
                <span
                  className={`text-sm font-extrabold tabular-nums ${type === "neg" ? "text-red-500" : "text-slate-700"}`}
                >
                  {type === "neg" ? "-" : ""}
                  {formatNumber(val ?? 0,true)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between bg-emerald-50 rounded-xl px-4 py-3 ring-1 ring-emerald-100">
            <div>
              <p className="text-sm font-extrabold text-slate-900">Net Sales</p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                after all deductions
              </p>
            </div>
            <p className="text-xl font-extrabold text-emerald-600 tabular-nums">
              {formatNumber(s?.netSales ?? 0,true)}
            </p>
          </div>
        </Card>

        {/* Payment Breakdown */}
        <Card className="md:col-span-1 lg:col-span-4 overflow-hidden">
          <div className="bg-slate-900 px-5 pt-5 pb-4">
            <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-[0.14em] mb-1.5">
              Total Collected
            </p>
            <p className="text-3xl font-extrabold text-white tracking-tight tabular-nums mb-4">
              <Counter to={totalCollected} prefix={"\u20B9"} />
            </p>
            <div className="grid grid-cols-3 gap-1">
              {[
                {
                  label: "Txns",
                  val:
                    (d?.paymentBreakdown?.cash?.count ?? 0) +
                    (d?.paymentBreakdown?.card?.count ?? 0) +
                    (d?.paymentBreakdown?.upi?.count ?? 0),
                },
                { label: "Tax", val: formatNumber(Math.round(s?.totalTax ?? 0,true)) },
                { label: "Disc", val: formatNumber(Math.round(s?.totalDiscount ?? 0,true)) },
              ].map(({ label, val }) => (
                <div
                  key={label}
                  className="bg-white/5 rounded-xl px-2 py-2 text-center"
                >
                  <p className="text-sm font-extrabold text-white tabular-nums">
                    {val}
                  </p>
                  <p className="text-[9px] text-slate-500 font-semibold mt-0.5 uppercase tracking-wide">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 space-y-2.5">
            {d?.paymentBreakdown ? (
              [
                {
                  mode: "Cash",
                  key: "cash",
                  Icon: Wallet,
                  iconBg: "bg-emerald-100",
                  iconCl: "text-emerald-600",
                  bar: "bg-emerald-400",
                  ring: "ring-emerald-100",
                  bg: "bg-emerald-50/50",
                  valCl: "text-emerald-700",
                },
                {
                  mode: "Card",
                  key: "card",
                  Icon: CreditCard,
                  iconBg: "bg-sky-100",
                  iconCl: "text-sky-600",
                  bar: "bg-sky-400",
                  ring: "ring-sky-100",
                  bg: "bg-sky-50/50",
                  valCl: "text-sky-700",
                },
                {
                  mode: "UPI",
                  key: "upi",
                  Icon: Smartphone,
                  iconBg: "bg-violet-100",
                  iconCl: "text-violet-600",
                  bar: "bg-violet-400",
                  ring: "ring-violet-100",
                  bg: "bg-violet-50/50",
                  valCl: "text-violet-700",
                },
              ].map(
                ({ mode, key, Icon, iconBg, iconCl, bar, ring, bg, valCl }) => {
                  const info = d.paymentBreakdown[key];
                  if (!info) return null;
                  return (
                    <div
                      key={mode}
                      className={`rounded-xl ring-1 ${ring} ${bg} px-3.5 py-3`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon size={14} className={iconCl} strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800">
                            {mode}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {info.count} txn{info.count !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p
                            className={`text-sm font-extrabold tabular-nums ${valCl}`}
                          >
                            {formatNumber(info.amount,true)}
                          </p>
                          <p className="text-[10px] text-slate-400 tabular-nums">
                            {pct(info.amount, totalCollected)}%
                          </p>
                        </div>
                      </div>
                      <Bar
                        value={info.amount}
                        max={totalCollected}
                        colorClass={bar}
                        h="h-1.5"
                      />
                    </div>
                  );
                },
              )
            ) : (
              <Empty icon={CreditCard} message="No payment data" />
            )}
          </div>
        </Card>

        {/* Floor + Discounts stacked */}
        <div className="md:col-span-2 lg:col-span-4 flex flex-col gap-5">
          <Card className="p-5 flex-1">
            <SHead icon={Store} label="Floor Performance" />
            {d?.floorBreakdown?.length > 0 ? (
              <div className="space-y-4">
                {d.floorBreakdown.map((f, i) => (
                  <div key={f.floorName}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-1.5 h-8 rounded-full flex-shrink-0 ${i === 0 ? "bg-indigo-400" : "bg-orange-400"}`}
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-none">
                            {f.floorName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                            {f.orderCount} orders
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-slate-900 tabular-nums">
                          {formatNumber(f.sales,true)}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5 tabular-nums">
                          {pct(f.sales, s?.netSales ?? 1)}% of net
                        </p>
                      </div>
                    </div>
                    <Bar
                      value={f.sales}
                      max={s?.netSales ?? 1}
                      colorClass={i === 0 ? "bg-indigo-400" : "bg-orange-400"}
                      h="h-2"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Empty icon={Store} message="No floor data available" />
            )}
          </Card>
        </div>
      </div>

      {/* ── ROW 3: Categories + Top Items ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Category Breakdown */}
        <Card className="p-5">
          <SHead
            icon={Layers}
            label="Revenue by Category"
            count={d?.categoryBreakdown?.length ?? 0}
          />
          {d?.categoryBreakdown?.length > 0 ? (
            <>
              <div className="space-y-4">
                {visibleCats.map((cat, i) => (
                  <div
                    key={cat.categoryName}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-extrabold text-white ${BAR_COLORS[i % BAR_COLORS.length]}`}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-slate-800 truncate pr-3">
                          {cat.categoryName}
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          <span className="hidden sm:block text-[10px] text-slate-400 font-medium tabular-nums">
                            {cat.totalQuantity} sold
                          </span>
                          <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                            {formatNumber(cat.totalSales,true)}
                          </span>
                        </div>
                      </div>
                      <Bar
                        value={cat.totalSales}
                        max={maxCat}
                        colorClass={BAR_COLORS[i % BAR_COLORS.length]}
                        h="h-1.5"
                      />
                    </div>
                  </div>
                ))}
              </div>
              {d.categoryBreakdown.length > CAT_LIMIT && (
                <ShowMoreBtn
                  expanded={showAllCats}
                  onClick={() => navigate(`/item-sales`)}
                  total={d.categoryBreakdown.length}
                  showing={CAT_LIMIT}
                />
              )}
            </>
          ) : (
            <Empty icon={Layers} message="No category data for this day" />
          )}
        </Card>
        {/* Top Selling Items */}
        <Card className="p-5">
          <SHead
            icon={Star}
            label="Top Selling Items"
            count={d?.topSellingItems?.length ?? 0}
          />

          {d?.topSellingItems?.length > 0 ? (
            <>
              <div className="space-y-4">
                {visibleItems.map((item, i) => (
                  <div key={item.itemName} className="flex items-center gap-3">
                    {/* Rank */}
                    <div
                      className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-extrabold text-white ${
                        BAR_COLORS[i % BAR_COLORS.length]
                      }`}
                    >
                      {i + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Row header */}
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-slate-800 truncate pr-3">
                          {item.itemName}
                        </p>

                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          <span
                            className={`hidden sm:inline text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                              BADGE_STYLES[i % BADGE_STYLES.length]
                            }`}
                          >
                            {item.categoryName}
                          </span>

                          <span className="hidden sm:block text-[10px] text-slate-400 font-medium tabular-nums">
                            {item.quantitySold} sold
                          </span>

                          <span className="hidden sm:block text-[10px] text-slate-400 font-medium tabular-nums">
                            {item.orderCount} orders
                          </span>

                          <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                            {formatNumber(item.totalSales,true)}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <Bar
                        value={item.totalSales}
                        max={maxItem}
                        colorClass={BAR_COLORS[i % BAR_COLORS.length]}
                        h="h-1.5"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {d.topSellingItems.length > ITEM_LIMIT && (
                <ShowMoreBtn
                  expanded={showAllItems}
                  onClick={() => navigate(`/category-sales`)}
                  total={d.topSellingItems.length}
                  showing={ITEM_LIMIT}
                />
              )}
            </>
          ) : (
            <Empty icon={ShoppingBag} message="No items sold today" />
          )}
        </Card>
      </div>

      {/* ── ROW 4: Staff Performance ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
        <Card className="p-5 flex-1">
          <SHead
            icon={BadgePercent}
            label="Discounts Applied"
            count={d?.discountsApplied?.length ?? 0}
          />
          {d?.discountsApplied?.length > 0 ? (
            <>
              <div className="space-y-2">
                {d.discountsApplied.map((disc) => (
                  <div
                    key={disc.discountName}
                    className="flex items-center justify-between bg-amber-50 ring-1 ring-amber-100 rounded-xl px-3.5 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Tag
                          size={12}
                          className="text-amber-600"
                          strokeWidth={2}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {disc.discountName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                          {disc.discountType} &middot; {disc.timesApplied}x
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-extrabold text-red-500 tabular-nums">
                      -{formatNumber(disc.totalAmount,true)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-500">
                  Total Discounts
                </span>
                <span className="text-sm font-extrabold text-red-500 tabular-nums">
                  -{formatNumber(s?.totalDiscount ?? 0,true)}
                </span>
              </div>
            </>
          ) : (
            <Empty icon={Tag} message="No discounts applied today" />
          )}
        </Card>
        <div>
          {d?.staffPerformance?.length > 0 ? (
            <>
              <div className="space-y-4">
                {visibleStaff.map((staff) => (
                  <Card key={staff.userName} className="overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xl font-extrabold flex-shrink-0">
                          {staff.userName?.charAt(0) ?? "?"}
                        </div>
                        <div>
                          <p className="text-base font-extrabold text-slate-900">
                            {staff.userName ?? "Unknown"}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <UserCheck
                              size={10}
                              className="text-indigo-500"
                              strokeWidth={2.5}
                            />
                            <span className="text-xs font-bold text-indigo-600">
                              {staff.roleName ?? "Staff"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        {[
                          { label: "Orders Handled", val: staff.ordersHandled },
                          { label: "Total Sales", val: formatNumber(staff.totalSales,true) },
                          {
                            label: "Avg Order",
                            val: formatNumber(Math.round(staff.avgOrderValue,true)),
                          },
                          {
                            label: "Completion",
                            val: `${pct(s?.completedOrders, staff.ordersHandled)}%`,
                          },
                        ].map(({ label, val }) => (
                          <div key={label} className="text-center">
                            <p className="text-lg font-extrabold text-slate-900 tabular-nums">
                              {val}
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wide">
                              {label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="px-5 py-4 grid grid-cols-1 gap-4 sm:gap-5">
                      {[
                        {
                          label: "Order Completion Rate",
                          value: s?.completedOrders ?? 0,
                          total: staff.ordersHandled,
                          bar: "bg-emerald-400",
                        },
                        {
                          label: "Share of Total Orders",
                          value: staff.ordersHandled,
                          total: s?.totalOrders ?? 1,
                          bar: "bg-indigo-400",
                        },
                      ].map(({ label, value, total, bar }) => (
                        <div key={label}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-500">
                              {label}
                            </span>
                            <span className="text-xs font-extrabold text-slate-800 tabular-nums">
                              {pct(value, total)}%
                            </span>
                          </div>
                          <Bar
                            value={value}
                            max={total}
                            colorClass={bar}
                            h="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
              {d.staffPerformance.length > STAFF_LIMIT && (
                <ShowMoreBtn
                  expanded={showAllStaff}
                  onClick={() => navigate(`/staff-sales`)}
                  total={d.staffPerformance.length}
                  showing={STAFF_LIMIT}
                />
              )}
            </>
          ) : (
            <Card className="p-5">
              <SHead icon={UserCheck} label="Staff Performance" />
              <Empty icon={UserCheck} message="No staff data available" />
            </Card>
          )}
        </div>
      </div>

      {/* ── ROW 5: Order Log ────────────────────────────────────────────── */}
      <div>
        {/* Order stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            {
              label: "Total Orders",
              val: s?.totalOrders ?? 0,
              Icon: Hash,
              color: "slate",
            },
            {
              label: "Completed",
              val: s?.completedOrders ?? 0,
              Icon: CheckCircle2,
              color: "emerald",
            },
            {
              label: "Billed",
              val: billedCount,
              Icon: ReceiptText,
              color: "sky",
            },
            {
              label: "Cancelled",
              val: s?.cancelledOrders ?? 0,
              Icon: Ban,
              color: "red",
            },
          ].map(({ label, val, color, Icon }) => (
            <StatCard
              icon={Icon}
              title={label}
              value={val}
              color={color}
              variant="v5"
            />
          ))}
        </div>

        {/* Orders Table */}
        <Card className="p-5">
          <SHead
            icon={ReceiptText}
            label="All Orders"
            count={d?.orders?.length ?? 0}
          />
          {d?.orders?.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {[
                        "Order No.",
                        "Type",
                        "Table",
                        "Customer",
                        "Status",
                        "Payment",
                        "Time",
                        "Amount",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.08em] pb-3 pr-4 last:text-right last:pr-0"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleOrders.map((o) => {
                      const cfg = STATUS_CFG[o.status] || STATUS_CFG.confirmed;
                      return (
                        <tr
                          key={o.orderNumber}
                          className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="py-3 pr-4">
                            <p className="text-xs font-bold text-slate-800 tabular-nums">
                              {o.orderNumber}
                            </p>
                          </td>
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-1.5">
                              {o.orderType === "dine_in" ? (
                                <Utensils
                                  size={11}
                                  className="text-slate-400"
                                  strokeWidth={2.5}
                                />
                              ) : (
                                <Bike
                                  size={11}
                                  className="text-slate-400"
                                  strokeWidth={2.5}
                                />
                              )}
                              <span className="text-xs text-slate-500 font-semibold">
                                {o.orderType === "dine_in"
                                  ? "Dine-In"
                                  : "Takeaway"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <span className="text-xs font-semibold text-slate-600">
                              {o.tableNumber ?? (
                                <span className="text-slate-300">&mdash;</span>
                              )}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            {o.customerName ? (
                              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 ring-1 ring-indigo-100 px-2 py-0.5 rounded-lg">
                                {o.customerName}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-300 font-medium">
                                Guest
                              </span>
                            )}
                          </td>
                          <td className="py-3 pr-4">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}
                            >
                              {cfg.label}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            {o.paymentMode ? (
                              <span className="text-xs font-semibold text-slate-600">
                                {o.paymentMode}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-300 font-medium">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-1">
                              <Clock
                                size={10}
                                className="text-slate-300"
                                strokeWidth={2}
                              />
                              <span className="text-xs text-slate-400 font-semibold tabular-nums">
                                {o.createdAt ?? "—"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <p
                              className={`text-sm font-extrabold tabular-nums ${o.status === "cancelled" ? "text-red-500 line-through decoration-1" : "text-slate-900"}`}
                            >
                              {formatNumber(o.totalAmount,true)}
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-2">
                {visibleOrders.map((o) => {
                  const cfg = STATUS_CFG[o.status] || STATUS_CFG.confirmed;
                  return (
                    <div
                      key={o.orderNumber}
                      className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0"
                    >
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <p className="text-xs font-bold text-slate-800 tabular-nums">
                            {o.orderNumber}
                          </p>
                          {o.customerName && (
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 ring-1 ring-indigo-100 px-1.5 py-0.5 rounded-md">
                              {o.customerName}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}
                          >
                            {cfg.label}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                            {o.orderType === "dine_in" ? (
                              <>
                                <Utensils size={9} strokeWidth={2.5} />
                                {o.tableNumber ?? "—"}
                              </>
                            ) : (
                              <>
                                <Bike size={9} strokeWidth={2.5} />
                                Takeaway
                              </>
                            )}
                          </span>
                          {o.paymentMode && (
                            <span className="text-[10px] text-slate-400 font-semibold">
                              {o.paymentMode}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p
                          className={`text-sm font-extrabold tabular-nums ${o.status === "cancelled" ? "text-red-500 line-through" : "text-slate-900"}`}
                        >
                          {formatNumber(o.totalAmount,true)}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium flex items-center justify-end gap-0.5 mt-0.5">
                          <Clock size={9} />
                          {o.createdAt ?? "—"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {d.orders.length > ORDER_LIMIT && (
                <ShowMoreBtn
                  expanded={showAllOrders}
                  onClick={() => navigate(`/orders`)}
                  total={d.orders.length}
                  showing={ORDER_LIMIT}
                />
              )}
            </>
          ) : (
            <Empty icon={ReceiptText} message="No orders found for this day" />
          )}
        </Card>
      </div>
    </div>
  );
}
