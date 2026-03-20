import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllIngredientsApi: (outletId) => {
            return Api.get(`/recipes/${outletId}/ingredients`);
        },
        getIngredientByIdApi:(id) => {
            return Api.get(`/recipes/ingredients/${id}`)
        },
        createIngredientApi:(outletId,values) => {
            return Api.post(`/recipes/${outletId}/ingredients/bulk`,values)
        },
        updateIngredientApi:(id,values) => {
            return Api.put(`/recipes/ingredients/${id}`,values)
        }
    };
