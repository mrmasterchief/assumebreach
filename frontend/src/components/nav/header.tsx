"use client";

import React from "react";

import Link from "next/link";

import Image from "next/image";
import SearchBar from "../search/SearchBar";

const Header = () => {
  const [showSearchBar, setShowSearchBar] = React.useState(false);

  return (
    <div
      className={
        `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200 bg-white`
      }
    >
      <div className="flex h-[80px] items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center md:hidden"
          >
            <Image src="/logo.png" alt="logo" width="50" height="50" />
            <span className="font-bold text-xl flex ">Assume Breach</span>
          </Link>
        </div>

        <div className="hidden md:block flex items-center space-x-5">
          <button onClick={() => setShowSearchBar(!showSearchBar)}>
            Search
          </button>
          <button>Cart (0)</button>
          {showSearchBar && <SearchBar setShowSearchBar={setShowSearchBar} />}
        </div>
      </div>
    </div>
  );
};

export default Header;
