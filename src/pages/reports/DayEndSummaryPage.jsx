import React, { useState, useMemo, useEffect } from "react";
import {
  DollarSign,
  ShoppingBag,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Sparkles,
  IndianRupee,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDailyEndSummary } from "../../redux/slices/dashboardSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import StatCard from "../../components/StatCard";
import PageHeader from "../../layout/PageHeader";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber } from "../../utils/numberFormatter";
import SmartTable from "../../components/SmartTable";

const DayEndSummaryPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { dailyEndSummary, isFetchingDailyEndSummary } = useSelector(
    (state) => state.dashboard,
  );
  const { grandTotal, days } = dailyEndSummary || {};

  const [dateRange, setDateRange] = useState(null);

  console.log(days);

  useEffect(() => {
    if (!outletId) return;
    if (dateRange) {
      dispatch(fetchDailyEndSummary({ outletId, dateRange }));
    }
  }, [dateRange, outletId, dispatch]);

  const safeDivide = (a, b, fixed = 0) => {
    if (!b || b === 0) return 0;
    return (a / b).toFixed(fixed);
  };

  if (isFetchingDailyEndSummary) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading premium analytics...
      </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${grandTotal?.totalSales?.toLocaleString() || 0}`,
      subtitle: `₹${safeDivide(
        grandTotal?.totalSales,
        dailyEndSummary?.dayCount,
      )} / day`,
      icon: IndianRupee,
      color: "green",
    },
    {
      title: "Total Orders",
      value: grandTotal?.totalOrders || 0,
      subtitle: `${grandTotal?.completedOrders || 0} completed`,
      icon: ShoppingBag,
      color: "blue",
    },
    {
      title: "Guests Served",
      value: grandTotal?.totalGuests || 0,
      subtitle: "Customer Footfall",
      icon: Users,
      color: "purple",
    },
    {
      title: "Avg Order Value",
      value: `₹${safeDivide(grandTotal?.totalSales, grandTotal?.totalOrders)}`,
      subtitle: "Per Transaction",
      icon: Receipt,
      color: "amber",
    },
  ];

  const dailyReportColumns = [
    {
      key: "date",
      label: "Date",
      render: (row) => (
        <span className="font-medium text-slate-800">
          {formatDate(row.date, "long")}
        </span>
      ),
    },

    {
      key: "totalOrders",
      label: "Total Orders",
      render: (row) => (
        <span className="text-slate-700">{row.totalOrders}</span>
      ),
    },

    {
      key: "completedOrders",
      label: "Completed",
      render: (row) => (
        <span className="text-emerald-600 font-medium">
          {row.completedOrders}
        </span>
      ),
    },

    {
      key: "cancelledOrders",
      label: "Cancelled",
      render: (row) => (
        <span className="text-red-500 font-medium">{row.cancelledOrders}</span>
      ),
    },

    {
      key: "totalSales",
      label: "Total Sales",
      render: (row) => formatNumber(row.totalSales, true),
    },

    {
      key: "grossSales",
      label: "Gross Sales",
      render: (row) => formatNumber(row.grossSales, true),
    },

    {
      key: "totalTax",
      label: "Tax",
      render: (row) => (
        <span className="text-emerald-600 font-medium">
          {formatNumber(row.totalTax, true)}
        </span>
      ),
    },

    {
      key: "totalDiscount",
      label: "Discount",
      render: (row) => formatNumber(row.totalDiscount, true),
    },

    {
      key: "avgOrderValue",
      label: "Avg Order",
      render: (row) => formatNumber(row.avgOrderValue, true),
    },

    {
      key: "totalGuests",
      label: "Guests",
      render: (row) => (
        <span className="text-slate-700">{row.totalGuests}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <PageHeader
          title={"Day End Summary"}
          description={`${formatDate(dailyEndSummary?.dateRange?.start, "long")} — 
            ${formatDate(dailyEndSummary?.dateRange?.end, "long")} (${dailyEndSummary?.dayCount} days)`}
        />

        <CustomDateRangePicker
          value={dateRange}
          onChange={setDateRange}
          defaultRange="Last 7 Days"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats?.map((stat, index) => (
          <StatCard
            key={index}
            title={stat?.title}
            value={stat?.value}
            subtitle={stat?.subtitle}
            icon={stat?.icon}
            color={stat?.color}
          />
        ))}
      </div>

      <SmartTable
        title={"Summary"}
        totalcount={days?.length}
        data={days}
        columns={dailyReportColumns}
        loading={isFetchingDailyEndSummary}
      />
    </div>
  );
};

export default DayEndSummaryPage;
