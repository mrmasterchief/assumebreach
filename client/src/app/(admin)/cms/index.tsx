"use client";
import "../../../styles/globals.css";
import PageWrapper from "@/components/page-wrapper";
import { ToastContainer } from "react-toastify";
import { CMSProvider } from "@/context/CMSContext";
import { useCMS } from "@/context/CMSContext";
import React, { useEffect } from "react";
import SideBar from "@/components/cms/Sidebar";
import Header from "@/components/nav/Header";
import { CTFProvider } from "@/context/CtfContext";
import { indexFunction } from "@/hooks";
import { useRefreshToken } from "@/hooks/user";
import { getUserInfo } from "@/hooks/user";

export default function Layout({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    const checkAuth = async () => {
      try {
        indexFunction(
          [
            () => getUserInfo({ unsafeID: localStorage.getItem("unsafeID") || "" }),
            
          ],
          (results: any[]) => {
            if(!results[0]) {
              if(window. location.pathname !== "/cms/login") {
              window.location.href = "/cms/login";
              }
              return;
            }
          },
          false
        );
      }
      catch (error) {
        window.location.href = "/cms/login";
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
