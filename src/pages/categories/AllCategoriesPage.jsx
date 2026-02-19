import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useQueryParams } from "../../hooks/useQueryParams";
import {
  createCategory,
  fetchAllCategories,
  updateCategory,
} from "../../redux/slices/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import SmartTable from "../../components/SmartTable";
import { formatDate } from "../../utils/dateFormatter";
import { Edit2, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategoryModal from "../../partial/category/CategoryModal";
import { handleResponse } from "../../utils/helpers";
import StatusBadge from "../../layout/StatusBadge";
import ServiceTypeBadge from "../../partial/category/ServiceTypeBadge";
import LightboxMedia from "../../components/LightboxMedia";

const AllCategoriesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { outletId } = useSelector((state) => state.auth);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { allCategories, loading, isCreatingCategory, isUpdatingCategory } =
    useSelector((state) => state.category);

  const fetchCategories = () => {
    dispatch(fetchAllCategories(outletId));
  };
  useEffect(() => {
    fetchCategories();
  }, [outletId]);

  const columns = [
    {
      key: "name",
      label: "Category",
      sortable: true,
      render: (row) => {
        return (
          <div className="flex items-center gap-3 max-w-[240px]">
            {/* Image or Icon */}
            {row.image_url ? (
              <div className="h-10 w-10 rounded-md overflow-hidden bg-slate-100">
                <LightboxMedia
                  src={row.image_url}
                  alt={row.name}
                  caption={row.name}
                />
              </div>
            ) : (
              <div
                className="w-10 h-10 rounded flex items-center justify-center text-lg border border-slate-200"
                style={{ backgroundColor: row.color_code || "#eee" }}
              >
                {row.icon || "📦"}
              </div>
            )}

            <span
              className="text-slate-700 font-medium truncate"
              title={row.name}
            >
              {row.name}
            </span>
          </div>
        );
      },
    },

    {
      key: "service_type",
      label: "Service",
      sortable: true,
      render: (row) => <ServiceTypeBadge value={row.service_type} />,
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

    // ⭐ ITEM COUNT COLUMN
    {
      key: "item_count",
      label: "Items",
      sortable: true,
      render: (row) => (
        <span
          className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-700 font-semibold"
          title={`${row.item_count} items`}
        >
          {row.item_count}
        </span>
      ),
    },

    {
      key: "is_active",
      label: "Status",
      sortable: true,
      render: (row) => <StatusBadge value={row.is_active} />,
    },

    {
      key: "created_at",
      label: "Created",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-slate-600 truncate max-w-[160px] block">
          {row.created_at ? formatDate(row.created_at, "long") : "—"}
        </span>
      ),
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) => navigate(`/items?categoryId=${row.id}`),
    },
    {
      label: "Update",
      icon: Edit2,
      color: "blue",
      onClick: (row) => {
        (setSelectedCategory(row), setShowAddModal(true));
      },
    },
  ];

  const actions = [
    {
      label: "Add Category",
      type: "primary",
      icon: Plus,
      onClick: () => setShowAddModal(true),
    },
  ];

  const clearCategoryStates = () => {
    setSelectedCategory(null);
    setShowAddModal(false);
  };

  const handleUpdateCategory = async ({ id, values, resetForm }) => {
    const action = id ? updateCategory({ id, values }) : createCategory(values);
    await handleResponse(dispatch(action), () => {
      fetchCategories();
      clearCategoryStates();
      resetForm();
    });
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader title={"All Categories"} actions={actions} />

        <SmartTable
          title="Categories"
          totalcount={allCategories?.length}
          data={allCategories}
          columns={columns}
          actions={rowActions}
          loading={loading}
        />
      </div>

      <CategoryModal
        isOpen={showAddModal}
        onClose={clearCategoryStates}
        onSubmit={handleUpdateCategory}
        outletId={outletId}
        category={selectedCategory}
        loading={isCreatingCategory || isUpdatingCategory}
      />
    </>
  );
};

export default AllCategoriesPage;
