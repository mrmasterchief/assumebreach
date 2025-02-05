"use client";
import "../../../styles/globals.css";
import MarginWidthWrapper from "@/components/margin-width-wrapper";
import PageWrapper from "@/components/page-wrapper";
import { ToastContainer } from "react-toastify";
import { CSRFProvider } from "@/context/useCSRFToken";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <CSRFProvider>
        <html lang="en">
          <body className={`bg-white`}>
            <div className="flex ">
              <main className="flex-1">
                <MarginWidthWrapper>
                  <PageWrapper>
                    <ToastContainer aria-label={"alert"} />
                    {children}
                  </PageWrapper>
                </MarginWidthWrapper>
              </main>
            </div>
          </body>
        </html>
      </CSRFProvider>
  );
}
