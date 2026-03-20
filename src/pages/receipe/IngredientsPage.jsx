import React, { useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { Edit3, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllIngredients } from "../../redux/slices/ingredientSlice";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber } from "../../utils/numberFormatter";
import SmartTable from "../../components/SmartTable";
import StatusBadge from "../../layout/StatusBadge";

const IngredientsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { outletId } = useSelector((state) => state.auth);
  const { allIngredients, isFetchingIngredients } = useSelector(
    (state) => state.ingredient,
  );

  const { ingredients, pagination } = allIngredients || {};

  useEffect(() => {
    if (!outletId) return;
    dispatch(fetchAllIngredients(outletId));
  }, [outletId]);

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
      key: "name",
      label: "Ingredient",
      sortable: true,
      render: (row) => (
        <div className="leading-tight max-w-[200px]">
          <div className="font-semibold text-slate-800 truncate">
            {row.name}
          </div>
          <div className="text-xs text-slate-500 truncate">
            {row.inventoryItemName} · {row.categoryName}
          </div>
        </div>
      ),
    },

    {
      key: "sku",
      label: "SKU",
      render: (row) => (
        <span className="text-sm text-slate-700">
          {row.inventoryItemSku || "—"}
        </span>
      ),
    },

    {
      key: "yield",
      label: "Yield / Wastage",
      sortable: true,
      render: (row) => (
        <div className="leading-tight">
          <div className="text-sm text-green-600 font-medium">
            Yield: {row.yieldPercentage}%
          </div>
          <div className="text-xs text-red-500">
            Waste: {row.wastagePercentage}%
          </div>
        </div>
      ),
    },

    {
      key: "recipes",
      label: "Used In",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-slate-700">
          {row.recipeCount || 0} recipes
        </span>
      ),
    },

    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (row) => (
        <div className="text-xs text-slate-500">
          {formatDate(row.createdAt, "long")}
        </div>
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

      <SmartTable
        title="Ingredients"
        totalcount={pagination?.total}
        data={ingredients}
        columns={columns}
        actions={rowActions}
        loading={isFetchingIngredients}
      />
    </div>
  );
};

export default IngredientsPage;
