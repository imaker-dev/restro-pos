import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PageHeader from "../../layout/PageHeader";
import AccordionSection from "../../components/AccordionSection";

import { InputField } from "../../components/fields/InputField";
import { SelectField } from "../../components/fields/SelectField";

import { User, Shield, User2, Mail, Loader2 } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { fetchAllOutlets } from "../../redux/slices/outletSlice";
import { fetchAllRoles } from "../../redux/slices/roleSlice";
import { fetchAllFloors } from "../../redux/slices/floorSlice";
import { fetchAllPermissions } from "../../redux/slices/permissionSlice";
import { MultiSelectDropdownField } from "../../components/fields/MultiSelectDropdownField";
import { handleResponse } from "../../utils/helpers";
import { createUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const AddUserPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllOutlets());
    dispatch(fetchAllRoles());
    // dispatch(fetchAllPermissions());
  }, [dispatch]);

  const { isCreatingUser } = useSelector((state) => state.user);
  const { allOutlets } = useSelector((s) => s.outlet);
  const { allRoles } = useSelector((s) => s.role);
  const { allFloors, loading: fetchingAllFloors } = useSelector((s) => s.floor);

  const { allPermissions } = useSelector((state) => state.permission);
  const { grouped } = allPermissions || {};

  const initialValues = {
    name: "",
    email: "",
    employeeCode: "",
    password: "",
    pin: "",
    isActive: true,

    outletId: "",
    roleId: "",

    floors: [],

    permissions: [],
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    employeeCode: Yup.string().required(),
    password: Yup.string().min(6).required(),
    pin: Yup.string()
      .matches(/^\d{4}$/, "PIN must be 4 digits")
      .required("PIN required"),

    outletId: Yup.string().required(),
    roleId: Yup.string().required(),
    // floors: Yup.array().min(1, "Select at least one floor"),
  });

  const handleSubmit = async (values) => {
    const payload = {
      name: values.name,
      email: values.email,
      employeeCode: values.employeeCode,
      password: values.password,
      pin: values.pin,
      isActive: values.isActive,

      roles: [
        {
          roleId: values.roleId,
          outletId: values.outletId,
        },
      ],

      floors: values.floors.map((floorId, index) => ({
        floorId,
        outletId: values.outletId,
        isPrimary: index === 0, // first selected floor = primary
      })),
    };

    console.log("FINAL PAYLOAD:", payload);
    await handleResponse(dispatch(createUser(payload)), () => {
      navigate("/users");
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Staff Member" showBackButton />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => {
          // FLOOR API CALL ON OUTLET CHANGE
          useEffect(() => {
            if (formik.values.outletId) {
              dispatch(fetchAllFloors(formik.values.outletId));
              formik.setFieldValue("floors", []);
            }
          }, [formik.values.outletId]);

          return (
            <Form className="space-y-8" autoComplete="off">
              {/* BASIC INFO */}
              {/* BASIC INFO */}
              <AccordionSection title="Basic Info" icon={User}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* NAME */}
                  <InputField
                    label="Full Name"
                    name="name"
                    placeholder="Enter Full Name"
                    icon={User2}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && formik.errors.name}
                  />

                  {/* EMAIL */}
                  <InputField
                    label="Email"
                    name="email"
                    placeholder="Enter Email Address"
                    type="email"
                    icon={Mail}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && formik.errors.email}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* EMPLOYEE CODE */}
                  <InputField
                    label="Employee Code"
                    name="employeeCode"
                    placeholder="EMP001"
                    value={formik.values.employeeCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.employeeCode && formik.errors.employeeCode
                    }
                  />

                  {/* PASSWORD */}
                  <InputField
                    label="Password"
                    name="password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && formik.errors.password}
                  />

                  {/* PIN */}
                  <InputField
                    label="PIN"
                    name="pin"
                    type="password"
                    placeholder="4 digit pin"
                    value={formik.values.pin}
                    onChange={(e) => {
                      // allow only digits & max 4
                      const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                      formik.setFieldValue("pin", val);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.pin && formik.errors.pin}
                  />
                </div>
              </AccordionSection>

              {/* ROLE + OUTLET + FLOORS */}
              <AccordionSection title="Access Control" icon={Shield}>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <SelectField
                    label="Outlet"
                    name="outletId"
                    options={allOutlets?.map((o) => ({
                      value: o.id,
                      label: o.name,
                    }))}
                    value={formik.values.outletId}
                    onChange={formik.handleChange}
                  />

                  <SelectField
                    label="Role"
                    name="roleId"
                    options={allRoles?.map((r) => ({
                      value: r.id,
                      label: r.name,
                    }))}
                    value={formik.values.roleId}
                    onChange={formik.handleChange}
                  />
                </div>

                {/* FLOORS */}
                <MultiSelectDropdownField
                  label="Floors"
                  name="floors"
                  options={allFloors?.map((f) => ({
                    id: f.id,
                    label: f.name,
                  }))}
                  value={formik.values.floors}
                  onChange={(val) => formik.setFieldValue("floors", val)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.floors && formik.errors.floors}
                  disabled={!formik.values.outletId}
                  disabledText={
                    !formik.values.outletId
                      ? "Please select an outlet first"
                      : "Floors unavailable"
                  }
                  loading={fetchingAllFloors}
                />
              </AccordionSection>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="btn bg-primary-500 text-white flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isCreatingUser ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Staff"
                  )}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddUserPage;
