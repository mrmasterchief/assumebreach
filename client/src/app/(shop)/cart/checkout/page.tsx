/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { showMessage } from "@/components/messages/Message";
import { getCart } from "@/hooks/cart";
import Link from "next/link";
import { indexFunction } from "@/hooks";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getUserInfo, placeOrder } from "@/hooks/user";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

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
    variant: string;
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
                        src={`${process.env.NEXT_PUBLIC_IMAGE_ROUTE!}/public${item.product.imagepath}`}
                        alt={item.product.title}
                        width={100}
                        height={100}
                        unoptimized
                    />
                </Link>
                <div className="ml-4">
                    <h3 className="text-lg">{item.product.title.length > 12 ? item.product.title.slice(0, 12) + "..." : item.product.title}</h3>
                    <p className="text-gray-500 text-sm">Variant: {item.variant}</p>
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
    const [userInfo, setUserInfo] = useState<{
        user: {
            full_name: string;
            email: string;
            address: string;
        };
        token: string;
        unsafeID: string;
    }>();
    const [address, setAddress] = useState<string | null>(null);
    const [radioOption, setRadioOption] = useState<number | null>(0);
    const [paymentMethod, setPaymentMethod] = useState<string | null>("Visa");
    const [userAddress, setUserAddress] = useState<{
        zip: string;
        city: string;
        state: string;
        country: string;
    }>({
        zip: "",
        city: "",
        state: "",
        country: "",
    });
    const [zipCode, setZipCode] = useState<string | null>(null);
    const [city, setCity] = useState<string | null>(null);
    const [state, setState] = useState<string | null>(null);
    const [country, setCountry] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState(0);
    const tabs = [
        {
            id: 0,
            title: "shipping",
            label: "Shipping Address",
            icon: "material-symbols:home",
        },
        {
            id: 1,
            title: "payment",
            label: "Payment",
            icon: "material-symbols:payments",
        },
        {
            id: 2,
            title: "order",
            label: "Order Summary",
            icon: "material-symbols:receipt",
        },
        {
            id: 3,
            title: "complete",
            label: "Complete Order",
            icon: "material-symbols:check-circle",
        },
        {
            id: 4,
            title: "thankyou",
            label: "Thank You",
            icon: "material-symbols:check-circle",
        },
    ];

    const paymentMethods = [
        {
            id: 0,
            title: "Visa",
            icon: "logos:visa",
        },
        {
            id: 1,
            title: "Mastercard",
            icon: "logos:mastercard",
        },
        {
            id: 2,
            title: "Paypal",
            icon: "logos:paypal",
        },
        {
            id: 3,
            title: "Apple Pay",
            icon: "logos:apple",
        },
    ];

    useEffect(() => {
        try {
            indexFunction(
                [
                    () => getCart(),
                    () => getUserInfo({ unsafeID: localStorage.getItem("unsafeID") || "" }),
                ]
                ,
                ([cartResults, userInfoResults]) => {
                    if (!cartResults || !userInfoResults) {
                        setIsLoading(false);
                        showMessage("error", "Error fetching cart items", "error");
                        return;
                    }
                    setCartItems(cartResults || []);
                    setUserInfo(userInfoResults);
                    setUserAddress(JSON.parse(userInfoResults.user.address));


                    for (let i = 0; i < cartResults.length; i++) {
                        if (cartResults[i].product.discountprice) {
                            cartResults[i].product.calculatedPrice = cartResults[i].product.discountprice;
                        }
                        else {
                            cartResults[i].product.calculatedPrice = cartResults[i].product.price;
                        }
                    }
                    const totalPrice = cartResults.reduce((sum: number, item: CartItem) => {
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

    const handleShippingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let addressObject = {
            zip: zipCode,
            city: city,
            state: state,
            country: country,
        };
        if (radioOption == 1 && (!zipCode || !city || !state || !country)) {

            showMessage("Error", "Please fill in all fields", "error");
            return;
        }

        if (userAddress && radioOption == 0 && !zipCode && !city && !state && !country) {
            addressObject = {
                zip: userAddress.zip,
                city: userAddress.city,
                state: userAddress.state,
                country: userAddress.country,
            };
            setAddress(JSON.stringify(addressObject));
            setActiveTab(1);
            return;
        }
        addressObject = {
            zip: zipCode,
            city: city,
            state: state,
            country: country,
        };
        setAddress(JSON.stringify(addressObject));
        setActiveTab(1);
    }

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentMethod) {
            showMessage("Error", "Please select a payment method", "error");
            return;
        }
        setActiveTab(2);
    }

    const handleOrderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!address || !paymentMethod) {
            showMessage("Error", "Please fill in all fields", "error");
            return;
        }
        const orderObject = {
            address: address,
            paymentMethod: paymentMethod,
            cartItems: cartItems,
            totalPrice: total,
        };
        try {
            await indexFunction(
                [
                    () => placeOrder(orderObject),
                ],
                ([orderResults]) => {
                    if (!orderResults) {
                        showMessage("Error", "Error placing order", "error");
                        return;
                    }
                    showMessage("Success", "Order placed successfully", "success");
                    setActiveTab(4);
                },
                true
            );
        } catch (error) {
            console.error(error);
            showMessage("Error", "Error placing order", "error");
        }
    }



    if (isLoading) {
        return <div>Loading cart...</div>;
    }


    return (
        <div className="flex flex-col w-[95%] xl:mx-auto w-[1080px]">
            <div className="relative w-full align-center justify-center">
                <div className="content-container flex flex-col lg:flex-row lg:items-start py-6 relative xs:max-w-[95%] sm:max-w-[100%] mx-auto lg:space-between">
                    <div className="flex flex-col p-4 w-full md:flex-row">
                        {cartItems.length > 0 ? (
                            <div className="flex flex-row gap-4 w-full">
                                <div className="flex flex-col w-[30%]">
                                    <h1 className="text-3xl font-semibold mb-4">{tabs[activeTab].label}</h1>
                                    <div className="flex flex-row items-center justify-between w-full">
                                        <div className="flex flex-col items-center gap-2">
                                            {/* make a button for each tab eccept tab id 4 */}

                                            {tabs.map((tab) => (
                                                tab.id === 4 ? null :
                                                    <button
                                                        key={tab.id}
                                                        className={`flex flex-row items-center gap-2 px-4 py-3 w-full rounded-lg ${activeTab === tab.id ? "bg-gray-100 text-blue-600" : ""
                                                            }`}
                                                        onClick={() =>
                                                            tab.id === 3 ? null :
                                                                setActiveTab(tab.id)
                                                        }
                                                    >
                                                        <Icon icon={tab.icon} />
                                                        <p>{tab.label}</p>
                                                    </button>
                                            ))}

                                        </div>
                                    </div>
                                </div>
                                {activeTab === 0 && (
                                    <div className="flex flex-col w-[60%] p-4">
                                        <RadioGroup
                                            aria-labelledby="address-radio-buttons-group"
                                            name="address-radio-buttons-group"
                                            defaultValue={userAddress.zip ? 0 : 1}
                                            className="gap-4"
                                        >
                                            {userInfo && userInfo.user.address && (
                                                <>
                                                    <div className="flex flex-col w-full">
                                                        <h1 className="text-xl mb-4">Saved Address</h1>
                                                    </div>

                                                    <button className="flex flex-row items-center gap-2 px-4 py-3 w-full rounded-lg bg-gray-100 text-blue-600">
                                                        <Radio
                                                            value={0}
                                                            className="text-blue-600"
                                                            onChange={(e) => setRadioOption(Number(e.target.value))}
                                                        />
                                                        <Icon icon="material-symbols:home" />
                                                        <div className="flex flex-col items-start">
                                                            <p className="font-bold text-black">{userInfo.user.full_name}</p>
                                                            <p className="text-black">{userAddress.zip}, {userAddress.city}, {userAddress.state}</p>
                                                            <p className="text-black">{userAddress.country}</p>
                                                        </div>


                                                    </button>
                                                </>
                                            )}

                                            <div className="flex flex-col w-full">
                                                <h1 className="text-xl mb-4">New Shipping Address</h1>
                                                <div className="bg-gray-100 p-4 rounded-lg flex flex-row align-center justify-center">
                                                    <div className="justify-center items-center flex flex-col">
                                                        <Radio
                                                            value={1}
                                                            className="text-blue-600"
                                                            onChange={(e) => setRadioOption(Number(e.target.value))}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col w-full">
                                                        <div className="flex flex-row gap-4">
                                                            <input type="text" placeholder="Zip Code" className="border border-gray-300 rounded-lg p-2 mb-2" onChange={(e) => setZipCode(e.target.value)} />
                                                            <input type="text" placeholder="City" className="border border-gray-300 rounded-lg p-2 mb-2" onChange={(e) => setCity(e.target.value)} />
                                                        </div>
                                                        <div className="flex flex-row gap-4">
                                                            <input type="text" placeholder="State" className="border border-gray-300 rounded-lg p-2 mb-2" onChange={(e) => setState(e.target.value)} />
                                                            <input type="text" placeholder="Country" className="border border-gray-300 rounded-lg p-2 mb-2" onChange={(e) => setCountry(e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="bg-black text-white px-4 py-2 rounded-lg mt-4 hover:bg-gray-800 transition duration-300" onClick={handleShippingSubmit}>Choose Address</button>
                                            </div>
                                        </RadioGroup>

                                    </div>
                                )}
                                {activeTab === 1 && (
                                    <div className="flex flex-col w-[60%] p-4">
                                        <h1 className="text-xl mb-4">Fake Payment Method</h1>
                                        <div className="flex flex-col gap-4">
                                            <RadioGroup
                                                aria-labelledby="payment-method-radio-buttons-group"
                                                name="payment-method-radio-buttons-group"
                                                defaultValue="Visa"
                                                className="gap-4"
                                            >
                                                {paymentMethods.map((method) => (
                                                    <button key={method.title} className="flex flex-row items-center gap-2 px-4 py-3 w-full rounded-lg bg-gray-100">
                                                        <Radio
                                                            value={method.title}
                                                            className="text-blue-600"
                                                            onChange={(e) => setPaymentMethod(method.title)}
                                                        />
                                                        <Icon icon={method.icon} />
                                                        <p>{method.title}</p>
                                                    </button>
                                                ))}
                                            </RadioGroup>
                                            <button className="bg-black text-white px-4 py-2 rounded-lg mt-4 hover:bg-gray-800 transition duration-300" onClick={handlePaymentSubmit}>Choose Payment Method</button>

                                        </div>
                                    </div>
                                )}
                                {activeTab === 2 && (
                                    <div className="flex flex-col w-[60%] p-4">
                                        <div className="flex flex-col gap-4">
                                            <h1 className="text-lg font-semibold">Shipping Address</h1>
                                            {radioOption == 0 && userAddress && (
                                                <p>{userAddress.zip}, {userAddress.city}, {userAddress.state}, {userAddress.country}</p>
                                            )}
                                            {radioOption == 1 && (
                                                <p>{zipCode}, {city}, {state}, {country}</p>
                                            )}
                                            <h1 className="text-lg font-semibold">Payment Method</h1>
                                            <div className="flex flex-row items-center gap-2">
                                                <Icon icon={paymentMethods.find((method) => method.title === paymentMethod)?.icon || ""} />
                                                <p>{paymentMethod}</p>
                                            </div>
                                            <button className="bg-black text-white px-4 py-2 rounded-lg mt-4 hover:bg-gray-800 transition duration-300" onClick={handleOrderSubmit}>Place Order</button>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 4 && (
                                    <div className="flex flex-col w-[60%] p-4">
                                        <h1 className="text-3xl font-semibold mb-4">Thank You!</h1>
                                        <p className="text-lg">Your order has been placed successfully.</p>
                                        <Link href="/account" className="bg-black text-white px-4 py-2 rounded-lg mt-4 hover:bg-gray-800 transition duration-300">View Orders</Link>
                                    </div>
                                )}

                            </div>
                        ) : (
                            <div className="flex justify-center min-h-[50vh] flex-col gap-4">
                                <h1 className="font-semibold text-4xl">Cart</h1>
                                <p className="text-base font-small text-gray-500 max-w-[50%]">
                                    Your shopping bag is empty. Start exploring our products by clicking the button below. You need to be logged in to add products to your cart.
                                </p>
                                <Link href="/customer-service" passHref className="flex flex-row gap-2">
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
