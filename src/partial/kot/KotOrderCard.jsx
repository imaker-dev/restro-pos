import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Loader2,
  Package,
  ShoppingBag,
  Truck,
  Utensils,
} from "lucide-react";
import React, { useState } from "react";
import FoodTypeIcon from "../common/FoodTypeIcon";
import { formatDate } from "../../utils/dateFormatter";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ORDER_STATUSES, STATUS_FLOW } from "../../utils/orderStatusConfig";
import { useSelector } from "react-redux";

const ITEMS_TO_SHOW = 3;

const KotOrderCard = ({
  order,
  updateOrderStatus,
  markItemReady,
  getStatusConfig,
}) => {
  const { updatingKotId, kotItemToReadyId } = useSelector((state) => state.kot);
  const [expandedOrders, setExpandedOrders] = useState({});

  const currentIndex = STATUS_FLOW.indexOf(order.status);
  const allowedStatuses =
    currentIndex >= 0 ? STATUS_FLOW.slice(currentIndex + 1) : [];

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const statusConfig = getStatusConfig(order?.status);
  const isExpanded = expandedOrders[order?.id];
  const displayItems = isExpanded
    ? order?.items
    : order?.items.slice(0, ITEMS_TO_SHOW);
  const hasMoreItems = order?.items.length > ITEMS_TO_SHOW;

  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Card Header */}
        <div className="p-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900">{order?.kotNumber}</h3>
            <p className="text-sm text-gray-500">
              {/* {orderTypeInfo.label} */}
              {order?.tableNumber && `Table No: ${order?.tableNumber}`} •{" "}
              {formatDate(order?.createdAt, "timeAgo")}
            </p>
          </div>
        </div>

        {/* Items List */}
        <div className="p-4 space-y-2 min-h-[150px]">
          {displayItems && displayItems?.length > 0 ? (
            displayItems?.map((item) => {
              const canMarkReady =
                item?.status !== "ready" &&
                item?.status !== "served" &&
                item?.status !== "cancelled";

              return (
                <div key={item.id}>
                  <div className="flex items-center w-full">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          ORDER_STATUSES[item?.status]?.dotColor ||
                          "bg-gray-400"
                        } flex-shrink-0`}
                      />

                      <FoodTypeIcon type={item?.itemType} size="xs" />
                      <p
                        className={`text-sm font-medium whitespace-nowrap
                    ${
                      item?.status === "cancelled"
                        ? "line-through text-red-500 opacity-70"
                        : "text-gray-900"
                    }
                    `}
                      >
                        {item?.name}
                        {item?.variantName && (
                          <span className="text-gray-500 ml-1">
                            ({item.variantName})
                          </span>
                        )}
                      </p>
                    </div>
                    {/* Dashed Line */}
                    <div className="flex-1 border-b border-dashed border-gray-300 mx-2"></div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                        ×{item?.quantity}
                      </span>
                      {/* Mark Ready Button - Only shows on hover */}
                      {canMarkReady && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markItemReady(item.id);
                          }}
                          disabled={kotItemToReadyId}
                          className="p-1 hover:bg-green-100 rounded"
                          title="Mark item as ready"
                        >
                          {kotItemToReadyId === item.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Addons */}
                  {item?.addons?.length > 0 && (
                    <div className="mt-1.5 ml-6 space-y-1">
                      {item?.addons.map((addon, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 text-xs text-gray-600"
                        >
                          <div className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                          <span>{addon?.name}</span>
                          {addon?.quantity > 0 && (
                            <span className="text-gray-400">
                              (×{addon?.quantity})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {item?.specialInstructions && (
                    <div className="flex items-center gap-1 mt-1 bg-[#F8F8F8] text-slate-900 rounded-md p-1">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <p className="text-xs">
                        Notes: {item?.specialInstructions}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
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
          <span className="text-xs text-gray-500 font-medium">
            {order?.totalItemCount} items • {order?.readyCount} ready •{" "}
            {order?.cancelledItemCount} cancelled
          </span>

          {allowedStatuses?.length > 0 ? (
            <div
              className="relative inline-block text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <Menu>
                {/* CURRENT STATUS BUTTON */}
                <MenuButton
                  disabled={updatingKotId}
                  className={`
                  px-3 py-1.5 rounded-md text-sm font-semibold capitalize
                  flex items-center gap-1 border ${statusConfig.borderColor}
                  ${statusConfig.bgColor} ${statusConfig.color}
                   ${updatingKotId ? "opacity-60 cursor-not-allowed" : ""}
                `}
                >
                  {updatingKotId === order?.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      {statusConfig.label}
                      <ChevronDown className="w-4 h-4 opacity-70" />
                    </>
                  )}
                </MenuButton>

                {/* DROPDOWN */}
                <MenuItems
                  anchor="bottom end"
                  className="mt-2 w-44 origin-top-right
                  rounded bg-white border border-gray-200 shadow-xl z-30
                  outline-none focus:outline-none ring-0 focus:ring-0"
                >
                  {allowedStatuses.map((status) => {
                    return (
                      <MenuItem key={status}>
                        {({ active }) => (
                          <button
                            onClick={() => updateOrderStatus(order.id, status)}
                            className={`
                            group flex w-full items-center gap-2 rounded px-3 py-2 text-sm capitalize transition
                            ${active ? "bg-gray-100" : ""}
                          `}
                          >
                            {/* Status Dot */}
                            <span
                              className={`w-2 h-2 rounded-full ${
                                ORDER_STATUSES[status]?.dotColor ||
                                "bg-gray-400"
                              }`}
                            />
                            <span className="font-medium text-gray-700">
                              Mark {status}
                            </span>
                          </button>
                        )}
                      </MenuItem>
                    );
                  })}
                </MenuItems>
              </Menu>
            </div>
          ) : (
            // If Served → no dropdown
            <span
              className={`px-3 py-1.5 rounded-md text-sm font-semibold capitalize border ${statusConfig.borderColor}
          ${statusConfig.bgColor} ${statusConfig.color}`}
            >
              {statusConfig.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default KotOrderCard;
