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

  station_id: Yup.string().required("Station is required"),

  printer_type: Yup.string().required("Printer type is required"),

  connection_type: Yup.string().required("Connection type is required"),

  ip_address: Yup.string().when("connection_type", {
    is: "network",
    then: (schema) =>
      schema
        .required("IP Address is required for network printers")
        .matches(
          /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/,
          "Invalid IP address",
        ),
    otherwise: (schema) => schema.nullable(),
  }),

  port: Yup.number()
    .typeError("Port must be a number")
    .when("connection_type", {
      is: "network",
      then: (schema) =>
        schema.required("Port is required for network printers"),
      otherwise: (schema) => schema.nullable(),
    }),
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

  const stationOptions = useMemo(() => {
    return stations?.map((s) => ({
      label: s?.name,
      value: s?.id,
    }));
  }, [stations]);

  const printerTypeOptions = [
    { label: "Thermal", value: "thermal" },
    { label: "Laser", value: "laser" },
    { label: "Inkjet", value: "inkjet" },
  ];

  const connectionTypeOptions = [{ label: "Network", value: "network" }];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      outlet_id: outletId || "",
      name: printer?.name || "",
      // NEW API structure
      station_id: printer?.stationId || "",
      printer_type: printer?.printerType || "",
      connection_type: "network",
      ip_address: printer?.ipAddress || "",
      port: printer?.port ?? "",
    },

    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      const payload = {
        outlet_id: values.outlet_id,
        name: values.name,
        station_id: Number(values.station_id),
        printer_type: values.printer_type,
        connection_type: values.connection_type,
        ip_address: values.ip_address,
        port: Number(values.port),
      };

      if (isEditMode) {
        await onSubmit({
          id: Number(printer.id),
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
        className="p-5 space-y-6"
      >
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

        <SelectField
          label="Assign Station"
          name="station_id"
          required
          value={formik.values.station_id}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.station_id && formik.errors.station_id}
          options={stationOptions}
        />

        <SelectField
          label="Printer Type"
          name="printer_type"
          required
          value={formik.values.printer_type}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.printer_type && formik.errors.printer_type}
          options={printerTypeOptions}
        />

        <SelectField
          label="Connection Type"
          name="connection_type"
          required
          value={formik.values.connection_type}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.connection_type && formik.errors.connection_type
          }
          options={connectionTypeOptions}
        />

        {formik.values.connection_type === "network" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="IP Address"
              name="ip_address"
              required
              placeholder="e.g. 192.168.1.100"
              value={formik.values.ip_address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.ip_address && formik.errors.ip_address}
            />

            <InputField
              label="Port"
              name="port"
              type="number"
              required
              placeholder="Default 9100"
              value={formik.values.port}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.port && formik.errors.port}
            />
          </div>
        )}

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
            className="btn bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
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
