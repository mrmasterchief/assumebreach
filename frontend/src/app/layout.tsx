import "../styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "@/components/nav/Header";
import HeaderMobile from "@/components/nav/HeaderMobile";
import MarginWidthWrapper from "@/components/margin-width-wrapper";
import PageWrapper from "@/components/page-wrapper";
import SideNav from "@/components/nav/SideNav";
import Footer from "@/components/footer/Footer";
import { Viewport } from "next";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Assume Breach",
  description: "Confidence worn.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  initialScale: 1,
  width: "device-width",
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-white`}>
        <div className="flex">
          <SideNav />
          <main className="flex-1">
            <MarginWidthWrapper>
              <Header />
              <HeaderMobile />
              <PageWrapper>
                <ToastContainer aria-label={"alert"} />
                {children}
              </PageWrapper>
              <Footer />
            </MarginWidthWrapper>
          </main>
        </div>
      </body>
    </html>
  );
}
