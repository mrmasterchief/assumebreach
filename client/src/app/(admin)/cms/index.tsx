"use client";
import "../../../styles/globals.css";
import PageWrapper from "@/components/page-wrapper";
import { ToastContainer } from "react-toastify";
import { CSRFProvider } from "@/context/useCSRFToken";
import { CMSProvider } from "@/context/CMSContext";
import { useCMS } from "@/context/CMSContext";
import React from "react";
import SideBar from "@/components/cms/Sidebar";
import Header from "@/components/nav/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <CSRFProvider>
        <CMSProvider>
        <html lang="en">
          <body>
            <div className="flex">
            <SideBar/>

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
      </CSRFProvider>
  );
}
