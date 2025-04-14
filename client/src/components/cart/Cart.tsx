import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { removeFromCart } from "@/hooks/cart";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

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
      discountPrice: number;
    };
    quantity: number;
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
    if (cartElement) {
      cartElement.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (cartElement) {
        cartElement.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [toggleCart]);



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
            return (
              <div className="flex flex-row w-[95%] justify-between items-center py-4" key={idx}>
                <div className="flex flex-row gap-4">
                  <Link
                    className="rounded-lg relative overflow-hidden bg-[#f7f8f9] aspect-[1/1] shadow-md w-[100px] h-[100px] group justify-center items-center flex"
                    href={`/products/${item.product.id}`}
                    key={idx}
                  >
                    <img
                      src={`http://localhost:4000/public/${item.product.imagepath}`}
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

                    <p className="text-gray-700 text-md">Variant: test</p>
                    <p className="text-sm">Quantity: {item.quantity}</p>
                    <div className="flex flex-row items-center mt-2 gap-1" onClick={(e) => e.stopPropagation()}>
                      <RemoveCircleOutlineIcon
                        className="text-gray-600"
                        fontSize="small"
                        onClick={() => removeFromCart(item.product.id)}
                      />
                      <p
                        className="text-sm text-gray-600 cursor-pointer"
                        onClick={() => [removeFromCart(item.product),
                          toggleCart()]
                        }
                      >
                        Remove
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-md font-semibold text-gray-800 self-start">
                  {item.product.discountPrice ? (
                    <span>
                      $
                      {(item.product.discountPrice * item.quantity).toFixed(2)}
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
                  const price = item.product.discountPrice
                    ? item.product.discountPrice
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
