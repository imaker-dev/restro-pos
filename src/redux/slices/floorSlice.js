import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import FloorServices from "../services/FloorServices";

export const fetchAllFloors = createAsyncThunk("/fetch/outlets/floors", async (id) => {
  const res = await FloorServices.getAllFloorsApi(id);
  return res.data;
});

const floorSlice = createSlice({
  name: "floor",
  initialState: {
    loading: false,
    allFloors: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFloors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllFloors.fulfilled, (state, action) => {
        state.loading = false;
        state.allFloors = action.payload.data;
      })
      .addCase(fetchAllFloors.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = floorSlice;
export default reducer;
