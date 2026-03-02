import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchCancellationReport } from "../../redux/slices/reportSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import {
  AlertTriangle,
  BarChart2,
  Clock,
  FolderPlus,
  Hash,
  IndianRupee,
  Package,
  TrendingDown,
  User,
  UserCog,
  UserPlus,
  XCircle,
} from "lucide-react";
import { formatNumber } from "../../utils/numberFormatter";
import StatCard from "../../components/StatCard";
import NoDataFound from "../../layout/NoDataFound";
import OrderCancelCard from "../../partial/report/cancellation-report/OrderCancelCard";
import ItemCancelCard from "../../partial/report/cancellation-report/ItemCancelCard";
import LoadingOverlay from "../../components/LoadingOverlay";
import Tabs from "../../components/Tabs";
import ReasonCard from "../../partial/report/cancellation-report/ReasonCard";

const CancellationReport = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const [dateRange, setDateRange] = useState();
  const [activeTab, setActiveTab] = useState("orders"); // "orders" | "items"

  const { cancellationReport, isFetchingCancellationReport } = useSelector(
    (state) => state.report,
  );

  const {
    order_cancellations = [],
    item_cancellations = [],
    summary = {},
  } = cancellationReport || {};

  useEffect(() => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;
    dispatch(fetchCancellationReport({ outletId, dateRange }));
  }, [outletId, dateRange]);

  const kpis = [
    {
      icon: XCircle,
      title: "Order Cancellations",
      value: formatNumber(summary?.total_order_cancellations),
      subtitle: "Full orders voided",
      color: "red",
    },
    {
      icon: Package,
      title: "Item Cancellations",
      value: formatNumber(summary?.total_item_cancellations),
      subtitle: "Individual items removed",
      color: "blue",
    },
    {
      icon: IndianRupee,
      title: "Order Cancel Loss",
      value: formatNumber(summary?.total_order_cancel_amount),
      subtitle: "Revenue from full orders",
      color: "purple",
    },
    {
      icon: TrendingDown,
      title: "Item Cancel Loss",
      value: formatNumber(summary?.total_item_cancel_amount),
      subtitle: "Revenue from voided items",
      color: "gray",
    },
  ];

  const maxReasonAmount = Math.max(
    ...(summary?.by_reason || []).map((r) => parseFloat(r.total_amount || 0)),
    1,
  );

  if (isFetchingCancellationReport) {
    return <LoadingOverlay text="Loading Cancellation Report..."/>;
  }

  // Your tab definitions
  const tabs = [
    {
      id: "orders",
      label: "Order Cancellations",
      icon: XCircle,
      count: order_cancellations?.length,
    },
    {
      id: "items",
      label: "Item Cancellations",
      icon: Package,
      count: item_cancellations?.length,
    },
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <PageHeader title={"Cancellation Report"} />
        <CustomDateRangePicker
          value={dateRange}
          onChange={(newRange) => {
            setDateRange(newRange);
          }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {kpis?.map((card, i) => (
          <StatCard
            key={i}
            title={card.title}
            value={card.value}
            color={card.color}
            icon={card.icon}
            subtitle={card.subtitle}
          />
        ))}
      </div>

      {/* ── By Reason breakdown ── */}
      {(summary.by_reason || []).length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg,#f43f5e,#e11d48)",
              }}
            >
              <BarChart2 size={16} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[14px] font-black text-slate-800">
                Cancellation Reasons
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                {(summary?.by_reason || []).length} distinct reason
                {(summary?.by_reason || []).length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {(summary?.by_reason || []).map((r, i) => (
              <ReasonCard
                key={i}
                reason={r.reason}
                count={r.count}
                amount={r.total_amount}
                maxAmount={maxReasonAmount}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Tab switcher ── */}
      <Tabs
        tabs={tabs}
        active={activeTab}
        onChange={setActiveTab}
        variant="v2"
        color="violet"
      />

      {/* ── Order cancellations ── */}
      {activeTab === "orders" && (
        <div
          className="space-y-3"
        >
          {order_cancellations.length === 0 ? (
            <NoDataFound title="No order cancellations" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {order_cancellations.map((item, i) => (
                <OrderCancelCard key={i} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Item cancellations ── */}
      {activeTab === "items" && (
        <div
          className="space-y-3"
        >
          {item_cancellations.length === 0 ? (
            <NoDataFound title="No item cancellations" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {item_cancellations.map((item, i) => (
                <ItemCancelCard key={i} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CancellationReport;
