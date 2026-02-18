// OrderDetailsPage.jsx
import React, { useEffect } from "react";
import {
  Receipt,
  Package,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  ChefHat,
  Wine,
  Calendar,
  Hash,
  CreditCard,
  FileText,
  Download,
  Printer,
  ArrowLeft,
  ReceiptIndianRupee,
} from "lucide-react";
import PageHeader from "../../layout/PageHeader";
import FoodTypeIcon from "../../partial/common/FoodTypeIcon";
import { formatNumber } from "../../utils/numberFormatter";
import { formatDate } from "../../utils/dateFormatter";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "../../hooks/useQueryParams";
import { downlaodOrderInvoice, fetchOrderByIdApi } from "../../redux/slices/orderSlice";
import OrderDetailsPageSkeleton from "../../partial/order/OrderDetailsPageSkeleton";
import OrderBadge from "../../partial/order/OrderBadge";
import { handleResponse } from "../../utils/helpers";
import NoDataFound from "../../layout/NoDataFound";

export default function OrderDetailsPage({ onDownload, onPrint }) {
  const dispatch = useDispatch();
  const { orderId } = useQueryParams();
  const { orderDetails: order, isFetchingOrderDetails } = useSelector(
    (state) => state.order,
  );

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderByIdApi(orderId));
    }
  }, [orderId]);

  const getStatusConfig = (status) => {
    const configs = {
      completed: {
        color: "emerald",
        icon: CheckCircle2,
        label: "Completed",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
      },
      pending: {
        color: "amber",
        icon: Clock,
        label: "Pending",
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
      },
      cancelled: {
        color: "red",
        icon: XCircle,
        label: "Cancelled",
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
      },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(order?.status);
  const StatusIcon = statusConfig.icon;

  const handleDownload = async() => {
    await handleResponse(dispatch(downlaodOrderInvoice(orderId)),(res) => {
      console.log(res)
    })

  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint(order);
    } else {
      window.print();
    }
  };

  const actions = [
    {
      label: "Download",
      type: "export",
      icon: Download,
      onClick: () => handleDownload(),
    },
    {
      label: "Print",
      type: "primary",
      icon: Printer,
      onClick: () => handlePrint(),
    },
  ];

  if (isFetchingOrderDetails) {
    return <OrderDetailsPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={"Order Details"}
        description={order?.order_number}
        showBackButton
        actions={actions}
      />

      {/* Main Content */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Info & Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Status Banner */}
              <div
                className={`${statusConfig.bg} ${statusConfig.text} px-6 py-4 border-b ${statusConfig.border}`}
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <StatusIcon className="w-6 h-6" />
                    <div>
                      <p className="font-semibold text-lg">
                        {statusConfig.label}
                      </p>
                      <p className="text-sm opacity-80">
                        Payment: {order?.payment_status}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {formatNumber(order?.total_amount, true)}
                    </p>
                    <p className="text-sm opacity-80">Total Amount</p>
                  </div>
                </div>
              </div>

              {/* Order Metadata */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem
                  icon={Hash}
                  label="Order Number"
                  value={order?.order_number}
                />
                <InfoItem
                  icon={Package}
                  label="Order Type"
                  value={order?.order_type}
                  badge
                />
                <InfoItem
                  icon={Calendar}
                  label="Created"
                  value={formatDate(order?.created_at, "longTime")}
                />
                <InfoItem
                  icon={Clock}
                  label="Billed At"
                  value={formatDate(order?.billed_at, "longTime")}
                />
                <InfoItem
                  icon={User}
                  label="Created By"
                  value={order?.created_by_name}
                />
                <InfoItem
                  icon={User}
                  label="Guest Count"
                  value={order?.guest_count}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ReceiptIndianRupee className="w-5 h-5" />
                  Order Items
                  <span className="ml-auto text-sm font-normal text-gray-600">
                    {order?.items?.length} items
                  </span>
                </h2>
              </div>

             <div className="divide-y divide-gray-100">
  {order?.items?.length > 0 ? (
    order.items.map((item, index) => (
      <OrderItem key={item?.id || index} item={item} index={index} />
    ))
  ) : (
    <NoDataFound title="No items found"/> 
  )}
</div>

            </div>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-20">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Summary
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <SummaryRow label="Subtotal" value={order?.subtotal} />
                <SummaryRow
                  label="Tax"
                  value={order?.tax_amount}
                  highlight="text-blue-600"
                />
                {parseFloat(order?.discount_amount) > 0 && (
                  <SummaryRow
                    label="Discount"
                    value={`-${order?.discount_amount}`}
                    highlight="text-green-600"
                  />
                )}
                {parseFloat(order?.service_charge) > 0 && (
                  <SummaryRow
                    label="Service Charge"
                    value={order?.service_charge}
                  />
                )}
                {parseFloat(order?.packaging_charge) > 0 && (
                  <SummaryRow
                    label="Packaging Charge"
                    value={order?.packaging_charge}
                  />
                )}
                {parseFloat(order?.delivery_charge) > 0 && (
                  <SummaryRow
                    label="Delivery Charge"
                    value={order?.delivery_charge}
                  />
                )}
                {parseFloat(order?.round_off) !== 0 && (
                  <SummaryRow
                    label="Round Off"
                    value={order?.round_off}
                    highlight={
                      parseFloat(order?.round_off) < 0
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  />
                )}

                <div className="pt-4 border-t-2 border-gray-200 space-y-2">
                  <SummaryRow
                    label="Total Amount"
                    value={order?.total_amount}
                    bold
                    large
                  />

                  <SummaryRow
                    label="Paid Amount"
                    value={order?.paid_amount}
                    highlight="text-green-600"
                  />
                  {parseFloat(order?.due_amount) > 0 && (
                    <SummaryRow
                      label="Due Amount"
                      value={order?.due_amount}
                      highlight="text-red-600"
                      bold
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            {(order?.special_instructions || order?.internal_notes) && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Notes
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {order.special_instructions && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Special Instructions
                      </p>
                      <p className="text-sm text-gray-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                        {order.special_instructions}
                      </p>
                    </div>
                  )}
                  {order.internal_notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Internal Notes
                      </p>
                      <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                        {order.internal_notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function InfoItem({ icon: Icon, label, value, badge }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-gray-100 rounded-lg">
        <Icon className="w-4 h-4 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        {badge ? (
          <OrderBadge type="type" value={value} size="sm" />
        ) : (
          <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
        )}
      </div>
    </div>
  );
}

function OrderItem({ item, index }) {
  const isBar = item.counter_name?.toLowerCase().includes("bar");
  const isKitchen = item.station_name;

  return (
    <div
      className="p-6 hover:bg-gray-50 transition-colors"
      style={{
        animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
      }}
    >
      <div className="flex gap-4">
        {/* Item Number */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white font-bold">
            {index + 1}
          </div>
        </div>

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900">
                {item.item_name}
                {item.variant_name && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    ({item.variant_name})
                  </span>
                )}
              </h3>
              {item.short_name && item.short_name !== item.item_name && (
                <p className="text-xs text-gray-500">Code: {item.short_name}</p>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-bold text-gray-900">
                {formatNumber(item.total_price, true)}
              </p>
              <p className="text-xs text-gray-500">
                {formatNumber(item.unit_price, true)} ×{" "}
                {parseFloat(item.quantity)}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <OrderBadge
              type="status"
              value={item.status}
              size="md"
              showDot={false}
            />

            {isBar && (
              <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded flex items-center gap-1">
                <Wine className="w-3 h-3" />
                {item.counter_name}
              </span>
            )}

            {isKitchen && (
              <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded flex items-center gap-1">
                <ChefHat className="w-3 h-3" />
                {item.station_name}
              </span>
            )}
            <FoodTypeIcon type={item.item_type} size="lg" />

            {item.kot_id && (
              <span className="text-xs text-gray-500">KOT #{item.kot_id}</span>
            )}
          </div>

          {/* Tax Breakdown */}
          {item.tax_details && (
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              Tax: {formatNumber(item.tax_amount, true)}
              {JSON.parse(item.tax_details).map((tax, i) => (
                <span key={i} className="ml-2">
                  • {tax.componentName}: {tax.rate}%
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

function SummaryRow({ label, value, bold, large, highlight }) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`${bold ? "font-semibold" : "font-medium"} ${
          large ? "text-base" : "text-sm"
        } text-gray-700`}
      >
        {label}
      </span>
      <span
        className={`${bold ? "font-bold" : "font-semibold"} ${
          large ? "text-lg" : "text-sm"
        } ${highlight || "text-gray-900"}`}
      >
        {formatNumber(value, true)}
      </span>
    </div>
  );
}
