"use client";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
import ShowCaseContainer from "@/components/container/ShowCaseContainer";
import { getProductsByCategory } from "@/hooks/products";
import ContentContainer from "@/components/content-container";
import { indexFunction } from "@/hooks";
import { getFlag } from "@/hooks/ctf";
import { useRef } from "react";
import { Product } from "@/types/ProductTypes";

function ProductsContent() {
  const checkedXSSRef = useRef(false);
  const [productData, setProductData] = useState<Product[]>([]);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const sex = searchParams.get("sex");

  const CATEGORIES: { [key: string]: string } = {
    "Weekly Picks": "picks",
    "Latest Drops": "drops",
    Sale: "sale",
    Suits: "suits",
    "All Shirts": "shirts",
  };

  useEffect(() => {
    if (checkedXSSRef.current) return;

    const checkForXSS = async (inputs: string[]) => {
      checkedXSSRef.current = true;

      const xssPattern = /<script\b[^>]*>[\s\S]*?<\/script\s*>/gi;
      for (const input of inputs) {
        if (xssPattern.test(input)) {
          await indexFunction(
            [() => getFlag(5)],
            ([flagResult]) => {
              if (!flagResult) return;
              alert("XSS detected: " + flagResult.flag);
            },
            false
          );
        }
      }
    };

    const inputs = [category, sex].filter((input): input is string => input !== null);
    checkForXSS(inputs);
  }, [category, sex]);

  useEffect(() => {
    if (!checkedXSSRef.current) return;

    indexFunction(
      [
        () =>
          getProductsByCategory(
            Object.keys(CATEGORIES).find((key) => CATEGORIES[key] === category) ||
            (category ? category.charAt(0).toUpperCase() + category.slice(1) : "")
          ),
      ],
      (results) => {
        if (!results[0]) return;
        setProductData(results[0]);
      },
      false
    );
  }, [category]);


  return (
    <ContentContainer styles="gap-20">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col w-full">
          <h1 className="text-4xl font-bold" dangerouslySetInnerHTML={{
            __html: category ? category.charAt(0).toUpperCase() + category.slice(1) :
              'Suits'
          }} />
          <h1
            className="text-2xl font-bold text-gray-500"
            dangerouslySetInnerHTML={{
              __html: sex
                ? sex.charAt(0).toUpperCase() + sex.slice(1)
                : "Men",
            }}
          />

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
