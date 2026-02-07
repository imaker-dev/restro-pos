import React, { useState, useEffect } from "react";
import { Flame, CheckCircle2, X, RefreshCw } from "lucide-react";
import KotOrderCard from "../../partial/kot/KotOrderCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrdersKot,
  markReadyKot,
  prepareOrderKot,
  serveOrderKot,
} from "../../redux/slices/kotSlice";
import OrderKotUpdateModal from "../../partial/kot/OrderKotUpdateModal";
import { handleResponse } from "../../utils/helpers";
import KotOrderCardSkeleton from "../../partial/kot/KotOrderCardSkeleton";
import SocketBadge from "../../partial/common/SocketBadge";
import { formatDate } from "../../utils/dateFormatter";
import Tabs from "../../components/Tabs";
import SearchBar from "../../components/SearchBar";

export default function KitchenDisplayPage() {
  const dispatch = useDispatch();
  const { allOrdersKot, loading, isUpdatingKot } = useSelector(
    (state) => state.kot,
  );
  const { kots, stats } = allOrdersKot || {};
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);

  const fetchOrder = async () => {
    await handleResponse(
      dispatch(
        fetchAllOrdersKot({ status: selectedStatus, station: "kitchen" }),
      ),
      () => {
        setLastFetchedAt(new Date());
      },
    );
  };

  useEffect(() => {
    fetchOrder();
  }, [selectedStatus]);

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "Pending",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        nextStatus: "preparing",
        nextLabel: "Start Preparing",
        buttonClass: "bg-orange-600 hover:bg-orange-700",
      },
      preparing: {
        label: "Preparing",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        nextStatus: "ready",
        nextLabel: "Mark Ready",
        buttonClass: "bg-blue-600 hover:bg-blue-700",
      },
      ready: {
        label: "Ready",
        color: "text-green-600",
        bgColor: "bg-green-50",
        nextStatus: "served",
        nextLabel: "Mark Served",
        buttonClass: "bg-green-600 hover:bg-green-700",
      },
      served: {
        label: "Served",
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        nextStatus: null,
        nextLabel: "Completed",
        buttonClass: "bg-gray-400",
      },
    };
    return configs[status] || configs.pending;
  };

  const clearKotStates = () => {
    setShowUpdateModal(false);
    setSelectedOrder(null);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const actionMap = {
      preparing: prepareOrderKot,
      ready: markReadyKot,
      served: serveOrderKot,
    };

    const action = actionMap[newStatus];

    if (action) {
      await handleResponse(dispatch(action(orderId)), () => {
        fetchOrder();
        clearKotStates();
        // setSelectedStatus(newStatus)
        setSelectedStatus(newStatus === "served" ? "pending" : newStatus);
      });
    }
  };

  const tabs = [
    { label: "All", id: "", badgeCount: null },
    {
      label: "Pending",
      id: "pending",
      badgeCount: stats?.pending_count,
    },
    {
      label: "Preparing",
      id: "preparing",
      badgeCount: stats?.preparing_count,
    },
    { label: "Ready", id: "ready", badgeCount: stats?.ready_count },
  ];

  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary-600 rounded-lg">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Kitchen Display <SocketBadge />
              </h1>
              <p className="text-sm text-gray-500">Manage orders efficiently</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* LAST FETCH */}
            {lastFetchedAt && (
              <span className="text-xs text-gray-500">
                Last updated: {formatDate(lastFetchedAt, "longTime")}
              </span>
            )}

            {/* REFRESH BUTTON */}
            <button
              onClick={fetchOrder}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium
               border border-gray-200 rounded-lg bg-white
               hover:bg-gray-50 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <SearchBar className="py-3" />
          <Tabs
            value={selectedStatus}
            tabs={tabs}
            onChange={(value) => setSelectedStatus(value)}
          />
        </div>

        {loading ? (
          // LOADING
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <KotOrderCardSkeleton key={i} />
            ))}
          </div>
        ) : kots?.length > 0 ? (
          // DATA
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {kots.map((order) => (
              <KotOrderCard
                key={order?.id}
                order={order}
                onUpdate={(order) => {
                  setSelectedOrder(order);
                  setShowUpdateModal(true);
                }}
                getStatusConfig={getStatusConfig}
              />
            ))}
          </div>
        ) : (
          // EMPTY
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl">
            <CheckCircle2 className="w-16 h-16 text-green-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              All Caught Up
            </h2>
            <p className="text-gray-500">No orders to display</p>
          </div>
        )}
      </div>

      <OrderKotUpdateModal
        isOpen={showUpdateModal}
        onClose={clearKotStates}
        order={selectedOrder}
        onSubmit={updateOrderStatus}
        loading={isUpdatingKot}
        getStatusConfig={getStatusConfig}
      />
    </div>
  );
}
