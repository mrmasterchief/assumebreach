"use client";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/hooks/axios";
import { showMessage } from "@/components/messages/Message";
import FormTemplate from "@/components/form/Form";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import { useCSRFToken } from "@/context/useCSRFToken";
import ContentContainer from "@/components/content-container";

export default function Authenticate() {
  const [formType, setFormType] = useState<
    "login" | "register" | "forgotPassword"
  >("login");
  const router = useRouter();
  const { csrfToken, isCsrfTokenSet } = useCSRFToken();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isCsrfTokenSet) return;
      axiosInstance.post("/auth/refresh-token").then((response) => {
        if (response.status === 200) {
          window.location.href = "/account";
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
        };
      } else if (formType === "register") {
        endpoint = "/auth/register";
        data = {
          email: values.register.email,
          password: values.register.password,
          name: values.register.name,
        };
      }

      const response = await axiosInstance.post(endpoint, data);

      if (response.status === 200 || response.status === 201) {
        showMessage("Success", response.data.message, "success");
        formikHelpers.resetForm();
        formikHelpers.setSubmitting(false);
        if (formType === "login") {
          if(response.data.flag) {
            showMessage("You have found a flag", response.data.flag, "success");
            return
          }
          window.location.href = "/account";
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
    <>
      <ContentContainer>
        <h1 className="font-bold text-black text-xl text-center">
          {formType === "login" ? "WELCOME BACK" : "BECOME A MEMBER"}
        </h1>
        <p className="text-center text-gray-500">
          {formType === "login"
            ? "Sign in to your account to access your orders."
            : "Sign up to access exclusive deals and offers."}
        </p>
        <FormTemplate formType={formType} onSubmit={handleFormSubmit} />
        <div className="flex justify-center flex-col gap-2">
          <button
            className="text-gray-500 hover:text-black"
            onClick={() =>
              setFormType(formType === "login" ? "register" : "login")
            }
          >
            {formType === "login"
              ? "Don't have an account? Register"
              : "Already have an account? Sign in"}
          </button>
          {formType === "register" && (
            <p className="text-center">
              By signing up, you agree to our Terms, Data Policy and Cookies
              Policy.
            </p>
          )}
        </div>
      </ContentContainer>

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
