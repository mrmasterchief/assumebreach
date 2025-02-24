'use client';
import React, { createContext, useState, useContext, act } from 'react';

const CMSContext = createContext({
  activePage: "Products",
  toggleActivePage: (page: "Products" | "Customers" | "Orders" | "Settings") => {},
});

export const CMSProvider = ({ children }  : { children: React.ReactNode }
) => {
  const [activePage, setActivePage] = useState<"Products" | "Customers" | "Orders" | "Settings">("Products");

  const toggleActivePage = (page: "Products" | "Customers" | "Orders" | "Settings") => {
    setActivePage(page);
  };

  return (
    <CMSContext.Provider value={{ activePage, toggleActivePage }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => useContext(CMSContext);