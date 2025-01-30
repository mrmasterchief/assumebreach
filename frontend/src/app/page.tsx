'use client';
import Image from "next/image";
import { showMessage } from "@/components/messages/message";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    showMessage("Welcome to Assume Breach", "error");
  }
  , []);
  return (
    <>
      <div className="relative h-[600px] !mt-0">
        <Image
          src="https://d1fufvy4xao6k9.cloudfront.net/images/blog/posts/2022/11/imagetools3.jpg"
          alt="hero"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">Assume Breach</h1>
            <p className="text-white">Confidence worn</p>
          </div>
          </div>
      </div>

    </>
  );
}
