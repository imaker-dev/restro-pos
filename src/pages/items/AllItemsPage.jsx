import React, { useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllItemsByCategory } from "../../redux/slices/itemSlice";
import { useQueryParams } from "../../hooks/useQueryParams";
import SmartTable from "../../components/SmartTable";
import { formatDate } from "../../utils/dateFormatter";

const AllItemsPage = () => {
  const dispatch = useDispatch();
  const { categoryId } = useQueryParams();
  const { allItems, loading } = useSelector((state) => state.item);
  console.log(allItems);

  useEffect(() => {
    dispatch(fetchAllItemsByCategory(categoryId));
  }, [categoryId]);

  const columns = [
    {
      key: "image_url",
      label: "Image",
      sortable: false,
      render: (row) => (
        <div className="h-10 w-10 rounded-md overflow-hidden bg-slate-100">
          {row.image_url ? (
            <img
              src={row.image_url}
              alt={row.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-slate-400">
              N/A
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Item Name",
      sortable: true,
      render: (row) => (
        <span className="text-slate-700 font-medium">{row.name}</span>
      ),
    },

    {
      key: "category_name",
      label: "Category",
      sortable: true,
      render: (row) => (
        <span className="text-slate-700">{row.category_name}</span>
      ),
    },
    {
      key: "item_type",
      label: "Type",
      sortable: true,
      render: (row) => (
        <span className="px-2 py-1 rounded text-xs font-semibold bg-emerald-100 text-emerald-700">
          {row.item_type?.toUpperCase()}
        </span>
      ),
    },
    {
      key: "base_price",
      label: "Price",
      sortable: true,
      render: (row) => (
        <span className="text-slate-700 font-medium">₹{row.base_price}</span>
      ),
    },
    {
      key: "tax_rate",
      label: "Tax %",
      sortable: true,
      render: (row) => <span className="text-slate-600">{row.tax_rate}%</span>,
    },
    {
      key: "preparation_time_mins",
      label: "Prep Time",
      sortable: true,
      render: (row) => (
        <span className="text-slate-600">{row.preparation_time_mins} mins</span>
      ),
    },
    {
      key: "has_variants",
      label: "Variants",
      sortable: true,
      render: (row) => (
        <span className="text-slate-700">
          {row.has_variants ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "is_bestseller",
      label: "Bestseller",
      sortable: true,
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            row.is_bestseller
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {row.is_bestseller ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "is_available",
      label: "Available",
      sortable: true,
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            row.is_available
              ? "bg-blue-100 text-blue-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {row.is_available ? "In Stock" : "Out"}
        </span>
      ),
    },
  ];

  

  return (
    <div className="space-y-6">
      <PageHeader title={"All Items"} showBackButton />

      <SmartTable
        title="Items"
        totalcount={allItems?.length}
        data={allItems}
        columns={columns}
        // actions={rowActions}
        loading={loading}
      />
    </div>
  );
};

export default AllItemsPage;
