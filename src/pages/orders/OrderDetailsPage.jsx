import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "../../hooks/useQueryParams";
import { fetchOrderByIdApi } from "../../redux/slices/orderSlice";
import {
  UtensilsCrossed,
  Store,
  User,
  CreditCard,
  Banknote,
  Smartphone,
  Tag,
  Table2,
  Users,
  BadgeCheck,
  Hash,
  CalendarDays,
  ReceiptIndianRupee,
} from "lucide-react";
import PageHeader from "../../layout/PageHeader";
import OrderBadge from "../../partial/order/OrderBadge";
import { formatNumber, num } from "../../utils/numberFormatter";
import StatCard from "../../components/StatCard";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import { formatDate } from "../../utils/dateFormatter";
import NoDataFound from "../../layout/NoDataFound";
import LoadingOverlay from "../../components/LoadingOverlay";

// ─────────────────────── CONFIG ───────────────────────────────────────────────

const PAY_METHOD = {
  cash: {
    label: "Cash",
    icon: Banknote,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  upi: {
    label: "UPI",
    icon: Smartphone,
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  card: {
    label: "Card",
    icon: CreditCard,
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },
};

// ─────────────────────── ATOMS ────────────────────────────────────────────────

// Single info row — skips render if value is falsy
const Row = ({ label, value, mono = false, cls = "", href }) => {
  if (value === null || value === undefined || value === "") return null;
  const valEl = href ? (
    <a
      href={href}
      className="text-xs font-semibold text-blue-600 hover:underline text-right"
    >
      {value}
    </a>
  ) : (
    <span
      className={`text-xs font-semibold text-right text-slate-700 ${mono ? "font-mono text-slate-500" : ""} ${cls}`}
    >
      {value}
    </span>
  );
  return (
    <div className="flex items-baseline justify-between gap-6 py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-xs text-slate-400 shrink-0">{label}</span>
      {valEl}
    </div>
  );
};

// ─────────────────────── MAIN ─────────────────────────────────────────────────

const OrderDetailsPage = () => {
  const dispatch = useDispatch();
  const { orderId } = useQueryParams();
  const { orderDetails: data, isFetchingOrderDetails } = useSelector(
    (s) => s.order,
  );

  useEffect(() => {
    if (orderId) dispatch(fetchOrderByIdApi(orderId));
  }, [orderId]);

  if (isFetchingOrderDetails)
    return <LoadingOverlay text="Loading Order Details..." />;

  if (!data && !isFetchingOrderDetails)
    return (
      <NoDataFound
        icon={ReceiptIndianRupee}
        title="Select an order to view its details."
      />
    );

  // ── derived ──
  const inv = data.invoice || {};

  const isDineIn = data?.orderType === "dine_in";
  const items = data?.items || [];
  const discounts = data?.discounts || [];
  const splits = data?.payments?.[0]?.splitBreakdown || [];
  const taxRows = Object.values(data?.taxBreakup || {}).filter(
    (t) => num(t.taxAmount) > 0,
  );

  // price breakup line items — only show non-zero rows
  const breakupLines = [
    { label: "Subtotal", value: num(data.subtotal), cls: "text-slate-700" },
    num(data.discountAmount) > 0 && {
      label: discounts[0]?.discountName
        ? `Discount — ${discounts[0].discountName}`
        : "Discount",
      value: -num(data.discountAmount),
      cls: "text-amber-600",
      prefix: "−",
    },
    num(data.serviceCharge) > 0 && {
      label: "Service Charge",
      value: num(data.serviceCharge),
    },
    num(data.packagingCharge) > 0 && {
      label: "Packaging Charge",
      value: num(data.packagingCharge),
    },
    num(data.deliveryCharge) > 0 && {
      label: "Delivery Charge",
      value: num(data.deliveryCharge),
    },
    // tax rows inline
    ...taxRows.map((t) => ({
      label: `${t.name} (${t.rate}% )`,
      value: num(t.taxAmount),
      cls: "text-sky-700",
    })),
    data.roundOff != null && {
      label: "Round Off",
      value: num(data.roundOff),
      cls: "text-slate-500",
    },
  ].filter(Boolean);

  return (
    <div className="space-y-5">
      <PageHeader onlyBack backLabel="Back to Orders" />

      {/* ── ORDER HERO SECTION ── */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))",
        }}
      >
        {/* Highlight line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          }}
        />

        {/* Soft radial glow */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />

        <div className="relative z-10 px-6 py-5 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* LEFT SIDE */}
            <div className="space-y-3 min-w-0">
              {/* Date */}
              <p className="flex items-center gap-1.5 text-xs text-white/70 font-medium">
                <CalendarDays size={12} />
                {formatDate(data?.createdAt, "longTime")}
              </p>

              {/* Order Number */}
              <h1 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight leading-none truncate">
                {data?.orderNumber}
              </h1>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <OrderBadge type="status" value={data?.status} size="sm" />
                <OrderBadge type="type" value={data?.orderType} size="sm" />
                <OrderBadge
                  type="payment"
                  value={data?.paymentStatus}
                  size="sm"
                />
              </div>

              {/* Extra Meta */}
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/70">
                {data?.guestCount != null && (
                  <span className="flex items-center gap-1">
                    <Users size={11} />
                    {data?.guestCount}{" "}
                    {data?.guestCount === 1 ? "Guest" : "Guests"}
                  </span>
                )}

                {data?.createdBy?.name && (
                  <span className="flex items-center gap-1">
                    <Hash size={11} />
                    {data?.createdBy.name}
                  </span>
                )}
              </div>
            </div>

            {/* RIGHT SIDE - Total */}
            <div className="flex-shrink-0 lg:text-right">
              <p className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">
                Grand Total
              </p>

              <p className="text-[36px] font-bold tabular-nums leading-none">
                {formatNumber(data?.totalAmount, true)}
              </p>

              <p className="text-[11px] text-white/70 mt-1">
                Paid: {formatNumber(data?.paidAmount, true)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── STAT TILES ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Grand Total",
            value: formatNumber(data?.totalAmount, true),
            color: "slate",
          },
          {
            label: "Amount Paid",
            value: formatNumber(data?.paidAmount, true),
            color: "emerald",
          },
          {
            label: "Tax Collected",
            value: formatNumber(data?.totalTax, true),
            color: "sky",
          },
          {
            label: "Total Discount",
            value: formatNumber(data?.discountAmount, true),
            color: "amber",
          },
        ].map(({ label, value, color }) => (
          <StatCard
            key={label}
            title={label}
            value={value}
            color={color}
            variant="v9"
          />
        ))}
      </div>

      {/* ── TABLE & SEATING — dine_in only ── */}
      {isDineIn && (
        <MetricPanel
          icon={Table2}
          title="Table & Seating"
          // desc=""
          right={
            <span className="text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full">
              {data?.tableName}
            </span>
          }
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Table", value: data?.tableName },
              { label: "Floor", value: data?.floorName },
              { label: "Section", value: data?.sectionName },
              {
                label: "Capacity",
                value:
                  data?.tableCapacity != null
                    ? `${data?.tableCapacity} seats`
                    : null,
              },
            ]
              .filter((r) => r.value)
              .map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-slate-50 rounded-xl px-3.5 py-3 border border-slate-100"
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                    {label}
                  </p>
                  <p className="text-sm font-bold text-slate-800">{value}</p>
                </div>
              ))}
          </div>
        </MetricPanel>
      )}

      {/* ── ORDERED ITEMS ── */}
      <MetricPanel
        icon={UtensilsCrossed}
        title="Ordered Items"
        // desc=""
        noPad
        right={
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
            {items?.length} {items?.length === 1 ? "item" : "items"}
          </span>
        }
      >
        {items?.length === 0 ? (
          <div className="p-5">
            <NoDataFound
              icon={UtensilsCrossed}
              title="No items in this order"
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60">
                  {[
                    "#",
                    "Item",
                    "Category",
                    "Station",
                    "Qty",
                    "Rate",
                    "Total",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400
                        ${i === 0 ? "pl-5 pr-2 text-left w-8" : i <= 3 ? "px-3 text-left" : i === 6 ? "pl-3 pr-5 text-right" : "px-3 text-right"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items?.map((item, idx) => (
                  <tr
                    key={item?.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="pl-5 pr-2 py-3.5 text-xs text-slate-300 tabular-nums">
                      {idx + 1}
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-start gap-2">
                        {/* FSSAI dot-in-square */}
                        <div
                          className={`mt-0.5 w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center shrink-0
                            ${item?.itemType === "veg" ? "border-emerald-600" : "border-red-600"}`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${item?.itemType === "veg" ? "bg-emerald-600" : "bg-red-600"}`}
                          />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-slate-800 leading-tight">
                            {item?.itemName}
                          </p>
                          {item?.variantName && (
                            <span className="inline-block mt-0.5 text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              {item?.variantName}
                            </span>
                          )}
                          {item?.specialInstructions && (
                            <p className="mt-0.5 text-[10px] italic text-amber-600">
                              "{item?.specialInstructions}"
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium whitespace-nowrap">
                        {item?.categoryName || "—"}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-md whitespace-nowrap">
                        {item?.stationName || "—"}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-right text-sm font-bold text-slate-800 tabular-nums">
                      {parseFloat(item?.quantity || 0).toFixed(0)}
                    </td>
                    <td className="px-3 py-3.5 text-right text-sm text-slate-500 tabular-nums">
                      {formatNumber(item?.unitPrice, true)}
                    </td>
                    <td className="pl-3 pr-5 py-3.5 text-right text-[13px] font-bold text-slate-900 tabular-nums">
                      {formatNumber(item?.totalPrice, true)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-200">
                  <td
                    colSpan={4}
                    className="pl-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide"
                  >
                    Subtotal
                  </td>
                  <td className="px-3 py-3 text-right text-xs font-bold text-slate-700 tabular-nums">
                    {items
                      .reduce((s, i) => s + parseFloat(i?.quantity || 0), 0)
                      .toFixed(0)}
                  </td>
                  <td className="px-3 py-3" />
                  <td className="pl-3 pr-5 py-3 text-right text-[15px] font-extrabold text-slate-900 tabular-nums">
                    {formatNumber(data?.subtotal, true)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </MetricPanel>

      {/* ── PAYMENT + DISCOUNTS (2 col) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Payment */}
        <MetricPanel
          icon={CreditCard}
          title="Payment"
          // desc=""
          right={
            data?.payments?.[0]?.paymentMode === "split" ? (
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                Split
              </span>
            ) : null
          }
        >
          {splits.length === 0 && !data?.payments?.length ? (
            <NoDataFound icon={CreditCard} title="No payment recorded" />
          ) : (
            <div className="space-y-2">
              {(splits.length > 0 ? splits : data?.payments || []).map(
                (p, i) => {
                  const cfg = PAY_METHOD[p.paymentMode] || {
                    label: p.paymentMode,
                    icon: CreditCard,
                    bg: "bg-slate-50",
                    text: "text-slate-600",
                    border: "border-slate-200",
                  };
                  const Icon = cfg?.icon;
                  return (
                    <div
                      key={p.id || i}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-xl border ${cfg?.bg} ${cfg?.border}`}
                    >
                      <Icon size={15} className={cfg?.text} />
                      <span
                        className={`text-sm font-semibold flex-1 ${cfg?.text}`}
                      >
                        {cfg?.label}
                      </span>
                      <span className="text-sm font-bold text-slate-900 tabular-nums">
                        {formatNumber(p?.amount, true)}
                      </span>
                    </div>
                  );
                },
              )}
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-dashed border-slate-200 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Total Paid</span>
              <span className="text-sm font-bold text-emerald-600 tabular-nums">
                {formatNumber(data?.paidAmount, true)}
              </span>
            </div>
            {num(data?.balanceDue) > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Balance Due</span>
                <span className="text-sm font-bold text-red-600 tabular-nums">
                  {formatNumber(data?.balanceDue, true)}
                </span>
              </div>
            )}
            {num(data?.balanceDue) === 0 && (
              <div className="flex items-center gap-1.5">
                <BadgeCheck size={13} className="text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-600">
                  Fully settled
                </span>
              </div>
            )}
          </div>
        </MetricPanel>

        {/* Discounts */}
        <MetricPanel
          icon={Tag}
          title="Discounts"
          // desc=""
        >
          {discounts?.length === 0 ? (
            <NoDataFound icon={Tag} title="No discounts applied" />
          ) : (
            <div className="space-y-3">
              {discounts?.map((d) => (
                <div
                  key={d?.id}
                  className="rounded-xl border border-amber-100 bg-amber-50/50 p-4"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <p className="text-sm font-bold text-amber-900 leading-snug">
                      {d?.discountName || "Discount"}
                    </p>
                    <span className="text-xs font-extrabold text-amber-700 bg-white border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
                      {d?.discountType === "percentage"
                        ? `${d?.discountValue}%`
                        : formatNumber(d?.discountValue, true)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {[
                      { l: "Applied on", v: d?.appliedOn?.replace(/_/g, " ") },
                      {
                        l: "Amount saved",
                        v: formatNumber(d?.discountAmount, true),
                      },
                      { l: "Issued by", v: d?.createdByName || "—" },
                      { l: "Time", v: formatDate(d?.createdAt, "time") },
                    ]
                      .filter((r) => r.v)
                      .map(({ l, v }) => (
                        <div key={l}>
                          <p className="text-[10px] text-slate-400 mb-0.5">
                            {l}
                          </p>
                          <p className="text-xs font-semibold text-slate-700 capitalize">
                            {v}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {discounts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-dashed border-slate-200 flex justify-between items-center">
              <span className="text-xs text-slate-500">Total Saved</span>
              <span className="text-sm font-bold text-amber-600 tabular-nums">
                − {formatNumber(data.totalDiscount, true)}
              </span>
            </div>
          )}
        </MetricPanel>
      </div>

      {/* ── PRICE BREAKUP ── */}
      <MetricPanel
        icon={ReceiptIndianRupee}
        title="Price Breakup"
        noPad
        // desc=""
      >
        {/* Line items */}
        <div className="px-5 py-4 space-y-0 divide-y divide-slate-50">
          {breakupLines?.map(
            ({ label, value, cls = "text-slate-700", prefix }) => (
              <div
                key={label}
                className="flex justify-between items-baseline gap-6 py-2.5"
              >
                <span className="text-xs text-slate-400 leading-relaxed">
                  {label}
                </span>
                <span
                  className={`text-xs font-semibold tabular-nums shrink-0 ${cls}`}
                >
                  {prefix
                    ? `${prefix} ${formatNumber(Math.abs(value), true)}`
                    : formatNumber(value, true)}
                </span>
              </div>
            ),
          )}
        </div>

        {/* Footer strip */}
        <div className="bg-slate-900 px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
              Total Payable
            </p>
            {inv.amountInWords && (
              <p className="text-xs text-slate-500 italic leading-relaxed max-w-sm">
                {inv.amountInWords}
              </p>
            )}
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Paid
              </p>
              <p className="text-base font-bold text-emerald-400 tabular-nums">
                {formatNumber(data.paidAmount, true)}
              </p>
            </div>
            {num(data.balanceDue) > 0 && (
              <div className="text-right">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  Balance
                </p>
                <p className="text-base font-bold text-red-400 tabular-nums">
                  {formatNumber(data.balanceDue, true)}
                </p>
              </div>
            )}
            <div className="text-right border-l border-slate-700 pl-8">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Grand Total
              </p>
              <p className="text-3xl font-extrabold text-white tabular-nums leading-none">
                {formatNumber(data.totalAmount, true)}
              </p>
            </div>
          </div>
        </div>
      </MetricPanel>

      {/* ── OUTLET + CUSTOMER ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <MetricPanel
          icon={Store}
          title="Outlet"
          // desc=""
        >
          <Row
            label="Name"
            value={data?.outletName}
            cls="text-slate-900 font-bold"
          />
          <Row
            label="Address"
            value={[data?.outletAddress, data?.outletCity, data?.outletState]
              .filter(Boolean)
              .join(", ")}
          />
          <Row label="GSTIN" value={data?.outletGstin} mono />
          <Row label="FSSAI" value={data?.outletFssai} mono />
        </MetricPanel>

        <MetricPanel
          icon={User}
          title="Customer"
          // desc=""
        >
          {data?.customerName ? (
            <>
              <Row
                label="Name"
                value={data?.customerName}
                cls="text-slate-900 font-bold"
              />
              <Row
                label="Phone"
                value={data?.customerPhone}
                href={data?.customerPhone ? `tel:${data?.customerPhone}` : null}
              />
              <Row
                label="Email"
                value={data?.customerEmail}
                href={
                  data?.customerEmail ? `mailto:${data?.customerEmail}` : null
                }
              />
              <Row label="Company" value={data?.customer_company_name} />
              <Row label="GSTIN" value={data?.customerGstin} mono />
              <Row
                label="GST State"
                value={
                  data?.customer_gst_state
                    ? `${data?.customer_gst_state}${data?.customer_gst_state_code ? ` (${data?.customer_gst_state_code})` : ""}`
                    : null
                }
              />
            </>
          ) : (
            <NoDataFound
              icon={User}
              title="No customer linked — walk-in order"
            />
          )}
        </MetricPanel>
      </div>

      {/* ── FOOTER ── */}
      <div className="text-center py-4 border-t border-slate-200 space-y-1">
        <p className="text-sm font-bold text-slate-600">{data?.outletName}</p>
        <p className="text-xs text-slate-400">
          {[data?.outletAddress, data?.outletCity, data?.outletState]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {data?.outletGstin && (
          <p className="text-[10px] font-mono text-slate-300">
            GSTIN: {data?.outletGstin}
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;
