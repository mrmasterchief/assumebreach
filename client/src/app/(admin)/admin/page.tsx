"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCMS } from "@/context/CMSContext";
import List from "@/components/cms/List";
import { getAllProducts, searchProducts, getAllProductsDummy } from "@/hooks/products";
import { indexFunction } from "@/hooks";
import { onSnapshot, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useCTF } from "@/context/CtfContext";
import Switch from '@mui/material/Switch';
import { showMessage } from "@/components/messages/Message";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { createCTFUsers, CTFCleanUp } from "@/hooks/ctf";
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

  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        indexFunction(
          [
            () => getAllProductsDummy(listPage),
            () => getAllUsers(listPage)
          ],
          (results: any[]) => {
            if (!results[0] || !results[1]) {
              window.location.href = "/admin/login";
              return;
            }
            const productResponse = results[0] || { products: [], totalProducts: 0};
            setProducts({
              products: productResponse.products || [],
              totalProducts: productResponse.totalProducts || 0,
            });
            const userResponse = results[1] || { users: [], totalUsers: 0};
            setUsers({
              users: userResponse.users || [],
              totalUsers: userResponse.totalUsers || 0,
            });
            if(flag == "") {
                setFlag(results[1].flag);
            }
          },
          true
        );
      }
      catch (error) {
        window.location.href = "/admin/login";
      }
    };
    checkAuth();
  }, [listPage]);

  useEffect(() => {
    if (flag && flag !== "") {
      showMessage("Success", "Directory Enumeration Flag Found: " + flag, "success");
    }
  }, [flag]);



console.log("users", users);



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
