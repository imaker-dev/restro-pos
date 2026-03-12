import React from "react";
import { Eye } from "lucide-react";
import { formatDate } from "../utils/dateFormatter";
import { formatNumber } from "../utils/numberFormatter";
import OrderBadge from "../partial/order/OrderBadge";

export const getOrderTableConfig = (navigate) => {
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
      label: "Table / Location",
      sortable: true,
      render: (row) => {
        if (row.orderType !== "dine_in") {
          return (
            <div className="text-xs text-slate-500 italic">{row.orderType}</div>
          );
        }

        const table = row.tableNumber || row.tableName || "—";
        const location = [row.floorName, row.sectionName]
          .filter(Boolean)
          .join(" / ");

        return (
          <div className="leading-tight max-w-[150px]">
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
      key: "customer",
      label: "Customer",
      sortable: false,
      render: (row) => (
        <div className="leading-tight max-w-[160px]">
          <div className="text-slate-700 font-medium">
            {row.customerName || "Walk-in"}
          </div>

          <div className="text-xs text-slate-500">
            {row.customerPhone || "—"}
          </div>
        </div>
      ),
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
      render: (row) => (
        <div className="leading-tight max-w-[140px]">
          <div className="text-slate-700 font-semibold">
            {formatNumber(row.totalAmount || 0, true)}
          </div>

          <div className="text-xs text-green-600 font-medium">
            Paid {formatNumber(row.paidAmount || 0, true)}
          </div>

          {row.totalAmount > row.paidAmount && (
            <div className="text-xs text-orange-600">
              Due {formatNumber(row.totalAmount - row.paidAmount, true)}
            </div>
          )}
        </div>
      ),
    },

    {
      key: "meta",
      label: "Info",
      sortable: false,
      render: (row) => (
        <div className="leading-tight max-w-[120px]">
          {row.itemCount ? (
            <div className="text-slate-700 text-sm">
              {row.itemCount} {row.itemCount === 1 ? "item" : "items"}
            </div>
          ) : null}

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

  const actions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) => navigate(`/orders/details?orderId=${row.id}`),
    },
  ];

  return { columns, actions };
};
