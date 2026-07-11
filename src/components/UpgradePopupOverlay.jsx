import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Transition from "../utils/Transition";
import { ROUTE_PATHS } from "../config/paths";
import {
  Rocket,
  X,
  Warehouse,
  ClipboardList,
  Users,
  BarChart3,
  MonitorSmartphone,
  UtensilsCrossed,
  ChefHat,
  Headset,
  LockOpen,
} from "lucide-react";

const PRO_FEATURE_CHIPS = [
  { icon: Warehouse, label: "Inventory & Stock" },
  { icon: ClipboardList, label: "Recipe Costing" },
  { icon: UtensilsCrossed, label: "Full Table Control" },
  { icon: Users, label: "Unlimited Staff" },
  { icon: BarChart3, label: "Advanced Reports" },
  { icon: MonitorSmartphone, label: "Multi-Device LAN" },
];

const PRO_FEATURE_ROWS = [
  { icon: LockOpen, title: "Captain Module", desc: "Table-side ordering & KOT" },
  { icon: ChefHat, title: "Kitchen Display", desc: "Real-time KOT & order tracking" },
  { icon: Warehouse, title: "Inventory Module", desc: "Stock control, PO, wastage tracking" },
  { icon: Headset, title: "Priority Support", desc: "WhatsApp direct support" },
];

export default function UpgradePopupOverlay() {
  const navigate = useNavigate();
  const { plan } = useSelector((state) => state.license);
  const isFree = plan === "free";

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100); // 100 → 0 over 10s

  const recurringTimerRef = useRef(null);
  const autoDismissTimerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const isFirstDoneRef = useRef(false);

  const dismiss = useCallback(() => {
    setVisible(false);
    clearInterval(progressIntervalRef.current);
    clearTimeout(autoDismissTimerRef.current);
    setProgress(100);
  }, []);

  const showPopup = useCallback(() => {
    if (!isFree) return;
    setVisible(true);
    setProgress(100);

    // Animate progress bar from 100 → 0 over 10 seconds
    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / 10000) * 100);
      setProgress(remaining);
      if (remaining <= 0) clearInterval(progressIntervalRef.current);
    }, 50);

    // Auto-dismiss after 10 seconds
    autoDismissTimerRef.current = setTimeout(() => {
      dismiss();
    }, 10000);
  }, [isFree, dismiss]);

  const handleUpgrade = useCallback(() => {
    dismiss();
    navigate(ROUTE_PATHS.UPGRADE);
  }, [dismiss, navigate]);

  // ─── Timer lifecycle ───
  useEffect(() => {
    if (!isFree) {
      // Pro user — cancel everything
      dismiss();
      clearInterval(recurringTimerRef.current);
      clearTimeout(autoDismissTimerRef.current);
      return;
    }

    // First popup after 10 seconds
    const firstTimer = setTimeout(() => {
      isFirstDoneRef.current = true;
      showPopup();
    }, 10000);

    // Recurring every 5 minutes
    recurringTimerRef.current = setInterval(() => {
      if (isFirstDoneRef.current) showPopup();
    }, 5 * 60 * 1000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(recurringTimerRef.current);
      clearTimeout(autoDismissTimerRef.current);
      clearInterval(progressIntervalRef.current);
    };
  }, [isFree, showPopup, dismiss]);

  // Don't render Transition elements for Pro users at all
  if (!isFree) return null;

  return (
    <>
      {/* Backdrop */}
      <Transition
        className="fixed inset-0 bg-black/45 z-[60] transition-opacity"
        show={visible}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-150"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      />

      {/* Popup container */}
      <Transition
        className="fixed inset-0 z-[60] flex items-center justify-center px-4"
        show={visible}
        enter="transition ease-out duration-300"
        enterStart="opacity-0 scale-95"
        enterEnd="opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveStart="opacity-100 scale-100"
        leaveEnd="opacity-0 scale-95"
      >
        <div className="relative w-full max-w-[460px] max-h-[82vh] overflow-hidden rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-white/10 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
          {/* Progress bar */}
          <div className="h-[3px] w-full rounded-t-2xl overflow-hidden bg-transparent">
            <div
              className="h-full rounded-t-2xl transition-all duration-100 ease-linear"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(to right, rgba(245,158,11,0.9), rgba(220,38,38,0.7))",
              }}
            />
          </div>

          {/* Close button */}
          <button
            onClick={dismiss}
            className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.08] text-white/60 hover:bg-white/[0.15] hover:text-white/90 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Content */}
          <div className="px-6 pt-6 pb-5 overflow-y-auto max-h-[calc(82vh-3px)]">
            {/* Header gradient glow */}
            <div className="relative flex flex-col items-center text-center mb-5">
              {/* Rocket icon */}
              <div className="relative mb-4">
                <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-xl scale-150" />
                <div className="relative w-[68px] h-[68px] rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/40">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-[22px] font-extrabold text-white tracking-wide mb-1.5">
                Upgrade to Pro
              </h2>
              <p className="text-[13px] text-white/60 leading-relaxed">
                Unlock the full potential of your restaurant
              </p>
            </div>

            {/* Feature chips */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {PRO_FEATURE_CHIPS.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/[0.07] border border-white/[0.12] text-white text-[11px] font-semibold"
                >
                  <Icon className="w-3.5 h-3.5 text-amber-400" />
                  {label}
                </span>
              ))}
            </div>

            {/* Feature detail rows */}
            <div className="rounded-xl bg-white/[0.05] border border-white/[0.08] p-3.5 mb-5 space-y-2.5">
              {PRO_FEATURE_ROWS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-2.5">
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-amber-400/15 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-white leading-tight">
                      {title}
                    </p>
                    <p className="text-[10px] text-white/50 leading-snug">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA button */}
            <button
              onClick={handleUpgrade}
              className="w-full h-[46px] rounded-xl bg-gradient-to-r from-amber-400 to-orange-600 text-white font-bold text-[15px] tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-amber-500/40 hover:shadow-xl hover:shadow-amber-500/50 hover:-translate-y-px active:translate-y-0 transition-all duration-200"
            >
              <Rocket className="w-5 h-5" />
              Upgrade Now
            </button>

            {/* Auto-close hint */}
            <p className="text-center text-[11px] text-white/30 mt-3">
              This popup will auto-close in a few seconds
            </p>
          </div>
        </div>
      </Transition>
    </>
  );
}
