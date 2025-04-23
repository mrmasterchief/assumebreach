/* eslint-disable @typescript-eslint/no-unused-vars */
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
  variant: string;
}


const CartItemComponent = ({
  item,
  onRemove,
  onUpdateCartQuantity,
}: {
  item: CartItem;
  onRemove: (productID: string) => void;
  onUpdateCartQuantity: (product: string, quantity: number) => void;
}) => (

  <div className="flex items-center justify-between w-full border-b border-gray-200 py-4 pr-4">
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center w-[28%]">
        <Link className="rounded-lg relative overflow-hidden bg-[#f7f8f9] aspect-[1/1] shadow-md w-[100px] h-[100px] group justify-center items-center flex" href={`/products/${item.product.id}`}>
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_ROUTE}/public${item.product.imagepath}`}
            alt={item.product.title}
            width={100}
            height={100}
          />
        </Link>
        <div className="ml-4">
          <h3 className="text-lg"> 
            {item.product.title.length > 12
              ? item.product.title.slice(0, 12) + "..."
              : item.product.title}
          </h3>
          <p className="text-gray-500 text-sm">Variant: {item.variant}</p>
        </div>
      </div>
      <div className="flex flex-col">
        <h3 className={`text-lg ${item.product.discountprice ? 'line-through' : ''}`}>${item.product.price}</h3>
        {item.product.discountprice && (
        <p className="text-blue-700 text-lg">${item.product.discountprice}</p>
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <FormControl variant="standard" sx={{ scale: "0.8" }}>
          <Select
            value={item.quantity.toString()}
            onChange={async (e: SelectChangeEvent) => {
              const newQuantity = parseInt(e.target.value);
              if (newQuantity > 0) {
                onUpdateCartQuantity(item.product.id, newQuantity);
              } else {
                onRemove(item.product.id);
              }
            }
            }

          >
            {[...Array(10)].map((_, index) => (
              <MenuItem key={index} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Icon
          icon="material-symbols:remove-shopping-cart"
          className="text-gray-600 cursor-pointer"
          width="20"
          height="20"
          onClick={() => onRemove(item.product.id)}
        />
       
      </div>
      <h3 className="text-lg font-semibold">
        ${(item.product.calculatedPrice * item.quantity).toFixed(2)}
      </h3>

    </div>
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
        ${(total + total * 0.1).toFixed(2)}
      </h3>
    </div>
    <Link href="/cart/checkout" className="w-full">
      <button className="bg-black text-white p-3 rounded-lg mt-4 w-full hover:bg-gray-800 transition duration-200">
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
          const totalPrice = results[0].reduce((sum: number, item: CartItem) => {
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

  const handleRemoveFromCart = async (productID: string) => {
    try {
      const cartResponse = await removeFromCart(productID, localStorage.getItem("unsafeID") || "");
      if(cartResponse.flag) {
        showMessage("You have found a flag!", cartResponse.flag, "success");
        return;
      }
      const data = await getCart();
      setCartItems(data.products || []);
      setTotal(
        data.products?.reduce(
          (sum: number, item: CartItem) =>
            sum + item.product.calculatedPrice * item.quantity,
          0
        ) || 0
      );
      showMessage("Removed from cart", "", "success");
    } catch (error) {
      console.error("Error removing from cart:", error);
      setError("Failed to remove item from cart. Please try again later.");
    }
  };

  const handleUpdateCartQuantity = async (productID: string, quantity: number) => {
    try {
      await updateCartQuantity(productID, quantity);
      const data = await getCart();
      setCartItems(data || []);
      for (let i = 0; i < data.length; i++) {
        if (data[i].product.discountprice) {
          data[i].product.calculatedPrice = data[i].product.discountprice;
        }
        else {
          data[i].product.calculatedPrice = data[i].product.price;
        }
      }
      setTotal(
        data.reduce(
          (sum: number, item: CartItem) =>
            sum + item.product.calculatedPrice * item.quantity,
          0
        ) || 0
      );
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      setError("Failed to update cart quantity. Please try again later.");
    }
  };


  if (isLoading) {
    return <div>Loading cart...</div>;
  }


  return (
    <div className="flex flex-col w-[95%] xl:mx-auto">
      <div className="relative w-full align-center justify-center">
        <div className="content-container flex flex-col lg:flex-row lg:items-start py-6 relative xs:max-w-[95%] sm:max-w-[100%] mx-auto lg:space-between">
          <div className="flex flex-col items-center justify-between p-4 w-full md:flex-row">
            {cartItems.length > 0 ? (
              <div className="flex flex-col items-center justify-between my-4 w-full md:w-3/5">
                <div className="flex flex-col items-start justify-between w-full">
                  <h1 className="text-2xl font-semibold mb-4">Cart</h1>
                </div>
                <div className="flex flex-row items-center justify-between w-full border-b border-gray-200">
                  <h3 className="text-lg p-4 w-[30%]">Product</h3>
                  <h3 className="text-lg p-4">Price</h3>
                  <h3 className="text-lg p-4">Quantity</h3>
                  <h3 className="text-lg p-4">Total</h3>
                </div>
                {cartItems.map((item) => (
                  <CartItemComponent
                    key={item.product.title}
                    item={item}
                    onRemove={() => handleRemoveFromCart(item.product.id)}
                    onUpdateCartQuantity={handleUpdateCartQuantity}
                  />
                ))}
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
            {cartItems.length > 0 && <CartSummary total={total} />}{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
