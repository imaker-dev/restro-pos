import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../../redux/slices/orderSlice";
import { formatDate } from "../../utils/dateFormatter";
import SmartTable from "../../components/SmartTable";
import OrderBadge from "../../partial/order/OrderBadge";
import {
  CheckCircle,
  Eye,
  IndianRupee,
  Package,
  ShoppingBag,
  ShoppingCart,
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
import AccordionSection from "../../components/AccordionSection";
import {
  ORDER_STATUS_OPTIONS,
  ORDER_TYPE_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from "../../constants/selectOptions";

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

  const { allOrdersData, loading } = useSelector((state) => state.order);
  const { orders, pagination, summary } = allOrdersData || {};

  const columns = [
    {
      key: "orderNumber",
      label: "Order",
      sortable: true,
      sortKey: "created_at",
      render: (row) => (
        <div className="leading-tight max-w-[140px]">
          <div
            className="text-slate-700 font-semibold truncate"
            title={row.orderNumber}
          >
            {row.orderNumber}
          </div>

          <div className="text-xs text-slate-500">
            {formatDate(row.createdAt, "longTime")}
          </div>
        </div>
      ),
    },

    {
      key: "orderType",
      label: "Type",
      sortable: true,
      render: (row) => <OrderBadge type="type" value={row.orderType} />,
    },

    {
      key: "table",
      label: "Table",
      sortable: true,
      render: (row) => {
        const table = row.tableNumber || row.tableName || "—";
        const location = [row.floorName, row.sectionName]
          .filter(Boolean)
          .join(" / ");

        return (
          <div className="leading-tight max-w-[130px]">
            <div className="text-slate-700 font-medium">{table}</div>
            <div
              className="text-xs text-slate-500 truncate"
              title={location || "—"}
            >
              {location || "—"}
            </div>
          </div>
        );
      },
    },

    {
      key: "status",
      label: "Order Status",
      sortable: true,
      render: (row) => <OrderBadge type="status" value={row.status} />,
    },

    {
      key: "paymentStatus",
      label: "Payment",
      sortable: true,
      render: (row) => <OrderBadge type="payment" value={row.paymentStatus} />,
    },

    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (row) =>  <div className="leading-tight max-w-[140px]">
            <div className="text-slate-700 font-semibold">
              {formatNumber(row.totalAmount, true)}
            </div>

            <div className="text-xs text-green-600 font-medium">
              Paid {formatNumber(row.paidAmount, true)}
            </div>

            {/* {due > 0 && (
              <div className="text-xs text-red-500">
                Due {formatNumber(due, true)}
              </div>
            )} */}
          </div>,
    },

    {
      key: "meta",
      label: "Info",
      sortable: false,
      render: (row) => (
        <div className="leading-tight max-w-[120px]">
          <div className="text-slate-700 text-sm">{row.itemCount} items</div>
          <div
            className="text-xs text-slate-500 truncate"
            title={row.captainName}
          >
            {row.captainName || "—"}
          </div>
        </div>
      ),
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) => navigate(`/orders/details?orderId=${row.id}`),
    },
  ];

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
      color: "green",
      icon: IndianRupee,
    },
    {
      title: "Completed Amount",
      value: formatNumber(summary?.completedAmount, true),
      color: "emerald",
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
      color: "indigo",
      icon: Utensils,
    },
    {
      title: "Takeaway Orders",
      value: formatNumber(summary?.takeawayCount),
      color: "purple",
      icon: Package,
    },
    {
      title: "Delivery Orders",
      value: formatNumber(summary?.deliveryCount),
      color: "cyan",
      icon: Truck,
    },
    {
      title: "Avg Order Value",
      value: formatNumber(summary?.avgOrderValue, true),
      color: "amber",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <PageHeader title={"All Orders"} />
        <CustomDateRangePicker
          value={dateRange}
          onChange={(newRange) => {
            setDateRange(newRange);
          }}
          defaultRange=""
        />
      </div>

      <AccordionSection
        defaultOpen={false}
        icon={ShoppingCart}
        title={"Order Summary"}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {orderCards.map((card, i) => (
            <StatCard
              key={i}
              title={card.title}
              value={card.value}
              color={card.color}
              icon={card.icon}
              variant="secondary"
            />
          ))}
        </div>
      </AccordionSection>

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
