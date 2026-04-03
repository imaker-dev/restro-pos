import { Link } from "react-router-dom";
import { formatNumber, num } from "../../../utils/numberFormatter";
import React from "react";
import {
  ArrowRight,
  Users,
  Tag,
  TrendingUp,
  Banknote,
  CreditCard,
  Smartphone,
  Wallet,
} from "lucide-react";
import { ROUTE_PATHS } from "../../../config/paths";

const ORDER_PILL = {
  "Dine-In": { color: "#4f46e5", bg: "#ede9fe" },
  Takeaway: { color: "#d97706", bg: "#fef3c7" },
  Delivery: { color: "#0891b2", bg: "#e0f2fe" },
  Cancelled: { color: "#e11d48", bg: "#ffe4e6" },
};

const PAYMENT_ICONS = {
  Cash: Banknote,
  Card: CreditCard,
  UPI: Smartphone,
  Wallet: Wallet,
};

export default function DailySalesCard({ day }) {
  const d = new Date(day.report_date);

  const dayNum = d.getDate();
  const dayName = d.toLocaleString("en", { weekday: "short" }).toUpperCase();
  const monthStr = d.toLocaleString("en", { month: "short" }).toUpperCase();
  const fullDate = d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const orderTypes = [
    { label: "Dine-In", v: day.dine_in_orders },
    { label: "Takeaway", v: day.takeaway_orders },
    { label: "Delivery", v: day.delivery_orders },
    { label: "Cancelled", v: day.cancelled_orders },
  ].filter((t) => num(t.v) > 0);

  const payments = [
    { label: "Cash", v: day.cash_collection },
    { label: "Card", v: day.card_collection },
    { label: "UPI", v: day.upi_collection },
    { label: "Wallet", v: day.wallet_collection },
  ].filter((p) => num(p.v) > 0);

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-px"
      style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}
    >
      {/* Top accent bar */}
      <div
        className="h-[3px]"
        style={{ background: "linear-gradient(90deg,#10b981,#34d399)" }}
      />

      {/* ── BODY ── */}
      <div className="flex items-stretch">
        {/* Date column */}
        <div
          className="flex flex-col items-center justify-center gap-0.5 flex-shrink-0 w-16"
          style={{ background: "linear-gradient(170deg,#0f172a,#1e293b)" }}
        >
          <span
            className="text-[8px] font-bold tracking-widest"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            {dayName}
          </span>
          <span className="text-[28px] font-black text-white leading-none">
            {dayNum}
          </span>
          <span
            className="text-[8px] font-bold tracking-wider"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {monthStr}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 p-4 flex flex-col gap-3">
          {/* ── Row 1: Date title + Details button ── */}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-slate-700 truncate leading-tight">
                {fullDate}
              </p>
              {/* Order type pills */}
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {orderTypes.map(({ label, v }) => {
                  const cfg = ORDER_PILL[label] ?? {
                    color: "#64748b",
                    bg: "#f1f5f9",
                  };
                  return (
                    <span
                      key={label}
                      className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {num(v)} {label}
                    </span>
                  );
                })}
                {num(day?.total_guests) > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 whitespace-nowrap">
                    <Users size={9} strokeWidth={2.5} />
                    {formatNumber(day.total_guests)} Guests
                  </span>
                )}
              </div>
            </div>

            <Link
              to={`${ROUTE_PATHS.REPORTS_DAILY_SALES_DETAILS}?date=${day.report_date}`}
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors duration-150"
            >
              Details
              <ArrowRight size={11} strokeWidth={2.5} />
            </Link>
          </div>

          {/* ── Divider ── */}
          <div className="h-px bg-slate-100" />

          {/* ── Row 2: Key metrics ── */}
          <div className="grid grid-cols-3 sm:flex sm:items-center gap-y-3 sm:gap-y-0">
            {[
              {
                label: "Gross Sales",
                value: `${formatNumber(day.gross_sales, true)}`,
                green: false,
              },
              {
                label: "Net Sales",
                value: `${formatNumber(day.net_sales, true)}`,
                green: false,
              },
              {
                label: "Collected",
                value: `${formatNumber(day.total_collection, true)}`,
                green: true,
              },
              {
                label: "Orders",
                value: formatNumber(day.total_orders),
                green: false,
              },
              {
                label: "Avg Order",
                value: `${formatNumber(day.average_order_value, true)}`,
                green: false,
              },
            ].map(({ label, value, green }, i, arr) => (
              <React.Fragment key={label}>
                <div className="flex flex-col gap-1 sm:px-4 first:sm:pl-0 last:sm:pr-0">
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-slate-400 whitespace-nowrap">
                    {label}
                  </span>
                  <span
                    className={`text-[15px] font-black tabular-nums leading-none whitespace-nowrap ${green ? "text-emerald-600" : "text-slate-800"}`}
                  >
                    {value}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div className="hidden sm:block w-px h-8 bg-slate-200 flex-shrink-0 self-center" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER: Payments + Tax / Discount ── */}
      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {/* Payment methods */}
          {payments.map(({ label, v }) => {
            const Icon = PAYMENT_ICONS[label] ?? Wallet;
            return (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <Icon size={11} strokeWidth={1.8} className="text-slate-400" />
                <span className="text-[10px] font-medium text-slate-400">
                  {label}
                </span>
                <span className="text-[11px] font-bold text-slate-700">
                  {formatNumber(v, true)}
                </span>
              </span>
            );
          })}

          {/* Separator */}
          {payments.length > 0 &&
            (num(day?.tax_amount) > 0 || num(day?.discount_amount) > 0) && (
              <span className="hidden sm:block text-slate-300 text-base leading-none select-none">
                ·
              </span>
            )}

          {/* Tax */}
          {num(day?.tax_amount) > 0 && (
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <TrendingUp
                size={11}
                strokeWidth={1.8}
                className="text-slate-400"
              />
              <span className="text-[10px] font-medium text-slate-400">
                Tax
              </span>
              <span className="text-[11px] font-bold text-slate-700">
                {formatNumber(day.tax_amount, true)}
              </span>
            </span>
          )}

          {/* Discount */}
          {num(day?.discount_amount) > 0 && (
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Tag size={11} strokeWidth={1.8} className="text-emerald-500" />
              <span className="text-[10px] font-medium text-emerald-600">
                Discount
              </span>
              <span className="text-[11px] font-bold text-emerald-600">
                −{formatNumber(day.discount_amount, true)}
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
