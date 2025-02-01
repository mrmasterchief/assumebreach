"use client";
import { ReactNode } from "react";
import React from "react";
import Link from "next/link";
import ProductCard from "../productcard/ProductCard";
import { Icon } from "@iconify/react/dist/iconify.js";

const ShowCaseContainer = ({
  headerTitle,
  destination,
}: {
  headerTitle: string;
  destination: string;
}) => {
  return (
    <div className="flex flex-col w-full bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">{headerTitle}</h2>
        <Link href="/kaas" passHref className="flex flex-row gap-2">
          <p className="text-blue-500 hover:underline">View All</p>
          <Icon icon="material-symbols:arrow-outward-rounded" className="text-blue-500"/>
        </Link>
      </div>
      <div className="flex flex-row flex-wrap gap-4">
      <ProductCard
        cardType="product"
          searchResult={{
            title: "Product Title",
            price: "100",
            image: "https://via.placeholder.com/150",
          }}

        />
        <ProductCard
        cardType="product"
          searchResult={{
            title: "Product Title",
            price: "100",
            image: "https://via.placeholder.com/150",
          }}

        />
        <ProductCard
        cardType="product"
          searchResult={{
            title: "Product Title",
            price: "100",
            image: "https://via.placeholder.com/150",
          }}

        />
      </div>
    </div>
  );
};

export default ShowCaseContainer;
