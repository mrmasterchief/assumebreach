"use client";
import "../../../styles/globals.css";
import PageWrapper from "@/components/page-wrapper";
import { ToastContainer } from "react-toastify";
import { CMSProvider } from "@/context/CMSContext";
import React, { useEffect } from "react";
import Header from "@/components/nav/Header";
import { CTFProvider } from "@/context/CtfContext";
import { indexFunction } from "@/hooks";
import { getUserInfo } from "@/hooks/user";

export default function Layout({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    if(window.location.pathname === "/admin/login") return;
    const checkAuth = async () => {
      try {
        indexFunction(
          [
            () => getUserInfo({ unsafeID: localStorage.getItem("unsafeID") || "" }),
            
          ],
          (results: { userInfo: 
            {
              id: string;
              username: string;
              email: string;
              role: string;
              created_at: string;
              updated_at: string;
            };
           }[]) => {
            if(!results[0]) {
              if(window. location.pathname !== "/admin/login") {
              window.location.href = "/admin/login";
              }
              return;
            }
          },
          false
        );
      }
      catch (error) {
        window.location.href = "/admin/login";
        console.error("Error fetching user info", error);
      }
    };
    checkAuth();
  }
  , []);

  return (
      <CTFProvider>
        <CMSProvider>
        <html lang="en">
          <body>
            <div className="flex">
              <main className="flex-1"> 
                <Header type={'cms'} />
                  <PageWrapper>
                    <ToastContainer aria-label={"alert"} />
                    {children}
                  </PageWrapper>
              </main>
            </div>
          </body>
        </html>
        </CMSProvider>
      </CTFProvider>
  );
}
