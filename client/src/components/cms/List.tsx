import React, { useState } from "react";
import ProductForm from "./ProductForm";
import {
  deleteProduct,
  getAllProducts,
} from "@/hooks/products";

const List = ({ props }: { props: any }) => {
  const [formActive, setFormActive] = useState(false);
  const [formType, setFormType] = useState("create");

  return (
    <div className="flex flex-col w-full max-w-[1440px] mx-auto p-6">
      {formActive && <ProductForm setFormActive={setFormActive} />}
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Product List</h2>
        <button
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          onClick={() => {
            setFormActive(!formActive);
            setFormType("create");
          }}
        >
          Add Item
        </button>
      </div>

      <div className="flex justify-center items-center mb-4 text-gray-600">
        <span>
          Page {props.listPage} of {props.pages}
        </span>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => props.setListPage(props.listPage - 1)}
          disabled={props.listPage === 1}
          className="bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
        >
          Previous
        </button>
        <button
          onClick={() => props.setListPage(props.listPage + 1)}
          disabled={props.listPage === props.pages || props.pages === 0}
          className="bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
        >
          Next
        </button>
      </div>

      <ul className="space-y-4">
        {props.data.map((item: any) => (
          <li
            key={item.id}
            className="flex justify-between items-start border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex flex-col gap-1 text-sm">
              <span className="text-gray-500">ID: {item.id}</span>
              <span className="text-xl font-semibold">{item.title}</span>
              <span className="text-gray-800 font-medium">${item.price}</span>
              <span className="text-gray-600">Quantity: {item.quantity}</span>
              <span className="text-gray-600">
                Categories: {item.categories.join(", ")}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                onClick={() => {
                  setFormActive(true);
                  setFormType("update");
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                onClick={() => {
                  deleteProduct(item.id).then(() =>
                    getAllProducts(props.listPage)
                  );
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
