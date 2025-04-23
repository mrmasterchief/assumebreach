/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import Multiselect from "multiselect-react-dropdown";
import { CATEGORIES } from "@/constants";
import { Icon } from "@iconify/react";
import { createProduct } from "@/hooks/products";

interface ProductFormValues {
  title: string;
  description: string;
  price: string;
  discountPrice: string;
  file: File | null;
  categories: { name: string; id: string }[];
  information: {
    material: string;
    countryOfOrigin: string;
    type: string;
    weight: string;
    dimensions: string;
  };
  options?: string[];
}

const ProductForm = ({
  setFormActive,
  formType
}: {
  setFormActive: (active: boolean) => void;
  formType: "cms" | "admin";
}) => {
  const initialValues: ProductFormValues = {
    title: "",
    description: "",
    price: "",
    discountPrice: "",
    file: null,
    categories: [],
    information: {
      material: "",
      countryOfOrigin: "",
      type: "",
      weight: "",
      dimensions: "",
    },
    options: [],
  };
  const [isVisible, setIsVisible] = useState(false);

  const selectOptions = CATEGORIES.map((category) => {
    return { name: category, id: category };
  });

  const toggleForm = () => {
    setIsVisible(!isVisible);
    setTimeout(() => {
      setFormActive(false);
    }, 300);
  };

  const handleSubmit = async (values: ProductFormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("discountPrice", values.discountPrice);

    if (values.file) {
      formData.append("file", values.file);
    }
    formData.append(
      "categories",
      JSON.stringify(values.categories.map((category) => category.name))
    );
    formData.append("options", JSON.stringify(values.options));
    formData.append("information", JSON.stringify(values.information));

    try {
      const endpoint = formType === "cms" ? "/cms/product" : "/admin/product";
      const response = await createProduct(formData, endpoint);

      if (response.status !== 200) {
        throw new Error("Error creating product");
      }

      const data = response.data;
      toggleForm();
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${
        isVisible ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300 ease-in-out align-center justify-center flex`}
    >
      <div className="w-full h-full align-center justify-center flex flex-col">
        <div className="flex flex-row justify-between w-[70%] mx-auto bg-white p-4 rounded-lg">
          <h2 className="text-xl mb-4">Create Product</h2>
          <button onClick={() => toggleForm()} className="p-2 rounded-lg">
            <Icon
              icon="ant-design:close-outlined"
              width="16"
              height="16"
              color="black"
            />
          </button>
        </div>

        <div className="flex flex-col space-y-4">
          <Formik
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              handleSubmit(values);
              setSubmitting(false);
            }}
          >
            {({ setFieldValue, values }) => (
              <Form className="space-y-4 mt-5">
                <div className="flex flex-row w-[70%] mx-auto justify-between">
                  <div className="bg-white p-4 rounded shadow-md w-[45%] flex flex-col space-y-4">
                    <h1 className="text-xl">Standard Product Information</h1>
                    <div className="flex flex-col">
                      <label htmlFor="title">Title</label>
                      <Field
                        id="title"
                        name="title"
                        type="text"
                        className="border p-2 rounded"
                        placeholder="Product Title"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="description">Description</label>
                      <Field
                        id="description"
                        name="description"
                        type="text"
                        className="border p-2 rounded"
                        placeholder="Product Description"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="price">Price</label>
                      <Field
                        id="price"
                        name="price"
                        type="text"
                        className="border p-2 rounded"
                        placeholder="Product Price"
                        min="0"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="discountPrice">Discount Price</label>
                      <Field
                        id="discountPrice"
                        name="discountPrice"
                        type="text"
                        className="border p-2 rounded"
                        placeholder="Product Discount Price (Optional)"
                        min="0"
                      />
                    </div>
                    <div>
                      <label>Categories</label>
                      <Multiselect
                        options={selectOptions}
                        displayValue="name"
                        selectedValues={values.categories}
                        onSelect={(selectedList: { name: string; id: string }[] | null[]
                        ) =>
                          setFieldValue("categories", selectedList)
                        }
                        onRemove={(selectedList: 
                          { name: string; id: string }[] | null[]
                        ) =>
                          setFieldValue("categories", selectedList)
                        }
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="file">Image</label>
                      <input
                        id="file"
                        name="file"
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          if (event.currentTarget.files) {
                            setFieldValue("file", event.currentTarget.files[0]);
                          }
                        }}
                        className="border p-2 rounded"
                      />
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded shadow-md w-[45%] flex flex-col space-y-4">
                    <h1 className="text-xl">Additional Product Information</h1>
                    <div className="flex flex-col">
                      <label htmlFor="material">Material</label>
                      <Field
                        id="material"
                        name="information.material"
                        type="text"
                        className="border p-2 rounded"
                        placeholder="Product Material"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="countryOfOrigin">Country of Origin</label>
                      <Field
                        id="countryOfOrigin"
                        name="information.countryOfOrigin"
                        type="text"
                        className="border p-2 rounded"
                        placeholder="Product Country of Origin"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="type">Type</label>
                      <Field
                        id="type"
                        name="information.type"
                        type="text"
                        className="border p-2 rounded"
                        placeholder="Product Type"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="weight">Weight</label>
                      <Field
                        id="weight"
                        name="information.weight"
                        type="text"
                        className="border p-2 rounded"
                        placeholder="Product Weight"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="dimensions">Dimensions</label>
                      <Field
                        id="dimensions"
                        name="information.dimensions"
                        type="text"
                        className="border p-2 rounded"
                        placeholder="Product Dimensions"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="options">Options</label>
                      <Field
                        id="options"
                        name="options"
                        type="text"
                        className="border p-2 rounded"
                        placeholder="Format: Color:Red,Blue;Size:Small,Large"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-black text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
