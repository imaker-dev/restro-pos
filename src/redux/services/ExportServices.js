import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      exportDailySalesReportApi: (outletId, dateRange) => {
        const params = new URLSearchParams();

        if (dateRange?.startDate) {
          params.append("startDate", dateRange.startDate);
        }
        if (dateRange?.endDate) {
          params.append("endDate", dateRange.endDate);
        }
        const query = params.toString();
        return Api.get(
          `/orders/reports/${outletId}/daily-sales/export${query ? `?${query}` : ""}`,
          { responseType: "blob" },
        );
      },

      exportDailyReportDetailsApi: (outletId, date) => {
        return Api.get(
          `/orders/reports/${outletId}/daily-sales/detail/export?startDate=${date}&endDate=${date}`,{responseType:"blob"}
        );
      },

      exportItemSalesReportApi: (outletId, dateRange) => {
        const params = new URLSearchParams();

        if (dateRange?.startDate) {
          params.append("startDate", dateRange.startDate);
        }
        if (dateRange?.endDate) {
          params.append("endDate", dateRange.endDate);
        }
        const query = params.toString();
        return Api.get(
          `/orders/reports/${outletId}/item-sales/export${query ? `?${query}` : ""}`,
          { responseType: "blob" },
        );
      },

      exportCategorySalesReportApi: (outletId, dateRange) => {
        const params = new URLSearchParams();

        if (dateRange?.startDate) {
          params.append("startDate", dateRange.startDate);
        }
        if (dateRange?.endDate) {
          params.append("endDate", dateRange.endDate);
        }
        const query = params.toString();
        return Api.get(
          `/orders/reports/${outletId}/category-sales/export${query ? `?${query}` : ""}`,
          { responseType: "blob" },
        );
      },

      exportStaffSalesReportApi: (outletId, dateRange) => {
        const params = new URLSearchParams();

        if (dateRange?.startDate) {
          params.append("startDate", dateRange.startDate);
        }
        if (dateRange?.endDate) {
          params.append("endDate", dateRange.endDate);
        }
        const query = params.toString();
        return Api.get(
          `/orders/reports/${outletId}/staff/export${query ? `?${query}` : ""}`,
          { responseType: "blob" },
        );
      },

      exportPaymentModeReportApi: (outletId, dateRange) => {
        const params = new URLSearchParams();

        if (dateRange?.startDate) {
          params.append("startDate", dateRange.startDate);
        }
        if (dateRange?.endDate) {
          params.append("endDate", dateRange.endDate);
        }
        const query = params.toString();
        return Api.get(
          `/orders/reports/${outletId}/payment-modes/export${query ? `?${query}` : ""}`,
          { responseType: "blob" },
        );
      },

      exportTaxReportApi: (outletId, dateRange) => {
        const params = new URLSearchParams();

        if (dateRange?.startDate) {
          params.append("startDate", dateRange.startDate);
        }
        if (dateRange?.endDate) {
          params.append("endDate", dateRange.endDate);
        }
        const query = params.toString();
        return Api.get(
          `/orders/reports/${outletId}/tax/export${query ? `?${query}` : ""}`,
          { responseType: "blob" },
        );
      },

      exportServiceTypeBreakdownReportApi: (outletId, dateRange) => {
        const params = new URLSearchParams();

        if (dateRange?.startDate) {
          params.append("startDate", dateRange.startDate);
        }
        if (dateRange?.endDate) {
          params.append("endDate", dateRange.endDate);
        }
        const query = params.toString();
        return Api.get(
          `/orders/reports/${outletId}/service-type-breakdown/export${query ? `?${query}` : ""}`,
          { responseType: "blob" },
        );
      },

      exportRunningTableApi: (outletId) => {
        return Api.get(`/reports/running-tables/export?outletId=${outletId}`, {
          responseType: "blob",
        });
      },

      exportRunnigOrderApi: (outletId) => {
        return Api.get(`/reports/running-orders/export?outletId=${outletId}`, {
          responseType: "blob",
        });
      },
      exportSectionSalesReportApi: (outletId, dateRange = {}) => {
        const params = {};

        if (dateRange.startDate && dateRange.endDate) {
          params.startDate = dateRange.startDate;
          params.endDate = dateRange.endDate;
        }

        return Api.get(`/orders/reports/${outletId}/floor-section/export`, {
          params,
          responseType: "blob",
        });
      },
      exportStationSalesReportApi: (outletId, dateRange = {}) => {
        const params = {};

        if (dateRange.startDate && dateRange.endDate) {
          params.startDate = dateRange.startDate;
          params.endDate = dateRange.endDate;
        }

        return Api.get(`/orders/reports/${outletId}/counter/export`, {
          params,
          responseType: "blob",
        });
      },
      exportCancellationReportApi: (outletId, dateRange = {}) => {
        const params = {};

        if (dateRange?.startDate && dateRange?.endDate) {
          params.startDate = dateRange.startDate;
          params.endDate = dateRange.endDate;
        }

        return Api.get(`/orders/reports/${outletId}/cancellations/export`, {
          params,
          responseType: "blob",
        });
      },

      /* ───────── SHIFT HISTORY EXPORT ───────── */

      exportShiftHistoryApi: (outletId, dateRange = {}) => {
        const params = new URLSearchParams();

        if (dateRange?.startDate) {
          params.append("startDate", dateRange.startDate);
        }

        if (dateRange?.endDate) {
          params.append("endDate", dateRange.endDate);
        }

        const query = params.toString();

        return Api.get(
          `/orders/shifts/${outletId}/history/export${query ? `?${query}` : ""}`,
          { responseType: "blob" },
        );
      },

      exportShiftHistoryDetailsApi: (shiftId) => {
        return Api.get(`/orders/shifts/${shiftId}/detail/export`, {
          responseType: "blob",
        });
      },

      /* ───────── DAY END SUMMARY EXPORT ───────── */

      exportDayEndSummaryApi: (outletId, dateRange = {}) => {
        const params = new URLSearchParams();

        if (dateRange?.startDate) {
          params.append("startDate", dateRange.startDate);
        }

        if (dateRange?.endDate) {
          params.append("endDate", dateRange.endDate);
        }

        const query = params.toString();

        return Api.get(
          `/reports/day-end-summary/export?outletId=${outletId}${query ? `&${query}` : ""}`,
          { responseType: "blob" },
        );
      },

      exportDayEndSummaryDetailsApi: (outletId, date) => {
        return Api.get(
          `/reports/day-end-summary/detail/export?outletId=${outletId}&startDate=${date}&endDate=${date}`,
          { responseType: "blob" },
        );
      },
    };
