import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllCategoriesApi: (outletId) => {
        return Api.get(`/menu/categories/outlet/${outletId}`);
      },
      createCategoryApi: (values) => {
        return Api.post("/menu/categories", values);
      },
      updateCategoryApi: (id, values) => {
        return Api.put(`/menu/categories/${id}`, values);
      },
    };
