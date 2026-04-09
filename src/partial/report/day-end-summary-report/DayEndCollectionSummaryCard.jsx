import React, { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Banknote,
  Bike,
  ChevronDown,
  CreditCard,
  Layers,
  Receipt,
  ReceiptIndianRupee,
  ShoppingBag,
  SlidersHorizontal,
  Tag,
  UtensilsCrossed,
} from "lucide-react";
import { formatNumber } from "../../../utils/numberFormatter";
import StatusPill from "../../../components/StatusPill";

function PaymentBar({
  label,
  icon: Icon,
  amount,
  total,
  barColor,
  textColor,
  bgColor,
}) {
  const pct = (v, t) => (t ? Math.round((v / t) * 100) : 0);
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

function DayEndCollectionSummaryCard({ grandTotal }) {
  const {
    total_collection,
    paid_amount,
    due_amount,
    discount_amount,
    nc_amount,
    nc_orders,
    adjustment_count,
    adjustment_amount,
    tax_amount,
    ordersByType,
  } = grandTotal;
  const paymentBreakdown = grandTotal.paymentBreakdown || {};
  const cash = paymentBreakdown.cash || 0;
  const card = paymentBreakdown.card || 0;
  const upi = paymentBreakdown.upi || 0;

  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-3 py-4 hover:bg-gray-50/60 transition-colors"
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
            className={`text-gray-400 transition-transform duration-300 ease-in-out ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* {open && ( */}
      {/* <div className="border-t border-gray-100"> */}
      <div
        className={`border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* Collection pills */}
        <div className="px-5 py-4 border-b border-gray-50">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Collection
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Total", value: formatNumber(total_collection, true) },
              { label: "Paid", value: formatNumber(paid_amount, true) },
              {
                label: "Due",
                value: formatNumber(due_amount, true),
                red: due_amount > 0,
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

          {/* <PaymentBar
              icon={Banknote}
              label="Cash"
              amount={cash}
              total={total_collection}
              barColor="bg-emerald-400"
              textColor="text-emerald-600"
              bgColor="bg-emerald-50"
            />
            <PaymentBar
              icon={Layers}
              label="UPI"
              amount={upi}
              total={total_collection}
              barColor="bg-violet-400"
              textColor="text-violet-600"
              bgColor="bg-violet-50"
            />
            <PaymentBar
              icon={CreditCard}
              label="Card"
              amount={card}
              total={total_collection}
              barColor="bg-blue-400"
              textColor="text-blue-600"
              bgColor="bg-blue-50"
            /> */}
        </div>

        <div className="px-5 py-4 border-b border-gray-50">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Order types
          </p>
          {/* order type strip */}
          <div className="flex items-center gap-2 flex-wrap">
            <StatusPill
              icon={UtensilsCrossed}
              label="Dine-in"
              count={ordersByType.dine_in}
              color="blue"
            />

            <StatusPill
              icon={ShoppingBag}
              label="Takeaway"
              count={ordersByType.takeaway}
              color="violet"
            />

            <StatusPill
              icon={Bike}
              label="Delivery"
              count={ordersByType.delivery}
              color="orange"
            />

            {grandTotal.nc_orders > 0 && (
              <StatusPill
                icon={AlertCircle}
                label="NC"
                count={grandTotal.nc_orders}
                color="amber"
              />
            )}
          </div>
        </div>

        {/* Deductions */}
        <div className="px-5 py-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Deductions & exceptions
          </p>
          <div className="flex flex-col">
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
                sub: `${nc_orders} orders`,
              },
              {
                icon: SlidersHorizontal,
                label: "Adjustments",
                value: `− ${formatNumber(adjustment_amount, true)}`,
                cls: "text-red-400",
                sub: `${adjustment_count} entries`,
              },
              // {
              //   icon: ReceiptIndianRupee,
              //   label: "Tax",
              //   value: `+ ${formatNumber(tax_amount, true)}`,
              //   cls: "text-gray-500",
              //   sub: null,
              // },
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
          </div>
          {due_amount > 0 && (
            <div className="mt-3 flex items-center justify-between rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <AlertTriangle size={13} className="text-red-400 shrink-0" />
                <span className="text-xs text-red-500 font-medium">
                  Due Amount
                </span>
              </div>
              <span className="text-xs font-bold text-red-600">
                {formatNumber(due_amount, true)}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* )} */}
    </div>
  );
}
export default DayEndCollectionSummaryCard;
