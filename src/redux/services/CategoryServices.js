import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllCategoriesApi: (outletId, page, limit, serviceType, search) => {
        let url = `/menu/categories/outlet/${outletId}?page=${page}&limit=${limit}`;

        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        if (serviceType) {
          url += `&serviceType=${serviceType}`;
        }

        return Api.get(url);
      },
      createCategoryApi: (values) => {
        return Api.post("/menu/categories", values);
      },
      updateCategoryApi: (id, values) => {
        return Api.put(`/menu/categories/${id}`, values);
      },
    };
