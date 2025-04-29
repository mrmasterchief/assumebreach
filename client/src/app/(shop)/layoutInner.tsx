"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/nav/Header";
import PageWrapper from "@/components/page-wrapper";
import SideNav from "@/components/nav/SideNav";
import Footer from "@/components/footer/Footer";
import { ToastContainer } from "react-toastify";
import { useSidenav } from "@/context/SideNavContext";
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../firebase/config'; 
import { useCTF } from "@/context/CtfContext";
import { v4 as uuidv4 } from 'uuid';
import { tokenValidation } from "@/hooks/ctf";

export default function LayoutInner({ children }: { children: React.ReactNode }) {
    const { isSidenavOpen } = useSidenav();  
    const { ctfOpen, setCTFOpen } = useCTF();
    const [loading, setLoading] = useState(true);


  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'gameStatus'), (docSnapshot) => {
      const data = docSnapshot.data();
      if (data && data.CTFOpen) {
        setCTFOpen(true);        
      } else {
        setCTFOpen(false);
        if (window.location.pathname === "/account/authenticate" || window.location.pathname === "/") return;
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

  useEffect(() => {
    const tokenValid = async () => {
      try {
       const result = await tokenValidation();
        if (!result) {
          window.location.href = "/";
          return;
        }
        setLoading(false);
      }
      catch (error) {
        console.error("Error in token validation", error);
        window.location.href = "/";
      }
    };

    tokenValid();
  }, []);
    

  if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loader"></div>
            </div>
        );
    }

    return (

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
    );
}
