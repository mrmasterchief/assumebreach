"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/hooks/axios";
import { showMessage } from "@/components/messages/Message";
import { addToCart, getCart, removeFromCart } from "@/hooks/cart";
import Link from "next/link";

export default function Cart() {
  interface CartItem {
    product: {
      imagepath: string;
      title: string;
      price: number;
    };
    quantity: number;
  }

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getCart().then((data) => {
      setCartItems(data);
      // Calculate total
      let total = 0;
      data.forEach((item: CartItem) => {
        total += item.product.price * item.quantity;
      });
      setTotal(total);
    });
  }, []);

  return (
    <div className="flex flex-col xl:w-[1440px] xl:mx-auto">
      <div className="relative w-full align-center justify-center">
        <div className="content-container flex flex-col lg:flex-row lg:items-start py-6 relative xs:max-w-[90%] sm:max-w-[95%] mx-auto lg:space-between">
          <div className="flex flex-col items-center justify-between p-4 border-b border-gray-200 w-full md:flex-row">
            {cartItems && cartItems.length > 0 ? (
              <div className="flex flex-col items-center justify-between my-4 w-full md:w-1/2">
                <div className="flex flex-col items-start justify-between w-full">
                  <h1 className="text-2xl font-semibold p-4">Cart</h1>
                </div>

                {cartItems.map((item, idx) => {
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between w-full border-b border-gray-200 p-4"
                    >
                      <div className="flex items-center">
                        <Image
                          src={`http://localhost:4000/public/${item.product.imagepath}`}
                          alt={item.product.title}
                          width={100}
                          height={100}
                        />
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold">
                            {item.product.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Price: ${item.product.price}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          removeFromCart(item.product).then(() => {
                            getCart().then((data) => {
                              setCartItems(data.products);
                              showMessage("Removed from cart", "", "success");
                              window.location.reload();
                            });
                          });
                        }}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-96">
                <h3 className="text-lg font-semibold">Cart is empty</h3>
              </div>
            )}
            <div className="flex flex-col justify-center pb-4 w-full items-start md:w-1/3">
              <h1 className="text-3xl font-semibold p-4">Summary</h1>
              <div className="flex flex-row items-center justify-between w-full border-b border-gray-200 py-4">
                <h1 className="text-lg text-blue-500 px-4">
                  Add a giftcard or discount code
                </h1>
              </div>
              <div className="flex flex-row items-center justify-between w-full px-4 mt-2">
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
                  <h3 className="text-md text-gray-500">
                    ${(total * 0.1).toFixed(2)}
                  </h3>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between w-full border-b border-gray-200 p-4">
                <h3 className="text-lg">Total</h3>
                <h3 className="text-lg font-semibold">
                  ${(total + 10 + total * 0.1).toFixed(2)}
                </h3>
              </div>
              <Link href="/checkout" className="w-full">
                <button className="bg-black text-white p-4 rounded-lg mt-4 w-full">
                  Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
