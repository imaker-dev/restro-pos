import React, { useEffect, useState } from "react";
import {
  Utensils,
  Clock,
  Users,
  MapPin,
  User,
  Star,
  Layers,
  Receipt,
  ShoppingBag,
  Building2,
  Wallet,
  Timer,
  Hash,
  ArrowUpRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRunningOrder,
  fetchRunningTable,
} from "../../redux/slices/reportSlice";
import OrderBadge from "../../partial/order/OrderBadge";
import PageHeader from "../../layout/PageHeader";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber } from "../../utils/numberFormatter";
import StatCard from "../../components/StatCard";
import NoDataFound from "../../layout/NoDataFound";
import { Link } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";

/* ─── Config ─────────────────────────────────────────────── */
const STATUS_CFG = {
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    badge: "bg-amber-50 border-amber-200 text-amber-700",
    bar: "bg-amber-400",
    glow: "shadow-amber-100",
  },
  confirmed: {
    label: "Confirmed",
    dot: "bg-blue-500",
    badge: "bg-blue-50 border-blue-200 text-blue-700",
    bar: "bg-blue-500",
    glow: "shadow-blue-100",
  },
  preparing: {
    label: "Preparing",
    dot: "bg-violet-500",
    badge: "bg-violet-50 border-violet-200 text-violet-700",
    bar: "bg-violet-500",
    glow: "shadow-violet-100",
  },
  ready: {
    label: "Ready",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 border-emerald-200 text-emerald-700",
    bar: "bg-emerald-500",
    glow: "shadow-emerald-100",
  },
  billed: {
    label: "Billed",
    dot: "bg-slate-400",
    badge: "bg-slate-50 border-slate-200 text-slate-600",
    bar: "bg-slate-400",
    glow: "shadow-slate-100",
  },
};

const urgencyColor = (mins) => {
  if (mins >= 90)
    return {
      ring: "ring-rose-300",
      bg: "bg-rose-50",
      text: "text-rose-600",
      label: "Long wait",
      bar: "bg-rose-400",
    };
  if (mins >= 60)
    return {
      ring: "ring-amber-300",
      bg: "bg-amber-50",
      text: "text-amber-600",
      label: "Active",
      bar: "bg-amber-400",
    };
  return {
    ring: "ring-emerald-200",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    label: "Recent",
    bar: "bg-emerald-400",
  };
};

const readyPct = (ready, total) =>
  total > 0 ? Math.round((ready / total) * 100) : 0;

