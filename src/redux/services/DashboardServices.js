import Api from "../api.js";
import { cleanParams } from "../../utils/cleanParams.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getDashboardStatsApi: (outletId, dateRange = {}) => {
        const params = cleanParams({
          outletId,
          start_date: dateRange?.startDate, // mapping handled here
          end_date: dateRange?.endDate,
        });

        return Api.get(`/reports/dashboard`, { params });
      },

      getDailyEndSummaryApi: (outletId, dateRange = {}) => {
        const params = cleanParams({
          outletId,
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/reports/day-end-summary`, { params });
      },

      getDailyEndSummaryDetailsApi: (outletId, date) => {
        const params = cleanParams({
          outletId,
          startDate: date,
          endDate: date,
        });

        return Api.get(`/reports/day-end-summary/detail`, { params });
      },
    };
