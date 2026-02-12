import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  createAddonGroup,
  fetchAllAddonGroups,
  updateAddonGroup,
} from "../../redux/slices/addonSlice";
import { useQueryParams } from "../../hooks/useQueryParams";
import SmartTable from "../../components/SmartTable";
import { Edit2, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatter";
import AddonGroupModal from "../../partial/addons/AddonGroupModal";
import { handleResponse } from "../../utils/helpers";

const AllAddonsGroup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { outletId } = useQueryParams();
  const fetchGroups = () => {
    dispatch(fetchAllAddonGroups(outletId));
  };

  const [showAddonGroup, setShowAddonGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, [outletId]);

  const {
    allAddonGroups,
    loading,
    isCreatingAddonGroup,
    isUpdatingAddonGroup,
  } = useSelector((state) => state.addon);

  const columns = [
    {
      key: "name",
      label: "Group Name",
      render: (row) => (
        <div className="max-w-[260px]">
          <p className="font-medium text-slate-800">{row.name}</p>
          {row.description && (
            <p
              title={row.description}
              className="text-xs text-slate-500 line-clamp-2"
            >
              {row.description}
            </p>
          )}
        </div>
      ),
    },

    {
      key: "selection_type",
      label: "Selection",
      render: (row) => (
        <span
          className={`px-2.5 py-1 text-xs rounded-md font-medium
        ${
          row.selection_type === "single"
            ? "bg-blue-100 text-blue-700"
            : "bg-emerald-100 text-emerald-700"
        }`}
        >
          {row.selection_type === "single"
            ? "Single Choice"
            : "Multiple Choice"}
        </span>
      ),
    },

    {
      key: "range",
      label: "Min / Max",
      sortable: false,
      render: (row) =>
        row.selection_type === "multiple" ? (
          <span className="text-slate-600 font-medium">
            {row.min_selection} / {row.max_selection}
          </span>
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },

    {
      key: "is_required",
      label: "Required",
      render: (row) => (
        <span
          className={`px-2.5 py-1 text-xs rounded-md font-medium
        ${
          row.is_required
            ? "bg-rose-100 text-rose-700"
            : "bg-slate-100 text-slate-600"
        }`}
        >
          {row.is_required ? "Mandatory" : "Optional"}
        </span>
      ),
    },

    {
      key: "addon_count",
      label: "Addons",
      render: (row) => (
        <span className="font-semibold text-slate-800">
          {row.addon_count ?? 0}
        </span>
      ),
    },

    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <span
          className={`px-2.5 py-1 text-xs rounded-md font-medium
        ${
          row.is_active
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-700"
        }`}
        >
          {row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },

    {
      key: "updated_at",
      label: "Last Updated",
      render: (row) => (
        <span className="text-slate-500 whitespace-nowrap">
          {formatDate(row.updated_at, "longTime")}
        </span>
      ),
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      color: "slate",
      onClick: (row) =>
        navigate(`/outlets/addons-groups/addon?groupId=${row?.id}`),
    },
    {
      label: "Update",
      icon: Edit2,
      color: "blue",
      onClick: (row) => {
        (setSelectedGroup(row), setShowAddonGroup(true));
      },
    },
  ];

  const actions = [
    {
      label: "Add Addon Group",
      type: "primary",
      icon: Plus,
      onClick: () => setShowAddonGroup(true),
    },
  ];

  const resetAddonGroupStates = () => {
    setSelectedGroup(null);
    setShowAddonGroup(false);
  };

  const handleAddAddonGroup = async ({ id, values, resetForm }) => {
    const action = id
      ? updateAddonGroup({ id, values })
      : createAddonGroup(values);
    await handleResponse(dispatch(action), () => {
      resetAddonGroupStates();
      fetchGroups();
      resetForm();
    });
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="Addon Groups"
          description="Create, update, and manage groups of selectable add-ons for menu items."
          actions={actions}
          showBackButton
        />

        {/* Table */}
        <div>
          <SmartTable
            title="Addons Group"
            totalcount={allAddonGroups?.length}
            data={allAddonGroups}
            columns={columns}
            loading={loading}
            actions={rowActions}
          />
        </div>
      </div>

      <AddonGroupModal
        isOpen={showAddonGroup}
        onClose={resetAddonGroupStates}
        onSubmit={handleAddAddonGroup}
        addonGroup={selectedGroup}
        outletId={outletId}
        loading={isCreatingAddonGroup || isUpdatingAddonGroup}
      />
    </>
  );
};

export default AllAddonsGroup;