/* ─── Order Card ─────────────────────────────────────────── */
const OrderCard = ({ order, onViewDetails }) => {
  const sc = STATUS_CFG[order?.status] || STATUS_CFG.pending;
  const pct = readyPct(order?.ready_count, order?.item_count);
  const hasItems = order?.item_count > 0;
  const hasAmount = parseFloat(order?.total_amount) > 0;

  return (
    <div
      className={`
        relative bg-white rounded-2xl border overflow-hidden flex flex-col
        shadow-sm hover:shadow-lg transition-all duration-200
        ${order?.is_priority ? "border-amber-300 ring-1 ring-amber-200" : "border-slate-200"}
      `}
    >
      {/* Priority ribbon */}
      {order?.is_priority === 1 && (
        <div className="absolute top-3.5 right-3.5 z-10">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-white shadow">
            <Star size={9} fill="white" /> Priority
          </span>
        </div>
      )}

      {/* Status color bar */}
      <div className={`h-1 w-full ${sc.bar}`} />

      <div className="px-5 py-4 flex flex-col flex-1">
        {/* Row 1: Order number + status badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-slate-400 font-mono tracking-wide">
                #{order?.order_number}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <OrderBadge type="status" value={order?.status} />
              <OrderBadge type="type" value={order?.order_type} />
              <OrderBadge type="payment" value={order?.payment_status} />
            </div>
          </div>

          {/* Amount */}
          <div className="text-right flex-shrink-0">
            {hasAmount ? (
              <>
                <div className="text-xl font-black text-slate-900 tracking-tight">
                  {formatNumber(order?.total_amount, true)}
                </div>
                {order?.discount_amount > 0 && (
                  <div className="text-[11px] text-emerald-600 font-semibold">
                    −{formatNumber(order?.discount_amount, true)} off
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm font-semibold text-slate-300">
                No items
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 mb-3" />

        {/* Row 2: Table, Floor, Guests, Captain */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Layers size={9} /> Table
            </span>
            <span className="text-sm font-bold text-slate-800">
              {order?.table_name}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {order?.table_number}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <MapPin size={9} /> Floor
            </span>
            <span className="text-sm font-semibold text-slate-700">
              {order?.floor_name}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Users size={9} /> Guests
            </span>
            <span className="text-sm font-bold text-slate-800">
              {order?.guest_count}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <User size={9} /> Captain
            </span>
            <span className="text-sm font-semibold text-slate-700 truncate">
              {order?.created_by_name || "—"}
            </span>
          </div>
        </div>

        {/* Row 3: Item Progress */}
        {hasItems ? (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Utensils size={10} /> Item Progress
              </span>
              <span className="text-[11px] font-bold text-slate-600">
                {order?.ready_count}/{order?.item_count} ready
                <span
                  className={`ml-1.5 ${pct === 100 ? "text-emerald-600" : "text-slate-400"}`}
                >
                  ({pct}%)
                </span>
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? "bg-emerald-500" : "bg-blue-500"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="mb-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <span className="text-[12px] text-slate-400 font-medium">
              No items added yet
            </span>
          </div>
        )}

        {/* Subtotal row */}
        {hasAmount &&
          parseFloat(order?.subtotal) !== parseFloat(order?.total_amount) && (
            <div className="flex items-center justify-between text-[12px] text-slate-500 mb-2 font-medium">
              <span>Subtotal</span>
              <span>
                ₹{parseFloat(order?.subtotal).toLocaleString("en-IN")}
              </span>
            </div>
          )}

        {/* Special instructions */}
        {order?.special_instructions && (
          <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block mb-0.5">
              Note
            </span>
            <span className="text-xs text-amber-800">
              {order?.special_instructions}
            </span>
          </div>
        )}

        {/* Invoice pill */}
        {order?.invoice_number && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-lg">
            <Receipt size={11} className="text-violet-600" />
            <span className="text-[11px] font-bold text-violet-700 font-mono">
              {order?.invoice_number}
            </span>
          </div>
        )}

        {/* Spacer pushes footer to bottom */}
        <div className="flex-1" />

        {/* Footer: timestamp + View Details */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium min-w-0">
            <Clock size={11} className="flex-shrink-0" />
            <span className="truncate">
              {formatDate(order?.created_at, "time")}
            </span>
            <span className="text-slate-300 flex-shrink-0">·</span>
            <span className="flex-shrink-0 font-bold bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
              {formatDate(order?.created_at, "timeAgo")}
            </span>
          </div>

          {/* ── View Details Button ── */}
          <Link
            to={`/orders/details?orderId=${order?.id}`}
            className="
              btn group flex-shrink-0 rounded-xl
              bg-primary-500 hover:bg-primary-600
              text-white text-xs font-semibold"
          >
            View Details
            <ArrowUpRight
              size={13}
              strokeWidth={2.5}
              className="ml-1 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ─── Table Card ─────────────────────────────────────────── */
const TableCard = ({ table, onViewDetails }) => {
  const sc = STATUS_CFG[table?.order?.status] || STATUS_CFG.pending;
  const urg = urgencyColor(table?.order?.durationMinutes || 0);

  return (
    <div
      className={`
        relative bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col
        shadow-sm hover:shadow-xl transition-all duration-200 cursor-default
      `}
    >
      {/* Top status bar */}
      <div className={`h-1 w-full ${sc?.bar}`} />

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Header row: table name + badges */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <span className="text-white text-sm font-black">
                {table?.tableName}
              </span>
            </div>
            <div>
              <div className="text-[11px] font-mono font-bold text-slate-400 leading-none">
                {table?.tableNumber}
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">
                Table ID #{table?.tableId}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <OrderBadge type="status" value={table?.order?.status} />
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${urg?.bg} ${urg?.text}`}
            >
              <Timer size={9} /> {urg?.label}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 mb-4" />

        {/* Info grid: 2x2 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-0.5">
              <Users size={9} /> Guests
            </div>
            <div className="text-sm font-bold text-slate-800">
              {table?.guestCount}
              <span className="text-xs font-medium text-slate-400 ml-1">
                / {table?.capacity} cap
              </span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-0.5">
              <Wallet size={9} /> Amount
            </div>
            <div className="text-sm font-bold text-slate-800">
              {table?.order?.totalAmount > 0 ? (
                formatNumber(table?.order?.totalAmount, true)
              ) : (
                <span className="text-slate-300 font-medium text-xs">
                  No items
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-0.5">
              <Clock size={9} /> Started
            </div>
            <div className="text-sm font-semibold text-slate-700">
              {formatDate(table?.order?.startedAt, "time")}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-0.5">
              <Timer size={9} /> Duration
            </div>
            <div className={`text-sm font-bold ${urg?.text}`}>
              {table?.order?.durationFormatted}
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer: order number + captain + view button */}
        <div className="pt-3.5 border-t border-slate-100 space-y-3">
          {/* Order # + Captain row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 min-w-0">
              <Hash size={11} className="text-slate-300 flex-shrink-0" />
              <span className="text-[11px] font-mono font-bold text-slate-400 truncate">
                {table?.order?.orderNumber}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                <User size={10} color="white" strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-semibold text-slate-500 max-w-[110px] truncate">
                {table?.captain?.name}
              </span>
            </div>
          </div>

          {/* View Order Details button */}
          <Link
            to={`/orders/details?orderId=${table?.order?.id}`}
            className="btn group w-full rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold"
          >
            View Order Details
            <ArrowUpRight
              size={13}
              strokeWidth={2.5}
              className="ml-2 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

const FloorSection = ({ floor }) => (
  <div>
    {/* Floor header */}
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center">
        <Layers size={15} color="white" strokeWidth={2.2} />
      </div>
      <div>
        <h2 className="text-base font-extrabold text-slate-800 tracking-tight">
          {floor?.floorName}
        </h2>
        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
          {floor?.tableCount} tables · {floor?.totalGuests} guests
          {floor?.totalAmount > 0 &&
            ` · ${formatNumber(floor?.totalAmount, true)}`}
        </p>
      </div>
    </div>

    {/* Tables grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {floor?.tables.map((table) => (
        <TableCard key={table?.tableId} table={table} />
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   MAIN SCREEN
══════════════════════════════════════════════════════════ */
export default function RunningOrdersPage() {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const {
    runningOrders,
    isFetchingRunningOrder,
    isFetchingRunningTable,
    runningTables,
  } = useSelector((state) => state.report);
  const { floors, summary } = runningTables || {};

  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    if (outletId) {
      dispatch(fetchRunningTable(outletId));
      dispatch(fetchRunningOrder(outletId));
    }
  }, [outletId, dispatch]);

  if(isFetchingRunningOrder || isFetchingRunningTable) {
    return <LoadingOverlay text="Loading Report..."/>
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title={"Running Order & Tables"} />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "orders"
              ? "border-primary-500 text-primary-600"
              : "border-transparent text-slate-500"
          }`}
        >
          Running Orders
        </button>

        <button
          onClick={() => setActiveTab("tables")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "tables"
              ? "border-primary-500 text-primary-600"
              : "border-transparent text-slate-500"
          }`}
        >
          Running Tables
        </button>
      </div>

      {/* Orders Grid */}
      {activeTab === "orders" &&
        (runningOrders?.length === 0 ? (
          <NoDataFound
            icon={Layers}
            title="No orders found"
            className="bg-white"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {runningOrders?.map((order) => (
              <OrderCard key={order?.id} order={order} />
            ))}
          </div>
        ))}

      {activeTab === "tables" && (
        <>
          {/* ── Summary Stats ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <StatCard
              icon={Building2}
              title="Floors"
              value={summary?.totalFloors}
              color="blue"
              variant="secondary"
            />
            <StatCard
              icon={Layers}
              title="Occupied Tables"
              value={summary?.totalOccupiedTables}
              color="purple"
              variant="secondary"
            />
            <StatCard
              icon={Users}
              title="Total Guests"
              value={summary?.totalGuests}
              color="green"
              variant="secondary"
            />
            <StatCard
              icon={Wallet}
              title="Revenue"
              value={summary?.formattedAmount}
              color="amber"
              variant="secondary"
            />
          </div>

          {/* ── Urgency Legend ── */}
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Duration
            </span>
            {[
              {
                color: "bg-emerald-400",
                label: "< 60 min — Recent",
                text: "text-emerald-600",
              },
              {
                color: "bg-amber-400",
                label: "60–90 min — Active",
                text: "text-amber-600",
              },
              {
                color: "bg-rose-400",
                label: "> 90 min — Long wait",
                text: "text-rose-600",
              },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${l.color}`} />
                <span className={`text-[11px] font-semibold ${l.text}`}>
                  {l.label}
                </span>
              </div>
            ))}
          </div>

          {/* ── Floors ── */}
          <div className="space-y-8">
            {floors?.length === 0 ? (
              <NoDataFound
                icon={Layers}
                title="No tables found"
                className="bg-white"
              />
            ) : (
              floors?.map((floor) => (
                <FloorSection key={floor.floorId} floor={floor} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
