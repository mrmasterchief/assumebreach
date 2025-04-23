"use client";
import React from "react";
import { ToastContainer } from "react-toastify";

export default function LayoutInner({ children }: { children: React.ReactNode }) {



  return (
    <html lang="en">
      <body>
          <ToastContainer aria-label={"alert"} />
          {children}

      </body>
    </html>
  );
}
