import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllItemsApi: (
        outletId,
        search,
        page=1,
        limit=10,
        categoryId,
        itemType,
        serviceType,
        includeInactive,
      ) => {
        let url = `/menu/items/outlet/${outletId}?page=${page}&limit=${limit}`;

        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        if (categoryId) {
          url += `&categoryId=${categoryId}`;
        }
        if (itemType) {
          url += `&itemType=${itemType}`;
        }
        if (serviceType) {
          url += `&serviceType=${serviceType}`;
        }

        if (includeInactive !== undefined && includeInactive !== "") {
          url += `&includeInactive=${includeInactive}`;
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
