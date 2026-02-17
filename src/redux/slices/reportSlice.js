import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import ReportServices from "../services/ReportServices";

export const fetchDailySalesReport = createAsyncThunk(
  "/fetch/daily/sales/report",
  async ({ outletId, dateRange }) => {
    const res = await ReportServices.getDailySalesReportApi({
      outletId,
      dateRange,
    });
    return res.data;
  },
);
export const fetchDailySalesReportByDate = createAsyncThunk(
  "/fetch/daily/sales/report/date",
  async ({ outletId, date, page, limit }) => {
    const res = await ReportServices.getDailyReportDetailsApi(
      outletId,
      date,
      page,
      limit,
    );
    return res.data;
  },
);
export const fetchItemSalesReport = createAsyncThunk(
  "/fetch/item/sales/report",
  async ({ outletId, dateRange }) => {
    const res = await ReportServices.getItemSalesReportApi(outletId, dateRange);
    return res.data;
  },
);
export const fetchCategorySalesReport = createAsyncThunk(
  "/fetch/category/sales/report",
  async ({ outletId, dateRange }) => {
    const res = await ReportServices.getCategorySalesReportApi(
      outletId,
      dateRange,
    );
    return res.data;
  },
);
export const fetchStaffSalesReport = createAsyncThunk(
  "/fetch/staff/sales/report",
  async ({ outletId, dateRange }) => {
    const res = await ReportServices.getStaffSalesReportApi(
      outletId,
      dateRange,
    );
    return res.data;
  },
);
export const fetchPaymentModeReport = createAsyncThunk(
  "/fetch/payment/mode/report",
  async ({ outletId, dateRange }) => {
    const res = await ReportServices.getPaymentModeReportApi(
      outletId,
      dateRange,
    );
    return res.data;
  },
);
export const fetchTaxReport = createAsyncThunk(
  "/fetch/tax/report",
  async ({ outletId, dateRange }) => {
    const res = await ReportServices.getTaxReportApi(
      outletId,
      dateRange,
    );
    return res.data;
  },
);

const reportSlice = createSlice({
  name: "report",
  initialState: {
    loading: false,
    isFetchingDailyReports: false,
    dailySalesReport: null,
    isFetchingDailyReportDetails: false,
    dailySalesReportDetails: null,
    itemSalesReport: null,
    isFetchingItemSalesReport: false,

    categorySalesReport: null,
    isFetchingCategorySalesReport: false,

    staffSalesReport:null,
    isFetchingStaffSalesReport:false,

    paymentModeReport:null,
    isFetchingPaymentModeReport:false,

    taxReport: null,
    isFetchingTaxReport:false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailySalesReport.pending, (state) => {
        state.isFetchingDailyReports = true;
      })
      .addCase(fetchDailySalesReport.fulfilled, (state, action) => {
        state.isFetchingDailyReports = false;
        state.dailySalesReport = action.payload.data;
      })
      .addCase(fetchDailySalesReport.rejected, (state, action) => {
        state.isFetchingDailyReports = false;
        toast.error(action.error.message);
      })
      .addCase(fetchDailySalesReportByDate.pending, (state) => {
        state.isFetchingDailyReportDetails = true;
      })
      .addCase(fetchDailySalesReportByDate.fulfilled, (state, action) => {
        state.isFetchingDailyReportDetails = false;
        state.dailySalesReportDetails = action.payload.data;
      })
      .addCase(fetchDailySalesReportByDate.rejected, (state, action) => {
        state.isFetchingDailyReportDetails = false;
        toast.error(action.error.message);
      })
      .addCase(fetchItemSalesReport.pending, (state) => {
        state.isFetchingItemSalesReport = true;
      })
      .addCase(fetchItemSalesReport.fulfilled, (state, action) => {
        state.isFetchingItemSalesReport = false;
        state.itemSalesReport = action.payload.data;
      })
      .addCase(fetchItemSalesReport.rejected, (state, action) => {
        state.isFetchingItemSalesReport = false;
        toast.error(action.error.message);
      })
      .addCase(fetchCategorySalesReport.pending, (state) => {
        state.isFetchingCategorySalesReport = true;
      })
      .addCase(fetchCategorySalesReport.fulfilled, (state, action) => {
        state.isFetchingCategorySalesReport = false;
        state.categorySalesReport = action.payload.data;
      })
      .addCase(fetchCategorySalesReport.rejected, (state, action) => {
        state.isFetchingCategorySalesReport = false;
        toast.error(action.error.message);
      })
      .addCase(fetchStaffSalesReport.pending, (state) => {
        state.isFetchingStaffSalesReport = true;
      })
      .addCase(fetchStaffSalesReport.fulfilled, (state, action) => {
        state.isFetchingStaffSalesReport = false;
        state.staffSalesReport = action.payload.data;
      })
      .addCase(fetchStaffSalesReport.rejected, (state, action) => {
        state.isFetchingStaffSalesReport = false;
        toast.error(action.error.message);
      })
      .addCase(fetchPaymentModeReport.pending, (state) => {
        state.isFetchingPaymentModeReport = true;
      })
      .addCase(fetchPaymentModeReport.fulfilled, (state, action) => {
        state.isFetchingPaymentModeReport = false;
        state.paymentModeReport = action.payload.data;
      })
      .addCase(fetchPaymentModeReport.rejected, (state, action) => {
        state.isFetchingPaymentModeReport = false;
        toast.error(action.error.message);
      })
      .addCase(fetchTaxReport.pending, (state) => {
        state.isFetchingTaxReport = true;
      })
      .addCase(fetchTaxReport.fulfilled, (state, action) => {
        state.isFetchingTaxReport = false;
        state.taxReport = action.payload.data;
      })
      .addCase(fetchTaxReport.rejected, (state, action) => {
        state.isFetchingTaxReport = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = reportSlice;
export default reducer;
