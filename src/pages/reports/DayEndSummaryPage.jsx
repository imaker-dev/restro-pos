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
  Eye,
  Download,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDailyEndSummary } from "../../redux/slices/dashboardSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import StatCard from "../../components/StatCard";
import PageHeader from "../../layout/PageHeader";
import { formatDate, formatFileDate } from "../../utils/dateFormatter";
import { formatNumber } from "../../utils/numberFormatter";
import SmartTable from "../../components/SmartTable";
import { useNavigate } from "react-router-dom";
import { handleResponse } from "../../utils/helpers";
import { exportDayEndSummary } from "../../redux/slices/exportReportSlice";
import { downloadBlob } from "../../utils/blob";

const DayEndSummaryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { outletId } = useSelector((state) => state.auth);
  const { isExportingDayEndSummary } = useSelector(
    (state) => state.exportReport,
  );
  const { dailyEndSummary, isFetchingDailyEndSummary } = useSelector(
    (state) => state.dashboard,
  );
  const { grandTotal, days } = dailyEndSummary || {};

  const [dateRange, setDateRange] = useState(null);

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

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) => navigate(`/day-end-summary/details?date=${row.date}`),
    },
  ];

  const handleExportDayEndSummaryReport = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    const fileName = `Day-End-Summary-Report_${formatFileDate(
      dateRange.startDate,
    )}_to_${formatFileDate(dateRange.endDate)}`;

    await handleResponse(
      dispatch(exportDayEndSummary({ outletId, dateRange })),
      (res) => {
        downloadBlob({
          data: res.payload,
          fileName,
        });
      },
    );
  };

  const actions = [
    {
      label: "Export",
      type: "export",
      icon: Download,
      onClick: () => handleExportDayEndSummaryReport(),
      loading: isExportingDayEndSummary,
      loadingText: "Exporting...",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
        <PageHeader
          title={"Day End Summary"}
          description={`${formatDate(dailyEndSummary?.dateRange?.start, "long")} — 
            ${formatDate(dailyEndSummary?.dateRange?.end, "long")} (${dailyEndSummary?.dayCount} days)`}
            rightContent={        <CustomDateRangePicker
          value={dateRange}
          onChange={setDateRange}
          defaultRange="Last 7 Days"
        />}
            actions={actions}
        />



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
            variant="v9"
            loading={isFetchingDailyEndSummary}
          />
        ))}
      </div>

      <SmartTable
        title={"Summary"}
        totalcount={days?.length}
        data={days}
        columns={dailyReportColumns}
        actions={rowActions}
        loading={isFetchingDailyEndSummary}
      />
    </div>
  );
};

export default DayEndSummaryPage;
