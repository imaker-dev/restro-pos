import React, { useEffect, useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PageHeader from "../../layout/PageHeader";
import AccordionSection from "../../components/AccordionSection";
import { InputField } from "../../components/fields/InputField";
import { SelectField } from "../../components/fields/SelectField";
import { CheckboxField } from "../../components/fields/CheckboxField";
import {
  Package,
  FileText,
  Smartphone,
  Apple,
  Monitor,
  Laptop,
  Terminal,
  Loader2,
  Save,
  Plus,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import {
  createVersion,
  updateVersion,
  fetchVersionById,
} from "../../redux/slices/versionSlice";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../../hooks/useQueryParams";
import { handleResponse } from "../../utils/helpers";
import LoadingOverlay from "../../components/LoadingOverlay";
import ToggleField from "../../components/fields/ToggleField";
import { TextareaField } from "../../components/fields/TextareaField";

const AddVersionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { versionId } = useQueryParams();

  useEffect(() => {
    if (versionId) {
      dispatch(fetchVersionById(versionId));
    }
  }, [versionId, dispatch]);

  const {
    versionDetails,
    isFetchingVersionDetails,
    isCreatingVersion,
    isUpdatingVersion,
  } = useSelector((state) => state.version);

  const initialValues = useMemo(() => {
    if (versionId && versionDetails) {
      return {
        version: versionDetails.version || "",
        build: versionDetails.build || "",
        channel: versionDetails.channel || "stable",
        force_update: Boolean(versionDetails.force_update),
        is_active: Boolean(versionDetails.is_active),
        release_notes: versionDetails.release_notes || "",

        android_url: versionDetails.android_url || "",
        android_min_version: versionDetails.android_min_version || "",
        android_sha256: versionDetails.android_sha256 || "",

        ios_url: versionDetails.ios_url || "",
        ios_min_version: versionDetails.ios_min_version || "",
        ios_sha256: versionDetails.ios_sha256 || "",

        windows_url: versionDetails.windows_url || "",
        windows_min_version: versionDetails.windows_min_version || "",
        windows_sha256: versionDetails.windows_sha256 || "",

        mac_url: versionDetails.mac_url || "",
        mac_min_version: versionDetails.mac_min_version || "",
        mac_sha256: versionDetails.mac_sha256 || "",

        linux_url: versionDetails.linux_url || "",
        linux_min_version: versionDetails.linux_min_version || "",
        linux_sha256: versionDetails.linux_sha256 || "",
      };
    }

    return {
      version: "",
      build: "",
      channel: "stable",
      force_update: false,
      is_active: true,
      release_notes: "",

      android_url: "",
      android_min_version: "",
      android_sha256: "",

      ios_url: "",
      ios_min_version: "",
      ios_sha256: "",

      windows_url: "",
      windows_min_version: "",
      windows_sha256: "",

      mac_url: "",
      mac_min_version: "",
      mac_sha256: "",

      linux_url: "",
      linux_min_version: "",
      linux_sha256: "",
    };
  }, [versionId, versionDetails]);

  const validationSchema = Yup.object({
    version: Yup.string()
      .matches(/^\d+\.\d+\.\d+$/, "Use semantic version (e.g. 1.2.0)")
      .required("Version is required"),
    channel: Yup.string().required("Channel is required"),
  });

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      build: values.build ? Number(values.build) : null,
      force_update: Boolean(values.force_update),
      is_active: Boolean(values.is_active),
    };
    console.log(payload);

    const action = versionId
      ? updateVersion({ id: versionId, values: payload })
      : createVersion(payload);

    await handleResponse(dispatch(action), () => {
      navigate("/versions");
    });
  };

  if (isFetchingVersionDetails && versionId) {
    return <LoadingOverlay />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={versionId ? "Update Version" : "Create Version"}
        showBackButton
      />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => (
          <Form className="space-y-8" autoComplete="off">
            {/* VERSION INFO */}
            <AccordionSection title="Version Information" icon={Package}>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <InputField
                  label="Version"
                  name="version"
                  required
                  placeholder="e.g. 1.2.0"
                  value={formik.values.version}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.version && formik.errors.version}
                />

                <InputField
                  label="Build Number"
                  name="build"
                  type="number"
                  placeholder="e.g. 102"
                  value={formik.values.build}
                  onChange={formik.handleChange}
                />

                <SelectField
                  label="Release Channel"
                  name="channel"
                  required
                  options={[
                    { value: "stable", label: "Stable" },
                    { value: "beta", label: "Beta" },
                    { value: "alpha", label: "Alpha" },
                  ]}
                  value={formik.values.channel}
                  onChange={formik.handleChange}
                />
              </div>

              <div className="space-y-4">
                <ToggleField
                  label="Force Update"
                  description="Users will be required to update before continuing to use the application."
                  checked={formik.values.force_update}
                  onChange={(value) =>
                    formik.setFieldValue("force_update", value)
                  }
                  activeColorClass="bg-red-600"
                />

                <ToggleField
                  label="Set as Active Version"
                  description="This version will become the currently active production release."
                  checked={formik.values.is_active}
                  onChange={(value) => formik.setFieldValue("is_active", value)}
                  activeColorClass="bg-emerald-600"
                />
              </div>
            </AccordionSection>

            {/* RELEASE NOTES */}
            <AccordionSection title="Release Notes" icon={FileText}>
              <TextareaField
                label="Changelog (Markdown Supported)"
                name="release_notes"
                multiline
                rows={6}
                placeholder={`### What's New\n- Improved performance\n- Minor bug fixes\n- UI enhancements`}
                value={formik.values.release_notes}
                onChange={formik.handleChange}
              />
            </AccordionSection>

            {/* ANDROID */}
            <AccordionSection title="Android Distribution" icon={Smartphone}>
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  label="Play Store / APK URL"
                  name="android_url"
                  placeholder="https://play.google.com/store/apps/details?id=com.example.app"
                  value={formik.values.android_url}
                  onChange={formik.handleChange}
                />
                <InputField
                  label="Minimum Supported Android Version"
                  name="android_min_version"
                  placeholder="e.g. 8.0 (Oreo)"
                  value={formik.values.android_min_version}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="mt-6">
                <InputField
                  label="SHA256 Checksum"
                  name="android_sha256"
                  placeholder="64 character SHA256 hash"
                  value={formik.values.android_sha256}
                  onChange={formik.handleChange}
                />
              </div>
            </AccordionSection>

            {/* iOS */}
            <AccordionSection title="iOS Distribution" icon={Apple}>
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  label="App Store URL"
                  name="ios_url"
                  placeholder="https://apps.apple.com/app/id123456789"
                  value={formik.values.ios_url}
                  onChange={formik.handleChange}
                />
                <InputField
                  label="Minimum Supported iOS Version"
                  name="ios_min_version"
                  placeholder="e.g. 13.0"
                  value={formik.values.ios_min_version}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="mt-6">
                <InputField
                  label="SHA256 Checksum"
                  name="ios_sha256"
                  placeholder="Optional checksum for IPA"
                  value={formik.values.ios_sha256}
                  onChange={formik.handleChange}
                />
              </div>
            </AccordionSection>

            {/* WINDOWS */}
            <AccordionSection title="Windows Distribution" icon={Monitor}>
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  label="Windows Installer URL"
                  name="windows_url"
                  placeholder="https://example.com/app-installer.exe"
                  value={formik.values.windows_url}
                  onChange={formik.handleChange}
                />
                <InputField
                  label="Minimum Supported Windows Version"
                  name="windows_min_version"
                  placeholder="e.g. Windows 10"
                  value={formik.values.windows_min_version}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="mt-6">
                <InputField
                  label="SHA256 Checksum"
                  name="windows_sha256"
                  placeholder="Optional 64 character hash"
                  value={formik.values.windows_sha256}
                  onChange={formik.handleChange}
                />
              </div>
            </AccordionSection>

            {/* macOS */}
            <AccordionSection title="macOS Distribution" icon={Laptop}>
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  label="macOS DMG URL"
                  name="mac_url"
                  placeholder="https://example.com/app.dmg"
                  value={formik.values.mac_url}
                  onChange={formik.handleChange}
                />
                <InputField
                  label="Minimum Supported macOS Version"
                  name="mac_min_version"
                  placeholder="e.g. macOS 12 Monterey"
                  value={formik.values.mac_min_version}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="mt-6">
                <InputField
                  label="SHA256 Checksum"
                  name="mac_sha256"
                  placeholder="Optional checksum"
                  value={formik.values.mac_sha256}
                  onChange={formik.handleChange}
                />
              </div>
            </AccordionSection>

            {/* LINUX */}
            <AccordionSection title="Linux Distribution" icon={Terminal}>
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  label="Linux AppImage URL"
                  name="linux_url"
                  placeholder="https://example.com/app.AppImage"
                  value={formik.values.linux_url}
                  onChange={formik.handleChange}
                />
                <InputField
                  label="Minimum Supported Linux Version"
                  name="linux_min_version"
                  placeholder="e.g. Ubuntu 20.04+"
                  value={formik.values.linux_min_version}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="mt-6">
                <InputField
                  label="SHA256 Checksum"
                  name="linux_sha256"
                  placeholder="Optional checksum"
                  value={formik.values.linux_sha256}
                  onChange={formik.handleChange}
                />
              </div>
            </AccordionSection>

            {/* SUBMIT */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isCreatingVersion || isUpdatingVersion}
                className="btn bg-primary-500 hover:bg-primary-600 text-white px-8 py-2 flex items-center gap-2 disabled:opacity-60"
              >
                {(isCreatingVersion || isUpdatingVersion) && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}

                {!isCreatingVersion &&
                  !isUpdatingVersion &&
                  (versionId ? (
                    <Save className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  ))}

                {versionId
                  ? isUpdatingVersion
                    ? "Updating Version..."
                    : "Update Version"
                  : isCreatingVersion
                    ? "Creating Version..."
                    : "Create Version"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddVersionPage;
