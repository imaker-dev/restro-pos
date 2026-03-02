import React, { useEffect, useState } from "react";
import {
  Utensils,
  Clock,
  Users,
  MapPin,
  User,
  Star,
  Layers,
  Receipt,
  ShoppingBag,
  Building2,
  Wallet,
  Timer,
  Hash,
  ArrowUpRight,
  Phone,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRunningOrder,
  fetchRunningTable,
} from "../../redux/slices/reportSlice";
import OrderBadge from "../../partial/order/OrderBadge";
import PageHeader from "../../layout/PageHeader";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber } from "../../utils/numberFormatter";
import StatCard from "../../components/StatCard";
import NoDataFound from "../../layout/NoDataFound";
import { Link } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import RunningorderCard from "../../partial/report/running-order/RunningorderCard";



/* ══════════════════════════════════════════════════════════
   MAIN SCREEN
══════════════════════════════════════════════════════════ */
export default function RunningOrdersPage() {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { runningOrders, isFetchingRunningOrder } = useSelector(
    (state) => state.report,
  );

  useEffect(() => {
    if (outletId) {
      dispatch(fetchRunningOrder(outletId));
    }
  }, [outletId, dispatch]);

  if (isFetchingRunningOrder) {
    return <LoadingOverlay text="Loading Running Orders..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title={"Running Orders"} />

      {runningOrders?.length === 0 ? (
        <NoDataFound
          icon={Layers}
          title="No orders found"
          className="bg-white"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {runningOrders?.map((order) => (
            <RunningorderCard key={order?.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
