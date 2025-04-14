"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SIDENAV_ITEMS } from "@/constants";
import { NavItem } from "./NavTypes";
import { Icon } from "@iconify/react";
import { motion, useCycle } from "framer-motion";
import SearchBar from "../search/searchbar";
import Cart from "../cart/Cart";
import { getCart } from "@/hooks/cart";
import { useCart } from "@/context/CartContext";
import { indexFunction } from "@/hooks";

type MenuItemWithSubMenuProps = {
  item: NavItem;
  toggleOpen: () => void;
};

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 100% 0)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(0px at 100% 0)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const Header = ({
  toggleSidenav,
  type,
}: {
  toggleSidenav?: (show: boolean) => void;
  type?: string;
}) => {
  const pathname = usePathname();
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);
  const [isOpen, toggleOpen] = useCycle(false, true);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const { isCartOpen, toggleCart } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    if (showSearchBar || isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showSearchBar]);



  useEffect(() => {
    if (pathname === "/account/authenticate") return;
    indexFunction(
      [
        () => getCart(),
      ]
      , (response: any) => {
        setCartItemsCount(response[0].length);
        setCartItems(response[0]);
      }, true
    );
  }, [isCartOpen]);

  return (
    <div
      className={`sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200 bg-white`}
    >
      <div className={`space-between max-w-[1080px] mx-auto`}>
        {type !== "cms" && (
          <motion.nav
            initial={false}
            animate={isOpen ? "open" : "closed"}
            custom={height}
            className={`fixed inset-0 z-50 w-full md:hidden ${isOpen ? "" : "pointer-events-none"
              }`}
            ref={containerRef}
          >
            <motion.div
              className="absolute inset-0 right-0 w-full bg-white"
              variants={sidebar}
            />
            <motion.ul
              variants={variants}
              className="absolute grid w-full gap-3 px-10 py-16 max-h-screen overflow-y-auto"
            >
              {showSearchBar && (
                <SearchBar setShowSearchBar={setShowSearchBar} />
              )}
              <MenuItem>
                <Link
                  onClick={() => {
                    setShowSearchBar(!showSearchBar);
                    toggleOpen();
                  }}
                  href="#"
                  className="flex w-full text-2xl items-center space-x-2 mb-4"
                >
                  <Icon icon="bx:bx-search" width="24" height="24" />
                  Search
                </Link>
              </MenuItem>
              {SIDENAV_ITEMS.map((item, idx) => {
                const isLastItem = idx === SIDENAV_ITEMS.length - 1;

                return (
                  <div key={idx}>
                    {item.submenu ? (
                      <MenuItemWithSubMenu
                        item={item}
                        toggleOpen={toggleOpen}
                      />
                    ) : (
                      <MenuItem>
                        <Link
                          href={item.path}
                          onClick={() => toggleOpen()}
                          className={`flex w-full text-2xl ${item.path === pathname ? "font-bold" : ""
                            }`}
                        >
                          {item.title}
                        </Link>
                      </MenuItem>
                    )}

                    {!isLastItem && (
                      <MenuItem className="my-3 h-px w-full bg-gray-300" />
                    )}
                  </div>
                );
              })}
            </motion.ul>
            <MenuToggle toggle={toggleOpen} />
          </motion.nav>
        )}
        <div className="flex h-[70px] items-center justify-between px-4">
          {type !== "cms" && (
            <button
              onClick={() => toggleSidenav && toggleSidenav(true)}
              aria-label="Toggle Sidenav"
              className="hidden md:block"
            >
              Menu
            </button>
          )}

          <Link
            href="/"
            className="flex items-center space-x-3 absolute left-1/2 transform -translate-x-1/2"
          >
            <span className="text-xl flex text-[#4b5563]">ASSUME BREACH</span>
          </Link>
          {type !== "cms" && (
            <div className="flex items-center space-x-5 justify-end w-full">
              <button
                onClick={() => setShowSearchBar(!showSearchBar)}
                aria-label="search"
                className="hidden md:block"
              >
                Search
              </button>
              <Link
                aria-label="cart"
                onMouseOver={() => {
                  toggleCart();
                }}
                href={"/cart"}
              >
                Cart ({cartItemsCount || 0})
              </Link>
                <Cart
                  isCartOpen={isCartOpen}
                  toggleCart={toggleCart}
                  cartItems={cartItems}
                />
              {showSearchBar && (
                <SearchBar setShowSearchBar={setShowSearchBar} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;

const MenuToggle = ({ toggle }: { toggle: any }) => (
  <button
    onClick={toggle}
    className="pointer-events-auto md:hidden z-50 fixed top-4 left:10 p-4"
    aria-label="Toggle Menu"
  >
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </svg>
  </button>
);

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="2"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

const MenuItem = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <motion.li variants={MenuItemVariants} className={className}>
      {children}
    </motion.li>
  );
};

const MenuItemWithSubMenu: React.FC<MenuItemWithSubMenuProps> = ({
  item,
  toggleOpen,
}) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  return (
    <>
      <MenuItem>
        <button
          className="flex w-full text-2xl"
          aria-label="Toggle Submenu"
          onClick={() => setSubMenuOpen(!subMenuOpen)}
        >
          <div className="flex flex-row justify-between w-full items-center">
            <span
              className={`${pathname.includes(item.path) ? "font-bold" : ""}`}
            >
              {item.title}
            </span>
            <div className={`${subMenuOpen && "rotate-180"}`}>
              <Icon icon="lucide:chevron-down" width="24" height="24" />
            </div>
          </div>
        </button>
      </MenuItem>
      <div className="mt-2 ml-2 flex flex-col space-y-2 transition-all duration-300 ease-in-out">
        {subMenuOpen && (
          <>
            {item.subMenuItems?.map((subItem, subIdx) => {
              return (
                <MenuItem key={subIdx}>
                  <Link
                    href={subItem.path}
                    onClick={() => toggleOpen()}
                    className={` ${subItem.path === pathname ? "font-bold" : ""
                      }`}
                  >
                    {subItem.title}
                  </Link>
                </MenuItem>
              );
            })}
          </>
        )}
      </div>
    </>
  );
};

const MenuItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
      duration: 0.02,
    },
  },
};

const variants = {
  open: {
    transition: { staggerChildren: 0.02, delayChildren: 0.15 },
  },
  closed: {
    transition: { staggerChildren: 0.01, staggerDirection: -1 },
  },
};

const useDimensions = (ref: any) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return dimensions.current;
};
