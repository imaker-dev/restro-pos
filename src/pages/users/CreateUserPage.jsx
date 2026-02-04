import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPermissions } from "../../redux/slices/permissionSlice";
import { fetchAllRoles } from "../../redux/slices/roleSlice";
import { fetchAllSection } from "../../redux/slices/sectionSlice";
import { fetchAllOutlets } from "../../redux/slices/outletSlice";
import { fetchAllFloors } from "../../redux/slices/floorSlice";

const CreateUserPage = () => {
  const dispatch = useDispatch();
  const { allRoles } = useSelector((state) => state.role);
  const { allOutlets } = useSelector((state) => state.outlet);
  const { allFloors } = useSelector((state) => state.floor);
  const { allPermissions } = useSelector(
    (state) => state.permission || state.user,
  );
  const { grouped, permissions } = allPermissions || {};

  const { allSections } = useSelector((state) => state.section);
  const { loading, error } = useSelector((state) => state.user);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    pin: "",
    roleId: "",
    outletId: "",
    floorId: "",
    sectionId: "",
    permissions: [],
  });

  useEffect(() => {
    dispatch(fetchAllOutlets());
    dispatch(fetchAllPermissions());
    dispatch(fetchAllRoles());
    // dispatch(fetchAllSection());
    // dispatch(fetchAllFloors());
  }, [dispatch]);

  useEffect(() => {
    if (formData.outletId) {
      dispatch(fetchAllFloors(formData.outletId));

      setFormData((prev) => ({
        ...prev,
        floorId: "",
        sectionId: "",
      }));
    }
  }, [formData.outletId, dispatch]);

  useEffect(() => {
    if (formData.floorId) {
      dispatch(fetchAllSection(formData.floorId));

      setFormData((prev) => ({
        ...prev,
        sectionId: "",
      }));
    }
  }, [formData.floorId, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData((prev) => {
      const permissions = [...prev.permissions];
      const index = permissions.indexOf(permissionId);

      if (index === -1) {
        permissions.push(permissionId);
      } else {
        permissions.splice(index, 1);
      }

      return { ...prev, permissions };
    });
  };

  const handleSelectAllCategory = (category, checked) => {
    const categoryPermissions = grouped[category] || [];

    setFormData((prev) => {
      let updated = [...prev.permissions];

      categoryPermissions.forEach((p) => {
        const exists = updated.includes(p.id);

        if (checked && !exists) updated.push(p.id);
        if (!checked && exists) updated = updated.filter((id) => id !== p.id);
      });

      return { ...prev, permissions: updated };
    });
  };

  const handleSelectAll = (checked) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked ? permissions.map((p) => p.id) : [],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data for submission
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      pin: formData.pin,
      roleId: formData.roleId,
      outletId: formData.outletId,
      floorId: formData.floorId,
      sectionId: formData.sectionId,
      permissions: formData.permissions,
    };

    console.log(userData);
  };

  // Helper function to check if all permissions in a category are selected
  const isCategorySelected = (category) => {
    const categoryPermissions = grouped[category] || [];
    if (!categoryPermissions.length) return false;

    return categoryPermissions.every((p) =>
      formData.permissions.includes(p.id),
    );
  };

  // Helper function to check if some permissions in a category are selected
  const isCategoryPartiallySelected = (category) => {
    const categoryPermissions = grouped[category] || [];

    const selectedCount = categoryPermissions.filter((p) =>
      formData.permissions.includes(p.id),
    ).length;

    return selectedCount > 0 && selectedCount < categoryPermissions.length;
  };

  // Format category name for display
  const formatCategoryName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  console.log(allPermissions);

  return (
    <div>
      <PageHeader title={"Create User"} showBackButton/>

      <div className="container mx-auto px-4 py-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Full Name *
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email Address *
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password *
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="pin"
                >
                  PIN *
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="pin"
                  name="pin"
                  type="pin"
                  placeholder="Enter pin"
                  value={formData.pin}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="roleId"
                >
                  Role *
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="roleId"
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a role</option>
                  {allRoles?.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Location Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Outlet Selection */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="outletId"
                >
                  Outlet *
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="outletId"
                  name="outletId"
                  value={formData.outletId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select an outlet</option>
                  {allOutlets?.map((outlet) => (
                    <option key={outlet.id} value={outlet.id}>
                      {outlet.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Floor Selection (depends on outlet) */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="floorId"
                >
                  Floor
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="floorId"
                  name="floorId"
                  value={formData.floorId}
                  onChange={handleInputChange}
                  disabled={!formData.outletId}
                >
                  <option value="">Select a floor</option>
                  {allFloors?.map((floor) => (
                    <option key={floor?.id} value={floor?.id}>
                      {floor?.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Selection (depends on floor) */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="sectionId"
                >
                  Section
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="sectionId"
                  name="sectionId"
                  value={formData.sectionId}
                  onChange={handleInputChange}
                  disabled={!formData.floorId}
                >
                  <option value="">Select a section</option>
                  {allSections?.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Permissions</h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="select-all-permissions"
                  checked={
                    permissions?.length > 0 &&
                    permissions?.every((p) =>
                      formData.permissions?.includes(p.id),
                    )
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="select-all-permissions"
                  className="ml-2 block text-sm font-medium text-gray-900"
                >
                  Select All Permissions
                </label>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              {/* Permissions grouped by category */}
              {grouped &&
                Object.keys(grouped).map((category) => (
                  <div key={category} className="border-b last:border-b-0">
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-${category}`}
                          checked={isCategorySelected(category)}
                          ref={(input) => {
                            if (input) {
                              input.indeterminate =
                                isCategoryPartiallySelected(category);
                            }
                          }}
                          onChange={(e) =>
                            handleSelectAllCategory(category, e.target.checked)
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className="ml-2 block text-sm font-medium text-gray-900"
                        >
                          {formatCategoryName(category)}
                          <span className="text-xs text-gray-500 ml-2">
                            ({grouped[category]?.length || 0} permissions)
                          </span>
                        </label>
                      </div>
                      <span className="text-xs text-gray-500">
                        {grouped[category]?.filter((p) =>
                          formData.permissions.includes(p.id),
                        ).length || 0}
                      </span>
                    </div>

                    <div className="p-4 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {grouped[category]?.map((permission) => (
                          <div key={permission.id} className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                type="checkbox"
                                id={`permission-${permission.id}`}
                                checked={formData.permissions.includes(
                                  permission.id,
                                )}
                                onChange={() =>
                                  handlePermissionToggle(permission.id)
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3">
                              <label
                                htmlFor={`permission-${permission.id}`}
                                className="text-sm font-medium text-gray-900"
                              >
                                {permission.name}
                              </label>
                              <div className="text-xs text-gray-500 mt-1">
                                {permission.description && (
                                  <p className="mt-1 text-gray-600">
                                    {permission.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

              {/* Show message if no permissions available */}
              {(!grouped || Object.keys(grouped).length === 0) && (
                <div className="p-4 text-center text-gray-500">
                  No permissions available
                </div>
              )}
            </div>

            {/* Selected permissions summary */}
            {formData.permissions.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-blue-800">
                    {formData.permissions.length} permission
                    {formData.permissions.length !== 1 ? "s" : ""} selected
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, permissions: [] }))
                    }
                    className="ml-auto text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear all
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {Object.keys(grouped || {}).map((category) => {
                    const selectedInCategory =
                      grouped[category]?.filter((p) =>
                        formData.permissions.includes(p.id),
                      ) || [];

                    if (selectedInCategory.length === 0) return null;

                    return (
                      <span
                        key={category}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {formatCategoryName(category)}:{" "}
                        {selectedInCategory.length}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserPage;
