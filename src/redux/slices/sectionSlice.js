import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import SectionServices from "../services/SectionServices";

export const fetchAllSection = createAsyncThunk("/fetch/sections", async (id) => {
  const res = await SectionServices.getAllSectionsApi(id);
  return res.data;
});
export const createSection = createAsyncThunk("/create/section", async (values) => {
  const res = await SectionServices.createSectionApi(values);
  return res.data;
});
export const updateSection = createAsyncThunk("/update/section", async ({id,values}) => {
  const res = await SectionServices.updateSectionApi(id,values);
  return res.data;
});

const sectionSlice = createSlice({
  name: "section",
  initialState: {
    loading: false,
    allSections: null,
    isCreatingSections:false,
    isUpdatingSections:false,
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
      .addCase(createSection.pending, (state) => {
        state.isCreatingSections = true;
      })
      .addCase(createSection.fulfilled, (state, action) => {
        state.isCreatingSections = false;
        toast.success(action.payload.message)
      })
      .addCase(createSection.rejected, (state, action) => {
        state.isCreatingSections = false;
        toast.error(action.error.message);
      })
      .addCase(updateSection.pending, (state) => {
        state.isUpdatingSections = true;
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        state.isUpdatingSections = false;
        toast.success(action.payload.message)
      })
      .addCase(updateSection.rejected, (state, action) => {
        state.isUpdatingSections = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = sectionSlice;
export default reducer;
