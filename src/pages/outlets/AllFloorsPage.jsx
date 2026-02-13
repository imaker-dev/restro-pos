import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  createFloor,
  fetchAllFloors,
  updateFloor,
} from "../../redux/slices/floorSlice";
import SmartTable from "../../components/SmartTable";
import { Edit2, Edit3, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FloorModal from "../../partial/floor/FloorModal";
import { handleResponse } from "../../utils/helpers";
import { formatDate } from "../../utils/dateFormatter";
import StatusBadge from "../../layout/StatusBadge";

const AllFloorsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { outletId } = useSelector((state) => state.auth);
  const { allFloors, loading, isCreatingFloor, isUpdatingFloor } = useSelector(
    (state) => state.floor,
  );

  const [showFloorModal, setShowFloorModal] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);

  const fetchFloors = () => {
    dispatch(fetchAllFloors(outletId));
  };

  useEffect(() => {
    fetchFloors();
  }, [outletId]);

  const columns = [
    {
      key: "name",
      label: "Floor",
      render: (row) => (
        <div className="max-w-[280px]">
          <p className="font-semibold text-slate-900 tracking-tight">
            {row.name}
          </p>
          {row.description && (
            <p
              title={row.description}
              className="text-xs text-slate-500 mt-0.5 line-clamp-2"
            >
              {row.description}
            </p>
          )}
        </div>
      ),
    },

    {
      key: "meta",
      label: "Info",
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
            #{row.floor_number}
          </span>
          <span className="px-2 py-0.5 rounded-md border border-slate-200 text-slate-600">
            {row.code}
          </span>
          <span className="px-2 py-0.5 rounded-md border border-slate-200 text-slate-500">
            Order {row.display_order}
          </span>
        </div>
      ),
    },

    {
      key: "tables",
      label: "Tables",
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-3 text-sm">
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-slate-900">
              {row.table_count ?? 0}
            </span>
            <span className="text-[11px] text-slate-400">Total</span>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          <div className="flex flex-col leading-tight">
            <span className="font-medium text-emerald-600">
              {row.available_count ?? 0}
            </span>
            <span className="text-[11px] text-slate-400">Free</span>
          </div>

          <div className="flex flex-col leading-tight">
            <span className="font-medium text-rose-600">
              {row.occupied_count ?? 0}
            </span>
            <span className="text-[11px] text-slate-400">Used</span>
          </div>
        </div>
      ),
    },

    {
      key: "is_active",
      label: "Status",
      render: (row) => <StatusBadge value={row.is_active} />,
    },

    {
      key: "updated_at",
      label: "Updated",
      render: (row) => (
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {formatDate(row.updated_at, "longTime")}
        </span>
      ),
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) => navigate(`/floors/sections?floorId=${row.id}`),
    },
    {
      label: "Edit",
      icon: Edit2,
      onClick: (row) => {
        (setSelectedFloor(row), setShowFloorModal(true));
      },
      color: "blue",
    },
  ];

  const resetFloorStates = () => {
    setShowFloorModal(false);
    setSelectedFloor(null);
  };

  const handleAddFloor = async ({ id, values, resetForm }) => {
    const action = id ? updateFloor({ id, values }) : createFloor(values);
    await handleResponse(dispatch(action), () => {
      fetchFloors();
      resetFloorStates();
      resetForm();
    });
  };

  const actions = [
    {
      label: "Add New Floor",
      type: "primary",
      icon: Plus,
      onClick: () => setShowFloorModal(true),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <PageHeader title={"All Floors"} actions={actions} />

        <SmartTable
          title="Floors"
          totalcount={allFloors?.length}
          data={allFloors}
          columns={columns}
          actions={rowActions}
          loading={loading}
        />
      </div>

      <FloorModal
        isOpen={showFloorModal}
        onClose={resetFloorStates}
        onSubmit={handleAddFloor}
        outletId={outletId}
        floor={selectedFloor}
        loading={isCreatingFloor || isUpdatingFloor}
      />
    </>
  );
};

export default AllFloorsPage;
