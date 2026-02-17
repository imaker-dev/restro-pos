import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllItemsApi: (outletId, search) => {
        let url = `/menu/items/outlet/${outletId}`;

        if (search) {
          url += `?search=${encodeURIComponent(search)}`;
        }

        return Api.get(url);
      },

      getAllItemsByCategoryApi: (categoryId) => {
        return Api.get(`/menu/items/category/${categoryId}`);
      },
      getItemByIdApi: (itemId) => {
        return Api.get(`/menu/items/${itemId}`);
      },
      createItemApi: (values) => {
        return Api.post(`/menu/items`, values);
      },
      updateItemApi: (id, values) => {
        return Api.patch(`/menu/items/${id}`, values);
      },
    };
