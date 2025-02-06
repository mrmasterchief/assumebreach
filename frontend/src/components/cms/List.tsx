import React, { act, useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import {
  searchProducts,
  deleteProduct,
  updateProduct,
  getAllProducts,
} from "@/hooks/products";
const List = ({ props }: { props: any }) => {
  const [formActive, setFormActive] = useState(false);


  const [formType, setFormType] = useState("create");

  return (
    <div className="flex flex-col">
      {formActive && <ProductForm setFormActive={setFormActive} />}
      <div className="flex justify-center gap-4 flex-row">
        <input
          type="text"
          value={props.search}
          onChange={(e) => props.setSearch(e.target.value)}
          placeholder="Search..."
          className="border border-gray-300 rounded-lg p-2"
        />
        <button
          className="flex items-center bg-black px-4 py-2 rounded-lg text-white"
          onClick={() => setFormActive(!formActive)}
        >
          Add Item
        </button>
      </div>
      <div className="flex justify-center my-4">
        <span>
          Page {props.listPage} of {props.pages}
        </span>
      </div>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => props.setListPage(props.listPage - 1)}
          disabled={props.listPage === 1}
          className="flex items-center bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => props.setListPage(props.listPage + 1)}
          disabled={props.listPage === props.pages || props.pages === 0}
          className="flex items-center bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <ul className="list-none">
        {props.data.map(
          (item: {
            id: any;
            title: string;
            description: string;
            price: number;
            quantity: number;
            categories: string[];
            imagepath: string;
          }) => (
            (
                <div className="flex flex-row gap-4 border border-gray-300 p-4 rounded-lg my-4">
              <li
                key={item.id}
                className="flex flex-row "
              >
                <div className="flex flex-col">
                  <span>{item.id}</span>
                  <span className="font-semibold">{item.title}</span>
                  <span>{item.price}</span>
                  <span>Quantity: {item.quantity}</span>
                  <span>{item.categories.join(", ")}</span>
                </div>
                <div className="flex flex-col w-[50px] h-[50px] ">
                  <img
                    src={`http://localhost:4000/public${item.imagepath}`}
                    alt={item.title}
                  />
                </div>
              </li>
                <div className="flex justify-center gap-4">
                    <button
                    className="flex items-center bg-black px-4 py-2 rounded-lg text-white"
                    onClick={() => {
                        setFormActive(true);
                        setFormType("update");
                    }}
                    >
                    Edit
                    </button>
                    <button
                    className="flex items-center bg-black px-4 py-2 rounded-lg text-white"
                    onClick={() => deleteProduct(item.id)}
                    >
                    Delete
                    </button>
                </div>
            </div>
            )
          )
        )}
      </ul>
    </div>
  );
};

export default List;
