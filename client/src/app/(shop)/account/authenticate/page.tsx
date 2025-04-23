"use client";
import React, { useEffect, useState } from "react";
import { showMessage } from "@/components/messages/Message";
import FormTemplate from "@/components/form/Form";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import ContentContainer from "@/components/content-container";
import { fetchRefreshToken } from "@/hooks/user";
import { indexFunction } from "@/hooks";
import { authenticate } from "@/hooks/user";
import { useCTF } from "@/context/CtfContext";

export default function Authenticate() {
  const [formType] = useState<
    "login" | "register" | "forgotPassword"
  >("login");
  const router = useRouter();
  const { ctfOpen } = useCTF();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        fetchRefreshToken();
      }
      catch (error) {
        console.error(error);
        window.location.href = "/account/authenticate";
      }
    };
    checkAuth();
  }, [router]);

  const handleFormSubmit = async (values: {
    login: {
      email: string;
      password: string;
    };
    register: {
      email: string;
      password: string;
      name: string;
    };
  }, formikHelpers: {
    setSubmitting: (isSubmitting: boolean) => void;
    resetForm: () => void;
  }
  ) => {
    if (!ctfOpen) {
      showMessage("Error", "CTF is not open. Wait until the administrator activates the website.", "error");
      formikHelpers.setSubmitting(false);
      return;
    }
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

      await indexFunction(
        [
          () => authenticate(endpoint, data),
        ],
        ([authResult]) => {
          if (authResult.status === 200 || authResult.status === 201) {
            formikHelpers.resetForm();
            formikHelpers.setSubmitting(false);
            if (formType === "login") {
              if (authResult.data.flag) {
                showMessage("You have found a flag", authResult.data.flag, "success");
                return
              }
              localStorage.setItem("unsafeID", authResult.data.unsafeID);
              if (ctfOpen) {
                window.location.href = "/account";
              }

            }
            if (formType === "register") {
              window.location.href = "/account";
            }
          }
          else {
            showMessage("Error", authResult.data.message, "error");
            formikHelpers.setSubmitting(false);

          }
        },
        false
      );

    }
    catch (error) {
      showMessage("Error", "Something went wrong", "error");
      formikHelpers.setSubmitting(false);
      console.error("Error during authentication:", error);
    }
  };

  return (
    <>
      <ContentContainer>
        <div className="w-[90%] md:w-[50%] mx-auto flex flex-col justify-center py-8 gap-4">
          <h1 className="font-bold text-black text-xl text-center animate-pulse duration-1000 ease-in-out">
            {formType === "login" ? "WELCOME BACK" : "BECOME A MEMBER"}
          </h1>
          <p className="text-center text-gray-500 mb-4">
            {formType === "login"
              ? "Sign in to your account to access your orders."
              : "Sign up to access exclusive deals and offers."}
          </p>
          <FormTemplate formType={formType} onSubmit={handleFormSubmit} ctfOpen={ctfOpen} />
          <div className="flex justify-center flex-col gap-2 mt-4">
            {formType === "register" && (
              <p className="text-center">
                By signing up, you agree to our Terms, Data Policy and Cookies
                Policy.
              </p>
            )}
          </div>
        </div>
      </ContentContainer>
      {ctfOpen &&
        <div className="flex w-[60%] md:w-[70%] mx-auto flex-col justify-center py-8 gap-4 border-t border-gray-200">
          <h1 className="text-2xl mt-4 font-semibold">Got questions?</h1>
          <div className="flex flex-row gap-2">
            <p className="text-gray-500">
              You can find frequently asked questions and answers on our customer
              service page.
            </p>
            <Link href="/customer-service" passHref className="flex flex-row gap-2">
              <p className="text-blue-700 hover:underline">Customer Service</p>
              <Icon
                icon="material-symbols:arrow-outward-rounded"
                className="text-blue-700 transition-all transform hover:rotate-45"
              />
            </Link>
          </div>
        </div>
      }
    </>
  );
}
