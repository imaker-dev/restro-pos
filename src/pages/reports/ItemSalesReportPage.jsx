import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchItemSalesReport } from "../../redux/slices/reportSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import { formatNumber } from "../../utils/numberFormatter";
import SmartTable from "../../components/SmartTable";

const ItemSalesReportPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { itemSalesReport, isFetchingItemSalesReport } = useSelector(
    (state) => state.report,
  );
  const [dateRange, setDateRange] = useState();

  useEffect(() => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;

    dispatch(fetchItemSalesReport({ outletId, dateRange }));
  }, [outletId, dateRange]);

  const columns = [
    {
      key: "item",
      label: "Item",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800">{row.item_name}</p>
          <p className="text-xs text-slate-500">{row.variant_name || "—"}</p>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (row) => (
        <span className="text-slate-600">{row.category_name}</span>
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
      key: "cancelled_quantity",
      label: "Cancelled",
      render: (row) => (
        <span className="text-rose-600">
          {parseFloat(row.cancelled_quantity)}
        </span>
      ),
    },
    {
      key: "order_count",
      label: "Orders",
    },
    {
      key: "avg_price",
      label: "Avg Price",
      render: (row) => formatNumber(row.avg_price, true),
    },
    {
      key: "gross_revenue",
      label: "Gross",
      render: (row) => formatNumber(row.gross_revenue, true),
    },
    {
      key: "tax_amount",
      label: "Tax",
      render: (row) => formatNumber(row.tax_amount, true),
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <PageHeader title={"Item Sales Report"} />
        <CustomDateRangePicker
          value={dateRange}
          onChange={(newRange) => {
            setDateRange(newRange);
          }}
        />
      </div>

      <SmartTable
        title={"Item Sales"}
        totalcount={itemSalesReport?.length}
        data={itemSalesReport}
        columns={columns}
        loading={isFetchingItemSalesReport}
        //   actions={rowActions}
      />
    </div>
  );
};

export default ItemSalesReportPage;
