"use client";
import React, { useEffect, useState } from "react";
import { showMessage } from "@/components/messages/Message";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getUserInfo} from "@/hooks/user";
import { indexFunction } from "@/hooks";

export default function Account() {

  useEffect(() => {
    try {
      indexFunction(
        [
          () => getUserInfo(),
        ]
        ,
        (results) => {
          if(!results[0]) {
            window.location.href = "/account/authenticate";
          }
        },
        true
      );
    } catch (error) {

      window.location.href = "/account/authenticate";
    }
  }, []);



  const router = useRouter();



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
