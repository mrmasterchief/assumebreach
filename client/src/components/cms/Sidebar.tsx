import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CMS_SIDENAV_ITEMS } from "@/constants";
import { useCMS } from "@/context/CMSContext";

const SideBar = () => {
  const { activePage, toggleActivePage } = useCMS();
  return (
    <div className="absolute top-0 h-screen w-[10%] xl:w-[80px] flex flex-col">
      <div className="flex flex-col h-[80%] bg-gray-800 text-white my-auto p-4 rounded-r-3xl gap-4">
        {CMS_SIDENAV_ITEMS.map((item, idx) => {
          return (
            <Link
              key={idx}
              href="#"
              onClick={() => toggleActivePage(item.title as any)}
              className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-[#525457] transition-all duration-300 aspect-[1/1] justify-center
                     ${item.title === activePage ? "bg-[#525457]" : ""}`}
              aria-label={item.title}
            >
              <div className="flex flex-row items-center p-2 rounded-lg">
                {item.icon}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SideBar;
