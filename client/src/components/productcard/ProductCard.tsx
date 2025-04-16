import React from "react";

import Link from "next/link";

import Image from "next/image";

const ProductCard = ({
  cardInfo,
  cardType,
  setShowSearchBar,
}: {
  cardInfo: {
    title: string;
    price: string;
    imagepath: string;
    productID: string;
    discountprice?: string;
  };
  cardType: "search" | "discover" | "related";
  setShowSearchBar?: (show: boolean) => void;
}) => {
  return cardType === "search" ? (
    <Link
      href={`/products/${cardInfo.productID}`}
      passHref
      onClick={() => setShowSearchBar && setShowSearchBar(false)}
      className="bg-white rounded-lg flex sm:flex-col gap-2 w-full p-3 items-center sm:justify-center lg:w-[31.8%] rounded-large transition-shadow ease-in-out duration-150 hover:shadow-lg border border-gray-200 shadow-lg hover:shadow-xl"
    >
      <div
        className="rounded-lg 
       relative overflow-hidden bg-[#f9fafb] border border-gray-200 rounded-large group  sm:h-full sm:w-full aspect-[1/1] shadow-md  group justify-center items-center flex"
      >
        <Image
          src={`http://localhost:4000/public/${cardInfo.imagepath}`}
          fill
          style={{objectFit: "cover", objectPosition: "center"}}
          sizes="( max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw"
          alt={cardInfo.title}
        />
      </div>
      <div className="flex flex-col justify-between group">
        <div className="flex flex-col">
          <p className="font-normal font-sans txt-medium text-[#4b5563]">
            {cardInfo.title}
          </p>
        </div>
      </div>
    </Link>
  ) : (
    <Link className={`flex flex-col w-[46%] lg:w-[31.8%] gap-4
      ${cardType === "discover" ? "lg:w-[31.8%]" : "lg:w-[20%]"}
    `} href={`/products/${cardInfo.productID}`} passHref>
      <div className={`rounded-lg relative overflow-hidden p-4 bg-[#f9fafb] rounded-large transition-shadow ease-in-out duration-150 w-full shadow-md hover:shadow-lg ${
        cardType === "discover" ? "aspect-[11/14]" : "aspect-[4/7]"
      }`}>
        <Image
          src={`http://localhost:4000/public/${cardInfo.imagepath}`}
          fill
          sizes="( max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw"
          style={{ objectPosition: "center", objectFit: "cover" }}
          alt={cardInfo.title}
          className="absolute inset-0 object-cover object-center"
        />
      </div>
      <div className="flex flex-row justify-between group">
        <div className="flex flex-row justify-between w-full gap-4">
          <p className="font-normal font-sans txt-medium text-[#4b5563]">
            {/* if screen is small truncate to 10 characters */}
            {cardInfo.title.length > 12 && screen.width < 640
              ? `${cardInfo.title.substring(0, 10)}...`
              : cardInfo.title}
          </p>
          <div className="flex flex-col sm:flex-row sm:gap-2">
          <p className={`font-normal font-sans txt-medium ${cardInfo.discountprice ? 'line-through text-[#4b5563]' : 'text-[#4b5563]'}`}>
            ${cardInfo.price}
          </p>
          {cardInfo.discountprice && (
            <p className="font-normal font-sans txt-medium text-[#094EBE]">
              ${cardInfo.discountprice}
            </p>
          )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
