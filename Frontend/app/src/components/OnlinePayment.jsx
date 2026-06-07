import React, { useEffect, useState } from "react";
import * as Lucide from "lucide-react";
import api from "../api";
import { loadRazorpayScript } from "../utils/payments";
import {
  PAYMENT_BRANDS,
  RazorpayLogo,
} from "./PaymentLogos";

const OnlinePayment = ({
  amount,
  merchantName,
  user,
  phone,
  onRazorpaySuccess,
  onValidate,
  disabled,
}) => {
  const [razorpayConfig, setRazorpayConfig] = useState({
    enabled: false,
    keyId: "",
  });
  const [configStatus, setConfigStatus] = useState("loading");
  const [configMessage, setConfigMessage] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    api
      .get("/api/payments/config")
      .then((res) => {
        const enabled = Boolean(res.data.razorpayEnabled);
        setRazorpayConfig({
          enabled,
          keyId: res.data.keyId || "",
        });
        setConfigStatus(enabled ? "ready" : "missing_keys");
        if (!enabled) {
          setConfigMessage(
            "Razorpay keys are missing on the server. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel, then redeploy.",
          );
        }
      })
      .catch((err) => {
        setRazorpayConfig({ enabled: false, keyId: "" });
        const status = err.response?.status;
        if (status === 404) {
          setConfigStatus("not_deployed");
          setConfigMessage(
            "Payment API is not deployed yet. Push the latest backend code to GitHub and redeploy on Vercel.",
          );
        } else {
          setConfigStatus("error");
          setConfigMessage(
            "Could not reach the payment server. Check your internet or try again shortly.",
          );
        }
      });
  }, []);

  const startRazorpayPayment = async () => {
    if (!onValidate?.()) return;

    if (!razorpayConfig.enabled) {
      alert("Online payment is not configured. Please contact support.");
      return;
    }

    setPaying(true);
    try {
      const { data } = await api.post("/api/payments/razorpay/create-order", {
        amount,
      });

      const Razorpay = await loadRazorpayScript();

      const rzp = new Razorpay({
        key: razorpayConfig.keyId,
        amount: data.amount,
        currency: data.currency,
        name: merchantName,
        description: "Brass & Silver Idols Order",
        order_id: data.orderId,
        prefill: {
          name: user?.username || "",
          email: user?.email || "",
          contact: phone || "",
        },
        theme: { color: "#b45309" },
        handler: async (response) => {
          try {
            await api.post("/api/payments/razorpay/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            onRazorpaySuccess(response.razorpay_payment_id);
          } catch {
            alert(
              "Payment verification failed. Contact support with your payment ID.",
            );
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      });

      rzp.on("payment.failed", (res) => {
        alert(res.error?.description || "Payment failed. Please try again.");
        setPaying(false);
      });

      rzp.open();
    } catch (err) {
      alert(err.response?.data?.error || "Could not start payment. Try again.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60 p-4 md:p-5 shadow-sm">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-200/30 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-orange-200/25 blur-2xl" />

      <div className="relative space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700/80">
              Secure Checkout
            </p>
            <h4 className="text-sm font-bold text-slate-900 mt-0.5">
              Choose your payment app
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed max-w-[240px]">
              All options open in Razorpay — pick GPay, PhonePe, Paytm, UPI or
              card.
            </p>
          </div>
          <div className="shrink-0 rounded-xl bg-white/90 border border-slate-100 px-2.5 py-1.5 shadow-sm">
            <RazorpayLogo className="h-3.5" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {PAYMENT_BRANDS.map(({ id, name, Logo, bg, ring, accent }) => (
            <div
              key={id}
              className={`group relative flex flex-col items-center gap-2 rounded-xl bg-gradient-to-b ${bg} p-3 ring-1 ${ring} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
            >
              <div className="w-11 h-11 rounded-xl bg-white shadow-sm border border-white/80 flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform">
                <Logo className="w-9 h-9" />
              </div>
              <span
                className={`text-[10px] font-bold text-center leading-tight ${accent}`}
              >
                {name}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={startRazorpayPayment}
          disabled={disabled || paying || !razorpayConfig.enabled}
          className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 py-4 px-4 text-white font-bold text-sm shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <span className="relative flex items-center justify-center gap-2.5">
            {paying ? (
              <>
                <Lucide.Loader2 size={18} className="animate-spin" />
                Opening secure payment...
              </>
            ) : (
              <>
                <Lucide.Wallet size={18} />
                <span>
                  Pay{" "}
                  <span className="text-base font-black">
                    ₹{amount.toLocaleString("en-IN")}
                  </span>{" "}
                  Now
                </span>
                <Lucide.ArrowRight size={16} className="opacity-90" />
              </>
            )}
          </span>
        </button>

        {configStatus === "loading" && (
          <p className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 flex items-center gap-2">
            <Lucide.Loader2 size={12} className="animate-spin" />
            Checking payment configuration...
          </p>
        )}

        {configStatus !== "loading" && configStatus !== "ready" && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 leading-relaxed">
            {configMessage}
          </p>
        )}

        <div className="flex items-center justify-center gap-4 pt-1 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <Lucide.Lock size={11} />
            256-bit SSL
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="flex items-center gap-1">
            <Lucide.ShieldCheck size={11} />
            PCI Compliant
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>Powered by Razorpay</span>
        </div>
      </div>
    </div>
  );
};

export default OnlinePayment;
