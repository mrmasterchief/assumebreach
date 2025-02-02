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

  useEffect(() => {
    if(visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [visible])


  return (
    <div
      className={`fixed inset-0 bg-[rgba(255,255,255,0.9)] transition-opacity duration-500 ease-in-out backdrop-filter backdrop-blur-lg  ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => e.stopPropagation()}
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
              autoFocus
            />
          </div>

          <div className="flex flex-col lg:flex-row lg:flex-wrap gap-3 mt-4 justify-between overflow-y-scroll">
          <ProductCard cardType="search" cardInfo={{ title: "test", price: "test", image: "test", productID: "1" }} setShowSearchBar={setShowSearchBar} />
          <ProductCard cardType="search" cardInfo={{ title: "test", price: "test", image: "test", productID: "1" }} setShowSearchBar={setShowSearchBar} />
          <ProductCard cardType="search" cardInfo={{ title: "test", price: "test", image: "test", productID: "1" }} setShowSearchBar={setShowSearchBar}/>
          <ProductCard cardType="search" cardInfo={{ title: "test", price: "test", image: "test", productID: "1" }} setShowSearchBar={setShowSearchBar}/>
          <ProductCard cardType="search" cardInfo={{ title: "test", price: "test", image: "test", productID: "1" }} setShowSearchBar={setShowSearchBar}/>
          <ProductCard cardType="search" cardInfo={{ title: "test", price: "test", image: "test", productID: "1" }} setShowSearchBar={setShowSearchBar}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
