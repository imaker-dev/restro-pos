import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllItems,
  fetchAllItemsByCategory,
} from "../../redux/slices/itemSlice";
import { useQueryParams } from "../../hooks/useQueryParams";
import SmartTable from "../../components/SmartTable";
import { formatDate } from "../../utils/dateFormatter";
import { Edit2, Plus } from "lucide-react";
import LightboxMedia from "../../components/LightboxMedia";
import FoodTypeIcon from "../../partial/common/FoodTypeIcon";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../layout/StatusBadge";

const AllItemsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { outletId } = useSelector((state) => state.auth);
  const { categoryId } = useQueryParams();

  const { allItems, loading, isCreatingItem, isUpdatingItem } = useSelector(
    (state) => state.item,
  );

  const fetchItems = () => {
    if (categoryId) {
      dispatch(fetchAllItemsByCategory(categoryId));
    }
    if (outletId) {
      dispatch(fetchAllItems(outletId));
    }
  };

  useEffect(() => {
    fetchItems();
  }, [categoryId, outletId]);

  const columns = [
    {
      key: "name",
      label: "Item",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-md overflow-hidden bg-slate-100">
            <LightboxMedia
              src={row.image_url}
              alt={row.name}
              caption={row.name}
            />
          </div>
          <div className="flex items-center gap-1">
            <FoodTypeIcon type={row.item_type} />
            <span className="text-slate-700 font-medium">{row.name}</span>
          </div>
        </div>
      ),
    },

    !categoryId && {
      key: "category_name",
      label: "Category",
      sortable: true,
      render: (row) => (
        <span className="text-slate-700">{row.category_name}</span>
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
        <StatusBadge
          value={row.is_available}
          trueText="In Stock"
          falseText="Out"
        />
      ),
    },
  ];

  const rowActions = [
    {
      label: "Update",
      icon: Edit2,
      color: "blue",
      // onClick: (row) => navigate(`/items/add?itemId=${row.id}`)
    },
  ];

  const actions = [
    {
      label: "Add New Item",
      type: "primary",
      icon: Plus,
      onClick: () => navigate(`/items/add`),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <PageHeader title={"All Items"} actions={actions} />

        <SmartTable
          title="Items"
          totalcount={allItems?.length}
          data={allItems}
          columns={columns}
          actions={rowActions}
          loading={loading}
        />
      </div>
    </>
  );
};

export default AllItemsPage;
