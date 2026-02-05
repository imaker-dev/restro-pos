import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import TaxServices from "../services/TaxServices";

export const fetchAllTaxGroups = createAsyncThunk("/fetch/tax/groups", async () => {
  const res = await TaxServices.getAllTaxGroupsApi();
  return res.data;
});

const taxSlice = createSlice({
  name: "tax",
  initialState: {
    loading: false,
    allTaxGroup: null,
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
  },
});

// Export reducer
const { reducer } = taxSlice;
export default reducer;
