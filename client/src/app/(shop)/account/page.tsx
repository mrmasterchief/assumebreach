"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getUserInfo } from "@/hooks/user";
import { indexFunction } from "@/hooks";
import { logout } from "@/hooks/user";
import { fetchOrders } from "@/hooks/cart";
import EditTemplate from "@/components/form/Edit";
import { axiosInstance } from "@/hooks/axios";


const OverviewComponent = ({
  userDetails,
  orders,
}: {
  userDetails: any;
  orders: any;
}) => (
  <div className="flex flex-col gap-4 mb-10 w-[1080px]">
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
          <h1 className="text-3xl font-semibold">1</h1>
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
                  Placed on: {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p className="text-gray-500 text-sm">
                  Paid with: {order.payment_method}
                </p>
                <Icon
                  icon={`logos:${order.payment_method.toLowerCase()}`}
                  className="text-2xl text-gray-500"
                />
              </div>
              <Link
                href={`/orders/${order.id}`}
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
  userDetails,
  selectedEdit,
  setSelectedEdit,
  showEdit,
  setShowEdit,
  handleFormSubmit,
}
  : {
    userDetails: any;
    selectedEdit: any;
    setSelectedEdit: any;
    showEdit: any;
    setShowEdit: any;
    handleFormSubmit: (values: any, formikHelpers: any) => Promise<void>;
  }
) => {
  return (

    <div className="flex flex-col gap-4 mb-10 w-[1080px]">
      <h1 className="text-2xl font-semibold">
        Profile</h1>
      <p className="text-gray-600">
        View and update your profile information, including your name, email, and phone number. You can also update your billing address, or change your password.
      </p>
      <div className="flex flex-col gap-4 mt-4">
        {Object.keys(userDetails).filter((key) => key !== "role").map((key) => (
          <div key={key} className="border-b border-gray-200 py-2">
            <div className="flex flex-row items-center justify-between w-full py-2">
              <div className="flex flex-col">
                <h1 className="text-md">{key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </h1>
                {key === "address" ? (
                  <p className="font-bold text-sm">
                    {userDetails[key].country ? userDetails[key].country : "N/A"}
                  </p>
                ) : (
                  <p className="font-bold text-sm">{userDetails[key] || "N/A"}</p>
                )}
              </div>
              <Link
                href="#"
                className="text-blue-700 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedEdit(key);
                  setShowEdit(!showEdit);
                }}
              >
                {showEdit && selectedEdit === key ? "Cancel" : "Edit"}
              </Link>
            </div>
            {selectedEdit === key && (
              <EditTemplate
                formType={key as "address" | "phone" | "birthdate" | "email" | "full_name" | "password"}
                onSubmit={async (values: any) => {
                  setShowEdit(false);
                  handleFormSubmit(values, {
                    setSubmitting: () => { },
                    resetForm: () => { },
                    setErrors: () => { },
                  });
                }
                }
                formVisible={showEdit}
              />
            )}

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
            onClick={(e) => {
              e.preventDefault();
              setSelectedEdit("password");
              setShowEdit(!showEdit);
            }}
          >
            {showEdit && selectedEdit === "password" ? "Cancel" : "Edit"}
          </Link>
        </div>
        {selectedEdit === "password" && (
          <EditTemplate
            formType="password"
            onSubmit={async (values: any) => {
              setShowEdit(false);
              handleFormSubmit(values, {
                setSubmitting: () => { },
                resetForm: () => { },
                setErrors: () => { },
              });
            }
            }
            formVisible={showEdit}
          />
        )}

      </div>
    </div>
  );
}

const OrdersTab = ({
  orders,
  setOrders,
}: {
  orders: any;
  setOrders: any;
}) => {
  return (
    <div className="flex flex-col gap-4 mb-10 w-[1080px]">
      <h1 className="text-2xl font-semibold">
        Orders</h1>
      <p className="text-gray-600">
        View and manage your orders. You can view your order history, track your orders, and request returns or exchanges.
      </p>
      <div className="flex flex-col gap-4 mt-4">
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
                    Placed on: {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-gray-500 text-sm">
                  Paid with: {order.payment_method}
                </p>
                <Icon
                  icon={`logos:${order.payment_method.toLowerCase()}`}
                  className="text-2xl text-gray-500"
                />
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
  )
}


export default function Account() {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [orders, setOrders] = useState<any>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedEdit, setSelectedEdit] = useState<any>(null);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    try {
      indexFunction(
        [
          () => getUserInfo({ unsafeID: localStorage.getItem("unsafeID") || "" }),
          () => fetchOrders(),
        ]
        ,
        (results) => {
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


  const handleFormSubmit = async (values: any, formikHelpers: any) => {
    try {
      const result = await axiosInstance.post("/user/update", {
        ...values,
      });
      if (result.status === 200) {
        formikHelpers.resetForm();
        formikHelpers.setSubmitting(false);
        setShowEdit(false);


        delete values.password;
        Object.keys(values).forEach((key) => {
          if (values[key] === "") {
            delete values[key];
          }
        });
        setUserDetails(
          {
            ...userDetails,
            ...values,
          }
        );

      }
    } catch (error) {
      console.error("Error updating user info:", error);
      formikHelpers.setSubmitting(false);
      formikHelpers.setErrors({ general: "An error occurred. Please try again." });
    }
  };

  const tabs = [
    { id: 0, name: "overview", label: "Overview", icon: "material-symbols:dashboard" },
    { id: 1, name: "orders", label: "Orders", icon: "material-symbols:shopping-bag" },
    { id: 2, name: "profile", label: "Profile", icon: "material-symbols:person" },
    { id: 3, name: "logout", label: "Logout", icon: "material-symbols:logout" },
  ];



  const router = useRouter();



  return (
    userDetails &&
    <div className="flex flex-col max-w-[1080px] mx-auto mt-10 gap-4">
      <div className="flex flex-row justify-between w-full border-b border-gray-200 pb-5">
        <div className="flex flex-row gap-4 bg-white w-[20%]">
          <div className="flex flex-col gap-2 items-center w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  tab.name === "logout" ?
                    [logout(), window.location.href = "/account/authenticate"]
                    : setActiveTab(tab.name)
                }
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition font-medium
                  ${activeTab === tab.name
                    ? "bg-gray-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"}`}
              >
                <Icon icon={tab.icon} className="text-xl" />
                {tab.label}
              </button>
            ))}

          </div>
        </div>
        <div className="flex w-[60%] md:w-[60%] mx-auto">
          {activeTab === "overview" && (
            <OverviewComponent userDetails={userDetails} orders={orders} />
          )}
          {activeTab === "profile" && (
            <ProfileTab userDetails={userDetails} selectedEdit={selectedEdit} setSelectedEdit={setSelectedEdit} showEdit={showEdit} setShowEdit={setShowEdit} handleFormSubmit={handleFormSubmit} />

          )}
          {activeTab === "orders" && (
            <OrdersTab orders={orders} setOrders={setOrders} />
          )}
        </div>
      </div>
      <h1 className="text-2xl mt-4 font-semibold">Got questions?</h1>
      <div className="flex flex-row gap-2 pb-10">
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
  );
}
