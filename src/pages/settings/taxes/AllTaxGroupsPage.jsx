import React, { useEffect } from "react";
import PageHeader from "../../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTaxGroups } from "../../../redux/slices/taxSlice";
import SmartTable from "../../../components/SmartTable";
import { formatDate } from "../../../utils/dateFormatter";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AllTaxGroupsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllTaxGroups());
  }, []);

  const { allTaxGroup, loading } = useSelector((state) => state.tax);

  const columns = [
    {
      key: "name",
      label: "Tax Name",
      sortable: true,
      render: (row) => (
        <span className="text-slate-700 font-medium">{row?.name}</span>
      ),
    },
    {
      key: "code",
      label: "Code",
      sortable: true,
      render: (row) => (
        <span className="text-slate-600 uppercase">{row?.code}</span>
      ),
    },
    {
      key: "total_rate",
      label: "Rate",
      sortable: true,
      render: (row) => (
        <span className="text-slate-700 font-medium">{row?.total_rate}%</span>
      ),
    },
    {
      key: "is_inclusive",
      label: "Type",
      sortable: true,
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-md text-xs font-medium ${
            row?.is_inclusive
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {row?.is_inclusive ? "Inclusive" : "Exclusive"}
        </span>
      ),
    },
    {
      key: "components",
      label: "Components",
      sortable: false,
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row?.components.map((comp) => (
            <span
              key={comp?.id}
              className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
            >
              {comp?.name} ({comp?.rate}%)
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      sortable: true,
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-md text-xs font-medium ${
            row?.is_active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row?.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: "View",
      icon: Eye,
      color: "slate",
      onClick: (row) => navigate(`/settings/tax-types/tax?groupId=${row?.id}`),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={"All Tax Groups"} showBackButton />

      <SmartTable
        title="All Tax groups"
        totalcount={allTaxGroup?.length ?? 0}
        data={allTaxGroup}
        columns={columns}
        actions={actions}
        loading={loading}
      />
    </div>
  );
};

export default AllTaxGroupsPage;
