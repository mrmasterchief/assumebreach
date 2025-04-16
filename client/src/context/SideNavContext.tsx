'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';

const SidenavContext = createContext({
  isSidenavOpen: false,
  toggleSidenav: () => {},
  closeSidenav: () => {},
});

export const SidenavProvider = ({ children }  : { children: React.ReactNode }
) => {
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const toggleSidenav = () => setIsSidenavOpen(prev => !prev);
  const closeSidenav = () => setIsSidenavOpen(false);


  return (
    <SidenavContext.Provider value={{ isSidenavOpen, toggleSidenav, closeSidenav }}>
      {children}
    </SidenavContext.Provider>
  );
};

export const useSidenav = () => useContext(SidenavContext);