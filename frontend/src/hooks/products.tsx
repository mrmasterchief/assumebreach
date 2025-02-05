import { axiosInstance } from "./axios";

export const getAllProducts = async () => {
  const response = await axiosInstance.get("/cms/all");
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
  const response = await axiosInstance.get(`/products/search/${query}`);
  return response.data;
};

export const createProduct = async (product: any) => {
  const response = await axiosInstance.post("/cms", product);
  return response.data;
};

export const updateProduct = async (id: string, product: any) => {
  const response = await axiosInstance.put(`/cms/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await axiosInstance.delete(`/cms/${id}`);
  return response.data;
};
