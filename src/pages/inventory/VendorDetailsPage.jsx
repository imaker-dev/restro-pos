import React, { useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../../hooks/useQueryParams";
import { fetchVendorById } from "../../redux/slices/vendorSlice";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  CreditCard,
  Hash,
  Calendar,
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  CheckCircle2,
  ArrowLeft,
  Landmark,
  FileText,
  Clock,
  BadgeCheck,
  Package,
} from "lucide-react";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber } from "../../utils/numberFormatter";

const fmt = (v) => formatNumber(v, true);
const num = (v) => Number(v || 0);

// Skeleton
function Skeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-[180px] rounded-2xl bg-slate-200" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[88px] rounded-2xl bg-slate-100" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-[240px] rounded-2xl bg-slate-100" />
          <div className="h-[200px] rounded-2xl bg-slate-100" />
        </div>
        <div className="space-y-4">
          <div className="h-[200px] rounded-2xl bg-slate-100" />
          <div className="h-[160px] rounded-2xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

// StatTile
function StatTile({ icon: Icon, label, value, sub, dark = false }) {
  const bg = dark
    ? "bg-slate-900 border-slate-800"
    : "bg-white border-slate-200";
  const sh = dark
    ? "0 4px 16px rgba(15,23,42,0.22)"
    : "0 1px 3px rgba(0,0,0,0.06)";
  return (
    <div
      className={`relative rounded-2xl p-4 overflow-hidden border ${bg}`}
      style={{ boxShadow: sh }}
    >
      <div
        className={`absolute -top-4 -right-4 w-14 h-14 rounded-full pointer-events-none ${dark ? "bg-white/5" : "bg-slate-50"}`}
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-1 mb-3">
          <p
            className={`text-[9px] font-black uppercase tracking-[0.13em] ${dark ? "text-white/40" : "text-slate-400"}`}
          >
            {label}
          </p>
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center ${dark ? "bg-white/10" : "bg-slate-100"}`}
          >
            <Icon
              size={12}
              className={dark ? "text-white/60" : "text-slate-500"}
              strokeWidth={2}
            />
          </div>
        </div>
        <p
          className={`text-[21px] font-black tabular-nums leading-none ${dark ? "text-white" : "text-slate-900"}`}
        >
          {value}
        </p>
        {sub && (
          <p
            className={`text-[9.5px] font-medium mt-1.5 ${dark ? "text-white/35" : "text-slate-400"}`}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// Panel
function Panel({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 overflow-hidden ${className}`}
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      {children}
    </div>
  );
}

