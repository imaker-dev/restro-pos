import React, { useEffect, useMemo } from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { SelectField } from "../../components/fields/SelectField";
import StatusBadge from "../../layout/StatusBadge";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllStations } from "../../redux/slices/stationSlice";

const validationSchema = Yup.object({
  stationId: Yup.string().required("Station is required"),
});

const AssignStationToUserModal = ({
  isOpen,
  onClose,
  onSubmit,
  outletId,
  user,
  loading = false,
}) => {
  const { allStations, loading: isFetchingStations } = useSelector(
    (state) => state.station,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllStations(outletId));
    }
  }, [isOpen, outletId, dispatch]);

  const stationOptions = useMemo(() => {
    return allStations?.map((s) => ({
      label: s?.name,
      value: s?.id,
    }));
  }, [allStations]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      stationId: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit({
        userId: user.id,
        values: {
          outletId: Number(outletId),
          stationId: Number(values.stationId),
        },
        resetForm,
      });
    },
  });

  return (
    <ModalBasic
      id="assign-station-user"
      title="Assign Station"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-5 space-y-6"
      >
        {/* USER DETAILS */}
        <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              {user?.name}
            </h3>
            <StatusBadge value={user?.isActive} />
          </div>

          <p className="text-xs text-slate-500">{user?.email || "No Email"}</p>

          <p className="text-xs text-slate-500">
            Role: {user?.roles?.[0] || "—"}
          </p>
        </div>

        {/* STATION SELECT */}
        <SelectField
          label="Select Station"
          name="stationId"
          required
          value={formik.values.stationId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.stationId && formik.errors.stationId}
          options={stationOptions}
          loading={isFetchingStations}
          emptyText="No stations available"
        />

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
            disabled={loading}
            className="btn bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Assigning..." : "Assign Station"}
          </button>
        </div>
      </form>
    </ModalBasic>
  );
};

export default AssignStationToUserModal;
