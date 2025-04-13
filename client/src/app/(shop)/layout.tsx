

import type { Metadata } from "next";
import { Viewport } from "next";
import React from "react";
import Layout from "./index";


export const metadata: Metadata = {
  title: "Assume Breach",
  description: "Confidence worn.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  initialScale: 1,
  width: "device-width",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return <Layout>{children}</Layout>;
}
