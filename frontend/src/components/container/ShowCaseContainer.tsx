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
}: {
  headerTitle?: string;
  destination?: string;
  type: "related" | "discover";
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
            <ProductCard
              cardType={type}
              cardInfo={{
                title: "Product Title",
                price: "99.99",
                image: "https://via.placeholder.com/150",
                productID: "1",
              }}
            />
            <ProductCard
              cardType={type}
              cardInfo={{
                title: "Product Title",
                price: "99.99",
                image: "https://via.placeholder.com/150",
                productID: "1",
              }}
            />
            <ProductCard
              cardType={type}
              cardInfo={{
                title: "Product Title",
                price: "99.99",
                image: "https://via.placeholder.com/150",
                productID: "1",
              }}
            />
          </>
        ) : (
          <>
            <ProductCard
              cardType={type}
              cardInfo={{
                title: "Product Title",
                price: "99.99",
                image: "https://via.placeholder.com/150",
                productID: "1",
                discountPrice: "79.99",
              }}
            />
            <ProductCard
              cardType={type}
              cardInfo={{
                title: "Product Title",
                price: "99.99",
                image: "https://via.placeholder.com/150",
                productID: "1",
                discountPrice: "79.99",
              }}
            />
            <ProductCard
              cardType={type}
              cardInfo={{
                title: "Product Title",
                price: "99.99",
                image: "https://via.placeholder.com/150",
                productID: "1",
                discountPrice: "79.99",
              }}
            />
            <ProductCard
              cardType={type}
              cardInfo={{
                title: "Product Title",
                price: "99.99",
                image: "https://via.placeholder.com/150",
                productID: "1",
                discountPrice: "79.99",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ShowCaseContainer;
