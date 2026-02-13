import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import ReportServices from "../services/ReportServices";

export const fetchDailySalesReport = createAsyncThunk("/fetch/daily/sales/report", async ({outletId,dateRange}) => {
  const res = await ReportServices.getDailySalesReportApi({outletId,dateRange});
  return res.data;
});

const reportSlice = createSlice({
  name: "report",
  initialState: {
    loading: false,
    dailySalesReport: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailySalesReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDailySalesReport.fulfilled, (state, action) => {
        state.loading = false;
        state.dailySalesReport = action.payload.data;
      })
      .addCase(fetchDailySalesReport.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = reportSlice;
export default reducer;
