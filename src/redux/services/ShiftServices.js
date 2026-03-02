import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllShiftHistoryApi: (outletId, dateRange = {}) => {
        const { startDate, endDate } = dateRange;

        const params = {};

        if (startDate && endDate) {
          params.startDate = startDate;
          params.endDate = endDate;
        }

        return Api.get(`/orders/shifts/${outletId}/history`, { params });
      },
      getShiftSummaryApi: (outletId) => {
        return Api.get(`/orders/shifts/${outletId}/summary`);
      },
      getShiftHistoryByIdApi: (shiftId) => {
        return Api.get(`/orders/shifts/${shiftId}/detail`);
      },
    };
