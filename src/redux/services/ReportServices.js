import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getDailySalesReportApi: ({ outletId, dateRange }) => {
        const params = new URLSearchParams();

        if (dateRange?.startDate) {
          params.append("startDate", dateRange.startDate);
        }

        if (dateRange?.endDate) {
          params.append("endDate", dateRange.endDate);
        }

        const query = params.toString();

        return Api.get(
          `/orders/reports/${outletId}/daily-sales${query ? `?${query}` : ""}`,
        );
      },
    };
