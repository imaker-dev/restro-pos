import { useState } from "react";
import { formatNumber } from "../../../utils/numberFormatter";
import {
  AlertCircle,
  AlertTriangle,
  Banknote,
  Bike,
  ChevronDown,
  CreditCard,
  Layers,
  ReceiptIndianRupee,
  ShoppingBag,
  SlidersHorizontal,
  Tag,
  UtensilsCrossed,
} from "lucide-react";

const weekday = (d) =>
  new Date(d).toLocaleDateString("en-IN", { weekday: "short" });

const shortDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

const pct = (v, t) => (t ? Math.round((v / t) * 100) : 0);

function OrderTypePill({ icon: Icon, label, count, color }) {
  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl ${color}`}
    >
      <Icon size={11} />
      <span className="text-xs font-medium">{label}</span>
      <span className="text-xs font-bold">{count}</span>
    </div>
  );
}

function PaymentBar({
  label,
  icon: Icon,
  amount,
  total,
  barColor,
  textColor,
  bgColor,
}) {
  const ratio = pct(amount, total);
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div
        className={`w-6 h-6 rounded-lg flex items-center justify-center ${bgColor}`}
      >
        <Icon size={12} className={textColor} />
      </div>
      <span className="text-xs text-gray-600 w-9 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-700`}
          style={{ width: `${ratio}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 w-7 text-right shrink-0">
        {ratio}%
      </span>
      <span className="text-xs font-semibold text-gray-800 w-[72px] text-right shrink-0">
        {formatNumber(amount, true)}
      </span>
    </div>
  );
}

function DayEndCard({ day }) {
  const {
    date,
    total_orders,
    total_sale,
    total_collection,
    ordersByType,
    discount_amount,
    tax_amount,
    nc_orders,
    nc_amount,
    paid_amount,
    due_amount,
    adjustment_count,
    adjustment_amount,
    average_order_value,
    paymentBreakdown,
  } = day;

  const [open, setOpen] = useState(false);
  const cash = paymentBreakdown?.cash || 0;
  const card = paymentBreakdown?.card || 0;
  const upi = paymentBreakdown?.upi || 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-3 py-4 hover:bg-gray-50/60 transition-colors"
      >
        {/* left: date */}
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
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-gray-400">
                {total_orders} orders
              </span>
              {/* {nc_orders > 0 && (
                <span className="text-[10px] bg-amber-50 text-amber-500 border border-amber-100 px-1.5 py-0.5 rounded-full font-medium">
                  {nc_orders} NC
                </span>
              )}
              {due_amount > 0 && (
                <span className="text-[10px] bg-red-50 text-red-400 border border-red-100 px-1.5 py-0.5 rounded-full font-medium">
                  Due
                </span>
              )} */}
            </div>
          </div>
        </div>

        {/* right: amount */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">
              {formatNumber(total_collection, true)}
            </p>
            <p className="text-[10px] text-gray-400">
              avg {formatNumber(average_order_value, true)}
            </p>
          </div>
          <ChevronDown
            size={13}
            className={`text-gray-400 transition-transform duration-300 ease-in-out ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* {open && ( */}
      <div
        className={`border-t border-gray-50 px-4 space-y-3 transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-[600px] opacity-100 py-3" : "max-h-0 opacity-0 py-0"
        }`}
      >
        {/* <div className="border-t border-gray-50 px-4 py-3 space-y-3"> */}
        {/* order types */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <OrderTypePill
            icon={UtensilsCrossed}
            label="Dine-in"
            count={ordersByType.dine_in}
            color="bg-blue-50 text-blue-600"
          />
          <OrderTypePill
            icon={ShoppingBag}
            label="Takeaway"
            count={ordersByType.takeaway}
            color="bg-violet-50 text-violet-600"
          />
          <OrderTypePill
            icon={Bike}
            label="Delivery"
            count={ordersByType.delivery}
            color="bg-orange-50 text-orange-500"
          />
        </div>

        {/* payment bars */}
        <div className="bg-gray-50 rounded-xl px-3 py-2">
          <PaymentBar
            icon={Banknote}
            label="Cash"
            amount={cash}
            total={total_collection}
            barColor="bg-emerald-400"
            textColor="text-emerald-600"
            bgColor="bg-white"
          />
          <PaymentBar
            icon={Layers}
            label="UPI"
            amount={upi}
            total={total_collection}
            barColor="bg-violet-400"
            textColor="text-violet-600"
            bgColor="bg-white"
          />
          <PaymentBar
            icon={CreditCard}
            label="Card"
            amount={card}
            total={total_collection}
            barColor="bg-blue-400"
            textColor="text-blue-600"
            bgColor="bg-white"
          />
        </div>

        {/* deductions row */}
        <div className="grid grid-cols-2 gap-2">
          {[
            // {
            //   label: "Tax",
            //   value: formatNumber(tax_amount, true),
            //   icon: ReceiptIndianRupee,
            //   cls: "text-gray-600",
            // },
            {
              label: "Discount",
              value: formatNumber(discount_amount, true),
              icon: Tag,
              cls: "text-red-500",
            },
            ...(nc_amount > 0
              ? [
                  {
                    label: `NC (${nc_orders})`,
                    value: formatNumber(nc_amount, true),
                    icon: AlertCircle,
                    cls: "text-amber-500",
                  },
                ]
              : []),
            ...(adjustment_amount > 0
              ? [
                  {
                    label: `Adj. (${adjustment_count})`,
                    value: formatNumber(adjustment_amount, true),
                    icon: SlidersHorizontal,
                    cls: "text-red-400",
                  },
                ]
              : []),
            ...(due_amount > 0
              ? [
                  {
                    label: "Due",
                    value: formatNumber(due_amount, true),
                    icon: AlertTriangle,
                    cls: "text-red-500",
                  },
                ]
              : []),
            {
              label: "Paid",
              value: formatNumber(paid_amount, true),
              icon: Banknote,
              cls: "text-emerald-600",
            },
          ].map(({ label, value, icon: Icon, cls }) => (
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
      </div>
      {/* )} */}
    </div>
  );
}
export default DayEndCard;
