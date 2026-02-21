import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getDashboardStatsApi: (outletId, dateRange = {}) => {
        let url = `/reports/dashboard?outletId=${outletId}`;

        if (dateRange?.startDate) {
          url += `&start_date=${encodeURIComponent(dateRange.startDate)}`;
        }

        if (dateRange?.endDate) {
          url += `&end_date=${encodeURIComponent(dateRange.endDate)}`;
        }

        return Api.get(url);
      },
      getDailyEndSummaryApi: (outletId, dateRange) => {
        let url = `/reports/day-end-summary?outletId=${outletId}`;

        if (dateRange?.startDate && dateRange?.endDate) {
          url += `&startDate=${dateRange.startDate}`;
          url += `&endDate=${dateRange.endDate}`;
        }

        return Api.get(url);
      },
    };
