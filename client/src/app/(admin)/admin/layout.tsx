

import React from "react";
import Layout from "../cms/index";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return  <Layout>{children}</Layout>
  
}
