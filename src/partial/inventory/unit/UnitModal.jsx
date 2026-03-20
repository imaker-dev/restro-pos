import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import ModalBasic from "../../../components/ModalBasic";
import { InputField } from "../../../components/fields/InputField";
import { SelectField } from "../../../components/fields/SelectField";
import InfoCard from "../../../components/InfoCard";
import ToggleField from "../../../components/fields/ToggleField";

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Unit name is required")
    .min(1, "Too short")
    .max(50, "Too long"),

  abbreviation: Yup.string()
    .trim()
    .required("Abbreviation is required")
    .max(10, "Too long"),

  unitType: Yup.string().required("Unit type is required"),

  conversionFactor: Yup.number()
    .typeError("Must be a number")
    .positive("Must be positive")
    .required("Conversion factor is required"),

  isBaseUnit: Yup.boolean(),
});

const UnitModal = ({ isOpen, onClose, onSubmit, unit, loading = false }) => {
  const isEditMode = !!unit;

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: unit?.name || "",
      abbreviation: unit?.abbreviation || "",
      unitType: unit?.unitType || "",
      conversionFactor: unit?.conversionFactor || "",
      isBaseUnit: unit ? Boolean(unit.isBaseUnit) : false,
    },

    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      if (isEditMode) {
        await onSubmit({
          id: unit.id,
          values,
          resetForm,
        });
      } else {
        await onSubmit({
          values,
          resetForm,
        });
      }
    },
  });

  return (
    <ModalBasic
      id="unit-modal"
      title={isEditMode ? "Update Unit" : "Add Unit"}
      isOpen={isOpen}
      onClose={onClose}
    >
      {" "}
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-4 space-y-4"
      >
        <InputField
          label="Unit Name"
          name="name"
          required
          placeholder="Enter unit name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name}
        />

        <InputField
          label="Abbreviation"
          name="abbreviation"
          required
          placeholder="Eg: kg, g, qtl"
          value={formik.values.abbreviation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.abbreviation && formik.errors.abbreviation}
        />

        <SelectField
          label="Unit Type"
          name="unitType"
          required
          value={formik.values.unitType}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.unitType && formik.errors.unitType}
          options={[
            { label: "Weight", value: "weight" },
            { label: "Volume", value: "volume" },
            { label: "Count", value: "count" },
          ]}
        />

        <InputField
          label="Conversion Factor"
          name="conversionFactor"
          required
          placeholder="Enter conversion factor"
          type="number"
          value={formik.values.conversionFactor}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.conversionFactor && formik.errors.conversionFactor
          }
        />

        <ToggleField
          label="Base Unit"
          description="Base unit is the smallest measurement used for conversions."
          checked={formik.values.isBaseUnit}
          onChange={(value) => formik.setFieldValue("isBaseUnit", value)}
          activeColorClass="bg-emerald-600"
          inactiveColorClass="bg-red-600"
        />

        <InfoCard
          size="sm"
          type="info"
          title="Unit Conversion"
          description="Conversion factor defines how this unit converts to the base unit. Example: 1 Quintal = 100000 grams."
        />

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

export default UnitModal;
