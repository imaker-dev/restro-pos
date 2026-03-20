import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllRecipesApi: (outletId) => {
        return Api.get(`/recipes/${outletId}/recipes`);
      },
      getRecipeByIdApi: (id) => {
        return Api.get(`/recipes/recipes/${id}`);
      },
      createRecipeApi: (outletId, values) => {
        return Api.post(`/recipes/${outletId}/recipes`, values);
      },
      updateRecipeApi: (id, values) => {
        return Api.put(`/recipes/recipes/${id}`, values);
      },

      // pre production food receipe api
      getAllProductionRecipesApi: (outletId) => {
        return Api.get(`/production/${outletId}/recipes`);
      },
      getProductionRecipeByIdApi: (id) => {
        return Api.get(`/production/recipes/${id}`);
      },
      createProductionRecipeApi: (outletId, values) => {
        return Api.post(`/production/${outletId}/recipes`, values);
      },
      updateProductionRecipeApi: (id, values) => {
        return Api.put(`/production/recipes/${id}`, values);
      },
    };
