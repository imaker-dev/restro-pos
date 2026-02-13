import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { Edit2, Eye, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "../../hooks/useQueryParams";
import {
  createSection,
  fetchAllSection,
  updateSection,
} from "../../redux/slices/sectionSlice";
import SmartTable from "../../components/SmartTable";
import { formatDate } from "../../utils/dateFormatter";
import SectionModal from "../../partial/section/SectionModal";
import { handleResponse } from "../../utils/helpers";
import StatusBadge from "../../layout/StatusBadge";
import { useNavigate } from "react-router-dom";

const AllSectionsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { floorId } = useQueryParams();
  const { outletId } = useSelector((state) => state.auth);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  const { allSections, loading, isCreatingSections, isUpdatingSections } =
    useSelector((state) => state.section);

  const fetchSection = () => {
    dispatch(fetchAllSection(floorId));
  };

  useEffect(() => {
    fetchSection();
  }, [floorId]);

  const actions = [
    {
      label: "Add New Section",
      type: "primary",
      icon: Plus,
      onClick: () => setShowSectionModal(true),
    },
  ];

  const columns = [
    {
      key: "name",
      label: "Section",
      render: (row) => (
        <div className="flex items-start gap-3 max-w-[240px]">
          <div>
            <p className="font-semibold text-slate-900 leading-none">
              {row.name}
            </p>
            {row.description ? (
              <p
                title={row.description}
                className="text-xs text-slate-500 mt-1 line-clamp-2"
              >
                {row.description}
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1">No description</p>
            )}
          </div>
        </div>
      ),
    },

    {
      key: "code",
      label: "Code",
      render: (row) => (
        <span className="px-2.5 py-1 text-xs rounded-md bg-slate-100 text-slate-700 font-medium">
          {row.code || "—"}
        </span>
      ),
    },

    {
      key: "section_type",
      label: "Type",
      render: (row) => (
        <span className="px-2.5 py-1 text-xs rounded-md bg-indigo-50 text-indigo-600 font-medium capitalize">
          {row.section_type?.replace("_", " ") || "—"}
        </span>
      ),
    },

    {
      key: "display_order",
      label: "Order",
      render: (row) => (
        <span className="text-sm font-semibold text-slate-700">
          #{row.display_order ?? 0}
        </span>
      ),
    },

    {
      key: "table_count",
      label: "Tables",
      render: (row) => (
        <div className="flex flex-col leading-tight">
          <span className="text-base font-semibold text-slate-900">
            {row.table_count ?? 0}
          </span>
          <span className="text-[11px] text-slate-400">Total</span>
        </div>
      ),
    },

    {
      key: "is_active",
      label: "Status",
      render: (row) => <StatusBadge value={row.is_active} />,
    },

    {
      key: "updated_at",
      label: "Updated",
      render: (row) => (
        <span className="text-xs text-slate-500 whitespace-nowrap font-medium">
          {formatDate(row.updated_at, "longTime")}
        </span>
      ),
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) => navigate(`/floors/sections/tables?sectionId=${row.id}`),
    },
    {
      label: "Edit",
      icon: Edit2,
      onClick: (row) => {
        (setSelectedSection(row), setShowSectionModal(true));
      },
      color: "blue",
    },
  ];

  const resetSectionStates = () => {
    setShowSectionModal(false);
    setSelectedSection(null);
  };

  const handleAddSection = async ({ id, values, resetForm }) => {
    const action = id ? updateSection({ id, values }) : createSection(values);
    await handleResponse(dispatch(action), () => {
      fetchSection();
      resetSectionStates();
      resetForm();
    });
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader title={"Floor Sections"} actions={actions} showBackButton />

        <SmartTable
          title="Sections"
          totalcount={allSections?.length}
          data={allSections}
          columns={columns}
          actions={rowActions}
          loading={loading}
        />
      </div>

      <SectionModal
        isOpen={showSectionModal}
        onClose={resetSectionStates}
        onSubmit={handleAddSection}
        floorId={floorId}
        outletId={outletId}
        section={selectedSection}
        loading={isCreatingSections || isUpdatingSections}
      />
    </>
  );
};

export default AllSectionsPage;
