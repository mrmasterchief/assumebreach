"use client";
import React from "react";
import { ToastContainer } from "react-toastify";

export default function LayoutInner({ children }: { children: React.ReactNode }) {



  return (
    <html lang="en">
      <body className="bg-black-100">
          <ToastContainer aria-label={"alert"} />
          {children}

      </body>
    </html>
  );
}
