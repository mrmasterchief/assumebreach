"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ShowCaseContainer from "@/components/container/ShowCaseContainer";
import { getProductDetail, getProductsByCategory } from "@/hooks/products";
import { useParams } from "next/navigation";
import { addToCart } from "@/hooks/cart";
import { Product } from "@/ProductTypes";
import { useCart } from "@/context/CartContext";
import ContentContainer from "@/components/content-container";
import { indexFunction } from "@/hooks";
import {
  ProductSection,
  ProductInfoContent,
  ShippingReturnsContent,
} from "@/components/products/productDetail";

export default function ProductDetails() {
  const [isProductInfoOpen, setIsProductInfoOpen] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isShippingReturnsOpen, setIsShippingReturnsOpen] = useState(false);
  const params = useParams();
  const productID = Array.isArray(params?.productID)
    ? params.productID[0]
    : params?.productID;
  const { toggleCart } = useCart();
  const [productDetails, setProductDetails] = useState<Product>({
    id: "",
    title: "",
    price: "",
    discountprice: "",
    description: "",
    imagepath: "",
    categories: [],
    options: [],
    material: "",
    country_of_origin: "",
    type: "",
    weight: "",
    dimensions: "",
  });

  const toggleProductInfo = () => setIsProductInfoOpen(!isProductInfoOpen);
  const toggleShippingReturns = () =>
    setIsShippingReturnsOpen(!isShippingReturnsOpen);

  useEffect(() => {
    if (!productID) return;
    getProductDetail(productID).then(setProductDetails);
  }, [productID]);

  useEffect(() => {
    if (!productDetails.categories.length) return;
    getProductsByCategory(productDetails.categories[0]).then((response) => {
      const filteredResponse = response.filter(
        (product: Product) => product.id !== productDetails.id
      );
      setRecommendedProducts(filteredResponse.slice(0, 3));
    });
  }, [productDetails]);

  return (
    <ContentContainer>
      <div className="relative w-full align-center justify-center">
        <div className="content-container flex flex-col lg:flex-row lg:items-start py-6 relative mx-auto lg:space-between">
          <div className="flex flex-col lg:sticky lg:top-48 lg:py-0 lg:max-w-[250px] w-full py-8 max-h-[100vh]">
            <div id="product-info">
              <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
                <Link
                  className="text-medium text-[#4b5563] hover:text-[#323840]"
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
            <div className="flex flex-col mt-5 lg:max-w-[500px] mx-auto">
            <ProductSection
              title="Product Information"
              content={<ProductInfoContent productDetails={productDetails} />}
              isOpen={isProductInfoOpen}
              toggle={toggleProductInfo}
            />
            <ProductSection
              title="Shipping &amp; Returns"
              content={<ShippingReturnsContent />}
              isOpen={isShippingReturnsOpen}
              toggle={toggleShippingReturns}
            />
            </div>
            
          </div>
          <div className="block w-full relative px-4">
            <div className="flex items-center relative">
              <div className="flex flex-col flex-1 lg:mx-16 gap-y-4">
                <div className="flex-1 lg:w-full px-4">
                  <div className="rounded-lg px-8 pb-8 pt-6 relative aspect-[29/34] w-full overflow-hidden bg-[#f9fafb] 2xl:w-[660px] 2xl:max-h-[800px] align-center justify-center flex shadow-md border border-gray-200">
                    <Image
                      src={
                        `http://localhost:4000/public/${productDetails?.imagepath}` ||
                        "/blender.webp"
                      }
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

          <div className="flex flex-col lg:sticky lg:top-48 lg:py-0 lg:max-w-[250px] w-full py-8 gap-y-12">
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-row gap-x-2">
                <h1
                  className={`font-sans font-medium h1-core text-4xl leading-10`}
                >
                  From
                </h1>
                <div className="flex flex-col gap-y-2">
                  <h1
                    className={`font-sans font-medium h1-core text-4xl leading-10 ${
                      productDetails.discountprice ? "line-through" : ""
                    }`}
                  >
                    ${productDetails.price}
                  </h1>
                  {productDetails.discountprice && (
                    <h1
                      className={`font-sans font-medium h1-core text-4xl leading-10 text-[#094EBE]`}
                    >
                      ${productDetails.discountprice}
                    </h1>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-4">
              <button
                type="button"
                className="flex items-center bg-black px-4 py-2 rounded-lg text-white align-center justify-center"
                onClick={async () => {
                  await indexFunction(
                    [
                  () => addToCart(productDetails),
                  async () => toggleCart()
                    ],
                    () => {
                    },
                    true
                  );
                }}
              >
                Add to Cart
              </button>
            </div>
            <div className="lg:hidden inset-x-0 bottom-0 fixed pointer-events-none"></div>
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
    </ContentContainer>
  );
}
