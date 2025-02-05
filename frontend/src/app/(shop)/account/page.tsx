"use client";
import React, { useEffect } from "react";
import { axiosInstance } from "@/hooks/axios";
import { showMessage } from "@/components/messages/Message";
import { useCSRFToken } from "@/context/useCSRFToken";
import { useRouter } from "next/navigation";

export default function Account() {
  const { isCsrfTokenSet } = useCSRFToken();
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      if (!isCsrfTokenSet) return;
      axiosInstance.post("/auth/refresh-token").then((response) => {
        if (response.status !== 200) {
          window.location.href = "/account";
        }
      });
    };
    checkAuth();
  }, [router, isCsrfTokenSet]);

  return <div className="flex flex-col bg-white"></div>;
}
