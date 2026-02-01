import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // --- PERSISTENCE LOGIC: Initializing from LocalStorage ---
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("nandhini_cart_cache");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // --- PERSISTENCE LOGIC: Syncing to LocalStorage on change ---
  useEffect(() => {
    localStorage.setItem("nandhini_cart_cache", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item,
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  };

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item,
      ),
    );
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("nandhini_cart_cache"); // Wipe cache on manual clear
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0,
  );

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
