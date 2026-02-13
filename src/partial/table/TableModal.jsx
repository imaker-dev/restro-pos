import React from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { InputField } from "../../components/fields/InputField";
import { SelectField } from "../../components/fields/SelectField";

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Table name is required")
    .min(2, "Too short")
    .max(50, "Too long"),

  tableNumber: Yup.string()
    .trim()
    .required("Table number is required")
    .max(10, "Too long"),

  capacity: Yup.number()
    .required("Capacity required")
    .min(1, "Minimum 1")
    .max(50, "Too large"),

  shape: Yup.string()
    .oneOf(["rectangle", "round", "square"])
    .required("Shape required"),

  status: Yup.string()
    .oneOf(["available", "occupied", "reserved"])
    .required("Status required"),
});

const TableModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  floorId,
  outletId,
  table, // edit mode object
}) => {
  const isEditMode = !!table;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      floorId: table?.floor_id ?? floorId ?? 0,
      outletId: table?.outlet_id ?? outletId ?? 0,
      name: table?.name || "",
      tableNumber: table?.table_number || "",
      capacity: table?.capacity ?? 1,
      shape: table?.shape || "rectangle",
      status: table?.status || "available",
    },

    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      const payload = {
        ...values,
        floorId: Number(values.floorId),
        outletId: Number(values.outletId),
        capacity: Number(values.capacity),
      };

      if (isEditMode) {
        await onSubmit({
          id: Number(table.id),
          values: payload,
          resetForm,
        });
      } else {
        await onSubmit({
          values: payload,
          resetForm,
        });
      }
    },
  });

  return (
    <ModalBasic
      id="table-modal"
      title={isEditMode ? "Update Table" : "Add Table"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-4 space-y-5"
      >
        {/* TABLE NAME */}
        <InputField
          label="Table Name"
          name="name"
          required
          placeholder="e.g. Window Table"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name}
        />

        {/* TABLE NUMBER */}
        <InputField
          label="Table Number"
          name="tableNumber"
          required
          placeholder="e.g. T1"
          value={formik.values.tableNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.tableNumber && formik.errors.tableNumber}
        />

        {/* CAPACITY */}
        <InputField
          label="Capacity"
          name="capacity"
          type="number"
          value={formik.values.capacity}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.capacity && formik.errors.capacity}
        />

        {/* SHAPE */}
        <SelectField
          label="Shape"
          name="shape"
          options={[
            { value: "rectangle", label: "Rectangle" },
            { value: "round", label: "Round" },
            { value: "square", label: "Square" },
          ]}
          value={formik.values.shape}
          onChange={formik.handleChange}
        />

        {/* STATUS */}
        {/* <SelectField
          label="Status"
          name="status"
          options={[
            { value: "available", label: "Available" },
            { value: "occupied", label: "Occupied" },
            { value: "reserved", label: "Reserved" },
          ]}
          value={formik.values.status}
          onChange={formik.handleChange}
        /> */}

        {/* FOOTER */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn border border-slate-200 text-slate-600 hover:bg-slate-50"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || !formik.isValid}
            className="btn bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading
              ? isEditMode
                ? "Updating..."
                : "Saving..."
              : isEditMode
                ? "Update"
                : "Save"}
          </button>
        </div>
      </form>
    </ModalBasic>
  );
};

export default TableModal;
