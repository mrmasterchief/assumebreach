import React from "react";

export default function ProductDetails({ params}: { params: { productID: string } }) {

  const { productID } = params;
  return (
    <div className="bg-slate-500 w-96 text-center my-20 p-10 mx-20">
      <h1>
        The Product ID is <b>{productID}</b>   
      </h1>
    </div>
  );
};

