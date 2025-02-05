

import React from "react";
import Layout from "./index";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return  <Layout>{children}</Layout>
  
}
