import {
  Eye,
  FileText,
  History,
  Pencil,
  ReceiptIndianRupee,
  Split,
} from "lucide-react";
import ActionMenu from "../../components/ActionMenu";
import StatusBadge from "../../layout/StatusBadge";
import TableStatusBadge from "./TableStatusBadge";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const TableCard = ({
  table,
  mergeMode,
  selectedTables,
  toggleTableSelection,
  isTableSelectableForMerge,
  renderDynamicTableShape,
  handleSplitTable,
  onUpdate,
}) => {
  const navigate = useNavigate();
  const { tableToSplitId } = useSelector((state) => state.table);

  return (
    <div
      key={table.id}
      onClick={() => toggleTableSelection(table)}
      className={`
                bg-white rounded-xl border overflow-hidden transition-all
                ${selectedTables.includes(table.id) ? "border-indigo-500 ring-2 ring-indigo-200" : "border-gray-200 hover:shadow-md"}
                ${table.isMergedPrimary ? "border-indigo-400" : ""}
                ${table.status === "merged" ? "border-amber-400 opacity-70" : ""}
                ${table.is_active !== 1 ? "opacity-60 grayscale" : ""}
                ${
                  mergeMode && !isTableSelectableForMerge(table)
                    ? "opacity-50 cursor-not-allowed"
                    : mergeMode
                      ? "cursor-pointer"
                      : ""
                }
              `}
    >
      {/* Table Visualization - NOW WITH DYNAMIC CAPACITY */}
      <div className="bg-gray-50 p-6 flex items-center justify-center h-48 relative">
        {renderDynamicTableShape(table.shape, table.status, table.capacity)}
        {mergeMode && selectedTables.includes(table.id) && (
          <span className="absolute bottom-2 right-2 text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded">
            Selected
          </span>
        )}
        {mergeMode && selectedTables[0] === table.id && (
          <span className="absolute top-2 right-2 text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded">
            Primary
          </span>
        )}
      </div>

      {/* Table Info */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {table.table_number}
            </h3>
            <p className="text-xs text-gray-500">{table.name}</p>
          </div>
          {!mergeMode && (
            <ActionMenu
              items={[
                ...(table.isMergedPrimary
                  ? [
                      {
                        label: "Unmerge",
                        icon: Split,
                        color: "rose",
                        onClick: () => handleSplitTable(table.id),
                      },
                    ]
                  : []),

                {
                  label: "Edit",
                  icon: Pencil,
                  color: "emerald",
                  onClick: () => onUpdate(table),
                },
                // {
                //   label: "History",
                //   icon: History,
                //   color: "amber",
                //   onClick: () =>
                //     navigate(
                //       `/floors/sections/tables/history?tableId=${table?.id}`,
                //     ),
                // },
                // {
                //   label: "Report",
                //   icon: FileText,
                //   color: "purple",
                //   onClick: () =>
                //     navigate(
                //       `/floors/sections/tables/report?tableId=${table?.id}`,
                //     ),
                // },
                // {
                //   label: "KOT",
                //   icon: ReceiptIndianRupee,
                //   color: "rose",
                //   onClick: () =>
                //     navigate(
                //       `/floors/sections/tables/kot?tableId=${table?.id}`,
                //     ),
                // },
              ]}
              loading={tableToSplitId === table.id}
            />
          )}
        </div>

        {/* BASIC INFO */}
        <div className="text-sm text-gray-600 space-y-1">
          <p>Floor : {table.floor_id}</p>
          <p>Section : {table.section_name}</p>
          <p>
            Capacity : {table.capacity} (Min {table.min_capacity})
          </p>
        </div>

        {/* FEATURES */}
        <div className="flex gap-2 mt-2 text-xs">
          <StatusBadge value={table.is_active === 1 ? true : false} />
          <TableStatusBadge status={table.status} />

          {table.is_mergeable === 1 && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
              Mergeable
            </span>
          )}

          {table.is_splittable === 1 && (
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
              Splittable
            </span>
          )}
        </div>

        {/* SESSION / ORDER INFO */}
        {table.session_id && (
          <div className="mt-3 text-xs text-gray-700 bg-gray-50 p-2 rounded">
            <p>Guest: {table.guest_name}</p>
            <p>Guests Count: {table.guest_count}</p>
            <p>Captain: {table.captain_name}</p>
            <p>Order #: {table.order_number}</p>
            <p>Total: ₹{table.total_amount}</p>
          </div>
        )}

        {table.isMergedPrimary && table.mergedTables?.length > 0 && (
          <div className="mt-3 text-xs bg-indigo-50 text-indigo-700 p-2 rounded">
            <p className="font-semibold mb-1">Merged With:</p>
            {table.mergedTables.map((mt) => (
              <p key={mt.merge_id}>
                {mt.merged_table_number} ({mt.merged_table_capacity} seats)
              </p>
            ))}
          </div>
        )}

        {table.status === "merged" && table.mergedInto && (
          <div className="mt-3 text-xs bg-amber-50 text-amber-700 p-2 rounded">
            <p>
              Merged Into <b>{table.mergedInto.primary_table_number}</b>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableCard;
