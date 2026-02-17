import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import KitchenServices from "../services/KitchenServices";
import OrderServices from "../services/OrderServices";

export const fetchAllOrders = createAsyncThunk(
  "/fetch/all/orders",
  async (id) => {
    const res = await OrderServices.getAllOrdersApi(id);
    return res.data;
  },
);
export const fetchOrderByIdApi = createAsyncThunk(
  "/fetch/order/id",
  async (id) => {
    const res = await OrderServices.getOrdersByIdApi(id);
    return res.data;
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    allOrdersData: null,
    isFetchingOrderDetails: false,
    orderDetails: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrdersData = action.payload.data;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
      .addCase(fetchOrderByIdApi.pending, (state) => {
        state.isFetchingOrderDetails = true;
      })
      .addCase(fetchOrderByIdApi.fulfilled, (state, action) => {
        state.isFetchingOrderDetails = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(fetchOrderByIdApi.rejected, (state, action) => {
        state.isFetchingOrderDetails = false;
        toast.error(action.error.message);
      });
  },
});

// Export reducer
const { reducer } = orderSlice;
export default reducer;
