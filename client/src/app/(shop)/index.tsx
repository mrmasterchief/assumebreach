"use client";
import "../../styles/globals.css";
import "../../styles/modal.scss";
import { SidenavProvider } from "@/context/SideNavContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { CTFProvider } from "@/context/CtfContext";
import React from "react";
import LayoutInner from "./layoutInner";


export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <CTFProvider>
      <SidenavProvider>
        <AuthProvider>
          <CartProvider>
            <html lang="en">
              <body>
                <LayoutInner>

                  {children}
                </LayoutInner>
              </body>
            </html>
          </CartProvider>
        </AuthProvider>
      </SidenavProvider>
    </CTFProvider>
  );
}
