"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import ShowCaseContainer from "@/components/container/ShowCaseContainer";

export default function ProductDetails({
  params,
}: {
  params: { productID: string };
}) {
  const [isProductInfoOpen, setIsProductInfoOpen] = useState(false);
  const [isShippingReturnsOpen, setIsShippingReturnsOpen] = useState(false);
  const [activeOptions, setActiveOptions] = useState({});
  const [productDetails, setProductDetails] = useState({
    id: "",
    title: "",
    category: "",
    description: "",
    price: "",
    image: "",
    options: [],
    information: {
      material: "",
      countryOfOrigin: "",
      type: "",
      weight: "",
      dimensions: "",
    },
  });

  const toggleProductInfo = () => setIsProductInfoOpen(!isProductInfoOpen);

  const toggleShippingReturns = () =>
    setIsShippingReturnsOpen(!isShippingReturnsOpen);

  return (
    <div className="flex flex-col xl:w-[1440px] xl:mx-auto">
      <div className="relative w-full align-center justify-center">
        <div className="content-container flex flex-col lg:flex-row lg:items-start py-6 relative xs:max-w-[90%] sm:max-w-[95%] mx-auto lg:space-between">
          <div className="flex flex-col lg:sticky lg:top-48 lg:py-0 lg:max-w-[300px] w-full py-8 gap-y-6 max-h-[100vh]">
            <div id="product-info">
              <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
                <Link
                  className="text-medium text-[#4b5563]hover:text-[#323840]"
                  href={`/products?category=${productDetails?.category}`}
                >
                  {productDetails?.category || "Category"}
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
                                {productDetails?.information?.material || "-"}
                              </p>
                            </div>
                            <div>
                              <span className="font-semibold">
                                Country of origin
                              </span>
                              <p>
                                {productDetails?.information?.countryOfOrigin ||
                                  "-"}
                              </p>
                            </div>
                            <div>
                              <span className="font-semibold">Type</span>
                              <p>{productDetails?.information?.type || "-"}</p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-y-4">
                            <div>
                              <span className="font-semibold">Weight</span>
                              <p>
                                {productDetails?.information?.weight || "-"}
                              </p>
                            </div>
                            <div>
                              <span className="font-semibold">Dimensions</span>
                              <p>
                                {productDetails?.information?.dimensions || "-"}
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
                      src={productDetails?.image || "/blender.webp"}
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
              <div>
                <div className="flex flex-col gap-y-4">
                  <div>
                    <div className="flex flex-col gap-y-3">
                      <span className="text-sm">Select Color</span>
                      <div className="flex flex-wrap justify-between gap-2">
                        <button className="border-ui-border-base bg-ui-bg-subtle border text-lg-regular h-10 rounded-rounded p-2 flex-1 hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150">
                          Black
                        </button>
                        <button className="border-ui-border-base bg-ui-bg-subtle border text-lg-regular h-10 rounded-rounded p-2 flex-1 hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150">
                          Silver
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-col gap-y-3">
                      <span className="text-sm">Select Noise Cancelling</span>
                      <div className="flex flex-wrap justify-between gap-2">
                        <button className="border-ui-border-base bg-ui-bg-subtle border text-lg-regular h-10 rounded-rounded p-2 flex-1 hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150">
                          ANC
                        </button>
                        <button className="border-ui-border-base bg-ui-bg-subtle border text-lg-regular h-10 rounded-rounded p-2 flex-1 hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150">
                          None
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="h-px w-full border-b border-gray-200 mt-1"></div>
                </div>
              </div>
              <div className="flex flex-col text-ui-fg-base">
                <span className="text-xl-semi">
                  From {productDetails?.price || "$199.99"}
                </span>
              </div>
              <button className="transition-fg relative inline-flex items-center justify-center overflow-hidden rounded-md outline-none disabled:border-ui-border-base disabled:text-ui-fg-disabled disabled:shadow-buttons-neutral disabled:after:hidden after:transition-fg after:absolute after:inset-0 after:content-[''] shadow-buttons-inverted text-ui-fg-on-inverted bg-ui-button-inverted after:button-inverted-gradient hover:bg-ui-button-inverted-hover hover:after:button-inverted-hover-gradient active:bg-ui-button-inverted-pressed active:after:button-inverted-pressed-gradient focus:!shadow-buttons-inverted-focus txt-compact-lg-plus gap-x-1.5 px-3 py-1.5 w-full h-10">
                Select variant
              </button>
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
      <ShowCaseContainer type="related" />
    </div>
  );
}
