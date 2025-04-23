/* eslint-disable @typescript-eslint/no-explicit-any */

import { axiosInstance } from "./axios";

export const getAllProducts = async (page: number) => {
  const response = await axiosInstance.get(`/cms/all-products/${page}`);
  return response.data;
};

export const getAllProductsDummy = async (page: number) => {
  const response = await axiosInstance.get(`/admin/all-products/${page}`);
  return response.data;
};

export const getProductDetail = async (id: string) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

export const getProductsByCategory = async (category: string) => {
  const response = await axiosInstance.get(`/products/category/${category}`);
  return response.data;
};

export const searchProducts = async (query: string) => {
  const response = await axiosInstance.get(`/products/search/?query=${query}`);
  return response.data;
};

export const createProduct = async (product: FormData, endpoint: string) => {
  const response = await axiosInstance.post(endpoint, product, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};
export const updateProduct = async (id: string, product: any) => {
  const response = await axiosInstance.put(`/cms/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await axiosInstance.delete(`/cms/product/${id}`);
  return response.data;
};
