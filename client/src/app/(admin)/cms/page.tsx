"use client";
import React, { useState, useEffect } from "react";
import { axiosInstance } from "@/hooks/axios";
import { useRouter } from "next/navigation";
import { useCMS } from "@/context/CMSContext";
import List from "@/components/cms/List";
import { getAllProducts, searchProducts } from "@/hooks/products";
import { indexFunction } from "@/hooks";
export default function CMSHomePage() {
  const { activePage, toggleActivePage } = useCMS();
  const [listPage, setListPage] = useState(1);
  const [data, setData] = useState({ products: [], totalProducts: 0 });
  const [search, setSearch] = useState("");
  const maxPerPage = 5;
  const pages = Math.ceil(data.totalProducts / maxPerPage);

  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        indexFunction(
          [
            () => getAllProducts(listPage)
          ],
          (results: any[]) => {
            const response = results[0] || { products: [], totalProducts: 0 };
            setData({
              products: response.products || [],
              totalProducts: response.totalProducts || 0,
            });
          },
          true
        );
      }
      catch (error) {
        console.error(error);
        window.location.href = "/cms/authenticate";
      }
    };
    checkAuth();
  }, [router, activePage, listPage]);

  return (
    <>
      <div className="flex w-full max-w-[1440px] mx-auto flex-col">
        <h1 className="text-3xl font-semibold">{activePage}</h1>
        <List
          props={{
            type: activePage,
            data: data.products,
            listPage: listPage,
            setListPage: setListPage,
            pages: pages,
            maxPerPage: maxPerPage,
            setSearch: setSearch,
            search: search,
          }}
        />
      </div>
    </>
  );
}
