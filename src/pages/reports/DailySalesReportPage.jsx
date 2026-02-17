import {
  ShoppingCart,
  Users,
  TrendingUp,
  IndianRupee,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDailySalesReport } from "../../redux/slices/reportSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import PageHeader from "../../layout/PageHeader";
import StatCard from "../../components/StatCard";
import { formatNumber } from "../../utils/numberFormatter";
import SmartTable from "../../components/SmartTable";
import { formatDate } from "../../utils/dateFormatter";
import { useNavigate } from "react-router-dom";

export default function DailySalesReportPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { outletId } = useSelector((state) => state.auth);
  const { dailySalesReport: salesData, isFetchingDailyReports } = useSelector(
    (state) => state.report,
  );

  const [dateRange, setDateRange] = useState();

  useEffect(() => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    dispatch(fetchDailySalesReport({ outletId, dateRange }));
  }, [dateRange, outletId]);

  // Calculate summary statistics
  const totalNetSales = salesData?.reduce(
    (sum, item) => sum + parseFloat(item.net_sales),
    0,
  );
  const totalOrders = salesData?.reduce(
    (sum, item) => sum + item.total_orders,
    0,
  );
  const totalGuests = salesData?.reduce(
    (sum, item) => sum + parseInt(item.total_guests),
    0,
  );
  const totalCollection = salesData?.reduce((sum, item) => {
    const val =
      typeof item.total_collection === "number"
        ? item.total_collection
        : parseFloat(item.total_collection.toString());
    return sum + val;
  }, 0);

  const avgOrderValue = totalOrders > 0 ? totalNetSales / totalOrders : 0;
  const avgGuestSpend = totalGuests > 0 ? totalNetSales / totalGuests : 0;

  const columns = [
    {
      key: "report_date",
      label: "Date",
      render: (row) => (
        <div className="max-w-[180px]">
          <p className="font-medium text-slate-800">
            {formatDate(row.report_date, "long")}
          </p>
          <p className="text-xs text-slate-500">Guests: {row.total_guests}</p>
        </div>
      ),
    },

    {
      key: "total_orders",
      label: "Orders",
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800">{row.total_orders}</p>

          <p className="text-xs text-slate-500">
            Dine-In: {row.dine_in_orders} • Takeaway: {row.takeaway_orders}
          </p>
        </div>
      ),
    },

    {
      key: "cancelled_orders",
      label: "Cancelled",
      render: (row) => {
        const val = row.cancelled_orders;

        return (
          <span
            className={`px-2.5 py-1 text-xs rounded-md font-medium
          ${
            val > 0
              ? "bg-rose-100 text-rose-700"
              : "bg-slate-100 text-slate-600"
          }`}
          >
            {val}
          </span>
        );
      },
    },

    {
      key: "gross_sales",
      label: "Gross",
      render: (row) => (
        <span className="font-medium text-slate-700">
          {formatNumber(row.gross_sales, true)}
        </span>
      ),
    },

    {
      key: "net_sales",
      label: "Net",
      render: (row) => (
        <span className="font-semibold text-emerald-700">
          {formatNumber(row.net_sales, true)}
        </span>
      ),
    },

    {
      key: "total_collection",
      label: "Collection",
      render: (row) => (
        <span className="font-semibold text-indigo-700">
          {formatNumber(row.total_collection, true)}
        </span>
      ),
    },

    {
      key: "payments",
      label: "Payments",
      sortable: false,
      render: (row) => (
        <div className="text-xs text-slate-600 space-y-0.5">
          <p>Cash: {formatNumber(row.cash_collection, true)}</p>
          <p>UPI: {formatNumber(row.upi_collection, true)}</p>
          <p>Card: {formatNumber(row.card_collection, true)}</p>
        </div>
      ),
    },

    {
      key: "average_order_value",
      label: "Avg Order",
      render: (row) => (
        <span className="text-slate-600 font-medium">
          {formatNumber(row.average_order_value, true)}
        </span>
      ),
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      color: "slate",
      onClick: (row) =>
        navigate(`/daily-sales/details?date=${row.report_date}`),
    },
  ];

  const stats = [
    {
      title: "Total Net Sales",
      value: formatNumber(totalNetSales, true),
      subtitle: `Across ${salesData?.length} days`,
      icon: IndianRupee,
      color: "green",
    },
    {
      title: "Total Orders",
      value: formatNumber(totalOrders),
      subtitle: "Last 7 days",
      icon: ShoppingCart,
      color: "blue",
    },
    {
      title: "Total Guests",
      value: formatNumber(totalGuests),
      subtitle: `Avg ₹${formatNumber(avgGuestSpend)} per guest`,
      icon: Users,
      color: "purple",
    },
    {
      title: "Total Collection",
      value: formatNumber(totalCollection, true),
      subtitle: `Avg ₹${formatNumber(avgOrderValue)} per order`,
      icon: TrendingUp,
      color: "yellow",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Header Section */}
        <PageHeader
          title={"Daily Sales Report"}
          description={
            "Real-time analytics and performance metrics for your business"
          }
        />
        <CustomDateRangePicker
          value={dateRange}
          onChange={(newRange) => {
            setDateRange(newRange);
          }}
        />
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        title={"Daily Sales"}
        totalcount={salesData?.length}
        data={salesData}
        columns={columns}
        loading={isFetchingDailyReports}
        actions={rowActions}
      />
    </div>
  );
}
