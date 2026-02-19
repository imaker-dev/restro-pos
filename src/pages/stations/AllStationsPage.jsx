import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  createStation,
  fetchAllStations,
  updateStation,
} from "../../redux/slices/stationSlice";
import StatusBadge from "../../layout/StatusBadge";
import SmartTable from "../../components/SmartTable";
import { formatDate } from "../../utils/dateFormatter";
import { Edit2, Plus } from "lucide-react";
import StationModal from "../../partial/station/StationModal";
import { handleResponse } from "../../utils/helpers";

const AllStationsPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { allStations, loading } = useSelector((state) => state.station);

  const [showStationModal, setShowStationModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    if (outletId) {
      dispatch(fetchAllStations(outletId));
    }
  }, [outletId]);

  const columns = [
    {
      key: "name",
      label: "Station",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col max-w-[220px]">
          <span className="font-semibold text-slate-800 truncate">
            {row.name}
          </span>
          <span className="text-xs text-slate-400">Code: {row.code}</span>
        </div>
      ),
    },

    {
      key: "station_type",
      label: "Type",
      sortable: true,
      render: (row) => (
        <span>{row.station_type}</span>
        // <StationTypeBadge value={row.station_type} />
      ),
    },

    {
      key: "description",
      label: "Description",
      sortable: false,
      render: (row) => {
        const desc = row?.description?.trim?.();

        return (
          <span
            className={`truncate max-w-[260px] block ${
              desc ? "text-slate-600" : "text-slate-400 italic"
            }`}
            title={desc || "No Description"}
          >
            {desc || "No Description"}
          </span>
        );
      },
    },

    {
      key: "is_active",
      label: "Status",
      sortable: true,
      render: (row) => (
        <StatusBadge
          value={Boolean(row.is_active)}
          trueText="Active"
          falseText="Inactive"
        />
      ),
    },

    {
      key: "updated_at",
      label: "Updated",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-slate-600 truncate max-w-[160px] block">
          {row.updated_at ? formatDate(row.updated_at, "long") : "—"}
        </span>
      ),
    },
  ];

  const rowActions = [
    {
      label: "Update",
      icon: Edit2,
      color: "blue",
      onClick: (row) => {
        (setSelectedStation(row), setShowStationModal(true));
      },
    },
  ];

  const actions = [
    {
      label: "Add Station",
      type: "primary",
      icon: Plus,
      onClick: () => setShowStationModal(true),
    },
  ];

  const clearStationStates = () => {
    setShowStationModal(false);
    setSelectedStation(null);
  };

  const handleAddStation = async ({ id, values, resetForm }) => {
    const action = id ? updateStation({ id, values }) : createStation(values);

    await handleResponse(dispatch(action), () => {
      fetchAllStations();
      clearStationStates();
    });
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader title={"All Stations"} actions={actions} />

        <SmartTable
          title="Stations"
          totalcount={allStations?.length}
          data={allStations}
          columns={columns}
          actions={rowActions}
          loading={loading}
        />
      </div>
      <StationModal
        isOpen={showStationModal}
        onClose={clearStationStates}
        station={selectedStation}
        onSubmit={handleAddStation}
        loading={false}
      />
    </>
  );
};

export default AllStationsPage;
