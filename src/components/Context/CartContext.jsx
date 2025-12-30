import React, { createContext, useContext, useState } from "react";
import { cartCountByUserId } from "../../services/apiService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = async (userId) => {
    try {
      if (!userId) return;
      const count = await cartCountByUserId(userId);
      setCartCount(count);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
