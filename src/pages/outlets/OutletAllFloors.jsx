import React, { useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFloors } from "../../redux/slices/floorSlice";
import { useQueryParams } from "../../hooks/useQueryParams";
import SmartTable from "../../components/SmartTable";
import { Edit3, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OutletAllFloors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { outletId } = useQueryParams();

  const { allFloors, loading } = useSelector((state) => state.floor);

  const fetchFloors = () => {
    dispatch(fetchAllFloors(outletId));
  };
  
  useEffect(() => {
    fetchFloors();
  }, []);

  const columns = [
    {
      key: "name",
      label: "Floor Name",
      render: (row) => (
        <span className="text-slate-700 font-medium">{row.name}</span>
      ),
    },
    {
      key: "code",
      label: "Code",
      render: (row) => <span className="text-slate-600">{row.code}</span>,
    },
    {
      key: "floor_number",
      label: "Floor No",
      render: (row) => (
        <span className="text-slate-700">{row.floor_number}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 text-xs rounded font-semibold ${
            row.is_active
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },

    // TOTAL TABLES
    {
      key: "table_count",
      label: "Tables",
      render: (row) => (
        <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded font-semibold">
          {row.table_count ?? 0}
        </span>
      ),
    },

    // AVAILABLE TABLES
    {
      key: "available_count",
      label: "Available",
      render: (row) => (
        <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded font-semibold">
          {row.available_count ?? 0}
        </span>
      ),
    },

    // OCCUPIED TABLES
    {
      key: "occupied_count",
      label: "Occupied",
      render: (row) => (
        <span className="px-2 py-1 text-xs bg-rose-100 text-rose-700 rounded font-semibold">
          {row.occupied_count ?? 0}
        </span>
      ),
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) => navigate(`/outlets/floors/tables?floorId=${row.id}`),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={"Outlet All Floors"} showBackButton/>

      <SmartTable
        title="Floors"
        totalcount={allFloors?.length}
        data={allFloors}
        columns={columns}
        actions={rowActions}
        loading={loading}
      />
    </div>
  );
};

export default OutletAllFloors;
