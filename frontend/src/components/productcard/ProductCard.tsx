import React from "react";

import Link from "next/link";

import Image from "next/image";

const ProductCard = ({
  searchResult,
}: {
  searchResult: {
    title: string;
    price: string;
    image: string;
  };
}) => {
  return (
    <Link
      href="/product/1"
      className="bg-white rounded-lg flex sm:flex-col gap-2 w-full p-4 shadow-elevation-card-rest hover:shadow-elevation-card-hover items-center sm:justify-center lg:w-[31.8%]"
    >
      <div className="rounded-lg w-20 h-20 sm:w-40 sm:h-40 relative overflow-hidden bg-[#f9fafb]">
        <Image
          src="/blender.webp"
          layout="fill"
          objectFit="cover"
          alt={searchResult.title}
        />
      </div>
      <div className="flex flex-col justify-between group">
        <div className="flex flex-col">
          <p className="font-normal font-sans txt-medium text-ui-fg-subtle">
            {searchResult.title}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
