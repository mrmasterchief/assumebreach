"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import ShowCaseContainer from "@/components/container/ShowCaseContainer";
import { getProductDetail, getProductsByCategory } from "@/hooks/products";
import { useCSRFToken } from "@/context/useCSRFToken";
import { useParams } from "next/navigation";

export default function ProductDetails() {
  const [isProductInfoOpen, setIsProductInfoOpen] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isShippingReturnsOpen, setIsShippingReturnsOpen] = useState(false);
  const params = useParams();
  const productID = Array.isArray(params?.productID)
    ? params.productID[0]
    : params?.productID;
  const [activeOptions, setActiveOptions] = useState({});
  const { isCsrfTokenSet } = useCSRFToken();
  const [productDetails, setProductDetails] = useState({
    id: "",
    title: "",
    categories: [],
    description: "",
    price: "",
    discountprice: "",
    imagepath: "",
    options: [],
    material: "",
    country_of_origin: "",
    type: "",
    weight: "",
    dimensions: "",
  });

  const toggleProductInfo = () => setIsProductInfoOpen(!isProductInfoOpen);

  const toggleShippingReturns = () => setIsShippingReturnsOpen(!isShippingReturnsOpen);

  useEffect(() => {
    if (!isCsrfTokenSet) return;
    getProductDetail(productID || "").then((response) => {
      setProductDetails(response);
    });

  }, [params.productID, isCsrfTokenSet]);

  useEffect(() => {
    if (!isCsrfTokenSet || productDetails.title === "") return;
    getProductsByCategory(productDetails?.categories[0] || "").then((response) => {
      const filteredResponse = response.filter(
        (product: { id: string }) => product.id !== productDetails.id
      );
      setRecommendedProducts(filteredResponse.slice(0, 3));
    });
  }, [productDetails, isCsrfTokenSet]);

  return (
    <div className="flex flex-col xl:w-[1440px] xl:mx-auto">
      <div className="relative w-full align-center justify-center">
        <div className="content-container flex flex-col lg:flex-row lg:items-start py-6 relative xs:max-w-[90%] sm:max-w-[95%] mx-auto lg:space-between">
          <div className="flex flex-col lg:sticky lg:top-48 lg:py-0 lg:max-w-[300px] w-full py-8 gap-y-6 max-h-[100vh]">
            <div id="product-info">
              <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
                <Link
                  className="text-medium text-[#4b5563]hover:text-[#323840]"
                  href={`/products?category=${productDetails?.categories[0]}`}
                >
                  {productDetails?.categories[0] || "Category"}
                </Link>
                <h2 className="font-sans font-medium h2-core text-3xl leading-10 text-ui-fg-base">
                  {productDetails?.title || "Product Title"}
                </h2>
                <p className="font-normal font-sans txt-medium text-[#4b5563]">
                  {productDetails?.description || "Product description"}
                </p>
              </div>
            </div>
            <div className="w-full">
              <div data-orientation="vertical">
                <div className="border-grey-20 group border-t last:mb-0 last:border-b py-3">
                  <h3 className="px-1" onClick={toggleProductInfo}>
                    <div className="flex flex-col">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-4">
                          <p className="font-normal font-sans txt-medium text-[#4b5563] text-lg">
                            Product Information
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-expanded={isProductInfoOpen}
                          className="relative p-[6px] transition-transform duration-300"
                        >
                          <div className="max-h-5 max-w-5 flex items-center justify-center">
                            <Icon
                              icon="bi:plus"
                              className={`transition-opacity duration-300 absolute inset-0 ${
                                isProductInfoOpen
                                  ? "opacity-0 rotate-45"
                                  : "opacity-100 "
                              }`}
                            />
                            <Icon
                              icon="bi:dash"
                              className={`transition-opacity duration-300 absolute inset-0 ${
                                isProductInfoOpen
                                  ? "opacity-100"
                                  : "opacity-0 rotate-45"
                              }`}
                            />
                          </div>
                        </button>
                      </div>
                    </div>
                  </h3>
                  <div
                    className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                      isProductInfoOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="w-full">
                      <div className="text-lg-regular py-8">
                        <div className="grid grid-cols-2 gap-x-8">
                          <div className="flex flex-col gap-y-4">
                            <div>
                              <span className="font-semibold">Material</span>
                              <p>
                                {productDetails?.material || "-"}
                              </p>
                            </div>
                            <div>
                              <span className="font-semibold">
                                Country of origin
                              </span>
                              <p>
                                {productDetails?.country_of_origin ||
                                  "-"}
                              </p>
                            </div>
                            <div>
                              <span className="font-semibold">Type</span>
                              <p>{productDetails?.type || "-"}</p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-y-4">
                            <div>
                              <span className="font-semibold">Weight</span>
                              <p>
                                {productDetails?.weight || "-"}
                              </p>
                            </div>
                            <div>
                              <span className="font-semibold">Dimensions</span>
                              <p>
                                {productDetails?.dimensions || "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-grey-20 group border-t last:mb-0 last:border-b py-3">
                  <h3 className="px-1" onClick={toggleShippingReturns}>
                    <div className="flex flex-col">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-4">
                          <p className="font-normal font-sans txt-medium text-[#4b5563] text-lg">
                            Shipping &amp; Returns
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-expanded={isShippingReturnsOpen}
                          className="relative p-[6px] transition-transform duration-300"
                        >
                          <div className="max-h-5 max-w-5 flex items-center justify-center">
                            <Icon
                              icon="bi:plus"
                              className={`transition-opacity duration-300 absolute inset-0 ${
                                isShippingReturnsOpen
                                  ? "opacity-0 rotate-45"
                                  : "opacity-100 "
                              }`}
                            />
                            <Icon
                              icon="bi:dash"
                              className={`transition-opacity duration-300 absolute inset-0 ${
                                isShippingReturnsOpen
                                  ? "opacity-100"
                                  : "opacity-0 rotate-45"
                              }`}
                            />
                          </div>
                        </button>
                      </div>
                    </div>
                  </h3>
                  <div
                    className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                      isShippingReturnsOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="w-full">
                      <div className="text-lg-regular py-8">
                        <div className="grid grid-cols-2 gap-x-8">
                          <div className="flex flex-col gap-y-4">
                            <div className="flex flex-row gap-x-4">
                              <Icon
                                icon="bi:truck"
                                className="text-lg-regular"
                                width={24}
                                height={24}
                              />
                              <div className="flex flex-col gap-y-2">
                                <span className="font-semibold">Shipping</span>
                                <p>Free shipping on orders over $50</p>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-row gap-x-4">
                                <Icon
                                  icon="bi:arrow-return-right"
                                  className="text-lg-regular"
                                  width={24}
                                  height={24}
                                />
                                <div className="flex flex-col gap-y-2">
                                  <span className="font-semibold">Returns</span>
                                  <p>Free returns within 30 days</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="block w-full relative px-4">
            <div className="flex items-center relative">
              <div className="flex flex-col flex-1 lg:mx-16 gap-y-4">
                <div className="flex-1 lg:w-full px-4">
                  <div
                    className="rounded-lg px-8 pb-8 pt-6 relative aspect-[29/34] w-full overflow-hidden bg-[#f9fafb]
                    2xl:w-[660px] 2xl:max-h-[800px] align-center justify-center flex shadow-md border border-gray-200"
                  >
                    <Image
                      src={`http://localhost:4000/public/${productDetails?.imagepath}` || "/blender.webp"}
                      alt="Product image 1"
                      width={1000}
                      height={1000}
                      className="absolute inset-0 rounded-rounded object-cover object-center"
                      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:sticky lg:top-48 lg:py-0 lg:max-w-[300px] w-full py-8 gap-y-12">
            <div className="flex flex-col gap-y-2">

                     <div className="flex flex-row gap-x-2">
                      <h1 className={`font-sans font-medium h1-core text-4xl leading-10`}> 
                        From 
                      </h1>
                      <div className="flex flex-col gap-y-2">
                      <h1 className={`font-sans font-medium h1-core text-4xl leading-10 ${productDetails.discountprice ? 'line-through' : ''}`}> 
                        ${productDetails.price}
                      </h1>
                      {productDetails.discountprice && (
                        <h1 className={`font-sans font-medium h1-core text-4xl leading-10 text-[#094EBE]`}> 
                          ${productDetails.discountprice}
                        </h1>
                      )}
                      </div>
                      

                      {/* {productDetails?.options?.map((option : any) => (
                        <div key={option.id}>
                          <span className="text-sm">{option.title}</span>
                          <div className="flex flex-wrap justify-between gap-2">
                            {option.values.map((value:any) => (
                              <button
                                key={value.id}
                                className="border-ui-border-base bg-ui-bg-subtle border text-lg-regular h-10 rounded-rounded p-2 flex-1 hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150"
                              >
                                {value.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))} */}
                    </div>

              
              <div className="flex flex-col gap-y-4">
                <button
                  type="button"
                  className="flex items-center bg-black px-4 py-2 rounded-lg text-white align-center justify-center"
                >
                  Add to Cart
                </button>
              </div>
              <div className="lg:hidden inset-x-0 bottom-0 fixed pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center text-center mb-16 mt-40">
        <span className="text-base text-gray-600 mb-6">Related products</span>
        <p className="text-2xl max-w-lg">
          You might also want to check out these products.
        </p>
      </div>
      <ShowCaseContainer type="related" data={recommendedProducts} />
    </div>
  );
}
