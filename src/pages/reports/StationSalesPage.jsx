import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStationSalesReport } from "../../redux/slices/reportSlice";
import PageHeader from "../../layout/PageHeader";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import {
  CheckCircle2,
  ChefHat,
  Clock,
  Package,
  Ticket,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import { formatNumber } from "../../utils/numberFormatter";
import StatCard from "../../components/StatCard";
import MetaPill from "../../components/MetaPill";
import StationCard from "../../partial/report/station-report/StationCard";
import NoDataFound from "../../layout/NoDataFound";
import LoadingOverlay from "../../components/LoadingOverlay";

const StationSalesPage = () => {
  const dispatch = useDispatch();

  const [dateRange, setDateRange] = useState();

  const { outletId } = useSelector((state) => state.auth);
  const { stationSalesReport, isFetchingStationSalesReport } = useSelector(
    (state) => state.report,
  );
  const { summary = {}, stations = [] } = stationSalesReport || {};

  useEffect(() => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    dispatch(fetchStationSalesReport({ outletId, dateRange }));
  }, [outletId, dateRange]);

  const maxTickets = Math.max(...stations?.map((s) => s.ticketCount), 1);
  const busiestName = summary?.busiest_station;

  const totalServed = summary?.served_count;
  const totalItems = summary?.total_items;
  const overallSR =
    totalItems > 0 ? ((totalServed / totalItems) * 100).toFixed(1) : "0.0";

  const kpis = [
    {
      icon: ChefHat,
      title: "Stations",
      value: formatNumber(summary?.total_stations || 0),
      subtitle: "Active this period",
      color: "violet",
    },
    {
      icon: Ticket,
      title: "Total Tickets",
      value: formatNumber(summary?.total_tickets || 0),
      subtitle: `${busiestName || "—"} is busiest`,
      color: "blue",
    },
    {
      icon: Package,
      title: "Total Items",
      value: formatNumber(summary?.total_items || 0),
      subtitle: `${formatNumber(summary?.total_quantity || 0)} qty prepared`,
      color: "amber",
    },
    {
      icon: CheckCircle2,
      title: "Served",
      value: formatNumber(summary?.served_count || 0),
      subtitle: `${overallSR}% serve rate`,
      color: "emerald",
    },
    {
      icon: XCircle,
      title: "Cancelled",
      value: formatNumber(summary?.cancelled_count || 0),
      subtitle: "Items cancelled at stations",
      color: "rose",
    },
  ];

  if (isFetchingStationSalesReport) {
    return <LoadingOverlay text="Loading Satation Sales Report..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <PageHeader title={"Station Sales"} />
        <CustomDateRangePicker
          value={dateRange}
          onChange={(newRange) => {
            setDateRange(newRange);
          }}
        />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpis?.map((card, i) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            color={card.color}
            icon={card.icon}
            subtitle={card.subtitle}
          />
        ))}
      </div>

      {/* Stations Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-black text-slate-900">
            Station Performance
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Operational breakdown by station
          </p>
        </div>

        {stations.length > 0 && (
          <span className="text-[11px] font-semibold text-slate-500">
            {stations.length} station{stations.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Station cards grid */}
      {stations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stations.map((station, i) => (
            <StationCard
              key={station.stationId}
              station={station}
              rank={i + 1}
              maxTickets={maxTickets}
              isBusiest={station.stationName === busiestName}
              colorIdx={i}
            />
          ))}
        </div>
      ) : (
        <NoDataFound
          icon={ChefHat}
          title="No station data found"
          description="No station activity for the selected date range."
        />
      )}
    </div>
  );
};

export default StationSalesPage;
