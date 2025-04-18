"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCMS } from "@/context/CMSContext";
import List from "@/components/cms/List";
import { getAllProducts, searchProducts } from "@/hooks/products";
import { indexFunction } from "@/hooks";
import { onSnapshot, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useCTF } from "@/context/CtfContext";
import Switch from '@mui/material/Switch';
import { showMessage } from "@/components/messages/Message";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { createCTFUsers, CTFCleanUp } from "@/hooks/ctf";

export default function CMSHomePage() {
  const { activePage, toggleActivePage } = useCMS();
  const [listPage, setListPage] = useState(1);
  const [data, setData] = useState({ products: [], totalProducts: 0 });
  const [search, setSearch] = useState("");
  const maxPerPage = 5;
  const pages = Math.ceil(data.totalProducts / maxPerPage);
  const { ctfOpen, setCTFOpen } = useCTF();
  const [userInputValue, setUserInputValue] = useState(0);

  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        indexFunction(
          [
            () => getAllProducts(listPage)
          ],
          (results: any[]) => {
            if (!results[0]) {
              window.location.href = "/cms/login";
              return;
            }
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
        window.location.href = "/cms/login";
      }
    };
    checkAuth();
  }, [router, activePage, listPage]);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'gameStatus'), (docSnapshot) => {
      const data = docSnapshot.data();
      if (data && data.CTFOpen) {
        setCTFOpen(true);
      } else {
        setCTFOpen(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleToggleCTF = async () => {
    try {
      const docRef = doc(db, 'settings', 'gameStatus');
      const docSnapshot = await getDoc(docRef);
      const data = docSnapshot.data();
      if (data && data.CTFOpen) {
        await setDoc(docRef, { CTFOpen: false });
        setCTFOpen(false);
      } else {
        await setDoc(docRef, { CTFOpen: true });
        setCTFOpen(true);
      }
    } catch (error) {
      console.error("Error toggling CTF:", error);
    }
  };

  const handleCreateCTFUsers = async () => {
    if (userInputValue < 1 || userInputValue > 100) {
      showMessage("Error", "Please enter a number between 1 and 100.", "error");
      return;
    }

    try {
      const response = await createCTFUsers(userInputValue);

      const blob = new Blob([response.data], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `ctf_users_${Date.now()}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showMessage("Success", "CTF users created and file downloaded.", "success");
    } catch (error) {
      showMessage("Error", "Failed to create CTF users.", "error");
    }
  };


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
            className={`flex flex-row items-center gap-2 px-4 py-3 w-full rounded-lg ${activePage === "Settings" ? "bg-gray-100 text-blue-600" : ""
              }`}
            onClick={() => { toggleActivePage("Settings"); setListPage(1); }}>
            <Icon icon="material-symbols:settings" width="20" height="20" />
            <p className="text-lg">Settings</p>
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
                data: data.products,
                listPage: listPage,
                setListPage: setListPage,
                pages: pages,
                maxPerPage: maxPerPage,
                setSearch: setSearch,
                search: search,
              }}
            />
          )}
          {activePage == "Settings" && (
            <div className="flex flex-col gap-6 p-6 bg-white shadow-md rounded-xl w-full max-w-2xl mx-auto mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">CTF Mode</p>
                  <p className="text-sm text-gray-500">
                    Toggle the CTF mode to enable or disable the Capture The Flag game.
                  </p>
                </div>
                <Switch checked={ctfOpen} onChange={handleToggleCTF} color="primary" />
              </div>

              <div>
                <p className="text-lg font-semibold">Create CTF Users</p>
                <p className="text-sm text-gray-500">
                  Enter the number of users to create. A text file with credentials will be downloaded.
                </p>
                <div className="flex items-center mt-3 gap-3">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Number of users"
                    className="border border-gray-300 rounded-lg p-2 w-32 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={(e) => setUserInputValue(Number(e.target.value))}
                    value={userInputValue}
                  />
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
                    onClick={handleCreateCTFUsers}
                  >
                    Create Users
                  </button>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-lg font-semibold mb-2">Reset CTF</p>
                <p className="text-sm text-gray-500 mb-4">
                  This will clean up all CTF-related data so it can be started fresh.
                </p>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
                  onClick={CTFCleanUp}
                >
                  Clean Up CTF
                </button>
              </div>
            </div>

          )}
        </div>
      </div>
    </>
  );
}
