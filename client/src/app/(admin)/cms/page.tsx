"use client";
import React, { useState, useEffect } from "react";
import { axiosInstance } from "@/hooks/axios";
import { useRouter } from "next/navigation";
import { useCMS } from "@/context/CMSContext";
import List from "@/components/cms/List";
import { getAllProducts, searchProducts } from "@/hooks/products";
import { indexFunction } from "@/hooks";
import { onSnapshot, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config'; 
import { useCTF } from "@/context/CtfContext";
import Switch from '@mui/material/Switch';
import { createCTFUsers, CTFCleanUp } from "@/hooks/user";
import { showMessage } from "@/components/messages/Message";

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
            if(!results[0]) {
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
        console.error(error);
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
      <div className="flex w-full max-w-[1080px] mx-auto flex-col">
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
          <>
          <div className="flex flex-col items-center justify-center w-full h-full p-4">
            <div className="flex flex-row items-center justify-between w-fullm t-4">
              <p className="text-lg font-semibold">CTF Mode</p>
              <Switch
                checked={ctfOpen}
                onChange={handleToggleCTF}
                color="primary"
              />
            </div>
            <p className="text-sm text-gray-500">
              Toggle the CTF mode to enable or disable the Capture The Flag game.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center w-full h-full p-4">
            <p className="text-lg font-semibold">Create Users for the CTF</p>
            <p className="text-sm text-gray-500">
              Create users for the CTF game. This will create a specified number of users.
            </p>
            <div className="flex flex-row items-center justify-center w-full mt-4">
              <input
                type="number"
                min="1"
                max="100"
                placeholder="Number of users"
                className="border border-gray-300 rounded p-2 w-1/4"
                onChange={(e) => setUserInputValue(Number(e.target.value))}
                value={userInputValue}
              />
              <button
                className="bg-blue-500 text-white p-2 rounded ml-4"
                onClick={() => handleCreateCTFUsers()}
              >
                Create Users
              </button>
              </div>
            <div className="flex flex-row items-center justify-center w-full mt-4">
              <button
                className="bg-red-500 text-white p-2 rounded ml-4"
                onClick={() => CTFCleanUp()}
              >
                Clean Up CTF Users
              </button>
              </div>

          </div>
            </>
        )}
      </div>
    </>
  );
}
