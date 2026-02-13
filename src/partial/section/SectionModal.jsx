import React from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { InputField } from "../../components/fields/InputField";
import { CheckboxField } from "../../components/fields/CheckboxField";
import { SECTION_TYPES } from "../../constants";

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Section name is required").max(50),
  code: Yup.string().max(20),
  sectionType: Yup.string().required("Section type is required"),
  description: Yup.string().max(255),
  displayOrder: Yup.number().integer().nullable(),
  isActive: Yup.boolean(),
});

const SECTION_TYPE_OPTIONS = [
  { value: SECTION_TYPES.DINE_IN, label: "Dine In" },
  { value: SECTION_TYPES.TAKEAWAY, label: "Takeaway" },
  { value: SECTION_TYPES.DELIVERY, label: "Delivery" },
  { value: SECTION_TYPES.BAR, label: "Bar" },
  { value: SECTION_TYPES.ROOFTOP, label: "Rooftop" },
  { value: SECTION_TYPES.PRIVATE, label: "Private Dining" },
  { value: SECTION_TYPES.OUTDOOR, label: "Outdoor" },
  { value: SECTION_TYPES.AC, label: "AC Section" },
  { value: SECTION_TYPES.NON_AC, label: "Non-AC Section" },
];

const SectionModal = ({
  isOpen,
  onClose,
  onSubmit,
  section,
  outletId,
  floorId,
  loading = false,
}) => {
  const isEditMode = !!section;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      outletId: section?.outlet_id || outletId,
      floorId: section?.floor_id || floorId,
      name: section?.name || "",
      code: section?.code || "",
      sectionType: section?.section_type || "",
      description: section?.description || "",
      colorCode: section?.color_code || "#3B82F6",
      displayOrder: section?.display_order ?? "",
      isActive: section ? Boolean(section.is_active) : true,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        ...values,
        displayOrder:
          values.displayOrder === "" ? null : Number(values.displayOrder),
      };

      if (isEditMode) {
        await onSubmit({ id: section.id, values: payload, resetForm });
      } else {
        await onSubmit({ values: payload, resetForm });
      }
    },
  });

  return (
    <ModalBasic
      id="section-modal"
      title={isEditMode ? "Update Section" : "Add Section"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-4 space-y-4"
      >
        {/* Name */}
        <InputField
          label="Section Name"
          name="name"
          required
          placeholder="e.g. VIP Section"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name}
        />

        {/* Code */}
        <InputField
          label="Code"
          name="code"
          placeholder="Optional"
          value={formik.values.code}
          onChange={formik.handleChange}
        />

        {/* Section Type */}
        <div>
          <label className="text-sm font-medium">Section Type *</label>
          <select
            name="sectionType"
            value={formik.values.sectionType}
            onChange={formik.handleChange}
            className="form-input w-full mt-1"
          >
            <option value="">Select Type</option>
            {SECTION_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <InputField
          label="Description"
          name="description"
          placeholder="Description"
          value={formik.values.description}
          onChange={formik.handleChange}
        />

        {/* Display Order */}
        <InputField
          label="Display Order"
          name="displayOrder"
          placeholder="1, 2, 3"
          type="number"
          value={formik.values.displayOrder}
          onChange={formik.handleChange}
        />

        {/* Active */}
        <CheckboxField
          label="Enable Section"
          name="isActive"
          checked={formik.values.isActive}
          onChange={formik.handleChange}
        />

        {/* Footer */}
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
            disabled={loading}
            className="btn bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEditMode ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </ModalBasic>
  );
};

export default SectionModal;
