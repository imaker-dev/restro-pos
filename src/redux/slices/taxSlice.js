import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import TaxServices from "../services/TaxServices";

export const fetchAllTaxGroups = createAsyncThunk("/fetch/tax/groups", async () => {
  const res = await TaxServices.getAllTaxGroupsApi();
  return res.data;
});
export const fetchTaxGroupById = createAsyncThunk("/fetch/tax/group/:id", async (id) => {
  const res = await TaxServices.getTaxGroupByIdApi(id);
  return res.data;
});

const taxSlice = createSlice({
  name: "tax",
  initialState: {
    loading: false,
    allTaxGroup: null,
    isFetchingTaxGroupDetails:false,
    taxGroupDetails:null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTaxGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllTaxGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.allTaxGroup = action.payload.data;
      })
      .addCase(fetchAllTaxGroups.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
      .addCase(fetchTaxGroupById.pending, (state) => {
        state.isFetchingTaxGroupDetails = true;
      })
      .addCase(fetchTaxGroupById.fulfilled, (state, action) => {
        state.isFetchingTaxGroupDetails = false;
        state.taxGroupDetails = action.payload.data;
      })
      .addCase(fetchTaxGroupById.rejected, (state, action) => {
        state.isFetchingTaxGroupDetails = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = taxSlice;
export default reducer;
