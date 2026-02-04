import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOutlets, updateOutlet } from "../../redux/slices/outletSlice";
import SmartTable from "../../components/SmartTable";
import { Edit2, Edit3, Eye, LayoutGrid } from "lucide-react";
import OutletUpdateModal from "../../partial/outlet/OutletUpdateModal";
import { handleResponse } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

const AllOutletsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showTableUpdateModal, setShowTableUpdateModal] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState(null);

  const { allOutlets, loading, isupdatingOutlet } = useSelector(
    (state) => state.outlet,
  );

  const fetchOutlets = () => {
    dispatch(fetchAllOutlets());
  };

  useEffect(() => {
    fetchOutlets();
  }, []);

const columns = [
  {
    key: "name",
    label: "Outlet Name",
    render: (row) => (
      <span className="text-slate-700 font-medium">{row.name}</span>
    ),
  },
  {
    key: "code",
    label: "Code",
    render: (row) => (
      <span className="text-slate-600">{row.code}</span>
    ),
  },
  {
    key: "city",
    label: "City",
    render: (row) => (
      <span className="text-slate-700">{row.city || "-"}</span>
    ),
  },
  {
    key: "phone",
    label: "Phone",
    render: (row) => (
      <span className="text-slate-600">{row.phone || "-"}</span>
    ),
  },
  {
    key: "timing",
    label: "Timing",
    render: (row) => {
      if (row.is_24_hours) return "24 Hours";
      if (!row.opening_time || !row.closing_time) return "-";

      return (
        <span className="text-slate-600">
          {row.opening_time.slice(0,5)} - {row.closing_time.slice(0,5)}
        </span>
      );
    },
  },

  // NEW FLOORS COLUMN
  {
    key: "floors",
    label: "Floors",
    render: (row) => (
      <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded font-semibold">
        {row.floor_count ?? 0}
      </span>
    ),
  },

  {
    key: "tables",
    label: "Tables",
    render: (row) => (
      <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded font-semibold">
        {row.table_count ?? 0}
      </span>
    ),
  },
];

  const actions = [
{
    label: "Floors",
    icon: Eye,
    onClick: (row) => navigate(`/outlets/floors?outletId=${row.id}`),
  },
  {
    label: "Categories",
    icon: LayoutGrid,
    color: "purple",
    onClick: (row) => navigate(`/outlets/categories?outletId=${row.id}`),
  },
    {
      label: "Edit",
      icon: Edit3,
      color: "blue",
      onClick: (row) => {
        (setSelectedOutlet(row), setShowTableUpdateModal(true));
      },
    },
  ];

  const clearOutletStates = () => {
    setShowTableUpdateModal(false);
    setSelectedOutlet(null);
  };

  const handleUpdateOutlet = async ({ id, values }) => {
    await handleResponse(dispatch(updateOutlet({ id, values })), () => {
      fetchOutlets();
      clearOutletStates();
    });
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader title={"All Outlets"} />

        <SmartTable
          title="Outlets"
          totalcount={allOutlets?.length}
          data={allOutlets}
          columns={columns}
          actions={actions}
          loading={loading}
        />
      </div>

      <OutletUpdateModal
        isOpen={showTableUpdateModal}
        onClose={() => clearOutletStates()}
        outlet={selectedOutlet}
        onSubmit={handleUpdateOutlet}
        loading={isupdatingOutlet}
      />
    </>
  );
};

export default AllOutletsPage;
