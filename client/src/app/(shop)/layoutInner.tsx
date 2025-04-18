"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/nav/Header";
import PageWrapper from "@/components/page-wrapper";
import SideNav from "@/components/nav/SideNav";
import Footer from "@/components/footer/Footer";
import { ToastContainer } from "react-toastify";
import { useSidenav } from "@/context/SideNavContext";
import { onSnapshot, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config'; 
import { useCTF } from "@/context/CtfContext";
import { v4 as uuidv4 } from 'uuid';

export default function LayoutInner({ children }: { children: React.ReactNode }) {
    const { isSidenavOpen, toggleSidenav } = useSidenav();  
    const { ctfOpen, setCTFOpen } = useCTF();


  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'gameStatus'), (docSnapshot) => {
      const data = docSnapshot.data();
      if (data && data.CTFOpen) {
        setCTFOpen(true);        
      } else {
        setCTFOpen(false);
        if (window.location.pathname === "/account/authenticate") return;
        window.location.href = "/account/authenticate";
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const cookieName = "--anon-ctf-unique-identifier";
    const cookieValue = uuidv4();
    const cookieExists = document.cookie.split(';').some((item) => item.trim().startsWith(`${cookieName}=`));
    if (!cookieExists) {
        document.cookie = `${cookieName}=${cookieValue}; path=/; max-age=31536000;`;
    }
  }, []);
    


    return (
        <html lang="en">
            <body>
                <div className="flex ">
                    <main className="flex-1">
                        {ctfOpen ? (
                            <>
                        {isSidenavOpen ? (
                            <SideNav ctfOpen={ctfOpen} />
                        ) : null}
                        <Header />
                        <PageWrapper>
                            <ToastContainer aria-label={"alert"} />
                            {children}
                        </PageWrapper>
                        <div className="flex flex-col justify-center items-center w-full max-w-[1440px] mx-auto">
                            <Footer />
                        </div>
                        </>
                        ) : (
                            <PageWrapper>
                            <ToastContainer aria-label={"alert"} />
                            {children}
                        </PageWrapper>
                        )}
                    </main>
                </div>
            </body>
        </html>
    );
}
