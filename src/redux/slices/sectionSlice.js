import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import SectionServices from "../services/SectionServices";

export const fetchAllSection = createAsyncThunk("/fetch/sections", async (id) => {
  const res = await SectionServices.getAllSectionsApi();
  return res.data;
});

const sectionSlice = createSlice({
  name: "section",
  initialState: {
    loading: false,
    allSections: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSection.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllSection.fulfilled, (state, action) => {
        state.loading = false;
        state.allSections = action.payload.data;
      })
      .addCase(fetchAllSection.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = sectionSlice;
export default reducer;
