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

      getDailyReportDetailsApi: (outletId, date, page, limit) => {
        return Api.get(
          `/orders/reports/${outletId}/daily-sales/detail?startDate=${date}&endDate=${date}&page=${page}&limit=${limit}`,
        );
      },

      getItemSalesReportApi: (outletId, dateRange) => {
        const params = new URLSearchParams();

        if (dateRange?.startDate) {
          params.append("startDate", dateRange.startDate);
        }
        if (dateRange?.endDate) {
          params.append("endDate", dateRange.endDate);
        }
        const query = params.toString();
        return Api.get(
          `/orders/reports/${outletId}/item-sales${query ? `?${query}` : ""}`,
        );
      },

      getCategorySalesReportApi: (outletId, dateRange) => {
        const params = new URLSearchParams();

        if (dateRange?.startDate) {
          params.append("startDate", dateRange.startDate);
        }
        if (dateRange?.endDate) {
          params.append("endDate", dateRange.endDate);
        }
        const query = params.toString();
        return Api.get(
          `/orders/reports/${outletId}/category-sales${query ? `?${query}` : ""}`,
        );
      },

      getStaffSalesReportApi: (outletId, dateRange) => {
        const params = new URLSearchParams();

        if (dateRange?.startDate) {
          params.append("startDate", dateRange.startDate);
        }
        if (dateRange?.endDate) {
          params.append("endDate", dateRange.endDate);
        }
        const query = params.toString();
        return Api.get(
          `/orders/reports/${outletId}/staff${query ? `?${query}` : ""}`,
        );
      },

      getPaymentModeReportApi: (outletId, dateRange) => {
        const params = new URLSearchParams();

        if (dateRange?.startDate) {
          params.append("startDate", dateRange.startDate);
        }
        if (dateRange?.endDate) {
          params.append("endDate", dateRange.endDate);
        }
        const query = params.toString();
        return Api.get(
          `/orders/reports/${outletId}/payment-modes${query ? `?${query}` : ""}`,
        );
      },

      getTaxReportApi: (outletId, dateRange) => {
        const params = new URLSearchParams();

        if (dateRange?.startDate) {
          params.append("startDate", dateRange.startDate);
        }
        if (dateRange?.endDate) {
          params.append("endDate", dateRange.endDate);
        }
        const query = params.toString();
        return Api.get(
          `/orders/reports/${outletId}/tax${query ? `?${query}` : ""}`,
        );
      },

      getServiceTypeBreakdownReportApi: (outletId, dateRange) => {
        const params = new URLSearchParams();

        if (dateRange?.startDate) {
          params.append("startDate", dateRange.startDate);
        }
        if (dateRange?.endDate) {
          params.append("endDate", dateRange.endDate);
        }
        const query = params.toString();
        return Api.get(
          `/orders/reports/${outletId}/service-type-breakdown${query ? `?${query}` : ""}`,
        );
      },

      getRunningTableApi: (outletId) => {
        return Api.get(`/reports/running-tables?outletId=${outletId}`);
      },
      getRunnigOrderApi: (outletId) => {
        return Api.get(`/reports/running-orders?outletId=${outletId}`);
      },
    };
