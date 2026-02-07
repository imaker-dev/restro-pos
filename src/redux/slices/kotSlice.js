import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import KotServices from "../services/KotServices";

export const fetchAllOrdersKot = createAsyncThunk(
  "/fetch/orders/kot",
  async ({ status, station }) => {
    const res = await KotServices.getAllOrdersKotApi(status, station);
    return res.data;
  },
);
export const acceptOrderKot = createAsyncThunk(
  "/accept/order/kot",
  async (id) => {
    const res = await KotServices.acceptOrderKotApi(id);
    return res.data;
  },
);
export const prepareOrderKot = createAsyncThunk(
  "/prepare/order/kot",
  async (id) => {
    const res = await KotServices.prepareOrderKotApi(id);
    return res.data;
  },
);
export const markReadyKot = createAsyncThunk(
  "/ready/order/kot",
  async (id) => {
    const res = await KotServices.readyOrderKotApi(id);
    return res.data;
  },
);
export const serveOrderKot = createAsyncThunk(
  "/serve/order/kot",
  async (id) => {
    const res = await KotServices.serveOrderKotApi(id);
    return res.data;
  },
);

const kotSlice = createSlice({
  name: "kot",
  initialState: {
    loading: false,
    // allOrdersKot: null,
      allOrdersKot: {
    kots: [],
    stats: {
      pending_count: 0,
      active_count: 0,
    },
  },

  },
  reducers: {
newKot(state, action) {
  const rawKot = action.payload;

  const kot = {
    id: rawKot.id,
    kot_number: rawKot.kotNumber,
    table_number: rawKot.tableNumber || null,
    station: rawKot.station,
    item_count: rawKot.itemCount,
    status: "pending",
    items: rawKot.items.map(i => ({
      id: i.id,
      item_name: i.name,
      variant_name: i.variant,
      quantity: i.quantity,
    })),
  };

  const exists = state.allOrdersKot.kots.find(k => k.id === kot.id);
  if (exists) return;

  state.allOrdersKot.kots.unshift(kot);

  state.allOrdersKot.stats.pending_count += 1;
  state.allOrdersKot.stats.active_count += 1;
}

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrdersKot.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrdersKot.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrdersKot = action.payload.data;
      })
      .addCase(fetchAllOrdersKot.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
      .addCase(acceptOrderKot.pending, (state) => {
        state.isUpdatingKot = true;
      })
      .addCase(acceptOrderKot.fulfilled, (state, action) => {
        state.isUpdatingKot = false;
        toast.success(action.payload.message);
      })
      .addCase(acceptOrderKot.rejected, (state, action) => {
        state.isUpdatingKot = false;
        toast.error(action.error.message);
      })
      .addCase(prepareOrderKot.pending, (state) => {
        state.isUpdatingKot = true;
      })
      .addCase(prepareOrderKot.fulfilled, (state, action) => {
        state.isUpdatingKot = false;
        toast.success(action.payload.message);
      })
      .addCase(prepareOrderKot.rejected, (state, action) => {
        state.isUpdatingKot = false;
        toast.error(action.error.message);
      })
      .addCase(markReadyKot.pending, (state) => {
        state.isUpdatingKot = true;
      })
      .addCase(markReadyKot.fulfilled, (state, action) => {
        state.isUpdatingKot = false;
        toast.success(action.payload.message);
      })
      .addCase(markReadyKot.rejected, (state, action) => {
        state.isUpdatingKot = false;
        toast.error(action.error.message);
      })
      .addCase(serveOrderKot.pending, (state) => {
        state.isUpdatingKot = true;
      })
      .addCase(serveOrderKot.fulfilled, (state, action) => {
        state.isUpdatingKot = false;
        toast.success(action.payload.message);
      })
      .addCase(serveOrderKot.rejected, (state, action) => {
        state.isUpdatingKot = false;
        toast.error(action.error.message);
      });
  },
});

export const {
  newKot,
} = kotSlice.actions;


// Export reducer
const { reducer } = kotSlice;
export default reducer;
