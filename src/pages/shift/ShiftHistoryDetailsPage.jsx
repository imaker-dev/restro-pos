import React, { useEffect, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  User,
  ShoppingBag,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Receipt,
  Users,
  Calendar,
  Building2,
  ChevronRight,
} from "lucide-react";
import PageHeader from "../../layout/PageHeader";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useDispatch, useSelector } from "react-redux";
import { fetchShiftHistoryByid } from "../../redux/slices/shiftSlice";
import { formatDate } from "../../utils/dateFormatter";
import StatusBadge from "../../layout/StatusBadge";
import StatCard from "../../components/StatCard";
import { formatNumber } from "../../utils/numberFormatter";
import SmartTable from "../../components/SmartTable";

const ShiftHistoryDetailsPage = () => {
  const dispatch = useDispatch();
  const { shiftId } = useQueryParams();
  const [activeTab, setActiveTab] = useState("transactions");

  const { shiftHistoryDetails: shift, isFetchingShiftHistoryDetails } =
    useSelector((state) => state.shift);
  const { transactions, staffActivity } = shift || {};

  useEffect(() => {
    if (shiftId) {
      dispatch(fetchShiftHistoryByid(shiftId));
    }
  }, [shiftId]);

  if (isFetchingShiftHistoryDetails) {
    return (
      <div>
        <PageHeader title="Shift History Details" showBackButton />
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!shift) {
    return (
      <div>
        <PageHeader title="Shift History Details" showBackButton />
        <div className="text-center py-12 text-gray-500">Shift not found</div>
      </div>
    );
  }

  // Calculate shift duration
  const shiftDuration = () => {
    if (!shift.openingTime || !shift.closingTime) return "—";
    const start = new Date(shift.openingTime);
    const end = new Date(shift.closingTime);
    const diff = Math.abs(end - start);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const stats = [
    {
      title: "Opening Cash",
      value: formatNumber(shift?.openingCash || 0, true),
      subtitle: "Cash at shift start",
      icon: DollarSign,
      color: "blue",
    },
    {
      title: "Expected Cash",
      value: formatNumber(shift?.expectedCash || 0, true),
      subtitle: "System calculated amount",
      icon: TrendingUp,
      color: "green",
    },
    {
      title: "Closing Cash",
      value: shift?.closingTime
        ? formatNumber(shift?.closingCash || 0, true)
        : "-",
      subtitle: shift?.closingTime
        ? "Cash counted at closing"
        : "Shift still open",
      icon: Receipt,
      color: "purple",
    },
    {
      title: "Cash Variance",
      value: shift?.closingTime
        ? `${shift?.cashVariance > 0 ? "+" : ""}${formatNumber(
            shift?.cashVariance || 0,
            true,
          )}`
        : "-",
      subtitle:
        shift?.cashVariance < 0
          ? "Shortage detected"
          : shift?.cashVariance > 0
            ? "Excess cash"
            : "Balanced",
      icon:
        shift?.cashVariance < 0
          ? TrendingDown
          : shift?.cashVariance > 0
            ? TrendingUp
            : CheckCircle,
      color:
        shift?.cashVariance < 0
          ? "red"
          : shift?.cashVariance > 0
            ? "yellow"
            : "green",
      notes: shift?.varianceNotes || null,
    },
  ];

  const transactionColumns = [
    // Date + Type
    {
      key: "createdAt",
      label: "Date / Type",
      render: (row) => {
        const typeStyles = {
          sale: "text-emerald-600",
          opening: "text-blue-600",
          closing: "text-amber-600",
        };

        return (
          <div className="space-y-0.5">
            <div className="text-sm font-medium text-slate-800">
              {formatDate(row.createdAt, "long")}
            </div>
            <div className="text-xs flex items-center gap-2">
              <span className="text-slate-400">
                {formatDate(row.createdAt, "time")}
              </span>
              <span
                className={`capitalize font-medium ${typeStyles[row.type]}`}
              >
                • {row.type}
              </span>
            </div>
          </div>
        );
      },
    },

    // Amount + Balance After
    {
      key: "amount",
      label: "Amount ",
      render: (row) => (
        <div className="text-right space-y-0.5">
          <div
            className={`font-semibold ${
              row.type === "closing"
                ? "text-red-600"
                : row.type === "opening"
                  ? "text-blue-600"
                  : "text-emerald-600"
            }`}
          >
            {row.amount > 0 ? "+" : ""}
            {formatNumber(row.amount, true)}
          </div>

          <div className="text-xs text-slate-500">
            Bal:{" "}
            <span className="font-medium text-slate-800">
              {formatNumber(row.balanceAfter, true)}
            </span>
          </div>
        </div>
      ),
    },

    // Balance Flow (Before → After)
    {
      key: "balanceFlow",
      label: "Balance Flow",
      render: (row) => (
        <div className="text-xs text-slate-600">
          {formatNumber(row.balanceBefore, true)} →{" "}
          <span className="font-medium text-slate-800">
            {formatNumber(row.balanceAfter, true)}
          </span>
        </div>
      ),
    },

    // Description (Main info)
    {
      key: "description",
      label: "Description",
      render: (row) => (
        <div className="space-y-0.5 max-w-[250px]">
          <div className="text-sm text-slate-700 truncate">
            {row.description || "-"}
          </div>

          {row.referenceType && (
            <div className="text-xs text-slate-500 capitalize">
              {row.referenceType.replace("_", " ")} • ID {row.referenceId}
            </div>
          )}
        </div>
      ),
    },

    // User
    {
      key: "userName",
      label: "Processed By",
      render: (row) => (
        <span className="text-sm text-slate-600 whitespace-nowrap">
          {row.userName}
        </span>
      ),
    },
  ];

  const staffColumns = [
    // Rank + Name
    {
      key: "userName",
      label: "Staff",
      render: (row, index) => (
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400 w-6">
            #{index + 1}
          </span>

          <div>
            <div className="font-medium text-slate-800">{row.userName}</div>
            <div className="text-xs text-slate-500">
              {row.ordersHandled} Orders
            </div>
          </div>
        </div>
      ),
    },

    // Total Sales (Primary metric)
    {
      key: "totalSales",
      label: "Total Sales",
      render: (row) => (
        <div className="text-right">
          <div className="text-lg font-bold text-emerald-600">
            {formatNumber(row.totalSales, true)}
          </div>
          <div className="text-xs text-slate-400">
            Avg ₹
            {row.ordersHandled > 0
              ? formatNumber(row.totalSales / row.ordersHandled)
              : 0}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shift History Details"
        description={`${shift?.outletName || "Shift"} - ${formatDate(shift?.sessionDate, "short")}`}
        showBackButton
      />

      {/* Header Summary */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 size={18} className="text-gray-400" />
              <h2 className="text-xl font-bold text-gray-900">
                {shift?.outletName}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDate(shift?.sessionDate, "long")}
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                {shiftDuration()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge
              value={shift?.status === "open"}
              trueText="Open"
              falseText="Closed"
            />
          </div>
        </div>

        {/* Opening/Closing Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500 mb-1">Opened By</p>
            <p className="text-sm font-semibold text-gray-900">
              {shift?.openedByName}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(shift?.openingTime, "long")}
            </p>
          </div>
          {shift?.closedByName && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Closed By</p>
              <p className="text-sm font-semibold text-gray-900">
                {shift?.closedByName}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(shift?.closingTime, "long")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cash Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats?.map((stat, index) => (
          <StatCard
            key={index}
            title={stat?.title}
            value={stat?.value}
            subtitle={stat?.subtitle}
            icon={stat?.icon}
            color={stat?.color}
          />
        ))}
      </div>

      {/* Sales & Orders Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">
              Sales Summary
            </h3>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-sm text-gray-700">Total Sales</span>
              <span className="text-lg font-bold text-gray-900">
                ₹{shift?.totalSales?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
              <span className="text-sm text-gray-700">Cash Sales</span>
              <span className="text-sm font-semibold text-gray-900">
                ₹{shift?.totalCashSales?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50">
              <span className="text-sm text-gray-700">Card Sales</span>
              <span className="text-sm font-semibold text-gray-900">
                ₹{shift?.totalCardSales?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50">
              <span className="text-sm text-gray-700">UPI Sales</span>
              <span className="text-sm font-semibold text-gray-900">
                ₹{shift?.totalUpiSales?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50">
              <span className="text-sm text-gray-700">Discounts</span>
              <span className="text-sm font-semibold text-amber-700">
                -₹{shift?.totalDiscounts?.toLocaleString()}
              </span>
            </div>
            {(shift?.totalRefunds > 0 || shift?.totalCancellations > 0) && (
              <div className="pt-2 border-t border-gray-200 space-y-2">
                {shift?.totalRefunds > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Refunds</span>
                    <span className="font-medium text-red-600">
                      -₹{shift.totalRefunds.toLocaleString()}
                    </span>
                  </div>
                )}
                {shift?.totalCancellations > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Cancellations</span>
                    <span className="font-medium text-red-600">
                      {shift.totalCancellations}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Order Stats */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">
              Order Statistics
            </h3>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-sm text-gray-700">Total Orders</span>
              <span className="text-lg font-bold text-gray-900">
                {shift?.orderStats?.totalOrders || 0}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <p className="text-xs text-gray-600 mb-1">Completed</p>
                <p className="text-lg font-bold text-emerald-700">
                  {shift?.orderStats?.completedOrders || 0}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                <p className="text-xs text-gray-600 mb-1">Cancelled</p>
                <p className="text-lg font-bold text-red-700">
                  {shift?.orderStats?.cancelledOrders || 0}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200">
              <div className="text-center p-2 rounded bg-blue-50">
                <p className="text-xs text-gray-600 mb-1">Dine-in</p>
                <p className="text-sm font-bold text-gray-900">
                  {shift?.orderStats?.dineInOrders || 0}
                </p>
              </div>
              <div className="text-center p-2 rounded bg-purple-50">
                <p className="text-xs text-gray-600 mb-1">Takeaway</p>
                <p className="text-sm font-bold text-gray-900">
                  {shift?.orderStats?.takeawayOrders || 0}
                </p>
              </div>
              <div className="text-center p-2 rounded bg-amber-50">
                <p className="text-xs text-gray-600 mb-1">Delivery</p>
                <p className="text-sm font-bold text-gray-900">
                  {shift?.orderStats?.deliveryOrders || 0}
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-200 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Order Value</span>
                <span className="font-semibold text-gray-900">
                  ₹
                  {parseFloat(shift?.orderStats?.avgOrderValue || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max Order Value</span>
                <span className="font-semibold text-gray-900">
                  ₹{shift?.orderStats?.maxOrderValue?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Min Order Value</span>
                <span className="font-semibold text-gray-900">
                  ₹{shift?.orderStats?.minOrderValue?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Breakdown */}
      {shift?.paymentBreakdown && shift.paymentBreakdown.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">
              Payment Breakdown
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700">
                    Payment Mode
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-700">
                    Transactions
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-700">
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shift.paymentBreakdown.map((payment, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {payment.mode}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right text-sm text-gray-600">
                      {payment.count}
                    </td>
                    <td className="px-5 py-3 text-right text-sm font-semibold text-gray-900">
                      ₹{payment.total?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("transactions")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "transactions"
              ? "border-primary-500 text-primary-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Transactions
        </button>

        <button
          onClick={() => setActiveTab("staff")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "staff"
              ? "border-primary-500 text-primary-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Staff Report
        </button>
      </div>

      {activeTab === "transactions" && (
        <SmartTable
          title={"Transactions"}
          totalcount={transactions?.length}
          data={transactions}
          columns={transactionColumns}
          loading={isFetchingShiftHistoryDetails}
          //   actions={rowActions}
        />
      )}

      {activeTab === "staff" && (
        <SmartTable
          title={"Staff Activity"}
          totalcount={staffActivity?.length}
          data={staffActivity}
          columns={staffColumns}
          loading={isFetchingShiftHistoryDetails}
          //   actions={rowActions}
        />
      )}
    </div>
  );
};

export default ShiftHistoryDetailsPage;
