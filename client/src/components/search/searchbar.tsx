"use client";
import React, { useEffect, useState, useRef } from "react";
import ProductCard from "../productcard/ProductCard";
import { getProductsByCategory } from "@/hooks/products";
import { searchProducts } from "@/hooks/products";

const SearchBar = ({
  setShowSearchBar,
}: {
  setShowSearchBar: (show: boolean) => void;
}) => {
  const [search, setSearch] = useState("");
  interface Product {
    title: string;
    price: string;
    imagepath: string;
    id: string;
  }

  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [visible, setVisible] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);

    if (e.target.value.length > 0) {
      setTimeout(() => {
        searchProducts(search).then((response) => {
          setSearchResults(response.slice(0, 6));
        });
      }, 2000);
    }
  };

  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [visible]);

  useEffect(() => {
    getProductsByCategory("Latest Drops").then((response) => {
      setSearchResults(response);
    });
  }, []);

  return (
    <div
      className={`fixed inset-0 bg-[rgba(255,255,255,0.9)] transition-opacity duration-500 !ml-0 ease-in-out backdrop-filter backdrop-blur-lg  ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => e.preventDefault()}
    >
      <div className="w-full h-full flex top-[100px] justify-center absolute">
        <div
          ref={searchBarRef}
          className="flex absolute flex-col h-fit w-full xs:w-[90%] sm:w-[80%] md:w-[70%] lg:w-[55%] xl:w-[55%] 2xl:w-[50%] bg-ui-bg rounded-lg p-4"
        >
          <div className="w-full flex items-center gap-x-2 rounded-lg p-4 bg-[#7e8085] backdrop-blur-2xl rounded-rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
            >
              <path
                stroke="#f4f5f5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="m16 16-3.464-3.464m0 0a5 5 0 1 0-7.072-7.072 5 5 0 0 0 7.072 7.072v0Z"
              ></path>
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              className="txt-compact-large h-6 placeholder:transition-colors focus:outline-none flex-1 bg-transparent focus:placeholder-opacity-50 placeholder-[#f4f5f5]"
              value={search}
              style={{ color: "#f4f5f5" }}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={(e) => {
                if (e.relatedTarget?.classList.contains("product-card")) return;
                setTimeout(() => setShowSearchBar(false), 100);
              }}
              autoFocus
            />
          </div>

          <div className="flex flex-col lg:flex-row lg:flex-wrap gap-3 mt-4 justify-between overflow-y-scroll">
            {searchResults.map((item, idx) => (
              <div
                onClick={(e) => e.preventDefault()}
                key={idx}
                className="w-full"
              >
                <ProductCard
                  key={idx}
                  cardType="search"
                  cardInfo={{
                    title: item.title,
                    price: item.price,
                    imagepath: item.imagepath,
                    productID: item.id,
                  }}
                  setShowSearchBar={setShowSearchBar}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
