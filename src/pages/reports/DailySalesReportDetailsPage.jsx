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
import OrderBadge from "../../partial/order/OrderBadge";

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
      render: (row) => {
        const isDineIn = row.orderType === "dine_in";

        return (
          <div className="max-w-[220px] space-y-0.5">
            {/* Order Number */}
            <p className="font-semibold text-sm text-slate-900 tracking-tight">
              #{row.orderNumber}
            </p>

            {/* Meta */}
            {isDineIn ? (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="bg-slate-100 text-slate-700 px-1.5 py-[1px] rounded font-medium">
                  {row.floorName || "—"}
                </span>

                <span className="text-slate-300">•</span>

                <span>
                  {" "}
                  <span className="font-medium text-slate-700">
                    {row.tableNumber || "—"}
                  </span>
                </span>
              </div>
            ) : (
              <span className="text-[11px] font-medium text-slate-500">
                {row.orderType === "takeaway"
                  ? "Takeaway"
                  : row.orderType === "delivery"
                    ? "Delivery"
                    : "Unknown"}
              </span>
            )}
          </div>
        );
      },
    },

    {
      key: "orderType",
      label: "Type",
      render: (row) => (
        <OrderBadge type="type" value={row.orderType} size="sm" />
      ),
    },

    {
      key: "status",
      label: "Status",
      render: (row) => (
        <OrderBadge type="status" value={row.status} size="sm" />
      ),
    },

    {
      key: "paymentStatus",
      label: "Payment",
      render: (row) => (
        <OrderBadge type="payment" value={row.paymentStatus} size="sm" />
      ),
    },

    {
      key: "items",
      label: "Items",
      sortable: false,
      render: (row) => (
        <span className="font-semibold text-sm text-slate-800 tabular-nums">
          {row.items?.totalCount ?? 0}
        </span>
      ),
    },

    {
      key: "guests",
      label: "Guests",
      render: (row) => (
        <span className="font-medium text-sm text-slate-700 tabular-nums">
          {row.guestCount ?? 0}
        </span>
      ),
    },

    {
      key: "captain",
      label: "Captain",
      render: (row) => (
        <span className="text-xs text-slate-600 font-medium">
          {row.captainName || "—"}
        </span>
      ),
    },

    {
      key: "amount",
      label: "Total",
      render: (row) => (
        <span className="font-semibold text-sm text-slate-900 tabular-nums">
          {formatNumber(row.totalAmount ?? 0, true)}
        </span>
      ),
    },

    {
      key: "createdAt",
      label: "Created",
      render: (row) => (
        <span className="text-xs text-slate-500 whitespace-nowrap">
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
