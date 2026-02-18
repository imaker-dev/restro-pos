import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllOrdersApi: (
        outletId,
        page,
        limit,
        search,
        dateRange,
        orderStatus,
        orderType,
        paymentStatus,
        sortBy,
        sortOrder,
      ) => {
        let url = `/orders/admin/list?page=${page}&limit=${limit}`;

        // Outlet
        if (outletId) {
          url += `&outletId=${encodeURIComponent(outletId)}`;
        }

        // Search
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }

        // Date Range
        if (dateRange?.startDate && dateRange?.endDate) {
          url += `&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
        }

        // Order Status
        if (orderStatus) {
          url += `&status=${encodeURIComponent(orderStatus)}`;
        }

        // Order Type
        if (orderType) {
          url += `&orderType=${encodeURIComponent(orderType)}`;
        }

        // Payment Status
        if (paymentStatus) {
          url += `&paymentStatus=${encodeURIComponent(paymentStatus)}`;
        }

        // Sorting
        if (sortBy) {
          url += `&sortBy=${encodeURIComponent(sortBy)}`;
        }

        if (sortOrder) {
          url += `&sortOrder=${encodeURIComponent(sortOrder)}`; // asc / desc
        }

        return Api.get(url);
      },
      getOrdersByIdApi: (orderId) => {
        return Api.get(`/orders/${orderId}`);
        // return Api.get(`/orders/admin/detail/${orderId}`);
      },
      downlaodOrderInvoiceApi:(orderId) => {
        return Api.get(`/orders/${orderId}/invoice`,{responseType:"blob"})
      }
    };
