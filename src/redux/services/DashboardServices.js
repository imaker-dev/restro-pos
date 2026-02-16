import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getDashboardStatsApi: (outletId, dateRange) => {
        const params = {};

        if (dateRange?.startDate && dateRange?.endDate) {
          params.start_date = dateRange.startDate;
          params.end_date = dateRange.endDate;
        }

        return Api.get(`/orders/reports/${outletId}/dashboard`, { params });
      },
    };
