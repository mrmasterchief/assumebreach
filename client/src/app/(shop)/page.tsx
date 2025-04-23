"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { showMessage } from "@/components/messages/Message";
import ShowCaseContainer from "@/components/container/ShowCaseContainer";
import { getProductsByCategory } from "@/hooks/products";
import ContentContainer from "@/components/content-container";
import { indexFunction } from "@/hooks";
import { Product } from "@/types/ProductTypes";

export default function Home() {
  const [weeklyPicks, setWeeklyPicks] = useState<Product[]>([]);
  const [latestDrops, setLatestDrops] = useState<Product[]>([]);
  const [sale, setSale] = useState<Product[]>([]);

  useEffect(() => {
    try {
      indexFunction(
        [
          () => getProductsByCategory("Weekly Picks"),
          () => getProductsByCategory("Latest Drops"),
          () => getProductsByCategory("Sale"),
        ],
        ([weeklyPicks, latestDrops, saleResult]) => {
          if (!weeklyPicks || !latestDrops || !saleResult) return;
          setWeeklyPicks(weeklyPicks.sort(() => 0.5 - Math.random()).slice(0, 3));
          setLatestDrops(latestDrops.sort(() => 0.5 - Math.random()).slice(0, 3));
          setSale(saleResult.sort(() => 0.5 - Math.random()).slice(0, 3));
        },
        true
      );
    }
    catch (error) {
      console.error(error);
      showMessage("Error", "Something went wrong", "error");
    }

  }, []);

  return (
    <>
      <div className="relative h-[600px]">
        <Image
          src="https://xsuit.com/cdn/shop/articles/suit_wearing_1200x1200_crop_center.webp?v=1720118555"
          alt="hero"
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">Assume Breach</h1>
            <p className="text-white">Confidence worn</p>
          </div>
        </div>
      </div>
      <ContentContainer styles="gap-20 mb-20">
        <ShowCaseContainer
          headerTitle="Latest Drops"
          destination="/products?category=drops"
          type="discover"
          data={latestDrops}
        />
        <ShowCaseContainer
          headerTitle="Weekly Picks"
          destination="/products?category=picks"
          type="discover"
          data={weeklyPicks}
        />
        <ShowCaseContainer
          headerTitle="Sale"
          destination="/products?category=sale"
          type="discover"
          data={sale}
        />

      </ContentContainer>
    </>
  );
}