function PanelHead({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
      <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0">
        <Icon size={13} className="text-white" strokeWidth={2} />
      </div>
      <div>
        <p className="text-[12.5px] font-black text-slate-800 leading-none">
          {title}
        </p>
        {subtitle && (
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// InfoRow
function InfoRow({ icon: Icon, label, value, mono = false, last = false }) {
  if (!value && value !== 0) return null;
  return (
    <div
      className={`flex items-center gap-3 py-2.5 ${!last ? "border-b border-slate-100" : ""}`}
    >
      <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Icon size={11} className="text-slate-500" strokeWidth={2} />
      </div>
      <span className="text-[11.5px] text-slate-500 font-medium flex-1">
        {label}
      </span>
      <span
        className={`text-[12px] font-bold text-slate-800 text-right ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

// Main
const VendorDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vendorId } = useQueryParams();
  const { isFetchingVendorDetails, vendorDetails: vendor } = useSelector(
    (s) => s.vendor,
  );

  useEffect(() => {
    if (vendorId) dispatch(fetchVendorById(vendorId));
  }, [vendorId]);

  const initial = (vendor?.name || "V").charAt(0).toUpperCase();
  const hasGst = !!vendor?.gstNumber;
  const hasPan = !!vendor?.panNumber;
  const hasBank = vendor?.bankName || vendor?.bankAccount;
  const hasAddr = vendor?.address || vendor?.city || vendor?.state;

  return (
    <>
      <style>{`
        @keyframes vdUp { from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);} }
        .vdu { animation: vdUp 0.4s ease both; }
      `}</style>

      <div className="space-y-5 pb-10">
        {/* Header */}
        <div
          className="vdu flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={{ animationDelay: "0ms" }}
        >
          <PageHeader title="Vendor Details" showBackButton />
        </div>

        {isFetchingVendorDetails && <Skeleton />}

        {vendor && !isFetchingVendorDetails && (
          <>
            {/* ── HERO ── */}
            <div
              className="vdu relative rounded-2xl overflow-hidden"
              style={{
                animationDelay: "40ms",
                background:
                  "linear-gradient(160deg,#0f172a 0%,#1e293b 55%,#1e3a5f 100%)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{
                  background:
                    "linear-gradient(90deg,transparent,rgba(148,163,184,0.2),transparent)",
                }}
              />
              <div
                className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none opacity-20"
                style={{
                  background:
                    "radial-gradient(circle,rgba(99,102,241,0.6),transparent 70%)",
                }}
              />

              <div className="relative z-10 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  {/* Avatar + identity */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-[26px] font-black text-white select-none"
                      style={{
                        background: "linear-gradient(145deg,#6366f1,#4f46e5)",
                        boxShadow: "0 4px 16px rgba(99,102,241,0.45)",
                      }}
                    >
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h1 className="text-[22px] font-black text-white leading-none">
                          {vendor.name}
                        </h1>
                        {vendor.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            ACTIVE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-white/8 text-white/50 border border-white/15">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                            INACTIVE
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        {vendor.contactPerson && (
                          <span className="flex items-center gap-1.5 text-[11px] text-white/45 font-medium">
                            <User
                              size={10}
                              strokeWidth={2}
                              className="text-white/30"
                            />
                            {vendor.contactPerson}
                          </span>
                        )}
                        {vendor.phone && (
                          <span className="flex items-center gap-1.5 text-[11px] text-white/45 font-medium">
                            <Phone
                              size={10}
                              strokeWidth={2}
                              className="text-white/30"
                            />
                            {vendor.phone}
                          </span>
                        )}
                        {vendor.email && (
                          <span className="flex items-center gap-1.5 text-[11px] text-white/45 font-medium">
                            <Mail
                              size={10}
                              strokeWidth={2}
                              className="text-white/30"
                            />
                            {vendor.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Total purchase */}
                  <div className="flex-shrink-0 sm:text-right">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.15em] mb-1">
                      Total Purchases
                    </p>
                    <p className="text-[36px] font-black text-white tabular-nums leading-none">
                      {fmt(vendor.totalPurchaseAmount)}
                    </p>
                    <p className="text-[10px] text-white/30 font-medium mt-1.5">
                      {num(vendor.purchaseCount)} purchase
                      {num(vendor.purchaseCount) !== 1 ? "s" : ""} made
                    </p>
                  </div>
                </div>

                {/* 3-col strip */}
                <div className="grid grid-cols-3 gap-2 mt-5">
                  {[
                    {
                      icon: ShoppingCart,
                      label: "Purchase Count",
                      value: num(vendor.purchaseCount),
                      sub: "Total orders",
                    },
                    {
                      icon: Calendar,
                      label: "Last Purchase",
                      value: vendor.lastPurchaseDate
                        ? formatDate(vendor.lastPurchaseDate, "long")
                        : "—",
                      sub: "Most recent order",
                    },
                    {
                      icon: Clock,
                      label: "Vendor Since",
                      value: vendor.createdAt
                        ? formatDate(vendor.createdAt, "long")
                        : "—",
                      sub: "Account created",
                    },
                  ].map(({ icon: Icon, label, value, sub }) => (
                    <div
                      key={label}
                      className="flex items-start gap-3 rounded-xl px-4 py-3"
                      style={{
                        background: "rgba(255,255,255,0.055)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <Icon
                        size={13}
                        className="text-white/30 mt-0.5 flex-shrink-0"
                        strokeWidth={2}
                      />
                      <div className="min-w-0">
                        <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.13em]">
                          {label}
                        </p>
                        <p className="text-[12px] font-black text-white/80 leading-tight truncate tabular-nums">
                          {value}
                        </p>
                        <p className="text-[9px] text-white/25 font-medium truncate">
                          {sub}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── 4 STAT TILES ── */}
            <div
              className="vdu grid grid-cols-2 lg:grid-cols-4 gap-3"
              style={{ animationDelay: "80ms" }}
            >
              <StatTile
                dark
                icon={IndianRupee}
                label="Total Purchased"
                value={fmt(vendor.totalPurchaseAmount)}
                sub="Lifetime value"
              />
              <StatTile
                icon={ShoppingCart}
                label="Total Orders"
                value={num(vendor.purchaseCount)}
                sub="Purchase orders made"
              />
              <StatTile
                icon={TrendingUp}
                label="Avg Order Value"
                value={
                  num(vendor.purchaseCount) > 0
                    ? fmt(
                        num(vendor.totalPurchaseAmount) /
                          num(vendor.purchaseCount),
                      )
                    : "—"
                }
                sub="Per order average"
              />
              <StatTile
                icon={Clock}
                label="Credit Days"
                value={num(vendor.creditDays) || "None"}
                sub="Payment terms"
              />
            </div>

            {/* ── MAIN GRID ── */}
            <div
              className="vdu grid grid-cols-1 lg:grid-cols-3 gap-4"
              style={{ animationDelay: "120ms" }}
            >
              {/* LEFT (2 cols) */}
              <div className="lg:col-span-2 space-y-4">
                {/* Contact & Profile */}
                <Panel>
                  <PanelHead
                    icon={User}
                    title="Vendor Profile"
                    subtitle="Contact and account details"
                  />
                  <div className="px-5 py-1 pb-3">
                    <InfoRow
                      icon={Building2}
                      label="Company Name"
                      value={vendor.name}
                    />
                    <InfoRow
                      icon={User}
                      label="Contact Person"
                      value={vendor.contactPerson}
                    />
                    <InfoRow
                      icon={Phone}
                      label="Phone"
                      value={vendor.phone}
                      mono
                    />
                    <InfoRow
                      icon={Phone}
                      label="Alternate Phone"
                      value={vendor.alternatePhone}
                      mono
                    />
                    <InfoRow icon={Mail} label="Email" value={vendor.email} />
                    <InfoRow
                      icon={Hash}
                      label="Vendor ID"
                      value={`#${vendor.id}`}
                      mono
                      last
                    />
                  </div>
                </Panel>

                {/* Address */}
                {hasAddr && (
                  <Panel>
                    <PanelHead
                      icon={MapPin}
                      title="Address"
                      subtitle="Location details"
                    />
                    <div className="px-5 py-1 pb-3">
                      <InfoRow
                        icon={MapPin}
                        label="Address"
                        value={vendor.address}
                      />
                      <InfoRow icon={MapPin} label="City" value={vendor.city} />
                      <InfoRow
                        icon={MapPin}
                        label="State"
                        value={vendor.state}
                      />
                      <InfoRow
                        icon={Hash}
                        label="Pincode"
                        value={vendor.pincode}
                        mono
                        last
                      />
                    </div>
                  </Panel>
                )}

                {/* Purchase Orders placeholder */}
                <Panel>
                  <PanelHead
                    icon={Package}
                    title="Purchase Orders"
                    subtitle="Orders received from this vendor"
                  />
                  <div className="flex flex-col items-center justify-center py-14 px-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
                      <Package
                        size={22}
                        className="text-slate-300"
                        strokeWidth={1.5}
                      />
                    </div>
                    <p className="text-[13px] font-bold text-slate-400">
                      No purchase orders yet
                    </p>
                    <p className="text-[11px] text-slate-300 font-medium mt-1">
                      Purchase history will appear here
                    </p>
                  </div>
                </Panel>
              </div>

              {/* RIGHT sidebar */}
              <div className="space-y-4">
                {/* Tax info */}
                {(hasGst || hasPan) && (
                  <Panel>
                    <PanelHead
                      icon={BadgeCheck}
                      title="Tax Details"
                      subtitle="GST and PAN information"
                    />
                    <div className="px-5 py-1 pb-3">
                      <InfoRow
                        icon={Hash}
                        label="GST Number"
                        value={vendor.gstNumber}
                        mono
                      />
                      <InfoRow
                        icon={FileText}
                        label="PAN Number"
                        value={vendor.panNumber}
                        mono
                        last
                      />
                    </div>
                  </Panel>
                )}

                {/* Bank details */}
                {hasBank && (
                  <Panel>
                    <PanelHead
                      icon={Landmark}
                      title="Bank Details"
                      subtitle="Payment information"
                    />
                    <div className="px-5 py-1 pb-3">
                      <InfoRow
                        icon={Landmark}
                        label="Bank Name"
                        value={vendor.bankName}
                      />
                      <InfoRow
                        icon={CreditCard}
                        label="Account No"
                        value={vendor.bankAccount}
                        mono
                      />
                      <InfoRow
                        icon={Hash}
                        label="IFSC Code"
                        value={vendor.bankIfsc}
                        mono
                        last
                      />
                    </div>
                  </Panel>
                )}

                {/* Payment terms */}
                <Panel>
                  <PanelHead icon={CreditCard} title="Payment Terms" />
                  <div className="px-5 py-1 pb-3">
                    <InfoRow
                      icon={Clock}
                      label="Credit Days"
                      value={
                        num(vendor.creditDays) > 0
                          ? `${vendor.creditDays} days`
                          : "Immediate"
                      }
                    />
                    <InfoRow
                      icon={FileText}
                      label="Payment Terms"
                      value={vendor.paymentTerms || "—"}
                      last
                    />
                  </div>
                </Panel>

                {/* Notes */}
                {vendor.notes && (
                  <Panel>
                    <PanelHead icon={FileText} title="Notes" />
                    <div className="px-5 py-4">
                      <p className="text-[12px] text-slate-600 leading-relaxed">
                        {vendor.notes}
                      </p>
                    </div>
                  </Panel>
                )}

                {/* Account metadata */}
                <Panel>
                  <PanelHead icon={Clock} title="Account Info" />
                  <div className="px-5 py-1 pb-3">
                    <InfoRow
                      icon={Calendar}
                      label="Created"
                      value={
                        vendor.createdAt
                          ? formatDate(vendor.createdAt, "long")
                          : "—"
                      }
                    />
                    <InfoRow
                      icon={Calendar}
                      label="Updated"
                      value={
                        vendor.updatedAt
                          ? formatDate(vendor.updatedAt, "long")
                          : "—"
                      }
                      last
                    />
                  </div>
                </Panel>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default VendorDetailsPage;
