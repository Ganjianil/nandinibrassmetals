import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; // Kept for external Pincode API only
import api from "./api"; // Your NEW custom instance for Backend
import * as Lucide from "lucide-react";

const Cart = () => {
  const { cart, totalPrice, clearCart, removeFromCart, updateQuantity } =
    useCart();
  const navigate = useNavigate();

  // Address States
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Payment & Coupon States
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  // --- CACHE STORAGE LOGIC ---
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
      // Standard axios used here as this is an external API
      const res = await axios.get(
        `https://api.postalpincode.in/pincode/${pin}`,
      );
      if (res.data[0].Status === "Success") {
        const data = res.data[0].PostOffice[0];
        setCity(data.District);
        setState(data.State);
      }
    } catch (err) {
      console.error("Location fetch failed");
    } finally {
      setLoadingLocation(false);
    }
  };

  const applyCoupon = async () => {
    if (!coupon) return alert("Please enter a code");

    try {
      // Using 'api' instance - no URL prefix needed
      const res = await api.post("/api/validate-promo", {
        code: coupon.toUpperCase(),
      });

      if (res.data.success) {
        const discountPercent = res.data.discount_percent;
        const calculatedDiscount = Math.round(
          (totalPrice * discountPercent) / 100,
        );

        setDiscount(calculatedDiscount);
        alert(`Coupon Applied! You saved ₹${calculatedDiscount}`);
      }
    } catch (err) {
      console.error("Coupon Error:", err);
      alert(err.response?.data?.message || "Invalid Coupon Code");
      setDiscount(0);
    }
  };

  const finalPrice = Math.round(totalPrice - discount);

  const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return alert("Please Login First!");
    if (!phone || !address || !pincode) return alert("Fill shipping details!");
    if (cart.length === 0) return alert("Cart is empty!");

    try {
      const fullAddress = `${address}, ${city}, ${state} - ${pincode}`;

      // Using 'api' instance - withCredentials is now automatic
      await api.post("/api/orders", {
        userId: user.id,
        username: user.username || user.name || "Customer",
        email: user.email,
        phone,
        address: fullAddress,
        cartItems: cart,
        totalAmount: finalPrice,
        paymentMethod,
        couponCode: coupon,
      });

      alert("Order Placed Successfully!");
      clearCart();
      localStorage.removeItem("nandhini_cart_cache");
      navigate("/");
    } catch (err) {
      console.error("Checkout Error:", err);
      alert("Order Failed: " + (err.response?.data?.error || "Server Error"));
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Lucide.ShoppingBag size={48} className="text-slate-200" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">
          Your bag is empty
        </h2>
        <p className="text-slate-500 mt-2 mb-8">
          Looks like you haven't added any divine pieces yet.
        </p>
        <Link
          to="/"
          className="bg-amber-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all"
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
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-slate-900 leading-none">
              Your Bag <span className="text-amber-600">.</span>
            </h1>
          </div>
          <button
            onClick={() => window.confirm("Clear all items?") && clearCart()}
            className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-bold uppercase text-[10px] tracking-widest transition-colors self-start md:self-auto"
          >
            <Lucide.Trash2 size={14} /> Clear Entire Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 md:p-6 rounded-[2rem] shadow-sm border border-slate-100 flex gap-6 items-center group"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={
                      item.image
                        ? `http://localhost:5000${item.image}`
                        : "https://via.placeholder.com/150"
                    }
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-black text-slate-900 uppercase text-sm md:text-lg leading-tight">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Lucide.X size={20} />
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 gap-4">
                    <div className="flex items-center bg-slate-50 rounded-xl p-1 w-fit border border-slate-100">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, (item.quantity || 1) - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-slate-400 hover:text-red-600"
                      >
                        {item.quantity <= 1 ? (
                          <Lucide.Trash2 size={12} />
                        ) : (
                          <Lucide.Minus size={12} />
                        )}
                      </button>
                      <span className="px-4 font-black text-sm">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, (item.quantity || 1) + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-amber-600"
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

            <div className="bg-white p-6 rounded-[2rem] border border-dashed border-slate-300 mt-8">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="HAVE A PROMO CODE?"
                  className="flex-1 bg-transparent border-none outline-none font-black text-xs tracking-widest uppercase"
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <button
                  onClick={applyCoupon}
                  className="text-amber-600 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 rounded-[3rem] p-8 md:p-10 text-white shadow-2xl sticky top-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                <Lucide.Truck className="text-amber-500" /> Shipping Details
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                      Mobile
                    </label>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      className="w-full bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                      Pincode
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength="6"
                        placeholder="600001"
                        className="w-full bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                        onChange={(e) => setPincode(e.target.value)}
                      />
                      {loadingLocation && (
                        <Lucide.Loader2
                          className="absolute right-4 top-4 animate-spin text-amber-500"
                          size={18}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                    Address
                  </label>
                  <textarea
                    rows="2"
                    placeholder="House No, Street Name, Area"
                    className="w-full bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                    <span className="block text-[8px] font-black uppercase text-slate-500">
                      City
                    </span>
                    <span className="font-bold text-sm text-slate-200">
                      {city || "---"}
                    </span>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                    <span className="block text-[8px] font-black uppercase text-slate-500">
                      State
                    </span>
                    <span className="font-bold text-sm text-slate-200">
                      {state || "---"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-800">
                <div className="flex items-center justify-between p-4 bg-amber-600/10 border border-amber-600/20 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Lucide.Banknote className="text-amber-500" size={20} />
                    <span className="font-bold text-sm uppercase tracking-widest text-slate-200">
                      Cash on Delivery
                    </span>
                  </div>
                  <Lucide.CheckCircle2 size={20} className="text-amber-500" />
                </div>
              </div>

              <div className="mt-10 space-y-3">
                <div className="flex justify-between text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-500 font-bold uppercase text-[10px] tracking-widest">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between items-end pt-4 border-t border-slate-800">
                  <span className="font-black uppercase text-sm tracking-widest">
                    Total Payable
                  </span>
                  <span className="text-4xl font-black text-amber-500">
                    ₹{finalPrice}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-10 py-6 bg-amber-600 rounded-[2rem] font-black text-lg uppercase tracking-[0.2em] hover:bg-amber-500 shadow-xl shadow-amber-900/20 transition-all active:scale-95"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
