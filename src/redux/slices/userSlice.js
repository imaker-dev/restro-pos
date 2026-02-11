import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import UserServices from "../services/UserServices";

export const fetchAllUsers = createAsyncThunk("/fetch/outlets", async ({search}) => {
  const res = await UserServices.getAllUsersApi(search);
  return res.data;
});
export const createUser = createAsyncThunk("/create/user", async (values) => {
  const res = await UserServices.addUserApi(values);
  return res.data;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isCreatingUser: false,
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
      .addCase(createUser.pending, (state) => {
        state.isCreatingUser = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isCreatingUser = false;
        toast.success(action.payload.message)
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isCreatingUser = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = userSlice;
export default reducer;
