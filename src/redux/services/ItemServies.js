import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllItemsApi: (outletId, search, page, limit,categoryId) => {
        let url = `/menu/items/outlet/${outletId}?page=${page}&limit=${limit}`;

        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        if (categoryId) {
          url += `&categoryId=${categoryId}`;
        }

        return Api.get(url);
      },

      getAllItemsByCategoryApi: (categoryId) => {
        return Api.get(`/menu/items/category/${categoryId}`);
      },
      getItemByIdApi: (itemId) => {
        return Api.get(`/menu/items/${itemId}/details`);
      },
      createItemApi: (values) => {
        return Api.post(`/menu/items`, values);
      },
      updateItemApi: (id, values) => {
        return Api.put(`/menu/items/${id}`, values);
      },
    };
