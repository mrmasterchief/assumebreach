"use client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import React, {useState, useEffect} from "react";
import ShowCaseContainer from "@/components/container/ShowCaseContainer";
import { getProductsByCategory } from "@/hooks/products";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const style = searchParams.get("style");
  const [productData, setProductData] = useState<any[]>([]);
  const CATEGORIES: { [key: string]: string } = {
    "Weekly Picks": "picks",
    "Latest Drops": "drops",
    "Sale": "sale",
    "Suits": "suits",
    "All Shirts": "shirts",
  };

  useEffect(() => {
    if(!category) {
      getProductsByCategory("Suits").then((response) => {
        setProductData(response);
      });
    }
    getProductsByCategory(Object.keys(CATEGORIES).find((key) => CATEGORIES[key] === category) || 
    (category ? category.charAt(0).toUpperCase() + category.slice(1) : "")).then((response) => {
      setProductData(response);
    });
  }, [category]);




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
              {Object.keys(CATEGORIES).find((key) => CATEGORIES[key] === category)}
            </h1>
            <ShowCaseContainer type="related" data={
              productData
            } />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
