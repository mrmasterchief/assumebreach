"use client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import React from "react";
import ShowCaseContainer from "@/components/container/ShowCaseContainer";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  return (
    <div className="flex flex-col bg-white">
      <div className="flex align-center justify-center w-full max-w-[1440px] mx-auto">
        <div className="px-4 bg-white flex flex-col gap-20 border-t border-gray-200 py-8 w-full justify-center">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col w-1/4">
              <div className="flex flex-col gap-4 align-start justify-start">
                <p>Sort by</p>
                <a href="/products?category=drops&sort=arrivals" className="text-md">Latest Arrivals</a>
                <a href="/products?category=drops&sort=pricelowtohigh" className="text-md">Price Low -{">"} High</a>
                <a href="/products?category=drops&sort=pricehightolow" className="text-md">Price High -{">"} Low</a>

              </div>
            </div>
            <div className="flex flex-col w-full">
            <h1 className="text-4xl font-bold">
              {String(category).charAt(0).toUpperCase() +
                String(category).slice(1)}
            </h1>
            <ShowCaseContainer type="related" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
