import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../../hooks/useQueryParams";
import { fetchProductionRecipeById } from "../../redux/slices/recipeSlice";
import {
  ArrowLeft,
  ChefHat,
  Clock,
  Package,
  FlaskConical,
  IndianRupee,
  Pencil,
  Hash,
  AlertTriangle,
  CheckCircle2,
  Layers,
  FileText,
  TrendingUp,
} from "lucide-react";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber, num } from "../../utils/numberFormatter";
import PageHeader from "../../layout/PageHeader";

const fmt = (v) => formatNumber(v, true);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-[160px] rounded-2xl bg-slate-200" />
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
        <div className="h-[260px] rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}

// ─── Stat tile ─────────────────────────────────────────────────────────────────
function StatTile({ icon: Icon, label, value, sub, dark = false }) {
  return (
    <div
      className={`rounded-2xl p-4 border ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
      style={{
        boxShadow: dark
          ? "0 4px 14px rgba(0,0,0,0.18)"
          : "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <p
          className={`text-[9px] font-black uppercase tracking-[0.13em] ${dark ? "text-white/45" : "text-slate-400"}`}
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
        className={`text-[22px] font-black tabular-nums leading-none ${dark ? "text-white" : "text-slate-900"}`}
      >
        {value}
      </p>
      {sub && (
        <p
          className={`text-[10px] font-medium mt-1.5 ${dark ? "text-white/40" : "text-slate-400"}`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────
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
        <p className="text-[13px] font-black text-slate-800 leading-none">
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

// ─── Ingredient row ───────────────────────────────────────────────────────────
function IngredientRow({ ingredient, index, totalCost, last }) {
  const costShare =
    num(totalCost) > 0 ? (num(ingredient.liveCost) / num(totalCost)) * 100 : 0;
  const stockOk = num(ingredient.currentStock) > 0;

  return (
    <div
      className={`flex items-center gap-4 px-5 py-3.5 ${!last ? "border-b border-slate-100" : ""} hover:bg-slate-50/60 transition-colors duration-100`}
    >
      {/* Index */}
      <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <span className="text-[10px] font-black text-slate-600">
          {index + 1}
        </span>
      </div>

      {/* Name + SKU */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-slate-800 leading-tight">
          {ingredient.itemName}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <p className="text-[10px] text-slate-400 font-mono">
            {ingredient.itemSku}
          </p>
          {ingredient.notes && (
            <>
              <span className="text-slate-300 text-[10px]">·</span>
              <p className="text-[10px] text-slate-400 italic">
                {ingredient.notes}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Quantity */}
      <div className="text-right flex-shrink-0 hidden sm:block">
        <p className="text-[13px] font-bold text-slate-800 tabular-nums">
          {num(ingredient.quantity)} {ingredient.unitAbbreviation}
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">required</p>
      </div>

      {/* Stock */}
      <div className="text-right flex-shrink-0 hidden md:block w-24">
        <div
          className={`flex items-center justify-end gap-1 ${stockOk ? "text-emerald-600" : "text-rose-500"}`}
        >
          {stockOk ? (
            <CheckCircle2 size={10} strokeWidth={2.5} />
          ) : (
            <AlertTriangle size={10} strokeWidth={2.5} />
          )}
          <p className="text-[11px] font-bold tabular-nums">
            {num(ingredient.currentStock)} {ingredient.stockUnitAbbreviation}
          </p>
        </div>
        <p className="text-[9px] text-slate-400 mt-0.5 text-right">in stock</p>
      </div>

      {/* Cost + share bar */}
      <div className="text-right flex-shrink-0 w-20">
        <p className="text-[13px] font-bold text-slate-900 tabular-nums">
          {fmt(ingredient.liveCost)}
        </p>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const ProductionRecipeDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { recipeId } = useQueryParams();

  const { isFetchingProductionRecipeDetails, productionRecipeDetails: recipe } =
    useSelector((s) => s.recipe);

  useEffect(() => {
    if (!recipeId) return;
    dispatch(fetchProductionRecipeById(recipeId));
  }, [recipeId]);

  return (
    <div className="space-y-5 pb-10">
      <PageHeader onlyBack backLabel="Back to Recipes" />

      {isFetchingProductionRecipeDetails && <Skeleton />}

      {recipe && !isFetchingProductionRecipeDetails && (
        <>
          {/* ── HERO ─────────────────────────────────────────── */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
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
              className="absolute -top-14 -right-14 w-52 h-52 rounded-full pointer-events-none opacity-20"
              style={{
                background:
                  "radial-gradient(circle,rgba(99,102,241,0.6),transparent 70%)",
              }}
            />

            <div className="relative z-10 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                {/* Left: identity */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
                    <ChefHat
                      size={24}
                      className="text-white/75"
                      strokeWidth={1.7}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h1 className="text-[22px] font-black text-white leading-none">
                        {recipe.name}
                      </h1>
                      {recipe.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-white/10 text-white/50 border border-white/15">
                          INACTIVE
                        </span>
                      )}
                    </div>
                    {recipe.description && (
                      <p className="text-[11px] text-white/45 font-medium leading-snug">
                        {recipe.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: cost per unit */}
                <div className="flex-shrink-0 sm:text-right">
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.15em] mb-1">
                    Cost Per Output Unit
                  </p>
                  <p className="text-[34px] font-black text-white tabular-nums leading-none">
                    {fmt(recipe.costPerOutputUnit)}
                  </p>
                  <p className="text-[10px] text-white/30 font-medium mt-1.5">
                    per {recipe.outputUnitAbbreviation}
                  </p>
                </div>
              </div>

              {/* 3-col strip */}
              <div className="grid grid-cols-3 gap-2 mt-5">
                {[
                  {
                    icon: Package,
                    label: "Output",
                    value: `${recipe.outputQuantity} ${recipe.outputUnitAbbreviation}`,
                    sub: recipe.outputItemName,
                  },
                  {
                    icon: Clock,
                    label: "Prep Time",
                    value: `${recipe.preparationTimeMins} min`,
                    sub: "Preparation time",
                  },
                  {
                    icon: FlaskConical,
                    label: "Ingredients",
                    value: recipe.ingredients?.length || 0,
                    sub: "Components used",
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
                      <p className="text-[13px] font-black text-white/80 tabular-nums leading-tight truncate">
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

          {/* ── 4 KPI TILES ──────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatTile
              dark
              icon={IndianRupee}
              label="Total Input Cost"
              value={fmt(recipe.totalInputCost)}
              sub="All ingredients"
            />
            <StatTile
              icon={TrendingUp}
              label="Cost Per Output"
              value={fmt(recipe.costPerOutputUnit)}
              sub={`per ${recipe.outputUnitAbbreviation}`}
            />
            <StatTile
              icon={Package}
              label="Output Quantity"
              value={`${recipe.outputQuantity} ${recipe.outputUnitAbbreviation}`}
              sub={recipe.outputItemName}
            />
            <StatTile
              icon={Clock}
              label="Prep Time"
              value={`${recipe.preparationTimeMins}m`}
              sub="Minutes required"
            />
          </div>

          {/* ── MAIN GRID ────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* LEFT: ingredients + instructions */}
            <div className="lg:col-span-2 space-y-4">
              {/* Ingredients */}
              <Panel>
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0">
                      <FlaskConical
                        size={13}
                        className="text-white"
                        strokeWidth={2}
                      />
                    </div>
                    <div>
                      <p className="text-[13px] font-black text-slate-800 leading-none">
                        Ingredients
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                        {recipe.ingredients?.length || 0} components ·{" "}
                        {fmt(recipe.totalInputCost)} total
                      </p>
                    </div>
                  </div>
                  {/* Column headers */}
                  <div className="hidden md:flex items-center gap-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    <span className="w-16 text-right">Stock</span>
                    <span className="w-20 text-right">Cost</span>
                  </div>
                </div>

                {recipe.ingredients?.length > 0 ? (
                  <>
                    {recipe.ingredients.map((ing, i) => (
                      <IngredientRow
                        key={ing.id}
                        ingredient={ing}
                        index={i}
                        totalCost={recipe.totalInputCost}
                        last={i === recipe.ingredients.length - 1}
                      />
                    ))}
                    {/* Cost footer */}
                    <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-slate-200">
                      <span className="text-[11px] font-semibold text-slate-500">
                        Total ingredient cost
                      </span>
                      <span className="text-[14px] font-black text-slate-900 tabular-nums">
                        {fmt(recipe.totalInputCost)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <FlaskConical
                      size={24}
                      className="text-slate-300 mb-2"
                      strokeWidth={1.3}
                    />
                    <p className="text-[12px] font-bold text-slate-400">
                      No ingredients added
                    </p>
                  </div>
                )}
              </Panel>

              {/* Instructions */}
              {recipe.instructions && (
                <Panel>
                  <PanelHead
                    icon={FileText}
                    title="Preparation Instructions"
                    subtitle="Step-by-step guide"
                  />
                  <div className="px-5 py-4">
                    <div className="space-y-1.5">
                      {recipe.instructions
                        .split("\n")
                        .filter(Boolean)
                        .map((step, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className="text-[11px] font-black text-slate-400 tabular-nums mt-0.5 flex-shrink-0 w-4">
                              {i + 1}.
                            </span>
                            <p className="text-[12.5px] text-slate-700 font-medium leading-snug">
                              {step.replace(/^\d+\.\s*/, "")}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </Panel>
              )}
            </div>

            {/* RIGHT: recipe info + output item */}
            <div className="space-y-4">
              {/* Output item */}
              <Panel>
                <PanelHead
                  icon={Package}
                  title="Output Item"
                  subtitle="What this recipe produces"
                />
                <div className="px-5 py-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                      <Layers
                        size={16}
                        className="text-slate-500"
                        strokeWidth={1.8}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-black text-slate-800 leading-tight">
                        {recipe.outputItemName}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {recipe.outputItemSku}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-0">
                    {[
                      {
                        label: "Quantity",
                        value: `${recipe.outputQuantity} ${recipe.outputUnitAbbreviation}`,
                      },
                      { label: "Unit", value: recipe.outputUnitName },
                      {
                        label: "Unit Cost",
                        value: fmt(recipe.costPerOutputUnit),
                      },
                    ].map(({ label, value }, i, arr) => (
                      <div
                        key={label}
                        className={`flex items-center justify-between py-2.5 ${i < arr.length - 1 ? "border-b border-slate-100" : ""}`}
                      >
                        <span className="text-[12px] text-slate-500 font-medium">
                          {label}
                        </span>
                        <span className="text-[12px] font-bold text-slate-800 tabular-nums">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>

              {/* Recipe info */}
              <Panel>
                <PanelHead icon={Hash} title="Recipe Info" />
                <div className="px-5 py-1 pb-3">
                  {[
                    { label: "Recipe ID", value: `#${recipe.id}` },
                    {
                      label: "Created",
                      value: recipe.createdAt
                        ? formatDate(recipe.createdAt, "long")
                        : "—",
                    },
                    {
                      label: "Updated",
                      value: recipe.updatedAt
                        ? formatDate(recipe.updatedAt, "long")
                        : "—",
                    },
                    { label: "Created By", value: recipe.createdByName || "—" },
                    { label: "Runs", value: recipe.productionCount || 0 },
                  ].map(({ label, value }, i, arr) => (
                    <div
                      key={label}
                      className={`flex items-center justify-between py-2.5 ${i < arr.length - 1 ? "border-b border-slate-100" : ""}`}
                    >
                      <span className="text-[12px] text-slate-500 font-medium">
                        {label}
                      </span>
                      <span className="text-[12px] font-bold text-slate-800 tabular-nums">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* Edit CTA */}
              <button
                onClick={() =>
                  navigate(`/prep-recipes/edit?recipeId=${recipe.id}`)
                }
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-[12px] font-black text-white transition-all hover:shadow-md hover:-translate-y-px"
                style={{
                  background: "linear-gradient(135deg,#0f172a,#1e293b)",
                  boxShadow: "0 2px 8px rgba(15,23,42,0.25)",
                }}
              >
                <Pencil size={13} strokeWidth={2} />
                Edit Recipe
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductionRecipeDetailsPage;
