import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import TableServices from "../services/TableServices";

export const fetchAllTables = createAsyncThunk(
  "/fetch/floor/tables",
  async (id) => {
    const res = await TableServices.getAllTableApi(id);
    return res.data;
  },
);
export const createTable = createAsyncThunk("/create/table", async (values) => {
  const res = await TableServices.createTableApi(values);
  return res.data;
});
export const updateTable = createAsyncThunk(
  "/update/table",
  async ({ id, values }) => {
    const res = await TableServices.updatedTableApi(id, values);
    return res.data;
  },
);

const tableSlice = createSlice({
  name: "table",
  initialState: {
    loading: false,
    allTables: null,
    isCreatingTable: false,
    isUpdatingTable: false,
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
      .addCase(createTable.pending, (state) => {
        state.isCreatingTable = true;
      })
      .addCase(createTable.fulfilled, (state, action) => {
        state.isCreatingTable = false;
        toast.success(action.payload.message);
      })
      .addCase(createTable.rejected, (state, action) => {
        state.isCreatingTable = false;
        toast.error(action.error.message);
      })
      .addCase(updateTable.pending, (state) => {
        state.isUpdatingTable = true;
      })
      .addCase(updateTable.fulfilled, (state, action) => {
        state.isUpdatingTable = false;
        toast.success(action.payload.message);
      })
      .addCase(updateTable.rejected, (state, action) => {
        state.isUpdatingTable = false;
        toast.error(action.error.message);
      });
  },
});

// Export reducer
const { reducer } = tableSlice;
export default reducer;
