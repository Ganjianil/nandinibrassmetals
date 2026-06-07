import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import api from "./api";
import * as Lucide from "lucide-react";
import Seo from "./seo/Seo";
import OnlinePayment from "./components/OnlinePayment";
import { PaymentLogoStrip } from "./components/PaymentLogos";

const Cart = () => {
  const { cart, totalPrice, clearCart, updateQuantity, removeFromCart } =
    useCart();
  const navigate = useNavigate();

  // Shipping States
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [landmark, setLandmark] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingGps, setLoadingGps] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [pincodeVerified, setPincodeVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment & Promo States
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const MERCHANT_NAME = "Nandhini Brass Metals";
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const getImgSrc = (path) => {
    if (!path) return "https://via.placeholder.com/320x320?text=Brass+Metals";
    const API_BASE_URL = api.defaults.baseURL;

    let cleanPath = path;

    if (typeof path === "string" && path.startsWith("[")) {
      try {
        const parsed = JSON.parse(path);
        cleanPath = Array.isArray(parsed) ? parsed[0] : path;
      } catch (e) {
        cleanPath = path;
      }
    } else if (Array.isArray(path)) {
      cleanPath = path[0];
    }

    if (typeof cleanPath !== "string")
      return "https://via.placeholder.com/320x320";

    return cleanPath.startsWith("http")
      ? cleanPath
      : `${API_BASE_URL}${cleanPath}`;
  };

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("nandhini_cart_cache", JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    if (pincode.length === 6) fetchLocation(pincode);
    else {
      setCity("");
      setState("");
      setPincodeVerified(false);
    }
  }, [pincode]);

  const fetchLocation = async (pin) => {
    setLoadingLocation(true);
    setLocationError("");
    try {
      const res = await axios.get(
        `https://api.postalpincode.in/pincode/${pin}`,
      );
      if (res.data[0].Status === "Success") {
        const data = res.data[0].PostOffice[0];
        setCity(data.District);
        setState(data.State);
        setPincodeVerified(true);
      } else {
        setPincodeVerified(false);
        setLocationError("Invalid pincode. Please check and try again.");
      }
    } catch (err) {
      setPincodeVerified(false);
      setLocationError("Could not verify pincode. Try again.");
    } finally {
      setLoadingLocation(false);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Location is not supported on this device.");
      return;
    }

    setLoadingGps(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            {
              headers: {
                "Accept-Language": "en",
                "User-Agent": "NandhiniBrassMetals/1.0",
              },
            },
          );

          const addr = res.data?.address || {};
          const detectedPin =
            addr.postcode?.replace(/\s/g, "").slice(0, 6) || "";
          const detectedCity =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.suburb ||
            addr.county ||
            "";
          const detectedState = addr.state || "";
          const line = [
            addr.house_number,
            addr.road,
            addr.neighbourhood,
            addr.suburb,
          ]
            .filter(Boolean)
            .join(", ");

          if (detectedPin) setPincode(detectedPin);
          if (detectedCity) setCity(detectedCity);
          if (detectedState) setState(detectedState);
          if (line) setAddress(line);
          if (detectedPin.length === 6) setPincodeVerified(true);
        } catch {
          setLocationError(
            "Could not fetch address from GPS. Enter pincode manually.",
          );
        } finally {
          setLoadingGps(false);
        }
      },
      () => {
        setLoadingGps(false);
        setLocationError(
          "Location access denied. Allow GPS or enter address manually.",
        );
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  };

  const inputClass =
    "w-full bg-white rounded-xl px-4 py-3.5 text-sm text-slate-800 border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 outline-none transition-all placeholder:text-slate-400 shadow-sm";

  const labelClass =
    "block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-1.5";

  const applyCoupon = async () => {
    if (!coupon.trim()) return alert("Please enter a code");
    try {
      const res = await api.post("/api/validate-promo", {
        code: coupon.toUpperCase(),
      });
      if (res.data.success) {
        const calculatedDiscount = Math.round(
          (totalPrice * res.data.discount_percent) / 100,
        );
        setDiscount(calculatedDiscount);
        setCouponApplied(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid Code");
      setDiscount(0);
      setCouponApplied(false);
    }
  };

  const removeCoupon = () => {
    setCoupon("");
    setDiscount(0);
    setCouponApplied(false);
  };

  const finalPrice = Math.round(totalPrice - discount);

  const getUser = () => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  };

  const placeOrder = async (transactionId, method) => {
    const user = getUser();
    if (!user) return;

    const orderData = {
      userId: user.id,
      username: user.username || user.name || "Customer",
      email: user.email,
      phone,
      address: `${address}${landmark ? `, ${landmark}` : ""}, ${city}, ${state} - ${pincode}`,
      cartItems: cart.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity || 1,
        price: item.price,
        image: item.image,
      })),
      totalAmount: finalPrice,
      paymentMethod: method,
      transactionId,
      couponCode: coupon,
    };

    await api.post("/api/orders", orderData);
    alert("Order Placed Successfully! Check your email for confirmation.");
    clearCart();
    localStorage.removeItem("nandhini_cart_cache");
    navigate("/");
  };

  const validateDelivery = () => {
    const user = getUser();
    if (!user) {
      alert("Please login first!");
      navigate("/login");
      return false;
    }
    if (!phone || !address || !pincode) {
      alert("Please fill in all delivery details first.");
      return false;
    }
    return true;
  };

  const handleRazorpaySuccess = async (paymentId) => {
    const user = getUser();
    if (!user) return;
    setIsSubmitting(true);
    try {
      await placeOrder(paymentId, "Razorpay Online");
    } catch (err) {
      alert(err.response?.data?.error || "Order failed after payment. Contact support with payment ID.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckout = async () => {
    const user = getUser();

    if (!user) {
      alert("Please Login First!");
      navigate("/login");
      return;
    }

    if (!phone || !address || !pincode) {
      return alert("Please fill in all shipping details!");
    }

    if (paymentMethod !== "Cash on Delivery") return;

    setIsSubmitting(true);

    try {
      await placeOrder("", "Cash on Delivery");
    } catch (err) {
      console.error("Order Error:", err);
      alert(err.response?.data?.error || "Order Failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-200/30 rounded-full blur-3xl scale-150" />
          <div className="relative bg-white/80 backdrop-blur-sm p-12 rounded-[3rem] shadow-xl border border-amber-100">
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
              <Lucide.ShoppingBag size={40} className="text-amber-600" />
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tight text-slate-900 mb-3">
              Your Bag is Empty
            </h2>
            <p className="text-slate-500 mb-10 max-w-xs mx-auto">
              Looks like you haven't added any brass treasures yet
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-wide shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all"
            >
              <Lucide.Sparkles size={20} />
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 pb-20">
      <Seo title="Shopping Cart" path="/cart" noindex />
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-10 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-100/80 text-amber-700 px-4 py-2 rounded-full mb-4 border border-amber-200/70">
              <Lucide.ShieldCheck size={14} />
              <span className="font-bold text-xs uppercase tracking-wider">
                Secure Checkout
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-slate-900 leading-[0.85]">
              Your Bag
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                .
              </span>
            </h1>
            <p className="mt-4 text-slate-500 text-lg">
              {totalItems} {totalItems === 1 ? "item" : "items"} • ₹
              {totalPrice.toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => window.confirm("Clear entire cart?") && clearCart()}
            className="group flex items-center gap-2 text-slate-400 hover:text-red-500 font-bold uppercase text-xs tracking-widest transition-colors"
          >
            <Lucide.Trash2
              size={14}
              className="group-hover:scale-110 transition-transform"
            />
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between px-1 pb-2">
              <h2 className="text-sm md:text-base font-black uppercase tracking-[0.16em] text-slate-500">
                Bag Items
              </h2>
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1 text-[11px] font-bold text-slate-500">
                <Lucide.Package size={13} />
                {cart.length} {cart.length === 1 ? "product" : "products"}
              </span>
            </div>
            {cart.map((item, index) => (
              <div
                key={item.id}
                className="group relative bg-white/85 backdrop-blur-sm p-5 md:p-6 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100/80 hover:border-amber-200/50 flex gap-5 items-center transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-amber-50/50 via-transparent to-orange-50/40 pointer-events-none" />
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 shrink-0">
                  <img
                    src={getImgSrc(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl" />
                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-[10px] font-black text-slate-700 shadow-sm">
                    x{item.quantity || 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0 relative z-10">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="font-black text-slate-900 uppercase text-sm md:text-base leading-tight line-clamp-2">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeFromCart?.(item.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0"
                    >
                      <Lucide.X size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-200/60">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, (item.quantity || 1) - 1)
                        }
                        className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all"
                      >
                        <Lucide.Minus size={14} />
                      </button>
                      <span className="px-4 font-black text-sm min-w-[2.5rem] text-center">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, (item.quantity || 1) + 1)
                        }
                        className="w-9 h-9 flex items-center justify-center text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all"
                      >
                        <Lucide.Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                      <span className="text-xl md:text-2xl font-black text-slate-900">
                        ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                      </span>
                      {(item.quantity || 1) > 1 && (
                        <p className="text-xs text-slate-400">
                          ₹{item.price.toLocaleString()} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Coupon Section */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-3xl border border-amber-200/50 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Lucide.Ticket size={18} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Have a Coupon?</h3>
                  <p className="text-xs text-slate-500">
                    Apply code for extra savings
                  </p>
                </div>
              </div>

              {couponApplied ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <Lucide.CheckCircle2 size={20} className="text-green-600" />
                    <div>
                      <span className="font-black text-green-800 uppercase">
                        {coupon}
                      </span>
                      <p className="text-sm text-green-600">
                        You saved ₹{discount.toLocaleString()}!
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-green-600 hover:text-red-500 p-2"
                  >
                    <Lucide.X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE"
                    className="flex-1 bg-white rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={!coupon.trim()}
                    className={`px-6 rounded-xl font-bold text-sm uppercase tracking-wide transition-colors ${
                      coupon.trim()
                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                        : "bg-amber-200 text-amber-500 cursor-not-allowed"
                    }`}
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Checkout Panel */}
          <div className="lg:col-span-5 space-y-5">
            {/* Delivery — Flipkart / Amazon style light card */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-7 shadow-sm border border-slate-200/80 sticky top-24 lg:top-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Lucide.MapPin size={18} />
                  </div>
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-slate-900">
                      Delivery Address
                    </h2>
                    <p className="text-xs text-slate-500">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                  <Lucide.Truck size={12} />
                  3-5 Days
                </span>
              </div>

              <button
                type="button"
                onClick={useCurrentLocation}
                disabled={loadingGps}
                className="w-full mb-5 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/60 text-blue-700 font-semibold text-sm hover:bg-blue-50 hover:border-blue-400 transition-all disabled:opacity-60"
              >
                {loadingGps ? (
                  <>
                    <Lucide.Loader2 size={16} className="animate-spin" />
                    Detecting your location...
                  </>
                ) : (
                  <>
                    <Lucide.LocateFixed size={16} />
                    Use My Current Location
                  </>
                )}
              </button>

              {locationError && (
                <p className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {locationError}
                </p>
              )}

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Pincode *</label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={pincode}
                      maxLength="6"
                      placeholder="Enter 6-digit pincode"
                      className={inputClass}
                      onChange={(e) =>
                        setPincode(e.target.value.replace(/\D/g, ""))
                      }
                    />
                    {loadingLocation && (
                      <Lucide.Loader2
                        className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-amber-600"
                        size={18}
                      />
                    )}
                    {pincodeVerified && !loadingLocation && (
                      <Lucide.CircleCheck
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600"
                        size={18}
                      />
                    )}
                  </div>
                </div>

                {(city || state) && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <Lucide.MapPinned size={16} className="text-green-600 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-green-700">
                        Deliver to
                      </p>
                      <p className="text-sm font-semibold text-green-900">
                        {city}
                        {state ? `, ${state}` : ""}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className={labelClass}>Mobile Number *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      placeholder="10-digit mobile number"
                      maxLength="10"
                      className={`${inputClass} pl-12`}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    House No., Building, Street *
                  </label>
                  <textarea
                    value={address}
                    placeholder="Flat / House no., Building name, Street, Area"
                    className={`${inputClass} resize-none`}
                    rows="2"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Landmark{" "}
                    <span className="font-normal normal-case text-slate-400">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    placeholder="Near temple, school, shop..."
                    className={inputClass}
                    onChange={(e) => setLandmark(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Payment & Summary card */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-7 shadow-sm border border-slate-200/80">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                Payment Method
              </h3>
              <div className="space-y-3 mb-6">
                <div
                  onClick={() => setPaymentMethod("Cash on Delivery")}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "Cash on Delivery"
                      ? "bg-amber-50 border-amber-400"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        paymentMethod === "Cash on Delivery"
                          ? "bg-amber-100"
                          : "bg-white border border-slate-200"
                      }`}
                    >
                      <Lucide.Banknote
                        size={18}
                        className={
                          paymentMethod === "Cash on Delivery"
                            ? "text-amber-600"
                            : "text-slate-400"
                        }
                      />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-900 block">
                        Cash on Delivery
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Pay when you receive
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "Cash on Delivery"
                        ? "border-amber-500"
                        : "border-slate-300"
                    }`}
                  >
                    {paymentMethod === "Cash on Delivery" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    )}
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod("Online")}
                  className={`rounded-xl border-2 cursor-pointer transition-all overflow-hidden ${
                    paymentMethod === "Online"
                      ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-400 shadow-sm"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
                          paymentMethod === "Online"
                            ? "bg-white shadow-sm border border-amber-100"
                            : "bg-white border border-slate-200"
                        }`}
                      >
                        <Lucide.Smartphone
                          size={18}
                          className={
                            paymentMethod === "Online"
                              ? "text-amber-600"
                              : "text-slate-400"
                          }
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-sm text-slate-900 block">
                          Pay Online
                        </span>
                        <span className="text-[11px] text-slate-500">
                          UPI apps & cards via Razorpay
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "Online"
                          ? "border-amber-500"
                          : "border-slate-300"
                      }`}
                    >
                      {paymentMethod === "Online" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      )}
                    </div>
                  </div>
                  <div
                    className={`px-4 pb-4 pt-0 transition-all ${
                      paymentMethod === "Online" ? "opacity-100" : "opacity-80"
                    }`}
                  >
                    <PaymentLogoStrip />
                  </div>
                </div>
              </div>

              {paymentMethod === "Online" && (
                <div className="mb-6">
                  <OnlinePayment
                    amount={finalPrice}
                    merchantName={MERCHANT_NAME}
                    user={getUser()}
                    phone={phone}
                    onValidate={validateDelivery}
                    onRazorpaySuccess={handleRazorpaySuccess}
                    disabled={isSubmitting}
                  />
                </div>
              )}

              {/* Order Summary */}
              <div className="space-y-3 pt-5 border-t border-slate-200">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-semibold">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Coupon Discount</span>
                    <span className="font-semibold">
                      -₹{discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Delivery</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <span className="font-bold text-slate-900">Amount Payable</span>
                  <span className="text-2xl md:text-3xl font-black text-amber-600">
                    ₹{finalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {paymentMethod === "Cash on Delivery" && (
                <button
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className={`group w-full mt-6 py-4 rounded-xl font-bold uppercase tracking-wide text-sm shadow-lg transition-all duration-300 ${
                    isSubmitting
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white hover:shadow-xl"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Lucide.Loader2 className="animate-spin" size={18} />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Lucide.ShoppingBag size={18} />
                      Place Order (COD)
                      <Lucide.ArrowRight
                        size={16}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </span>
                  )}
                </button>
              )}

              <div className="flex items-center justify-center gap-5 mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                  <Lucide.ShieldCheck size={13} />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                  <Lucide.Truck size={13} />
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
