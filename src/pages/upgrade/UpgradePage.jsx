import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  applyActivationToken,
  renewActivationToken,
  clearActivationError,
  clearRenewalError,
  fetchLicenseStatus,
  createRenewalOrder,
  verifyRenewalPayment,
  fetchRenewalOrderStatus,
} from "../../redux/slices/licenseSlice";
import {
  Rocket,
  Warehouse,
  ClipboardList,
  Users,
  Building2,
  Loader2,
  AlertCircle,
  KeyRound,
  BadgeCheck,
  Timer,
  RefreshCw,
  CreditCard,
  ShieldCheck,
  Calendar,
  Hash,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../config/paths";

const PRO_FEATURES = [
  { icon: Warehouse, label: "Full Inventory Management", desc: "Stock tracking, movements, wastage & purchase orders" },
  { icon: ClipboardList, label: "Recipes & Production", desc: "Manage recipes, prep recipes & ingredients" },
  { icon: Users, label: "Captain Module", desc: "Enable captain role with table & order management" },
  { icon: Building2, label: "Multiple Outlets", desc: "Manage multiple restaurant branches from one account" },
];

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

export default function UpgradePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    plan,
    activated,
    subscriptionStatus,
    subscriptionExpiry,
    gracePeriodEnd,
    graceDaysRemaining,
    daysUntilExpiry,
    licenseId,
    restaurant,
    activating,
    renewing,
    activationError,
    creatingRenewalOrder,
    verifyingRenewalPayment,
    renewalOrderId,
    renewalAmount,
    renewalKeyId,
    renewalError,
  } = useSelector((s) => s.license);

  const [token, setToken] = useState("");
  const [renewMode, setRenewMode] = useState(false);
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [success, setSuccess] = useState(false);
  const pollRef = useRef(null);

  const isActive = subscriptionStatus === "active";
  const isGrace = subscriptionStatus === "grace_period";
  const isExpired = subscriptionStatus === "expired" || subscriptionStatus === "suspended";
  const isSuspended = subscriptionStatus === "suspended";
  const isNotActivated = subscriptionStatus === "not_activated";

  useEffect(() => {
    dispatch(clearActivationError());
    dispatch(clearRenewalError());
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleActivate = async () => {
    if (!token.trim()) return;
    const result = await dispatch(applyActivationToken(token.trim()));
    if (applyActivationToken.fulfilled.match(result)) {
      setSuccess(true);
      dispatch(fetchLicenseStatus());
    }
  };

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

      // 1. Create order
      const orderResult = await dispatch(createRenewalOrder());
      if (!createRenewalOrder.fulfilled.match(orderResult)) return;

      const { orderId, amount, keyId } = orderResult.payload;
      if (!orderId || !keyId) {
        throw new Error("Order creation returned invalid data");
      }

      // 2. Load Razorpay script
      const Razorpay = await loadRazorpayScript();

      // 3. Open checkout
      const options = {
        key: keyId,
        amount: String(amount),
        currency: "INR",
        name: restaurant || "RestroPOS",
        description: "Pro Subscription Renewal",
        order_id: orderId,
        handler: async (response) => {
          // Payment successful in modal
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
            // User closed modal — start polling as fallback
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

    // Stop polling after 5 minutes
    setTimeout(() => {
      if (pollRef.current) clearInterval(pollRef.current);
    }, 5 * 60 * 1000);
  }, [dispatch]);

  /* ─── Subscription Status Card ─── */
  const StatusBadge = ({ status }) => {
    const styles = {
      active: "bg-green-100 text-green-700 border-green-200",
      grace_period: "bg-amber-100 text-amber-700 border-amber-200",
      expired: "bg-red-100 text-red-700 border-red-200",
      suspended: "bg-red-100 text-red-700 border-red-200",
      not_activated: "bg-slate-100 text-slate-600 border-slate-200",
    };
    const labels = {
      active: "Active",
      grace_period: "Grace Period",
      expired: "Expired",
      suspended: "Suspended",
      not_activated: "Not Activated",
    };
    const icons = {
      active: ShieldCheck,
      grace_period: Timer,
      expired: AlertCircle,
      suspended: AlertCircle,
      not_activated: Rocket,
    };
    const Icon = icons[status] || AlertCircle;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${styles[status] || styles.expired}`}>
        <Icon className="w-3 h-3" />
        {labels[status] || status}
      </span>
    );
  };

  const SubscriptionDetails = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Subscription Details</h2>
        <StatusBadge status={subscriptionStatus} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {subscriptionExpiry && (
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Expires on: <span className="font-semibold text-gray-800">{subscriptionExpiry}</span></span>
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
            <span>Grace days left: <span className="font-semibold text-gray-800">{graceDaysRemaining}</span></span>
          </div>
        )}
        {licenseId && (
          <div className="flex items-center gap-2 text-gray-600">
            <Hash className="w-4 h-4 text-gray-400" />
            <span>License ID: <span className="font-mono text-xs text-gray-500">{licenseId}</span></span>
          </div>
        )}
      </div>
    </div>
  );

  // ─── Subscription active ─────────────────────────────────────────
  if (isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full">
          <SubscriptionDetails />
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BadgeCheck className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscription Active</h1>
            <p className="text-gray-500 mb-6">Your POS subscription is active.</p>
            <button
              onClick={() => navigate(ROUTE_PATHS.HOME)}
              className="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Grace Period ─────────────────────────────────────────────────
  if (isGrace) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full">
          <SubscriptionDetails />
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Timer className="w-10 h-10 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Grace Period</h1>
            <p className="text-gray-500 mb-2">
              Your subscription expired. {graceDaysRemaining} day{graceDaysRemaining !== 1 ? "s" : ""} remaining in grace period.
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Renew now to avoid service interruption.
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
              <div className="flex items-start gap-2 text-red-600 bg-red-50 rounded-lg px-3 py-2 text-xs mb-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {renewalError}
              </div>
            )}

            <button
              onClick={() => navigate(ROUTE_PATHS.HOME)}
              className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition mb-3"
            >
              Go to Dashboard
            </button>

            {/* Offline token fallback */}
            <button
              onClick={() => setShowTokenForm(!showTokenForm)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 mx-auto"
            >
              {showTokenForm ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {showTokenForm ? "Hide token renewal" : "Or renew with offline token"}
            </button>

            {showTokenForm && (
              <div className="mt-4 text-left space-y-3">
                <textarea
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-gray-300"
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

  // ─── Success after activation/renewal ─────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BadgeCheck className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">All Set!</h1>
          <p className="text-gray-500 mb-6">Your subscription has been renewed successfully.</p>
          <button
            onClick={() => navigate(ROUTE_PATHS.HOME)}
            className="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ─── Expired / Suspended ──────────────────────────────────────────
  if (isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full">
          <SubscriptionDetails />
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isSuspended ? "Subscription Suspended" : "Subscription Expired"}
            </h1>
            <p className="text-gray-500 mb-6">
              {isSuspended
                ? "Your subscription has been suspended. Renew now to restore access."
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
              <div className="flex items-start gap-2 text-red-600 bg-red-50 rounded-lg px-3 py-2 text-xs mb-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {renewalError}
              </div>
            )}

            {/* Offline token fallback */}
            <button
              onClick={() => setShowTokenForm(!showTokenForm)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 mx-auto mb-4"
            >
              {showTokenForm ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {showTokenForm ? "Hide token renewal" : "Or renew with offline token"}
            </button>

            {showTokenForm && (
              <div className="text-left space-y-3">
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

  // ─── Not Activated ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 bg-slate-100 text-slate-700">
            <Rocket className="w-4 h-4" />
            Activate POS
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Activate your POS</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Enter your offline activation token below to unlock the POS.
          </p>
        </div>

        {/* Activation form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="space-y-4">
            <textarea
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-gray-300"
              placeholder="Paste your offline activation token here…"
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
              onClick={handleActivate}
              disabled={activating || !token.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition"
            >
              {activating ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              {activating ? "Activating…" : "Activate POS"}
            </button>
          </div>
        </div>

        {/* Features teaser */}
        <div className="mt-8">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 text-center">
            What you'll unlock
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PRO_FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4">
                <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
