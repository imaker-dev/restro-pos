import { useEffect, useState, useMemo } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createAdjustment,
  createWastage,
  fetchAllInventoryItems,
} from "../../redux/slices/inventorySlice";
import StatCard from "../../components/StatCard";
import { formatNumber } from "../../utils/numberFormatter";
import NoDataFound from "../../layout/NoDataFound";
import {
  Plus,
  Package,
  AlertTriangle,
  Thermometer,
  ShieldAlert,
} from "lucide-react";
import InventoryItemCard from "../../partial/inventory/inventory/InventoryItemCard";
import StockAdjustOverlay from "../../partial/inventory/inventory/StockAdjustOverlay";
import SearchBar from "../../components/SearchBar";
import InventoryItemWastageoverlay from "../../partial/inventory/inventory/InventoryItemWastageoverlay";
import { handleResponse } from "../../utils/helpers";
import InventoryItemCardSkeleton from "../../partial/inventory/inventory/InventoryItemCardSkeleton";

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */
const InventoryItemPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { outletId } = useSelector((state) => state.auth);
  const {
    allItemsData,
    isFetchingItems,
    isCreatingAdjustment,
    isCreatingWastage,
  } = useSelector((state) => state.inventory);
  const { items = [], pagination } = allItemsData || {};

  const [showAdjust, setShowAdjust] = useState(false);
  const [showWastage, setShowWastage] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchInventory = () => {
    dispatch(fetchAllInventoryItems(outletId));
  };
  useEffect(() => {
    if (!outletId) return;
    fetchInventory();
  }, [outletId]);

  /* ── derived stats ── */
  const lowStockItems = items.filter(
    (i) => i.isLowStock && i.currentStock > 0,
  ).length;
  const outOfStock = items.filter((i) => i.currentStock <= 0).length;
  const perishable = items.filter((i) => i.isPerishable).length;

  /* ── unique categories for filter ── */
  const categories = useMemo(
    () => [...new Set(items.map((i) => i.categoryName).filter(Boolean))].sort(),
    [items],
  );

  const actions = [
    {
      label: "Add New Item",
      type: "primary",
      icon: Plus,
      onClick: () => navigate("/inventory-items/add"),
    },
  ];

  const resetStates = () => {
    setShowAdjust(false);
    setShowWastage(false);
    setSelectedItem(null);
  };

  async function handleAdjustConfirm(values, reset) {
    await handleResponse(
      dispatch(createAdjustment({ outletId, values })),
      () => {
        fetchInventory();
        resetStates();
        reset();
      },
    );
  }

  async function handleWastageConfirm(values, reset) {
    await handleResponse(dispatch(createWastage({ outletId, values })), () => {
      fetchInventory();
      resetStates();
      reset();
    });
  }

  return (
    <>
      <div className="space-y-5">
        <PageHeader title="Inventory Items" actions={actions} />

        {/* ── Summary KPIs ── */}
        {items.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                title: "Total Items",
                value: formatNumber(pagination?.total),
                subtitle: `${categories.length} categories`,
                icon: Package,
                color: "slate",
              },
              {
                title: "Low Stock",
                value: formatNumber(lowStockItems),
                subtitle: "Needs reorder",
                icon: AlertTriangle,
                color: lowStockItems > 0 ? "amber" : "green",
              },
              {
                title: "Out of Stock",
                value: formatNumber(outOfStock),
                subtitle: "Zero inventory",
                icon: ShieldAlert,
                color: outOfStock > 0 ? "red" : "green",
              },
              {
                title: "Perishable",
                value: formatNumber(perishable),
                subtitle: "Temperature sensitive",
                icon: Thermometer,
                color: "violet",
              },
            ].map((s) => (
              <StatCard
                key={s.title}
                icon={s.icon}
                title={s.title}
                value={s.value}
                subtitle={s.subtitle}
                color={s.color}
                variant="v9"
              />
            ))}
          </div>
        )}

        <SearchBar placeholder="Search by name, SKU, category…" />

        {/* ── Alerts strip ── */}
        {(lowStockItems > 0 || outOfStock > 0) && (
          <div className="flex flex-wrap gap-3">
            {outOfStock > 0 && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                <ShieldAlert
                  size={14}
                  className="text-red-500 flex-shrink-0"
                  strokeWidth={2}
                />
                <p className="text-[12px] font-bold text-red-700">
                  {outOfStock} item{outOfStock !== 1 ? "s" : ""} out of stock —
                  needs immediate restocking
                </p>
              </div>
            )}
            {lowStockItems > 0 && (
              <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
                <AlertTriangle
                  size={14}
                  className="text-amber-500 flex-shrink-0"
                  strokeWidth={2}
                />
                <p className="text-[12px] font-bold text-amber-700">
                  {lowStockItems} item{lowStockItems !== 1 ? "s" : ""} running
                  low — reorder soon
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Item grid ── */}
        {isFetchingItems ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, idx) => (
              <InventoryItemCardSkeleton key={idx} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <InventoryItemCard
                key={item.id}
                item={item}
                onAdjust={(item) => {
                  (setSelectedItem(item), setShowAdjust(true));
                }}
                onWastage={(item) => {
                  (setSelectedItem(item), setShowWastage(true));
                }}
              />
            ))}
          </div>
        ) : (
          <NoDataFound
            icon={Package}
            title={
              items.length === 0
                ? "No inventory items yet"
                : "No items match your filters"
            }
            className="bg-white"
          />
        )}
      </div>

      <StockAdjustOverlay
        isOpen={showAdjust}
        onClose={resetStates}
        item={selectedItem}
        onConfirm={handleAdjustConfirm}
        loading={isCreatingAdjustment}
      />

      <InventoryItemWastageoverlay
        isOpen={showWastage}
        onClose={resetStates}
        item={selectedItem}
        onConfirm={handleWastageConfirm}
        loading={isCreatingWastage}
      />
    </>
  );
};

export default InventoryItemPage;
