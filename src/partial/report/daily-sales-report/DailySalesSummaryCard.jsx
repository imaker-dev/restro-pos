import {
  AlertCircle,
  AlertTriangle,
  Banknote,
  Bike,
  CheckCircle,
  ChevronDown,
  Clock,
  ShoppingBag,
  SlidersHorizontal,
  Tag,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { formatNumber } from "../../../utils/numberFormatter";
import StatusPill from "../../../components/StatusPill";

const shortDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
const weekday = (d) =>
  new Date(d).toLocaleDateString("en-IN", { weekday: "short" });

/* ── DayCard ── */
function DailySalesSummaryCard({ day }) {
  const {
    date,
    total_orders,
    total_sale,
    total_collection,
    dine_in_orders,
    takeaway_orders,
    delivery_orders,
    discount_amount,
    nc_order_count,
    nc_amount,
    adjustment_order_count,
    adjustment_amount,
    fully_paid_orders,
    partial_paid_orders,
    unpaid_orders,
    total_paid_amount,
    total_due_amount,
    components,
    total_guests,
    outside_collection,
  } = day;

  const [open, setOpen] = useState(false);
  const {
    subtotal = 0,
    tax_amount = 0,
    service_charge = 0,
    packaging_charge = 0,
    delivery_charge = 0,
    round_off = 0,
  } = components || {};

  const aov = total_orders ? Math.round(total_sale / total_orders) : 0;

  const hasFlags =
    nc_order_count > 0 || total_due_amount > 0 || partial_paid_orders > 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50/60 transition-colors"
      >
        {/* left */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center shrink-0">
            <span className="text-[10px] font-medium text-gray-400 leading-none">
              {weekday(date)}
            </span>
            <span className="text-sm font-bold text-gray-800 leading-none mt-0.5">
              {new Date(date).getDate()}
            </span>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">
              {shortDate(date)}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span className="text-xs text-gray-400">
                {total_orders} orders · {total_guests} guests
              </span>
              {/* {nc_order_count > 0 && (
                <span className="text-[10px] bg-amber-50 text-amber-500 border border-amber-100 px-1.5 py-0.5 rounded-full font-medium">
                  {nc_order_count} NC
                </span>
              )}
              {total_due_amount > 0 && (
                <span className="text-[10px] bg-red-50 text-red-400 border border-red-100 px-1.5 py-0.5 rounded-full font-medium">
                  Due
                </span>
              )}
              {partial_paid_orders > 0 && (
                <span className="text-[10px] bg-orange-50 text-orange-400 border border-orange-100 px-1.5 py-0.5 rounded-full font-medium">
                  {partial_paid_orders} partial
                </span>
              )} */}
            </div>
          </div>
        </div>

        {/* right */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">
              {formatNumber(total_sale, true)}
            </p>
            <p className="text-[10px] text-gray-400">
              avg {formatNumber(aov, true)}
            </p>
          </div>
          <ChevronDown
            size={13}
            className={`text-gray-300 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <div
        className={`border-t border-gray-50 px-4 space-y-3 transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-[800px] opacity-100 py-3" : "max-h-0 opacity-0 py-0"
        }`}
      >
        {/* order type pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <StatusPill
            icon={UtensilsCrossed}
            label="Dine-in"
            count={dine_in_orders}
            color="blue"
          />

          <StatusPill
            icon={ShoppingBag}
            label="Takeaway"
            count={takeaway_orders}
            color="violet"
          />

          {delivery_orders > 0 && (
            <StatusPill
              icon={Bike}
              label="Delivery"
              count={delivery_orders}
              color="orange"
            />
          )}
        </div>

        {/* bill components */}
        <div className="bg-gray-50 rounded-xl px-3 py-2.5 space-y-2">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            Bill components
          </p>
          {[
            {
              label: "Subtotal",
              value: formatNumber(subtotal, true),
              bold: false,
            },
            {
              label: "Outside Collection",
              value: formatNumber(outside_collection, true),
              bold: false,
            },
            {
              label: "Tax",
              value: formatNumber(tax_amount, true),
              bold: false,
            },
            ...(service_charge
              ? [
                  {
                    label: "Service charge",
                    value: formatNumber(service_charge, true),
                    bold: false,
                  },
                ]
              : []),
            ...(packaging_charge
              ? [
                  {
                    label: "Packaging",
                    value: formatNumber(packaging_charge, true),
                    bold: false,
                  },
                ]
              : []),
            ...(delivery_charge
              ? [
                  {
                    label: "Delivery charge",
                    value: formatNumber(delivery_charge, true),
                    bold: false,
                  },
                ]
              : []),
            ...(round_off !== 0
              ? [
                  {
                    label: "Round off",
                    value:
                      (round_off > 0 ? "+" : "") +
                      "₹" +
                      Math.abs(round_off).toFixed(2),
                    bold: false,
                    muted: true,
                  },
                ]
              : []),
            {
              label: "Total",
              value: formatNumber(total_sale, true),
              bold: true,
            },
          ].map(({ label, value, bold, muted }) => (
            <div
              key={label}
              className={`flex justify-between items-center ${bold ? "border-t border-gray-200 pt-2 mt-1" : ""}`}
            >
              <span
                className={`text-xs ${muted ? "text-gray-400" : bold ? "font-semibold text-gray-800" : "text-gray-500"}`}
              >
                {label}
              </span>
              <span
                className={`text-xs ${bold ? "font-bold text-gray-900" : muted ? "text-gray-400" : "text-gray-700"}`}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* deductions & payment status grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              icon: Tag,
              label: "Discount",
              value: formatNumber(discount_amount, true),
              cls: "text-red-500",
            },
            {
              icon: Banknote,
              label: "Paid",
              value: formatNumber(total_paid_amount, true),
              cls: "text-emerald-600",
            },
            ...(nc_amount > 0
              ? [
                  {
                    icon: AlertCircle,
                    label: `NC (${nc_order_count})`,
                    value: formatNumber(nc_amount, true),
                    cls: "text-amber-500",
                  },
                ]
              : []),
            ...(adjustment_amount > 0
              ? [
                  {
                    icon: SlidersHorizontal,
                    label: `Adj. (${adjustment_order_count})`,
                    value: formatNumber(adjustment_amount, true),
                    cls: "text-red-400",
                  },
                ]
              : []),
            ...(total_due_amount > 0
              ? [
                  {
                    icon: AlertTriangle,
                    label: "Due",
                    value: formatNumber(total_due_amount, true),
                    cls: "text-red-500",
                  },
                ]
              : []),
          ].map(({ icon: Icon, label, value, cls }) => (
            <div
              key={label}
              className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2"
            >
              <div className="flex items-center gap-1.5">
                <Icon size={11} className="text-gray-400 shrink-0" />
                <span className="text-[10px] text-gray-500">{label}</span>
              </div>
              <span className={`text-[11px] font-semibold ${cls}`}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* payment status */}
        <div className="grid grid-cols-3 gap-2">
          <StatusPill
            icon={CheckCircle}
            label="Paid"
            count={fully_paid_orders}
            color="emerald"
          />
          <StatusPill
            icon={Clock}
            label="Partial"
            count={partial_paid_orders}
            color="amber"
          />
          {unpaid_orders > 0 && (
            <StatusPill
              icon={XCircle}
              label="Unpaid"
              count={unpaid_orders}
              color="red"
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default DailySalesSummaryCard;
