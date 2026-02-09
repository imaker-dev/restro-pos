import React, { useState, useEffect } from "react";
import { Flame, CheckCircle2, X, RefreshCw, Wifi, WifiOff } from "lucide-react";
import KotOrderCard from "../../partial/kot/KotOrderCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrdersKot,
  markKotItemReady,
  markReadyKot,
  prepareOrderKot,
  serveOrderKot,
} from "../../redux/slices/kotSlice";
import { handleResponse } from "../../utils/helpers";
import KotOrderCardSkeleton from "../../partial/kot/KotOrderCardSkeleton";
import { formatDate } from "../../utils/dateFormatter";
import SearchBar from "../../components/SearchBar";
import { ORDER_STATUSES } from "../../utils/orderStatusConfig";

export default function KitchenDisplayPage() {
  const dispatch = useDispatch();
  const { allOrdersKot, loading } = useSelector((state) => state.kot);

  const ACTION_MAP = {
    preparing: prepareOrderKot,
    ready: markReadyKot,
    served: serveOrderKot,
  };

  const { connected } = useSelector((state) => state.socket);

  const { kots, stats } = allOrdersKot || {};
  const [selectedStatus, setSelectedStatus] = useState("");
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
    if (connected) return;

    const interval = setInterval(() => {
      fetchOrder();
    }, 30000); // 30 seconds

    return () => clearInterval(interval); // cleanup
  }, [connected, selectedStatus]);

  useEffect(() => {
    fetchOrder();
  }, [selectedStatus]);

  const getStatusConfig = (status) =>
    ORDER_STATUSES[status] || ORDER_STATUSES.pending;

  const updateOrderStatus = async (orderId, newStatus) => {
    const status = newStatus?.trim().toLowerCase();

    const action = ACTION_MAP[status];

    if (!action) {
      console.warn("No action for status:", status);
      return;
    }

    await handleResponse(dispatch(action(orderId)), () => {
      const tabExists = tabs.some((t) => t.id === status);
      setSelectedStatus(tabExists ? status : "");

      if (!connected) {
        fetchOrder();
      }
    });
  };

  const handleMarkItemReady = async (orderId, itemId) => {
    await handleResponse(dispatch(markKotItemReady(itemId)), () => {
      if (!connected) {
        fetchOrder();
      }
    });
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
    { label: "Cancelled", id: "cancelled" },
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
                Kitchen Display
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

            <div
              title={
                connected ? "Real-time updates active" : "No live connection"
              }
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold
              ${
                connected
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
              <span>{connected ? "Online" : "Offline"}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <SearchBar />

          <div className="flex gap-2">
            {tabs?.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === tab.id
                    ? "bg-primary-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
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
            {kots?.map((order) => (
              <KotOrderCard
                key={order?.id}
                order={order}
                updateOrderStatus={updateOrderStatus}
                getStatusConfig={getStatusConfig}
                markItemReady={handleMarkItemReady}
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
    </div>
  );
}
