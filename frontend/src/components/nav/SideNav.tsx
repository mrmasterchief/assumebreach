"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SIDENAV_ITEMS } from "@/constants";
import { NavItem } from "./NavTypes";
import { Icon } from "@iconify/react";

const SideNav = ({
  toggleSidenav,
}: {
  toggleSidenav: (show: boolean) => void;
}) => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    setVisible(!visible);

    setTimeout(() => {
      toggleSidenav(false);
    }, 300);
  };

  useEffect(() => {
    setVisible(true);
  }, []);
  return (
    <div
      className={`fixed inset-0 transition-opacity duration-300 ease-in-out z-50 w-[20%] p-2  ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-full h-[99%] flex align-center absolute bg-[#818388] rounded flex-col">
      <div className="flex flex-row justify-end w-[95%] mt-5">
        <button
          onClick={() => toggleVisible()}
          aria-label="Close Sidebar"
          className="p-2 rounded-lg hover:bg-[#525457]"
        >
          <Icon icon="ant-design:close-outlined" width="16" height="16" color="white" />
        </button>
        </div>
        <div className="flex flex-col space-y-6 w-full h-full align-center justify-center">
          <div className="flex flex-col space-y-2  md:px-6 ">
            {SIDENAV_ITEMS.map((item, idx) => {
              return <MenuItem key={idx} item={item} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNav;

const MenuItem = ({ item }: { item: NavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div className="">
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            aria-label="Toggle Submenu"
            className={`flex flex-row items-center p-2 rounded-lg hover-bg-[#525457]
               w-full justify-between hover:bg-[#525457] ${
              pathname.includes(item.path) ? "bg-[#525457]" : ""
            }`}
          >
            <div className="flex flex-row space-x-4 items-center">
              {item.icon}
              <span className="font-semibold text-2xl text-white flex">
                {item.title}
              </span>
            </div>

            <div className={`${subMenuOpen ? "rotate-180" : ""} flex`}>
              <Icon
                icon="lucide:chevron-down"
                width="24"
                height="24"
                color="white"
              />
            </div>
          </button>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              subMenuOpen ? "max-h-screen" : "max-h-0"
            }`}
          >
            <div className="my-2 ml-12 flex flex-col space-y-4">
              {item.subMenuItems?.map((subItem, idx) => {
                return (
                  <Link
                    key={idx}
                    href={subItem.path}
                    className={`${
                      subItem.path === pathname ? "font-bold" : ""
                    }`}
                  >
                    <span className="text-white">{subItem.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      ) : item.bottom ? (
        <div className="absolute bottom-0 w-full p-6 left-0 align-center">
          <Link
            href={item.path}
            className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-[#525457] ${
              item.path === pathname ? "bg-[#525457]" : ""
            }`}
          >
            {item.icon}
            <span className="font-semibold text-2xl flex text-white">
              {item.title}
            </span>
          </Link>
        </div>
      ) : (
        <Link
          href={item.path}
          className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-[#525457] ${
            item.path === pathname ? "bg-[#525457]" : ""
          }`}
        >
          {item.icon}
          <span className="font-semibold text-2xl flex text-white">
            {item.title}
          </span>
        </Link>
      )}
    </div>
  );
};
