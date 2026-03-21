import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getStockSummaryApi: (outletId) => {
        return Api.get(`/inventory/${outletId}/stock-summary`);
      },
      getAllInventoryCategoryApi: (outletId) => {
        return Api.get(`/inventory/${outletId}/categories`);
      },
      createInventoryCategoryApi: (outletId, values) => {
        return Api.post(`/inventory/${outletId}/categories`, values);
      },
      updateInventoryCategoryApi: (id, values) => {
        return Api.put(`/inventory/categories/${id}`, values);
      },
      getAllInventoryItemApi: (outletId, page = 1, limit = 20, search) => {
        return Api.get(`/inventory/${outletId}/items`, {
          params: {
            page,
            limit,
            ...(search && { search }),
          },
        });
      },
      getInventoryItemByIdApi: (id) => {
        return Api.get(`/inventory/items/${id}`);
      },
      createInventoryItemApi: (outletId, values) => {
        return Api.post(`/inventory/${outletId}/items`, values);
      },
      updateInventoryItemApi: (id, values) => {
        return Api.put(`/inventory/items/${id}`, values);
      },
      createPurchaseApi: (outletId, values) => {
        return Api.post(`/inventory/${outletId}/purchases`, values);
      },
      getAllPurchaseApi: (
        outletId,
        page = 1,
        limit = 10,
        search,
        dateRange,
      ) => {
        const params = new URLSearchParams({
          page,
          limit,
        });

        if (dateRange?.startDate && dateRange?.endDate) {
          params.append("startDate", dateRange.startDate);
          params.append("endDate", dateRange.endDate);
        }

        if (search) {
          params.append("search", search);
        }

        const url = `/inventory/${outletId}/purchases?${params.toString()}`;
        return Api.get(url);
      },
      getPurchaseByIdApi: (id) => {
        return Api.get(`/inventory/purchases/${id}`);
      },
      updatePurchasePaymentApi: (id, values) => {
        return Api.put(`/inventory/purchases/${id}/payment`, values);
      },
      cancelPurchaseApi: (id, reason) => {
        return Api.post(`/inventory/purchases/${id}/cancel`, { reason });
      },
      getAllMovementsApi: (outletId, page, limit, dateRange, search, type) => {
        const params = new URLSearchParams({
          page,
          limit,
        });

        // Add date range if provided
        if (dateRange?.startDate && dateRange?.endDate) {
          params.append("startDate", dateRange.startDate);
          params.append("endDate", dateRange.endDate);
        }

        // Add search if provided
        if (search) {
          params.append("search", search);
        }

        // Add type if provided
        if (type) {
          params.append("movementType", type);
        }

        const url = `/inventory/${outletId}/movements?${params.toString()}`;
        return Api.get(url);
      },
      createAdjustmentApi: (outletId, values) => {
        return Api.post(`/inventory/${outletId}/adjustments`, values);
      },
      createWastageApi: (outletId, values) => {
        return Api.post(`/inventory/${outletId}/wastage`, values);
      },
      getAllWastageLogsApi: ({ outletId, page, limit, search, dateRange }) => {
        return Api.get(`/wastage/${outletId}`, {
          params: {
            page,
            limit,
            ...(search?.trim() && { search: search.trim() }),
            ...(dateRange?.startDate && { startDate: dateRange.startDate }),
            ...(dateRange?.endDate && { endDate: dateRange.endDate }),
          },
        });
      },
    };
