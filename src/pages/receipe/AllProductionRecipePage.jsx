import React, { useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProductionRecipes } from "../../redux/slices/recipeSlice";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

const AllProductionRecipePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isFetchingProductionRecipes, allProductionRecipes } = useSelector(
    (state) => state.recipe,
  );

  useEffect(() => {
    dispatch(fetchAllProductionRecipes());
  }, []);

  const actions = [
    {
      label: "Add New Item",
      type: "primary",
      icon: Plus,
      onClick: () => navigate("/prep-recipes/add"),
    },
  ];

  return (
    <div>
      <PageHeader title={"Pre Prepared Recipe"} actions={actions} />
    </div>
  );
};

export default AllProductionRecipePage;
