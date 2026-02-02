import React from "react";
import { useCart } from "./CartContext";
import { Link } from "react-router-dom";
import axios from "axios";
import * as Lucide from "lucide-react";

const API_BASE_URL = "https://nandinibrassmetals-1.onrender.com";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } =
    useCart();

  // Smart URL logic to ensure images show up correctly
  const getImgSrc = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  };

  const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Please login to place an order!");

    try {
      await axios.post(`${API_BASE_URL}/api/orders`, {
        userId: user.id,
        totalAmount: totalPrice,
        items: cart,
      });
      alert("Order Placed Successfully!");
      clearCart();
    } catch (err) {
      alert("Checkout failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20">
      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900">
          Your Collection
        </h1>
        <span className="bg-amber-100 text-amber-700 px-4 py-1 rounded-full font-black text-sm">
          {cart.length} Items
        </span>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <Lucide.ShoppingBag
            className="mx-auto text-slate-300 mb-6"
            size={64}
          />
          <p className="text-slate-500 font-bold text-xl mb-8">
            Your cart is empty.
          </p>
          <Link
            to="/"
            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-600 transition-all"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* CART ITEMS LIST */}
          <div className="lg:col-span-2 space-y-8">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-6 pb-8 border-b border-slate-100 items-center"
              >
                {/* IMAGE CONTAINER */}
                <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-100 rounded-[2rem] overflow-hidden flex-shrink-0 border border-slate-100">
                  <img
                    src={getImgSrc(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/150?text=No+Image";
                    }}
                  />
                </div>

                {/* ITEM DETAILS */}
                <div className="flex-grow">
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter text-slate-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-amber-600 font-black mb-4">
                    ₹{item.price}
                  </p>

                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all"
                      >
                        <Lucide.Minus size={14} />
                      </button>
                      <span className="px-4 font-black text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all"
                      >
                        <Lucide.Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-2"
                    >
                      <Lucide.Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="hidden md:block text-right">
                  <p className="font-black text-lg text-slate-900">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-slate-950 text-white p-10 rounded-[3rem] sticky top-32">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 border-b border-white/10 pb-4">
                Summary
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-400 font-medium">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-medium">
                  <span>Shipping</span>
                  <span className="text-green-400 uppercase text-xs font-black">
                    Free
                  </span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <span className="text-sm font-bold uppercase tracking-widest">
                    Total
                  </span>
                  <span className="text-3xl font-black text-amber-500">
                    ₹{totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-amber-600 hover:bg-white hover:text-amber-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl"
              >
                Complete Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
