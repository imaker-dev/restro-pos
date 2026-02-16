import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import DashboardServices from "../services/DashboardServices";

export const fetchAllDahboardStats = createAsyncThunk("/fetch/dashboard/stats", async ({outletId,dateRange}) => {
  const res = await DashboardServices.getDashboardStatsApi(outletId,dateRange);
  return res.data;
});


const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    isfetchingDashboardStats: false,
    isCreatingCategory: false,
    isUpdatingCategory: false,
    dahbordStats: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDahboardStats.pending, (state) => {
        state.isfetchingDashboardStats = true;
      })
      .addCase(fetchAllDahboardStats.fulfilled, (state, action) => {
        state.isfetchingDashboardStats = false;
        state.dahbordStats = action.payload.data;
      })
      .addCase(fetchAllDahboardStats.rejected, (state, action) => {
        state.isfetchingDashboardStats = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = dashboardSlice;
export default reducer;
