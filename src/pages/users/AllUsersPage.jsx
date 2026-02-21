import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../redux/slices/userSlice";
import SmartTable from "../../components/SmartTable";
import { formatDate } from "../../utils/dateFormatter";
import UserAvatar from "../../components/UserAvatar";
import { Edit3, Eye, MapPin, Plus, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import StatusBadge from "../../layout/StatusBadge";
import AssignStationToUserModal from "../../partial/user/AssignStationToUserModal";
import { handleResponse } from "../../utils/helpers";
import {
  assignStationToUser,
  removeStationFromUser,
} from "../../redux/slices/stationSlice";
import RemoveStationFromUserModal from "../../partial/user/RemoveStationFromUserModal";
import Pagination from "../../components/Pagination";

const AllUsersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAssginStationModal, setShowAssignStationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(false);
  const [showRemoveStationModal, setShowRemoveStationModal] = useState(false);
  const { outletId } = useSelector((state) => state.auth);
  const { allUsers, loading } = useSelector((state) => state.user);
  const { isAssigningStationToUser, isRemovingStationToUser } = useSelector(
    (state) => state.station,
  );

  const { data, pagination } = allUsers || {};
  const fetchUsers = () => {
    dispatch(
      fetchAllUsers({
        search: searchTerm,
        page: currentPage,
        limit: itemsPerPage,
      }),
    );
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, currentPage, itemsPerPage]);

  const clearUserStates = () => {
    setShowAssignStationModal(false);
    setShowRemoveStationModal(false);
    setSelectedUser(null);
  };

  const columns = [
    {
      key: "employee",
      label: "Employee",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3 max-w-[240px]">
          <UserAvatar name={row.name} src={row.avatarUrl} className="w-9 h-9" />

          <div className="flex flex-col min-w-0">
            <span className="text-slate-800 font-semibold truncate">
              {row.name}
            </span>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{row.employeeCode}</span>
              {row.isVerified && (
                <span className="text-emerald-600 font-medium">• Verified</span>
              )}
            </div>
          </div>
        </div>
      ),
    },

    {
      key: "contact",
      label: "Contact",
      sortable: false,
      render: (row) => (
        <div className="flex flex-col max-w-[220px]">
          <span className="text-sm text-slate-600 truncate">
            {row.email || "No Email"}
          </span>
          <span className="text-xs text-slate-400 truncate">
            {row.phone || "No Phone"}
          </span>
        </div>
      ),
    },

    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (row) => {
        const role = row.roles?.[0] || "—";
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
            {role}
          </span>
        );
      },
    },

    {
      key: "station",
      label: "Station",
      sortable: false,
      render: (row) => {
        const station = row.station;

        if (!station) {
          return (
            <span className="text-slate-400 text-sm italic">Not Assigned</span>
          );
        }

        return (
          <div className="flex flex-col max-w-[200px]">
            <span className="text-sm font-medium text-slate-700 truncate">
              {station.stationName}
            </span>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono">{station.stationCode}</span>

              {station.isPrimary && (
                <span className="text-amber-600 font-medium">• Primary</span>
              )}
            </div>
          </div>
        );
      },
    },

    {
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (row) => <StatusBadge value={row.isActive} />,
    },

    {
      key: "lastLoginAt",
      label: "Last Login",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-slate-600">
          {row.lastLoginAt ? formatDate(row.lastLoginAt, "longTime") : "Never"}
        </span>
      ),
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) => navigate(`/users/details?userId=${row.id}`),
    },

    {
      label: "Edit",
      icon: Edit3,
      color: "blue",
      onClick: (row) => navigate(`/users/add?userId=${row.id}`),
    },

    {
      label: "Assign Station",
      icon: MapPin,
      color: "green",
      disabled: (row) => !!row.station,
      onClick: (row) => {
        setShowAssignStationModal(true);
        setSelectedUser(row);
      },
    },

    {
      label: "Remove Station",
      icon: XCircle,
      color: "red",
      disabled: (row) => !row.station,
      onClick: (row) => {
        setShowRemoveStationModal(true);
        setSelectedUser(row);
      },
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

  const handleAssignStation = async ({ userId, values, resetForm }) => {
    await handleResponse(
      dispatch(assignStationToUser({ userId, values })),
      () => {
        fetchUsers();
        clearUserStates();
        resetForm();
      },
    );
  };

  const handleRemoveStation = async ({ userId, stationId }) => {
    await handleResponse(
      dispatch(removeStationFromUser({ userId, stationId })),
      () => {
        fetchUsers();
        clearUserStates();
      },
    );
  };

  return (
    <>
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
            data={data}
            columns={columns}
            actions={rowActions}
            loading={loading}
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
      </div>
      <AssignStationToUserModal
        isOpen={showAssginStationModal}
        onClose={clearUserStates}
        user={selectedUser}
        onSubmit={handleAssignStation}
        outletId={outletId}
        loading={isAssigningStationToUser}
      />

      <RemoveStationFromUserModal
        isOpen={showRemoveStationModal}
        onClose={clearUserStates}
        user={selectedUser}
        onSubmit={handleRemoveStation}
        loading={isRemovingStationToUser}
      />
    </>
  );
};

export default AllUsersPage;
