"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { showMessage } from "@/components/messages/Message";
import { getCart, removeFromCart, updateCartQuantity } from "@/hooks/cart";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { indexFunction } from "@/hooks";
import { Icon } from "@iconify/react/dist/iconify.js";



export default function CustomerService() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);



 
  return (
    <div className="flex flex-col w-[95%] xl:mx-auto">
      <div className="relative w-full align-center justify-center">
        <div className="content-container flex flex-col lg:flex-row lg:items-start py-6 relative xs:max-w-[95%] sm:max-w-[100%] mx-auto lg:space-between">
          <div className="flex flex-col items-center justify-between p-4 w-full md:flex-row">
              <div className="flex justify-center min-h-[50vh] flex-col gap-4">
                <h1 className="font-semibold text-4xl">Customer Service</h1>
                <p className="text-base font-small text-gray-500 max-w-[50%]">
                    We are here to help you with any questions or concerns you may have. Please feel free to reach out to us through the contact form or by email.
                </p>
                <Link href="/customer-service/contact-us" passHref className="flex flex-row gap-2">
                  <p className="text-blue-700 hover:underline">Contact Us</p>
                  <Icon
                    icon="material-symbols:arrow-outward-rounded"
                    className="text-blue-700 transition-all transform hover:rotate-45"
                  />
                </Link>
                <Link href="/customer-service/reviews" passHref className="flex flex-row gap-2">
                  <p className="text-blue-700 hover:underline">Review Us</p>
                    <Icon
                        icon="material-symbols:arrow-outward-rounded"
                        className="text-blue-700 transition-all transform hover:rotate-45"  
                    />
                </Link>
                <Link href="/customer-service/shippinh" passHref className="flex flex-row gap-2">
                  <p className="text-blue-700 hover:underline">Shipping</p>
                    <Icon
                        icon="material-symbols:arrow-outward-rounded"
                        className="text-blue-700 transition-all transform hover:rotate-45"  
                    />
                </Link>                    
                </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
