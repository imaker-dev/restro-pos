import React, { useMemo } from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { InputField } from "../../components/fields/InputField";
import { SelectField } from "../../components/fields/SelectField";

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Printer name is required")
    .min(2, "Too short")
    .max(50, "Too long"),

  code: Yup.string()
    .trim()
    .required("Printer code is required")
    .min(2, "Too short")
    .max(20, "Too long"),

  station: Yup.string().required("Station is required"),

  connectionType: Yup.string().required("Connection type is required"),

  ipAddress: Yup.string().when("connectionType", {
    is: "network",
    then: (schema) =>
      schema.required("IP Address is required for network printers"),
  }),

  port: Yup.number().typeError("Port must be a number").nullable(),
});

const PrinterModal = ({
  isOpen,
  onClose,
  onSubmit,
  outletId,
  printer,
  stations = [],
  loading = false,
}) => {
  const isEditMode = !!printer;

  // 🔹 Convert dynamic stations into Select options
  const stationOptions = useMemo(() => {
    return stations?.map((s) => ({
      label: s?.name,
      value: s?.id, // better to store ID instead of string
    }));
  }, [stations]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      outletId: printer?.outlet_id || outletId || "",
      name: printer?.name || "",
      code: printer?.code || "",
      station: printer?.station_id || "",
      ipAddress: printer?.ip_address || "",
      port: printer?.port || 9100,
      connectionType: printer?.connection_type || "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = { ...values };

      if (isEditMode) {
        await onSubmit({
          id: printer.id,
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
      id="printer-modal"
      title={isEditMode ? "Update Printer" : "Add Printer"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-4 space-y-5"
      >
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Printer Name"
            name="name"
            required
            placeholder="e.g. Kitchen Main Printer"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
          />

          <InputField
            label="Printer Code"
            name="code"
            required
            placeholder="e.g. KIT-01"
            value={formik.values.code}
            onChange={(e) =>
              formik.setFieldValue("code", e.target.value.toUpperCase())
            }
            onBlur={formik.handleBlur}
            error={formik.touched.code && formik.errors.code}
          />
        </div>

        <SelectField
          label="Assign Station"
          name="station"
          required
          value={formik.values.station}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.station && formik.errors.station}
          options={stationOptions}
          loading={!stations?.length}
          emptyText="No stations available"
        />

        {/* Row 3 */}
        <SelectField
          label="Connection Type"
          name="connectionType"
          required
          value={formik.values.connectionType}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.connectionType && formik.errors.connectionType}
          options={[
            { label: "Network", value: "network" },
            // { label: "USB", value: "usb" },
            // { label: "Bluetooth", value: "bluetooth" },
          ]}
          emptyText="No connection types available"
        />

        {/* Row 4 - Network Only */}
        {formik.values.connectionType === "network" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="IP Address"
              name="ipAddress"
              required
              placeholder="e.g. 192.168.1.100"
              value={formik.values.ipAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.ipAddress && formik.errors.ipAddress}
            />

            <InputField
              label="Port"
              name="port"
              type="number"
              placeholder="Default 9100"
              value={formik.values.port}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.port && formik.errors.port}
            />
          </div>
        )}

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

export default PrinterModal;
