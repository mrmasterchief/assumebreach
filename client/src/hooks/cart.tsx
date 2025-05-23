/* eslint-disable @typescript-eslint/no-explicit-any */

import { axiosInstance } from "./axios";

export const getCart = async () => {
  try {
    const response = await axiosInstance.get("/cart");
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
};

export const addToCart = async (product: object, quantity?: number, variant?: string) => {
  try {
    const response = await axiosInstance.post("/cart/add", {
        product: product,
        quantity: quantity || 1,
        variant: variant
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

export const removeFromCart = async (productID: string, unsafeID: string) => {
  try {
    const response = await axiosInstance.post("/cart/remove", {
      productID: productID,
      unsafeID: unsafeID,
    });
    return response.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
  }
};

export const updateCartQuantity = async (productID: string, quantity: number) => {
  try {
    const response = await axiosInstance.post("/cart/new-quantity", {
      productID: productID,
      quantity: quantity
    });
    return response.data;
  } catch (error) {
    console.error("Error updating cart quantity:", error);
  }
}

export const checkout = async (cartItems: any) => {
  try {
    const response = await axiosInstance.post("/cart/checkout", {
      cartItems: cartItems
    });
    return response.data;
  } catch (error) {
    console.error("Error during checkout:", error);
  }
}

export const fetchOrders = async () => {
  try {
    const response = await axiosInstance.get("/cart/orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
}

export const fetchOrderDetails = async (orderID: string) => {
  try {
    const response = await axiosInstance.post('/cart/orders/', {
      orderID: orderID
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching order details:", error);
  }
}