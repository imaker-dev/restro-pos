import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomers } from "../../redux/slices/customerSlice";
import PageHeader from "../../layout/PageHeader";
import { formatDate } from "../../utils/dateFormatter";
import SmartTable from "../../components/SmartTable";
import { formatNumber } from "../../utils/numberFormatter";
import { Box, Eye, ReceiptIndianRupee, Users } from "lucide-react";
import StatCard from "../../components/StatCard";
import { useNavigate } from "react-router-dom";

const AllCustomersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { outletId } = useSelector((state) => state.auth);
  const { allCustomers, loading } = useSelector((state) => state.customer);

  const { customers, pagination, summary } = allCustomers || {};

  console.log(summary);

  useEffect(() => {
    dispatch(fetchAllCustomers({ outletId }));
  }, [outletId]);

const columns = [
  {
    key: "name",
    label: "Customer",
    sortable: true,
    sortKey: "name",
    render: (row) => (
      <div className="leading-tight max-w-[180px]">
        <div
          className="text-slate-700 font-semibold truncate"
          title={row.name}
        >
          {row.name}
        </div>

        <div className="text-xs text-slate-500">
          {row.phone}
        </div>
      </div>
    ),
  },

  {
    key: "totalOrders",
    label: "Orders",
    sortable: true,
    render: (row) => (
      <div className="text-slate-700 font-medium">
        {row.totalOrders}
      </div>
    ),
  },

  {
    key: "totalSpent",
    label: "Total Spent",
    sortable: true,
    render: (row) => (
      <div className="leading-tight max-w-[140px]">
        <div className="text-slate-700 font-semibold">
          ₹ {row.totalSpent?.toLocaleString()}
        </div>

        <div className="text-xs text-slate-500">
          Avg ₹ {row.avgOrderValue?.toLocaleString()}
        </div>
      </div>
    ),
  },

  {
    key: "firstOrderAt",
    label: "First Order",
    sortable: true,
    render: (row) => (
      <div className="text-slate-700 text-sm">
        {row.firstOrderAt
          ? formatDate(row.firstOrderAt, "long")
          : "—"}
      </div>
    ),
  },

  {
    key: "lastOrderAt",
    label: "Last Order",
    sortable: true,
    sortKey: "lastOrderAt",
    render: (row) => (
      <div className="text-slate-700 text-sm">
        {row.lastOrderAt
          ? formatDate(row.lastOrderAt, "longTime")
          : "—"}
      </div>
    ),
  },

  {
    key: "isActive",
    label: "Status",
    sortable: true,
    render: (row) => (
      <span
        className={`text-xs font-medium px-2 py-1 rounded-full ${
          row.isActive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-600"
        }`}
      >
        {row.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
];


  const rowActions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) => navigate(`/customers/details?customerId=${row.id}`),
    },
  ];

  const customerStats = [
    {
      title: "Total Customers",
      value: formatNumber(summary?.totalCustomers),
      color: "blue",
      icon: Users,
    },
    {
      title: "Total Orders",
      value: formatNumber(summary?.totalOrders, true),
      color: "indigo",
      icon: Box,
    },
    {
      title: "GST Customers",
      value: formatNumber(summary?.gstCustomers),
      color: "green",
      icon: ReceiptIndianRupee,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={"All Customers"} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {customerStats.map((card, i) => (
          <StatCard
            key={i}
            title={card.title}
            value={card.value}
            color={card.color}
            icon={card.icon}
          />
        ))}
      </div>

      <SmartTable
        title="Customers"
        totalcount={customers?.length}
        data={customers}
        columns={columns}
        actions={rowActions}
        loading={loading}
      />
    </div>
  );
};

export default AllCustomersPage;
