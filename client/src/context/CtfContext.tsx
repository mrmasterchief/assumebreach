/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { createContext, useState, useContext } from 'react';

const CTFContext = createContext({
  ctfOpen: false,
  toggleCTFOpen: () => {},
  setCTFOpen: (open: boolean) => {},
});

export const CTFProvider = ({ children }  : { children: React.ReactNode }
) => {
  const [ctfOpen, setCTFOpen] = useState(false);
  const toggleCTFOpen = () => setCTFOpen(prev => !prev);



  return (
    <CTFContext.Provider value={{ ctfOpen, setCTFOpen, toggleCTFOpen }}>
      {children}
    </CTFContext.Provider>
  );
};

export const useCTF = () => useContext(CTFContext);