"use client";
import React, { useEffect, useState } from "react";
import { showMessage } from "@/components/messages/Message";
import FormTemplate from "@/components/form/Form";
import { useRouter } from "next/navigation";
import { fetchRefreshToken } from "@/hooks/user";
import { indexFunction } from "@/hooks";
import { authenticate } from "@/hooks/user";

export default function Authenticate() {

  const [formType] = useState<"login" | "register" | "forgotPassword">("login");
  const router = useRouter();


  useEffect(() => {
    const checkAuth = async () => {
      try {
        fetchRefreshToken();
      } catch (error) {
        console.error(error);
        window.location.href = "/cms/authenticate";
      }
    };
    checkAuth();
  }, [router]);

  const handleFormSubmit = async (values: {
    login: {
      email: string;
      password: string;
    };
  }, formikHelpers: {
    setSubmitting: (isSubmitting: boolean) => void;
  }) => {
    try {
      let endpoint = "";
      let data = {};

      if (formType === "login") {
        endpoint = "/auth/login";
        data = {
          email: values.login.email,
          password: values.login.password,
          admin: true,
        };
      }
      await indexFunction(
        [
          () => authenticate(endpoint, data)
        ],
        ([authResult]) => {
          if (!authResult) {
            showMessage("Error", "Error during authentication", "error");
            return;
          }
          if (authResult.data.flag) {
            showMessage("Success", "OSINT Flag found: " + authResult.data.flag, "success");
          }
          setTimeout(() => {
            window.location.href = "/admin";
          }
            , 3000);
        },
        false
      );

    } catch (error) {
      showMessage("Error", "Something went wrong", "error");
      formikHelpers.setSubmitting(false);
      console.error("Error during authentication:", error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex w-full max-w-[1440px] mx-auto flex-col">
        <div className="flex align-center w-[80%] md:w-[60%] mx-auto flex-col justify-center max-h-[80vh] md:max-h-[70vh] py-8 gap-4 border-b border-gray-200 mt-10">
          <h1 className="font-bold text-black text-xl text-center">
            Admin Login
          </h1>
          <FormTemplate formType={formType} onSubmit={handleFormSubmit} ctfOpen />
        </div>

      </div>
    </div>
  );
}
