import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import UserServices from "../services/UserServices";

export const fetchAllUsers = createAsyncThunk("/fetch/outlets", async ({search}) => {
  const res = await UserServices.getAllUsersApi(search);
  return res.data;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    allUsers: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload.data;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = userSlice;
export default reducer;
