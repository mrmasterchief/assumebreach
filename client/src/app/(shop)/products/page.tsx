"use client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import React, { useState, useEffect, Suspense } from "react";
import ShowCaseContainer from "@/components/container/ShowCaseContainer";
import { getProductsByCategory } from "@/hooks/products";
import ContentContainer from "@/components/content-container";
import { indexFunction } from "@/hooks";

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const style = searchParams.get("style");
  const [productData, setProductData] = useState<any[]>([]);
  const CATEGORIES: { [key: string]: string } = {
    "Weekly Picks": "picks",
    "Latest Drops": "drops",
    Sale: "sale",
    Suits: "suits",
    "All Shirts": "shirts",
  };

  useEffect(() => {
    if (!category) {
      indexFunction(
        [
          () => getProductsByCategory("Suits"),
        ],
        (response) => {
          setProductData(response);
        },
        false
      );
      return;
    }
    indexFunction(
      [
        () => getProductsByCategory(Object.keys(CATEGORIES).find((key) => CATEGORIES[key] === category) ||
          (category ? category.charAt(0).toUpperCase() + category.slice(1) : "")),
      ],
      (response) => {
        setProductData(response);
      },
      false
    );

  }, [category]);

  return (
    <ContentContainer styles="gap-20">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col w-1/4">
          <div className="flex flex-col gap-4 align-start justify-start">
            <p>Sort by</p>
            <a
              href="/products?category=drops&sort=arrivals"
              className="text-md"
            >
              Latest Arrivals
            </a>
            <a
              href="/products?category=drops&sort=pricelowtohigh"
              className="text-md"
            >
              Price Low -{">"} High
            </a>
            <a
              href="/products?category=drops&sort=pricehightolow"
              className="text-md"
            >
              Price High -{">"} Low
            </a>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <h1 className="text-4xl font-bold">
            {Object.keys(CATEGORIES).find(
              (key) => CATEGORIES[key] === category
            )}
          </h1>
          <ShowCaseContainer type="related" data={productData} />
        </div>
      </div>
    </ContentContainer>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
