import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { removeFromCart } from "@/hooks/cart";
import { Icon } from "@iconify/react/dist/iconify.js";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
const Cart = ({
  toggleCart,
  isCartOpen,
  cartItems,
}: {
  toggleCart: () => void;
  isCartOpen: boolean;
  cartItems: { product: { id:string; imagepath: string; title: string; price: number }; quantity: number }[];
}) => {
  const [isVisible, setIsVisible] = useState(false);
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
    if (cartElement) {
      cartElement.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (cartElement) {
        cartElement.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [toggleCart]);

  useEffect(() => {
      setIsVisible(true);
    
  }, []);

  return (
    <>
      <div
        ref={cartRef}
        className={`absolute w-[400px] bg-white top-[80px] right-15 z-50 rounded-b-lg border transition-all duration-300 ${
          isVisible ? "opacity-100 max-h-[500px] h-[300px]" : "opacity-0 max-h-0"
        } ${isVisible ? "block" : "hidden"}`}
      >
        <div className="p-4 flex items-center justify-center">
          <h3 className="text-large title-font font-semibold">Cart</h3>
        </div>
        {cartItems && cartItems?.length > 0 ? (

        <div className="flex flex-col items-center justify-between my-4">
            {cartItems.map((item, idx) => {
              return (
                <Link
                  href={`/products/${item.product.id}`}
                  key={idx}
                  className="flex flex-row items-center justify-between w-[90%] p-4 border-b border-gray-200"
                >
                  <div className="flex flex-row items-center gap-4">
                    <div className="flex relative w-16 h-16">
                      <img
                        src={`http://localhost:4000/public/${item.product.imagepath}`}
                        alt="product"
                        className="object-cover object-center w-full h-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-base font-semibold">{item.product.title}</p>
                      <p className="text-base font-normal text-gray-400">
                        {item.product.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-base font-semibold">{item.quantity}</span>
                  </div>
                  <button
                    className="text-red-500"
                    onClick={() => {
                      removeFromCart(item.product);
                      window.location.reload();

                    }}
                  >
                    <DeleteOutlineIcon style={{color:'black'}} />
                  </button>
                </Link>
              );
            })}
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
 
    </>
  );
};

export default Cart;
