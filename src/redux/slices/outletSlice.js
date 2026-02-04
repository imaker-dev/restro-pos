import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import OutletServices from "../services/OutletServices";

export const fetchAllOutlets = createAsyncThunk("/fetch/outlets", async () => {
  const res = await OutletServices.getAllOutletsApi();
  return res.data;
});
export const updateOutlet = createAsyncThunk("/update/outlet", async ({id,values}) => {
  const res = await OutletServices.updateOutletApi(id,values);
  return res.data;
});

const outletSlice = createSlice({
  name: "outlet",
  initialState: {
    loading: false,
    allOutlets: null,
    isupdatingOutlet:false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOutlets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOutlets.fulfilled, (state, action) => {
        state.loading = false;
        state.allOutlets = action.payload.data;
      })
      .addCase(fetchAllOutlets.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
      .addCase(updateOutlet.pending, (state) => {
        state.isupdatingOutlet = true;
      })
      .addCase(updateOutlet.fulfilled, (state, action) => {
        state.isupdatingOutlet = false;
        toast.success(action.payload.message)
      })
      .addCase(updateOutlet.rejected, (state, action) => {
        state.isupdatingOutlet = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = outletSlice;
export default reducer;
