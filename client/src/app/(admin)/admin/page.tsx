/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { useCMS } from "@/context/CMSContext";
import List from "@/components/cms/List";
import { getAllProductsDummy } from "@/hooks/products";
import { indexFunction } from "@/hooks";
import { showMessage } from "@/components/messages/Message";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getAllUsers } from "@/hooks/user";

export default function AdminHomePage() {
  const { activePage, toggleActivePage } = useCMS();
  const [listPage, setListPage] = useState(1);
  const [products, setProducts] = useState({ products: [], totalProducts: 0});
  interface User {
    id: string;
    unsafe_id: string;
    email: string;
    password_hash: string;
  }

  const [users, setUsers] = useState<{ users: User[]; totalUsers: number }>({ users: [], totalUsers: 0 });
  const [flag, setFlag] = useState("");
  const [search, setSearch] = useState("");
  const maxPerPage = 5;
  const pages = Math.ceil(products.totalProducts / maxPerPage);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        indexFunction(
          [
            () => getAllProductsDummy(listPage),
            () => getAllUsers(listPage)
          ],
          ([productsResult, userResult]) => {
            if (!productsResult || !userResult) {
              window.location.href = "/admin/login";
              return;
            }
            const productResponse = productsResult || { products: [], totalProducts: 0};
            setProducts({
              products: productResponse.products || [],
              totalProducts: productResponse.totalProducts || 0,
            });
            const userResponse = userResult || { users: [], totalUsers: 0};
            setUsers({
              users: userResponse.users || [],
              totalUsers: userResponse.totalUsers || 0,
            });
            if(flag == "") {
                setFlag(userResult.flag);
            }
          },
          true
        );
      }
      catch (error) {
        window.location.href = "/admin/login";
        console.error("Error fetching products:", error);
      }
    };
    checkAuth();
  }, [listPage]);

  useEffect(() => {
    if (flag && flag !== "") {
      showMessage("Success", "Directory Enumeration Flag Found: " + flag, "success");
    }
  }, [flag]);

  useEffect(() => {
    console.log("Hi Admins, to access the secret panel, find the flag in the header logo. Use my decryption key to decrypt the hidden image using steganography decoder. The password is ze8hYnDWhvBdgDKKQdqmPGymF5wcz4wOpEeXkOBp3u/qpb/r5X9fTW9rIB6OrcZK");
  }, []);



  return (
    <>
      <div className="flex w-[1080px] mx-auto flex-row">
        <div className="flex flex-col w-[25%] p-4 gap-2">
          <Link
            href="#"
            className={`flex flex-row items-center gap-2 px-4 py-3 w-full rounded-lg ${activePage === "Products" ? "bg-gray-100 text-blue-600" : ""
              }`}
            onClick={() => { toggleActivePage("Products"); setListPage(1); }}>
            <Icon icon="material-symbols:store" width="20" height="20" />
            <p className="text-lg">Products</p>
          </Link>
          <Link
            href="#"
            className={`flex flex-row items-center gap-2 px-4 py-3 w-full rounded-lg ${activePage === "Customers" ? "bg-gray-100 text-blue-600" : ""
              }`}
            onClick={() => { toggleActivePage("Customers"); setListPage(1); }}>
            <Icon icon="material-symbols:person" width="20" height="20" />
            <p className="text-lg">Customers</p>
          </Link>
        </div>

        <div className="flex flex-col justify-center w-[70%] p-4">
          <h1 className="text-3xl font-semibold">{activePage}</h1>
          {activePage == "Products" && (
            <List
              props={{
                type: activePage,
                data: products.products,
                listPage: listPage,
                setListPage: setListPage,
                pages: pages,
                maxPerPage: maxPerPage,
                setSearch: setSearch,
                search: search,
                dummyAdmin: true,
              }}
            />
          )}
            {activePage == "Customers" && (
                users.users.map((user, index) => (
                    <div key={index} className="flex flex-row items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex flex-col">
                            <h1 className="text-lg font-semibold">{user.email}</h1>
                            <p className="text-sm text-gray-500">Password Hash: {user.password_hash}</p>
                            <p className="text-sm text-gray-500">ID: {user.id}</p>
                            <p className="text-sm text-gray-500">Unsafe ID: {user.unsafe_id}</p>
                        </div>
                  
                    </div>
                ))
              
              
            )}
          
        </div>
      </div>
    </>
  );
}
