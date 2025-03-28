"use client";
import { ReactNode } from "react";
import React from "react";
import Link from "next/link";
import ProductCard from "../productcard/ProductCard";
import { Icon } from "@iconify/react/dist/iconify.js";

const ShowCaseContainer = ({
  headerTitle,
  destination,
  type,
  data
}: {
  headerTitle?: string;
  destination?: string;
  type: "related" | "discover";
  data: any[];
}) => {
  return (
    <div className="flex flex-col w-full bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">{headerTitle}</h2>
        {destination ? (
          <Link href={destination} passHref className="flex flex-row gap-2">
            <p className="text-blue-700 hover:underline">View all</p>
            <Icon
              icon="material-symbols:arrow-outward-rounded"
              className="text-blue-700 transition-all transform hover:rotate-45"
            />
          </Link>
        ) : null}
      </div>
      <div className="flex flex-row flex-wrap gap-4">

        {destination !== "/products?category=sale" ? (
          <>
            {data.map((item, idx) => (
              <ProductCard
                key={idx}
                cardType={type}
                cardInfo={{
                  title: item.title,
                  price: item.price,
                  imagepath: item.imagepath,
                  productID: item.id,
                  discountprice: item.discountprice,
                }}
              />
            ))}
          </>
          //
         
        )
         : (
          <>
          {data.map((item, idx) => (
            <ProductCard
              key={idx}
              cardType={type}
              cardInfo={{
                title: item.title,
                price: item.price,
                imagepath: item.imagepath,
                productID: item.id,
                discountprice: item.discountprice,
              }}
            />
          ))}
        </>
        )}
      </div>
    </div>
  );
};

export default ShowCaseContainer;
