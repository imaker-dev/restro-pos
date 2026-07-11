import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useQueryParams } from "../../hooks/useQueryParams";
import {
  fetchOutletById,
  updateOutlet,
} from "../../redux/slices/outletSlice";
import PageHeader from "../../layout/PageHeader";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Shield,
  FileText,
  Building2,
  Hash,
  CheckCircle2,
  XCircle,
  Calendar,
  RefreshCw,
  Utensils,
  CreditCard,
  Landmark,
  Tag,
  ReceiptText,
  Timer,
  Layers,
  Pencil,
  Save,
  X,
  Loader2,
  Camera,
} from "lucide-react";
import { formatDate } from "../../utils/dateFormatter";
import LoadingOverlay from "../../components/LoadingOverlay";
import { handleResponse } from "../../utils/helpers";
import Api from "../../redux/api";

/* ─── Helpers ─────────────────────────────────────────── */
const fmt = (v) =>
  v != null && v !== "" ? (
    v
  ) : (
    <span className="text-slate-300 italic font-normal">—</span>
  );

const timeStr = (t) => {
  if (!t) return null;
  const [h, m] = t.split(":");
  const hr = parseInt(h);
  return `${hr % 12 || 12}:${m} ${hr < 12 ? "AM" : "PM"}`;
};

/* ─── Badge ───────────────────────────────────────────── */
const Badge = ({ active }) =>
  active ? (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
      <CheckCircle2 size={11} /> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
      <XCircle size={11} /> Inactive
    </span>
  );

/* ─── Avatar ──────────────────────────────────────────── */
const Avatar = ({ name, logo }) => {
  const initials = name
    ?.split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return logo ? (
    <img
      src={logo}
      alt={name}
      className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 shadow-md"
    />
  ) : (
    <div className="w-20 h-20 rounded-2xl flex-shrink-0 bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-2xl font-black tracking-tight shadow-lg shadow-blue-200">
      {initials}
    </div>
  );
};

/* ─── Field ───────────────────────────────────────────── */
const Field = ({ icon: Icon, label, value, wide, mono }) => (
  <div
    className={`py-3 pr-4 border-b border-slate-50 ${wide ? "w-full" : "w-1/2"}`}
  >
    <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
      {Icon && <Icon size={11} strokeWidth={2.2} />}
      {label}
    </div>
    <div
      className={`text-sm font-semibold text-slate-800 leading-snug ${mono ? "font-mono tracking-wide text-[13px]" : ""}`}
    >
      {fmt(value)}
    </div>
  </div>
);

/* ─── Editable Field ──────────────────────────────────── */
const EditableField = ({ icon: Icon, label, name, value, onChange, wide, mono, placeholder }) => (
  <div
    className={`py-3 pr-4 border-b border-slate-50 ${wide ? "w-full" : "w-1/2"}`}
  >
    <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
      {Icon && <Icon size={11} strokeWidth={2.2} />}
      {label}
    </div>
    <input
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full text-sm font-semibold leading-snug bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors ${mono ? "font-mono tracking-wide text-[13px]" : ""}`}
    />
  </div>
);

/* ─── Section ─────────────────────────────────────────── */
const Section = ({ title, icon: Icon, iconBg, iconColor, children }) => (
  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
    <div className="flex items-center gap-2.5 px-5 py-4 bg-slate-50 border-b border-slate-100">
      <span
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor}`}
      >
        <Icon size={15} strokeWidth={2.2} />
      </span>
      <span className="text-[13px] font-bold text-slate-700 tracking-tight">
        {title}
      </span>
    </div>
    <div className="px-5 pt-1 pb-3 flex flex-wrap">{children}</div>
  </div>
);

