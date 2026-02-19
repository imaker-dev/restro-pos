import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  createPrinter,
  fetchAllPrinters,
  updatePrinter,
} from "../../redux/slices/printerSlice";
import SmartTable from "../../components/SmartTable";
import StatusBadge from "../../layout/StatusBadge";
import { formatDate } from "../../utils/dateFormatter";
import { Edit2, Plus } from "lucide-react";
import PrinterModal from "../../partial/printers/PrinterModal";
import { handleResponse } from "../../utils/helpers";
import { fetchAllStations } from "../../redux/slices/stationSlice";

const AllPrintersPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { allPrinters, loading } = useSelector((state) => state.printer);
  const { allStations } = useSelector((state) => state.station);

  const [showPrinterModal, setShowPrinterModal] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState(null);

  const fetchPrinters = () => {
    dispatch(fetchAllPrinters(outletId));
  };
  useEffect(() => {
    if (outletId) {
      fetchPrinters();
    }
    if (!allStations) {
      dispatch(fetchAllStations(outletId));
    }
  }, [outletId]);

  const columns = [
    {
      key: "name",
      label: "Printer",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col max-w-[220px]">
          <span className="font-semibold text-slate-800 truncate">
            {row.name}
          </span>
          {row.ip_address && (
            <span className="text-xs text-slate-400">
              {row.ip_address}:{row.port}
            </span>
          )}
        </div>
      ),
    },

    {
      key: "ip_address",
      label: "IP Address",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-slate-700 font-mono">
          {row.ip_address || "—"}
        </span>
      ),
    },

    {
      key: "port",
      label: "Port",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-slate-600">{row.port}</span>
      ),
    },

    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (row) => (
        <span className="px-2 py-1 text-xs rounded bg-indigo-50 text-indigo-700 font-medium capitalize">
          {row.type || "Network"}
        </span>
      ),
    },

    {
      key: "station",
      label: "Assigned Station",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-slate-700">
          {row.station || "Unassigned"}
        </span>
      ),
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
        (setSelectedPrinter(row), setShowPrinterModal(true));
      },
    },
  ];

  const actions = [
    {
      label: "Add Printer",
      type: "primary",
      icon: Plus,
      onClick: () => setShowPrinterModal(true),
    },
  ];

  const clearPrinterStates = () => {
    setShowPrinterModal(false);
    setSelectedPrinter(null);
  };

  const handleAddPrinter = async ({ id, values, resetForm }) => {
    console.log(values);
    const action = id ? updatePrinter({ id, values }) : createPrinter(values);

    // await handleResponse(dispatch(action), () => {
    //   clearPrinterStates();
    //   fetchPrinters();
    // });
  };
  return (
    <>
      <div className="space-y-6">
        <PageHeader title={"All Printers"} actions={actions} />

        <SmartTable
          title="Printers"
          totalcount={allPrinters?.length}
          data={allPrinters}
          columns={columns}
          actions={rowActions}
          loading={loading}
        />
      </div>
      <PrinterModal
        isOpen={showPrinterModal}
        onClose={clearPrinterStates}
        onSubmit={handleAddPrinter}
        printer={selectedPrinter}
        stations={allStations}
        loading={false}
      />
    </>
  );
};

export default AllPrintersPage;
