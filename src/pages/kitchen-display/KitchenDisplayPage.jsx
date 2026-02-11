import React, { useState, useEffect } from "react";
import {
  Flame,
  CheckCircle2,
  X,
  RefreshCw,
  Wifi,
  WifiOff,
  ChevronLeft,
  Loader2,
} from "lucide-react";
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
import { setKotTab } from "../../redux/slices/uiSlice";
import { ROLES } from "../../constants";
import { useNavigate } from "react-router-dom";

export default function KitchenDisplayPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { meData } = useSelector((state) => state.auth);
  const role = meData?.roles[0]?.slug || null;

  const { allOrdersKot, loading } = useSelector((state) => state.kot);
  const { kotTab } = useSelector((state) => state.ui);
  const { connected, connecting } = useSelector((state) => state.socket);
  const { kots, stats } = allOrdersKot || {};
  const [lastFetchedAt, setLastFetchedAt] = useState(null);

  const ACTION_MAP = {
    preparing: prepareOrderKot,
    ready: markReadyKot,
    served: serveOrderKot,
  };

  const fetchOrder = async () => {
    await handleResponse(
      dispatch(
        fetchAllOrdersKot({
          status: kotTab,
          station: role === ROLES.BAR ? "Bar" : role,
        }),
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
  }, [connected, kotTab]);

  useEffect(() => {
    fetchOrder();
  }, [kotTab]);

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
      setKotTab(tabExists ? status : "");

      if (!connected) {
        fetchOrder();
      }
    });
  };

  const handleMarkItemReady = async (itemId) => {
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
    {
      label: "Ready",
      id: "ready",
      badgeCount: stats?.ready_count,
    },
    {
      label: "Cancelled",
      id: "cancelled",
      badgeCount: stats?.cancelled_count,
    },
  ];

  const ROLE_UI = {
    kitchen: {
      title: "Kitchen Display",
      subtitle: "Manage food orders efficiently",
      emptyTitle: "Kitchen All Caught Up 🍳",
    },
    bartender: {
      title: "Bar Display",
      subtitle: "Prepare drinks efficiently",
      emptyTitle: "No Drinks Pending 🍹",
    },
  };

  const ui = ROLE_UI[role];

  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 bg-primary-500 hover:bg-primary-600 rounded-lg"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{ui?.title}</h1>
              <p className="text-sm text-gray-500"> {ui?.subtitle}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* STATUS LEGEND */}
            <div className="flex items-center">
              {Object.entries(ORDER_STATUSES).map(([key, status]) => (
                <div key={key} className={`flex items-center gap-2 px-2 py-1 `}>
                  {/* DOT */}
                  <span
                    className={`w-2 h-2 rounded-full shadow-sm ${status.dotColor}`}
                  />

                  {/* LABEL */}
                  <span className={`text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              ))}
            </div>

            {/* SYNC CONTROL */}
            <button
              onClick={fetchOrder}
              className="inline-flex items-center gap-2 px-3 py-1.5
              text-xs font-medium rounded-lg
              border border-gray-200 bg-white hover:bg-gray-50 transition"
              title="Refresh orders"
            >
              <RefreshCw className="w-3.5 h-3.5" />

              <span className="text-gray-600">
                {lastFetchedAt
                  ? `Updated ${formatDate(lastFetchedAt, "time")}`
                  : "Sync"}
              </span>
            </button>
            <div
              title={
                connecting
                  ? "Connecting to live updates..."
                  : connected
                    ? "Real-time updates active"
                    : "No live connection"
              }
              className={`
    inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
    transition border
    ${
      connecting
        ? "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
        : connected
          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
    }
  `}
            >
              {/* Dot Indicator */}
              <span
                className={`
      w-2 h-2 rounded-full
      ${
        connecting
          ? "bg-yellow-500 animate-pulse"
          : connected
            ? "bg-green-500 animate-pulse"
            : "bg-red-500"
      }
    `}
              />

              {/* Icon */}
              {connecting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : connected ? (
                <Wifi className="w-3.5 h-3.5" />
              ) : (
                <WifiOff className="w-3.5 h-3.5" />
              )}

              {/* Text */}
              <span>
                {connecting ? "Connecting" : connected ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchBar width="w-full" />
          <div className="flex gap-2">
            {tabs?.map((tab) => {
              const isActive = kotTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => dispatch(setKotTab(tab.id))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  inline-flex items-center gap-2
                  ${
                    isActive
                      ? "bg-primary-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {tab.label}

                  {/* BADGE */}
                  {typeof tab.badgeCount === "number" && tab.badgeCount > 0 && (
                    <span
                      className={`min-w-[20px] h-5 px-1.5 text-xs rounded-full flex items-center justify-center
                      ${
                        isActive
                          ? "bg-white text-primary-600"
                          : "bg-primary-200 text-primary-700"
                      }`}
                    >
                      {tab.badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
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
          <div className="min-h-[70dvh] flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-gray-300">
            {/* Icon Circle */}
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-5">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {ui.emptyTitle}
            </h2>

            {/* Subtitle */}
            <p className="text-gray-500 text-sm text-center max-w-sm">
              {kotTab
                ? `No ${kotTab} ${role === ROLES.BAR ? "drinks" : "orders"} right now.`
                : ROLES.BAR === "bartender"
                  ? "No drinks at the moment."
                  : "There are no orders at the moment."}
            </p>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={fetchOrder}
                className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition"
              >
                Refresh
              </button>

              {kotTab && (
                <button
                  onClick={() => dispatch(setKotTab(""))}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition"
                >
                  View All Orders
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
