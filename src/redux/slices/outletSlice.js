import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import OutletServices from "../services/OutletServices";

export const fetchAllOutlets = createAsyncThunk("/fetch/outlets", async () => {
  const res = await OutletServices.getAllOutletsApi();
  return res.data;
});
export const fetchOutletById = createAsyncThunk("/fetch/outlet/:id", async (outletId) => {
  const res = await OutletServices.getOutletById(outletId);
  return res.data;
});
export const createOutlet = createAsyncThunk("/create/outlet", async (values) => {
  const res = await OutletServices.createOutletApi(values);
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
    isCreatingOutlet:false,
    isUpdatingOutlet:false,
    isFetchingOutletDetails:false,
    outletDetails:null,
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
      .addCase(fetchOutletById.pending, (state) => {
        state.isFetchingOutletDetails = true;
      })
      .addCase(fetchOutletById.fulfilled, (state, action) => {
        state.isFetchingOutletDetails = false;
        state.outletDetails = action.payload.data;
      })
      .addCase(fetchOutletById.rejected, (state, action) => {
        state.isFetchingOutletDetails = false;
        toast.error(action.error.message);
      })
      .addCase(createOutlet.pending, (state) => {
        state.isCreatingOutlet = true;
      })
      .addCase(createOutlet.fulfilled, (state, action) => {
        state.isCreatingOutlet = false;
        toast.success(action.payload.message)
      })
      .addCase(createOutlet.rejected, (state, action) => {
        state.isCreatingOutlet = false;
        toast.error(action.error.message);
      })
      .addCase(updateOutlet.pending, (state) => {
        state.isUpdatingOutlet = true;
      })
      .addCase(updateOutlet.fulfilled, (state, action) => {
        state.isUpdatingOutlet = false;
        toast.success(action.payload.message)
      })
      .addCase(updateOutlet.rejected, (state, action) => {
        state.isUpdatingOutlet = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = outletSlice;
export default reducer;
