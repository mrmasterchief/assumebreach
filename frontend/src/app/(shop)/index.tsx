"use client";
import "../../styles/globals.css";
import Header from "@/components/nav/Header";
import MarginWidthWrapper from "@/components/margin-width-wrapper";
import PageWrapper from "@/components/page-wrapper";
import SideNav from "@/components/nav/SideNav";
import Footer from "@/components/footer/Footer";
import { ToastContainer } from "react-toastify";
import { SidenavProvider } from "@/context/SideNavContext";
import { CSRFProvider } from "@/context/useCSRFToken";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidenavOpen, setIsSidenavOpen] = React.useState(false);
  const [cartItems, setCartItems] = React.useState([]);
  const toggleSidenav = () => {
    setIsSidenavOpen(!isSidenavOpen);
  };

  return (
    <SidenavProvider>
      <CSRFProvider>
        <html lang="en">
          <body className={`bg-white`}>
            <div className="flex ">
              <main className="flex-1">
                <MarginWidthWrapper>
                  {isSidenavOpen ? (
                    <SideNav toggleSidenav={toggleSidenav} />
                  ) : null}
                  <Header toggleSidenav={toggleSidenav} cartItems={cartItems} />
                  <PageWrapper>
                    <ToastContainer aria-label={"alert"} />
                    {children}
                  </PageWrapper>
                  <Footer />
                </MarginWidthWrapper>
              </main>
            </div>
          </body>
        </html>
      </CSRFProvider>
    </SidenavProvider>
  );
}
