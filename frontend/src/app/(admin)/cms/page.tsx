"use client";
import React, { useEffect } from "react";
import { axiosInstance } from "@/hooks/axios";
import { useCSRFToken } from "@/context/useCSRFToken";
import { useRouter } from "next/navigation";

export default function CMSHomePage() {
  const { isCsrfTokenSet } = useCSRFToken();
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

  const checkRoute = () => {
    axiosInstance.get("/cms/all-users").then((response) => {
      console.log(response.data);
    });
  }


  return (
    <div className="flex flex-col bg-white">
      <div className="flex w-full max-w-[1440px] mx-auto flex-col">
        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold">CMS Home</h1>
          <button onClick={checkRoute}>Check Route</button>

        </div>
      </div>
    </div>
  );
}
