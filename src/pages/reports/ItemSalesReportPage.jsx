import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchItemSalesReport } from "../../redux/slices/reportSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import { formatNumber } from "../../utils/numberFormatter";
import SmartTable from "../../components/SmartTable";
import {
  Download,
  IndianRupee,
  Package,
  Percent,
  RotateCcw,
  ShoppingCart,
  Star,
  TrendingUp,
} from "lucide-react";
import StatCard from "../../components/StatCard";
import { useReportDateRange } from "../../hooks/useReportDateRange";
import { formatFileDate } from "../../utils/dateFormatter";
import { handleResponse } from "../../utils/helpers";
import { exportItemSalesReport } from "../../redux/slices/exportReportSlice";
import { downloadBlob } from "../../utils/blob";

const ItemSalesReportPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { isExportingItemSalesReport } = useSelector(
    (state) => state.exportReport,
  );
  const { itemSalesReport, isFetchingItemSalesReport } = useSelector(
    (state) => state.report,
  );
  const { items, summary } = itemSalesReport || {};
  // const [dateRange, setDateRange] = useState();
  const { dateRange, setDateRange } = useReportDateRange();
  const [serviceType, setServiceType] = useState("");

  const fetchReport = () => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;

    dispatch(fetchItemSalesReport({ outletId, dateRange }));
  };

  useEffect(() => {
    fetchReport();
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

const stats = [
  {
    title: "Gross Revenue",
    value: formatNumber(summary?.gross_revenue, true),
    subtitle: "Before tax & discount",
    icon: IndianRupee,
    color: "green",
  },
  {
    title: "Net Revenue",
    value: formatNumber(summary?.net_revenue, true),
    subtitle: "After tax & discount",
    icon: TrendingUp,
    color: "blue",
  },
  {
    title: "Paid Amount",
    value: formatNumber(summary?.paid_amount, true),
    subtitle: "Amount received",
    icon: IndianRupee,
    color: "emerald",
  },
  {
    title: "Due Amount",
    value: formatNumber(summary?.due_amount, true),
    subtitle: "Pending payments",
    icon: IndianRupee,
    color: "red",
  },
  {
    title: "Tax Collected",
    value: formatNumber(summary?.tax_amount, true),
    subtitle: "Total tax amount",
    icon: Percent,
    color: "purple",
  },
  {
    title: "Discount Given",
    value: formatNumber(summary?.discount_amount, true),
    subtitle: "Total discounts",
    icon: Percent,
    color: "pink",
  },
  {
    title: "Total Items",
    value: summary?.total_items,
    subtitle: `${summary?.total_quantity} qty sold`,
    icon: Package,
    color: "amber",
  },
  {
    title: "Cancelled Qty",
    value: summary?.cancelled_quantity,
    subtitle: "Items cancelled",
    icon: Package,
    color: "red",
  },
  {
    title: "Non-Chargeable Qty",
    value: summary?.nc_quantity,
    subtitle: "Complimentary / NC",
    icon: Package,
    color: "gray",
  },
  {
    title: "Avg Item Revenue",
    value: formatNumber(summary?.average_item_revenue, true),
    subtitle: "Per item average",
    icon: ShoppingCart,
    color: "indigo",
  },
];

  const handleExportItemSalesReport = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    const fileName = `Item-Sales-Report_${formatFileDate(
      dateRange.startDate,
    )}_to_${formatFileDate(dateRange.endDate)}`;

    await handleResponse(
      dispatch(exportItemSalesReport({ outletId, dateRange })),
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
      onClick: () => handleExportItemSalesReport(),
      loading: isExportingItemSalesReport,
      loadingText: "Exporting...",
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchReport,
      loading: isFetchingItemSalesReport,
      loadingText: "Refreshing...",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <PageHeader
        title={"Item Sales Report"}
        showBackButton
        rightContent={
          <CustomDateRangePicker
            value={dateRange}
            onChange={(newRange) => {
              setDateRange(newRange);
            }}
          />
        }
        actions={actions}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            color={stat.color}
            variant="v9"
            loading={isFetchingItemSalesReport}
          />
        ))}
      </div>
      {summary?.top_seller && (
        <div
          className="bg-emerald-50 border border-emerald-200 
               rounded-lg px-4 py-2 
               flex items-center justify-between text-sm"
        >
          <div className="flex items-center gap-2 truncate">
            <Star className="w-4 h-4 text-emerald-600 shrink-0" />

            <span className="text-emerald-700 font-medium">Top Seller:</span>

            <span className="text-slate-800 font-semibold truncate max-w-[220px]">
              {summary?.top_seller}
            </span>

            <span className="text-slate-500">
              ({formatNumber(summary?.top_seller_quantity)} sold)
            </span>
          </div>
        </div>
      )}

      <SmartTable
        title={"Item Sales"}
        totalcount={items?.length}
        data={items}
        columns={columns}
        loading={isFetchingItemSalesReport}
        //   actions={rowActions}
      />
    </div>
  );
};

export default ItemSalesReportPage;
