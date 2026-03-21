import { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRecipes } from "../../redux/slices/recipeSlice";
import LoadingOverlay from "../../components/LoadingOverlay";
import StatCard from "../../components/StatCard";
import { formatNumber } from "../../utils/numberFormatter";
import NoDataFound from "../../layout/NoDataFound";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  BookOpen,
  TrendingUp,
  Percent,
  Star,
  Wallet,
  IndianRupee,
} from "lucide-react";
import { RecipeCard } from "../../partial/recipe/RecipeCard";
import SearchBar from "../../components/SearchBar";
import { RecipeCardSkeleton } from "../../partial/recipe/RecipeCardSkeleton";
import Pagination from "../../components/Pagination";

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */
const AllRecipePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const { outletId } = useSelector((state) => state.auth);
  const { isFetchingRecipes, allRecipes } = useSelector(
    (state) => state.recipe,
  );

  const { recipes = [], summary, costingMethod, pagination } = allRecipes || {};

  const fetchRecipes = () => {
    if (!outletId) return;
    dispatch(
      fetchAllRecipes({
        outletId,
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      }),
    );
  };

  useEffect(() => {
    fetchRecipes();
  }, [outletId, currentPage, itemsPerPage, searchTerm]);

  const actions = [
    {
      label: "Add New Recipe",
      type: "primary",
      icon: Plus,
      onClick: () => navigate("/recipes/add"),
    },
  ];

  const stats = [
    // CORE
    {
      title: "Total Recipes",
      value: formatNumber(summary?.totalRecipes),
      subtitle: `${summary?.linkedToMenu} linked • ${summary?.unlinked} unlinked`,
      icon: BookOpen,
      color: "slate",
    },

    // REVENUE
    {
      title: "Total Revenue",
      value: `${formatNumber(summary?.totalSellingPrice, true)}`,
      subtitle: "Total selling value",
      icon: TrendingUp,
      color: "green",
    },

    // COST
    {
      title: "Total Cost",
      value: `${formatNumber(summary?.totalMakingCost, true)}`,
      subtitle: "Total making cost",
      icon: Wallet,
      color: "red",
    },

    // PROFIT
    {
      title: "Total Profit",
      value: `${formatNumber(summary?.totalProfit, true)}`,
      subtitle: summary?.totalProfit >= 0 ? "Overall profit" : "Overall loss",
      icon: IndianRupee,
      color: summary?.totalProfit >= 0 ? "green" : "red",
    },

    // FOOD COST %
    {
      title: "Food Cost %",
      value: `${summary?.avgFoodCostPercentage}%`,
      subtitle: "Target: < 30%",
      icon: Percent,
      color:
        summary?.avgFoodCostPercentage <= 30
          ? "green"
          : summary?.avgFoodCostPercentage <= 40
            ? "amber"
            : "red",
    },

    // PROFIT %
    {
      title: "Profit Margin",
      value: `${summary?.avgProfitPercentage}%`,
      subtitle: "Average margin",
      icon: TrendingUp,
      color:
        summary?.avgProfitPercentage >= 70
          ? "green"
          : summary?.avgProfitPercentage >= 50
            ? "amber"
            : "red",
    },

    // PERFORMANCE
    {
      title: "Profitable Recipes",
      value: `${summary?.recipesWithProfit} / ${summary?.totalRecipes}`,
      subtitle: `${summary?.recipesWithLoss} loss-making`,
      icon: Star,
      color: summary?.recipesWithLoss > 0 ? "amber" : "green",
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="All Recipes" actions={actions} />

      {/* ── Summary KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {stats.map((s) => (
          <StatCard
            key={s.title}
            icon={s.icon}
            title={s.title}
            value={s.value}
            subtitle={s.subtitle}
            color={s.color}
            variant="v9"
            loading={isFetchingRecipes}
          />
        ))}
      </div>

      <SearchBar onSearch={(v) => setSearchTerm(v)}/>

      {/* Recipe grid */}
      {isFetchingRecipes ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      ) : recipes?.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      ) : (
        <NoDataFound
          icon={BookOpen}
          title={
            recipes?.length === 0
              ? "No recipes yet"
              : "No recipes match your filters"
          }
          className="bg-white"
        />
      )}

      <Pagination
        totalItems={pagination?.total}
        currentPage={currentPage}
        pageSize={itemsPerPage}
        totalPages={pagination?.totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        maxPageNumbers={5}
        showPageSizeSelector={true}
        onPageSizeChange={(size) => {
          setCurrentPage(1);
          setItemsPerPage(size);
        }}
      />
    </div>
  );
};

export default AllRecipePage;
