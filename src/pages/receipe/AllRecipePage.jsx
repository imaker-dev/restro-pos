import { useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRecipes } from "../../redux/slices/recipeSlice";
import LoadingOverlay from "../../components/LoadingOverlay";
import StatCard from "../../components/StatCard";
import { formatNumber } from "../../utils/numberFormatter";
import NoDataFound from "../../layout/NoDataFound";
import { useNavigate } from "react-router-dom";
import { Plus, BookOpen, TrendingUp, Percent, Star } from "lucide-react";
import { RecipeCard } from "../../partial/recipe/RecipeCard";
import SearchBar from "../../components/SearchBar";
import { RecipeCardSkeleton } from "../../partial/recipe/RecipeCardSkeleton";

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */
const AllRecipePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { outletId } = useSelector((state) => state.auth);
  const { isFetchingRecipes, allRecipes } = useSelector(
    (state) => state.recipe,
  );
  const { recipes = [], summary, costingMethod, pagination } = allRecipes || {};

  useEffect(() => {
    if (outletId) dispatch(fetchAllRecipes(outletId));
  }, [outletId]);

  const actions = [
    {
      label: "Add New Recipe",
      type: "primary",
      icon: Plus,
      onClick: () => navigate("/recipes/add"),
    },
  ];


  const stats = [
    {
      title: "Total Recipes",
      value: formatNumber(summary?.totalRecipes),
      subtitle: `${summary?.linkedToMenu} linked to menu`,
      icon: BookOpen,
      color: "slate",
    },
    {
      title: "Avg Food Cost",
      value: `${summary?.avgFoodCostPercentage}%`,
      subtitle: `Target: below 30%`,
      icon: Percent,
      color:
        summary?.avgFoodCostPercentage <= 30
          ? "green"
          : summary?.avgFoodCostPercentage <= 40
            ? "amber"
            : "red",
    },
    {
      title: "Avg Profit Margin",
      value: `${summary?.avgProfitPercentage}%`,
      subtitle: "Across all recipes",
      icon: TrendingUp,
      color: "green",
    },
    {
      title: "Profitable",
      value: `${summary?.recipesWithProfit} / ${summary?.totalRecipes}`,
      subtitle: `${summary?.recipesWithLoss} at loss`,
      icon: Star,
      color: summary?.recipesWithLoss > 0 ? "amber" : "green",
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="All Recipes" actions={actions} />

      {/* ── Summary KPIs ── */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s) => (
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

      <SearchBar />

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
    </div>
  );
};

export default AllRecipePage;
