import {
  AlertCircle,
  BadgeIndianRupee,
  Calendar,
  ChevronDown,
  Clock,
  ExternalLink,
  Hash,
  Mail,
  Phone,
  ReceiptText,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatNumber } from "../../../utils/numberFormatter";
import { formatDate } from "../../../utils/dateFormatter";
import { Link } from "react-router-dom";

/* ─── Due status badge ────────────────────────────────────────────────────── */
function DueBadge({ amount }) {
  if (!amount || amount <= 0)
    return (
      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
        Cleared
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 ring-1 ring-red-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
      <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
      Due
    </span>
  );
}

/* ─── Smooth accordion ────────────────────────────────────────────────────── */
function Accordion({ open, children }) {
  const innerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!innerRef.current) return;
    if (open) {
      // Measure real height then animate to it
      setHeight(innerRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [open]);

  return (
    <div
      style={{
        height: height,
        overflow: "hidden",
        transition: "height 300ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

/* ─── Customer card ───────────────────────────────────────────────────────── */
export function CustomerDueCard({ customer }) {
  const [expanded, setExpanded] = useState(false);
  const hasPending = customer.pendingOrders?.length > 0;
  const pctCollected =
    customer.totalDueCollected + (customer.dueBalance || 0) > 0
      ? (
          (customer.totalDueCollected /
            (customer.totalDueCollected + (customer.dueBalance || 0))) *
          100
        ).toFixed(0)
      : 0;

  return (
    <div>
      <div className="border border-slate-100 rounded-2xl overflow-hidden hover:border-slate-200 transition-colors duration-200 bg-white">
        {/* ── Customer header ── */}
        <div className="px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            {/* Avatar + info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-white uppercase">
                  {customer.name?.charAt(0) ?? "?"}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-slate-900 truncate">
                  {customer.name}
                </p>
                {customer.phone && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Phone
                      size={10}
                      className="text-slate-400"
                      strokeWidth={2}
                    />
                    <span className="text-xs text-slate-400 font-medium">
                      {customer.phone}
                    </span>
                  </div>
                )}
                {customer.email && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Mail
                      size={10}
                      className="text-slate-400"
                      strokeWidth={2}
                    />
                    <span className="text-xs text-slate-400 font-medium">
                      {customer.email}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Due badge + amount */}
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <DueBadge amount={customer.dueBalance} />
              {customer.dueBalance > 0 && (
                <p className="text-base font-extrabold text-red-600 tabular-nums">
                  {formatNumber(customer.dueBalance, true)}
                </p>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              {
                label: "Total Orders",
                value: customer.totalOrders,
                icon: Hash,
              },
              {
                label: "Due Orders",
                value: customer.totalDueOrders,
                icon: AlertCircle,
                accent:
                  customer.totalDueOrders > 0
                    ? "text-amber-600"
                    : "text-slate-400",
              },
              {
                label: "Collected",
                value: formatNumber(customer.totalDueCollected, true),
                icon: BadgeIndianRupee,
                accent: "text-emerald-600",
              },
            ].map(({ label, value, icon: Icon, accent }) => (
              <div
                key={label}
                className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5"
              >
                <div className="flex items-center gap-1 mb-1">
                  <Icon
                    size={10}
                    className={accent ?? "text-slate-400"}
                    strokeWidth={2.5}
                  />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    {label}
                  </span>
                </div>
                <p
                  className={`text-sm font-extrabold tabular-nums ${accent ?? "text-slate-800"}`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Collection progress bar */}
          {(customer.totalDueCollected > 0 || customer.dueBalance > 0) && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Collection Progress
                </span>
                <span className="text-[10px] font-bold text-emerald-600">
                  {pctCollected}% recovered
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${pctCollected}%` }}
                />
              </div>
            </div>
          )}

          {/* Last due date */}
          {customer.lastDueDate && (
            <div className="flex items-center gap-1.5 mt-3">
              <Clock size={11} className="text-slate-400" strokeWidth={2} />
              <span className="text-xs text-slate-400 font-medium">
                Last due: {formatDate(customer.lastDueDate, "long")} ·{" "}
                {formatDate(customer.lastDueDate, "time")}
              </span>
            </div>
          )}
        </div>

        {/* ── Card footer — actions ── */}
        <div className="flex border-t border-slate-100">
          <Link
            to={`/customers/details?customerId=${customer.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-150"
          >
            <Users size={12} strokeWidth={2.5} />
            View Customer
          </Link>

          {hasPending && (
            <>
              <div className="w-px bg-slate-100" />
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all duration-150"
              >
                <ReceiptText size={12} strokeWidth={2} />
                {customer.pendingOrders.length} Order
                {customer.pendingOrders.length > 1 ? "s" : ""}
                <ChevronDown
                  size={12}
                  className="transition-transform duration-300"
                  style={{
                    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                  strokeWidth={2}
                />
              </button>
            </>
          )}
        </div>

        {/* Smooth accordion body */}
        <Accordion open={expanded}>
          <div className="px-5 pb-4 pt-3 border-t border-slate-50 space-y-3">
            {customer.pendingOrders.map((order) => (
              <div
                key={order.orderId}
                className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50"
              >
                {/* Order header */}
                <div className="flex items-start justify-between gap-2 px-4 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-extrabold text-slate-900">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {order.invoiceNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar
                        size={10}
                        className="text-slate-400"
                        strokeWidth={2}
                      />
                      <span className="text-[11px] text-slate-400 font-medium">
                        {formatDate(order.createdAt, "long")} ·{" "}
                        {formatDate(order.createdAt, "time")}
                      </span>
                    </div>
                  </div>

                  {/* ← REPLACE the plain due text with this */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className="text-xs font-extrabold text-red-600 tabular-nums">
                      {formatNumber(order.dueAmount, true)} due
                    </span>
                    <Link
                      to={`/orders/details?orderId=${order.orderId}`}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-primary-600 transition-colors duration-150"
                    >
                      View Order
                      <ExternalLink size={10} strokeWidth={2.5} />
                    </Link>
                  </div>
                </div>

                {/* Order amounts */}
                <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100">
                  {[
                    {
                      label: "Total",
                      value: formatNumber(order.totalAmount, true),
                      color: "text-slate-700",
                    },
                    {
                      label: "Paid",
                      value: formatNumber(order.paidAmount, true),
                      color: "text-emerald-600",
                    },
                    {
                      label: "Due",
                      value: formatNumber(order.dueAmount, true),
                      color: "text-red-600",
                    },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center py-2.5 px-2"
                    >
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        {label}
                      </span>
                      <span
                        className={`text-xs font-extrabold tabular-nums ${color}`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Accordion>
      </div>
    </div>
  );
}
