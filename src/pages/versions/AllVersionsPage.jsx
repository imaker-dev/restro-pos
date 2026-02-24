import React, { useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllVersions } from "../../redux/slices/versionSlice";
import {
  Apple,
  Calendar,
  Edit2,
  Eye,
  GitBranch,
  Laptop,
  Monitor,
  Plus,
  Smartphone,
  Tag,
  Terminal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SmartTable from "../../components/SmartTable";
import StatusBadge from "../../layout/StatusBadge";
import { formatDate } from "../../utils/dateFormatter";

const AllVersionsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allVersions, loading } = useSelector((state) => state.version);
  console.log(allVersions);
  useEffect(() => {
    dispatch(fetchAllVersions());
  }, []);

  const actions = [
    {
      label: "Add New Version",
      type: "primary",
      icon: Plus,
      onClick: () => navigate(`/versions/add`),
    },
  ];

  const columns = [
    /* ===============================
     VERSION
  =============================== */
    {
      key: "version",
      label: "Version",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col min-w-[180px]">
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold tracking-wide">
              v{row.version}
            </div>

            <span className="text-xs text-slate-400 font-medium">
              Build {row.build}
            </span>
          </div>

          <span className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider">
            {row.channel}
          </span>
        </div>
      ),
    },

    /* ===============================
     RELEASE SUMMARY
  =============================== */
    {
      key: "release_notes",
      label: "Release Summary",
      sortable: false,
      render: (row) => (
        <div className="max-w-[320px] space-y-1">
          <p className="text-sm text-slate-700 leading-snug line-clamp-2">
            {row.release_notes || "No release notes provided"}
          </p>

          <span className="text-xs text-slate-400">
            Released{" "}
            {row.released_at
              ? new Date(row.released_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "-"}
          </span>
        </div>
      ),
    },

    /* ===============================
     PLATFORM DISTRIBUTION
  =============================== */
    {
      key: "platforms",
      label: "Distribution",
      sortable: false,
      render: (row) => {
        const platforms = [
          { key: "android_url", label: "Android", icon: Smartphone },
          { key: "ios_url", label: "iOS", icon: Apple },
          { key: "windows_url", label: "Windows", icon: Monitor },
          { key: "mac_url", label: "macOS", icon: Laptop },
          { key: "linux_url", label: "Linux", icon: Terminal },
        ];

        return (
          <div className="flex items-center gap-2 flex-wrap">
            {platforms.map((platform, index) => {
              const Icon = platform.icon;
              const isAvailable = !!row[platform.key];

              return (
                <div
                  key={index}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
                  ${
                    isAvailable
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {platform.label}
                </div>
              );
            })}
          </div>
        );
      },
    },

    /* ===============================
     UPDATE POLICY
  =============================== */
    {
      key: "force_update",
      label: "Update Policy",
      sortable: true,
      render: (row) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full tracking-wide
          ${
            row.force_update
              ? "bg-rose-50 text-rose-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          {row.force_update ? "Mandatory" : "Optional"}
        </span>
      ),
    },

    /* ===============================
     STATUS
  =============================== */
    {
      key: "is_active",
      label: "Status",
      sortable: true,
      render: (row) => (
        <div>
          <StatusBadge value={row.is_active} />
        </div>
      ),
    },

    /* ===============================
     CREATED
  =============================== */
    {
      key: "updated_at",
      label: "Updated On",
      sortable: true,
      render: (row) => (
        <div className="text-sm text-slate-600 whitespace-nowrap">
          {formatDate(row.updated_at, "longTime")}
        </div>
      ),
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) => navigate(`/versions/details?versionId=${row.id}`),
    },
    {
      label: "Edit",
      icon: Edit2,
      color: "blue",
      onClick: (row) => navigate(`/versions/add?versionId=${row.id}`),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title={"All Versions"} actions={actions} />

      <SmartTable
        title="Versions"
        totalcount={allVersions?.length}
        data={allVersions}
        columns={columns}
        actions={rowActions}
        loading={loading}
      />
    </div>
  );
};

export default AllVersionsPage;
