"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/hooks/axios";
import { showMessage } from "@/components/messages/Message";
import { getCart, removeFromCart } from "@/hooks/cart";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { indexFunction } from "@/hooks";
import { getUserInfo } from "@/hooks/user";

interface CartItem {
  product: {
    id: string;
    imagepath: string;
    title: string;
    price: number;
  };
  quantity: number;
}

const CartItemComponent = ({
  item,
  onRemove,
}: {
  item: CartItem;
  onRemove: (product: any) => void;
}) => (
  <div className="flex items-center justify-between w-full border-b border-gray-200 p-4">
    <div className="flex items-center">
      <Image
        src={`http://localhost:4000/public/${item.product.imagepath}`}
        alt={item.product.title}
        width={100}
        height={100}
      />
      <div className="ml-4">
        <h3 className="text-lg font-semibold">{item.product.title}</h3>
        <p className="text-sm text-gray-500">Price: ${item.product.price}</p>
        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
      </div>
    </div>
    <button onClick={() => onRemove(item.product)} className="text-red-500">
      Remove
    </button>
  </div>
);

const CartSummary = ({ total }: { total: number }) => (
  <div className="flex flex-col justify-center pb-4 w-full items-start md:w-1/3">
    <h1 className="text-3xl font-semibold p-4">Summary</h1>
    <div className="flex flex-row items-center justify-between w-full border-b border-gray-200 py-4">
      <h1 className="text-lg text-blue-500 px-4 cursor-pointer">
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
        <h3 className="text-md text-gray-500">${(total * 0.1).toFixed(2)}</h3>
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
);

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const checkAuth = async () => {
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
    };

    const fetchCart = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getCart();
        if (data.length > 0) {
          setCartItems(data);
        } else if (data.length === 0) {
          setCartItems([]);
          setTotal(0);
        } else {
          setCartItems([]);
          setTotal(0);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError("Failed to load cart. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    fetchCart();
  }, []);

  const handleRemoveFromCart = async (product: any) => {
    try {
      await removeFromCart(product);
      const data = await getCart();
      setCartItems(data.products || []);
      setTotal(
        data.products?.reduce(
          (sum: number, item: CartItem) =>
            sum + item.product.price * item.quantity,
          0
        ) || 0
      );
      showMessage("Removed from cart", "", "success");
    } catch (error) {
      console.error("Error removing from cart:", error);
      setError("Failed to remove item from cart. Please try again later.");
    }
  };

  if (isLoading) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col xl:w-[1440px] xl:mx-auto">
      <div className="relative w-full align-center justify-center">
        <div className="content-container flex flex-col lg:flex-row lg:items-start py-6 relative xs:max-w-[90%] sm:max-w-[95%] mx-auto lg:space-between">
          <div className="flex flex-col items-center justify-between p-4 border-b border-gray-200 w-full md:flex-row">
            {cartItems.length > 0 ? (
              <div className="flex flex-col items-center justify-between my-4 w-full md:w-1/2">
                <div className="flex flex-col items-start justify-between w-full">
                  <h1 className="text-2xl font-semibold p-4">Cart</h1>
                </div>
                {cartItems.map((item) => (
                  <CartItemComponent
                    key={item.product.title}
                    item={item}
                    onRemove={() => handleRemoveFromCart(item.product)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-96">
                <h3 className="text-lg font-semibold">Cart is empty</h3>
              </div>
            )}
            {cartItems.length > 0 && <CartSummary total={total} />}{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
