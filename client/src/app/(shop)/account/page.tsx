"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getUserInfo} from "@/hooks/user";
import { indexFunction } from "@/hooks";

export default function Account() {
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    try {
      indexFunction(
        [
          () => getUserInfo({unsafeID: localStorage.getItem("unsafeID") || ""}),
        ]
        ,
        (results) => {
          if(!results[0]) {
            window.location.href = "/account/authenticate";
          }
          setUserDetails(results[0].user);
        },
        true
      );
    } catch (error) {
      window.location.href = "/account/authenticate";
    }
  }, []);



  const router = useRouter();



  return (
    userDetails &&
    <>
      <div className="flex w-[60%] md:w-[60%] mx-auto flex-col justify-center py-8 gap-4">
        <h1 className="text-3xl font-semibold">Hi {userDetails.full_name},  </h1>

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
