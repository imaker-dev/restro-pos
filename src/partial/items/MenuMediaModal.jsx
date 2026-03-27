import React from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { InputField } from "../../components/fields/InputField";
import DragDropUploader from "../../components/DragDropUploader";
import InfoCard from "../../components/InfoCard";

const validationSchema = Yup.object({
  files: Yup.array().min(1, "File is required").max(1, "Only one file allowed"),

  title: Yup.string().trim().max(100, "Too long"),

  displayOrder: Yup.number().min(0, "Must be 0 or greater").nullable(),
});

const MenuMediaModal = ({ isOpen, onClose, onSubmit, loading = false }) => {
  const formik = useFormik({
    initialValues: {
      files: [],
      title: "",
      displayOrder: 0,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();

      const file = values.files?.[0];

      if (file) {
        formData.append("file", file);
      }

      if (values.title) {
        formData.append("title", values.title);
      }

      if (values.displayOrder !== null && values.displayOrder !== undefined) {
        formData.append("displayOrder", values.displayOrder);
      }

      await onSubmit({
        formData,
        resetForm,
      });
    },
  });

  return (
    <ModalBasic
      id="menu-media-modal"
      title="Upload Menu Media"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-4 space-y-4"
      >
        {/* File Upload */}
        <div>
          <DragDropUploader
            value={formik.values.files}
            onChange={(files) =>
              formik.setFieldValue("files", files.slice(0, 1))
            }
            multiple={false}
            accept="image/*,.pdf"
            maxFiles={1}
            maxSize={10 * 1024 * 1024}
            uploadToServer={false}
            size="lg"
          />
          {formik.touched.files && formik.errors.files && (
            <p className="text-xs text-red-500 mt-1">{formik.errors.files}</p>
          )}
        </div>

        {/* Title */}
        <InputField
          label="Title"
          name="title"
          placeholder="e.g. Breakfast Menu"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && formik.errors.title}
        />

        {/* Display Order */}
        <InputField
          label="Display Order"
          name="displayOrder"
          type="number"
          value={formik.values.displayOrder}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.displayOrder && formik.errors.displayOrder}
        />

        {/* Info */}
        <InfoCard
          size="sm"
          type="info"
          title="Media Usage"
          description="Uploaded images and PDFs will be visible in your digital menu. You can control visibility and order later."
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
            disabled={loading || !formik.isValid}
            className="btn bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </ModalBasic>
  );
};

export default MenuMediaModal;
