import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import ItemServies from "../services/ItemServies";


export const fetchAllItemsByCategory = createAsyncThunk("/fetch/items/category", async (id) => {
  const res = await ItemServies.getAllItemsByCategoryApi(id);
  return res.data;
});

const itemSlice = createSlice({
  name: "item",
  initialState: {
    loading: false,
    allItems: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllItemsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllItemsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.allItems = action.payload.data;
      })
      .addCase(fetchAllItemsByCategory.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = itemSlice;
export default reducer;
