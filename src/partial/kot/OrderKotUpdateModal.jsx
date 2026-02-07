import React from "react";
import FoodTypeIcon from "../common/FoodTypeIcon";
import { Loader2, X } from "lucide-react";
import ModalBlank from "../../components/ModalBlank";

const OrderKotUpdateModal = ({
  isOpen,
  onClose,
  order,
  onSubmit,
  loading = false,
  getStatusConfig,
}) => {
  const statusConfig = getStatusConfig(order?.status);
  return (
    <ModalBlank id={"kot-update"} isOpen={isOpen} onClose={onClose} size="md">
      <div>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Update Order Status
            </h2>
            <button
              onClick={() => onClose()}
              className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {order?.orderNumber}
            {order?.tableNumber && ` • Table ${order?.tableNumber}`}
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-3">
              Order Items ({order?.items?.length || 0})
            </p>

            <div className="space-y-2">
              {order?.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div
                    key={item?.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <FoodTypeIcon isVeg={item?.isVeg} />
                      <p className="text-sm font-medium text-gray-900">
                        {item?.item_name}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      ×{item?.quantity}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-6 text-sm text-gray-400">
                  No items in this order
                </div>
              )}
            </div>
          </div>

          <div className={`${statusConfig.bgColor} rounded-xl p-4 mt-4`}>
            <p className="text-sm font-medium text-gray-900">
              Change status to{" "}
              <span className={statusConfig.color}>
                {getStatusConfig(statusConfig.nextStatus)?.label}
              </span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={() => onClose()}
            disabled={loading}
            className="flex-1 btn border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            onClick={() => onSubmit(order?.id, statusConfig.nextStatus)}
            disabled={loading}
            className={`flex-1 btn text-white flex items-center justify-center gap-2 ${statusConfig.buttonClass} disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              statusConfig.nextLabel
            )}
          </button>
        </div>
      </div>
    </ModalBlank>
  );
};

export default OrderKotUpdateModal;
