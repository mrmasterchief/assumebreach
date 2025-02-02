'use client';
import Image from "next/image";
import React, {use, useEffect} from "react";
import { axiosInstance } from "@/hooks/axios";
import { showMessage } from "@/components/messages/Message";
import ShowCaseContainer from "@/components/container/ShowCaseContainer";

export default function Home() {

  useEffect(() => {
    try {
      const response = axiosInstance.get("/api/v1/csrf-token");

    } catch (error) {
      showMessage("Error", "Something went wrong", "error");
    }
  }, []);


  return (
    <div className="flex flex-col bg-white">
      <div className="relative h-[600px]">
        <Image
          src="https://xsuit.com/cdn/shop/articles/suit_wearing_1200x1200_crop_center.webp?v=1720118555"
          alt="hero"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">Assume Breach</h1>
            <p className="text-white">Confidence worn</p>
          </div>
          </div>
      </div>
      <div className="flex align-center justify-center w-full max-w-[1920px] mx-auto">
      <div className="px-4 bg-white flex flex-col gap-20 border-t border-gray-200 py-8 w-full ">
      <ShowCaseContainer headerTitle="Latest Drops" destination="/products?category=drops" type="discover" />
      <ShowCaseContainer headerTitle="Weekly Picks" destination="/products?category=picks" type="discover" />
      <ShowCaseContainer headerTitle="Sale" destination="/products?category=sale" type="discover" />
      </div>
      </div>

    </div>
  );
}
