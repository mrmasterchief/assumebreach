import React from "react";

import Link from "next/link";

import Image from "next/image";

const ProductCard = ({
  searchResult,
  cardType,
}: {
  searchResult: {
    title: string;
    price: string;
    image: string;
    productID: string;
    discountPrice?: string;
  };
  cardType: "search" | "product";
}) => {
  return (
    cardType === "search" ? (
    <Link
      href={`/products/${searchResult.productID}`} passHref
      className="bg-white rounded-lg flex sm:flex-col gap-2 w-full p-4 items-center sm:justify-center lg:w-[31.8%] rounded-large transition-shadow ease-in-out duration-150 shadow-md hover:shadow-lg"
    >
      <div className="rounded-lg w-20 h-20 sm:w-40 sm:h-40 relative overflow-hidden bg-[#f9fafb] ">
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
    ) : (
      <div className="flex flex-col w-[48%] lg:w-[31.8%] gap-4">
      <div className="rounded-lg relative overflow-hidden p-4 bg-[#f9fafb] rounded-large transition-shadow ease-in-out duration-150 aspect-[11/14] w-full shadow-md hover:shadow-lg ">
        <Image
          src="/blender.webp"
          layout="fill"
          objectFit="cover"
          alt={searchResult.title}
          className="absolute inset-0 object-cover object-center"
        />
      </div>
      <div className="flex flex-row justify-between group">
        <div className="flex flex-row justify-between w-full gap-4">
          <p className="font-normal font-sans txt-medium text-[#4b5563]">
            {searchResult.title}
          </p>
          <div className="flex flex-row gap-2">
          <p className={`font-normal font-sans txt-medium ${searchResult.discountPrice ? 'line-through text-[#4b5563]' : 'text-[#4b5563]'}`}>
            ${searchResult.price}
          </p>
          {searchResult.discountPrice && (
            <p className="font-normal font-sans txt-medium text-[#3b82f6]">
              ${searchResult.discountPrice}
            </p>
          )}
          </div>
        </div>
      </div>
      </div>
    )

  );
};

export default ProductCard;
