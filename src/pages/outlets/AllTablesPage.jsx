import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  createTable,
  fetchAllTables,
  mergeTable,
  splitTable,
  updateTable,
} from "../../redux/slices/tableSlice";
import { useQueryParams } from "../../hooks/useQueryParams";
import {
  Eye,
  FileText,
  History,
  Loader2,
  Merge,
  MoreVertical,
  Pencil,
  Plus,
  Receipt,
  ReceiptIndianRupee,
  Split,
} from "lucide-react";
import ActionMenu from "../../components/ActionMenu";
import TableModal from "../../partial/table/TableModal";
import { handleResponse } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { emitUpdateTable } from "../../socket/socketEmitters";
import { TABLE_MERGED, TABLE_UNMERGED } from "../../socket/socketEvents";
import StatusBadge from "../../layout/StatusBadge";
import TableStatusBadge from "../../partial/table/TableStatusBadge";
import TableCard from "../../partial/table/TableCard";
import TableCardSkeleton from "../../partial/table/TableCardSkeleton";
import NoDataFound from "../../layout/NoDataFound";

const isTableSelectableForMerge = (table) => {
  return (
    table.status === "available" &&
    table.is_mergeable === 1 &&
    !table.isMergedPrimary &&
    table.is_active === 1
  );
};

const AllTablesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    allTables,
    loading,
    isCreatingTable,
    isUpdatingTable,
    tableToSplitId,
  } = useSelector((state) => state.table);

  const { floorId, sectionId } = useQueryParams();
  const { outletId, isMergingTable } = useSelector((state) => state.auth);

  const [showTableModal, setShowTableModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  const [mergeMode, setMergeMode] = useState(false);
  const [selectedTables, setSelectedTables] = useState([]);

  const fetchTables = () => {
    dispatch(fetchAllTables(floorId));
  };

  useEffect(() => {
    fetchTables();
  }, [floorId]);

  const startMergeMode = () => {
    setMergeMode(true);
    setSelectedTable(null);
    setSelectedTables([]);
  };

  const cancelMergeMode = () => {
    setMergeMode(false);
    setSelectedTables([]);
  };

  const toggleTableSelection = (table) => {
    if (!mergeMode) return;

    if (!isTableSelectableForMerge(table)) return;

    setSelectedTables((prev) =>
      prev.includes(table.id)
        ? prev.filter((id) => id !== table.id)
        : [...prev, table.id],
    );
  };

  // Dynamic table shape rendering based on capacity
  const renderDynamicTableShape = (shape, status, capacity) => {
    const isBooked = status === "booked";
    const isOccupied = status === "occupied";
    const isRunning = status === "running"; // NEW

    let strokeColor, chairColor;

    if (isBooked) {
      strokeColor = "#c084fc";
      chairColor = "#e9d5ff";
    } else if (isOccupied) {
      strokeColor = "#fb923c";
      chairColor = "#fed7aa";
    } else if (isRunning) {
      // NEW
      strokeColor = "#38bdf8"; // sky blue
      chairColor = "#bae6fd";
    } else {
      // DEFAULT = GREEN (available)
      strokeColor = "#22c55e"; // green-500
      chairColor = "#bbf7d0"; // green-200
    }

    const chairWidth = 20;
    const chairHeight = 15;
    const chairRadius = 3;
    const strokeWidth = 2;
    const dashArray = "8,4";
    const tableStrokeWidth = 3;
    const tableDashArray = "10,5";

    if (shape === "round") {
      return renderRoundTable(
        capacity,
        strokeColor,
        chairColor,
        chairWidth,
        chairHeight,
        chairRadius,
        strokeWidth,
        dashArray,
        tableStrokeWidth,
        tableDashArray,
      );
    } else if (shape === "square") {
      return renderSquareTable(
        capacity,
        strokeColor,
        chairColor,
        chairWidth,
        chairHeight,
        chairRadius,
        strokeWidth,
        dashArray,
        tableStrokeWidth,
        tableDashArray,
      );
    } else if (shape === "rectangle") {
      return renderRectangleTable(
        capacity,
        strokeColor,
        chairColor,
        chairWidth,
        chairHeight,
        chairRadius,
        strokeWidth,
        dashArray,
        tableStrokeWidth,
        tableDashArray,
      );
    }
  };

  // Round table with dynamic chair placement
  const renderRoundTable = (
    capacity,
    strokeColor,
    chairColor,
    chairWidth,
    chairHeight,
    chairRadius,
    strokeWidth,
    dashArray,
    tableStrokeWidth,
    tableDashArray,
  ) => {
    const centerX = 100;
    const centerY = 100;
    const tableRadius = 50;
    const chairDistance = 75; // Distance from center to chair

    const chairs = [];
    for (let i = 0; i < capacity; i++) {
      const angle = (i * 360) / capacity - 90; // Start from top
      const angleRad = (angle * Math.PI) / 180;
      const chairX = centerX + chairDistance * Math.cos(angleRad);
      const chairY = centerY + chairDistance * Math.sin(angleRad);

      // Determine if chair should be horizontal or vertical
      const isVertical =
        (angle >= -45 && angle < 45) || (angle >= 135 && angle < 225);

      chairs.push(
        <rect
          key={i}
          x={chairX - (isVertical ? chairHeight / 2 : chairWidth / 2)}
          y={chairY - (isVertical ? chairWidth / 2 : chairHeight / 2)}
          width={isVertical ? chairHeight : chairWidth}
          height={isVertical ? chairWidth : chairHeight}
          rx={chairRadius}
          fill={chairColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
        />,
      );
    }

    return (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {chairs}
        <circle
          cx={centerX}
          cy={centerY}
          r={tableRadius}
          fill="white"
          stroke={strokeColor}
          strokeWidth={tableStrokeWidth}
          strokeDasharray={tableDashArray}
        />
      </svg>
    );
  };

  // Square table with dynamic chair placement
  const renderSquareTable = (
    capacity,
    strokeColor,
    chairColor,
    chairWidth,
    chairHeight,
    chairRadius,
    strokeWidth,
    dashArray,
    tableStrokeWidth,
    tableDashArray,
  ) => {
    const tableSize = 100;
    const tableX = 50;
    const tableY = 50;
    const chairGap = 15;

    const chairs = [];
    const chairsPerSide = Math.ceil(capacity / 4);

    // Top side
    const topChairs = Math.min(chairsPerSide, capacity);
    for (let i = 0; i < topChairs; i++) {
      const spacing = tableSize / (topChairs + 1);
      chairs.push(
        <rect
          key={`top-${i}`}
          x={tableX + spacing * (i + 1) - chairWidth / 2}
          y={tableY - chairGap - chairHeight}
          width={chairWidth}
          height={chairHeight}
          rx={chairRadius}
          fill={chairColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
        />,
      );
    }

    // Right side
    const rightChairs = Math.min(
      chairsPerSide,
      Math.max(0, capacity - topChairs),
    );
    for (let i = 0; i < rightChairs; i++) {
      const spacing = tableSize / (rightChairs + 1);
      chairs.push(
        <rect
          key={`right-${i}`}
          x={tableX + tableSize + chairGap}
          y={tableY + spacing * (i + 1) - chairWidth / 2}
          width={chairHeight}
          height={chairWidth}
          rx={chairRadius}
          fill={chairColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
        />,
      );
    }

    // Bottom side
    const bottomChairs = Math.min(
      chairsPerSide,
      Math.max(0, capacity - topChairs - rightChairs),
    );
    for (let i = 0; i < bottomChairs; i++) {
      const spacing = tableSize / (bottomChairs + 1);
      chairs.push(
        <rect
          key={`bottom-${i}`}
          x={tableX + spacing * (i + 1) - chairWidth / 2}
          y={tableY + tableSize + chairGap}
          width={chairWidth}
          height={chairHeight}
          rx={chairRadius}
          fill={chairColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
        />,
      );
    }

    // Left side
    const leftChairs = Math.max(
      0,
      capacity - topChairs - rightChairs - bottomChairs,
    );
    for (let i = 0; i < leftChairs; i++) {
      const spacing = tableSize / (leftChairs + 1);
      chairs.push(
        <rect
          key={`left-${i}`}
          x={tableX - chairGap - chairHeight}
          y={tableY + spacing * (i + 1) - chairWidth / 2}
          width={chairHeight}
          height={chairWidth}
          rx={chairRadius}
          fill={chairColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
        />,
      );
    }

    return (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {chairs}
        <rect
          x={tableX}
          y={tableY}
          width={tableSize}
          height={tableSize}
          rx={8}
          fill="white"
          stroke={strokeColor}
          strokeWidth={tableStrokeWidth}
          strokeDasharray={tableDashArray}
        />
      </svg>
    );
  };

  // Rectangle table with dynamic chair placement
  const renderRectangleTable = (
    capacity,
    strokeColor,
    chairColor,
    chairWidth,
    chairHeight,
    chairRadius,
    strokeWidth,
    dashArray,
    tableStrokeWidth,
    tableDashArray,
  ) => {
    const tableWidth = 120;
    const tableHeight = 80;
    const tableX = 40;
    const tableY = 60;
    const chairGap = 15;

    const chairs = [];

    // Calculate chairs per side based on capacity
    const longSideChairs = Math.ceil(capacity * 0.4); // 40% on long sides
    const shortSideChairs = Math.floor((capacity - longSideChairs * 2) / 2);

    // Top side (long)
    const topChairs = Math.min(longSideChairs, capacity);
    for (let i = 0; i < topChairs; i++) {
      const spacing = tableWidth / (topChairs + 1);
      chairs.push(
        <rect
          key={`top-${i}`}
          x={tableX + spacing * (i + 1) - chairWidth / 2}
          y={tableY - chairGap - chairHeight}
          width={chairWidth}
          height={chairHeight}
          rx={chairRadius}
          fill={chairColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
        />,
      );
    }

    // Right side (short)
    const rightChairs = Math.min(
      shortSideChairs,
      Math.max(0, capacity - topChairs),
    );
    for (let i = 0; i < rightChairs; i++) {
      const spacing = tableHeight / (rightChairs + 1);
      chairs.push(
        <rect
          key={`right-${i}`}
          x={tableX + tableWidth + chairGap}
          y={tableY + spacing * (i + 1) - chairWidth / 2}
          width={chairHeight}
          height={chairWidth}
          rx={chairRadius}
          fill={chairColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
        />,
      );
    }

    // Bottom side (long)
    const bottomChairs = Math.min(
      longSideChairs,
      Math.max(0, capacity - topChairs - rightChairs),
    );
    for (let i = 0; i < bottomChairs; i++) {
      const spacing = tableWidth / (bottomChairs + 1);
      chairs.push(
        <rect
          key={`bottom-${i}`}
          x={tableX + spacing * (i + 1) - chairWidth / 2}
          y={tableY + tableHeight + chairGap}
          width={chairWidth}
          height={chairHeight}
          rx={chairRadius}
          fill={chairColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
        />,
      );
    }

    // Left side (short)
    const leftChairs = Math.max(
      0,
      capacity - topChairs - rightChairs - bottomChairs,
    );
    for (let i = 0; i < leftChairs; i++) {
      const spacing = tableHeight / (leftChairs + 1);
      chairs.push(
        <rect
          key={`left-${i}`}
          x={tableX - chairGap - chairHeight}
          y={tableY + spacing * (i + 1) - chairWidth / 2}
          width={chairHeight}
          height={chairWidth}
          rx={chairRadius}
          fill={chairColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
        />,
      );
    }

    return (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {chairs}
        <rect
          x={tableX}
          y={tableY}
          width={tableWidth}
          height={tableHeight}
          rx={8}
          fill="white"
          stroke={strokeColor}
          strokeWidth={tableStrokeWidth}
          strokeDasharray={tableDashArray}
        />
      </svg>
    );
  };

  const actions = [
    ...(mergeMode
      ? []
      : [
          {
            label: "Add New Table",
            type: "primary",
            icon: Plus,
            onClick: () => setShowTableModal(true),
          },
        ]),

    {
      label: mergeMode ? "Cancel Merge" : "Merge Tables",
      icon: Merge,
      type: mergeMode ? "danger" : "info",
      onClick: mergeMode ? cancelMergeMode : startMergeMode,
    },
  ];

  const resetTableStates = () => {
    setShowTableModal(false);
    setSelectedTable(null);
  };

  const handleAddTable = async ({ id, values, resetForm }) => {
    const action = id ? updateTable({ id, values }) : createTable(values);
    await handleResponse(dispatch(action), () => {
      fetchTables();
      resetTableStates();
      resetForm();
    });
    console.log(values);
  };

  const handleMergeTables = async () => {
    if (selectedTables.length < 2) return;

    const [primaryTableId, ...otherTableIds] = selectedTables;

    emitUpdateTable(TABLE_MERGED, { tableId: primaryTableId }, (res) => {
      // if (res?.success) {
      //   fetchTables();
      // }
    });

    await handleResponse(
      dispatch(
        mergeTable({
          id: primaryTableId,
          values: { tableIds: otherTableIds },
        }),
      ),
      () => {
        cancelMergeMode();
        fetchTables();
      },
    );
  };

  const handleSplitTable = async (id) => {
    emitUpdateTable(TABLE_UNMERGED, { tableId: id }, (res) => {
      // if (res?.success) {
      //   fetchTables();
      // }
    });

    await handleResponse(dispatch(splitTable(id)), () => {
      fetchTables();
    });
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader title={"All Tables"} actions={actions} showBackButton />

        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <TableCardSkeleton key={i} />
            ))
          ) : allTables?.length > 0 ? (
            allTables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                mergeMode={mergeMode}
                selectedTables={selectedTables}
                toggleTableSelection={toggleTableSelection}
                isTableSelectableForMerge={isTableSelectableForMerge}
                renderDynamicTableShape={renderDynamicTableShape}
                handleSplitTable={handleSplitTable}
                onUpdate={(table) => {
                  (setSelectedTable(table), setShowTableModal(true));
                }}
              />
            ))
          ) : (
            <NoDataFound
              title="No Tables Found"
              description="Create a table to get started"
              className="col-span-full"
            />
          )}
        </div>

        {mergeMode && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg p-4 z-30">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              {/* LEFT CONTENT */}
              <div className="flex flex-col">
                {selectedTables.length === 0 && (
                  <span className="font-semibold text-gray-700">
                    Select tables to merge
                  </span>
                )}

                {selectedTables.length === 1 && (
                  <span className="font-semibold text-indigo-600">
                    Primary Table Selected • Choose another table
                  </span>
                )}

                {selectedTables.length >= 2 && (
                  <span className="font-semibold text-emerald-600">
                    Ready to Merge {selectedTables.length} Tables
                  </span>
                )}

                <span className="text-xs text-gray-500 mt-1">
                  Only available & mergeable tables can be selected
                </span>
              </div>

              {/* RIGHT ACTION */}
              <button
                onClick={handleMergeTables}
                disabled={selectedTables.length < 2 || isMergingTable}
                className="btn bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isMergingTable && <Loader2 className="h-4 w-4 animate-spin" />}
                {isMergingTable ? "Merging..." : "Confirm Merge"}
              </button>
            </div>
          </div>
        )}
      </div>

      <TableModal
        isOpen={showTableModal}
        onClose={resetTableStates}
        outletId={outletId}
        floorId={floorId}
        sectionId={sectionId}
        onSubmit={handleAddTable}
        table={selectedTable}
        loading={isCreatingTable || isUpdatingTable}
      />
    </>
  );
};

export default AllTablesPage;
