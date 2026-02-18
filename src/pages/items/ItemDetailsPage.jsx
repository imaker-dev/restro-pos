import React, { useEffect } from "react";
import {
  Package,
  Clock,
  Flame,
  AlertTriangle,
  Star,
  TrendingUp,
  Sparkles,
  Edit,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  ChefHat,
  MapPin,
  IndianRupee,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../../hooks/useQueryParams";
import { fetchItemsById } from "../../redux/slices/itemSlice";
import PageHeader from "../../layout/PageHeader";
import LoadingOverlay from "../../components/LoadingOverlay";

// ─── Badge Component ───────────────────────────────────────────────────────────
function Badge({ icon: Icon, label, color = "gray" }) {
  const colors = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    yellow: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    gray: "bg-gray-50 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${colors[color]}`}
    >
      {Icon && <Icon size={11} strokeWidth={2.5} />}
      {label}
    </span>
  );
}

// ─── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, badge }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center">
        <Icon size={14} className="text-primary-600" strokeWidth={2} />
      </div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {badge && (
        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
          {badge}
        </span>
      )}
    </div>
  );
}

// ─── Info Row ──────────────────────────────────────────────────────────────────
function InfoRow({ label, value, mono = false }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs text-gray-600">{label}</span>
      <span
        className={`text-sm font-semibold text-gray-900 ${mono ? "font-mono text-xs" : ""}`}
      >
        {value || "—"}
      </span>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
const ItemDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { itemId } = useQueryParams();
  const { itemDetails: item, isFetchingItemDetails } = useSelector(
    (state) => state.item,
  );

  useEffect(() => {
    if (itemId) {
      dispatch(fetchItemsById(itemId));
    }
  }, [itemId]);

  // 1. LOADING STATE
  if (isFetchingItemDetails) {
    return <LoadingOverlay show text="Loading item..." />;
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <p>Item not found</p>
      </div>
    );
  }

  const defaultVariant =
    item?.variants?.find((v) => v?.is_default) || item?.variants?.[0];

  // Determine item type badge
  const itemTypeConfig = {
    veg: { label: "Veg", color: "green", icon: null },
    non_veg: { label: "Non-Veg", color: "red", icon: null },
    vegan: { label: "Vegan", color: "green", icon: null },
    egg: { label: "Egg", color: "yellow", icon: null },
  };

  const itemType = itemTypeConfig[item?.item_type] || itemTypeConfig.veg;

  const actions = [
    {
      label: "Edit",
      type: "primary",
      icon: Edit,
      onClick: () => navigate(`/items/add?itemId=${itemId}`),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title={"Item Details"}
          description={""}
          showBackButton
          actions={actions}
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT: Image + Primary Info */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-4 lg:sticky lg:top-20 self-start h-fit">
            {/* Image */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                {item?.image_url ? (
                  <img
                    src={item?.image_url}
                    alt={item?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={48} className="text-gray-300" />
                  </div>
                )}
              </div>

              {/* Price & Tax */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-primary-50 text-center">
                  <p className="text-xs text-primary-700 mb-0.5">Base Price</p>
                  <p className="text-lg font-bold text-primary-900">
                    ₹{item?.base_price}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 text-center">
                  <p className="text-xs text-emerald-700 mb-0.5">Tax Rate</p>
                  <p className="text-lg font-bold text-emerald-900">
                    {item?.tax_rate}%
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <SectionHeader icon={Package} title="Basic Info" />
              <div className="space-y-0 divide-y divide-gray-100">
                <InfoRow label="SKU" value={item?.sku} mono />
                <InfoRow label="Category" value={item?.category_name} />
                <InfoRow label="Tax Group" value={item?.tax_group_name} />
                <InfoRow
                  label="Prep Time"
                  value={`${item?.preparation_time_mins} min`}
                />
              </div>
            </div>
          </div>

          {/* CENTER & RIGHT: Details */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-4">
            {/* Title & Badges */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {item?.name}
              </h2>

              {/* Badges Row */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge label={itemType?.label} color={itemType?.color} />
                {item?.is_available ? (
                  <Badge icon={CheckCircle2} label="Available" color="green" />
                ) : (
                  <Badge icon={XCircle} label="Unavailable" color="red" />
                )}
                {item?.is_active && <Badge label="Active" color="blue" />}
                {item?.is_bestseller && (
                  <Badge icon={TrendingUp} label="Bestseller" color="yellow" />
                )}
                {item?.is_recommended && (
                  <Badge icon={Star} label="Recommended" color="purple" />
                )}
                {item?.is_new && (
                  <Badge icon={Sparkles} label="New" color="blue" />
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-700 leading-relaxed">
                {item?.description}
              </p>

              {/* Quick Info Pills */}
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Clock size={13} className="text-gray-400" />
                  <span className="font-medium">
                    {item?.preparation_time_mins} min prep
                  </span>
                </div>

                {item?.spice_level > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Flame size={13} className="text-orange-500" />
                    <span className="font-medium">
                      Spice {item?.spice_level}/5
                    </span>
                  </div>
                )}

                {item?.calories && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Flame size={13} className="text-amber-500" />
                    <span className="font-medium">{item?.calories} kcal</span>
                  </div>
                )}

                {item?.allergens && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <AlertTriangle size={13} className="text-amber-500" />
                    <span className="font-medium">{item?.allergens}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Two Column Grid */}
            <div className="grid grid-cols-1  gap-4">
              {/* Variants */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <SectionHeader
                  icon={ShoppingBag}
                  title="Variants"
                  badge={item?.variants?.length}
                />

                {item?.variants?.length > 0 ? (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {item?.variants?.map((variant) => (
                      <div
                        key={variant?.id}
                        className={`p-3 rounded-lg border transition-colors ${
                          variant?.is_default
                            ? "border-primary-200 bg-primary-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-sm font-semibold text-gray-900 flex-1">
                            {variant?.name}
                          </p>
                          {variant?.is_default && (
                            <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-primary-100 text-primary-700">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Price</span>
                          <span className="font-bold text-gray-900">
                            ₹{variant?.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-6">
                    No variants
                  </p>
                )}
              </div>

              {/* Kitchen Stations */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <SectionHeader
                  icon={ChefHat}
                  title="Kitchen Stations"
                  badge={item?.kitchenStations?.length}
                />

                {item?.kitchenStations?.length > 0 ? (
                  <div className="space-y-2">
                    {item?.kitchenStations?.map((station) => (
                      <div
                        key={station.id}
                        className="p-3 rounded-lg border border-gray-200 hover:border-primary-200 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {station?.name}
                          </p>
                          {station?.is_active ? (
                            <CheckCircle2
                              size={14}
                              className="text-emerald-500"
                            />
                          ) : (
                            <XCircle size={14} className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 font-mono">
                            {station?.code}
                          </span>
                          <span className="text-gray-500">
                            {station?.station_type?.replace(/_/g, " ")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-6">
                    No stations assigned
                  </p>
                )}
              </div>
            </div>

            {/* Visibility Section */}
            {item?.visibility?.floors?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <SectionHeader
                  icon={MapPin}
                  title="Floor Visibility"
                  badge={item?.visibility?.floors.length}
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                  {item?.visibility?.floors.map((floor) => (
                    <div
                      key={floor?.id}
                      className={`p-2.5 rounded-lg border text-center transition-colors ${
                        floor?.is_available
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <p className="text-xs font-semibold text-gray-900 truncate mb-0.5">
                        {floor?.name}
                      </p>
                      {floor?.price_override ? (
                        <p className="text-xs font-bold text-primary-600">
                          ₹{floor?.price_override}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500">Base price</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <SectionHeader icon={IndianRupee} title="Pricing & Tax Details" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Base Price</p>
                  <p className="text-lg font-bold text-gray-900">
                    ₹{item?.base_price}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Cost Price</p>
                  <p className="text-lg font-bold text-gray-900">
                    ₹{item?.cost_price}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tax Rate</p>
                  <p className="text-lg font-bold text-gray-900">
                    {item?.tax_rate}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tax Inclusive</p>
                  <p className="text-lg font-bold text-gray-900">
                    {item?.tax_inclusive ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              {defaultVariant && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Default Variant
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">
                      {defaultVariant?.name}
                    </p>
                    <p className="text-xl font-bold text-primary-600">
                      ₹{defaultVariant?.price}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Configuration */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <SectionHeader icon={Package} title="Configuration" />

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[
                  { label: "Customizable", value: item?.is_customizable },
                  { label: "Special Notes", value: item?.allow_special_notes },
                  { label: "Has Variants", value: item?.has_variants },
                  { label: "Has Add-ons", value: item?.has_addons },
                ].map((config, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border text-center ${
                      config?.value
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {config?.value ? (
                        <CheckCircle2 size={12} className="text-emerald-600" />
                      ) : (
                        <XCircle size={12} className="text-gray-400" />
                      )}
                    </div>
                    <p className="text-xs font-medium text-gray-700">
                      {config?.label}
                    </p>
                  </div>
                ))}

                <div className="p-2.5 rounded-lg border border-gray-200 bg-gray-50 text-center">
                  <p className="text-xs text-gray-500 mb-0.5">Min Qty</p>
                  <p className="text-sm font-bold text-gray-900">
                    {item?.min_quantity}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg border border-gray-200 bg-gray-50 text-center">
                  <p className="text-xs text-gray-500 mb-0.5">Max Qty</p>
                  <p className="text-sm font-bold text-gray-900">
                    {item?.max_quantity}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg border border-gray-200 bg-gray-50 text-center">
                  <p className="text-xs text-gray-500 mb-0.5">Step</p>
                  <p className="text-sm font-bold text-gray-900">
                    {item?.step_quantity}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemDetailsPage;
