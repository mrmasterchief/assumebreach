"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import ContentContainer from "@/components/content-container";
import { indexFunction } from "@/hooks";
import { fetchOrderDetails } from "@/hooks/cart";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function OrderDetails() {
    const params = useParams();
    const orderID = Array.isArray(params?.orderID)
        ? params.orderID[0]
        : params?.orderID;

    const [orderDetails, setOrderDetails] = useState<OrderDetailsProps["orderDetails"] | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!orderID) return;
            await indexFunction([
                () => fetchOrderDetails(orderID),
            ], (results) => {
                if (!results[0]) return;
                setOrderDetails(results[0].orderDetails);
            }, false);
        };

        fetchDetails();
    }, [orderID]);

    interface OrderDetailsProps {
        orderDetails: {
            id: number;
            cart_id: string;
            total_price: string;
            address: {
                zip: string;
                city: string;
                state: string;
                country: string;
            };
            items: Array<{
                product: {
                    id: string;
                    title: string;
                    description: string;
                    price: string;
                    discountprice: string;
                    imagepath: string;
                    categories: Array<string>;
                    style: string;
                    created_at: string;
                    updated_at: string;
                };
                quantity: number;
            }>;
            payment_method: string;
            status: string;
            created_at: string;
            updated_at: string;
            user_id: string;
            flag?: string;
        };
    }

    return (
        <ContentContainer>
            <div className="w-full flex justify-center px-4 py-16">
                <div className="w-full max-w-[1080px] space-y-10">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-gray-900">Order Summary</h1>
                        <p className="text-lg text-gray-600">Here are the details of your recent purchase. Thank you for shopping with us!</p>
                    </div>

                    {orderDetails && (
                        <div className="space-y-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">Order ID</p>
                                <p className="text-xl font-medium text-gray-800">#{orderDetails.id}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Shipping Address</p>
                                    <div className="text-gray-800">
                                        <p>{orderDetails.address.zip}</p>
                                        <p>{orderDetails.address.city}, {orderDetails.address.state}</p>
                                        <p>{orderDetails.address.country}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                                    <div className="flex flex-row items-center gap-2">
                                    <Icon icon={`logos:${orderDetails.payment_method.toLowerCase()}`} className="text-2xl" />
                                    <p className="text-gray-800">{orderDetails.payment_method}</p>
                                    </div>

                                    <p className="mt-4 text-sm text-gray-500 mb-1">Status</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium 
                                        ${orderDetails.status === "pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-green-100 text-green-800"}`}>
                                        {orderDetails.status}
                                    </span>
                                    {orderDetails.flag && (
                                        <div className="flex flex-col  gap-2 mt-2">
                                            <p className="text-sm text-gray-500">Flag:</p>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(orderDetails?.flag || "")}
                                                className="text-sm self-start flex-row flex items-center gap-2"
                                            >
                                                <Icon icon="ri:clipboard-line"  />
                                                Copy To Clipboard
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Items in Your Order</h2>
                                <div className="space-y-6">
                                    {orderDetails.items.map((item, index) => (
                                        <div key={index} className="flex gap-4">
                                            <Image
                                                src={`http://localhost:4000/public/${item.product.imagepath}`}
                                                alt={item.product.title}
                                                width={100}
                                                height={100}
                                                className="rounded-lg object-cover"
                                            />
                                            <div className="flex flex-col justify-between">
                                                <Link
                                                    href={`/products/${item.product.id}`}
                                                    className="text-lg font-medium text-blue-700 hover:underline"
                                                >
                                                    {item.product.title}
                                                </Link>
                                                <p className="text-gray-600">Quantity: {item.quantity}</p>
                                                <p className="text-gray-600">Price: € {item.product.discountprice || item.product.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end border-t pt-4">
                                <p className="text-lg font-semibold text-gray-900">
                                    Total: <span className="text-blue-700">€{orderDetails.total_price}</span>
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="text-center">
                        <Link
                            href="/"
                            className="inline-block bg-black text-white rounded-lg px-6 py-3 transition duration-200 ease-in-out text-lg font-medium hover:bg-gray-800"
                        >
                            Back to Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </ContentContainer>
    );
}
