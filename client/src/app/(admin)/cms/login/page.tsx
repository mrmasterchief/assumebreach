"use client";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/hooks/axios";
import { showMessage } from "@/components/messages/Message";
import FormTemplate from "@/components/form/Form";
import { useRouter } from "next/navigation";
import { useCSRFToken } from "@/context/useCSRFToken";

export default function Authenticate() {
  const [formType, setFormType] = useState<
    "login" | "register" | "forgotPassword"
  >("login");
  const router = useRouter();
  const { csrfToken, isCsrfTokenSet } = useCSRFToken();


  useEffect(() => {
    const checkAuth = async () => {
      if(!isCsrfTokenSet) return
      axiosInstance.post("/auth/refresh-token").then((response) => {
        if (response.status === 200 && response.data.role === "admin") {
          window.location.href = "/cms";
        }
      });
    };
    checkAuth();
  }, [router, isCsrfTokenSet]);

  const handleFormSubmit = async (values: any, formikHelpers: any) => {
      try {
        let endpoint = "";
        let data = {};

        if (formType === "login") {
          endpoint = "/auth/login";
          data = {
            email: values.login.email,
            password: values.login.password,
            cms: true,
          };
        }

        const response = await axiosInstance.post(endpoint, data);

        if (response.status === 200 || response.status === 201) {
          showMessage("Success", response.data.message, "success");
          formikHelpers.resetForm();
          formikHelpers.setSubmitting(false);
          if (formType === "login") {
            window.location.href = "/cms";
          }
        } else {
          showMessage("Error", response.data.message, "error");
          formikHelpers.setSubmitting(false);
        }
      } catch (error) {
        showMessage("Error", "Something went wrong", "error");
        formikHelpers.setSubmitting(false);
      }
    
  };

  return (
    <div className="flex flex-col">
      <div className="flex w-full max-w-[1440px] mx-auto flex-col">
        <div className="flex align-center w-[80%] md:w-[60%] mx-auto flex-col justify-center max-h-[80vh] md:max-h-[70vh] py-8 gap-4 border-b border-gray-200 mt-10">
          <h1 className="font-bold text-black text-xl text-center">
            CMS Login
          </h1>
          <FormTemplate formType={formType} onSubmit={handleFormSubmit} />
        </div>
        
      </div>
    </div>
  );
}
