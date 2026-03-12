import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../../redux/slices/orderSlice";
import SmartTable from "../../components/SmartTable";
import {
  CheckCircle,
  Download,
  IndianRupee,
  Package,
  RotateCcw,
  ShoppingBag,
  TrendingUp,
  Truck,
  Utensils,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import StatCard from "../../components/StatCard";
import { formatNumber } from "../../utils/numberFormatter";
import {
  ORDER_STATUS_OPTIONS,
  ORDER_TYPE_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from "../../constants/selectOptions";
import { getOrderTableConfig } from "../../columns/order.columns";
import { formatFileDate } from "../../utils/dateFormatter";
import { handleResponse } from "../../utils/helpers";
import { exportOrdersReport } from "../../redux/slices/exportReportSlice";
import { downloadBlob } from "../../utils/blob";

const AllOrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { outletId } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState();
  const [orderStatus, setOrderStatus] = useState("");
  const [orderType, setOrderType] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  const { isExportingOrdersReport } = useSelector(
    (state) => state.exportReport,
  );
  const { allOrdersData, loading } = useSelector((state) => state.order);
  const { orders, pagination, summary } = allOrdersData || {};

  const { columns, actions: rowActions } = getOrderTableConfig(navigate);

  const fetchOrders = () => {
    dispatch(
      fetchAllOrders({
        outletId,
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        dateRange,
        orderStatus,
        orderType,
        paymentStatus,
        sortBy,
        sortOrder,
      }),
    );
  };

  useEffect(() => {
    fetchOrders();
  }, [
    outletId,
    currentPage,
    itemsPerPage,
    searchTerm,
    dateRange,
    orderStatus,
    orderType,
    paymentStatus,
    sortBy,
    sortOrder,
  ]);

  const handleSort = (sortBy, sortOrder) => {
    setSortBy(sortBy);
    setSortOrder(sortOrder);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    dateRange,
    orderStatus,
    orderType,
    paymentStatus,
    sortBy,
    sortOrder,
  ]);

  const orderCards = [
    {
      title: "Total Orders",
      value: formatNumber(summary?.totalOrders),
      color: "blue",
      icon: ShoppingBag,
    },
    {
      title: "Total Amount",
      value: formatNumber(summary?.totalAmount, true),
      color: "indigo",
      icon: IndianRupee,
    },
    {
      title: "Completed Amount",
      value: formatNumber(summary?.completedAmount, true),
      color: "green",
      icon: CheckCircle,
    },
    {
      title: "Cancelled Orders",
      value: formatNumber(summary?.cancelledCount),
      color: "red",
      icon: XCircle,
    },
    {
      title: "Dine-In Orders",
      value: formatNumber(summary?.dineInCount),
      color: "purple",
      icon: Utensils,
    },
    {
      title: "Takeaway Orders",
      value: formatNumber(summary?.takeawayCount),
      color: "cyan",
      icon: Package,
    },
    {
      title: "Delivery Orders",
      value: formatNumber(summary?.deliveryCount),
      color: "sky",
      icon: Truck,
    },
    {
      title: "Avg Order Value",
      value: formatNumber(summary?.avgOrderValue, true),
      color: "amber",
      icon: TrendingUp,
    },
  ];

  const handleExportOrdersReport = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    const fileName = `Orders-Report_${formatFileDate(
      dateRange.startDate,
    )}_to_${formatFileDate(dateRange.endDate)}`;

    await handleResponse(
      dispatch(
        exportOrdersReport({
          outletId,
          search: searchTerm,
          dateRange,
          orderStatus,
          orderType,
          paymentStatus,
          sortBy,
          sortOrder,
        }),
      ),
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
      onClick: handleExportOrdersReport,
      loading: isExportingOrdersReport,
      loadingText: "Exporting...",
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchOrders,
      loading: loading,
      loadingText: "Refreshing...",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <PageHeader
          title={"All Orders"}
          actions={actions}
          rightContent={
            <CustomDateRangePicker
              value={dateRange}
              onChange={(newRange) => {
                setDateRange(newRange);
              }}
              // defaultRange=""
            />
          }
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {orderCards.map((card, i) => (
          <StatCard
            key={i}
            title={card.title}
            value={card.value}
            color={card.color}
            icon={card.icon}
            variant="v9"
            loading={loading}
          />
        ))}
      </div>

      <div className="bg-white">
        {/* Header Section */}
        <div className="border-b border-slate-200">
          <div className="px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search Bar */}
              <div className="w-full lg:w-auto">
                <SearchBar
                  placeholder="Search by order details..."
                  onSearch={(value) => setSearchTerm(value)}
                  width="w-full lg:w-72"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                {/* Order Status */}
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="form-select w-full"
                >
                  {ORDER_STATUS_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>

                {/* Order Type */}
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="form-select w-full"
                >
                  {ORDER_TYPE_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>

                {/* Payment Status */}
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="form-select w-full"
                >
                  {PAYMENT_STATUS_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <SmartTable
          // title="Items"
          totalcount={orders?.length}
          data={orders}
          columns={columns}
          actions={rowActions}
          loading={loading}
          sortField={sortBy}
          sortDirection={sortOrder}
          onSortChange={handleSort}
        />
      </div>

      <Pagination
        totalItems={pagination?.total}
        currentPage={currentPage}
        pageSize={itemsPerPage}
        totalPages={pagination?.totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        maxPageNumbers={5}
        showPageSizeSelector={true}
        onPageSizeChange={(size) => {
          setCurrentPage(1);
          setItemsPerPage(size);
        }}
      />
    </div>
  );
};

export default AllOrdersPage;
