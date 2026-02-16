import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategorySalesReport } from "../../redux/slices/reportSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import { formatNumber } from "../../utils/numberFormatter";
import SmartTable from "../../components/SmartTable";

const CategorySalesReportPage = () => {
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState();
  const { categorySalesReport, isFetchingCategorySalesReport } = useSelector(
    (state) => state.report,
  );
  const { outletId } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;

    dispatch(fetchCategorySalesReport({ outletId, dateRange }));
  }, [outletId, dateRange]);
  console.log(categorySalesReport);

  const columns = [
    {
      key: "category",
      label: "Category",
      render: (row) => (
        <span className="font-medium text-slate-800">{row.category_name}</span>
      ),
    },
    {
      key: "item_count",
      label: "Items",
      render: (row) => <span className="text-slate-600">{row.item_count}</span>,
    },
    {
      key: "order_count",
      label: "Orders",
      render: (row) => (
        <span className="text-slate-600">{row.order_count}</span>
      ),
    },
    {
      key: "total_quantity",
      label: "Qty Sold",
      render: (row) => (
        <span className="font-medium">{parseFloat(row.total_quantity)}</span>
      ),
    },
    {
      key: "gross_revenue",
      label: "Gross",
      render: (row) => formatNumber(row.gross_revenue, true),
    },
    {
      key: "discount_amount",
      label: "Discount",
      render: (row) => (
        <span className="text-rose-600">
          {formatNumber(row.discount_amount, true)}
        </span>
      ),
    },
    {
      key: "net_revenue",
      label: "Net",
      render: (row) => (
        <span className="font-semibold text-emerald-700">
          {formatNumber(row.net_revenue, true)}
        </span>
      ),
    },
    {
      key: "contribution_percent",
      label: "Contribution",
      render: (row) => {
        const percent = parseFloat(row.contribution_percent) || 0;

        return (
          <div className="w-[120px]">
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
              <span>{percent}%</span>
            </div>

            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title={"Category Sales Report"} />

        <CustomDateRangePicker
          value={dateRange}
          onChange={(newRange) => {
            setDateRange(newRange);
          }}
        />
      </div>

      <SmartTable
        title={"Category Sales"}
        totalcount={categorySalesReport?.length}
        data={categorySalesReport}
        columns={columns}
        loading={isFetchingCategorySalesReport}
        //   actions={rowActions}
      />
    </div>
  );
};

export default CategorySalesReportPage;
