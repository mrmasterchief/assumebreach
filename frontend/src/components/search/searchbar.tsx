"use client";
import React, { useEffect, useState, useRef } from "react";

const SearchBar = ({ setShowSearchBar }: { setShowSearchBar: (show: boolean) => void }) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [visible, setVisible] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleClickOutside = (event:any) => {
    if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
      setShowSearchBar(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  return (
    <div
      className={`fixed inset-0 bg-opacity-75 backdrop-blur-md opacity-100 h-screen w-screen !ml-0 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}>
      <div className="w-full h-full flex top-[100px] justify-center absolute">
        <div className="flex absolute flex-col h-fit w-full xs:w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] bg-ui-bg rounded-lg p-4">
          <div className="w-full flex items-center gap-x-2 rounded-lg p-4 bg-[rgba(3,7,18,0.7)] text-ui-fg-on-color backdrop-blur-2xl rounded-rounded" ref={searchBarRef}> {/* Added ref here */}
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
              className="txt-compact-large h-6 placeholder:text-ui-fg-on-color text-ui-fg-on-color placeholder:transition-colors focus:outline-none flex-1 bg-transparent focus:placeholder-opacity-50" // Added text-ui-fg-on-color here
              value={search}
              style={{ color: "#9ca3af" }} 
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;