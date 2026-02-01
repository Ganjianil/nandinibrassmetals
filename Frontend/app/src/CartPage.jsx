import React from "react";
import { useCart } from "./CartContext";
import axios from "axios";

const CartPage = () => {
  const { cart, removeFromCart, totalPrice, clearCart } = useCart();

  const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Please login to place an order!");

    try {
      await axios.post("http://localhost:5000/api/orders", {
        userId: user.id,
        totalAmount: totalPrice,
        items: cart, // Optional: you can save specific items too
      });
      alert("Order Placed Successfully!");
      clearCart();
    } catch (err) {
      alert("Checkout failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-4"
              >
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-gray-600">${item.price}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 text-right">
            <h2 className="text-2xl font-bold">
              Total: ${totalPrice.toFixed(2)}
            </h2>
            <button
              onClick={handleCheckout}
              className="mt-4 bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700"
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};
