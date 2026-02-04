import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import AuthServices from "../services/AuthServices";
import { TOKEN_KEYS } from "../../constants";

const logIn = !!localStorage.getItem(TOKEN_KEYS.ACCESS);

export const signIn = createAsyncThunk("/admin/signin", async (values) => {
  const res = await AuthServices.signInApi(values);
  return res.data;
});
export const fetchMeData = createAsyncThunk("/fetch/me", async () => {
  const res = await AuthServices.getMeData();
  return res.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    logIn,
    loading: false,
    isLogging: false,
    meData: null,
  },
  reducers: {
    clearLoginState: (state) => {
      state.logIn = false;
      localStorage.removeItem(TOKEN_KEYS.ACCESS);
      toast.success("logout sucessfully");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.isLogging = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLogging = false;
        state.logIn = true;
        localStorage.setItem(TOKEN_KEYS.ACCESS, action.payload.data.accessToken);
        localStorage.setItem(TOKEN_KEYS.REFRESH, action.payload.data.refreshToken);
        toast.success(action.payload.message);
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLogging = false;
        toast.error(action.error.message);
      })
      .addCase(fetchMeData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMeData.fulfilled, (state, action) => {
        state.loading = false;
        state.meData = action.payload.data
      })
      .addCase(fetchMeData.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
  },
});

// Export actions
export const { clearLoginState } = authSlice.actions;

// Export reducer
const { reducer } = authSlice;
export default reducer;
