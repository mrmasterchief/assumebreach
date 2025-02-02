'use client';
import React, { createContext, useState, useContext } from 'react';

const SidenavContext = createContext({
  isSidenavOpen: false,
  toggleSidenav: () => {},
});

export const SidenavProvider = ({ children }  : { children: React.ReactNode }
) => {
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);

  const toggleSidenav = () => {
    setIsSidenavOpen(!isSidenavOpen);
  };

  return (
    <SidenavContext.Provider value={{ isSidenavOpen, toggleSidenav }}>
      {children}
    </SidenavContext.Provider>
  );
};

export const useSidenav = () => useContext(SidenavContext);