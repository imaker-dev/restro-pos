import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { get, post } from "../api";

// ─── Activation / Subscription (offline model) ───────────────────────────

export const fetchLicenseStatus = createAsyncThunk(
  "license/fetchStatus",
  async () => {
    const res = await get("/activation/status");
    return res.data.data;
  }
);

export const validateActivationToken = createAsyncThunk(
  "license/validateToken",
  async (token, { rejectWithValue }) => {
    try {
      const res = await post("/activation/validate-token", { token });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || "Validation failed");
    }
  }
);

export const applyActivationToken = createAsyncThunk(
  "license/activate",
  async (token, { rejectWithValue }) => {
    try {
      const res = await post("/activation/activate", { token });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || "Activation failed");
    }
  }
);

export const renewActivationToken = createAsyncThunk(
  "license/renew",
  async (token, { rejectWithValue }) => {
    try {
      const res = await post("/activation/renew", { token });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || "Renewal failed");
    }
  }
);

// ─── Legacy upgrade (keep for backward compatibility) ─────────────────────

export const applyUpgradeToken = createAsyncThunk(
  "license/applyUpgrade",
  async (token, { rejectWithValue }) => {
    try {
      const res = await post("/license/upgrade", { token });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Upgrade failed");
    }
  }
);

// ─── Razorpay Subscription Renewal ──────────────────────────────────────────

export const createRenewalOrder = createAsyncThunk(
  "license/createRenewalOrder",
  async (_, { rejectWithValue }) => {
    try {
      const res = await post("/subscription/create-order");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || "Failed to create order");
    }
  }
);

