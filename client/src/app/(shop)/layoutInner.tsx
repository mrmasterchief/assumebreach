"use client";

import {
    SidenavProvider
} from "@/context/SideNavContext";
import React from "react";
import Header from "@/components/nav/Header";
import PageWrapper from "@/components/page-wrapper";
import SideNav from "@/components/nav/SideNav";
import Footer from "@/components/footer/Footer";
import { ToastContainer } from "react-toastify";
import { useSidenav } from "@/context/SideNavContext";


export default function LayoutInner({ children }: { children: React.ReactNode }) {
    const { isSidenavOpen, toggleSidenav } = useSidenav();
    return (
        <html lang="en">
            <body>
                <div className="flex ">
                    <main className="flex-1">
                        {isSidenavOpen ? (
                            <SideNav />
                        ) : null}
                        <Header />
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
    );
}
