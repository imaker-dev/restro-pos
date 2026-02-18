import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import KitchenServices from "../services/KitchenServices";
import OrderServices from "../services/OrderServices";

export const fetchAllOrders = createAsyncThunk(
  "/fetch/all/orders",
  async ({
    outletId,
    page,
    limit,
    search,
    dateRange,
    orderStatus,
    orderType,
    paymentStatus,
    sortBy,
    sortOrder,
  }) => {
    const res = await OrderServices.getAllOrdersApi(
      outletId,
      page,
      limit,
      search,
      dateRange,
      orderStatus,
      orderType,
      paymentStatus,
      sortBy,
      sortOrder,
    );
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

export const downlaodOrderInvoice = createAsyncThunk(
  "/download/order/invoice",
  async (id) => {
    const res = await OrderServices.downlaodOrderInvoiceApi(id);
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
    isDownloadingInvoice:false,
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
      })
      .addCase(downlaodOrderInvoice.pending, (state) => {
        state.isDownloadingInvoice = true;
      })
      .addCase(downlaodOrderInvoice.fulfilled, (state, action) => {
        state.isDownloadingInvoice = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(downlaodOrderInvoice.rejected, (state, action) => {
        state.isDownloadingInvoice = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = orderSlice;
export default reducer;
