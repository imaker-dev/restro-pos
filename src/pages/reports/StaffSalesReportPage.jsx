import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaffSalesReport } from "../../redux/slices/reportSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import SmartTable from "../../components/SmartTable";
import { formatNumber } from "../../utils/numberFormatter";

const StaffSalesReportPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { staffSalesReport, isFetchingStaffSalesReport } = useSelector(
    (state) => state.report,
  );
  console.log(staffSalesReport);
  const [dateRange, setDateRange] = useState();

  useEffect(() => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;

    dispatch(fetchStaffSalesReport({ outletId, dateRange }));
  }, [outletId, dateRange]);



const columns = [
  {
    key: "user",
    label: "User",
    render: (row) => (
      <div>
        <p className="font-medium text-slate-800">{row.user_name}</p>
        <p className="text-xs text-slate-500">ID: {row.user_id}</p>
      </div>
    ),
  },

  {
    key: "total_orders",
    label: "Orders",
    render: (row) => (
      <span className="font-medium">{row.total_orders}</span>
    ),
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

      <SmartTable
        title={"Staff Sales"}
        totalcount={staffSalesReport?.length}
        data={staffSalesReport}
        columns={columns}
        loading={isFetchingStaffSalesReport}
        //   actions={rowActions}
      />
    </div>
  );
};

export default StaffSalesReportPage;
