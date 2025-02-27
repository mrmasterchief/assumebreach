"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/hooks/axios";
import { showMessage } from "@/components/messages/Message";
import ShowCaseContainer from "@/components/container/ShowCaseContainer";
import { getProductsByCategory } from "@/hooks/products";
import ContentContainer from "@/components/content-container";

export default function Home() {
  const [weeklyPicks, setWeeklyPicks] = useState<any[]>([]);
  const [latestDrops, setLatestDrops] = useState<any[]>([]);
  const [sale, setSale] = useState<any[]>([]);

  useEffect(() => {
    getProductsByCategory("Weekly Picks").then((response) => {
      setWeeklyPicks(response.slice(0, 3));
    });
    getProductsByCategory("Latest Drops").then((response) => {
      setLatestDrops(response.slice(0, 3));
    });
    getProductsByCategory("Sale").then((response) => {
      setSale(response.slice(0, 3));
    });
  }, []);

  return (
    <>
      <div className="relative h-[600px]">
        <Image
          src="https://xsuit.com/cdn/shop/articles/suit_wearing_1200x1200_crop_center.webp?v=1720118555"
          alt="hero"
          fill
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
      <ContentContainer styles="gap-20">
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
