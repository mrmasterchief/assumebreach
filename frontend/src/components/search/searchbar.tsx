"use client";
import React, { useEffect, useState, useRef } from "react";
import ProductCard from "../productcard/ProductCard";

const SearchBar = ({
  setShowSearchBar,
}: {
  setShowSearchBar: (show: boolean) => void;
}) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [visible, setVisible] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchBarRef.current &&
      !searchBarRef.current.contains(event.target as Node) &&
      event.target &&
      !(event.target as HTMLElement).closest(".SearchCard")
    ) {
      setVisible(false);
      setTimeout(() => {
        setShowSearchBar(false);
      }, 100);
    }
  };
  useEffect(() => {
    setVisible(true);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 backdrop-blur-md transition-opacity duration-500 ease-in-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-full h-full flex top-[100px] justify-center absolute">
        <div
          ref={searchBarRef}
          className="flex absolute flex-col h-fit w-full xs:w-[90%] sm:w-[80%] md:w-[70%] lg:w-[55%] xl:w-[55%] 2xl:w-[50%] bg-ui-bg rounded-lg p-4"
        >
          <div className="w-full flex items-center gap-x-2 rounded-lg p-4 bg-[rgba(3,7,18,0.7)] text-ui-fg-on-color backdrop-blur-2xl rounded-rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
            >
              <path
                stroke="#9ca3af"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="m16 16-3.464-3.464m0 0a5 5 0 1 0-7.072-7.072 5 5 0 0 0 7.072 7.072v0Z"
              ></path>
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="txt-compact-large h-6 placeholder:text-ui-fg-on-color text-ui-fg-on-color placeholder:transition-colors focus:outline-none flex-1 bg-transparent focus:placeholder-opacity-50"
              value={search}
              style={{ color: "#9ca3af" }}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col lg:flex-row lg:flex-wrap gap-3 mt-4 justify-between overflow-y-scroll">
          <ProductCard cardType="search" searchResult={{ title: "test", price: "test", image: "test", productID: "1" }} />
          <ProductCard cardType="search" searchResult={{ title: "test", price: "test", image: "test", productID: "1" }} />
          <ProductCard cardType="search" searchResult={{ title: "test", price: "test", image: "test", productID: "1" }} />
          <ProductCard cardType="search" searchResult={{ title: "test", price: "test", image: "test", productID: "1" }} />
          <ProductCard cardType="search" searchResult={{ title: "test", price: "test", image: "test", productID: "1" }} />
          <ProductCard cardType="search" searchResult={{ title: "test", price: "test", image: "test", productID: "1" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
