import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { Edit3, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllIngredients } from "../../redux/slices/ingredientSlice";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber } from "../../utils/numberFormatter";
import SmartTable from "../../components/SmartTable";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import InventoryBadge from "../../partial/inventory/inventory/InventoryBadge";

const IngredientsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { outletId } = useSelector((state) => state.auth);
  const { allIngredients, isFetchingIngredients } = useSelector(
    (state) => state.ingredient,
  );
  const { ingredients, pagination } = allIngredients || {};

  useEffect(() => {
    if (!outletId) return;
    dispatch(
      fetchAllIngredients({
        outletId,
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      }),
    );
  }, [outletId, currentPage, itemsPerPage, searchTerm]);

  const actions = [
    {
      label: "Add New Ingredient",
      type: "primary",
      icon: Plus,
      onClick: () => navigate(`/ingredients/add`),
    },
  ];

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (row) => (
        <span className="text-[11px] font-bold text-slate-500 tabular-nums">
          #{row.id}
        </span>
      ),
    },

    {
      key: "item",
      label: "Item",
      sortValue: (row) => row.inventoryItemName,
      render: (row) => (
        <div className="flex flex-col min-w-0">
          <p className="text-xs font-extrabold text-slate-800 truncate">
            {row.inventoryItemName}
          </p>
          <p className="text-[11px] font-medium text-slate-500 truncate">
            {row.inventoryItemSku}
          </p>
        </div>
      ),
    },

    {
      key: "name",
      label: "Prepared Name",
      render: (row) => (
        <p className="text-xs font-semibold text-slate-700 truncate">
          {row.name}
        </p>
      ),
    },

    {
      key: "category",
      label: "Category",
      render: (row) => (
        <InventoryBadge type="category" value={row.categoryName} />
      ),
    },

    {
      key: "yield",
      label: "Yield / Wastage",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-bold text-slate-800">
            {row.yieldPercentage}%
          </span>
          <span className="text-[10px] text-red-500 font-medium">
            {row.wastagePercentage}% wastage
          </span>
        </div>
      ),
    },

    {
      key: "unit",
      label: "Unit",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-semibold text-slate-700">
            {row.unitName}
          </span>
          <span className="text-[10px] text-slate-400">
            {row.unitAbbreviation}
          </span>
        </div>
      ),
    },

    {
      key: "recipes",
      label: "Used In",
      render: (row) => (
        <span className="text-[12px] font-bold text-slate-800">
          {row.recipeCount} recipes
        </span>
      ),
    },

    {
      key: "notes",
      label: "Notes",
      render: (row) => (
        <p className="text-[10px] text-slate-500 truncate max-w-[200px]">
          {row.description || row.preparationNotes || "—"}
        </p>
      ),
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Edit3,
      color: "blue",
      onClick: (row) => navigate(`/ingredients/add?ingredientId=${row.id}`),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={"All Ingredient"} actions={actions} />
      <SearchBar onSearch={(v) => setSearchTerm(v)} />

      <SmartTable
        title="Ingredients"
        totalcount={pagination?.total}
        data={ingredients}
        columns={columns}
        actions={rowActions}
        loading={isFetchingIngredients}
      />

      <Pagination
        totalItems={pagination?.total}
        currentPage={currentPage}
        pageSize={itemsPerPage}
        totalPages={pagination?.totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        maxPageNumbers={5}
        showPageSizeSelector={true}
        onPageSizeChange={(size) => {
          setCurrentPage(1);
          setItemsPerPage(size);
        }}
      />
    </div>
  );
};

export default IngredientsPage;
