"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { showMessage } from "@/components/messages/Message";
import { getCart, removeFromCart, updateCartQuantity } from "@/hooks/cart";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { indexFunction } from "@/hooks";
import { Icon } from "@iconify/react/dist/iconify.js";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";

interface CartItem {
    product: {
        id: string;
        imagepath: string;
        title: string;
        price: number;
        calculatedPrice: number;
        discountprice: number;
    };
    quantity: number;
}


const CartItemComponent = ({
    item,
}: {
    item: CartItem;
}) => (

    <div className="flex items-center justify-between w-full border-b border-gray-200 py-4 p-4">
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center w-[60%]">
                <Link className="rounded-lg relative overflow-hidden bg-[#f7f8f9] aspect-[4/3] shadow-md w-[65px] h-[70px] group justify-center items-center flex" href={`/shop/${item.product.id}`}>
                    <Image
                        src={`http://localhost:4000/public/${item.product.imagepath}`}
                        alt={item.product.title}
                        width={100}
                        height={100}
                    />
                </Link>
                <div className="ml-4">
                    <h3 className="text-lg">{item.product.title}</h3>
                    <p className="text-gray-500 text-sm">Variant: test</p>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <h3 className="text-md text-gray-500">
                    {item.quantity} x ${item.product.calculatedPrice}
                </h3>
                <h3 className="text-md text-gray-700">${(item.product.calculatedPrice * item.quantity).toFixed(2)}</h3>
            </div>

        </div>
    </div>
);

const CartSummary = ({ total, cartItems }: { total: number, cartItems: CartItem[] }) => (

    <div className="flex flex-col justify-center pb-4 w-full items-start md:w-1/3">
        <h1 className="text-3xl font-semibold p-4 border-b border-gray-200 mb-4 w-full">
            In your Cart</h1>
        <div className="flex flex-row items-center justify-between w-full px-4">
            <h3 className="text-md text-gray-500">Subtotal</h3>
            <h3 className="text-md text-gray-500">${total}</h3>
        </div>
        <div className="flex flex-col items-center justify-between w-full border-b border-gray-200 px-4 py-2">
            <div className="flex flex-row items-center justify-between w-full mb-2">
                <h3 className="text-md text-gray-500">Shipping</h3>
                <h3 className="text-md text-gray-500">$0</h3>
            </div>
            <div className="flex flex-row items-center justify-between w-full">
                <h3 className="text-md text-gray-500">Taxes</h3>
                <h3 className="text-md text-gray-500">${(total * 0.1).toFixed(2)}</h3>
            </div>
        </div>
        <div className="flex flex-row items-center justify-between w-full border-b border-gray-200 p-4">
            <h3 className="text-md">Total</h3>
            <h3 className="text-lg font-semibold">
                ${(total + total * 0.1).toFixed(2)}
            </h3>
        </div>
        {cartItems.map((item) => (
            <CartItemComponent
                key={item.product.title}
                item={item}

            />
        ))}

    </div>
);

export default function Checkout() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("Shipping Address");

    useEffect(() => {
        try {
            indexFunction(
                [
                    () => getCart(),
                ]
                ,
                (results) => {
                    if (!results[0]) {
                        setIsLoading(false);
                        return;
                    }
                    setCartItems(results[0] || []);
                    for (let i = 0; i < results[0].length; i++) {
                        if (results[0][i].product.discountprice) {
                            results[0][i].product.calculatedPrice = results[0][i].product.discountprice;
                        }
                        else {
                            results[0][i].product.calculatedPrice = results[0][i].product.price;
                        }
                    }
                    let totalPrice = results[0].reduce((sum: number, item: CartItem) => {
                        return sum + Number(item.product.calculatedPrice) * item.quantity;
                    }, 0);
                    setTotal(totalPrice);
                    setIsLoading(false);
                },
                true
            );
        }
        catch (error) {
            console.error(error)

        }
    }, []);



    if (isLoading) {
        return <div>Loading cart...</div>;
    }


    return (
        <div className="flex flex-col w-[95%] xl:mx-auto">
            <div className="relative w-full align-center justify-center">
                <div className="content-container flex flex-col lg:flex-row lg:items-start py-6 relative xs:max-w-[95%] sm:max-w-[100%] mx-auto lg:space-between">
                    <div className="flex flex-col  p-4 w-full md:flex-row">
                        {cartItems.length > 0 ? (
                            <div className="flex flex-col w-full">
                                <h1 className="text-3xl font-semibold mb-4">{activeTab}</h1>
                                <div className="flex flex-row items-center justify-between w-full">
                                    <div className="flex flex-col items-center gap-2">
                                    <Link
                                        href="#"
                                        className={`flex flex-row items-center gap-2 p-4 w-full rounded-lg ${activeTab === "Shipping Address" ? "bg-gray-200" : ""
                                            }`}
                                        onClick={() => setActiveTab("Shipping Address")}
                                    >
                                        <Icon icon="material-symbols:home" />
                                        <span className="text-gray-700">Shipping Address</span>
                                    </Link>
                                    <Link
                                        href="#"
                                        className={`flex flex-row items-center w-full gap-2 p-4 rounded-lg ${activeTab === "Payment" ? "bg-gray-200" : ""
                                            }`}
                                        onClick={() => setActiveTab("Payment")}
                                    >   
                                        <Icon icon="material-symbols:payments" />
                                        <span className="text-gray-700">Payment</span>
                                    </Link>
                                    <Link
                                        href="#"
                                        className={`flex flex-row items-center gap-2 p-4 w-full rounded-lg ${activeTab === "Order Summary" ? "bg-gray-200" : ""
                                            }`}
                                        onClick={() => setActiveTab("Order Summary")}
                                    >
                                        <Icon icon="material-symbols:receipt" />
                                        <span className="text-gray-700">Order Summary</span>
                                    </Link>
                                    <Link
                                        href="#"
                                        className={`flex flex-row items-center w-full gap-2 p-4 rounded-lg bg-black }`}
                                    >
                                        <Icon icon="material-symbols:check-circle" color="white" />
                                        <span className="text-white">Complete Order</span>
                                    </Link>
                                </div>
                                </div>

                            </div>
                        ) : (
                            <div className="flex justify-center min-h-[50vh] flex-col gap-4">
                                <h1 className="font-semibold text-4xl">Cart</h1>
                                <p className="text-base font-small text-gray-500 max-w-[50%]">
                                    Your shopping bag is empty. Start exploring our products by clicking the button below. You need to be logged in to add products to your cart.
                                </p>
                                <Link href="/account/help" passHref className="flex flex-row gap-2">
                                    <p className="text-blue-700 hover:underline">Explore Products</p>
                                    <Icon
                                        icon="material-symbols:arrow-outward-rounded"
                                        className="text-blue-700 transition-all transform hover:rotate-45"
                                    />
                                </Link>
                            </div>
                        )}
                        {cartItems.length > 0 && <CartSummary total={total} cartItems={cartItems}
                        />}{" "}
                    </div>
                </div>
            </div>
        </div>
    );
}
