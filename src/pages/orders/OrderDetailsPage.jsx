import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "../../hooks/useQueryParams";
import {
  downloadOrderInvoice,
  fetchOrderByIdApi,
} from "../../redux/slices/orderSlice";
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
  Download,
  ShieldOff,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import PageHeader from "../../layout/PageHeader";
import OrderBadge from "../../partial/order/OrderBadge";
import { formatNumber, num } from "../../utils/numberFormatter";
import StatCard from "../../components/StatCard";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import { formatDate } from "../../utils/dateFormatter";
import NoDataFound from "../../layout/NoDataFound";
import LoadingOverlay from "../../components/LoadingOverlay";
import { handleResponse } from "../../utils/helpers";
import { downloadBlob } from "../../utils/blob";

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

// ─────────────────────── NC BANNER ────────────────────────────────────────────

/* Full-order NC — shown when data.isNC is true */
function OrderNCBanner({ data }) {
  if (!data?.isNC) return null;

  const isFullNC = num(data.totalAmount) === 0;
  const ncItems = (data.items || []).filter((i) => i.isNC);
  const chargedItems = (data.items || []).filter((i) => !i.isNC);

  return (
    <div className="rounded-2xl overflow-hidden border border-amber-200 bg-amber-50">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-amber-200/60">
        <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
          <ShieldOff size={16} className="text-white" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-extrabold text-amber-900 leading-none">
            {isFullNC ? "Full No-Charge Order" : "Partial No-Charge Order"}
          </p>
          <p className="text-xs text-amber-600 font-medium mt-0.5">
            {isFullNC
              ? "This entire order has been marked as no-charge — the customer was not billed."
              : `${ncItems.length} of ${data.items?.length} item${ncItems.length !== 1 ? "s" : ""} marked no-charge · remaining items billed normally.`}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xl font-extrabold text-amber-700 tabular-nums">
            {formatNumber(data.ncAmount, true)}
          </p>
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wide">
            NC Amount
          </p>
        </div>
      </div>

      {/* Detail row */}
      <div className="px-5 py-3.5 flex flex-wrap items-center gap-x-6 gap-y-2">
        {data.ncReason && (
          <div className="flex items-center gap-1.5">
            <Tag size={12} className="text-amber-500" strokeWidth={2} />
            <span className="text-xs font-bold text-amber-800">Reason: </span>
            <span className="text-xs font-semibold text-amber-700">
              {data.ncReason}
            </span>
          </div>
        )}
        {isFullNC && (
          <div className="flex items-center gap-1.5">
            <CheckCircle2
              size={12}
              className="text-amber-500"
              strokeWidth={2}
            />
            <span className="text-xs font-semibold text-amber-700">
              Grand total waived — ₹0 billed to customer
            </span>
          </div>
        )}
        {!isFullNC && chargedItems.length > 0 && (
          <div className="flex items-center gap-1.5">
            <AlertTriangle
              size={12}
              className="text-amber-500"
              strokeWidth={2}
            />
            <span className="text-xs font-semibold text-amber-700">
              {chargedItems.length} item{chargedItems.length !== 1 ? "s" : ""}{" "}
              still charged:{" "}
              {formatNumber(
                chargedItems.reduce((s, i) => s + num(i.totalPrice), 0),
                true,
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────── MAIN ─────────────────────────────────────────────────

const OrderDetailsPage = () => {
  const dispatch = useDispatch();
  const { orderId } = useQueryParams();
  const {
    orderDetails: data,
    isFetchingOrderDetails,
    isDownloadingInvoice,
  } = useSelector((s) => s.order);

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
    ...taxRows.map((t) => ({
      label: `${t.name} (${t.rate}%)`,
      value: num(t.taxAmount),
      cls: "text-sky-700",
    })),
    data.roundOff != null && {
      label: "Round Off",
      value: num(data.roundOff),
      cls: "text-slate-500",
    },
  ].filter(Boolean);

  const handleDownloadInvoice = async () => {
    await handleResponse(dispatch(downloadOrderInvoice(orderId)), (res) => {
      downloadBlob({ data: res.payload, fileName: `${inv.invoiceNumber}` });
    });
  };

  const actions = [
    {
      label: "Download Invoice",
      type: "export",
      icon: Download,
      onClick: handleDownloadInvoice,
      loading: isDownloadingInvoice,
      loadingText: "Downloading...",
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Order Details" actions={actions} showBackButton />

      {/* ── ORDER HERO ── */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))",
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          }}
        />
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />

        <div className="relative z-10 px-6 py-5 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 min-w-0">
              <p className="flex items-center gap-1.5 text-xs text-white/70 font-medium">
                <CalendarDays size={12} />
                {formatDate(data?.createdAt, "longTime")}
              </p>
              <h1 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight leading-none truncate">
                {data?.orderNumber}
              </h1>
              <div className="flex flex-wrap gap-2">
                <OrderBadge type="status" value={data?.status} size="sm" />
                <OrderBadge type="type" value={data?.orderType} size="sm" />
                <OrderBadge
                  type="payment"
                  value={data?.paymentStatus}
                  size="sm"
                />
                {/* NC indicator in hero */}
                {data?.isNC && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/40 text-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    <ShieldOff size={10} strokeWidth={2.5} />
                    No Charge
                  </span>
                )}
              </div>
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
              {/* NC amount sub-line in hero */}
              {data?.isNC && num(data.ncAmount) > 0 && (
                <p className="text-[11px] text-amber-300 mt-0.5 font-semibold">
                  NC: {formatNumber(data.ncAmount, true)} waived
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── NC BANNER (shown when order has NC) ── */}
      <OrderNCBanner data={data} />

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

      {/* ── TABLE & SEATING ── */}
      {isDineIn && (
        <MetricPanel
          icon={Table2}
          title="Table & Seating"
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
        noPad
        right={
          <div className="flex items-center gap-2">
            {/* show NC item count badge if any items are NC */}
            {items.some((i) => i.isNC) && (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                <ShieldOff size={10} strokeWidth={2.5} />
                {items.filter((i) => i.isNC).length} NC
              </span>
            )}
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
              {items?.length} {items?.length === 1 ? "item" : "items"}
            </span>
          </div>
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
            <table className="w-full min-w-[640px]">
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
                {items?.map((item, idx) => {
                  const isItemNC = item.isNC && num(item.ncAmount) > 0;
                  return (
                    <tr
                      key={item?.id}
                      className={`border-b border-slate-50 last:border-0 transition-colors
                        ${isItemNC ? "bg-amber-50/40 hover:bg-amber-50/70" : "hover:bg-slate-50/60"}`}
                    >
                      <td className="pl-5 pr-2 py-3.5 text-xs text-slate-300 tabular-nums">
                        {idx + 1}
                      </td>

                      <td className="px-3 py-3.5">
                        <div className="flex items-start gap-2">
                          {/* FSSAI dot */}
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
                            {/* ── Item-level NC indicator ── */}
                            {isItemNC && (
                              <div className="mt-1.5 flex items-center gap-1.5 bg-amber-100 border border-amber-200 rounded-md px-2 py-1 w-fit">
                                <ShieldOff
                                  size={10}
                                  className="text-amber-600"
                                  strokeWidth={2.5}
                                />
                                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">
                                  No Charge
                                </span>
                                {item.ncReason && (
                                  <>
                                    <span className="text-amber-400 text-[10px]">
                                      ·
                                    </span>
                                    <span className="text-[10px] font-semibold text-amber-600">
                                      {item.ncReason}
                                    </span>
                                  </>
                                )}
                              </div>
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

                      {/* Total cell — strikethrough + ₹0 for NC items */}
                      <td className="pl-3 pr-5 py-3.5 text-right">
                        {isItemNC ? (
                          <div>
                            <p className="text-[11px] text-slate-400 line-through tabular-nums">
                              {formatNumber(item?.totalPrice, true)}
                            </p>
                            <p className="text-[13px] font-bold text-amber-600 tabular-nums">
                              ₹0
                            </p>
                          </div>
                        ) : (
                          <span className="text-[13px] font-bold text-slate-900 tabular-nums">
                            {formatNumber(item?.totalPrice, true)}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
                {/* NC savings row — shown only when NC items exist */}
                {items.some((i) => i.isNC) && (
                  <tr className="bg-amber-50 border-t border-amber-100">
                    <td
                      colSpan={6}
                      className="pl-5 py-2.5 text-xs font-bold text-amber-700"
                    >
                      <div className="flex items-center gap-1.5">
                        <ShieldOff
                          size={11}
                          strokeWidth={2.5}
                          className="text-amber-500"
                        />
                        No-charge savings
                      </div>
                    </td>
                    <td className="pl-3 pr-5 py-2.5 text-right text-[13px] font-extrabold text-amber-600 tabular-nums">
                      −{" "}
                      {formatNumber(
                        items
                          .filter((i) => i.isNC)
                          .reduce((s, i) => s + num(i.ncAmount), 0),
                        true,
                      )}
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>
        )}
      </MetricPanel>

      {/* ── PAYMENT + DISCOUNTS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Payment */}
        <MetricPanel
          icon={CreditCard}
          title="Payment"
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
            {/* NC waived row */}
            {data?.isNC && num(data.ncAmount) > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                  <ShieldOff size={11} strokeWidth={2} />
                  NC Waived
                </span>
                <span className="text-sm font-bold text-amber-600 tabular-nums">
                  − {formatNumber(data.ncAmount, true)}
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
        <MetricPanel icon={Tag} title="Discounts">
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
      <MetricPanel icon={ReceiptIndianRupee} title="Price Breakup" noPad>
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
          {/* NC savings line in breakup */}
          {data?.isNC && num(data.ncAmount) > 0 && (
            <div className="flex justify-between items-baseline gap-6 py-2.5">
              <span className="text-xs text-amber-600 font-semibold flex items-center gap-1.5">
                <ShieldOff
                  size={11}
                  strokeWidth={2}
                  className="text-amber-500"
                />
                No Charge Waived
              </span>
              <span className="text-xs font-semibold tabular-nums text-amber-600">
                − {formatNumber(data.ncAmount, true)}
              </span>
            </div>
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
            {num(data.ncAmount) > 0 && (
              <div className="text-right">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  NC Waived
                </p>
                <p className="text-base font-bold text-amber-400 tabular-nums">
                  − {formatNumber(data.ncAmount, true)}
                </p>
              </div>
            )}
            {num(data.balanceDue) > 0 && (
              <div className="text-right">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  Due
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
        <MetricPanel icon={Store} title="Outlet">
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

        <MetricPanel icon={User} title="Customer">
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
