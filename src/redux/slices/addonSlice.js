import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import AddonServices from "../services/AddonServices";

export const fetchAllAddonGroups = createAsyncThunk("/fetch/addon/groups", async (id) => {
  const res = await AddonServices.getAllAddonGroupsApi(id);
  return res.data;
});

const addonSlice = createSlice({
  name: "addon",
  initialState: {
    loading: false,
    allAddonGroups: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAddonGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllAddonGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.allAddonGroups = action.payload.data;
      })
      .addCase(fetchAllAddonGroups.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = addonSlice;
export default reducer;
