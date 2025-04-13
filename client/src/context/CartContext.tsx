'use client';
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext({
  isCartOpen: false,
  toggleCart: () => {},
});

export const CartProvider = ({ children }  : { children: React.ReactNode }
) => {
  const [isCartOpen, setIsCartOpen] = useState(true);

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };
  

  return (
    <CartContext.Provider value={{ isCartOpen, toggleCart}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);