"use client";

import React from "react";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import Image from "next/image";
import SearchBar from "../search/searchbar";

const Header = () => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();
  const [showSearchBar, setShowSearchBar] = React.useState(false);

  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200`,
        {
          "border-b border-gray-200 bg-white/75 backdrop-blur-lg": scrolled,
          "border-b border-gray-200 bg-white": selectedLayout,
        }
      )}
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
          <button>Account</button>
          {showSearchBar && (
            <div
              className={`fixed inset-0 bg-opacity-75 backdrop-blur-md opacity-100 h-screen w-screen !ml-0 transition-opacity duration-200 ${
                showSearchBar ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className="absolute inset-0 bg-white opacity-0"
                onClick={() => setShowSearchBar(false)}
              ></div>
              <SearchBar  setShowSearchBar={setShowSearchBar}/>
              


            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