export const verifyRenewalPayment = createAsyncThunk(
  "license/verifyRenewalPayment",
  async ({ razorpay_payment_id, razorpay_order_id, razorpay_signature }, { rejectWithValue }) => {
    try {
      const res = await post("/subscription/verify", {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || "Payment verification failed");
    }
  }
);

export const fetchRenewalOrderStatus = createAsyncThunk(
  "license/fetchRenewalOrderStatus",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await get(`/subscription/order-status?order_id=${orderId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || "Failed to check order status");
    }
  }
);

const licenseSlice = createSlice({
  name: "license",
  initialState: {
    plan: "free",
    modules: { captain: false, inventory: false, advancedReports: false },
    maxOutlets: 1,
    maxUsers: 10,
    licenseId: null,
    restaurant: null,
    activated: false,
    // Subscription fields (offline annual model)
    subscriptionExpiry: null,
    gracePeriodEnd: null,
    subscriptionStatus: "not_activated",
    graceDaysRemaining: 0,
    daysUntilExpiry: null,
    type: null,
    outletId: null,
    loading: false,
    error: null,
    upgrading: false,
    upgradeError: null,
    validating: false,
    activating: false,
    renewing: false,
    activationError: null,
    // Razorpay renewal state
    creatingRenewalOrder: false,
    verifyingRenewalPayment: false,
    renewalOrderId: null,
    renewalAmount: null,
    renewalKeyId: null,
    renewalError: null,
  },
  reducers: {
    setPlanFromSocket: (state, action) => {
      const { plan, modules, maxOutlets, maxUsers } = action.payload;
      if (plan) state.plan = plan;
      if (modules) state.modules = { ...state.modules, ...modules };
      if (maxOutlets !== undefined) state.maxOutlets = maxOutlets;
      if (maxUsers !== undefined) state.maxUsers = maxUsers;
    },
    clearUpgradeError: (state) => {
      state.upgradeError = null;
    },
    clearActivationError: (state) => {
      state.activationError = null;
    },
    clearRenewalError: (state) => {
      state.renewalError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchLicenseStatus (/activation/status)
      .addCase(fetchLicenseStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLicenseStatus.fulfilled, (state, action) => {
        state.loading = false;
        const d = action.payload;
        state.plan = d.plan ?? state.plan;
        state.modules = d.modules ?? state.modules;
        state.maxOutlets = d.maxOutlets ?? state.maxOutlets;
        state.maxUsers = d.maxUsers ?? state.maxUsers;
        state.licenseId = d.licenseId ?? state.licenseId;
        state.restaurant = d.restaurantName ?? d.restaurant ?? state.restaurant;
        state.activated = d.activated ?? state.activated;
        state.subscriptionExpiry = d.subscriptionExpiry ?? state.subscriptionExpiry;
        state.gracePeriodEnd = d.gracePeriodEnd ?? state.gracePeriodEnd;
        state.subscriptionStatus = d.status ?? d.subscriptionStatus ?? state.subscriptionStatus;
        state.graceDaysRemaining = d.graceDaysRemaining ?? state.graceDaysRemaining;
        state.daysUntilExpiry = d.daysUntilExpiry ?? state.daysUntilExpiry;
        state.type = d.type ?? state.type;
        state.outletId = d.outletId ?? state.outletId;
      })
      .addCase(fetchLicenseStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // validateActivationToken
      .addCase(validateActivationToken.pending, (state) => {
        state.validating = true;
        state.activationError = null;
      })
      .addCase(validateActivationToken.fulfilled, (state, action) => {
        state.validating = false;
        const d = action.payload;
        state.plan = d.plan ?? state.plan;
        state.modules = d.modules ?? state.modules;
        state.maxOutlets = d.maxOutlets ?? state.maxOutlets;
        state.maxUsers = d.maxUsers ?? state.maxUsers;
      })
      .addCase(validateActivationToken.rejected, (state, action) => {
        state.validating = false;
        state.activationError = action.payload || action.error.message;
      })

      // applyActivationToken
      .addCase(applyActivationToken.pending, (state) => {
        state.activating = true;
        state.activationError = null;
      })
      .addCase(applyActivationToken.fulfilled, (state, action) => {
        state.activating = false;
        const d = action.payload;
        state.plan = d.plan ?? state.plan;
        state.modules = d.modules ?? state.modules;
        state.maxOutlets = d.maxOutlets ?? state.maxOutlets;
        state.maxUsers = d.maxUsers ?? state.maxUsers;
        state.licenseId = d.licenseId ?? state.licenseId;
        state.restaurant = d.restaurant ?? state.restaurant;
        state.activated = true;
        state.subscriptionExpiry = d.subscriptionExpiry ?? state.subscriptionExpiry;
        state.gracePeriodEnd = d.gracePeriodEnd ?? state.gracePeriodEnd;
        state.subscriptionStatus = d.subscriptionStatus ?? d.status ?? state.subscriptionStatus;
        state.graceDaysRemaining = d.graceDaysRemaining ?? state.graceDaysRemaining;
        state.daysUntilExpiry = d.daysUntilExpiry ?? state.daysUntilExpiry;
        state.type = d.type ?? state.type;
        state.outletId = d.outletId ?? state.outletId;
      })
      .addCase(applyActivationToken.rejected, (state, action) => {
        state.activating = false;
        state.activationError = action.payload || action.error.message;
      })

      // renewActivationToken
      .addCase(renewActivationToken.pending, (state) => {
        state.renewing = true;
        state.activationError = null;
      })
      .addCase(renewActivationToken.fulfilled, (state, action) => {
        state.renewing = false;
        const d = action.payload;
        state.subscriptionExpiry = d.subscriptionExpiry ?? state.subscriptionExpiry;
        state.gracePeriodEnd = d.gracePeriodEnd ?? state.gracePeriodEnd;
        state.subscriptionStatus = d.subscriptionStatus ?? d.status ?? state.subscriptionStatus;
        state.graceDaysRemaining = d.graceDaysRemaining ?? state.graceDaysRemaining;
        state.daysUntilExpiry = d.daysUntilExpiry ?? state.daysUntilExpiry;
        state.licenseId = d.licenseId ?? state.licenseId;
      })
      .addCase(renewActivationToken.rejected, (state, action) => {
        state.renewing = false;
        state.activationError = action.payload || action.error.message;
      })

      // Legacy applyUpgradeToken
      .addCase(applyUpgradeToken.pending, (state) => {
        state.upgrading = true;
        state.upgradeError = null;
      })
      .addCase(applyUpgradeToken.fulfilled, (state, action) => {
        state.upgrading = false;
        const d = action.payload;
        state.plan = d.plan ?? state.plan;
        state.modules = d.modules ?? state.modules;
        state.maxOutlets = d.maxOutlets ?? state.maxOutlets;
        state.maxUsers = d.maxUsers ?? state.maxUsers;
      })
      .addCase(applyUpgradeToken.rejected, (state, action) => {
        state.upgrading = false;
        state.upgradeError = action.payload || action.error.message;
      })

      // createRenewalOrder
      .addCase(createRenewalOrder.pending, (state) => {
        state.creatingRenewalOrder = true;
        state.renewalError = null;
      })
      .addCase(createRenewalOrder.fulfilled, (state, action) => {
        state.creatingRenewalOrder = false;
        const d = action.payload;
        state.renewalOrderId = d.orderId ?? state.renewalOrderId;
        state.renewalAmount = d.amount ?? state.renewalAmount;
        state.renewalKeyId = d.keyId ?? state.renewalKeyId;
      })
      .addCase(createRenewalOrder.rejected, (state, action) => {
        state.creatingRenewalOrder = false;
        state.renewalError = action.payload || action.error.message;
      })

      // verifyRenewalPayment
      .addCase(verifyRenewalPayment.pending, (state) => {
        state.verifyingRenewalPayment = true;
        state.renewalError = null;
      })
      .addCase(verifyRenewalPayment.fulfilled, (state, action) => {
        state.verifyingRenewalPayment = false;
        const d = action.payload;
        state.subscriptionExpiry = d.subscriptionExpiry ?? state.subscriptionExpiry;
        state.gracePeriodEnd = d.gracePeriodEnd ?? state.gracePeriodEnd;
        state.subscriptionStatus = 'active';
        state.graceDaysRemaining = 0;
      })
      .addCase(verifyRenewalPayment.rejected, (state, action) => {
        state.verifyingRenewalPayment = false;
        state.renewalError = action.payload || action.error.message;
      })

      // fetchRenewalOrderStatus
      .addCase(fetchRenewalOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRenewalOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchRenewalOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.renewalError = action.payload || action.error.message;
      });
  },
});

export const { setPlanFromSocket, clearUpgradeError, clearActivationError, clearRenewalError } = licenseSlice.actions;
export default licenseSlice.reducer;
