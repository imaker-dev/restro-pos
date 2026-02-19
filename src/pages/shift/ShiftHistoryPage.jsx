import React, { useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchShiftHistory } from "../../redux/slices/shiftSlice";
import SmartTable from "../../components/SmartTable";
import { formatNumber } from "../../utils/numberFormatter";
import { formatDate } from "../../utils/dateFormatter";
import StatusBadge from "../../layout/StatusBadge";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ShiftHistoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { outletId } = useSelector((state) => state.auth);
  const { isFetchingShiftHistory, shiftHistory } = useSelector(
    (state) => state.shift,
  );
  const { shifts, pagination } = shiftHistory || {};

  useEffect(() => {
    if (outletId) {
      dispatch(fetchShiftHistory(outletId));
    }
  }, [outletId]);

  const sessionColumns = [
    // Session Date
    {
      key: "sessionDate",
      label: "Session Date",
      render: (row) => (
        <div>
          <div className="font-medium text-slate-800">
            {formatDate(row.sessionDate, "long")}
          </div>
          <div className="text-xs text-slate-500">
            {formatDate(row.openingTime, "time")}
            {row.closingTime && <> → {formatDate(row.closingTime, "time")}</>}
          </div>
        </div>
      ),
    },

    // Opening Cash
    {
      key: "openingCash",
      label: "Opening",
      render: (row) => (
        <span className="font-medium text-slate-700">
          {formatNumber(row.openingCash, true)}
        </span>
      ),
    },

    // Closing Cash
    {
      key: "closingCash",
      label: "Closing",
      render: (row) => (
        <span className="font-medium text-slate-700">
          {row.closingTime ? formatNumber(row.closingCash, true) : "-"}
        </span>
      ),
    },

    // Expected Cash
    {
      key: "expectedCash",
      label: "Expected",
      render: (row) => (
        <span className="text-slate-600">
          {row.closingTime ? formatNumber(row.expectedCash, true) : "-"}
        </span>
      ),
    },

    // Variance
    {
      key: "cashVariance",
      label: "Variance",
      render: (row) => (
        <span
          className={`font-semibold ${
            row.cashVariance < 0
              ? "text-red-600"
              : row.cashVariance > 0
                ? "text-emerald-600"
                : "text-slate-600"
          }`}
        >
          {row.closingTime ? formatNumber(row.cashVariance, true) : "-"}
        </span>
      ),
    },

    // Sales
    {
      key: "totalSales",
      label: "Total Sales",
      render: (row) => (
        <div>
          <div className="font-semibold text-secondary">
            {formatNumber(row.totalSales, true)}
          </div>
          <div className="text-xs text-slate-500">{row.totalOrders} Orders</div>
        </div>
      ),
    },

    // Payment Breakdown
    //   {
    //     key: "payments",
    //     label: "Payments",
    //     render: (row) => (
    //       <div className="text-xs space-y-1">
    //         <div>Cash: {formatNumber(row.totalCashSales, true)}</div>
    //         <div>Card: {formatNumber(row.totalCardSales, true)}</div>
    //         <div>UPI: {formatNumber(row.totalUpiSales, true)}</div>
    //       </div>
    //     ),
    //   },

    // Discounts / Refunds / Cancellations
    //   {
    //     key: "adjustments",
    //     label: "Adjustments",
    //     render: (row) => (
    //       <div className="text-xs space-y-1">
    //         <div>Discounts: {formatNumber(row.totalDiscounts, true)}</div>
    //         <div>Refunds: {formatNumber(row.totalRefunds, true)}</div>
    //         <div>Cancellations: {row.totalCancellations}</div>
    //       </div>
    //     ),
    //   },

    // Staff Info
    {
      key: "staff",
      label: "Staff",
      render: (row) => (
        <div className="text-xs space-y-1">
          <div>
            <span className="text-slate-500">Opened:</span> {row.openedByName}
          </div>
          {row.closedByName && (
            <div>
              <span className="text-slate-500">Closed:</span> {row.closedByName}
            </div>
          )}
        </div>
      ),
    },

    // Status
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <StatusBadge
          value={row.status === "open"}
          trueText="Open"
          falseText="Closed"
        />
      ),
    },
  ];

  const rowActions = [
    {
      label: "Eye",
      icon: Eye,
      onClick: (row) => navigate(`/shift-history/details?shiftId=${row.id}`),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={"Shift History"} />

      <SmartTable
        title={"Shift History"}
        totalcount={shifts?.length}
        data={shifts}
        columns={sessionColumns}
        actions={rowActions}
        loading={isFetchingShiftHistory}
      />
    </div>
  );
};

export default ShiftHistoryPage;
