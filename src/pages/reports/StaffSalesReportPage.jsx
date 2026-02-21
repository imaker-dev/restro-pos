import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaffSalesReport } from "../../redux/slices/reportSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import SmartTable from "../../components/SmartTable";
import { formatNumber } from "../../utils/numberFormatter";
import {
  IndianRupee,
  Percent,
  ShoppingBag,
  UserCheck,
  Users,
} from "lucide-react";
import StatCard from "../../components/StatCard";

const StaffSalesReportPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { staffSalesReport, isFetchingStaffSalesReport } = useSelector(
    (state) => state.report,
  );
  const { staff, summary } = staffSalesReport || {};

  const [dateRange, setDateRange] = useState();

  useEffect(() => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;

    dispatch(fetchStaffSalesReport({ outletId, dateRange }));
  }, [outletId, dateRange]);

  const stats = [
    {
      title: "Total Sales",
      value: formatNumber(summary?.total_sales, true),
      subtitle: `${summary?.total_orders} orders`,
      icon: IndianRupee,
      color: "green",
    },
    {
      title: "Total Staff",
      value: summary?.total_staff,
      subtitle: "Active staff",
      icon: Users,
      color: "blue",
    },
    {
      title: "Total Guests",
      value: parseInt(summary?.total_guests),
      subtitle: "Customers served",
      icon: ShoppingBag,
      color: "purple",
    },
    {
      title: "Avg Per Staff",
      value: formatNumber(summary?.average_per_staff, true),
      subtitle: "Revenue per staff",
      icon: UserCheck,
      color: "amber",
    },
    {
      title: "Discounts & Cancels",
      value: formatNumber(summary?.total_discounts, true),
      subtitle: `${summary?.cancelled_orders} cancelled`,
      icon: Percent,
      color: "rose",
    },
  ];

  const columns = [
    {
      key: "user",
      label: "User",
      render: (row) => (
        <p className="font-medium text-slate-800">{row.user_name}</p>
      ),
    },

    {
      key: "total_orders",
      label: "Orders",
      render: (row) => <span className="font-medium">{row.total_orders}</span>,
    },

    {
      key: "total_guests",
      label: "Guests",
      render: (row) => parseInt(row.total_guests),
    },

    {
      key: "total_sales",
      label: "Sales",
      render: (row) => (
        <span className="font-semibold text-emerald-700">
          {formatNumber(row.total_sales, true)}
        </span>
      ),
    },

    {
      key: "total_discounts",
      label: "Discount",
      render: (row) => (
        <span className="text-rose-600">
          {formatNumber(row.total_discounts, true)}
        </span>
      ),
    },

    {
      key: "cancelled_orders",
      label: "Cancelled Orders",
      render: (row) => (
        <span className="text-amber-600">{row.cancelled_orders}</span>
      ),
    },

    {
      key: "cancelled_amount",
      label: "Cancelled Amt",
      render: (row) => (
        <span className="text-rose-600">
          {formatNumber(row.cancelled_amount, true)}
        </span>
      ),
    },

    {
      key: "total_tips",
      label: "Tips",
      render: (row) => formatNumber(row.total_tips, true),
    },

    {
      key: "avg_order_value",
      label: "Avg Order",
      render: (row) => formatNumber(row.avg_order_value, true),
    },

    {
      key: "avg_guest_spend",
      label: "Avg Guest",
      render: (row) => formatNumber(row.avg_guest_spend, true),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <PageHeader title={"Staff Sales Report"} />
        <CustomDateRangePicker
          value={dateRange}
          onChange={(newRange) => {
            setDateRange(newRange);
          }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {stats?.map((stat, index) => (
          <StatCard
            key={index}
            title={stat?.title}
            value={stat?.value}
            subtitle={stat?.subtitle}
            icon={stat?.icon}
            color={stat?.color}
            variant="primary"
          />
        ))}
      </div>
      {summary?.top_performer && (
        <div
          className="bg-amber-50 border border-amber-200 
               rounded-lg px-4 py-2 
               flex items-center justify-between text-sm"
        >
          <div className="flex items-center gap-2 truncate">
            <UserCheck className="w-4 h-4 text-amber-600 shrink-0" />

            <span className="text-amber-700 font-medium">Top Performer:</span>

            <span className="text-slate-800 font-semibold truncate max-w-[220px]">
              {summary?.top_performer}
            </span>

            <span className="text-slate-500">
              ({formatNumber(summary?.top_performer_sales, true)} sales)
            </span>
          </div>
        </div>
      )}

      <SmartTable
        title={"Staff Sales"}
        totalcount={staff?.length}
        data={staff}
        columns={columns}
        loading={isFetchingStaffSalesReport}
        //   actions={rowActions}
      />
    </div>
  );
};

export default StaffSalesReportPage;
