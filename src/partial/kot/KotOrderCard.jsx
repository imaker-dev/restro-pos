import {
  AlertCircle,
  Package,
  ShoppingBag,
  Truck,
  Utensils,
} from "lucide-react";
import React, { useState } from "react";
import FoodTypeIcon from "../common/FoodTypeIcon";
import { formatDate } from "../../utils/dateFormatter";

const ITEMS_TO_SHOW = 3;

const KotOrderCard = ({ order, onUpdate, getStatusConfig }) => {
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const getOrderTypeInfo = (type) => {
    switch (type) {
      case "dine-in":
        return { label: "Dine In", icon: Utensils };
      case "takeaway":
        return { label: "Take Away", icon: ShoppingBag };
      case "delivery":
        return { label: "Delivery", icon: Truck };
      default:
        return { label: "Order", icon: Package };
    }
  };

  const getItemStatusDot = (status) => {
    const colors = {
      pending: "bg-orange-500",
      preparing: "bg-blue-500",
      ready: "bg-green-500",
      served: "bg-gray-400",
      cancelled: "bg-red-500",
    };
    return colors[status] || "bg-gray-400";
  };

  const statusConfig = getStatusConfig(order?.status);
  const orderTypeInfo = getOrderTypeInfo(order?.orderType);
  const OrderTypeIcon = orderTypeInfo.icon;
  const isExpanded = expandedOrders[order?.id];
  const displayItems = isExpanded
    ? order?.items
    : order?.items.slice(0, ITEMS_TO_SHOW);
  const hasMoreItems = order?.items.length > ITEMS_TO_SHOW;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <OrderTypeIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-b old text-gray-900">{order?.kot_number}</h3>
              <p className="text-sm text-gray-500">
                {/* {orderTypeInfo.label} */}
                {order?.table_number &&
                  `Table No: ${order?.table_number}`} •{" "}
                {formatDate(order?.created_at, "timeAgo")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="p-4 space-y-2 min-h-[200px]">
        {displayItems && displayItems.length > 0 ? (
          displayItems.map((item) => (
            <div key={item.id}>
              <div className="flex items-center w-full">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full ${getItemStatusDot(item?.status)} flex-shrink-0`}
                    title={item?.status}
                  />
                  <FoodTypeIcon type={item?.item_type} size="xs" />
                  <p
                    className={`text-sm font-medium whitespace-nowrap
    ${
      item?.status === "cancelled"
        ? "line-through text-red-500"
        : "text-gray-900"
    }`}
                  >
                    {item?.item_name}
                    {item?.variant_name && (
                      <span className="text-gray-500 ml-1">
                        ({item.variant_name})
                      </span>
                    )}
                  </p>
                </div>
                {/* Dashed Line */}
                <div className="flex-1 border-b border-dashed border-gray-300 mx-2"></div>

                <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                  ×{Number(item?.quantity)}
                </span>
              </div>

              {/* Addons */}
              {item?.addons?.length > 0 && (
                <div className="mt-1.5 ml-6 space-y-1">
                  {item.addons.map((addon, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-xs text-gray-600"
                    >
                      <div className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                      <span>{addon?.addon_name}</span>
                      {addon?.quantity > 1 && (
                        <span className="text-gray-400">
                          (×{addon?.quantity})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {item?.special_instructions && (
                <div className="flex items-center gap-1 mt-1 bg-[#F8F8F8] text-slate-900 rounded-md p-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <p className="text-xs">Notes: {item?.special_instructions}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-gray-400">
            No items in this order
          </div>
        )}

        {hasMoreItems && (
          <button
            onClick={() => toggleOrderExpansion(order?.id)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 mt-2"
          >
            {isExpanded
              ? "Show Less"
              : `+${order?.items?.length - ITEMS_TO_SHOW} More Items`}
          </button>
        )}
      </div>

      {/* Card Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3">
        <span className={`text-sm font-semibold ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
        {statusConfig.nextStatus && (
          <button
            onClick={(e) => {
              (e.stopPropagation(), onUpdate(order));
            }}
            className={`btn-sm text-white transition-colors ${statusConfig.buttonClass}`}
          >
            {statusConfig.nextLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default KotOrderCard;
