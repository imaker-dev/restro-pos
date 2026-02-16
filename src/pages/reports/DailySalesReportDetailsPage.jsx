import { use, useEffect, useState } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Users,
  DollarSign,
  Clock,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Utensils,
  Wine,
  Package,
  Percent,
  CreditCard,
  Banknote,
  QrCode,
  Wallet,
  Eye,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "../../hooks/useQueryParams";
import { fetchDailySalesReportByDate } from "../../redux/slices/reportSlice";
import SalesSummary from "../../partial/report/SalesSummary";
import Pagination from "../../components/Pagination";
import PageHeader from "../../layout/PageHeader";
import { formatDate } from "../../utils/dateFormatter";
import SmartTable from "../../components/SmartTable";
import { formatNumber } from "../../utils/numberFormatter";
import DailySalesDetailsPageSkeleton from "../../partial/report/DailySalesDetailsPageSkeleton";

export default function DailySalesReportDetailsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { date } = useQueryParams();

  const { outletId } = useSelector((state) => state.auth);

  const { dailySalesReportDetails: data, isFetchingDailyReportDetails } =
    useSelector((state) => state.report);
  const { summary, orders, pagination } = data || {};

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    dispatch(
      fetchDailySalesReportByDate({
        outletId,
        date,
        page: currentPage,
        limit: itemsPerPage,
      }),
    );
  }, [outletId, date, currentPage, itemsPerPage]);

  const columns = [
    {
      key: "orderNumber",
      label: "Order",
      render: (row) => (
        <div className="max-w-[200px]">
          <p className="font-medium text-slate-800">{row.orderNumber}</p>
          <p className="text-xs text-slate-500">
            {row.floorName || "-"} • Table {row.tableNumber || "-"}
          </p>
        </div>
      ),
    },

    {
      key: "orderType",
      label: "Type",
      render: (row) => (
        <span className="px-2.5 py-1 text-xs rounded-md font-medium bg-indigo-100 text-indigo-700 capitalize">
          {row.orderType.replace("_", " ")}
        </span>
      ),
    },

    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-2.5 py-1 text-xs rounded-md font-medium capitalize
        ${
          row.status === "completed" || row.status === "billed"
            ? "bg-emerald-100 text-emerald-700"
            : row.status === "pending"
              ? "bg-amber-100 text-amber-700"
              : "bg-rose-100 text-rose-700"
        }`}
        >
          {row.status}
        </span>
      ),
    },

    {
      key: "paymentStatus",
      label: "Payment",
      render: (row) => (
        <span
          className={`px-2.5 py-1 text-xs rounded-md font-medium capitalize
        ${
          row.paymentStatus === "completed"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-100 text-slate-600"
        }`}
        >
          {row.paymentStatus}
        </span>
      ),
    },

    {
      key: "items",
      label: "Items",
      sortable: false,
      render: (row) => (
        <span className="font-semibold text-slate-700">
          {row.items?.totalCount ?? 0}
        </span>
      ),
    },

    {
      key: "guests",
      label: "Guests",
      render: (row) => (
        <span className="text-slate-700 font-medium">
          {row.guestCount ?? 0}
        </span>
      ),
    },

    {
      key: "captain",
      label: "Captain",
      render: (row) => (
        <span className="text-slate-600">{row.captainName || "-"}</span>
      ),
    },

    {
      key: "amount",
      label: "Total",
      render: (row) => (
        <span className="font-semibold text-slate-800">
          {formatNumber(row.totalAmount, true)}
        </span>
      ),
    },

    {
      key: "createdAt",
      label: "Created",
      render: (row) => (
        <span className="text-slate-500 whitespace-nowrap">
          {formatDate(row.createdAt, "longTime")}
        </span>
      ),
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      color: "slate",
      onClick: (row) => navigate(`/orders/details?orderId=${row.orderId}`),
    },
  ];

  if (isFetchingDailyReportDetails) {
    return <DailySalesDetailsPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={formatDate(date, "long")} showBackButton />

      <SalesSummary data={summary} />

      <SmartTable
        title="Orders"
        totalcount={pagination?.totalCount}
        data={orders}
        columns={columns}
        loading={isFetchingDailyReportDetails}
        actions={rowActions}
      />

      <Pagination
        totalItems={pagination?.totalCount}
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
}
