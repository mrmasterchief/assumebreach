import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { removeFromCart } from "@/hooks/cart";
import { Icon } from "@iconify/react/dist/iconify.js";
import { indexFunction } from "@/hooks";
import { showMessage } from "../messages/Message";

const Cart = ({
  toggleCart,
  isCartOpen,
  cartItems,
}: {
  toggleCart: () => void;
  isCartOpen: boolean;
  cartItems: {
    product: {
      id: string;
      imagepath: string;
      title: string;
      price: number;
      discountprice: number;
    };
    quantity: number;
    variant: string;
  }[];
}) => {
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseLeave = (event: MouseEvent) => {
      if (
        cartRef.current &&
        !cartRef.current.contains(event.relatedTarget as Node)
      ) {
        toggleCart();
      }
    };
  
    const cartElement = cartRef.current;
  
    if (isCartOpen && cartElement) {
      cartElement.addEventListener("mouseleave", handleMouseLeave);
    }
  
    return () => {
      if (cartElement) {
        cartElement.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isCartOpen, toggleCart]);

  const handleRemoveFromCart = async (productId: string) => {
    const unsafeID = localStorage.getItem("unsafeID") || "";
    if (!unsafeID) {
      showMessage(
        "Error",
        "You are not logged in. Please log in to remove items from your cart.",
        "error"
      );
      return;
    }
    await indexFunction(
      [
        () => removeFromCart(productId, unsafeID),
      ],
      (results) => {
        if (!results[0]) return;
        if (results[0].flag) {
          showMessage(
            "You have found a flag!",
            results[0].flag,
            "success"
          );
        }
      },
      true 
    );
  };
  



  return (
    <div
      ref={cartRef}
      className={`
        absolute right-50 w-[420px] bg-white top-[70px] z-50 rounded-b-lg border shadow-lg origin-top transition-all duration-300 ease-in-out
        overflow-hidden
      ${isCartOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
      `}
      style={{ transformOrigin: "top center" }}
    >
      <div className="pb-0 pt-4 flex items-start justify-center">
        <h3 className="text-large title-font font-semibold">Cart</h3>
      </div>
      {cartItems && cartItems?.length > 0 ? (
        <div className="flex flex-col items-center w-full">

          {cartItems.map((item, idx) => {
            if (idx > 1) return null;
            return (
              <div className="flex flex-row w-[95%] justify-between items-center py-4" key={idx}>
                <div className="flex flex-row gap-4">
                  <Link
                    className="rounded-lg relative overflow-hidden bg-[#f7f8f9] aspect-[1/1] shadow-md w-[100px] h-[100px] group justify-center items-center flex"
                    href={`/products/${item.product.id}`}
                    key={idx}
                  >
                    <img
                      src={`/api/public${item.product.imagepath}`}
                      alt="product"
                      className="object-center w-full object-cover"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <p className="text-md">
                      {item.product.title.length > 10
                        ? item.product.title.slice(0, 10) + "..."
                        : item.product.title}
                    </p>

                    <p className="text-gray-700 text-md">Variant: {item.variant}</p>
                    <p className="text-sm">Quantity: {item.quantity}</p>
                    <div className="flex flex-row items-center mt-2 gap-1" onClick={(e) => e.stopPropagation()}>
                      <Icon onClick={() => [handleRemoveFromCart(item.product.id), toggleCart()]} className="text-gray-600 cursor-pointer" icon="material-symbols:remove-shopping-cart" width="20" height="20" />
                      <p
                        className="text-sm text-gray-600 cursor-pointer"
                        onClick={() => [handleRemoveFromCart(item.product.id),
                          toggleCart()]
                        }
                      >
                        Remove
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-md font-semibold text-gray-800 self-start">
                  {item.product.discountprice ? (
                    <span>
                      $
                      {(item.product.discountprice * item.quantity).toFixed(2)}
                    </span>
                  ) : (
                    <span>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  )}
                </p>
              </div>
            );
          })}
          <div className="flex flex-row items-center justify-between w-[95%]">
            <p className="text-sm">
              <strong>Subtotal</strong> (excl. taxes):
            </p>
            <p className="text-sm font-semibold">
              $
              {cartItems
                .reduce((acc, item) => {
                  const price = item.product.discountprice
                    ? item.product.discountprice
                    : item.product.price;
                  return acc + price * item.quantity;
                }, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="flex flex-row items-center justify-between w-[95%] mt-4">
            <Link
              href="/cart"
              className="flex items-center justify-center bg-black text-white p-2 rounded-lg w-[100%] hover:bg-gray-800 transition duration-300 mb-2"
            >
              <span className="text-white text-center">Go to Cart</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 pb-[80px]">
          <p className="text-base font-small">Your shopping bag is empty.</p>
          <Link
            href="/products"
            className="flex items-center justify-center bg-black text-white p-2 rounded-lg w-[50%] mt-4"
          >
            <span className="text-white text-center">Explore Products</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
