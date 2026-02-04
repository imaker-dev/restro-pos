import React, { useEffect } from 'react'
import PageHeader from '../../layout/PageHeader'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllTables } from '../../redux/slices/tableSlice';
import { useQueryParams } from '../../hooks/useQueryParams';
import SmartTable from '../../components/SmartTable';

const FloorAllTables = () => {
    const dispatch = useDispatch();
    const {floorId} = useQueryParams()

    const {allTables,loading} = useSelector((state) => state.table);
    console.log(allTables)
    useEffect(() => {
        dispatch(fetchAllTables(floorId))
    },[floorId])


    const columns = [
  {
    key: "table_number",
    label: "Table",
    render: (row) => (
      <span className="font-semibold text-slate-800">
        {row.table_number}
      </span>
    ),
  },

  {
    key: "section_name",
    label: "Section",
    render: (row) => (
      <span className="text-slate-600">
        {row.section_name}
      </span>
    ),
  },

  {
    key: "capacity",
    label: "Capacity",
    render: (row) => (
      <span className="text-slate-700">
        {row.capacity}
      </span>
    ),
  },

  {
    key: "shape",
    label: "Shape",
    render: (row) => (
      <span className="capitalize text-slate-600">
        {row.shape}
      </span>
    ),
  },

  {
    key: "guest_count",
    label: "Guests",
    render: (row) => (
      <span className="text-slate-700">
        {row.guest_count ?? 0}
      </span>
    ),
  },

  {
    key: "status",
    label: "Status",
    render: (row) => {
      const color =
        row.status === "occupied"
          ? "bg-rose-100 text-rose-700"
          : row.status === "reserved"
          ? "bg-amber-100 text-amber-700"
          : "bg-emerald-100 text-emerald-700";

      return (
        <span className={`px-2 py-1 text-xs rounded font-semibold ${color}`}>
          {row.status}
        </span>
      );
    },
  },

  {
    key: "merged",
    label: "Merged",
    render: (row) => (
      <span className="text-slate-600">
        {row.mergedTables?.length > 0
          ? row.mergedTables.map(m => m.merged_table_number).join(", ")
          : "-"}
      </span>
    ),
  },

  {
    key: "active",
    label: "Active",
    render: (row) => (
      <span
        className={`px-2 py-1 text-xs rounded font-semibold ${
          row.is_active
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {row.is_active ? "Yes" : "No"}
      </span>
    ),
  },
];


  return (
    <div className='space-y-6'>
      <PageHeader title={'All Tables'} showBackButton/>

      <SmartTable
              title="Tables"
              totalcount={allTables?.length}
              data={allTables}
              columns={columns}
            //   actions={rowActions}
              loading={loading}
            />
    </div>
  )
}

export default FloorAllTables
