import React from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { InputField } from "../../components/fields/InputField";
import { CheckboxField } from "../../components/fields/CheckboxField";

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Station name is required")
    .min(2, "Too short")
    .max(50, "Too long"),

  code: Yup.string()
    .trim()
    .required("Station code is required")
    .min(2, "Too short")
    .max(20, "Too long"),

  description: Yup.string()
    .trim()
    .max(200, "Too long"),

  isActive: Yup.boolean(),
});

const StationModal = ({
  isOpen,
  onClose,
  onSubmit,
  station,
  outletId,
  loading = false,
}) => {
  const isEditMode = !!station;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      outletId: station?.outlet_id || outletId || "",
      name: station?.name || "",
      code: station?.code || "",
      description: station?.description || "",
      isActive: station ? Boolean(station.is_active) : true,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        ...values,
      };

      if (isEditMode) {
        await onSubmit({
          id: station.id,
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
      id="station-modal"
      title={isEditMode ? "Update Station" : "Add Station"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-4 space-y-4"
      >
        {/* Station Name */}
        <InputField
          label="Station Name"
          name="name"
          required
          placeholder="Enter station name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name}
          autoComplete="off"
        />

        {/* Station Code */}
        <InputField
          label="Station Code"
          name="code"
          required
          placeholder="Enter unique code (e.g., KITCHEN)"
          value={formik.values.code}
          onChange={(e) =>
            formik.setFieldValue(
              "code",
              e.target.value.toUpperCase()
            )
          }
          onBlur={formik.handleBlur}
          error={formik.touched.code && formik.errors.code}
          autoComplete="off"
        />

        {/* Description */}
        <InputField
          label="Description"
          name="description"
          placeholder="Enter description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.description &&
            formik.errors.description
          }
          autoComplete="off"
        />

        {/* Active Toggle */}
        <CheckboxField
          label="Enable Station"
          name="isActive"
          checked={formik.values.isActive}
          onChange={formik.handleChange}
        />

        {/* Footer Buttons */}
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
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
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

export default StationModal;
