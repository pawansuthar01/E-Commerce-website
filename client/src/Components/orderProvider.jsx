import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const OrderContext = createContext();
export const useOrder = () => {
  return useContext(OrderContext);
};
export const OrderProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]),
      cartData(localStorage.setItem("cart", setCart));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };
  const navigate = useNavigate();
  const AllProduct = () => {
    navigate("/AllProduct");
  };
  return (
    <OrderContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, AllProduct }}
    >
      {children}
    </OrderContext.Provider>
  );
};
