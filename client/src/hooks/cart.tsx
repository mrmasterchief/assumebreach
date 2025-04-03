import { axiosInstance } from "./axios";

export const getCart = async () => {
  try {
    const response = await axiosInstance.get("/cart");
    console.log("Cart response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
};

export const addToCart = async (product: {}, quantity?: number) => {
  try {
    const response = await axiosInstance.post("/cart/add", {
        product: product,
        quantity: quantity || 1,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

export const removeFromCart = async (product: {}) => {
  try {
    const response = await axiosInstance.post("/cart/remove", {
      product: product
    });
    return response.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
  }
};
