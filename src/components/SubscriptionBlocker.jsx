import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearRenewalError,
  clearActivationError,
  fetchLicenseStatus,
  createRenewalOrder,
  verifyRenewalPayment,
  fetchRenewalOrderStatus,
  renewActivationToken,
} from "../redux/slices/licenseSlice";
import {
  Loader2,
  AlertCircle,
  CreditCard,
  RefreshCw,
  BadgeCheck,
  Calendar,
  Timer,
  Hash,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Rocket,
} from "lucide-react";

/* ─── Load Razorpay checkout script dynamically ─── */
function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(window.Razorpay);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout script"));
    document.body.appendChild(script);
  });
}

export default function SubscriptionBlocker() {
  const dispatch = useDispatch();
  const pollRef = useRef(null);

  const {
    subscriptionStatus,
    subscriptionExpiry,
    gracePeriodEnd,
    graceDaysRemaining,
    daysUntilExpiry,
    licenseId,
    restaurant,
    creatingRenewalOrder,
    verifyingRenewalPayment,
    renewalError,
    renewing,
    activationError,
  } = useSelector((s) => s.license);

  const [token, setToken] = useState("");
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [success, setSuccess] = useState(false);

  const isExpired = subscriptionStatus === "expired";
  const isSuspended = subscriptionStatus === "suspended";

  useEffect(() => {
    dispatch(clearRenewalError());
    dispatch(clearActivationError());
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [dispatch]);

  const handleRenew = async () => {
    if (!token.trim()) return;
    const result = await dispatch(renewActivationToken(token.trim()));
    if (renewActivationToken.fulfilled.match(result)) {
      setSuccess(true);
      dispatch(fetchLicenseStatus());
    }
  };

  /* ─── Razorpay Payment Flow ─── */
  const handleRazorpayPay = async () => {
    try {
      dispatch(clearRenewalError());

      const orderResult = await dispatch(createRenewalOrder());
      if (!createRenewalOrder.fulfilled.match(orderResult)) return;

      const { orderId, amount, keyId } = orderResult.payload;
      if (!orderId || !keyId) {
        throw new Error("Order creation returned invalid data");
      }

      const Razorpay = await loadRazorpayScript();

      const options = {
        key: keyId,
        amount: String(amount),
        currency: "INR",
        name: restaurant || "RestroPOS",
        description: "Pro Subscription Renewal",
        order_id: orderId,
        handler: async (response) => {
          const verifyResult = await dispatch(
            verifyRenewalPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            })
          );
          if (verifyRenewalPayment.fulfilled.match(verifyResult)) {
            setSuccess(true);
            dispatch(fetchLicenseStatus());
          }
        },
        modal: {
          ondismiss: () => {
            startPolling(orderId);
          },
        },
        theme: { color: "#0f3460" },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (e) {
      console.error("[Razorpay] Pay error:", e);
    }
  };

  const startPolling = useCallback((orderId) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      const statusResult = await dispatch(fetchRenewalOrderStatus(orderId));
      if (fetchRenewalOrderStatus.fulfilled.match(statusResult)) {
        const { status } = statusResult.payload;
        if (status === "paid") {
          clearInterval(pollRef.current);
          dispatch(fetchLicenseStatus());
          setSuccess(true);
        }
      }
    }, 5000);

    setTimeout(() => {
      if (pollRef.current) clearInterval(pollRef.current);
    }, 5 * 60 * 1000);
  }, [dispatch]);

  const StatusBadge = () => {
    const style = isSuspended
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-red-100 text-red-700 border-red-200";
    const label = isSuspended ? "Suspended" : "Expired";
    const Icon = isSuspended ? ShieldCheck : AlertCircle;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${style}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  if (success) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BadgeCheck className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Renewed!</h2>
          <p className="text-gray-500 mb-6">Your subscription has been renewed successfully.</p>
          <button
            onClick={() => {
              setSuccess(false);
              dispatch(fetchLicenseStatus());
            }}
            className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-center h-full p-4 sm:p-6 overflow-y-auto">
      <div className="max-w-lg w-full">
        {/* Subscription details card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Subscription</h2>
            <StatusBadge />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {subscriptionExpiry && (
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Expires: <span className="font-semibold text-gray-800">{subscriptionExpiry}</span></span>
              </div>
            )}
            {gracePeriodEnd && (
              <div className="flex items-center gap-2 text-gray-600">
                <Timer className="w-4 h-4 text-gray-400" />
                <span>Grace ends: <span className="font-semibold text-gray-800">{gracePeriodEnd}</span></span>
              </div>
            )}
            {daysUntilExpiry !== null && (
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Days until expiry: <span className="font-semibold text-gray-800">{daysUntilExpiry}</span></span>
              </div>
            )}
            {graceDaysRemaining > 0 && (
              <div className="flex items-center gap-2 text-gray-600">
                <Timer className="w-4 h-4 text-gray-400" />
                <span>Grace left: <span className="font-semibold text-gray-800">{graceDaysRemaining}d</span></span>
              </div>
            )}
            {licenseId && (
              <div className="flex items-center gap-2 text-gray-600">
                <Hash className="w-4 h-4 text-gray-400" />
                <span>License: <span className="font-mono text-xs text-gray-500">{licenseId}</span></span>
              </div>
            )}
          </div>
        </div>

        {/* Main action card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {isSuspended ? "Subscription Suspended" : "Subscription Expired"}
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            {isSuspended
              ? "Your subscription has been suspended. Renew now to restore full access to the POS."
              : "Your subscription and grace period have ended. Renew now to restore access."}
          </p>

          {/* Razorpay Pay Now */}
          <button
            onClick={handleRazorpayPay}
            disabled={creatingRenewalOrder || verifyingRenewalPayment}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold rounded-xl transition mb-3"
          >
            {creatingRenewalOrder || verifyingRenewalPayment ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CreditCard className="w-4 h-4" />
            )}
            {creatingRenewalOrder
              ? "Creating order…"
              : verifyingRenewalPayment
              ? "Verifying…"
              : "Pay & Renew Now"}
          </button>

          {renewalError && (
            <div className="flex items-start gap-2 text-red-600 bg-red-50 rounded-lg px-3 py-2 text-xs mb-3 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {renewalError}
            </div>
          )}

          {/* Offline token fallback */}
          <button
            onClick={() => setShowTokenForm(!showTokenForm)}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 mx-auto mb-2"
          >
            {showTokenForm ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {showTokenForm ? "Hide token renewal" : "Or renew with offline token"}
          </button>

          {showTokenForm && (
            <div className="text-left space-y-3 mt-2">
              <textarea
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-gray-300"
                placeholder="Paste your renewal token here…"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              {activationError && (
                <div className="flex items-start gap-2 text-red-600 bg-red-50 rounded-lg px-3 py-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {activationError}
                </div>
              )}
              <button
                onClick={handleRenew}
                disabled={renewing || !token.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition"
              >
                {renewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {renewing ? "Renewing…" : "Renew with Token"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
