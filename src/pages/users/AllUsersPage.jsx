import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../redux/slices/userSlice";
import SmartTable from "../../components/SmartTable";
import { formatDate } from "../../utils/dateFormatter";
import UserAvatar from "../../components/UserAvatar";
import { Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import StatusBadge from "../../layout/StatusBadge";

const AllUsersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const { allUsers, loading } = useSelector((state) => state.user);

  const fetchUsers = () => {
    dispatch(fetchAllUsers({ search: searchTerm }));
  };
  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const columns = [
    // {
    //   key: "employeeCode",
    //   label: "Employee Code",
    //   sortable: true,
    //   render: (row) => (
    //     <span
    //       className="text-slate-700 font-medium truncate max-w-[120px] block"
    //       title={row.employeeCode}
    //     >
    //       {row.employeeCode}
    //     </span>
    //   ),
    // },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (row) => {
        return (
          <div className="flex items-center gap-2 max-w-[220px]">
            <UserAvatar name={row.name} className="w-8 h-8" />
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
      key: "email",
      label: "Email",
      sortable: true,
      render: (row) => {
        const email = row?.email?.trim?.();

        return (
          <span
            className={`truncate max-w-[180px] block ${
              email ? "text-slate-600" : "text-slate-400 italic"
            }`}
            title={email || "Not Available"}
          >
            {email || "Not Available"}
          </span>
        );
      },
    },
    {
      key: "phone",
      label: "Phone",
      sortable: true,
      render: (row) => {
        const phone = row?.phone?.trim?.();

        return (
          <span
            className={`truncate max-w-[140px] block ${
              phone ? "text-slate-600" : "text-slate-400 italic"
            }`}
            title={phone || "Not Available"}
          >
            {phone || "Not Available"}
          </span>
        );
      },
    },

    {
      key: "roles",
      label: "Role",
      sortable: true,
      render: (row) => {
        const role = row.roles?.[0] || "—";
        return (
          <span
            className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 truncate max-w-[100px] inline-block"
            title={role}
          >
            {role}
          </span>
        );
      },
    },

    {
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (row) => (
        <StatusBadge value={row.isActive}/>
      ),
    },
    {
      key: "lastLoginAt",
      label: "Last Login",
      sortable: true,
      render: (row) => {
        return (
          <span className="text-sm text-slate-600 truncate max-w-[170px] block">
            {row.lastLoginAt
              ? formatDate(row.lastLoginAt, "longTime")
              : "Never"}
          </span>
        );
      },
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) => navigate(`/users/details?userId=${row.id}`),
    },
  ];

  const actions = [
    {
      label: "Add New User",
      type: "primary",
      icon: Plus,
      onClick: () => navigate(`/users/add`),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={"All Users"} actions={actions} />

      <div className="bg-white">
        {/* Header Section */}
        <div className="border-b border-slate-200">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              {/* Search Bar */}
              <SearchBar
                placeholder="Search employees..."
                // width="w-"
                onSearch={(value) => setSearchTerm(value)}
              />

              {/* Filter Dropdowns */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded text-sm bg-white hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                    <option>Warehouse</option>
                  </select>
                  {/* <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" /> */}
                </div>

                <div className="relative">
                  <select className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded text-sm bg-white hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                    <option>Store</option>
                  </select>
                  {/* <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" /> */}
                </div>

                <div className="relative">
                  <select className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded text-sm bg-white hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                    <option>Product</option>
                  </select>
                  {/* <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" /> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <SmartTable
          // title="Users"
          // totalcount={allUsers?.length}
          data={allUsers}
          columns={columns}
          actions={rowActions}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AllUsersPage;
