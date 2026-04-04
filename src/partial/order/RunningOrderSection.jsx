import {
  AlertTriangle,
  Bike,
  PackageCheck,
  PackageX,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
import RunningOrderCard from "./RunningOrderCard";
import LiveOperationSummaryBanner from "./LiveOperationSummaryBanner";
import { formatNumber } from "../../utils/numberFormatter";

function RunningOrderSection({ summary, orders }) {
  const orderCards = [
    // ─── Channels ─────────────────────
    {
      title: "Dine In",
      count: orders?.dineIn?.count,
      countLabel: `Orders / KOTs · ${orders?.dineIn?.kots} active`,
      amount: orders?.dineIn?.amount,
      accentBar: "bg-green-400",
      icon: UtensilsCrossed,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Takeaway",
      count: orders?.pickup?.count,
      countLabel: "Orders",
      amount: orders?.pickup?.amount,
      accentBar: "bg-amber-400",
      icon: ShoppingBag,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Delivery",
      count: orders?.delivery?.count,
      countLabel: "Orders",
      amount: orders?.delivery?.amount,
      accentBar: "bg-blue-400",
      icon: Bike,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },

    // ─── Pending ─────────────────────
    {
      title: "Not Marked Ready",
      count: orders?.pending?.notReady?.count,
      countLabel: "Orders",
      amount: orders?.pending?.notReady?.amount,
      accentBar: "bg-rose-400",
      icon: AlertTriangle,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-500",
    },
    {
      title: "Not Picked Up",
      count: orders?.pending?.notPickedUp?.count,
      countLabel: "Orders",
      amount: orders?.pending?.notPickedUp?.amount,
      accentBar: "bg-teal-400",
      icon: PackageCheck,
      iconBg: "bg-teal-50",
      iconColor: "text-teal-600",
    },
    {
      title: "Not Delivered",
      count: orders?.pending?.notDelivered?.count,
      countLabel: "Orders",
      amount: orders?.pending?.notDelivered?.amount,
      accentBar: "bg-orange-400",
      icon: PackageX,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-3 sm:space-y-5">
      {/* Summary */}
      <LiveOperationSummaryBanner
        colorCls="bg-blue-50/70 border border-blue-100"
        items={[
          { label: "Orders", value: summary?.totalCount },
          { label: "Revenue", value: formatNumber(summary?.totalAmount, true) },
          {
            label: "Pending",
            value: summary?.pendingCount,
            danger: summary?.pendingCount > 0,
          },
        ]}
      />

      {/* Channels */}
      <div>
        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-0.5">
          Order Channels
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
          {orderCards.map((c) => (
            <RunningOrderCard key={c.title} {...c} />
          ))}
        </div>
      </div>
    </div>
  );
}
export default RunningOrderSection;
