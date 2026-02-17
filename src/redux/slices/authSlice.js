import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import AuthServices from "../services/AuthServices";
import { TOKEN_KEYS } from "../../constants";
import { disconnectSocket } from "../../socket/socket";
import { clearAuthStorage, isLoggedIn } from "../../utils/authToken";

const logIn = isLoggedIn();

const storedOutlet = localStorage.getItem(TOKEN_KEYS.OUTLET_ID);

export const signIn = createAsyncThunk("/admin/signin", async (values) => {
  const res = await AuthServices.signInApi(values);
  return res.data;
});
export const fetchMeData = createAsyncThunk("/fetch/me", async () => {
  const res = await AuthServices.getMeData();
  return res.data;
});

export const logout = createAsyncThunk(
  "/auth/logout",
  async (_, { dispatch }) => {
    disconnectSocket();
    dispatch(clearLoginState());
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    logIn,
    loading: false,
    isLogging: false,
    meData: null,
    outletId: storedOutlet ? Number(storedOutlet) : null,
  },
  reducers: {
    clearLoginState: (state) => {
      state.logIn = false;
      state.meData = null;
      clearAuthStorage();
      toast.success("Logout successfully");
    },
    setOutletId: (state, action) => {
      const id = Number(action.payload);
      state.outletId = id;
      localStorage.setItem(TOKEN_KEYS.OUTLET_ID, String(id));
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
        const { accessToken, refreshToken } = action.payload.data;

        const rememberMe = action.meta.arg.rememberMe;
        const storage = rememberMe ? localStorage : sessionStorage;

        storage.setItem(TOKEN_KEYS.ACCESS, accessToken);
        storage.setItem(TOKEN_KEYS.REFRESH, refreshToken);

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
        state.meData = action.payload.data;

        const outlets = action.payload.data.outletIds || [];

        if (outlets.length === 0) return;

        const storedOutlet = localStorage.getItem(TOKEN_KEYS.OUTLET_ID);
        const storedOutletNum = Number(storedOutlet);

        const isValidOutlet = storedOutlet && outlets.includes(storedOutletNum);

        if (!isValidOutlet) {
          const defaultOutlet = outlets[0];
          state.outletId = defaultOutlet;
          localStorage.setItem(TOKEN_KEYS.OUTLET_ID, defaultOutlet);
        } else {
          state.outletId = storedOutlet;
        }
      })

      .addCase(fetchMeData.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      });
  },
});

// Export actions
export const { clearLoginState, setOutletId } = authSlice.actions;

// Export reducer
const { reducer } = authSlice;
export default reducer;
