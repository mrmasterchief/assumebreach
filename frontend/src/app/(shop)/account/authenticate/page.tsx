'use client';
import React, {useEffect} from "react";
import { axiosInstance } from "@/hooks/axios";
import { showMessage } from "@/components/messages/Message";

export default function Account() {

  useEffect(() => {
    try {
      const response = axiosInstance.get("/api/v1/csrf-token");

    } catch (error) {
      showMessage("Error", "Something went wrong", "error");
    }
  }, []);


  return (
    <div className="flex flex-col bg-white">
      

    </div>
  );
}
