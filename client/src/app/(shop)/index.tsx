"use client";
import "../../styles/globals.css";
import Header from "@/components/nav/Header";
import PageWrapper from "@/components/page-wrapper";
import SideNav from "@/components/nav/SideNav";
import Footer from "@/components/footer/Footer";
import { ToastContainer } from "react-toastify";
import { SidenavProvider } from "@/context/SideNavContext";
import { CartProvider } from "@/context/CartContext";
import { CSRFProvider } from "@/context/useCSRFToken";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidenavOpen, setIsSidenavOpen] = React.useState(false);
  const toggleSidenav = () => {
    setIsSidenavOpen(!isSidenavOpen);
  };

  return (
    <SidenavProvider>
      <CSRFProvider>
        <CartProvider>
        <html lang="en">
          <body>
            <div className="flex ">
              <main className="flex-1">
                  {isSidenavOpen ? (
                    <SideNav toggleSidenav={toggleSidenav} />
                  ) : null}
                  <Header toggleSidenav={toggleSidenav}  />
                  <PageWrapper>
                    <ToastContainer aria-label={"alert"} />
                    {children}
                  </PageWrapper>
                  <div className="flex flex-col justify-center items-center w-full max-w-[1440px] mx-auto">
                  <Footer />
                  </div>
              </main>
            </div>
          </body>
        </html>
        </CartProvider>
      </CSRFProvider>
    </SidenavProvider>
  );
}
