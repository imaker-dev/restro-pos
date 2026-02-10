import React, { useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTables } from "../../redux/slices/tableSlice";
import { useQueryParams } from "../../hooks/useQueryParams";
import SmartTable from "../../components/SmartTable";
import { Eye, MoreVertical, Pencil } from "lucide-react";
import ActionMenu from "../../components/ActionMenu";

const AllTablesPage = () => {
  const dispatch = useDispatch();
  const { floorId } = useQueryParams();

  const { allTables, loading } = useSelector((state) => state.table);

  useEffect(() => {
    dispatch(fetchAllTables(floorId));
  }, [floorId]);

  // Dynamic table shape rendering based on capacity
  const renderDynamicTableShape = (shape, status, capacity) => {
    const isBooked = status === "booked";
    const isOccupied = status === "occupied";

    let strokeColor, chairColor;
    if (isBooked) {
      strokeColor = "#c084fc";
      chairColor = "#e9d5ff";
    } else if (isOccupied) {
      strokeColor = "#fb923c";
      chairColor = "#fed7aa";
    } else {
      strokeColor = "#60a5fa";
      chairColor = "#bfdbfe";
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

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700";
      case "booked":
        return "bg-red-100 text-red-700";
      case "occupied":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title={"All Tables"} showBackButton />

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {allTables?.map((table) => (
          <div
            key={table.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
          >
            {/* Table Visualization - NOW WITH DYNAMIC CAPACITY */}
            <div className="bg-gray-50 p-6 flex items-center justify-center h-48">
              {renderDynamicTableShape(
                table.shape,
                table.status,
                table.capacity,
              )}
            </div>

            {/* Table Info */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Table {table.table_number}
                  </h3>
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-medium ${getStatusBadge(table.status)}`}
                  >
                    {table.status.charAt(0).toUpperCase() +
                      table.status.slice(1)}
                  </span>
                </div>

                {/* <ActionMenu
                  items={[
                    {
                      label: "View",
                      icon: Eye,
                      color: "blue",
                      onClick: () => console.log("View clicked"),
                    },
                    {
                      label: "Edit",
                      icon: Pencil,
                      color: "emerald",
                      onClick: () => console.log("Edit clicked"),
                    },
                  ]}
                /> */}
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <span>Floor : {table.floor_id}</span>

                <div className="mx-2 h-4 w-px bg-gray-300" />

                <span>{table.section_name}</span>

                <div className="mx-2 h-4 w-px bg-gray-300" />

                <span>Capacity : {table.capacity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllTablesPage;
