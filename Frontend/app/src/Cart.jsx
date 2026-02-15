import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useNavigate, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
import api from "./api";
import * as Lucide from "lucide-react";

const Cart = () => {
  const { cart, totalPrice, clearCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  // Shipping States
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment & Promo States
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [utr, setUtr] = useState("");

  const UPI_ID = "9705140250-4@ybl";
  const MERCHANT_NAME = "Nandhini Brass Metals";

  // --- FIXED IMAGE SOURCE LOGIC ---
  const getImgSrc = (path) => {
    if (!path) return "https://via.placeholder.com/150?text=Brass+Metals";
    const API_BASE_URL = api.defaults.baseURL;

    let cleanPath = path;

    // 1. If it's a JSON string (like your database format), parse it
    if (typeof path === "string" && path.startsWith("[")) {
      try {
        const parsed = JSON.parse(path);
        cleanPath = Array.isArray(parsed) ? parsed[0] : path;
      } catch (e) {
        cleanPath = path;
      }
    }
    // 2. If it's already an array, take the first item
    else if (Array.isArray(path)) {
      cleanPath = path[0];
    }

    // 3. Final safety check: must be a string before calling .startsWith
    if (typeof cleanPath !== "string") return "https://via.placeholder.com/150";

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
  }, [pincode]);

  const fetchLocation = async (pin) => {
    setLoadingLocation(true);
    try {
      const res = await axios.get(
        `https://api.postalpincode.in/pincode/${pin}`,
      );
      if (res.data[0].Status === "Success") {
        const data = res.data[0].PostOffice[0];
        setCity(data.District);
        setState(data.State);
      }
    } catch (err) {
      console.error("Location error");
    } finally {
      setLoadingLocation(false);
    }
  };

  const applyCoupon = async () => {
    if (!coupon) return alert("Please enter a code");
    try {
      const res = await api.post("/api/validate-promo", {
        code: coupon.toUpperCase(),
      });
      if (res.data.success) {
        const calculatedDiscount = Math.round(
          (totalPrice * res.data.discount_percent) / 100,
        );
        setDiscount(calculatedDiscount);
        alert(`Coupon Applied! Saved ₹${calculatedDiscount}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid Code");
      setDiscount(0);
    }
  };

  const finalPrice = Math.round(totalPrice - discount);
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${finalPrice}&cu=INR`;

 const handleCheckout = async () => {
   // 1. Get user from storage
   const userString = localStorage.getItem("user");
   const user = userString ? JSON.parse(userString) : null;

   if (!user) {
     alert("Please Login First!");
     navigate("/login"); // Better UX to send them to login
     return;
   }

   // 2. Validation
   if (!phone || !address || !pincode) {
     return alert("Please fill in all shipping details!");
   }

   if (paymentMethod !== "Cash on Delivery" && !utr) {
     return alert(
       "Please enter the Transaction ID / UTR after completing payment!",
     );
   }

   // 3. Prepare the payload exactly as the backend expects
   const orderData = {
     userId: user.id,
     username: user.username || user.name || "Customer",
     email: user.email, // THIS IS REQUIRED FOR THE CUSTOMER EMAIL
     phone,
     address: `${address}, ${city}, ${state} - ${pincode}`,
     cartItems: cart.map((item) => ({
       id: item.id,
       name: item.name,
       quantity: item.quantity || 1,
       price: item.price,
       image: item.image, // Included for the order summary
     })),
     totalAmount: finalPrice,
     paymentMethod,
     transactionId: utr,
     couponCode: coupon,
   };

   try {
     const response = await api.post("/api/orders", orderData);

     // Success logic
     alert("Order Placed Successfully! Check your email for confirmation.");
     clearCart();
     localStorage.removeItem("nandhini_cart_cache");
     navigate("/");
   } catch (err) {
     console.error("Order Error:", err);
     alert(err.response?.data?.error || "Order Failed. Please try again.");
   }
 };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Lucide.ShoppingBag size={48} className="text-slate-200 mb-6" />
        <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">
          Your bag is empty
        </h2>
        <Link
          to="/"
          className="bg-amber-600 text-white px-10 py-4 rounded-2xl font-black uppercase mt-8"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-amber-600 font-black text-xs uppercase tracking-[0.3em] block mb-2">
              Checkout Securely
            </span>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-slate-900 leading-[0.8]">
              Your Bag<span className="text-amber-600">.</span>
            </h1>
          </div>
          <button
            onClick={() => window.confirm("Clear all?") && clearCart()}
            className="text-slate-400 hover:text-red-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2"
          >
            <Lucide.Trash2 size={14} /> Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 md:p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex gap-6 items-center"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                  <img
                    src={getImgSrc(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-slate-900 uppercase text-sm md:text-xl mb-4 leading-tight">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, (item.quantity || 1) - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-slate-400"
                      >
                        <Lucide.Minus size={12} />
                      </button>
                      <span className="px-4 font-black text-sm">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, (item.quantity || 1) + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-amber-600"
                      >
                        <Lucide.Plus size={12} />
                      </button>
                    </div>
                    <span className="text-xl font-black text-slate-900">
                      ₹{item.price * (item.quantity || 1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5">
            <div className="bg-slate-900 rounded-[3rem] p-8 md:p-10 text-white shadow-2xl sticky top-8">
              <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
                <Lucide.Truck className="text-amber-500" /> Shipping
              </h2>
              <div className="space-y-4 mb-8">
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  className="w-full bg-slate-800 rounded-2xl p-4 text-sm"
                  onChange={(e) => setPhone(e.target.value)}
                />
                <div className="relative">
                  <input
                    type="text"
                    maxLength="6"
                    placeholder="Pincode"
                    className="w-full bg-slate-800 rounded-2xl p-4 text-sm"
                    onChange={(e) => setPincode(e.target.value)}
                  />
                  {loadingLocation && (
                    <Lucide.Loader2
                      className="absolute right-4 top-4 animate-spin text-amber-500"
                      size={18}
                    />
                  )}
                </div>
                <textarea
                  placeholder="Full Address"
                  className="w-full bg-slate-800 rounded-2xl p-4 text-sm resize-none"
                  rows="2"
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="space-y-3 mb-8">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Payment Selection
                </h3>
                <div
                  onClick={() => setPaymentMethod("Cash on Delivery")}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === "Cash on Delivery" ? "bg-amber-600/10 border-amber-600" : "bg-slate-800 border-transparent"}`}
                >
                  <div className="flex items-center gap-3">
                    <Lucide.Banknote
                      size={18}
                      className={
                        paymentMethod === "Cash on Delivery"
                          ? "text-amber-500"
                          : "text-slate-400"
                      }
                    />
                    <span className="font-bold text-xs uppercase">
                      Cash on Delivery
                    </span>
                  </div>
                  {paymentMethod === "Cash on Delivery" && (
                    <Lucide.CheckCircle2 size={18} className="text-amber-500" />
                  )}
                </div>
                <div
                  onClick={() => setPaymentMethod("UPI/Online")}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === "UPI/Online" ? "bg-amber-600/10 border-amber-600" : "bg-slate-800 border-transparent"}`}
                >
                  <div className="flex items-center gap-3">
                    <Lucide.QrCode
                      size={18}
                      className={
                        paymentMethod === "UPI/Online"
                          ? "text-amber-500"
                          : "text-slate-400"
                      }
                    />
                    <span className="font-bold text-xs uppercase">
                      UPI / QR / Cards
                    </span>
                  </div>
                  {paymentMethod === "UPI/Online" && (
                    <Lucide.CheckCircle2 size={18} className="text-amber-500" />
                  )}
                </div>
              </div>

              {paymentMethod === "UPI/Online" && (
                <div className="bg-white p-6 rounded-[2.5rem] mb-8 text-center animate-in fade-in zoom-in duration-300">
                  <p className="text-slate-900 font-black text-[10px] uppercase tracking-widest mb-4">
                    Scan with GPay, PhonePe, or Paytm
                  </p>
                  <div className="bg-white p-4 inline-block rounded-2xl border-4 border-slate-50 shadow-inner">
                    <QRCodeSVG
                      value={upiLink}
                      size={160}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <div className="mt-4 space-y-3">
                    <p className="text-slate-500 text-[10px] font-bold uppercase">
                      Amount:{" "}
                      <span className="text-slate-900 text-lg">
                        ₹{finalPrice}
                      </span>
                    </p>
                    <input
                      type="text"
                      placeholder="ENTER 12-DIGIT UTR / TXN ID"
                      className="w-full bg-slate-100 text-slate-900 rounded-xl p-4 text-xs font-black border-2 border-slate-200 focus:border-amber-500 outline-none"
                      onChange={(e) => setUtr(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-6 border-t border-slate-800">
                <div className="flex justify-between items-end">
                  <span className="font-black uppercase text-sm">
                    Total Amount
                  </span>
                  <span className="text-4xl font-black text-amber-500">
                    ₹{finalPrice}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isSubmitting} // Prevent double clicks
                className={`w-full mt-10 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl transition-all ${
                  isSubmitting
                    ? "bg-slate-500 cursor-not-allowed"
                    : "bg-amber-600 hover:bg-amber-500 text-white"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Lucide.Loader2 className="animate-spin" /> Processing...
                  </div>
                ) : paymentMethod === "UPI/Online" ? (
                  "I Have Paid & Verified"
                ) : (
                  "Confirm Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
