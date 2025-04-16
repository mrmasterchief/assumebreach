"use client";
import "../../styles/globals.css";
import "../../styles/modal.scss";
import { SidenavProvider } from "@/context/SideNavContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import React from "react";
import LayoutInner from "./layoutInner";

export default function Layout({ children }: { children: React.ReactNode }) {



  return (
    <SidenavProvider>
      <AuthProvider>
        <CartProvider>
          <LayoutInner>
            {children}
          </LayoutInner>
        </CartProvider>
      </AuthProvider>
    </SidenavProvider>
  );
}
