"use client";
import React, { useState, useEffect } from "react";
import { axiosInstance } from "@/hooks/axios";
import { useCSRFToken } from "@/context/useCSRFToken";
import { useRouter } from "next/navigation";
import { useCMS } from "@/context/CMSContext";
import List from "@/components/cms/List";
import { getAllProducts, searchProducts } from "@/hooks/products";

export default function CMSHomePage() {
  const { isCsrfTokenSet } = useCSRFToken();
  const { activePage, toggleActivePage } = useCMS();
  const [listPage, setListPage] = useState(1);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const maxPerPage = 10;
  const pages = Math.ceil(data.length / maxPerPage);

  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      if (!isCsrfTokenSet) return;
      axiosInstance.post("/auth/refresh-token").then((response) => {
        if (response.status === 200 && response.data.role !== "admin") {
          window.location.href = "/cms/login";
        }
      });
    };
    checkAuth();
  }, [router, isCsrfTokenSet]);

  useEffect(() => {
    if (activePage === "Products") {
      getAllProducts(listPage).then((response) => {
        setData(response);
      });
    }
  }, [activePage]);

  return (
    <div className="flex flex-col bg-white">
      <div className="flex w-full max-w-[1440px] mx-auto flex-col">
        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold">{activePage}</h1>
          <div className="flex justify-center">
            <List
              props={{
                type: activePage,
                data: data,
                listPage: listPage,
                setListPage: setListPage,
                pages: pages,
                maxPerPage: maxPerPage,
                setSearch: setSearch,
                search: search,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
