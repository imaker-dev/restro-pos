import React, { useEffect } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import PageHeader from "../../layout/PageHeader";
import AccordionSection from "../../components/AccordionSection";

import { InputField } from "../../components/fields/InputField";
import { SelectField } from "../../components/fields/SelectField";
import { CheckboxField } from "../../components/fields/CheckboxField";

import {
  User,
  Shield,
  Building2,
  Plus,
  Trash2,
  User2,
  Mail,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { fetchAllOutlets } from "../../redux/slices/outletSlice";
import { fetchAllRoles } from "../../redux/slices/roleSlice";
import { fetchAllFloors } from "../../redux/slices/floorSlice";
import { fetchAllPermissions } from "../../redux/slices/permissionSlice";

const AddUserPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllOutlets());
    dispatch(fetchAllRoles());
    dispatch(fetchAllPermissions());
  }, [dispatch]);

  const { allOutlets } = useSelector((s) => s.outlet);
  const { allRoles } = useSelector((s) => s.role);
  const { allFloors } = useSelector((s) => s.floor);

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

    floors: [{ floorId: "", isPrimary: true }],

    permissions: [],
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    employeeCode: Yup.string().required(),
    password: Yup.string().min(6).required(),
    pin: Yup.string().length(4).required(),
    outletId: Yup.string().required(),
    roleId: Yup.string().required(),
  });

  const handleSubmit = (values) => {
    console.log(values);
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
              formik.setFieldValue("floors", [
                { floorId: "", isPrimary: true },
              ]);
            }
          }, [formik.values.outletId]);

          return (
            <Form className="space-y-8">
              {/* BASIC INFO */}
              <AccordionSection title="Basic Info" icon={User}>
                <div className="grid grid-cols-2 gap-6">
                  <InputField
                    label="Full Name"
                    name="name"
                    icon={User2}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                  <InputField
                    label="Email"
                    name="email"
                    icon={Mail}
                    value={formik.values.email}
                    onChange={formik.handleChange}
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
                <FieldArray name="floors">
                  {({ push, remove }) => (
                    <>
                      {formik.values.floors.map((floor, index) => (
                        <div key={index} className="flex gap-4 mb-3">
                          <SelectField
                            label="Floor"
                            name={`floors.${index}.floorId`}
                            options={allFloors?.map((f) => ({
                              value: f.id,
                              label: f.name,
                            }))}
                            value={floor.floorId}
                            onChange={formik.handleChange}
                          />

                          {formik.values.floors.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          push({ floorId: "", isPrimary: false })
                        }
                        className="btn"
                      >
                        <Plus className="w-4 h-4" /> Add Floor
                      </button>
                    </>
                  )}
                </FieldArray>
              </AccordionSection>

              {/* PERMISSIONS */}
              <AccordionSection title="Permissions" icon={Building2}>
                {grouped &&
                  Object.keys(grouped).map((category) => (
                    <div key={category} className="mb-6">
                      <h4 className="font-semibold capitalize mb-2">
                        {category}
                      </h4>

                      <div className="grid grid-cols-3 gap-3">
                        {grouped[category].map((perm) => (
                          <CheckboxField
                            key={perm.id}
                            label={perm.name}
                            checked={formik.values.permissions.includes(
                              perm.id,
                            )}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              let updated = [...formik.values.permissions];

                              if (checked) updated.push(perm.id);
                              else
                                updated = updated.filter(
                                  (id) => id !== perm.id,
                                );

                              formik.setFieldValue("permissions", updated);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
              </AccordionSection>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn bg-primary-500 text-white"
                >
                  Create Staff
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
