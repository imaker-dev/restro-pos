import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Utensils,
  Package,
  Truck,
  Clock,
  ChefHat,
  CheckCircle,
  Receipt,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRunningOrder,
  fetchRunningTable,
} from "../../redux/slices/reportSlice";
import PageHeader from "../../layout/PageHeader";
import StatCard from "../../components/StatCard";

/* ---------------- ARC RING ---------------- */

function ArcRing({ percent, color, trackColor, size = 52, stroke = 5 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={trackColor}
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{
          transition: "stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1) 0.3s",
        }}
      />
    </svg>
  );
}

/* ---------------- STATUS CONFIG ---------------- */

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending",
    color: "#d97706",
    bg: "bg-amber-50",
    track: "#fde68a",
    accent: "#f59e0b",
    pill: "bg-amber-100",
    pillText: "text-amber-800",
    border: "border-amber-200",
  },
  confirmed: {
    icon: ShoppingBag,
    label: "Confirmed",
    color: "#0ea5e9",
    bg: "bg-sky-50",
    track: "#bae6fd",
    accent: "#38bdf8",
    pill: "bg-sky-100",
    pillText: "text-sky-800",
    border: "border-sky-200",
  },
  preparing: {
    icon: ChefHat,
    label: "Preparing",
    color: "#2563eb",
    bg: "bg-blue-50",
    track: "#bfdbfe",
    accent: "#3b82f6",
    pill: "bg-blue-100",
    pillText: "text-blue-800",
    border: "border-blue-200",
  },
  ready: {
    icon: CheckCircle,
    label: "Ready",
    color: "#059669",
    bg: "bg-emerald-50",
    track: "#a7f3d0",
    accent: "#10b981",
    pill: "bg-emerald-100",
    pillText: "text-emerald-800",
    border: "border-emerald-200",
  },
  billed: {
    icon: Receipt,
    label: "Billed",
    color: "#7c3aed",
    bg: "bg-purple-50",
    track: "#ddd6fe",
    accent: "#8b5cf6",
    pill: "bg-purple-100",
    pillText: "text-purple-800",
    border: "border-purple-200",
  },
};


/* ---------------- DASHBOARD ---------------- */

export default function Dashboard() {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { runningOrders, isFetchingRunningOrder } = useSelector(
    (state) => state.report,
  );

  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    if (outletId) {
      dispatch(fetchRunningTable(outletId));
      dispatch(fetchRunningOrder(outletId));
    }
  }, [outletId, dispatch]);

  const total = runningOrders?.summary?.totalOrders || 0;

  if (isFetchingRunningOrder) {
    return <div>Loader</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Running Order" />

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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <StatCard
          title="Total Orders"
          value={total}
          subtitle="Today's count"
          color="orange"
        />
        <StatCard
          title="Revenue"
          value={runningOrders?.summary?.totalAmount || 0}
          subtitle="Gross today"
          color="purple"
        />
      </div>

      {/* Status Breakdown */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Order Status Breakdown
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(runningOrders?.byStatus || {}).map(([key, val]) => {
            const cfg = statusConfig[key];

            if (!cfg) return null; // 🔥 prevents crash if new backend status

            const Icon = cfg.icon;
            const pct = total ? Math.round((val.orders / total) * 100) : 0;

            return (
              <div
                key={key}
                className={`bg-white rounded-xl border-2 ${cfg.border} p-5 shadow-sm`}
              >
                <div className="flex justify-between mb-4">
                  <div
                    className={`w-9 h-9 ${cfg.bg} rounded-md flex items-center justify-center border-2 ${cfg.border}`}
                  >
                    <Icon size={17} color={cfg.color} />
                  </div>

                  <div className="relative inline-flex">
                    <ArcRing
                      percent={pct}
                      color={cfg.accent}
                      trackColor={cfg.track}
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                      style={{ color: cfg.color }}
                    >
                      {pct}%
                    </div>
                  </div>
                </div>

                <div className="text-3xl font-bold">{val.orders}</div>

                <div className="text-sm text-slate-500">{cfg.label}</div>

                <div
                  className={`mt-2 inline-block ${
                    val.amount > 0
                      ? `${cfg.pill} ${cfg.pillText}`
                      : "bg-slate-100 text-slate-400"
                  } text-xs font-bold px-3 py-1 rounded-full`}
                >
                  ₹{val.amount?.toLocaleString() || 0}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Pipeline */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
          Delivery Pipeline
        </p>

        {(() => {
          const delivery = runningOrders?.delivery || {};

          const yetToBeReady = delivery.yetToBeReady || {
            orders: 0,
            amount: 0,
          };

          const readyForPickup = delivery.readyForPickup || {
            orders: 0,
            amount: 0,
          };

          return (
            <div className="flex flex-col gap-4 flex-1">
              {/* Yet to be Ready */}
              <div className="flex-1 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg border-2 border-amber-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-amber-100 rounded-md flex items-center justify-center">
                    <Clock size={15} color="#d97706" />
                  </div>
                  <span className="text-xs font-semibold text-stone-500">
                    Yet to be Ready
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-amber-600 leading-none">
                    {yetToBeReady.orders}
                  </span>

                  <div>
                    <div className="text-xs text-amber-700 font-bold">
                      orders
                    </div>
                    <div className="text-xs text-amber-600">
                      ₹{yetToBeReady.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ready for Pickup */}
              <div className="flex-1 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg border-2 border-emerald-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-md flex items-center justify-center">
                    <Truck size={15} color="#16a34a" />
                  </div>
                  <span className="text-xs font-semibold text-gray-500">
                    Ready for Pickup
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-emerald-600 leading-none">
                    {readyForPickup.orders}
                  </span>

                  <div>
                    <div className="text-xs text-emerald-700 font-bold">
                      orders
                    </div>
                    <div className="text-xs text-emerald-600">
                      ₹{readyForPickup.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
