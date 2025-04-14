"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getUserInfo } from "@/hooks/user";
import { indexFunction } from "@/hooks";
import { logout } from "@/hooks/user";
import { fetchOrders } from "@/hooks/cart";


const OverviewComponent = ({
  userDetails,
  orders,
}: {
  userDetails: any;
  orders: any;
}) => (
  <div className="flex flex-col w-full gap-4 mb-10 w-[1080px]">
    <div className="flex flex-row items-center justify-between w-full border-b border-gray-200">
      <h1 className="text-2xl font-semibold pb-2">
        Hi {userDetails.full_name}</h1>
      <h1 className="text-sm text-gray-500">
        Signed in as: <strong className="text-black">{userDetails.email}</strong>
      </h1>
    </div>
    <p className="text-gray-500">
      Welcome back to your account. Here you can manage your orders, personal
      information, and more.
    </p>
    <div className="flex flex-row items-center justify-between w-full">
    <div className="flex flex-col gap-4 mt-4">
      <h1 className="text-xl font-semibold">Your Orders</h1>
      <div className="flex flex-row items-center gap-2">
      <h1 className="text-3xl font-semibold">{orders.length}</h1>
      <h1 className="text-md text-gray-600">
        ORDERS
      </h1>
      </div>
      </div>
      <div className="flex flex-col gap-4 mt-4">
      <h1 className="text-xl font-semibold">Addresses</h1>
      <div className="flex flex-row items-center gap-2">
      <h1 className="text-3xl font-semibold">{orders.length}</h1>
      <h1 className="text-md text-gray-600">
        SAVED
      </h1>
      </div>
      </div>
      </div>
    <div className="flex flex-col gap-4 mt-4">
      <h1 className="text-xl font-semibold">Recent Orders</h1>
      {orders.length > 0 ? (
        <div className="flex flex-col gap-2">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="flex flex-row items-center justify-between w-full border-b border-gray-200 py-4"
            >
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">
                  Order ID: {order.id}
                </h3>
                <p className="text-gray-500 text-sm">
                  Placed on: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Link
                href={`/account/orders/${order.id}`}
                className="text-blue-700 hover:underline"
              >
                View Order
              </Link>
              </div>
          ))}
          </div>
        ) : (
          <p className="text-gray-500">
            You have no recent orders.
          </p>
        )}
          
      </div>
  </div>
);

const ProfileTab = ({
  userDetails
}
  : {
    userDetails: any;
  }
) => {
  return (
    <div className="flex flex-col w-full gap-4 mb-10 w-[1080px]">
      <h1 className="text-2xl font-semibold">
        Profile</h1>
      <p className="text-gray-600">
      View and update your profile information, including your name, email, and phone number. You can also update your billing address, or change your password.
      </p>
      <div className="flex flex-col gap-4 mt-4">
        {Object.keys(userDetails).filter((key) => key !== "role").map((key) => (
          <div key={key} className="flex flex-row items-center justify-between w-full border-b border-gray-200 py-2">
            <div className="flex flex-col">
            <h1 className="text-md">{key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </h1>
            <p className="font-bold text-sm">{userDetails[key] || "N/A"}</p>
            </div>
            <Link
              href="#"
              className="text-blue-700 hover:underline"
            >
              Edit
            </Link>
          </div>
        ))}
        <div className="flex flex-row items-center justify-between w-full border-b border-gray-200 py-2">
            <div className="flex flex-col">
            <h1 className="text-md">Password
            </h1>
            <p className="font-bold text-sm">Password is not shown for security reasons.</p>
            </div>
            <Link
              href="#"
              className="text-blue-700 hover:underline"
            >
              Edit
            </Link>
          </div>

      </div>
    </div>
  );
}


export default function Account() {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [orders, setOrders] = useState<any>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    try {
      indexFunction(
        [
          () => getUserInfo({ unsafeID: localStorage.getItem("unsafeID") || "" }),
          () => fetchOrders(),
        ]
        ,
        (results) => {
          console.log("results", results);
          if (!results[0] || !results[1]) {
            window.location.href = "/account/authenticate";
          }
          const userDetails = {
            ...results[0].user,
            email: results[0].email,
          };
          setUserDetails(userDetails);
          setOrders(results[1].orders);
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
    <div className="flex flex-col max-w-[1080px] mx-auto mt-10 gap-4">
      <div className="flex flex-row justify-between w-full border-b border-gray-200 pb-5">
        <div className="flex flex-row gap-4 bg-white">
          <div className="flex flex-col gap-2 items-center">
            <Link
              href="#"
              className={`flex flex-row w-full items-center gap-2 p-4 rounded-lg ${activeTab === "overview" ? "bg-gray-200" : ""
                }`}
              onClick={() => setActiveTab("overview")}
            >
              <Icon icon="material-symbols:dashboard" />
              <span className="text-gray-700">Overview</span>
            </Link>
            <Link
              href="#"
              className={`flex flex-row w-full items-center gap-2 p-4 rounded-lg 
              ${activeTab === "orders" ? "bg-gray-200" : ""
                }`}
              onClick={() => setActiveTab("orders")}
            >
              <Icon icon="material-symbols:shopping-bag" />
              <span className="text-gray-700">Orders</span>
            </Link>
            <Link
              href="#"
              className={`flex flex-row w-full items-center gap-2 p-4 rounded-lg ${activeTab === "profile" ? "bg-gray-200" : ""
                }`}
              onClick={() => setActiveTab("profile")}
            >
              <Icon icon="material-symbols:person" />
              <span className="text-gray-700">Profile</span>
            </Link>
            <Link
              href="#"
              className={`flex flex-row w-full items-center gap-2 p-4 rounded-lg bg-black`}
              onClick={async () => [await logout(), window.location.href = "/account/authenticate"]}
            >
              <Icon icon="material-symbols:logout" color="white" />
              <span className="text-white">Logout</span>
            </Link>


          </div>
        </div>
        <div className="flex w-[60%] md:w-[60%] mx-auto">
        {activeTab === "overview" && (
            <OverviewComponent userDetails={userDetails} orders={orders} />
        )}
        {activeTab === "profile" && (
            <ProfileTab userDetails={userDetails} />
        )}
        </div>
      </div>
      <h1 className="text-2xl mt-4 font-semibold">Got questions?</h1>
      <div className="flex flex-row gap-2 pb-10">
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
  );
}
