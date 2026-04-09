import {
  AlertCircle,
  AlertTriangle,
  Bike,
  CheckCircle,
  ChevronDown,
  Clock,
  ReceiptIndianRupee,
  ShoppingBag,
  SlidersHorizontal,
  Tag,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { formatNumber } from "../../../utils/numberFormatter";
import StatusPill from "../../../components/StatusPill";

/* ── Summary Deductions Card ── */
function DailySalesSummaryBreakup({ summary, outsideCollections }) {
  const [open, setOpen] = useState(false);
  const {
    total_collection,
    total_paid_amount,
    total_due_amount,
    discount_amount,
    nc_amount,
    nc_order_count,
    adjustment_amount,
    adjustment_order_count,
    fully_paid_orders,
    partial_paid_orders,
    unpaid_orders,
  } = summary;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <ReceiptIndianRupee size={14} className="text-emerald-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">
              Collection Summary
            </p>
            <p className="text-xs text-gray-400">Payments, dues & deductions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-base font-bold text-gray-900">
              {formatNumber(total_collection, true)}
            </p>
            <p className="text-xs text-gray-400">total collected</p>
          </div>
          <ChevronDown
            size={14}
            className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <div
        className={`border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* collection pills */}
        <div className="px-5 py-4 border-b border-gray-50">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Collection
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
            {[
              { label: "Total", value: formatNumber(total_collection, true) },
              { label: "Paid", value: formatNumber(total_paid_amount, true) },
              {
                label: "Outside Collection",
                value: formatNumber(outsideCollections.total, true),
              },
              {
                label: "Due",
                value: formatNumber(total_due_amount, true),
                red: total_due_amount > 0,
              },
            ].map(({ label, value, red }) => (
              <div key={label} className="bg-gray-50 rounded-xl px-3 py-2.5">
                <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
                <p
                  className={`text-xs font-bold ${red ? "text-red-500" : "text-gray-900"}`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className=" border-b border-gray-50">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Order types
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <StatusPill
                icon={UtensilsCrossed}
                label="Dine-in"
                count={summary.dine_in_orders}
                color="blue"
              />

              <StatusPill
                icon={ShoppingBag}
                label="Takeaway"
                count={summary.takeaway_orders}
                color="violet"
              />

              {summary.delivery_orders > 0 && (
                <StatusPill
                  icon={Bike}
                  label="Delivery"
                  count={summary.delivery_orders}
                  color="orange"
                />
              )}
            </div>
          </div>
        </div>

        {/* deductions */}
        <div className="px-5 py-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Deductions & exceptions
          </p>
          {[
            {
              icon: Tag,
              label: "Discount",
              value: `− ${formatNumber(discount_amount, true)}`,
              cls: "text-red-500",
              sub: null,
            },
            {
              icon: AlertCircle,
              label: "NC amount",
              value: `− ${formatNumber(nc_amount, true)}`,
              cls: "text-amber-500",
              sub: `${nc_order_count} orders`,
            },
            {
              icon: SlidersHorizontal,
              label: "Adjustments",
              value: `− ${formatNumber(adjustment_amount, true)}`,
              cls: "text-red-400",
              sub: `${adjustment_order_count} entries`,
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
              <span className={`text-xs font-semibold ${cls}`}>{value}</span>
            </div>
          ))}
          {/* {total_due_amount > 0 && (
            <div className="mt-3 flex items-center justify-between rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <AlertTriangle size={13} className="text-red-400 shrink-0" />
                <span className="text-xs text-red-500 font-medium">
                  Due Amount
                </span>
              </div>
              <span className="text-xs font-bold text-red-600">
                {formatNumber(total_due_amount, true)}
              </span>
            </div>
          )} */}
          {/* payment status */}
          <div className="grid grid-cols-3 gap-2">
            <StatusPill
              icon={CheckCircle}
              label="Paid"
              count={summary.fully_paid_orders}
              color="emerald"
            />
            <StatusPill
              icon={Clock}
              label="Partial"
              count={summary.partial_paid_orders}
              color="amber"
            />
            {summary.unpaid_orders > 0 && (
              <StatusPill
                icon={XCircle}
                label="Unpaid"
                count={summary.unpaid_orders}
                color="red"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailySalesSummaryBreakup;