/* ══════════════════════════════════════════════════════ */
const OutletDetails = () => {
  const dispatch = useDispatch();
  const { outletId } = useQueryParams();
  const { outletDetails: d, isFetchingOutletDetails: loading, isUpdatingOutlet } = useSelector(
    (state) => state.outlet,
  );

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [newLogo, setNewLogo] = useState([]);

  useEffect(() => {
    if (outletId) dispatch(fetchOutletById(outletId));
  }, [outletId]);

  // Sync form state when outlet data loads or changes
  useEffect(() => {
    if (d) {
      setForm({
        phone: d.phone || "",
        gstin: d.gstin || "",
        fssai_number: d.fssai_number || "",
        pan_number: d.pan_number || "",
        address_line1: d.address_line1 || "",
        address_line2: d.address_line2 || "",
        city: d.city || "",
        state: d.state || "",
        country: d.country || "",
        postal_code: d.postal_code || "",
      });
    }
  }, [d]);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSave = async () => {
    const payload = {
      phone: form.phone,
      gstin: form.gstin,
      fssaiNumber: form.fssai_number,
      panNumber: form.pan_number,
      addressLine1: form.address_line1,
      addressLine2: form.address_line2,
      city: form.city,
      state: form.state,
      country: form.country,
      postalCode: form.postal_code,
    };

    // Upload logo first if changed
    if (newLogo.length > 0) {
      try {
        const fd = new FormData();
        fd.append("logo", newLogo[0]);
        await Api.post(`/outlets/${outletId}/logo/upload`, fd);
      } catch (err) {
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Logo upload failed. Please try again."
        );
        return;
      }
    }

    await handleResponse(
      dispatch(updateOutlet({ id: outletId, values: payload })),
      () => {
        setEditing(false);
        setNewLogo([]);
        dispatch(fetchOutletById(outletId));
      },
    );
  };

  const handleCancel = () => {
    setEditing(false);
    setNewLogo([]);
    if (d) {
      setForm({
        phone: d.phone || "",
        gstin: d.gstin || "",
        fssai_number: d.fssai_number || "",
        pan_number: d.pan_number || "",
        address_line1: d.address_line1 || "",
        address_line2: d.address_line2 || "",
        city: d.city || "",
        state: d.state || "",
        country: d.country || "",
        postal_code: d.postal_code || "",
      });
    }
  };

  if (loading) {
    return <LoadingOverlay text="Fetching Outlet Details..." />;
  }
  const fullAddress = [
    d?.address_line1,
    d?.address_line2,
    d?.city,
    d?.state,
    d?.postal_code,
    d?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Outlet Details"
        showBackButton
        actions={
          editing
            ? [
                {
                  label: "Cancel",
                  type: "secondary",
                  icon: X,
                  onClick: handleCancel,
                },
                {
                  label: isUpdatingOutlet ? "Saving..." : "Save Changes",
                  type: "primary",
                  icon: isUpdatingOutlet ? Loader2 : Save,
                  onClick: handleSave,
                  disabled: isUpdatingOutlet,
                },
              ]
            : [
                {
                  label: "Edit",
                  type: "secondary",
                  icon: Pencil,
                  onClick: () => setEditing(true),
                },
              ]
        }
      />

      {/* ── Hero Card ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
        {/* Subtle glow */}

        <div className="relative p-5">
          {/* Top row: avatar + info */}
          <div className="flex items-start gap-6 mb-6">
            {/* Logo — editable */}
            <div className="relative group">
              <Avatar name={d?.name} logo={d?.logo_url} />
              {editing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length) setNewLogo(files);
                    }}
                  />
                </label>
              )}
              {editing && newLogo.length > 0 && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow">
                  New
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {/* Pills row */}
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 font-mono tracking-wide">
                  <Hash size={10} /> {d?.code}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200 capitalize">
                  <Utensils size={10} /> {d?.outlet_type}
                </span>
                <Badge active={d?.is_active} />
              </div>

              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight mb-0.5">
                {d?.name}
              </h1>
              <p className="text-sm text-slate-500 font-medium mb-2">
                {d?.legal_name}
              </p>

              {fullAddress && (
                <div className="flex items-center gap-1.5 text-[13px] text-slate-400 font-medium">
                  <MapPin
                    size={13}
                    strokeWidth={2}
                    className="flex-shrink-0 text-slate-300"
                  />
                  {fullAddress}
                </div>
              )}
            </div>
          </div>

          {/* Contact pills */}
          <div className="flex flex-wrap gap-2.5">
            {/* Phone — editable */}
            {editing ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200">
                <Phone size={13} className="text-blue-500" />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  placeholder="Phone number"
                  className="bg-transparent text-[13px] font-semibold text-slate-700 outline-none w-40"
                />
              </div>
            ) : (
              d?.phone && (
                <a
                  href={`tel:${d?.phone}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-150 no-underline"
                >
                  <Phone size={13} /> {d?.phone}
                </a>
              )
            )}
            {/* Email — NOT editable */}
            {d?.email && (
              <a
                href={`mailto:${d?.email}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-150 no-underline"
              >
                <Mail size={13} /> {d?.email}
              </a>
            )}
            {d?.website && (
              <a
                href={d?.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-150 no-underline"
              >
                <Globe size={13} /> {d?.website}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Sections Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Section
          title="Business Information"
          icon={Building2}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        >
          <Field icon={Layers} label="Outlet Type" value={d?.outlet_type} />
          <Field icon={Hash} label="Outlet Code" value={d?.code} mono />
          <Field icon={Tag} label="Currency" value={d?.currency_code} />
          <Field icon={Globe} label="Timezone" value={d?.timezone} />
        </Section>

        <Section
          title="Operating Hours"
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        >
          <Field
            icon={Timer}
            label="Mode"
            value={d?.is_24_hours ? "Open 24 Hours" : "Fixed Hours"}
            wide
          />
          {!d?.is_24_hours && (
            <>
              <Field
                icon={Clock}
                label="Opens At"
                value={timeStr(d?.opening_time)}
              />
              <Field
                icon={Clock}
                label="Closes At"
                value={timeStr(d?.closing_time)}
              />
            </>
          )}
        </Section>

        <Section
          title="Tax & Compliance"
          icon={Shield}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        >
          {editing ? (
            <>
              <EditableField
                icon={Shield}
                label="GSTIN"
                name="gstin"
                value={form.gstin}
                onChange={handleFormChange}
                mono
                wide
                placeholder="e.g. 27ABCDE1234F1Z5"
              />
              <EditableField
                icon={FileText}
                label="FSSAI Number"
                name="fssai_number"
                value={form.fssai_number}
                onChange={handleFormChange}
                mono
                wide
                placeholder="14 digit FSSAI license number"
              />
              <EditableField
                icon={CreditCard}
                label="PAN Number"
                name="pan_number"
                value={form.pan_number}
                onChange={handleFormChange}
                mono
                wide
                placeholder="e.g. ABCDE1234F"
              />
            </>
          ) : (
            <>
              <Field icon={Shield} label="GSTIN" value={d?.gstin} mono wide />
              <Field
                icon={FileText}
                label="FSSAI Number"
                value={d?.fssai_number}
                mono
                wide
              />
              <Field
                icon={CreditCard}
                label="PAN Number"
                value={d?.pan_number}
                mono
                wide
              />
            </>
          )}
        </Section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* <Section title="Invoice Settings" icon={ReceiptText} iconBg="bg-violet-50" iconColor="text-violet-600">
              <Field icon={Tag}      label="Invoice Prefix"   value={d.invoice_prefix}       mono />
              <Field icon={Hash}     label="Invoice Sequence" value={d.invoice_sequence} />
              <Field icon={Tag}      label="KOT Prefix"       value={d.kot_prefix}           mono />
              <Field icon={Hash}     label="KOT Sequence"     value={d.kot_sequence} />
              <Field icon={Landmark} label="Tax Group ID"     value={d.default_tax_group_id} wide />
            </Section> */}

        <Section
          title="Location Details"
          icon={MapPin}
          iconBg="bg-pink-50"
          iconColor="text-pink-600"
        >
          {editing ? (
            <>
              <EditableField
                icon={MapPin}
                label="Address Line 1"
                name="address_line1"
                value={form.address_line1}
                onChange={handleFormChange}
                wide
                placeholder="Street name, building number"
              />
              <EditableField
                icon={MapPin}
                label="Address Line 2"
                name="address_line2"
                value={form.address_line2}
                onChange={handleFormChange}
                wide
                placeholder="Area, landmark (optional)"
              />
              <EditableField
                icon={Building2}
                label="City"
                name="city"
                value={form.city}
                onChange={handleFormChange}
                placeholder="e.g. Mumbai"
              />
              <EditableField
                icon={Building2}
                label="State"
                name="state"
                value={form.state}
                onChange={handleFormChange}
                placeholder="e.g. Maharashtra"
              />
              <EditableField
                icon={Globe}
                label="Country"
                name="country"
                value={form.country}
                onChange={handleFormChange}
                placeholder="e.g. India"
              />
              <EditableField
                icon={Hash}
                label="Postal Code"
                name="postal_code"
                value={form.postal_code}
                onChange={handleFormChange}
                mono
                placeholder="e.g. 400001"
              />
            </>
          ) : (
            <>
              <Field
                icon={MapPin}
                label="Address Line 1"
                value={d?.address_line1}
                wide
              />
              <Field
                icon={MapPin}
                label="Address Line 2"
                value={d?.address_line2}
                wide
              />
              <Field icon={Building2} label="City" value={d?.city} />
              <Field icon={Building2} label="State" value={d?.state} />
              <Field icon={Globe} label="Country" value={d?.country} />
              <Field icon={Hash} label="Postal Code" value={d?.postal_code} mono />
            </>
          )}
          <Field icon={MapPin} label="Latitude" value={d?.latitude} mono />
          <Field icon={MapPin} label="Longitude" value={d?.longitude} mono />
        </Section>

        <Section
          title="Record Information"
          icon={Calendar}
          iconBg="bg-slate-100"
          iconColor="text-slate-500"
        >
          <Field
            icon={Calendar}
            label="Created At"
            value={formatDate(d?.created_at, "longTime")}
            wide
          />
          <Field
            icon={RefreshCw}
            label="Updated At"
            value={formatDate(d?.updated_at, "longTime")}
            wide
          />
          <Field icon={Hash} label="Created By (ID)" value={d?.created_by} />
          <Field icon={Hash} label="Updated By (ID)" value={d?.updated_by} />
        </Section>
      </div>
    </div>
  );
};

export default OutletDetails;
