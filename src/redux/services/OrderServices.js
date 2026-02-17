import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllOrdersApi: (outletId) => {
        return Api.get(`/orders/outlets/${outletId}`);
      },
      getOrdersByIdApi: (orderId) => {
        return Api.get(`/orders/${orderId}`);
      },
    };
