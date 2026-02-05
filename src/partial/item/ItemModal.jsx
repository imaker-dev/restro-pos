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
    .required("Item name is required")
    .min(2, "Too short")
    .max(50, "Too long"),

  basePrice: Yup.number()
    .typeError("Base price must be a number")
    .required("Base price is required")
    .min(0, "Price must be positive"),

  description: Yup.string().trim().max(200, "Too long"),

  isActive: Yup.boolean(),
});

const ItemModal = ({
  isOpen,
  onClose,
  onSubmit,
  categoryId,
  item,
  loading = false,
}) => {
  const isEditMode = !!item;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      categoryId: item?.category_id || categoryId || "",
      name: item?.name || "",
      basePrice: item?.base_price || "",
      description: item?.description || "",
      isActive: item ? Boolean(item.is_active) : true,
    },
    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      if (isEditMode) {
        await onSubmit({
          id: item.id,
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
      id="item-modal"
      title={isEditMode ? "Update Item" : "Add Item"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-4 space-y-4"
      >
        {/* Item Name */}
        <InputField
          label="Item Name"
          name="name"
          required
          placeholder="Enter item name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name}
        />

        {/* Base Price */}
        <InputField
          label="Base Price"
          name="basePrice"
          type="number"
          required
          placeholder="Enter base price"
          value={formik.values.basePrice}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.basePrice && formik.errors.basePrice}
        />

        {/* Description */}
        <InputField
          label="Description"
          name="description"
          placeholder="Enter description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && formik.errors.description}
        />

        {/* Active Checkbox */}
        <CheckboxField
          label="Enable Item"
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
            className="btn bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
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

export default ItemModal;
