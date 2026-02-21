import {
  ShoppingCart,
  Users,
  TrendingUp,
  IndianRupee,
  Eye,
  Utensils,
  BarChart3,
  Truck,
  DollarSign,
  CreditCard,
  Wallet,
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
import AccordionSection from "../../components/AccordionSection";

export default function DailySalesReportPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { outletId } = useSelector((state) => state.auth);
  const { dailySalesReport, isFetchingDailyReports } = useSelector(
    (state) => state.report,
  );
  const { daily, summary } = dailySalesReport || {};

  const [dateRange, setDateRange] = useState();

  useEffect(() => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    dispatch(fetchDailySalesReport({ outletId, dateRange }));
  }, [dateRange, outletId]);

  const toNumber = (val) => Number(val || 0);

  const columns = [
    {
      key: "report_date",
      label: "Date",
      render: (row) => (
        <div className="max-w-[180px]">
          <p className="font-medium text-slate-800">
            {formatDate(row.report_date, "long")}
          </p>
          <p className="text-xs text-slate-500">
            Guests: {toNumber(row.total_guests)}
          </p>
        </div>
      ),
    },

    {
      key: "orders",
      label: "Orders",
      render: (row) => (
        <div className="space-y-1">
          <p className="font-semibold text-slate-800">
            {row.total_orders} Orders
          </p>
          <p className="text-xs text-slate-500">
            Dine-In: {row.dine_in_orders} • Takeaway: {row.takeaway_orders}
          </p>
          <p className="text-xs text-slate-500">
            Delivery: {row.delivery_orders} • Cancelled: {row.cancelled_orders}
          </p>
        </div>
      ),
    },

    {
      key: "sales_summary",
      label: "Sales",
      sortable: false,
      render: (row) => (
        <div className="text-xs space-y-0.5">
          <p>
            Gross:{" "}
            <span className="font-medium text-slate-700">
              {formatNumber(toNumber(row.gross_sales), true)}
            </span>
          </p>
          <p>
            Net:{" "}
            <span className="font-semibold text-emerald-700">
              {formatNumber(toNumber(row.net_sales), true)}
            </span>
          </p>
          <p>Tax: {formatNumber(toNumber(row.tax_amount), true)}</p>
          <p>Discount: {formatNumber(toNumber(row.discount_amount), true)}</p>
        </div>
      ),
    },

    {
      key: "extra_charges",
      label: "Charges",
      sortable: false,
      render: (row) => (
        <div className="text-xs space-y-0.5 text-slate-600">
          <p>Service: {formatNumber(toNumber(row.service_charge), true)}</p>
          <p>Packaging: {formatNumber(toNumber(row.packaging_charge), true)}</p>
          <p>Delivery: {formatNumber(toNumber(row.delivery_charge), true)}</p>
          <p>Round Off: {formatNumber(toNumber(row.round_off), true)}</p>
        </div>
      ),
    },

    {
      key: "collection",
      label: "Collection",
      render: (row) => (
        <div className="space-y-1">
          <p className="font-semibold text-indigo-700">
            {formatNumber(toNumber(row.total_collection), true)}
          </p>
          <p className="text-xs text-slate-500">
            Tip: {formatNumber(toNumber(row.tip_amount), true)}
          </p>
        </div>
      ),
    },

    {
      key: "payments",
      label: "Payment Split",
      sortable: false,
      render: (row) => (
        <div className="text-xs text-slate-600 space-y-0.5">
          <p>Cash: {formatNumber(toNumber(row.cash_collection), true)}</p>
          <p>UPI: {formatNumber(toNumber(row.upi_collection), true)}</p>
          <p>Card: {formatNumber(toNumber(row.card_collection), true)}</p>
          <p>Wallet: {formatNumber(toNumber(row.wallet_collection), true)}</p>
          <p>Credit: {formatNumber(toNumber(row.credit_collection), true)}</p>
        </div>
      ),
    },

    {
      key: "averages",
      label: "Averages",
      render: (row) => (
        <div className="text-xs space-y-0.5">
          <p>
            Avg Order:{" "}
            <span className="font-medium text-slate-700">
              {formatNumber(toNumber(row.average_order_value), true)}
            </span>
          </p>
          <p>
            Avg Guest:{" "}
            <span className="font-medium text-slate-700">
              {formatNumber(toNumber(row.average_guest_spend), true)}
            </span>
          </p>
        </div>
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

  const summaryStats = [
    {
      title: "Total Orders",
      value: summary?.total_orders || 0,
      subtitle: `${summary?.cancelled_orders || 0} Cancelled`,
      icon: ShoppingCart,
      color: "blue",
    },
    {
      title: "Dine-in Orders",
      value: summary?.dine_in_orders || 0,
      subtitle: "Orders served at tables",
      icon: Utensils,
      color: "green",
    },
    {
      title: "Takeaway Orders",
      value: summary?.takeaway_orders || 0,
      subtitle: "Packed & picked up",
      icon: ShoppingCart,
      color: "purple",
    },
    {
      title: "Delivery Orders",
      value: summary?.delivery_orders || 0,
      subtitle: "Online / Delivery apps",
      icon: Truck,
      color: "indigo",
    },
    {
      title: "Total Guests",
      value: summary?.total_guests || 0,
      subtitle: "Guests served",
      icon: Users,
      color: "cyan",
    },
    {
      title: "Gross Sales",
      value: formatNumber(summary?.gross_sales || 0, true),
      subtitle: "Before tax & charges",
      icon: DollarSign,
      color: "emerald",
    },
    {
      title: "Net Sales",
      value: formatNumber(summary?.net_sales || 0, true),
      subtitle: "After tax & service charge",
      icon: TrendingUp,
      color: "green",
    },
    {
      title: "Tax Collected",
      value: formatNumber(summary?.tax_amount || 0, true),
      subtitle: "Total tax applied",
      icon: BarChart3,
      color: "orange",
    },
    {
      title: "Service Charge",
      value: formatNumber(summary?.service_charge || 0, true),
      subtitle: "Service fees collected",
      icon: Wallet,
      color: "yellow",
    },
    {
      title: "Total Collection",
      value: formatNumber(summary?.total_collection || 0, true),
      subtitle: "Total received",
      icon: CreditCard,
      color: "blue",
    },
    {
      title: "Cash Collection",
      value: formatNumber(summary?.cash_collection || 0, true),
      subtitle: "Cash payments",
      icon: IndianRupee,
      color: "green",
    },
    {
      title: "Average Order Value",
      value: formatNumber(summary?.average_order_value || 0, true),
      subtitle: "Per order average",
      icon: TrendingUp,
      color: "purple",
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
      <AccordionSection
        icon={BarChart3}
        title="Sales & Orders Summary"
        defaultOpen={false}
      >
        {" "}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {summaryStats?.map((stat, index) => (
            <StatCard
              key={index}
              title={stat?.title}
              value={stat?.value}
              subtitle={stat?.subtitle}
              icon={stat?.icon}
              color={stat?.color}
              variant="secondary"
            />
          ))}
        </div>
      </AccordionSection>

      <SmartTable
        title={"Daily Sales"}
        totalcount={daily?.length}
        data={daily}
        columns={columns}
        loading={isFetchingDailyReports}
        actions={rowActions}
      />
    </div>
  );
}
