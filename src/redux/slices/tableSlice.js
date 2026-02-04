import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import TableServices from "../services/TableServices";

export const fetchAllTables = createAsyncThunk("/fetch/floor/tables", async (id) => {
  const res = await TableServices.getAllTableApi(id);
  return res.data;
});

const tableSlice = createSlice({
  name: "table",
  initialState: {
    loading: false,
    allTables: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTables.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllTables.fulfilled, (state, action) => {
        state.loading = false;
        state.allTables = action.payload.data;
      })
      .addCase(fetchAllTables.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = tableSlice;
export default reducer;
