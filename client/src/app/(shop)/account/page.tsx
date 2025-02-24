"use client";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/hooks/axios";
import { showMessage } from "@/components/messages/Message";
import { useCSRFToken } from "@/context/useCSRFToken";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getUserInfo } from "@/hooks/user";

export default function Account() {
  const { isCsrfTokenSet } = useCSRFToken();
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      if (!isCsrfTokenSet) return;
      axiosInstance.post("/auth/refresh-token").then((response) => {
        if (response.status !== 200) {
          window.location.href = "/account/authenticate";
        }
      });
    };

    const fetchUserInfo = async () => {
      getUserInfo().then((data) => {
        console.log(data);
      });
    };
    checkAuth();
    fetchUserInfo();
  }, [router, isCsrfTokenSet]);

  return (
    <>
      <div className="flex w-[60%] md:w-[60%] mx-auto flex-col justify-center py-8 gap-4">
        <h1 className="text-2xl mt-4 font-semibold">Got questions?</h1>
        <div className="flex flex-row gap-2">
          <p className="text-gray-500">
            You can find frequently asked questions and answers on our customer
            service page.
          </p>
          <Link href="/account/help" passHref className="flex flex-row gap-2">
            <p className="text-blue-700 hover:underline">Customer Service</p>
            <Icon
              icon="material-symbols:arrow-outward-rounded"
              className="text-blue-700 transition-all transform hover:rotate-45"
            />
          </Link>
        </div>
      </div>
    </>
  );
}
